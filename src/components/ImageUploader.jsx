import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Plus, Check } from 'lucide-react';
import { uploadToCloudinary } from '../services/api';
import toast from 'react-hot-toast';

export default function ImageUploader({
  images = [],
  onChange,
  maxImages = 6,
  label = 'Images (First image is primary display)',
}) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    try {
      setUploading(true);
      const uploadToast = toast.loading('Uploading image...');

      for (const file of files) {
        const result = await uploadToCloudinary(file);
        if (result && result.url) {
          onChange([...images, result.url]);
        }
      }

      toast.success('Image added successfully!', { id: uploadToast });
    } catch (err) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    if (images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }
    onChange([...images, customUrl.trim()]);
    setCustomUrl('');
    setShowUrlInput(false);
    toast.success('Image URL added!');
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
    toast.success('Set as primary image');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
          {label} ({images.length}/{maxImages})
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-xs text-accent-blue hover:underline flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide URL Input' : 'Add Direct Image URL'}</span>
        </button>
      </div>

      {/* URL Input Bar */}
      {showUrlInput && (
        <div className="flex items-center gap-2 p-3 bg-dark-secondary rounded-xl border border-white/10">
          <input
            type="url"
            placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="flex-1 bg-dark-primary border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-accent-blue"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-3 py-1.5 rounded-lg bg-accent-blue text-black font-bold text-xs"
          >
            Add
          </button>
        </div>
      )}

      {/* Image Previews Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="relative aspect-[4/3] rounded-xl overflow-hidden bg-dark-secondary border border-white/10 group"
          >
            <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />

            {/* Primary Badge */}
            {idx === 0 && (
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-accent-amber text-black shadow-glow-amber">
                Primary
              </span>
            )}

            {/* Hover Actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              {idx !== 0 && (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(idx)}
                  className="p-1.5 rounded-lg bg-white/20 text-white hover:bg-white/40 text-[10px] font-semibold"
                  title="Make Primary Image"
                >
                  Set Primary
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="p-1.5 rounded-lg bg-status-error text-white hover:bg-red-600"
                title="Remove Image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Upload Trigger Box */}
        {images.length < maxImages && (
          <label className="relative aspect-[4/3] rounded-xl border-2 border-dashed border-white/15 hover:border-accent-amber transition flex flex-col items-center justify-center cursor-pointer bg-white/[0.01] hover:bg-white/[0.03]">
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={handleFileUpload}
              className="sr-only"
            />
            {uploading ? (
              <div className="flex flex-col items-center space-y-1">
                <div className="w-5 h-5 border-2 border-accent-amber border-t-transparent rounded-full animate-spin" />
                <span className="text-[10px] text-text-dim">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-1 text-text-dim hover:text-white">
                <Upload className="w-5 h-5 text-accent-amber" />
                <span className="text-[11px] font-semibold">Upload Image</span>
                <span className="text-[9px] text-text-dim">JPG, PNG, WebP</span>
              </div>
            )}
          </label>
        )}
      </div>
    </div>
  );
}
