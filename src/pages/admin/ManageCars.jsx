import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  XCircle,
  X,
  Save,
  Filter,
  Check,
  Fuel,
  Users,
  Gauge,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import ImageUploader from '../../components/ImageUploader';
import { formatCurrency } from '../../utils/formatters';
import SEO from '../../components/SEO';
import toast from 'react-hot-toast';

const emptyCarForm = {
  id: '',
  name: '',
  brand: '',
  category: 'Luxury',
  hourlyPrice: 2000,
  dailyPrice: 15000,
  description: '',
  images: [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
  ],
  available: true,
  featured: false,
  active: true,
  specs: {
    seating: '5 Seater',
    fuel: 'Petrol',
    transmission: 'Automatic',
    mileage: '12 km/l',
    engine: '2.0L Turbo',
  },
  features: ['Air Conditioning', 'Surround Sound', 'Bluetooth Navigation'],
};

export default function ManageCars() {
  const { cars, saveSection } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formData, setFormData] = useState(emptyCarForm);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newFeatureText, setNewFeatureText] = useState('');

  // Extract categories
  const categories = ['All', ...Array.from(new Set(cars.map((c) => c.category).filter(Boolean)))];

  // Filtered cars
  const filteredCars = cars.filter((c) => {
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.brand?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setFormData({
      ...emptyCarForm,
      id: `car-${Date.now()}`,
    });
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (car) => {
    setFormData({
      ...car,
      specs: { ...emptyCarForm.specs, ...(car.specs || {}) },
      features: car.features || [],
    });
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Car name is required');
      return;
    }

    try {
      setSaving(true);
      const updatedTimestamp = new Date().toISOString();
      const carPayload = {
        ...formData,
        hourlyPrice: Number(formData.hourlyPrice),
        dailyPrice: Number(formData.dailyPrice),
        updatedAt: updatedTimestamp,
      };

      let updatedCars;
      if (isEditing) {
        updatedCars = cars.map((c) => (c.id === formData.id ? carPayload : c));
      } else {
        updatedCars = [carPayload, ...cars];
      }

      await saveSection('cars.json', updatedCars);
      setModalOpen(false);
    } catch (err) {
      // toast handled in saveSection
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (carId) => {
    try {
      const updatedCars = cars.filter((c) => c.id !== carId);
      await saveSection('cars.json', updatedCars);
      setDeleteConfirmId(null);
      toast.success('Car removed successfully');
    } catch (err) {
      toast.error('Failed to remove car');
    }
  };

  const handleToggleAvailability = async (car) => {
    const updated = cars.map((c) =>
      c.id === car.id ? { ...c, available: !c.available, updatedAt: new Date().toISOString() } : c
    );
    await saveSection('cars.json', updated);
  };

  const handleToggleFeatured = async (car) => {
    const updated = cars.map((c) =>
      c.id === car.id ? { ...c, featured: !c.featured, updatedAt: new Date().toISOString() } : c
    );
    await saveSection('cars.json', updated);
  };

  const handleAddFeature = (e) => {
    e.preventDefault();
    if (!newFeatureText.trim()) return;
    setFormData({
      ...formData,
      features: [...(formData.features || []), newFeatureText.trim()],
    });
    setNewFeatureText('');
  };

  const handleRemoveFeature = (idxToRemove) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, idx) => idx !== idxToRemove),
    });
  };

  return (
    <div className="space-y-6">
      <SEO title="Manage Cars - Admin" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Manage Luxury Cars</h1>
          <p className="text-xs text-text-muted">
            Add, update pricing, specifications, and availability for the vehicle fleet
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-accent-amber hover:bg-accent-amberHover text-black text-xs font-bold transition flex items-center space-x-1.5 shadow-glow-amber w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-text-dim absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by car name or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-secondary border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-accent-amber"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-accent-amber text-black font-bold'
                  : 'bg-dark-secondary text-text-muted hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Cars Data Table */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-secondary/80 text-text-dim uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Daily Rate</th>
                <th className="py-3 px-4">Hourly Rate</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-text-muted">
              {filteredCars.map((car) => (
                <tr key={car.id} className="hover:bg-white/[0.02] transition">
                  {/* Vehicle details */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={car.images?.[0] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=200&q=80'}
                        alt={car.name}
                        className="w-12 h-9 rounded-lg object-cover bg-dark-secondary flex-shrink-0 border border-white/10"
                      />
                      <div>
                        <div className="font-bold text-white text-sm line-clamp-1">{car.name}</div>
                        <div className="text-[10px] text-text-dim uppercase">{car.brand}</div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-text-muted border border-white/10">
                      {car.category}
                    </span>
                  </td>

                  {/* Daily Rate */}
                  <td className="py-3 px-4 font-bold text-white">
                    {formatCurrency(car.dailyPrice)}/day
                  </td>

                  {/* Hourly Rate */}
                  <td className="py-3 px-4">
                    {formatCurrency(car.hourlyPrice)}/hr
                  </td>

                  {/* Availability Toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleAvailability(car)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition ${
                        car.available
                          ? 'bg-status-success/20 text-status-success border border-status-success/30'
                          : 'bg-status-error/20 text-status-error border border-status-error/30'
                      }`}
                    >
                      {car.available ? 'Available' : 'Booked'}
                    </button>
                  </td>

                  {/* Featured Toggle */}
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(car)}
                      className={`p-1 rounded-lg transition ${
                        car.featured
                          ? 'text-accent-amber hover:text-amber-300'
                          : 'text-text-dim hover:text-white'
                      }`}
                      title={car.featured ? 'Unmark featured' : 'Mark featured'}
                    >
                      <Star className={`w-4 h-4 ${car.featured ? 'fill-accent-amber' : ''}`} />
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => handleOpenEdit(car)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white transition"
                      title="Edit Vehicle"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(car.id)}
                      className="p-1.5 rounded-lg bg-status-error/10 hover:bg-status-error text-status-error hover:text-white transition"
                      title="Delete Vehicle"
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
            <h3 className="text-lg font-bold text-white">Delete Vehicle?</h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Are you sure you want to delete this car? This will immediately remove it from the GitHub dataset.
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
                className="px-4 py-2 rounded-xl text-xs font-bold bg-status-error text-white hover:bg-red-600 shadow-glow"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Car Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-dark-card border border-white/10 rounded-2xl max-w-3xl w-full my-8 overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-dark-secondary/60">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-accent-amber" />
                <span>{isEditing ? 'Edit Vehicle Details' : 'Add New Luxury Vehicle'}</span>
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
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                    Vehicle Model Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Mercedes-Benz G63 AMG"
                    className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-accent-amber"
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
                    placeholder="e.g. Mercedes-Benz"
                    className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-accent-amber"
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
                    className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-accent-amber"
                  >
                    <option value="Luxury">Luxury</option>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sports">Sports</option>
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
                    className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-accent-amber"
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
                    className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-accent-amber"
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
                  placeholder="Detail the engine dynamics, luxury touches, interior comfort..."
                  className="w-full bg-dark-secondary border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-accent-amber resize-none"
                />
              </div>

              {/* Specifications */}
              <div className="space-y-3">
                <span className="block text-[11px] font-bold text-accent-amber uppercase tracking-wider">
                  Technical Specifications
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] text-text-dim block mb-1">Seating</label>
                    <input
                      type="text"
                      value={formData.specs?.seating || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specs: { ...formData.specs, seating: e.target.value },
                        })
                      }
                      placeholder="e.g. 5 Seater"
                      className="w-full bg-dark-secondary border border-white/10 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-text-dim block mb-1">Fuel Type</label>
                    <input
                      type="text"
                      value={formData.specs?.fuel || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specs: { ...formData.specs, fuel: e.target.value },
                        })
                      }
                      placeholder="e.g. Petrol / Diesel"
                      className="w-full bg-dark-secondary border border-white/10 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-text-dim block mb-1">Transmission</label>
                    <input
                      type="text"
                      value={formData.specs?.transmission || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specs: { ...formData.specs, transmission: e.target.value },
                        })
                      }
                      placeholder="e.g. 8-Speed Auto"
                      className="w-full bg-dark-secondary border border-white/10 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-text-dim block mb-1">Engine</label>
                    <input
                      type="text"
                      value={formData.specs?.engine || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specs: { ...formData.specs, engine: e.target.value },
                        })
                      }
                      placeholder="e.g. 3.0L V6"
                      className="w-full bg-dark-secondary border border-white/10 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Features Bullets */}
              <div className="space-y-2">
                <span className="block text-[11px] font-bold text-accent-amber uppercase tracking-wider">
                  Highlights & Features
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    placeholder="Add a feature (e.g. Panoramic Sunroof, Burmester Sound)..."
                    className="flex-1 bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 rounded-xl bg-dark-primary border border-white/10 text-white font-semibold hover:bg-white/5"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {formData.features?.map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-secondary text-text-muted border border-white/5 text-[11px]"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
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
                    className="rounded bg-dark-secondary border-white/10 text-accent-amber focus:ring-0"
                  />
                  <span className="text-white font-semibold">Available for Rent</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded bg-dark-secondary border-white/10 text-accent-amber focus:ring-0"
                  />
                  <span className="text-white font-semibold">Mark as Featured</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active !== false}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded bg-dark-secondary border-white/10 text-accent-amber focus:ring-0"
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
                  className="px-6 py-2.5 rounded-xl bg-accent-amber hover:bg-accent-amberHover text-black font-bold shadow-glow-amber flex items-center space-x-2 disabled:opacity-50"
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
