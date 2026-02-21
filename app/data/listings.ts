import { supabase } from "@/lib/supabaseClient";

export type ListingShape = {
  id: string;                 // slug/id used in route
  title: string;
  price: string | null;
  country?: string;           // not in DB right now (optional)
  location: string | null;
  description: string | null;

  // Optional fields (only if your DB has them)
  coordinates?: { lat: number; lng: number } | null;
  bedrooms: number | null;
  bathrooms: number | null;
  washrooms?: number | null;  // not in DB right now (optional)
  buildingArea?: string | null;
  landSize?: string | null;

  images: string[];           // gallery URLs (images/videos)
  slug?: string | null;       // keep for debugging
};

type DbListing = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  location: string | null;
  price: string | null;
  bedrooms: number | null;
  bathrooms: number | null;

  // storage + media
  media_bucket: string;       // default 'Listings Images'
  media_prefix: string;
  cover_image_url: string | null;
};

type DbMedia = {
  bucket: string;             // default 'Listings Images'
  object_path: string;        // 'folder/file.jpg'
  kind: "image" | "video";
  sort_order: number;
  is_cover: boolean;
};

// Converts storage path into a usable public URL.
// If your bucket is private, you’ll need signed URLs instead.
function publicUrl(bucket: string, objectPath: string) {
  return supabase.storage.from(bucket).getPublicUrl(objectPath).data.publicUrl;
}

// If cover_image_url is already a full URL, keep it.
// If it looks like a storage object path, convert it.
function normalizeCoverUrl(listing: DbListing) {
  const cover = listing.cover_image_url;
  if (!cover) return null;

  // Heuristic: if it starts with http(s), it's already a URL.
  if (/^https?:\/\//i.test(cover)) return cover;

  // Otherwise treat as storage object_path
  return publicUrl(listing.media_bucket ?? "Listings Images", cover);
}

/**
 * Fetch all available listings (index page use).
 * Returns the old "listings.ts array shape" so your UI stays the same.
 */

export async function getListings(): Promise<ListingShape[]> {
  const { data, error } = await supabase
    .from("listings")
    .select(
      "id,slug,title,description,location,price,bedrooms,bathrooms,media_bucket,media_prefix,cover_image_url"
    )
    .eq("status", "available");

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as DbListing[];

  // Pull media in a single query for all listings (faster than N+1).
  const ids = rows.map((r) => r.id);
  let mediaByListing: Record<string, DbMedia[]> = {};

  if (ids.length) {
    const { data: mediaRows, error: mErr } = await supabase
      .from("listing_media")
      .select("listing_id,bucket,object_path,kind,sort_order,is_cover")
      .in("listing_id", ids)
      .order("sort_order", { ascending: true });

    if (!mErr && mediaRows) {
      mediaByListing = mediaRows.reduce((acc: Record<string, DbMedia[]>, m: unknown) => {
        const media = m as DbMedia & { listing_id: string };
        (acc[media.listing_id] ||= []).push(media);
        return acc;
      }, {});
    }
  }

  return rows.map((l) => {
    const media = mediaByListing[l.id] ?? [];

    // Build gallery URLs: prefer listing_media, fallback to cover_image_url if no rows.
    const images =
      media.length > 0
        ? media.map((m) => publicUrl(m.bucket, m.object_path))
        : normalizeCoverUrl(l)
          ? [normalizeCoverUrl(l)!]
          : [];

    return {
      id: l.slug ?? l.id, // route param uses slug if present, else id
      slug: l.slug,
      title: l.title,
      price: l.price,
      location: l.location,
      description: l.description,
      bedrooms: l.bedrooms,
      bathrooms: l.bathrooms,
      images,
    };
  });
}

/**
 * Fetch one listing for /listings/[slug]
 * Looks up by slug first, then by id.
 */
export async function getListingBySlugOrId(slugOrId: string): Promise<ListingShape | null> {
  // 1) slug lookup
  let { data, error } = await supabase
    .from("listings")
    .select(
      "id,slug,title,description,location,price,bedrooms,bathrooms,media_bucket,media_prefix,cover_image_url"
    )
    .eq("slug", slugOrId)
    .maybeSingle();

  // 2) fallback: id lookup
  if (!data && !error) {
    const res = await supabase
      .from("listings")
      .select(
        "id,slug,title,description,location,price,bedrooms,bathrooms,media_bucket,media_prefix,cover_image_url"
      )
      .eq("id", slugOrId)
      .maybeSingle();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data = res.data as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error = res.error as any;
  }

  if (error) throw new Error(error.message);
  if (!data) return null;

  const l = data as DbListing;

  // Load ordered gallery
  const { data: mediaRows, error: mErr } = await supabase
    .from("listing_media")
    .select("bucket,object_path,kind,sort_order,is_cover")
    .eq("listing_id", l.id)
    .order("sort_order", { ascending: true });

  if (mErr) throw new Error(mErr.message);

  const media = (mediaRows ?? []) as DbMedia[];

  const images =
    media.length > 0
      ? media.map((m) => publicUrl(m.bucket, m.object_path))
      : normalizeCoverUrl(l)
        ? [normalizeCoverUrl(l)!]
        : [];

  return {
    id: l.slug ?? l.id,
    slug: l.slug,
    title: l.title,
    price: l.price,
    location: l.location,
    description: l.description,
    bedrooms: l.bedrooms,
    bathrooms: l.bathrooms,
    images,
  };
}