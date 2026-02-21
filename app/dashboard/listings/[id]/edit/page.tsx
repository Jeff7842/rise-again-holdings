/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/listings/[id]/edit/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import "@/components/styles/dashboard-new.css";
import "@/components/styles/dashboard-edit.css";

// Types
interface MediaFile {
  id: string;
  file?: File;
  url?: string;
  preview: string;
  type: 'image' | 'video';
  isCover?: boolean;
  storagePath?: string | null;
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

interface ListingData {
  id: string;
  title: string | null;
  description: string | null;
  location: string | null;
  price: string | number | null;
  negotiation: boolean | null;
  status: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  washrooms: number | null;
  building_area: string | null;
  land_size: string | null;
  cover_image_url: string | null;
  key_features?: KeyFeature[] | null;
  all_features?: AllFeature[] | null;
  images?: string[] | null;
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

const STORAGE_BUCKET = "listing-media";

function guessTypeFromUrl(url?: string | null): "image" | "video" {
  const u = (url ?? "").toLowerCase();
  if (u.match(/\.(mp4|mov|webm|mkv|avi|wmv|m4v)(\?|#|$)/)) return "video";
  return "image";
}

function normalizeMediaType(rawType: unknown, url?: string | null): "image" | "video" {
  const t = String(rawType ?? "").toLowerCase().trim();
  if (!t) return guessTypeFromUrl(url);
  if (t.includes("video")) return "video";
  if (t.includes("image") || t.includes("photo") || t.includes("img")) return "image";
  return guessTypeFromUrl(url);
}

function toNumberOrNull(v: string) {
  if (v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const listingId = params?.id;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
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
  const [existingMedia, setExistingMedia] = useState<MediaFile[]>([]);
  const [newMedia, setNewMedia] = useState<MediaFile[]>([]);

  // Features state
  const [keyFeatures, setKeyFeatures] = useState<KeyFeature[]>([]);
  const [allFeatures, setAllFeatures] = useState<AllFeature[]>([]);

  // Filtered features for search
  const filteredFeatures = AVAILABLE_FEATURES.filter(f => 
    f.toLowerCase().includes(featureSearchQuery.toLowerCase())
  );

  // Combined media for display
  const combinedMedia = useMemo(() => {
    const ex = existingMedia.map(m => ({
      ...m,
      key: `ex:${m.id}`,
      kind: 'existing' as const
    }));
    const nw = newMedia.map(m => ({
      ...m,
      key: `nw:${m.id}`,
      kind: 'new' as const
    }));
    return [...ex, ...nw];
  }, [existingMedia, newMedia]);

  useEffect(() => {
    if (!listingId) return;

    let cancelled = false;

    async function loadListing() {
      setLoading(true);

      // Load listing data
      const { data: listing, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', listingId)
        .single();

      if (cancelled) return;

      if (error || !listing) {
        console.error(error);
        alert('Could not load listing');
        setLoading(false);
        return;
      }

      // Hydrate form
      setFormData({
        title: listing.title ?? '',
        description: listing.description ?? '',
        location: listing.location ?? '',
        price: listing.price?.toString?.() ?? '',
        negotiation: listing.negotiation ? "negotiable" : "non-negotiable",
        status: listing.status ?? 'available',
        bedrooms: listing.bedrooms?.toString?.() ?? '',
        bathrooms: listing.bathrooms?.toString?.() ?? '',
        washrooms: listing.washrooms?.toString?.() ?? '',
        buildingArea: listing.building_area?.toString?.() ?? '',
        landSize: listing.land_size?.toString?.() ?? '',
      });

      // Parse features
      if (listing.key_features) {
        try {
          const parsed = typeof listing.key_features === 'string' 
            ? JSON.parse(listing.key_features) 
            : listing.key_features;
          if (Array.isArray(parsed) && parsed.length > 0) {
            setKeyFeatures(parsed.map((f: any) => ({
              id: crypto.randomUUID(),
              feature: f.feature || '',
              count: f.count || 1
            })));
          } else {
            setKeyFeatures([{ id: crypto.randomUUID(), feature: '', count: 1 }]);
          }
        } catch (e) {
          console.error('Error parsing key features:', e);
          setKeyFeatures([{ id: crypto.randomUUID(), feature: '', count: 1 }]);
        }
      } else {
        setKeyFeatures([{ id: crypto.randomUUID(), feature: '', count: 1 }]);
      }

      if (listing.all_features) {
        try {
          const parsed = typeof listing.all_features === 'string' 
            ? JSON.parse(listing.all_features) 
            : listing.all_features;
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAllFeatures(parsed.map((f: any) => ({
              id: crypto.randomUUID(),
              feature: f.feature || '',
              count: f.count || 1
            })));
          } else {
            setAllFeatures([{ id: crypto.randomUUID(), feature: '', count: 1 }]);
          }
        } catch (e) {
          console.error('Error parsing all features:', e);
          setAllFeatures([{ id: crypto.randomUUID(), feature: '', count: 1 }]);
        }
      } else {
        setAllFeatures([{ id: crypto.randomUUID(), feature: '', count: 1 }]);
      }

      // Load media - Try multiple sources
      const media: MediaFile[] = [];

      // First try to get from listing_media table
      const { data: mediaRows } = await supabase
        .from('listing_media')
        .select('*')
        .eq('listing_id', listingId)
        .order('sort_order', { ascending: true });

      if (mediaRows && mediaRows.length > 0) {
        mediaRows.forEach((row) => {
          const bucket = row.bucket || STORAGE_BUCKET;
          const resolvedUrl =
            row.url ||
            (row.object_path
              ? supabase.storage.from(bucket).getPublicUrl(String(row.object_path)).data.publicUrl
              : null);
          if (!resolvedUrl) return;

          media.push({
            id: String(row.id),
            url: resolvedUrl,
            preview: resolvedUrl,
            type: normalizeMediaType(row.type ?? row.kind, resolvedUrl),
            isCover: row.is_cover,
            storagePath: row.storage_path ?? row.object_path ?? null,
          });
        });
      } else {
        // Fallback: Check for images array in listing
        if (listing.images && Array.isArray(listing.images)) {
          listing.images.forEach((url: string, index: number) => {
            media.push({
              id: crypto.randomUUID(),
              url,
              preview: url,
              type: guessTypeFromUrl(url),
              isCover: url === listing.cover_image_url,
            });
          });
        }
        
        // If no images array but cover_image_url exists, add it
        if (media.length === 0 && listing.cover_image_url) {
          media.push({
            id: crypto.randomUUID(),
            url: listing.cover_image_url,
            preview: listing.cover_image_url,
            type: guessTypeFromUrl(listing.cover_image_url),
            isCover: true,
          });
        }

        // Try to parse media from any other fields that might contain URLs
        const possibleMediaFields = ['media', 'media_urls', 'videos'];
        possibleMediaFields.forEach(field => {
          const value = listing[field as keyof typeof listing];
          if (value && Array.isArray(value)) {
            value.forEach((item: any) => {
              const url = typeof item === 'string' ? item : item?.url;
              if (url && typeof url === 'string') {
                // Check if this URL is already added
                if (!media.some(m => m.url === url)) {
                  media.push({
                    id: crypto.randomUUID(),
                    url,
                    preview: url,
                    type: normalizeMediaType(item?.type ?? item?.kind, url),
                  });
                }
              }
            });
          }
        });
      }

      // Ensure one cover is set
      if (media.length > 0 && !media.some(m => m.isCover)) {
        media[0].isCover = true;
      }

      if (cancelled) return;
      setExistingMedia(media);
      setNewMedia([]);
      setCurrentMediaIndex(0);
      setLoading(false);
    }

    loadListing();

    return () => {
      cancelled = true;
    };
  }, [listingId]);

  // Cleanup previews
  useEffect(() => {
    return () => {
      newMedia.forEach(m => {
        if (m.preview && m.preview.startsWith('blob:')) {
          URL.revokeObjectURL(m.preview);
        }
      });
    };
  }, [newMedia]);

  // Handle media upload
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newFiles: MediaFile[] = [];
    
    files.forEach(file => {
      if (existingMedia.length + newMedia.length + newFiles.length >= 20) {
        alert('Maximum 20 files allowed');
        return;
      }

      const type = file.type.startsWith('video/') ? 'video' : 'image';
      
      newFiles.push({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        type,
      });
    });

    setNewMedia(prev => {
      const updated = [...prev, ...newFiles];
      
      // Set cover if none exists
      const hasCover = [...existingMedia, ...updated].some(m => m.isCover);
      if (!hasCover) {
        const firstImageIndex = updated.findIndex(m => m.type === 'image');
        if (firstImageIndex >= 0) {
          updated[firstImageIndex].isCover = true;
        }
      }
      
      return updated;
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle media deletion
  const handleDeleteMedia = async (key: string) => {
    const [kind, id] = key.split(':');

    if (kind === 'nw') {
      setNewMedia(prev => {
        const target = prev.find(m => m.id === id);
        if (target && target.preview.startsWith('blob:')) {
          URL.revokeObjectURL(target.preview);
        }
        return prev.filter(m => m.id !== id);
      });
      return;
    }

    // Delete existing media
    const target = existingMedia.find(m => m.id === id);
    setExistingMedia(prev => prev.filter(m => m.id !== id));

    // Try to delete from storage
    if (target?.storagePath) {
      await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([target.storagePath]);
    }

    // Try to delete from listing_media
    await supabase
      .from('listing_media')
      .delete()
      .eq('id', id);
  };

  // Handle media replacement
  const handleReplaceMedia = (key: string) => {
    const [kind, id] = key.split(':');
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      if (kind === 'nw') {
        const nextType: "image" | "video" = file.type.startsWith('video/') ? 'video' : 'image';
        // Revoke old preview if it's a blob
        setNewMedia(prev => {
          const oldMedia = prev.find(m => m.id === id);
          if (oldMedia?.preview.startsWith('blob:')) {
            URL.revokeObjectURL(oldMedia.preview);
          }
          return prev.map(m => 
            m.id === id 
              ? { ...m, file, preview: URL.createObjectURL(file), type: nextType }
              : m
          );
        });
      } else {
        // For existing media, create a new one
        const type = file.type.startsWith('video/') ? 'video' : 'image';
        setNewMedia(prev => [...prev, {
          id: crypto.randomUUID(),
          file,
          preview: URL.createObjectURL(file),
          type,
        }]);
      }
    };
    input.click();
  };

  // Set cover image
  const handleSetCover = (key: string) => {
    setExistingMedia(prev => prev.map(m => ({ 
      ...m, 
      isCover: `ex:${m.id}` === key 
    })));
    setNewMedia(prev => prev.map(m => ({ 
      ...m, 
      isCover: `nw:${m.id}` === key 
    })));
  };

  // Handle drag and drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
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
      // Upload new media
      const uploadedMedia: MediaFile[] = [];
      
      for (const media of newMedia) {
        if (!media.file) continue;

        const ext = media.file.name.split('.').pop() || (media.type === 'video' ? 'mp4' : 'jpg');
        const fileName = `${listingId}-${media.id}.${ext}`;
        const filePath = `listings/${listingId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, media.file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(filePath);

        // Insert into listing_media
        const { data } = await supabase
          .from('listing_media')
          .insert({
            listing_id: listingId,
            url: publicUrl,
            type: media.type,
            is_cover: media.isCover || false,
            storage_path: filePath,
            sort_order: existingMedia.length + uploadedMedia.length,
          })
          .select()
          .single();

        uploadedMedia.push({
          id: data?.id || media.id,
          url: publicUrl,
          preview: publicUrl,
          type: media.type,
          isCover: media.isCover,
          storagePath: filePath,
        });
      }

      // Combine all media
      const allMedia = [...existingMedia, ...uploadedMedia];

      // Determine cover image URL
      const coverMedia = allMedia.find(m => m.isCover) || allMedia.find(m => m.type === 'image');
      const coverImageUrl = coverMedia?.url || null;

      // Collect all image URLs for the images array
      const imageUrls = allMedia
        .filter(m => m.type === 'image')
        .map(m => m.url || '');

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
const formattedPrice = formatKES(formData.price ? normalizePrice(formData.price):null);
      // Update listing
      const { error: updateError } = await supabase
        .from('listings')
        .update({
          title: formData.title || null,
          description: formData.description || null,
          location: formData.location || null,
          price: formattedPrice,
          negotiation: formData.negotiation === "negotiable",
          status: formData.status,
          bedrooms: toNumberOrNull(formData.bedrooms),
          bathrooms: toNumberOrNull(formData.bathrooms),
          washrooms: toNumberOrNull(formData.washrooms),
          building_area: formData.buildingArea || null,
          land_size: formData.landSize || null,
          cover_image_url: coverImageUrl,
          images: imageUrls,
          key_features: processedKeyFeatures,
          all_features: processedAllFeatures,
          has_video: allMedia.some(m => m.type === 'video'),
          updated_at: new Date().toISOString(),
        })
        .eq('id', listingId);

      if (updateError) throw updateError;

      router.push('/dashboard/listings');
    } catch (error) {
      console.error('Error updating listing:', error);
      alert('Error updating listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="new-listing-page">
        <div className="loading-state">Loading listing...</div>
        <style jsx>{`
          .loading-state {
            padding: 4rem;
            text-align: center;
            color: #64748b;
            font-size: 1rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="new-listing-page">
      <div className="page-header">
        <div>
          <h2>Edit Listing</h2>
          <p className="page-subtitle">Update property details and media</p>
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
            <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
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
              {combinedMedia.length > 0 ? (
                <div className="media-preview-container">
                  <div className="preview-main">
                    {combinedMedia[currentMediaIndex]?.type === 'image' ? (
                      <Image
                        src={combinedMedia[currentMediaIndex].preview}
                        alt="Preview"
                        fill
                        className="preview-image"
                        onError={(e) => {
                          // Fallback for broken images
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                        }}
                      />
                    ) : (
                      <video
                        src={combinedMedia[currentMediaIndex].preview}
                        controls
                        className="preview-video"
                        onError={(e) => {
                          // Fallback for videos that can't play
                          console.log('Video failed to load');
                        }}
                      >
                        <source src={combinedMedia[currentMediaIndex].preview} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}

                    {combinedMedia[currentMediaIndex]?.isCover && (
                      <span className="cover-badge">Cover</span>
                    )}

                    <div className="preview-controls">
                      <button
                        type="button"
                        className="preview-nav-btn"
                        onClick={() => setCurrentMediaIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentMediaIndex === 0}
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <span className="preview-counter">
                        {currentMediaIndex + 1} / {combinedMedia.length}
                      </span>
                      <button
                        type="button"
                        className="preview-nav-btn"
                        onClick={() => setCurrentMediaIndex(prev => Math.min(combinedMedia.length - 1, prev + 1))}
                        disabled={currentMediaIndex === combinedMedia.length - 1}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>

                    {/* Hover overlay with actions */}
                    <div className="media-hover-overlay">
                      <div className="media-actions">
                        <button
                          type="button"
                          className="media-action-btn"
                          onClick={() => handleReplaceMedia(combinedMedia[currentMediaIndex].key)}
                        >
                          <Pencil size={16}/>
                        </button>
                        <button
                          type="button"
                          className="media-action-btn delete"
                          onClick={() => handleDeleteMedia(combinedMedia[currentMediaIndex].key)}
                        >
                          <Trash2 size={16}/>
                        </button>
                        {!combinedMedia[currentMediaIndex]?.isCover && (
                          <button
                            type="button"
                            className="media-action-btn cover"
                            onClick={() => handleSetCover(combinedMedia[currentMediaIndex].key)}
                          >
                            Set as Cover
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Thumbnails with stacking */}
                  <div className="preview-thumbnails">
                    {combinedMedia.slice(0, 10).map((media, index) => (
                      <div
                        key={media.key}
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
                    {combinedMedia.length > 9 && (
                      <div className="stacked-thumbnails">
                        <div className="stacked-count">
                          <Plus size={14} />
                          <span>{combinedMedia.length - 9}</span>
                        </div>
                        <div className="stacked-previews">
                          {combinedMedia.slice(9, 13).map((media, i) => (
                            <div key={media.key} className="stacked-preview">
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
                          {combinedMedia.length > 13 && (
                            <div className="more-stacked">
                              +{combinedMedia.length - 13}
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
        <div className="form-section text-black/70">
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
                className="text-black/80 w-260"
              />
            </div>

            <div className="form-group">
              <label>Price (KES) *</label>
              <div className="input-with-icon">
                <DollarSign size={18} />
                <input
  type="text"
  required
  value={formatWithCommas(formData.price)}
  onChange={(e) =>
    setFormData({
      ...formData,
      price: e.target.value.replace(/,/g, ""),
    })
  }
  placeholder="e.g., 15,000,000"
/>
              </div>
            </div>

            <div className="form-group">
              <label>Negotiation</label>
              <select
                value={formData.negotiation}
                onChange={(e) => setFormData({ ...formData, negotiation: e.target.value })}
              >
                {NEGOTIATION_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
              {expandedSections.keyFeatures ? <ChevronUp size={20} className="text-red-700"/> : <ChevronDown size={20} className="text-red-700"/>}
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
                        <ChevronDown size={16} className="text-red-700"/>
                      </button>

                      {activeFeatureDropdown === feature.id && (
                        <div className="feature-dropdown-menu">
                          <div className="dropdown-search">
                            <Search size={14} className="text-red-700"/>
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
              {expandedSections.allFeatures ? <ChevronUp size={20} className="text-red-700"/> : <ChevronDown size={20} className="text-red-700"/>}
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
                        <ChevronDown size={16} className="text-red-700"/>
                      </button>

                      {activeFeatureDropdown === feature.id && (
                        <div className="feature-dropdown-menu">
                          <div className="dropdown-search">
                            <Search size={14} className="text-red-700"/>
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
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="form-section danger-zone">
          <div className="section-header">
            <h3 style={{ color: '#dc2626' }}>
              <X size={20} />
              Danger Zone
            </h3>
          </div>

          <div className="danger-actions">
            <button
              type="button"
              className="delete-listing-btn"
              onClick={async () => {
                if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
                
                const { error } = await supabase
                  .from('listings')
                  .delete()
                  .eq('id', listingId);

                if (error) {
                  alert(error.message);
                  return;
                }

                router.push('/dashboard/listings');
              }}
            >
              <Trash2 size={16} />
              Delete Listing
            </button>
            <p className="danger-hint">
              Once deleted, this listing and all its media will be permanently removed.
            </p>
          </div>
        </div>
      </form>

      <style jsx>{`
        
      `}</style>
    </div>
  );
}
