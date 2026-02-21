"use client";

import "@/components/styles/listings-index.css";
import Navbar from "@/components/ListingsNavbar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Bed, Bath, MapPin, Search, ArrowUpDown } from "lucide-react";
import Footer from '@/components/Footer';

type DbListing = {
  id: string;
  slug: string | null;
  title: string | null;
  location: string | null;
  price: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  cover_image_url: string | null;
  status: string | null;
  created_at?: string | null;
};

type SortMode = "newest" | "price_asc" | "price_desc";

function parsePriceToNumber(price?: string | null) {
  // Handles "KES 14.5M", "27M", "14,500,000", etc. Best-effort.
  if (!price) return Number.NaN;
  const p = price.toUpperCase().replace(/KES|\s|,/g, "");
  // 14.5M -> 14500000
  const m = p.match(/^([0-9]*\.?[0-9]+)M$/);
  if (m) return parseFloat(m[1]) * 1_000_000;
  const k = p.match(/^([0-9]*\.?[0-9]+)K$/);
  if (k) return parseFloat(k[1]) * 1_000;
  const n = p.match(/^([0-9]*\.?[0-9]+)$/);
  if (n) return parseFloat(n[1]);
  return Number.NaN;
}

export default function ListingsIndexPage() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<DbListing[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError(null);

      // IMPORTANT:
      // Adjust table name/column names to match your Supabase schema.
      // Assumed table: "listings"
      // Assumed status: "available"
      const { data, error } = await supabase
        .from("listings")
        .select(
          "id,slug,title,location,price,bedrooms,bathrooms,cover_image_url,status,created_at"
        )
        .eq("status", "available");

      if (!alive) return;

      if (error) {
        setError(error.message);
        setListings([]);
      } else {
        setListings((data ?? []) as DbListing[]);
      }

      setLoading(false);
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const base = !q
      ? listings
      : listings.filter((l) => {
          const t = (l.title ?? "").toLowerCase();
          const loc = (l.location ?? "").toLowerCase();
          const p = (l.price ?? "").toLowerCase();
          return t.includes(q) || loc.includes(q) || p.includes(q);
        });

    const sorted = [...base];

    if (sortMode === "newest") {
      sorted.sort((a, b) => {
        const da = a.created_at ? new Date(a.created_at).getTime() : 0;
        const db = b.created_at ? new Date(b.created_at).getTime() : 0;
        return db - da;
      });
    }

    if (sortMode === "price_asc") {
      sorted.sort((a, b) => {
        const pa = parsePriceToNumber(a.price);
        const pb = parsePriceToNumber(b.price);
        if (Number.isNaN(pa) && Number.isNaN(pb)) return 0;
        if (Number.isNaN(pa)) return 1;
        if (Number.isNaN(pb)) return -1;
        return pa - pb;
      });
    }

    if (sortMode === "price_desc") {
      sorted.sort((a, b) => {
        const pa = parsePriceToNumber(a.price);
        const pb = parsePriceToNumber(b.price);
        if (Number.isNaN(pa) && Number.isNaN(pb)) return 0;
        if (Number.isNaN(pa)) return 1;
        if (Number.isNaN(pb)) return -1;
        return pb - pa;
      });
    }

    return sorted;
  }, [listings, query, sortMode]);

  return (
    <>
      <Navbar />

      <div className="listings-page">
        {/* Header */}
        <header className="listings-header">
          <div className="listings-header-inner">
            <div className="listings-titleblock">
              <p className="listings-eyebrow">Inventory</p>
              <h1 className="listings-title">Available Listings</h1>
              <p className="listings-subtitle">
                Browse current stock. Use search + sort to move fast.
              </p>
            </div>

            {/* Controls */}
            <div className="listings-controls">
              <div className="searchbox">
                <Search className="searchbox-icon" />
                <input
                className="text-black"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by location, title, price…"
                  aria-label="Search listings"
                />
              </div>

              <div className="sortbox">
                <ArrowUpDown className="sortbox-icon" />
                <select
                className="text-black"
                  value={sortMode}
                  onChange={(e) => setSortMode(e.target.value as SortMode)}
                  aria-label="Sort listings"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                </select>
              </div>

              <div className="results-pill" aria-live="polite">
                {loading ? "Loading…" : `${filtered.length} found`}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="listings-content">
          {error && (
            <div className="state state-error">
              <strong>Supabase error:</strong> {error}
              <div className="state-hint">
                Check your table name/columns and env vars.
              </div>
            </div>
          )}

          {loading && !error && (
            <div className="state state-loading">Loading available listings…</div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="state state-empty">
              No matching available listings.
              <div className="state-hint">
                Try a broader search (e.g. “Ruiru”, “KES”, “4-bedroom”).
              </div>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <section className="listings-grid" aria-label="Available listings">
              {filtered.map((l) => {
                const title = l.title ?? "Untitled listing";
                const location = l.location ?? "Location not set";
                const price = l.price ?? "Price on request";

                const href = `/listings/${l.slug ?? l.id}`;

                return (
                  <article key={l.id} className="listing-card">
                    <Link href={href} className="listing-card-media">
                      <Image
                        src={
                          l.cover_image_url ||
                          "https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Rise%20Agina%20website/Hero2.png"
                        }
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, 30vw"
                        className="listing-card-img"
                        priority={false}
                      />
                      <div className="listing-card-gradient" />
                      <div className="listing-card-price">{price}</div>
                    </Link>

                    <div className="listing-card-body">
                      <h2 className="listing-card-title">
                        <Link href={href}>{title}</Link>
                      </h2>

                      <div className="listing-card-location">
                        <MapPin className="icon" />
                        <span>{location}</span>
                      </div>

                      <div className="listing-card-meta">
                        <div className="meta-item">
                          <Bed className="icon" />
                          <span>{l.bedrooms ?? "—"} Beds</span>
                        </div>
                        <div className="meta-item">
                          <Bath className="icon" />
                          <span>{l.bathrooms ?? "—"} Baths</span>
                        </div>
                      </div>

                      <div className="listing-card-cta">
                        <Link href={href} className="btn-view">
                          View details
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          )}
        </main>
      </div>
      <Footer/>
    </>
  );
}
