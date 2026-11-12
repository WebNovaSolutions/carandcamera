import React, { useState } from 'react';
import {
  Camera,
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  X,
  Save,
  Package,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import ImageUploader from '../../components/ImageUploader';
import { formatCurrency } from '../../utils/formatters';
import SEO from '../../components/SEO';
import toast from 'react-hot-toast';

const emptyCameraForm = {
  id: '',
  name: '',
  brand: '',
  model: '',
  category: 'Mirrorless Cameras',
  hourlyPrice: 500,
  dailyPrice: 3500,
  description: '',
  images: [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80',
  ],
  available: true,
  featured: false,
  active: true,
  specs: {
    sensor: 'Full-Frame CMOS',
    mount: 'Sony E-Mount',
    videoResolution: '4K 120p',
    codec: '10-Bit 4:2:2',
  },
  includedAccessories: ['2x Batteries', 'Dual Charger', '128GB Fast Card', 'Carry Case'],
  features: ['High Sensitivity', 'Real-Time Eye AF'],
};

export default function ManageCameras() {
  const { cameras, saveSection } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formData, setFormData] = useState(emptyCameraForm);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newAccessoryText, setNewAccessoryText] = useState('');

  // Extract categories
  const categories = [
    'All',
    ...Array.from(new Set(cameras.map((c) => c.category).filter(Boolean))),
  ];

  // Filtered cameras
  const filteredCameras = cameras.filter((c) => {
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.brand?.toLowerCase().includes(q) ||
        c.model?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setFormData({
      ...emptyCameraForm,
      id: `cam-${Date.now()}`,
    });
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (cam) => {
    setFormData({
      ...cam,
      specs: { ...emptyCameraForm.specs, ...(cam.specs || {}) },
      includedAccessories: cam.includedAccessories || [],
      features: cam.features || [],
    });
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Equipment name is required');
      return;
    }

    try {
      setSaving(true);
      const updatedTimestamp = new Date().toISOString();
      const cameraPayload = {
        ...formData,
        hourlyPrice: Number(formData.hourlyPrice),
        dailyPrice: Number(formData.dailyPrice),
        updatedAt: updatedTimestamp,
      };

      let updatedCameras;
      if (isEditing) {
        updatedCameras = cameras.map((c) => (c.id === formData.id ? cameraPayload : c));
      } else {
        updatedCameras = [cameraPayload, ...cameras];
      }

      await saveSection('cameras.json', updatedCameras);
      setModalOpen(false);
    } catch (err) {
      // toast handled in saveSection
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (camId) => {
    try {
      const updated = cameras.filter((c) => c.id !== camId);
      await saveSection('cameras.json', updated);
      setDeleteConfirmId(null);
      toast.success('Equipment removed');
    } catch (err) {
      toast.error('Failed to remove equipment');
    }
  };

  const handleToggleAvailability = async (cam) => {
    const updated = cameras.map((c) =>
      c.id === cam.id ? { ...c, available: !c.available, updatedAt: new Date().toISOString() } : c
    );
    await saveSection('cameras.json', updated);
  };

  const handleToggleFeatured = async (cam) => {
    const updated = cameras.map((c) =>
      c.id === cam.id ? { ...c, featured: !c.featured, updatedAt: new Date().toISOString() } : c
    );
    await saveSection('cameras.json', updated);
  };

  const handleAddAccessory = (e) => {
    e.preventDefault();
    if (!newAccessoryText.trim()) return;
    setFormData({
      ...formData,
      includedAccessories: [...(formData.includedAccessories || []), newAccessoryText.trim()],
    });
    setNewAccessoryText('');
  };

  const handleRemoveAccessory = (idxToRemove) => {
    setFormData({
      ...formData,
      includedAccessories: formData.includedAccessories.filter((_, idx) => idx !== idxToRemove),
    });
  };

  return (
    <div className="space-y-6">
      <SEO title="Manage Cameras & Equipment - Admin" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Manage Camera Equipment</h1>
          <p className="text-xs text-text-muted">
            Add, update pricing, technical specs, accessories, and availability
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-accent-blue hover:bg-accent-blueHover text-black text-xs font-bold transition flex items-center space-x-1.5 shadow-glow-blue w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Equipment</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-text-dim absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, brand, or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-secondary border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-accent-blue"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-accent-blue text-black font-bold'
                  : 'bg-dark-secondary text-text-muted hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cameras Data Table */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-secondary/80 text-text-dim uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Equipment</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Daily Rate</th>
                <th className="py-3 px-4">Hourly Rate</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-text-muted">
              {filteredCameras.map((cam) => (
                <tr key={cam.id} className="hover:bg-white/[0.02] transition">
                  {/* Gear details */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={cam.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=200&q=80'}
                        alt={cam.name}
                        className="w-12 h-9 rounded-lg object-cover bg-dark-secondary flex-shrink-0 border border-white/10"
                      />
                      <div>
                        <div className="font-bold text-white text-sm line-clamp-1">{cam.name}</div>
                        <div className="text-[10px] text-text-dim uppercase">
                          {cam.brand} {cam.model && `• ${cam.model}`}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-text-muted border border-white/10">
                      {cam.category}
                    </span>
                  </td>

                  {/* Daily Rate */}
                  <td className="py-3 px-4 font-bold text-white">
                    {formatCurrency(cam.dailyPrice)}/day
                  </td>

                  {/* Hourly Rate */}
                  <td className="py-3 px-4">
                    {formatCurrency(cam.hourlyPrice)}/hr
                  </td>

                  {/* Availability Toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleAvailability(cam)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition ${
                        cam.available
                          ? 'bg-status-success/20 text-status-success border border-status-success/30'
                          : 'bg-status-error/20 text-status-error border border-status-error/30'
                      }`}
                    >
                      {cam.available ? 'Available' : 'Booked'}
                    </button>
                  </td>

                  {/* Featured Toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(cam)}
                      className={`p-1 rounded-lg transition ${
                        cam.featured
                          ? 'text-accent-blue hover:text-sky-300'
                          : 'text-text-dim hover:text-white'
                      }`}
                      title={cam.featured ? 'Unmark featured' : 'Mark featured'}
                    >
                      <Star className={`w-4 h-4 ${cam.featured ? 'fill-accent-blue' : ''}`} />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => handleOpenEdit(cam)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition"
                      title="Edit Equipment"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(cam.id)}
                      className="p-1.5 rounded-lg bg-status-error/10 hover:bg-status-error text-status-error hover:text-white transition"
                      title="Delete Equipment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-card border border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Delete Equipment?</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Are you sure you want to delete this camera item? This will remove it from the GitHub dataset.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-dark-secondary text-text-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-status-error text-white hover:bg-red-600"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Camera Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-dark-card border border-white/10 rounded-2xl max-w-3xl w-full my-8 overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-dark-secondary/60">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-accent-blue" />
                <span>{isEditing ? 'Edit Camera Gear' : 'Add New Camera Equipment'}</span>
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-text-dim hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
              {/* Image Uploader */}
              <ImageUploader
                images={formData.images || []}
                onChange={(imgs) => setFormData({ ...formData, images: imgs })}
                maxImages={6}
              />

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                    Equipment Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sony FX6 Cinema Line"
                    className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-accent-blue"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Sony / Canon / RED"
                    className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-accent-blue"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                    Model Code
                  </label>
                  <input
                    type="text"
                    value={formData.model || ''}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="e.g. ILME-FX6V"
                    className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-accent-blue"
                  />
                </div>
              </div>

              {/* Category & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-accent-blue"
                  >
                    <option value="Mirrorless Cameras">Mirrorless Cameras</option>
                    <option value="DSLR Cameras">DSLR Cameras</option>
                    <option value="Lenses">Lenses</option>
                    <option value="Lighting Equipment">Lighting Equipment</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                    Daily Rental Rate (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.dailyPrice}
                    onChange={(e) => setFormData({ ...formData, dailyPrice: e.target.value })}
                    className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-accent-blue"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                    Hourly Rental Rate (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.hourlyPrice}
                    onChange={(e) => setFormData({ ...formData, hourlyPrice: e.target.value })}
                    className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-accent-blue"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail dynamic range, low light capabilities, cooling, sensor..."
                  className="w-full bg-dark-secondary border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-accent-blue resize-none"
                />
              </div>

              {/* Specifications */}
              <div className="space-y-3">
                <span className="block text-[11px] font-bold text-accent-blue uppercase tracking-wider">
                  Technical Specifications
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] text-text-dim block mb-1">Sensor</label>
                    <input
                      type="text"
                      value={formData.specs?.sensor || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specs: { ...formData.specs, sensor: e.target.value },
                        })
                      }
                      placeholder="e.g. 10.2MP Full-Frame"
                      className="w-full bg-dark-secondary border border-white/10 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-text-dim block mb-1">Lens Mount</label>
                    <input
                      type="text"
                      value={formData.specs?.mount || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specs: { ...formData.specs, mount: e.target.value },
                        })
                      }
                      placeholder="e.g. Sony E-Mount / PL"
                      className="w-full bg-dark-secondary border border-white/10 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-text-dim block mb-1">Video Resolution</label>
                    <input
                      type="text"
                      value={formData.specs?.videoResolution || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specs: { ...formData.specs, videoResolution: e.target.value },
                        })
                      }
                      placeholder="e.g. 4K 120p, 16-Bit RAW"
                      className="w-full bg-dark-secondary border border-white/10 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-text-dim block mb-1">Codec / Color</label>
                    <input
                      type="text"
                      value={formData.specs?.codec || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specs: { ...formData.specs, codec: e.target.value },
                        })
                      }
                      placeholder="e.g. 10-Bit 4:2:2 All-Intra"
                      className="w-full bg-dark-secondary border border-white/10 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Included Accessories */}
              <div className="space-y-2">
                <span className="block text-[11px] font-bold text-accent-blue uppercase tracking-wider">
                  Included Accessories In Rental Kit
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAccessoryText}
                    onChange={(e) => setNewAccessoryText(e.target.value)}
                    placeholder="Add kit item (e.g. 2x BP-U60 Batteries, Hard Case)..."
                    className="flex-1 bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddAccessory}
                    className="px-4 py-2 rounded-xl bg-dark-primary border border-white/10 text-white font-semibold hover:bg-white/5"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {formData.includedAccessories?.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-secondary text-text-muted border border-white/5 text-[11px]"
                    >
                      <Package className="w-3 h-3 text-accent-blue" />
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAccessory(idx)}
                        className="text-text-dim hover:text-status-error"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Status Toggles */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/5">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="rounded bg-dark-secondary border-white/10 text-accent-blue focus:ring-0"
                  />
                  <span className="text-white font-semibold">In Stock / Available</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded bg-dark-secondary border-white/10 text-accent-blue focus:ring-0"
                  />
                  <span className="text-white font-semibold">Mark as Featured</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active !== false}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded bg-dark-secondary border-white/10 text-accent-blue focus:ring-0"
                  />
                  <span className="text-white font-semibold">Listing Active</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-dark-secondary text-text-muted hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-accent-blue hover:bg-accent-blueHover text-black font-bold shadow-glow-blue flex items-center space-x-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save & Commit to GitHub'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
