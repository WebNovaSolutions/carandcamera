import React, { useState } from 'react';
import { Plus, X, Globe, Star, Image as ImageIcon, Check, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ImageUploader({
  images = [],
  onChange,
  maxImages = 6,
  label = 'Online Image Links (First image is primary display)',
}) {
  const [imageUrl, setImageUrl] = useState('');
  const [previewError, setPreviewError] = useState(false);

  const handleAddUrl = (e) => {
    e?.preventDefault();
    const cleanUrl = imageUrl.trim();

    if (!cleanUrl) {
      toast.error('Please enter a valid image URL');
      return;
    }

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      toast.error('Image URL must start with http:// or https://');
      return;
    }

    if (images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    if (images.includes(cleanUrl)) {
      toast.error('This image link has already been added');
      return;
    }

    onChange([...images, cleanUrl]);
    setImageUrl('');
    setPreviewError(false);
    toast.success('Image link added successfully!');
  };

  const handleRemove = (indexToRemove) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleSetPrimary = (index) => {
    if (index === 0) return;
    const reordered = [...images];
    const [selected] = reordered.splice(index, 1);
    reordered.unshift(selected);
    onChange(reordered);
    toast.success('Set as primary cover image');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
          {label} ({images.length}/{maxImages})
        </label>
        <span className="text-[11px] text-text-dim flex items-center gap-1 font-mono">
          <Globe className="w-3 h-3 text-accent-blue" />
          Web URLs (Unsplash, Imgur, direct links)
        </span>
      </div>

      {/* Online Image URL Input Form */}
      {images.length < maxImages && (
        <div className="p-3.5 bg-dark-secondary rounded-2xl border border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <ImageIcon className="w-4 h-4 text-text-dim absolute left-3.5 top-3" />
              <input
                type="url"
                placeholder="Paste direct image link: https://images.unsplash.com/... or https://i.imgur.com/..."
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setPreviewError(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddUrl();
                  }
                }}
                className="w-full bg-dark-primary border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-text-dim focus:outline-none focus:border-accent-amber transition"
              />
            </div>
            <button
              type="button"
              onClick={handleAddUrl}
              className="px-5 py-2.5 rounded-xl bg-accent-amber hover:bg-accent-amberHover text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-glow-amber transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Image Link</span>
            </button>
          </div>

          {/* Realtime URL Preview if user pasted something */}
          {imageUrl.trim().startsWith('http') && (
            <div className="flex items-center gap-3 p-2 bg-dark-primary/60 rounded-xl border border-white/5 text-[11px]">
              <div className="w-12 h-10 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-white/10">
                <img
                  src={imageUrl.trim()}
                  alt="Live preview"
                  onError={() => setPreviewError(true)}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 truncate">
                {previewError ? (
                  <span className="text-status-error">Preview failed: Check if URL directly points to an image.</span>
                ) : (
                  <span className="text-status-success flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Valid image preview ready to add
                  </span>
                )}
                <span className="text-text-dim block truncate text-[10px]">{imageUrl.trim()}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Image Gallery Thumbnails Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`relative aspect-[16/10] rounded-xl overflow-hidden bg-dark-secondary border group transition ${
                idx === 0 ? 'border-accent-amber shadow-glow-amber/30' : 'border-white/10 hover:border-white/30'
              }`}
            >
              <img
                src={img}
                alt={`Gear display ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80';
                }}
              />

              {/* Primary Badge */}
              {idx === 0 ? (
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold bg-accent-amber text-black shadow-glow-amber flex items-center gap-1">
                  <Star className="w-3 h-3 fill-black" />
                  Primary Cover
                </span>
              ) : (
                <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-black/70 text-text-muted">
                  #{idx + 1}
                </span>
              )}

              {/* Hover Actions Overlay */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                {idx !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    className="px-2 py-1 rounded-lg bg-accent-amber text-black text-[10px] font-bold shadow-glow-amber hover:bg-amber-400 transition"
                    title="Set this as the primary cover"
                  >
                    Set Primary
                  </button>
                )}
                <a
                  href={img}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-white/15 text-white hover:bg-white/30 transition"
                  title="View Full Image Link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1.5 rounded-lg bg-status-error text-white hover:bg-red-600 transition"
                  title="Remove this link"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-xl border border-dashed border-white/15 text-center text-text-dim text-xs">
          No images added yet. Paste any public image URL above to display this item on the customer website.
        </div>
      )}
    </div>
  );
}
