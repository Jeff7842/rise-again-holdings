import { supabase } from "@/lib/supabaseClient";

export type MediaKind = "image" | "video";

export type ListingMediaRow = {
  id: string;
  bucket?: string | null;
  object_path?: string | null;
  storage_path?: string | null;
  kind?: string | null;
  type?: string | null;
  sort_order?: number | null;
  is_cover?: boolean | null;
  url?: string | null;
};

export type ListingWithMedia = {
  id: string;
  slug?: string | null;
  title?: string | null;
  location?: string | null;
  price?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  status?: string | null;
  created_at?: string | null;
  cover_image_url?: string | null;
  images?: string[] | null;
  listing_media?: ListingMediaRow[] | null;
};

const IMAGE_RE = /\.(jpg|jpeg|png|webp|avif|gif|bmp|svg)(\?|#|$)/i;
const VIDEO_RE = /\.(mp4|mov|webm|mkv|avi|wmv|m4v)(\?|#|$)/i;

export function isImageUrl(url?: string | null) {
  return !!url && IMAGE_RE.test(url);
}

export function isVideoUrl(url?: string | null) {
  return !!url && VIDEO_RE.test(url);
}

export function normalizeKind(kind?: string | null, url?: string | null): MediaKind {
  const raw = String(kind ?? "").toLowerCase().trim();
  if (raw.includes("video")) return "video";
  if (raw.includes("image") || raw.includes("photo") || raw.includes("img")) return "image";
  return isVideoUrl(url) ? "video" : "image";
}

export function buildPublicUrl(bucket?: string | null, objectPath?: string | null) {
  if (!bucket || !objectPath) return null;
  return supabase.storage.from(bucket).getPublicUrl(objectPath).data.publicUrl;
}

export function normalizeListingMedia(listing: ListingWithMedia) {
  const rows = [...(listing.listing_media ?? [])]
    .sort((a, b) => (a.sort_order ?? 9999) - (b.sort_order ?? 9999))
    .map((row) => {
      const url =
        row.url ||
        buildPublicUrl(row.bucket, row.object_path ?? row.storage_path) ||
        null;

      return {
        id: row.id,
        kind: normalizeKind(row.kind ?? row.type, url),
        url,
        isCover: !!row.is_cover,
      };
    })
    .filter((row) => !!row.url) as Array<{
      id: string;
      kind: MediaKind;
      url: string;
      isCover: boolean;
    }>;

  const imageFromRows = rows.find((m) => m.isCover && m.kind === "image")?.url
    ?? rows.find((m) => m.kind === "image")?.url
    ?? null;

  const videoFromRows = rows.find((m) => m.isCover && m.kind === "video")?.url
    ?? rows.find((m) => m.kind === "video")?.url
    ?? null;

  const imageFromArray = Array.isArray(listing.images)
    ? listing.images.find((url) => isImageUrl(url)) ?? null
    : null;

  const videoFromArray = Array.isArray(listing.images)
    ? listing.images.find((url) => isVideoUrl(url)) ?? null
    : null;

  const coverIsImage = isImageUrl(listing.cover_image_url);
  const coverIsVideo = isVideoUrl(listing.cover_image_url);

  const primaryImage =
    (coverIsImage ? listing.cover_image_url : null) ||
    imageFromRows ||
    imageFromArray ||
    null;

  const primaryVideo =
    (coverIsVideo ? listing.cover_image_url : null) ||
    videoFromRows ||
    videoFromArray ||
    null;

  return {
    media: rows,
    imageUrls: rows.filter((m) => m.kind === "image").map((m) => m.url),
    videoUrls: rows.filter((m) => m.kind === "video").map((m) => m.url),
    thumbnail: primaryImage || primaryVideo || "/placeholder.jpg",
    thumbnailKind: primaryImage ? "image" : primaryVideo ? "video" : "image",
    coverImageUrl: primaryImage,
    hasVideo: !!primaryVideo || rows.some((m) => m.kind === "video"),
  };
}