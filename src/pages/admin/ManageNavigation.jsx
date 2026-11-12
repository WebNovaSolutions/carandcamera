import React, { useState } from 'react';
import { Navigation as NavIcon, Plus, Trash2, Save, MoveUp, MoveDown } from 'lucide-react';
import { useData } from '../../context/DataContext';
import SEO from '../../components/SEO';
import toast from 'react-hot-toast';

export default function ManageNavigation() {
  const { navigation, saveSection } = useData();

  const [formData, setFormData] = useState(
    navigation || {
      headerLinks: [],
      footerColumns: [],
    }
  );

  const [saving, setSaving] = useState(false);
  const [newHeaderLabel, setNewHeaderLabel] = useState('');
  const [newHeaderPath, setNewHeaderPath] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await saveSection('navigation.json', formData);
    } catch (err) {
      // handled
    } finally {
      setSaving(false);
    }
  };

  const handleAddHeaderLink = (e) => {
    e.preventDefault();
    if (!newHeaderLabel.trim() || !newHeaderPath.trim()) return;

    setFormData({
      ...formData,
      headerLinks: [
        ...(formData.headerLinks || []),
        { id: `nav-${Date.now()}`, label: newHeaderLabel.trim(), path: newHeaderPath.trim() },
      ],
    });
    setNewHeaderLabel('');
    setNewHeaderPath('');
  };

  const handleRemoveHeaderLink = (idx) => {
    setFormData({
      ...formData,
      headerLinks: formData.headerLinks.filter((_, i) => i !== idx),
    });
  };

  const handleUpdateHeaderLink = (idx, field, value) => {
    const updated = [...(formData.headerLinks || [])];
    updated[idx] = { ...updated[idx], [field]: value };
    setFormData({ ...formData, headerLinks: updated });
  };

  const handleAddFooterColumn = () => {
    setFormData({
      ...formData,
      footerColumns: [
        ...(formData.footerColumns || []),
        { id: `col-${Date.now()}`, title: 'New Column', links: [{ label: 'New Link', path: '/' }] },
      ],
    });
  };

  const handleAddFooterLink = (colIdx) => {
    const updatedCols = [...(formData.footerColumns || [])];
    updatedCols[colIdx].links.push({ label: 'New Link', path: '/' });
    setFormData({ ...formData, footerColumns: updatedCols });
  };

  const handleRemoveFooterLink = (colIdx, linkIdx) => {
    const updatedCols = [...(formData.footerColumns || [])];
    updatedCols[colIdx].links = updatedCols[colIdx].links.filter((_, i) => i !== linkIdx);
    setFormData({ ...formData, footerColumns: updatedCols });
  };

  return (
    <div className="space-y-6">
      <SEO title="Manage Header & Footer - Admin" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Header & Footer Navigation</h1>
          <p className="text-xs text-text-muted">
            Configure header menu items and footer multi-column links stored in GitHub JSON
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-accent-amber hover:bg-accent-amberHover text-black text-xs font-bold transition flex items-center space-x-1.5 shadow-glow-amber w-fit"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save & Commit Navigation'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Header Navigation Links */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/5 space-y-4">
          <h3 className="text-base font-bold text-white mb-1">Header Navbar Links</h3>
          <p className="text-text-dim text-[11px]">Manage links displayed in the desktop and mobile navigation header</p>

          <div className="space-y-3 pt-2">
            {formData.headerLinks?.map((link, idx) => (
              <div key={link.id || idx} className="flex items-center gap-3 p-3 bg-dark-secondary rounded-xl border border-white/5">
                <div className="w-1/3">
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) => handleUpdateHeaderLink(idx, 'label', e.target.value)}
                    placeholder="Label (e.g. Luxury Cars)"
                    className="w-full bg-dark-primary border border-white/10 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={link.path}
                    onChange={(e) => handleUpdateHeaderLink(idx, 'path', e.target.value)}
                    placeholder="Route Path (e.g. /cars)"
                    className="w-full bg-dark-primary border border-white/10 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveHeaderLink(idx)}
                  className="p-2 rounded-lg text-text-dim hover:text-status-error hover:bg-status-error/10 transition"
                  title="Remove link"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Header Link */}
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-text-muted block mb-2">Add New Navigation Link</span>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Link Label (e.g. Wedding Packages)"
                value={newHeaderLabel}
                onChange={(e) => setNewHeaderLabel(e.target.value)}
                className="flex-1 bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white"
              />
              <input
                type="text"
                placeholder="Path (e.g. /services)"
                value={newHeaderPath}
                onChange={(e) => setNewHeaderPath(e.target.value)}
                className="flex-1 bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white font-mono"
              />
              <button
                type="button"
                onClick={handleAddHeaderLink}
                className="px-4 py-2 rounded-xl bg-accent-amber text-black font-bold flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Link</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Columns */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Footer Columns & Links</h3>
              <p className="text-text-dim text-[11px]">Configure footer links grouped by column</p>
            </div>
            <button
              type="button"
              onClick={handleAddFooterColumn}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold flex items-center gap-1 border border-white/10"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Column</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {formData.footerColumns?.map((col, colIdx) => (
              <div key={col.id || colIdx} className="p-4 rounded-xl bg-dark-secondary border border-white/5 space-y-3">
                <div>
                  <label className="text-[10px] text-text-dim block mb-1">Column Header Title</label>
                  <input
                    type="text"
                    value={col.title}
                    onChange={(e) => {
                      const updated = [...formData.footerColumns];
                      updated[colIdx].title = e.target.value;
                      setFormData({ ...formData, footerColumns: updated });
                    }}
                    className="w-full bg-dark-primary border border-white/10 rounded-lg p-2 text-white font-bold"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <span className="text-[10px] text-text-dim uppercase tracking-wider block">Links</span>
                  {col.links?.map((link, linkIdx) => (
                    <div key={linkIdx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const updated = [...formData.footerColumns];
                          updated[colIdx].links[linkIdx].label = e.target.value;
                          setFormData({ ...formData, footerColumns: updated });
                        }}
                        className="w-1/2 bg-dark-primary border border-white/10 rounded-lg p-1.5 text-white text-[11px]"
                      />
                      <input
                        type="text"
                        value={link.path}
                        onChange={(e) => {
                          const updated = [...formData.footerColumns];
                          updated[colIdx].links[linkIdx].path = e.target.value;
                          setFormData({ ...formData, footerColumns: updated });
                        }}
                        className="w-1/2 bg-dark-primary border border-white/10 rounded-lg p-1.5 text-white text-[11px] font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFooterLink(colIdx, linkIdx)}
                        className="text-text-dim hover:text-status-error p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddFooterLink(colIdx)}
                    className="text-accent-amber hover:underline text-[11px] font-semibold flex items-center gap-1 pt-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Link to this Column</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-accent-amber hover:bg-accent-amberHover text-black text-xs font-bold shadow-glow-amber flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Commit Navigation to GitHub'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
