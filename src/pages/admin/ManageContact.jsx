import React, { useState } from 'react';
import { PhoneCall, MessageSquare, Mail, MapPin, Globe, Save, Instagram, Facebook, Youtube, Twitter } from 'lucide-react';
import { useData } from '../../context/DataContext';
import SEO from '../../components/SEO';
import toast from 'react-hot-toast';

export default function ManageContact() {
  const { contact, saveSection } = useData();

  const [formData, setFormData] = useState(
    contact || {
      whatsappNumber: '919876543210',
      phoneNumber: '+91 98765 43210',
      email: 'rentals@apexmotion.com',
      businessAddress: '',
      googleMapsEmbed: '',
      googleMapsLink: '',
      openingHours: '',
      socialLinks: {},
    }
  );

  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.whatsappNumber) {
      toast.error('WhatsApp number is required');
      return;
    }

    try {
      setSaving(true);
      await saveSection('contact.json', formData);
    } catch (err) {
      // handled
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <SEO title="Manage Contact & WhatsApp - Admin" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Contact & WhatsApp Desk</h1>
          <p className="text-xs text-text-muted">
            Configure the recipient WhatsApp number for customer enquiries and update business details
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-accent-amber hover:bg-accent-amberHover text-black text-xs font-bold transition flex items-center space-x-1.5 shadow-glow-amber w-fit"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save & Commit Contact Info'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Crucial WhatsApp Box */}
        <div className="glass-card p-6 rounded-2xl border border-status-success/30 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-status-success text-black flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5 fill-black" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Recipient WhatsApp Business Number</h3>
              <p className="text-text-muted text-[11px]">
                All car and camera rental enquiry links (`https://wa.me/&lt;number&gt;`) will be routed to this number. Include country code without '+' or spaces.
              </p>
            </div>
          </div>

          <div className="max-w-md">
            <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
              WhatsApp Number (Format: 919876543210) *
            </label>
            <input
              type="text"
              required
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              placeholder="e.g. 919876543210"
              className="w-full bg-dark-secondary border border-white/10 rounded-xl px-4 py-2.5 text-status-success font-mono font-bold text-sm focus:outline-none focus:border-status-success"
            />
          </div>
        </div>

        {/* General Contact Info */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/5 space-y-4">
          <h3 className="text-base font-bold text-white mb-2">Direct Support Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                Display Phone Number
              </label>
              <input
                type="text"
                value={formData.phoneNumber || ''}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                Contact Email Address
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="rentals@apexmotion.com"
                className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
              Physical Business / Hub Address
            </label>
            <input
              type="text"
              value={formData.businessAddress || ''}
              onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
              placeholder="Plot 42, Aerocity, New Delhi, India"
              className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
              Opening Hours / Availability
            </label>
            <input
              type="text"
              value={formData.openingHours || ''}
              onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
              placeholder="Monday - Sunday: 24/7 Support Desk"
              className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white"
            />
          </div>
        </div>

        {/* Google Maps Embed & Link */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/5 space-y-4">
          <h3 className="text-base font-bold text-white mb-2">Location & Google Maps</h3>

          <div>
            <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
              Google Maps Embed URL (Iframe src)
            </label>
            <input
              type="url"
              value={formData.googleMapsEmbed || ''}
              onChange={(e) => setFormData({ ...formData, googleMapsEmbed: e.target.value })}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
              Google Maps Direct Link
            </label>
            <input
              type="url"
              value={formData.googleMapsLink || ''}
              onChange={(e) => setFormData({ ...formData, googleMapsLink: e.target.value })}
              placeholder="https://maps.google.com/?q=..."
              className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white"
            />
          </div>
        </div>

        {/* Social Media Links */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/5 space-y-4">
          <h3 className="text-base font-bold text-white mb-2">Social Media Channels</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.socialLinks?.instagram || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                  })
                }
                placeholder="https://instagram.com/..."
                className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                value={formData.socialLinks?.facebook || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, facebook: e.target.value },
                  })
                }
                placeholder="https://facebook.com/..."
                className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                YouTube URL
              </label>
              <input
                type="url"
                value={formData.socialLinks?.youtube || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, youtube: e.target.value },
                  })
                }
                placeholder="https://youtube.com/@..."
                className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-dim uppercase tracking-wider mb-1">
                Twitter / X URL
              </label>
              <input
                type="url"
                value={formData.socialLinks?.twitter || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                  })
                }
                placeholder="https://twitter.com/..."
                className="w-full bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-accent-amber hover:bg-accent-amberHover text-black text-xs font-bold shadow-glow-amber flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save & Commit Contact Info'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
