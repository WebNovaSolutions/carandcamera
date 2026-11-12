import React, { useState } from 'react';
import { Globe, Save, Sparkles, MessageSquare, Plus, Trash2, Star, Check } from 'lucide-react';
import { useData } from '../../context/DataContext';
import ImageUploader from '../../components/ImageUploader';
import SEO from '../../components/SEO';
import toast from 'react-hot-toast';

export default function ManageWebsite() {
  const { website, saveSection } = useData();

  const [formData, setFormData] = useState(
    website || {
      name: 'ApexMotion Rentals',
      hero: {},
      about: {},
      whyChooseUs: [],
      testimonials: [],
      footer: {},
    }
  );

  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero'); // 'hero', 'about', 'whyUs', 'testimonials', 'footer'

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await saveSection('website.json', formData);
    } catch (err) {
      // handled
    } finally {
      setSaving(false);
    }
  };

  const handleAddTestimonial = () => {
    const newT = {
      id: Date.now(),
      name: 'New Client',
      role: 'Filmmaker / Producer',
      rating: 5,
      avatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      comment: 'Excellent vehicle condition and prompt delivery.',
    };
    setFormData({
      ...formData,
      testimonials: [...(formData.testimonials || []), newT],
    });
  };

  const handleUpdateTestimonial = (idx, field, value) => {
    const updated = [...(formData.testimonials || [])];
    updated[idx] = { ...updated[idx], [field]: value };
    setFormData({ ...formData, testimonials: updated });
  };

  const handleRemoveTestimonial = (idx) => {
    const updated = formData.testimonials.filter((_, i) => i !== idx);
    setFormData({ ...formData, testimonials: updated });
  };

  return (
    <div className="space-y-6">
      <SEO title="Manage Website Content - Admin" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Website Content & Copy</h1>
          <p className="text-xs text-text-muted">
            Update headings, hero images, testimonials, and brand descriptions stored in GitHub JSON
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-accent-amber hover:bg-accent-amberHover text-black text-xs font-bold transition flex items-center space-x-1.5 shadow-glow-amber w-fit disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving Changes...' : 'Save & Commit Website Content'}</span>
        </button>
      </div>

      {/* Content Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2 overflow-x-auto scrollbar-none text-xs">
        {[
          { id: 'hero', label: 'Hero & Headlines' },
          { id: 'about', label: 'About Section' },
          { id: 'whyUs', label: 'Why Choose Us Cards' },
          { id: 'testimonials', label: 'Client Testimonials' },
          { id: 'footer', label: 'Footer & Copyright' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'bg-accent-amber text-black shadow-glow-amber'
                : 'text-text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* HERO TAB */}
        {activeTab === 'hero' && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/5 space-y-5 text-xs">
            <h3 className="text-base font-bold text-white mb-2">Homepage Hero Settings</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                  Website / Brand Name
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                  Site Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                Hero Main Headline
              </label>
              <input
                type="text"
                value={formData.hero?.headline || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, headline: e.target.value },
                  })
                }
                className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                Hero Subtitle Text
              </label>
              <textarea
                rows={3}
                value={formData.hero?.subtitle || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, subtitle: e.target.value },
                  })
                }
                className="w-full bg-dark-secondary border border-white/10 rounded-xl p-3 text-white resize-none"
              />
            </div>

            {/* Hero Background Image */}
            <ImageUploader
              label="Hero Background Wallpaper"
              images={formData.hero?.bgImage ? [formData.hero.bgImage] : []}
              onChange={(imgs) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, bgImage: imgs[0] || '' },
                })
              }
              maxImages={1}
            />

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/5">
              <div>
                <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                  Primary CTA Label
                </label>
                <input
                  type="text"
                  value={formData.hero?.ctaPrimary?.label || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: {
                        ...formData.hero,
                        ctaPrimary: {
                          ...formData.hero?.ctaPrimary,
                          label: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                  Secondary CTA Label
                </label>
                <input
                  type="text"
                  value={formData.hero?.ctaSecondary?.label || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: {
                        ...formData.hero,
                        ctaSecondary: {
                          ...formData.hero?.ctaSecondary,
                          label: e.target.value,
                        },
                      },
                    })
                  }
                  className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/5 space-y-5 text-xs">
            <h3 className="text-base font-bold text-white mb-2">About Section Copy</h3>

            <div>
              <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                About Section Heading
              </label>
              <input
                type="text"
                value={formData.about?.title || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: { ...formData.about, title: e.target.value },
                  })
                }
                className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                About Story & Mission Description
              </label>
              <textarea
                rows={5}
                value={formData.about?.description || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: { ...formData.about, description: e.target.value },
                  })
                }
                className="w-full bg-dark-secondary border border-white/10 rounded-xl p-3 text-white"
              />
            </div>
          </div>
        )}

        {/* WHY CHOOSE US TAB */}
        {activeTab === 'whyUs' && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/5 space-y-5 text-xs">
            <h3 className="text-base font-bold text-white mb-2">Why Choose Us Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.whyChooseUs?.map((item, idx) => (
                <div key={item.id || idx} className="p-4 rounded-xl bg-dark-secondary border border-white/5 space-y-2">
                  <label className="text-[10px] text-accent-amber font-mono uppercase block font-bold">
                    Benefit #{idx + 1}
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => {
                      const updated = [...formData.whyChooseUs];
                      updated[idx].title = e.target.value;
                      setFormData({ ...formData, whyChooseUs: updated });
                    }}
                    className="w-full bg-dark-primary border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={item.desc}
                    onChange={(e) => {
                      const updated = [...formData.whyChooseUs];
                      updated[idx].desc = e.target.value;
                      setFormData({ ...formData, whyChooseUs: updated });
                    }}
                    className="w-full bg-dark-primary border border-white/10 rounded-lg p-2 text-white resize-none text-[11px]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TESTIMONIALS TAB */}
        {activeTab === 'testimonials' && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/5 space-y-5 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Client Testimonials</h3>
                <p className="text-text-dim text-[11px]">Manage reviews displayed on the homepage</p>
              </div>
              <button
                type="button"
                onClick={handleAddTestimonial}
                className="px-3 py-1.5 rounded-lg bg-accent-amber text-black font-bold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Review</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.testimonials?.map((t, idx) => (
                <div
                  key={t.id || idx}
                  className="p-4 rounded-xl bg-dark-secondary border border-white/5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-white">Review #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTestimonial(idx)}
                      className="text-status-error hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-text-dim block mb-1">Client Name</label>
                      <input
                        type="text"
                        value={t.name}
                        onChange={(e) => handleUpdateTestimonial(idx, 'name', e.target.value)}
                        className="w-full bg-dark-primary border border-white/10 rounded-lg p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-text-dim block mb-1">Profession / Role</label>
                      <input
                        type="text"
                        value={t.role}
                        onChange={(e) => handleUpdateTestimonial(idx, 'role', e.target.value)}
                        className="w-full bg-dark-primary border border-white/10 rounded-lg p-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-text-dim block mb-1">Avatar Image URL</label>
                      <input
                        type="url"
                        value={t.avatar}
                        onChange={(e) => handleUpdateTestimonial(idx, 'avatar', e.target.value)}
                        className="w-full bg-dark-primary border border-white/10 rounded-lg p-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-text-dim block mb-1">Review Comment</label>
                    <textarea
                      rows={2}
                      value={t.comment}
                      onChange={(e) => handleUpdateTestimonial(idx, 'comment', e.target.value)}
                      className="w-full bg-dark-primary border border-white/10 rounded-lg p-2 text-white resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER TAB */}
        {activeTab === 'footer' && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/5 space-y-5 text-xs">
            <h3 className="text-base font-bold text-white mb-2">Footer & Legal Text</h3>

            <div>
              <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                Footer Brand Description
              </label>
              <textarea
                rows={3}
                value={formData.footer?.description || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footer: { ...formData.footer, description: e.target.value },
                  })
                }
                className="w-full bg-dark-secondary border border-white/10 rounded-xl p-3 text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                Copyright Text
              </label>
              <input
                type="text"
                value={formData.footer?.copyright || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footer: { ...formData.footer, copyright: e.target.value },
                  })
                }
                className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
        )}

        {/* Floating Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-accent-amber hover:bg-accent-amberHover text-black text-xs font-bold shadow-glow-amber flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Commit Changes to GitHub'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
