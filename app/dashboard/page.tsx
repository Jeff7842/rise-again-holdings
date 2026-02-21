// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Grid3x3, 
  List, 
  Filter, 
  Plus,
  Calendar,
  DollarSign,
  Video,
  Home,
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  Edit2,
  Trash2,
  PauseCircle,
  Search,
  X,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import Link from "next/link";

interface Listing {
  id: string;
  title: string;
  price: string | null;
  location: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  status: string;
  cover_image_url: string | null;
  created_at: string;
  has_video?: boolean;
}

interface FilterState {
  dateRange: string;
  status: string[];
  priceRange: [number, number];
  hasVideo: boolean | null;
}

export default function DashboardOverview() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'all',
    status: [],
    priceRange: [0, 100000000],
    hasVideo: null,
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('listings')
      .select(`
        *,
        listing_media (
          kind
        )
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const listingsWithVideo = data.map(listing => ({
        ...listing,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        has_video: listing.listing_media?.some((m: any) => m.kind === 'video') || false
      }));
      setListings(listingsWithVideo);
    }
    setLoading(false);
  };

  const handleDeleteListing = async (id: string) => {
    if (confirm('Are you sure you want to delete this listing?')) {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);
      
      if (!error) {
        fetchListings();
      }
    }
  };

  const handleFreezeListing = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'hidden' ? 'available' : 'hidden';
    const { error } = await supabase
      .from('listings')
        .update({ status: newStatus })
        .eq('id', id);
    
    if (!error) {
      fetchListings();
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = 
      listing.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.price?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filters.status.length === 0 || 
      filters.status.includes(listing.status);

    const priceNum = parseFloat(listing.price?.replace(/[^0-9.-]+/g, '') || '0');
    const matchesPrice = priceNum >= filters.priceRange[0] && 
      priceNum <= filters.priceRange[1];

    const matchesVideo = filters.hasVideo === null || 
      listing.has_video === filters.hasVideo;

    return matchesSearch && matchesStatus && matchesPrice && matchesVideo;
  });

  const stats = {
    totalListings: listings.length,
    activeListings: listings.filter(l => l.status === 'available').length,
    soldListings: listings.filter(l => l.status === 'sold').length,
    pendingListings: listings.filter(l => l.status === 'pending').length,
  };

  return (
    <div className="dashboard-overview">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Home size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Listings</span>
            <span className="stat-value">{stats.totalListings}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Active</span>
            <span className="stat-value">{stats.activeListings}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Pending</span>
            <span className="stat-value">{stats.pendingListings}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Sold</span>
            <span className="stat-value">{stats.soldListings}</span>
          </div>
        </div>
      </div>

      {/* Listings Management Section */}
      <div className="listings-management">
        <div className="management-header">
          <h3>Available Listings</h3>
          <div className="header-actions">
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="clear-search">
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="view-toggles">
              <button 
                className={`view-toggle ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 size={18} />
              </button>
              <button 
                className={`view-toggle ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </button>
            </div>

            <button 
              className={`filter-btn ${showFilters ? 'active' : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              <span>Filters</span>
            </button>

            <Link href="/dashboard/listings/new" className="add-listing-btn">
              <Plus size={18} />
              <span>Add Listing</span>
            </Link>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label>
                <Calendar size={16} />
                Date Range
              </label>
              <select 
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Status</label>
              <div className="checkbox-group">
                {['available', 'sold', 'pending', 'hidden'].map(status => (
                  <label key={status} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(status)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFilters({...filters, status: [...filters.status, status]});
                        } else {
                          setFilters({...filters, status: filters.status.filter(s => s !== status)});
                        }
                      }}
                    />
                    <span className="checkbox-text">{status}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label>
                <DollarSign size={16} />
                Price Range (KES)
              </label>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.priceRange[0] || ''}
                  onChange={(e) => setFilters({
                    ...filters, 
                    priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]]
                  })}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.priceRange[1] || ''}
                  onChange={(e) => setFilters({
                    ...filters, 
                    priceRange: [filters.priceRange[0], parseInt(e.target.value) || 100000000]
                  })}
                />
              </div>
            </div>

            <div className="filter-group">
              <label>
                <Video size={16} />
                Media Type
              </label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="video"
                    checked={filters.hasVideo === null}
                    onChange={() => setFilters({...filters, hasVideo: null})}
                  />
                  <span>All</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="video"
                    checked={filters.hasVideo === true}
                    onChange={() => setFilters({...filters, hasVideo: true})}
                  />
                  <span>With Video</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="video"
                    checked={filters.hasVideo === false}
                    onChange={() => setFilters({...filters, hasVideo: false})}
                  />
                  <span>Images Only</span>
                </label>
              </div>
            </div>

            <button 
              className="clear-filters"
              onClick={() => setFilters({
                dateRange: 'all',
                status: [],
                priceRange: [0, 100000000],
                hasVideo: null,
              })}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Listings Grid/List */}
        {loading ? (
          <div className="loading-state">Loading listings...</div>
        ) : (
          <div className={`listings-container ${viewMode}`}>
            {filteredListings.map((listing) => (
              <div key={listing.id} className="listing-item">
                <div className="listing-image">
                  {listing.cover_image_url ? (
                    <Image
                      src={listing.cover_image_url}
                      alt={listing.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                  {listing.has_video && (
                    <span className="video-badge">
                      <Video size={14} />
                    </span>
                  )}
                  <span className={`status-badge ${listing.status}`}>
                    {listing.status}
                  </span>
                </div>

                <div className="listing-details">
                  <h4 className="listing-title">{listing.title}</h4>
                  <p className="listing-location">{listing.location}</p>
                  <p className="listing-price">{listing.price || 'Price on request'}</p>
                  
                  <div className="listing-meta">
                    <span>{listing.bedrooms || 0} beds</span>
                    <span>{listing.bathrooms || 0} baths</span>
                  </div>

                  <div className="listing-actions">
                    <button 
                      className="action-btn edit"
                      onClick={() => window.location.href = `/dashboard/listings/${listing.id}/edit`}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      className="action-btn freeze"
                      onClick={() => handleFreezeListing(listing.id, listing.status)}
                    >
                      <PauseCircle size={16} />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteListing(listing.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}