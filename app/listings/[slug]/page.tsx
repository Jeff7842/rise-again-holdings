"use client";

import { useParams } from "next/navigation";
import { listings } from "../../data/listings";
import Image from "next/image";
import '../../../components/styles/listings.css'
import ListingGallery from "@/components/ListingGallery";
import {
  MapPin,
  House,
  Shield,
  Bed,
  Bath,
  Maximize,
  Megaphone,
  ChevronDown,
  ChevronUp,
  Search,
} from "lucide-react";
import Navbar from '@/components/Navbar';

function ContactAgentForm({ listing }: { listing: string }) {
  return (
    <form className="contact-form">
      <h3>Contact Agent</h3>

      <input placeholder="Your Name" required />
      <input placeholder="Country" required />
      <input type="email" placeholder="Email" required />
      <input placeholder="Phone Number" required />
      <textarea placeholder="Message" defaultValue={`I'm interested in ${listing}`} />

      {/* Preferred Contact Method */}
      <div className="form-group">
        <label className="form-label">Preferred Contact Method</label>

        <div className="contact-checkbox">
          {["phone", "Email", "whatsapp"].map(method => (
            <label key={method} className="checkbox-wrapper">
              <input type="radio" name="contactMethod" value={method} />
              <span className="checkbox-tile">
                <span className="checkbox-label">{method}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <button type="submit">Contact Agent</button>
    </form>
  );
}

function MoreListings({ current }: { current: string }) {
  return (
    <section className="more-listings">
      <h3>More Available Listings</h3>

      <div className="scroll-row">
        {listings
          .filter(l => l.id !== current)
          .map(l => (
            <a key={l.id} href={`/listings/${l.id}`} className="card">
              <Image src={l.images[0]} alt="" width={300} height={200} />
              <h4>{l.title}</h4>
              <p>{l.price}</p>
            </a>
          ))}
      </div>
    </section>
  );
}

function NewsHub() {
  return (
    <section className="news-hub">
      <h3>Luxury Real Estate News</h3>

      <div className="scroll-row">
        {["Market Trends", "Investment Insights", "Luxury Developments"].map(
          (news, i) => (
            <div key={i} className="news-card">
              <h4>{news}</h4>
              <p>Read more →</p>
            </div>
          )
        )}
      </div>
    </section>
  );
}


export default function ListingDetails() {
  const { slug } = useParams();
  const listing = listings.find(l => l.id === slug);

  if (!listing) return <p>Listing not found</p>;

  return (
    <>
        <Navbar/>
    <div className="container min-h-full pt-30">
      {/* Search Bar */}
        <div className="navbar-search mb-6">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search by location, property type, price..."
          />
        </div>

      {/* Gallery */}
      <ListingGallery images={listing.images} />

      {/* Main Grid */}
      <section className="grid">
        <div>
          <h1 className="font-bold text-4xl text-gray-900">{listing.title}</h1>
          <div className="w-full flex mb-5">
  <div className="flex items-center justify-between w-full max-w-4xl">
    
    {/* Location — LEFT */}
    <div className="flex items-center text-gray-700">
      <MapPin className="w-4 h-4 mr-2 text-red-800" />
      <span>{listing.location}</span>
    </div>

    {/* Price — RIGHT */}
    <p className="price font-semibold flex gap-2">
      <span className="ml-6 text-red-700">Price:</span>
      {listing.price}
    </p>

  </div>
</div>

          <div className="mb-6">
          <h3 className="font-bold text-lg text-red-700 mb-1">Description</h3>
          <p>{listing.description}</p>
          </div>

          <div className="bg-white relative rounded-xl border border-gray-200 p-6 mb-8 -left-1">
  <h3 className="text-lg font-semibold mb-5">Key Features</h3>


  <div className="key-features-grid">
    
    {/* Bedrooms */}
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-red-50">
        <Bed className="w-4 h-4 text-red-700" />
      </div>
      <span className="text-gray-700 text-sm">
        {listing.bedrooms} Bedrooms
      </span>
    </div>

    {/* Bathrooms */}
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-red-50">
        <Bath className="w-4 h-4 text-red-700" />
      </div>
      <span className="text-gray-700 text-sm">
        {listing.bathrooms} Bathrooms
      </span>
    </div>

    {/* Building Area */}
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-red-50">
        <Maximize className="w-4 h-4 text-red-700" />
      </div>
      <span className="text-gray-700 text-sm">
        {listing.buildingArea}
      </span>
    </div>

    {/* Land Size */}
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-red-50">
        <Maximize className="w-4 h-4 text-red-700" />
      </div>
      <span className="text-gray-700 text-sm">
        Land: {listing.landSize}
      </span>
    </div>

    {/* Washrooms (optional but premium detail) */}
    {listing.washrooms && (
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-red-50">
          <Bath className="w-4 h-4 text-red-700" />
        </div>
        <span className="text-gray-700 text-sm">
          {listing.washrooms} Washrooms
        </span>
      </div>
    )}

  </div>
</div>


          {/* Map */}
          <iframe
            src={`https://maps.google.com/maps?q=${listing.coordinates.lat},${listing.coordinates.lng}&z=14&output=embed`}
            className="map"
          />
        </div>

        {/* Contact Agent */}
        <ContactAgentForm listing={listing.title} />
      </section>

      <MoreListings current={listing.id} />
      <NewsHub />
    </div>
    </>
  );
}
