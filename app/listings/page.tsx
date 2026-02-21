"use client";

import "@/components/styles/listings-index.css";
import Navbar from "@/components/ListingsNavbar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Bed,
  Bath,
  MapPin,
  Search,
  ArrowUpDown,
  SlidersHorizontal,
} from "lucide-react";
import Footer from "@/components/Footer";

const APP_BOOT_TS = Date.now();

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

type SortMode =
  | "newest"
  | "title_asc"
  | "title_desc"
  | "price_asc"
  | "price_desc"
  | "status_asc"
  | "status_desc";

type DateRange = "all" | "7" | "30" | "90" | "365";

function parsePriceToNumber(price?: string | null) {
  if (!price) return Number.NaN;
  const p = price.toUpperCase().replace(/KES|\s|,/g, "");
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
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("listings")
        .select(
          "id,slug,title,location,price,bedrooms,bathrooms,cover_image_url,status,created_at"
        );

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

  const locationOptions = useMemo(() => {
    return Array.from(
      new Set(listings.map((l) => (l.location ?? "").trim()).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b));
  }, [listings]);

  const statusOptions = useMemo(() => {
    return Array.from(
      new Set(
        listings
          .map((l) => (l.status ?? "").trim().toLowerCase())
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [listings]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const days = dateRange === "all" ? null : Number(dateRange);
    const min = minPrice.trim() ? Number(minPrice) : null;
    const max = maxPrice.trim() ? Number(maxPrice) : null;

    const base = listings.filter((l) => {
      const t = (l.title ?? "").toLowerCase();
      const loc = (l.location ?? "").toLowerCase();
      const p = (l.price ?? "").toLowerCase();
      const status = (l.status ?? "").toLowerCase();
      const numericPrice = parsePriceToNumber(l.price);

      const matchesQuery = !q || t.includes(q) || loc.includes(q) || p.includes(q);
      const matchesStatus = selectedStatus === "all" || status === selectedStatus;
      const matchesLocation =
        selectedLocation === "all" || (l.location ?? "").trim() === selectedLocation;

      const matchesPriceMin =
        min === null ? true : !Number.isNaN(numericPrice) && numericPrice >= min;
      const matchesPriceMax =
        max === null ? true : !Number.isNaN(numericPrice) && numericPrice <= max;

      const created = l.created_at ? new Date(l.created_at).getTime() : 0;
      const matchesDateRange =
        days === null ||
        (created > 0 && created >= APP_BOOT_TS - days * 24 * 60 * 60 * 1000);

      return (
        matchesQuery &&
        matchesStatus &&
        matchesLocation &&
        matchesPriceMin &&
        matchesPriceMax &&
        matchesDateRange
      );
    });

    const sorted = [...base];

    if (sortMode === "newest") {
      sorted.sort((a, b) => {
        const da = a.created_at ? new Date(a.created_at).getTime() : 0;
        const db = b.created_at ? new Date(b.created_at).getTime() : 0;
        return db - da;
      });
    }

    if (sortMode === "title_asc") {
      sorted.sort((a, b) => (a.title ?? "").localeCompare(b.title ?? ""));
    }

    if (sortMode === "title_desc") {
      sorted.sort((a, b) => (b.title ?? "").localeCompare(a.title ?? ""));
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

    if (sortMode === "status_asc") {
      sorted.sort((a, b) => (a.status ?? "").localeCompare(b.status ?? ""));
    }

    if (sortMode === "status_desc") {
      sorted.sort((a, b) => (b.status ?? "").localeCompare(a.status ?? ""));
    }

    return sorted;
  }, [
    listings,
    query,
    sortMode,
    selectedStatus,
    selectedLocation,
    dateRange,
    minPrice,
    maxPrice,
  ]);

  return (
    <>
      <Navbar />

      <div className="listings-page">
        <header className="listings-header">
          <div className="listings-header-inner">
            <div className="listings-titleblock">
              <p className="listings-eyebrow">Inventory</p>
              <h1 className="listings-title">Available Listings</h1>
              <p className="listings-subtitle">
                Browse current stock. Use search, filters and sort to move fast.
              </p>
            </div>

            <div className="listings-controls">
              <div className="searchbox">
                <Search className="searchbox-icon" />
                <input
                  className="text-black"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by location, title, price..."
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
                  <option value="title_asc">Title: A to Z</option>
                  <option value="title_desc">Title: Z to A</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="status_asc">Status: A to Z</option>
                  <option value="status_desc">Status: Z to A</option>
                </select>
              </div>

              <button
                type="button"
                className={`filter-toggle ${showFilters ? "active" : ""}`}
                onClick={() => setShowFilters((prev) => !prev)}
              >
                <SlidersHorizontal className="filter-toggle-icon" />
                Filters
              </button>

              <div className="results-pill" aria-live="polite">
                {loading ? "Loading..." : `${filtered.length} found`}
              </div>
            </div>

            {showFilters && (
              <div className="listings-filters-panel">
                <div className="filter-field">
                  <label htmlFor="status-filter">Status</label>
                  <select
                    id="status-filter"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="all">All statuses</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-field">
                  <label htmlFor="location-filter">Location</label>
                  <select
                    id="location-filter"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option value="all">All locations</option>
                    {locationOptions.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-field">
                  <label htmlFor="date-filter">Date range</label>
                  <select
                    id="date-filter"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value as DateRange)}
                  >
                    <option value="all">All time</option>
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last 12 months</option>
                  </select>
                </div>

                <div className="filter-field">
                  <label htmlFor="min-price-filter">Min price</label>
                  <input
                    id="min-price-filter"
                    type="number"
                    min="0"
                    placeholder="e.g. 5000000"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>

                <div className="filter-field">
                  <label htmlFor="max-price-filter">Max price</label>
                  <input
                    id="max-price-filter"
                    type="number"
                    min="0"
                    placeholder="e.g. 50000000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="clear-filters-btn"
                  onClick={() => {
                    setSelectedStatus("all");
                    setSelectedLocation("all");
                    setDateRange("all");
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </header>

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
            <div className="state state-loading">Loading listings...</div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="state state-empty">
              No matching listings.
              <div className="state-hint">
                Try a broader search or clear some filters.
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
                const statusClass = (l.status ?? "unknown").toLowerCase();

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
                      <span className={`status-badge-card ${statusClass}`}>
                        {l.status ?? "unknown"}
                      </span>
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
                          <span>{l.bedrooms ?? "--"} Beds</span>
                        </div>
                        <div className="meta-item">
                          <Bath className="icon" />
                          <span>{l.bathrooms ?? "--"} Baths</span>
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
      <Footer />
    </>
  );
}
