import { getListingBySlugOrId, getListings, type ListingShape } from "@/app/data/listings";
import Image from "next/image";
import "../../../components/styles/listings.css";
import ListingGallery from "@/components/ListingGallery";
import { MapPin, Maximize, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Footer from '@/components/Footer';
import ContactAgentForm from "@/components/ContactAgentForm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function MoreListings({ current, listings }: { current: string; listings: any[] }) {
  const isImageUrl = (url?: string) =>
    typeof url === "string" && /\.(jpg|jpeg|png|webp|avif)$/i.test(url);

  return (
    <section className="more-listings">
      <div className="section-heading">
        <h3>More Available Listings</h3>
      </div>

      <div className="more-grid">
        {listings
          .filter((l) => l.id !== current)
          .map((l) => {
            const href = `/listings/${l.slug ?? l.id}`;
            const thumb =
              l.cover_image_url ||
              (Array.isArray(l.images) ? l.images.find(isImageUrl) : null) ||
              "/placeholder.jpg";

            return (
              <Link key={l.id} href={href} className="card">
                <Image src={thumb} alt={l.title ?? ""} width={320} height={200} />
                <h4>{l.title ?? "Untitled listing"}</h4>
                <p>{l.location ?? "Location unavailable"}</p>
                <p className="card-price">{l.price ?? "Price on request"}</p>
              </Link>
            );
          })}
      </div>
    </section>
  );
}

function NewsHub() {
  return (
    <section className="news-hub">
      <div className="section-heading">
        <h3>Luxury Real Estate News</h3>
      </div>

      <div className="scroll-row">
        {["Market Trends", "Investment Insights", "Luxury Developments"].map((news, i) => (
          <div key={i} className="news-card">
            <h4>{news}</h4>
            <p>Read more</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function inferUniqueFeatures(description?: string | null): string[] {
  if (!description) return [];
  const text = description.toLowerCase();
  const checks: Array<[RegExp, string]> = [
    [/bio[\s-]?tank/, "Bio tank waste system"],
    [/sliding[\s-]?gate/, "Automated sliding gate"],
    [/open[\s-]?(plan|kitchen)/, "Open kitchen concept"],
    [/cctv|surveillance/, "Integrated CCTV security"],
    [/solar/, "Solar power support"],
    [/backup\s?(generator|power)/, "Backup power supply"],
    [/borehole/, "Borehole water supply"],
    [/perimeter\s?wall/, "Secured perimeter wall"],
    [/gated/, "Gated community setting"],
    [/dsq|servant/, "Staff quarter / DSQ"],
  ];

  return checks.filter(([pattern]) => pattern.test(text)).map(([, label]) => label);
}

function buildAllFeatures(listing: ListingShape, uniqueFeatures: string[]): string[] {
  const baseFeatures = [
    listing.bedrooms ? `${listing.bedrooms} bedrooms` : null,
    listing.bathrooms ? `${listing.bathrooms} bathrooms` : null,
    listing.washrooms ? `${listing.washrooms} washrooms` : null,
    listing.buildingArea ? `Building area: ${listing.buildingArea}` : null,
    listing.landSize ? `Land size: ${listing.landSize}` : null,
    listing.location ? `Location: ${listing.location}` : null,
  ].filter(Boolean) as string[];

  return [...baseFeatures, ...uniqueFeatures];
}

export default async function ListingDetails({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  if (!slug || slug === "undefined") {
    return <p>Bad route param: slug is missing.</p>;
  }

  const [listing, allListings] = await Promise.all([getListingBySlugOrId(slug), getListings()]);

  if (!listing) return <p>Listing not found</p>;
  const uniqueFeatures = inferUniqueFeatures(listing.description);
  const featuredHighlights =
    uniqueFeatures.length > 0
      ? uniqueFeatures
      : ["Open kitchen concept", "Secure gated entry", "Private bio tank system"];
  const allFeatures = buildAllFeatures(listing, featuredHighlights);

  return (
    <>
      <Navbar />

      <div className="listing-shell">
        <div className="listing-topbar">
          <div className="listing-search">
            <Search className="search-icon" />
            <input type="text" placeholder="Search by location, property type, or price" />
          </div>
        </div>

        <section className="listing-section listing-section-gallery">
          <ListingGallery images={listing.images} />
        </section>

        <section className="listing-section">
          <div className="details-grid">
            <article className="details-main">
              <h1>{listing.title}</h1>

              <div className="details-meta">
                <div className="meta-line">
                  <MapPin className="meta-icon" />
                  <span>{listing.location}</span>
                </div>

                <p className="price">
                  <span>Price</span>
                  {listing.price}
                </p>
              </div>

              <div className="details-copy">
                <h3>Description</h3>
                <p>{listing.description}</p>
              </div>

              <div className="features-card ">
                <h3>Key Features</h3>
                <div className="key-features-grid">
                  {featuredHighlights.map((feature) => (
                    // eslint-disable-next-line react/jsx-key
                    <div className="feature-item">
                      <div className="feature-icon-wrap">
                        <Maximize className="feature-icon" />
                      </div>
                      <span className="text-black">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="listing-section">

              <div className="all-features">
            <div className="div-heading">
              <h3>All Features</h3>
            </div>
            <div className="all-features-grid">
              {allFeatures.map((feature) => (
                <div key={feature} className="all-feature-item">
                  {feature}
                </div>
              ))}
            </div>
          </div>
          </div>
            </article>

            <aside className="details-sidebar">
              <ContactAgentForm
                listingTitle={listing.title ?? "this property"}
                listingId={listing.id}
              />
            </aside>
          </div>
        </section>

        <section className="listing-section">
          <MoreListings current={listing.id} listings={allListings} />
        </section>

        <section className="listing-section">
          <NewsHub />
        </section>
      </div>
            <Footer/>
    </>
  );
}
