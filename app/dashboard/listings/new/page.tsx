// app/dashboard/listings/new/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  Plus,
  Search,
  Calendar,
  Clock,
  Save,
  Eye,
  Home,
  MapPin,
  DollarSign,
  Maximize,
  Bath,
  Bed,
  Zap,
  ChevronDown,
  ChevronUp,
  Camera,
  Video,
  List,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import "@/components/styles/dashboard.css";
import "@/components/styles/dashboard-new.css";

// Types
interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  isCover?: boolean;
}

interface KeyFeature {
  id: string;
  feature: string;
  count: number;
}

interface AllFeature {
  id: string;
  feature: string;
  count: number;
}

// Available features list (70+ features)
const AVAILABLE_FEATURES = [
  "Sliding Gate", "Bio Tank", "CCTV Security", "Solar Panels", "Backup Generator",
  "Borehole", "Perimeter Wall", "Staff Quarters", "Swimming Pool", "Garden",
  "Gazebo", "Outdoor Kitchen", "Braai Area", "Fireplace", "Central Heating",
  "Air Conditioning", "Ceiling Fans", "Walk-in Closet", "Jacuzzi", "Sauna",
  "Home Theater", "Wine Cellar", "Gym", "Study/Office", "Playroom",
  "Guest House", "Servants Quarters", "Store Room", "Pantry", "Laundry Room",
  "Double Garage", "Triple Garage", "Carport", "Parking Bays", "Electric Fence",
  "Security Beams", "Intercom", "Electric Gate", "Alarm System", "Smart Home",
  "Fibre Internet", "Satellite TV", "Water Tank", "Water Pump", "Irrigation System",
  "Thatched Roof", "Tile Roof", "Wooden Floors", "Marble Floors", "Granite Countertops",
  "Built-in Wardrobes", "Dressing Room", "En-suite Bathroom", "Guest Toilet",
  "Separate Shower", "Bathtub", "Double Sink", "His & Hers Sinks", "Outdoor Shower",
  "Pool House", "Tennis Court", "Basketball Court", "Squash Court", "Putting Green",
  "Stable", "Kennel", "Chicken Coop", "Greenhouse", "Orchard"
].sort();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatKES = (value: any) => {
  if (!value) return "";

  const number = Number(value);

  const formatWithCommas = (num: number) =>
    num.toLocaleString("en-KE");

  if (number >= 1_000_000_000) {
    return `KES ${Math.round(number / 1_000_000_000)}B`;
  }

  if (number >= 1_000_000) {
    return `KES ${Math.round(number / 1_000_000)}M`;
  }

  if (number >= 1_000) {
    return `KES ${Math.round(number / 1_000)}K`;
  }

  return `KES ${formatWithCommas(number)}`;
};

function normalizePrice(value: string | number): number {
  if (!value) return 0;

  // Convert to string
  let str = String(value).toUpperCase().trim();

  // Remove currency labels and spaces
  str = str.replace(/KES|KSH|,/g, "").trim();

  // Handle Millions (M)
  if (str.endsWith("M")) {
    return parseFloat(str.replace("M", "")) * 1_000_000;
  }

  // Handle Billions (B)
  if (str.endsWith("B")) {
    return parseFloat(str.replace("B", "")) * 1_000_000_000;
  }

  // Handle Thousands (K)
  if (str.endsWith("K")) {
    return parseFloat(str.replace("K", "")) * 1_000;
  }

  return Number(str);
}

function formatWithCommas(value: string | number): string {
  if (!value) return "";

  const number =
    typeof value === "number"
      ? value
      : normalizePrice(value);

  return number.toLocaleString("en-US");
}

// Price negotiation options
const NEGOTIATION_OPTIONS = [
  { value: 'negotiable', label: 'Negotiable' },
  { value: 'non-negotiable', label: 'Non-Negotiable' }
];

// Status options
const STATUS_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'pending', label: 'Pending' },
  { value: 'sold', label: 'Sold' },
  { value: 'hidden', label: 'Hidden' }
];

export default function NewListingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [showFeatureSearch, setShowFeatureSearch] = useState(false);
  const [featureSearchQuery, setFeatureSearchQuery] = useState('');
  const [activeFeatureDropdown, setActiveFeatureDropdown] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    keyFeatures: true,
    allFeatures: true
  });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    negotiation: 'negotiable',
    status: 'available',
    bedrooms: '',
    bathrooms: '',
    washrooms: '',
    buildingArea: '',
    landSize: '',
  });

  // Media state
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [coverImageIndex, setCoverImageIndex] = useState<number>(-1);

  // Features state
  const [keyFeatures, setKeyFeatures] = useState<KeyFeature[]>([
    { id: crypto.randomUUID(), feature: '', count: 1 }
  ]);
  const [allFeatures, setAllFeatures] = useState<AllFeature[]>([
    { id: crypto.randomUUID(), feature: '', count: 1 }
  ]);

  // Filtered features for search
  const filteredFeatures = AVAILABLE_FEATURES.filter(f => 
    f.toLowerCase().includes(featureSearchQuery.toLowerCase())
  );

  // Handle media upload
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      if (mediaFiles.length >= 20) {
        alert('Maximum 20 files allowed');
        return;
      }

      const fileType = file.type.startsWith('video/') ? 'video' : 'image';
      
      const newMedia: MediaFile = {
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        type: fileType,
        isCover: mediaFiles.length === 0 && fileType === 'image' // First image becomes cover
      };

      setMediaFiles(prev => {
        const updated = [...prev, newMedia];
        if (newMedia.isCover) {
          setCoverImageIndex(updated.length - 1);
        }
        return updated;
      });
    });
  };

  // Handle media deletion
  const handleDeleteMedia = (id: string) => {
    setMediaFiles(prev => {
      const filtered = prev.filter(m => m.id !== id);
      // Update cover image if needed
      if (coverImageIndex >= filtered.length) {
        setCoverImageIndex(filtered.length - 1);
      }
      return filtered;
    });
  };

  // Handle media replacement
  const handleReplaceMedia = (id: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setMediaFiles(prev => prev.map(m => 
          m.id === id 
            ? { ...m, file, preview: URL.createObjectURL(file) }
            : m
        ));
      }
    };
    input.click();
  };

  // Set cover image
  const handleSetCover = (index: number) => {
    setMediaFiles(prev => prev.map((m, i) => ({
      ...m,
      isCover: i === index
    })));
    setCoverImageIndex(index);
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const input = { target: { files } } as any;
    handleMediaUpload(input);
  };

  // Add key feature
  const addKeyFeature = () => {
    if (keyFeatures.length < 10) {
      setKeyFeatures([...keyFeatures, { id: crypto.randomUUID(), feature: '', count: 1 }]);
    }
  };

  // Add all feature
  const addAllFeature = () => {
    if (allFeatures.length < 15) {
      setAllFeatures([...allFeatures, { id: crypto.randomUUID(), feature: '', count: 1 }]);
    }
  };

  // Remove key feature
  const removeKeyFeature = (id: string) => {
    if (keyFeatures.length > 1) {
      setKeyFeatures(keyFeatures.filter(f => f.id !== id));
    }
  };

  // Remove all feature
  const removeAllFeature = (id: string) => {
    if (allFeatures.length > 1) {
      setAllFeatures(allFeatures.filter(f => f.id !== id));
    }
  };

  // Update key feature
  const updateKeyFeature = (id: string, field: keyof KeyFeature, value: string | number) => {
    setKeyFeatures(prev => prev.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  // Update all feature
  const updateAllFeature = (id: string, field: keyof AllFeature, value: string | number) => {
    setAllFeatures(prev => prev.map(f => 
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Upload media files to Supabase Storage
      const mediaUrls: string[] = [];
      
      for (const media of mediaFiles) {
        const fileExt = media.file.name.split('.').pop();
        const fileName = `${slug}-(RAH)-${media.id}.${fileExt}`;
        const filePath = `listings/${slug}/${fileName}`;

        const { data, error: uploadError } = await supabase.storage
  .from("listings-media")
  .upload(filePath, media.file, {
    contentType: media.file.type || "application/octet-stream",
    upsert: false,
    cacheControl: "3600",
  });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('listings-media')
          .getPublicUrl(filePath);

        mediaUrls.push(publicUrl);
      }

      // Prepare features
      const processedKeyFeatures = keyFeatures
        .filter(f => f.feature)
        .map(f => ({
          feature: f.feature,
          count: f.count
        }));

      const processedAllFeatures = allFeatures
        .filter(f => f.feature)
        .map(f => ({
          feature: f.feature,
          count: f.count
        }));

        

const mediaPrefix = `listings/${slug}`;
const formattedPrice = formatKES(formData.price);
      // Insert listing
      const { data: listing, error } = await supabase
  .from("listings")
  .insert({
    slug,
    title: formData.title,
    description: formData.description || null,
    location: formData.location || null,
    price: formattedPrice || null,
    status: formData.status,                 // uses your check + default
    bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
    bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
    area_sqm: formData.buildingArea ? Number(formData.buildingArea) : null, // if you want
    media_bucket: "listings-media",
    media_prefix: mediaPrefix,
    cover_image_url: mediaUrls[coverImageIndex] || mediaUrls[0] || null,
    // tags: []  // optional if you collect tags
  })
  .select("*")
  .single();

      if (error) throw error;

      const mediaRows = mediaFiles.map((m, idx) => {
  const fileExt = m.file.name.split(".").pop();
  const fileName = `${slug}-${m.id}.${fileExt}`;
  const objectPath = `${mediaPrefix}/${fileName}`;

  return {
    listing_id: listing.id,
    bucket: "listings-media",
    object_path: objectPath,
    kind: m.file.type.startsWith("video/") ? "video" : "image",
    sort_order: idx,
    is_cover: idx === coverImageIndex,
    caption: null,
  };
});

const { error: mediaInsertError } = await supabase
  .from("listing_media")
  .insert(mediaRows);

if (mediaInsertError) throw mediaInsertError;

      // Redirect to listings page
      router.push('/dashboard/listings');
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Error creating listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-listing-page">
      <div className="page-header">
        <div>
          <h2>Add New Listing</h2>
          <p className="page-subtitle">Create a new property listing with media and details</p>
        </div>
        <div className="header-actions">
          <button 
            className="preview-btn"
            onClick={() => router.push('/dashboard/listings')}
          >
            <Eye size={18} />
            <span>Cancel</span>
          </button>
          <button 
            className="publish-btn"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Save size={18} />
            <span>{isSubmitting ? 'Saving...' : 'Publish Now'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="listing-form">
        {/* Media Upload Section */}
        <div className="form-section">
          <div className="section-header">
            <h3>
              <Camera size={20} />
              Media Gallery
            </h3>
            <p className="section-hint">Upload up to 20 images or videos. First image will be the cover.</p>
          </div>

          <div className="media-upload-area">
            {/* Preview Pane */}
            <div className="media-preview-pane">
              {mediaFiles.length > 0 ? (
                <div className="media-preview-container">
                  <div className="preview-main">
                    {mediaFiles[currentMediaIndex].type === 'image' ? (
                      <Image
                        src={mediaFiles[currentMediaIndex].preview}
                        alt="Preview"
                        fill
                        className="preview-image"
                      />
                    ) : (
                      <video
                        src={mediaFiles[currentMediaIndex].preview}
                        controls
                        className="preview-video"
                      />
                    )}

                    {mediaFiles[currentMediaIndex].isCover && (
                      <span className="cover-badge">Cover</span>
                    )}

                    <div className="preview-controls">
                      <button
                        type="button"
                        className="preview-nav-btn text-red-500"
                        onClick={() => setCurrentMediaIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentMediaIndex === 0}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <span className="preview-counter">
                        {currentMediaIndex + 1} / {mediaFiles.length}
                      </span>
                      <button
                        type="button"
                        className="preview-nav-btn text-red-500"
                        onClick={() => setCurrentMediaIndex(prev => Math.min(mediaFiles.length - 1, prev + 1))}
                        disabled={currentMediaIndex === mediaFiles.length - 1}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>

                    {/* Hover overlay with actions */}
                    <div className="media-hover-overlay">
                      <div className="media-actions">
                        <button
                          type="button"
                          className="media-action-btn text-black"
                          onClick={() => handleReplaceMedia(mediaFiles[currentMediaIndex].id)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          className="media-action-btn delete text-black"
                          onClick={() => handleDeleteMedia(mediaFiles[currentMediaIndex].id)}
                        >
                          <Trash2 size={16} />
                        </button>
                        {!mediaFiles[currentMediaIndex].isCover && (
                          <button
                            type="button"
                            className="media-action-btn cover"
                            onClick={() => handleSetCover(currentMediaIndex)}
                          >
                            Set as Cover
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Thumbnails with stacking */}
                  <div className="preview-thumbnails">
                    {mediaFiles.slice(0, 9).map((media, index) => (
                      <div
                        key={media.id}
                        className={`thumbnail ${index === currentMediaIndex ? 'active' : ''} ${media.isCover ? 'cover' : ''}`}
                        onClick={() => setCurrentMediaIndex(index)}
                      >
                        {media.type === 'image' ? (
                          <Image
                            src={media.preview}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            className="thumbnail-image"
                          />
                        ) : (
                          <div className="thumbnail-video">
                            <Video size={16} />
                          </div>
                        )}
                        {media.isCover && <span className="cover-indicator">Cover</span>}
                      </div>
                    ))}

                    {/* Stacked thumbnails indicator */}
                    {mediaFiles.length > 9 && (
                      <div className="stacked-thumbnails">
                        <div className="stacked-count">
                          <Plus size={14} />
                          <span>{mediaFiles.length - 9}</span>
                        </div>
                        <div className="stacked-previews">
                          {mediaFiles.slice(9, 13).map((media, i) => (
                            <div key={media.id} className="stacked-preview">
                              {media.type === 'image' ? (
                                <Image
                                  src={media.preview}
                                  alt={`Stacked ${i + 10}`}
                                  fill
                                  className="stacked-image"
                                />
                              ) : (
                                <div className="stacked-video">
                                  <Video size={12} />
                                </div>
                              )}
                            </div>
                          ))}
                          {mediaFiles.length > 13 && (
                            <div className="more-stacked">
                              +{mediaFiles.length - 13}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Add files button */}
                    <button
                      type="button"
                      className="add-media-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Plus size={20} />
                      <span>Add Images</span>
                    </button>
                  </div>
                </div>
              ) : (
                // Empty state - dashed border
                <div
                  className="media-dropzone"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="dropzone-content">
                    <div className="dropzone-icon">
                      <Upload size={32} />
                    </div>
                    <p className="dropzone-title">Add Media Files</p>
                    <p className="dropzone-hint">
                      Drag & drop files here, or click to browse
                    </p>
                    <p className="dropzone-formats">
                      Supports: JPG, PNG, WebP, MP4 (Max 20 files)
                    </p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleMediaUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Basic Details Section */}
        <div className="form-section">
          <div className="section-header">
            <h3>
              <Home size={20} />
              Basic Details
            </h3>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Luxurious 4-Bedroom Villa"
              />
            </div>

            <div className="form-group">
              <label>Location *</label>
              <div className="input-with-icon">
                <MapPin size={18} />
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Runda, Nairobi"
                  className="w-100"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Description *</label>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the property in detail..."
                className="text-black/80"
              />
            </div>

            <div className="form-group">
              <label>Price (KES) *</label>
              <div className="input-with-icon">
                <DollarSign size={18} />
                <input
                  type="number"
                  required
                  min="50000"
                  step="10000"
                  value={formatWithCommas(formData.price)}
  onChange={(e) =>
    setFormData({
      ...formData,
      price: e.target.value
    })
  }
                  placeholder="e.g., 15000000"
                  className="w-100"
                />
              </div>
              <div className="form-group w-60">
              <label>Negotiation</label>
              <select
                value={formData.negotiation}
                onChange={(e) => setFormData({ ...formData, negotiation: e.target.value })}
                className="text-black/70"
              >
                {NEGOTIATION_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            </div>

            

            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="text-black/70"
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Property Specifications */}
        <div className="form-section">
          <div className="section-header">
            <h3>
              <Maximize size={20} />
              Property Specifications
            </h3>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Bedrooms</label>
              <div className="input-with-icon">
                <Bed size={18} />
                <input
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  placeholder="e.g., 4"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Bathrooms</label>
              <div className="input-with-icon">
                <Bath size={18} />
                <input
                  type="number"
                  min="0"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  placeholder="e.g., 3"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Washrooms</label>
              <input
                type="number"
                min="0"
                value={formData.washrooms}
                onChange={(e) => setFormData({ ...formData, washrooms: e.target.value })}
                placeholder="e.g., 2"
              />
            </div>

            <div className="form-group">
              <label>Building Area</label>
              <input
                type="text"
                value={formData.buildingArea}
                onChange={(e) => setFormData({ ...formData, buildingArea: e.target.value })}
                placeholder="e.g., 450 sqm"
              />
            </div>

            <div className="form-group">
              <label>Land Size</label>
              <input
                type="text"
                value={formData.landSize}
                onChange={(e) => setFormData({ ...formData, landSize: e.target.value })}
                placeholder="e.g., 1.5 acres"
              />
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <div className="form-section">
          <div className="section-header clickable" onClick={() => setExpandedSections(prev => ({ ...prev, keyFeatures: !prev.keyFeatures }))}>
            <div className="header-left">
              <h3>
                <Zap size={20} />
                Key Features (Max 10)
              </h3>
              {expandedSections.keyFeatures ? <ChevronUp size={20} className="text-red-500"/> : <ChevronDown size={20} className="text-red-500"/>}
            </div>
            <p className="section-hint">Select the most important features that will be highlighted</p>
          </div>

          {expandedSections.keyFeatures && (
            <div className="features-container">
              {keyFeatures.map((feature, index) => (
                <div key={feature.id} className="feature-row">
                  <div className="feature-selector">
                    <div className="feature-dropdown">
                      <button
                        type="button"
                        className="dropdown-trigger"
                        onClick={() => setActiveFeatureDropdown(activeFeatureDropdown === feature.id ? null : feature.id)}
                      >
                        <span className="text-black/70">{feature.feature || 'Select a feature'}</span>
                        <ChevronDown size={16} className="text-red-500"/>
                      </button>

                      {activeFeatureDropdown === feature.id && (
                        <div className="feature-dropdown-menu">
                          <div className="dropdown-search">
                            <Search size={14} />
                            <input
                              type="text"
                              placeholder="Search features..."
                              value={featureSearchQuery}
                              onChange={(e) => setFeatureSearchQuery(e.target.value)}
                              autoFocus
                            />
                          </div>
                          <div className="dropdown-options">
                            {filteredFeatures.map(f => (
                              <button
                                key={f}
                                type="button"
                                className="dropdown-option"
                                onClick={() => {
                                  updateKeyFeature(feature.id, 'feature', f);
                                  setActiveFeatureDropdown(null);
                                  setFeatureSearchQuery('');
                                }}
                              >
                                {f}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="feature-count">
                      <input
                        type="number"
                        min="1"
                        value={feature.count}
                        onChange={(e) => updateKeyFeature(feature.id, 'count', parseInt(e.target.value) || 1)}
                        placeholder="Qty"
                      />
                    </div>

                    {keyFeatures.length > 1 && (
                      <button
                        type="button"
                        className="remove-feature-btn"
                        onClick={() => removeKeyFeature(feature.id)}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {index === keyFeatures.length - 1 && keyFeatures.length < 10 && (
                    <button
                      type="button"
                      className="add-feature-btn"
                      onClick={addKeyFeature}
                    >
                      <Plus size={16} />
                      <span>Add another key feature</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All Features Section */}
        <div className="form-section">
          <div className="section-header clickable" onClick={() => setExpandedSections(prev => ({ ...prev, allFeatures: !prev.allFeatures }))}>
            <div className="header-left">
              <h3>
                <List size={20} />
                All Features (Max 15)
              </h3>
              {expandedSections.allFeatures ? <ChevronUp size={20} className="text-red-500"/> : <ChevronDown size={20} className="text-red-500"/>}
            </div>
            <p className="section-hint">Complete list of property features</p>
          </div>

          {expandedSections.allFeatures && (
            <div className="features-container">
              {allFeatures.map((feature, index) => (
                <div key={feature.id} className="feature-row">
                  <div className="feature-selector">
                    <div className="feature-dropdown">
                      <button
                        type="button"
                        className="dropdown-trigger"
                        onClick={() => setActiveFeatureDropdown(activeFeatureDropdown === feature.id ? null : feature.id)}
                      >
                        <span className="text-black/70">{feature.feature || 'Select a feature'}</span>
                        <ChevronDown size={16} className="text-red-500"/>
                      </button>

                      {activeFeatureDropdown === feature.id && (
                        <div className="feature-dropdown-menu">
                          <div className="dropdown-search">
                            <Search size={14} />
                            <input
                              type="text"
                              placeholder="Search features..."
                              value={featureSearchQuery}
                              onChange={(e) => setFeatureSearchQuery(e.target.value)}
                              autoFocus
                            />
                          </div>
                          <div className="dropdown-options">
                            {filteredFeatures.map(f => (
                              <button
                                key={f}
                                type="button"
                                className="dropdown-option"
                                onClick={() => {
                                  updateAllFeature(feature.id, 'feature', f);
                                  setActiveFeatureDropdown(null);
                                  setFeatureSearchQuery('');
                                }}
                              >
                                {f}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="feature-count">
                      <input
                        type="number"
                        min="1"
                        value={feature.count}
                        onChange={(e) => updateAllFeature(feature.id, 'count', parseInt(e.target.value) || 1)}
                        placeholder="Qty"
                      />
                    </div>

                    {allFeatures.length > 1 && (
                      <button
                        type="button"
                        className="remove-feature-btn"
                        onClick={() => removeAllFeature(feature.id)}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  {index === allFeatures.length - 1 && allFeatures.length < 15 && (
                    <button
                      type="button"
                      className="add-feature-btn"
                      onClick={addAllFeature}
                    >
                      <Plus size={16} />
                      <span>Add another feature</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Publishing Options */}
        <div className="form-section publishing-options">
          <div className="publishing-grid">
            <div className="publish-option">
              <h4>
                <Clock size={18} />
                Schedule Publishing
              </h4>
              <div className="schedule-inputs">
                <input type="date" />
                <input type="time" />
              </div>
            </div>

            <div className="publish-actions">
              <button type="button" className="save-draft-btn">
                Save as Draft
              </button>
              <button type="submit" className="publish-now-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Publishing...' : 'Publish Now'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}