import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, CheckCircle2, X, Save, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../utils/formatters';
import SEO from '../../components/SEO';
import toast from 'react-hot-toast';

const emptyServiceForm = {
  id: '',
  title: '',
  category: 'Automotive',
  description: '',
  hourlyPrice: 1000,
  dailyPrice: 8000,
  features: ['Trained Professionals', 'Verified Equipment'],
  active: true,
};

export default function ManageServices() {
  const { services, saveSection } = useData();

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState(emptyServiceForm);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleOpenAdd = () => {
    setFormData({
      ...emptyServiceForm,
      id: `srv-${Date.now()}`,
    });
    setIsEditing(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (srv) => {
    setFormData({
      ...srv,
      features: srv.features || [],
    });
    setIsEditing(true);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Service title is required');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        hourlyPrice: Number(formData.hourlyPrice),
        dailyPrice: Number(formData.dailyPrice),
      };

      let updated;
      if (isEditing) {
        updated = services.map((s) => (s.id === formData.id ? payload : s));
      } else {
        updated = [payload, ...services];
      }

      await saveSection('services.json', updated);
      setModalOpen(false);
    } catch (err) {
      // handled
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const updated = services.filter((s) => s.id !== id);
      await saveSection('services.json', updated);
      setDeleteConfirmId(null);
      toast.success('Service package removed');
    } catch (err) {
      toast.error('Failed to remove service');
    }
  };

  const handleToggleActive = async (srv) => {
    const updated = services.map((s) =>
      s.id === srv.id ? { ...s, active: !s.active } : s
    );
    await saveSection('services.json', updated);
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

  const handleRemoveFeature = (idx) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="space-y-6">
      <SEO title="Manage Services & Pricing - Admin" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Services & Pricing Packages</h1>
          <p className="text-xs text-text-muted">
            Configure rental packages, chauffeur transfers, and production crew packages
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-accent-amber hover:bg-accent-amberHover text-black text-xs font-bold transition flex items-center space-x-1.5 shadow-glow-amber w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Package</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-accent-amber border border-accent-amber/20">
                  {srv.category}
                </span>

                <button
                  onClick={() => handleToggleActive(srv)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    srv.active !== false
                      ? 'bg-status-success/20 text-status-success'
                      : 'bg-status-error/20 text-status-error'
                  }`}
                >
                  {srv.active !== false ? 'Active' : 'Disabled'}
                </button>
              </div>

              <h3 className="text-base font-bold text-white mb-2">{srv.title}</h3>
              <p className="text-xs text-text-muted line-clamp-3 mb-4 leading-relaxed">
                {srv.description}
              </p>

              {srv.features && (
                <div className="space-y-1.5 mb-5 text-[11px] text-text-muted">
                  {srv.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-accent-amber flex-shrink-0" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="flex items-baseline justify-between py-3 border-t border-white/5 mb-4">
                <div>
                  <span className="text-xl font-extrabold text-white">
                    {formatCurrency(srv.dailyPrice)}
                  </span>
                  <span className="text-[10px] text-text-dim ml-0.5">/day</span>
                </div>
                {srv.hourlyPrice && (
                  <span className="text-xs text-text-dim">
                    {formatCurrency(srv.hourlyPrice)}/hr
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEdit(srv)}
                  className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeleteConfirmId(srv.id)}
                  className="p-2 rounded-xl bg-status-error/10 hover:bg-status-error text-status-error hover:text-white transition"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-dark-card border border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h3 className="text-lg font-bold text-white">Delete Package?</h3>
            <p className="text-xs text-text-muted">
              Are you sure you want to delete this service package from the catalog?
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs bg-dark-secondary text-text-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-status-error text-white"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-dark-card border border-white/10 rounded-2xl max-w-lg w-full my-8 overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-dark-secondary/60">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-accent-amber" />
                <span>{isEditing ? 'Edit Service Package' : 'New Service Package'}</span>
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-text-dim hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                  Package Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Turnkey Commercial Cine Kit"
                  className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-dark-secondary border border-white/10 rounded-xl px-2.5 py-2 text-white"
                  >
                    <option value="Automotive">Automotive</option>
                    <option value="Camera">Camera</option>
                    <option value="Combo Package">Combo Package</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                    Daily Rate (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.dailyPrice}
                    onChange={(e) => setFormData({ ...formData, dailyPrice: e.target.value })}
                    className="w-full bg-dark-secondary border border-white/10 rounded-xl px-2.5 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                    Hourly Rate (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.hourlyPrice}
                    onChange={(e) => setFormData({ ...formData, hourlyPrice: e.target.value })}
                    className="w-full bg-dark-secondary border border-white/10 rounded-xl px-2.5 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-dark-secondary border border-white/10 rounded-xl p-3 text-white resize-none"
                />
              </div>

              {/* Features bullets */}
              <div className="space-y-2">
                <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider">
                  Features Included In Service
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    placeholder="Add service benefit..."
                    className="flex-1 bg-dark-secondary border border-white/10 rounded-xl px-3 py-1.5 text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-1.5 rounded-xl bg-dark-primary border border-white/10 text-white font-semibold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.features?.map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-dark-secondary text-text-muted border border-white/5 text-[11px]"
                    >
                      <span>{f}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(i)}
                        className="text-text-dim hover:text-status-error"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-white/5">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active !== false}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded bg-dark-secondary border-white/10 text-accent-amber"
                  />
                  <span className="text-white font-semibold">Service Active on Website</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-dark-secondary text-text-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-accent-amber text-black font-bold shadow-glow-amber flex items-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
