import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Send,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import SectionHeader from '../components/SectionHeader';
import SEO from '../components/SEO';
import { generateWhatsAppBookingUrl, generateDirectContactUrl } from '../services/whatsapp';
import toast from 'react-hot-toast';

export default function Contact() {
  const { contact } = useData();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    interest: 'General Enquiry',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) {
      toast.error('Please fill in your name and message');
      return;
    }

    const businessNumber = contact?.whatsappNumber || '919876543210';
    let text = `Hello ApexMotion,\n\n`;
    text += `👤 *Name:* ${formData.name}\n`;
    if (formData.phone) text += `📱 *Phone:* ${formData.phone}\n`;
    text += `🏷️ *Interest:* ${formData.interest}\n`;
    text += `📝 *Message:* ${formData.message}\n\n`;
    text += `Please get back to me.`;

    const url = `https://wa.me/${businessNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const directWhatsAppUrl = generateDirectContactUrl(contact?.whatsappNumber);

  return (
    <div className="pt-28 pb-20 bg-dark-primary min-h-screen">
      <SEO
        title="Contact & Booking Desk"
        description="Connect directly with our car and camera rental desk in New Delhi Aerocity via WhatsApp, phone, or visit our studio."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Concierge Desk"
          title="Connect with Our Rental Team"
          subtitle="Direct WhatsApp communication with zero waiting time. Our team is ready to coordinate your vehicle delivery or assemble your camera package."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
              <h3 className="text-xl font-bold text-white mb-2">Office & Concierge Details</h3>

              {/* WhatsApp Card */}
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-status-success/10 border border-status-success/30 hover:bg-status-success/20 transition flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-11 h-11 rounded-xl bg-status-success text-black flex items-center justify-center font-bold">
                    <MessageSquare className="w-5 h-5 fill-black" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Official WhatsApp Desk</h4>
                    <p className="text-xs text-status-success font-medium">Click to chat instantly</p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-status-success group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* Phone */}
              {contact?.phoneNumber && (
                <div className="flex items-start space-x-3.5 p-3 rounded-xl bg-dark-secondary border border-white/5">
                  <Phone className="w-5 h-5 text-accent-amber mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-text-dim block">Phone Support</span>
                    <a href={`tel:${contact.phoneNumber}`} className="text-sm font-semibold text-white hover:text-accent-amber transition">
                      {contact.phoneNumber}
                    </a>
                  </div>
                </div>
              )}

              {/* Email */}
              {contact?.email && (
                <div className="flex items-start space-x-3.5 p-3 rounded-xl bg-dark-secondary border border-white/5">
                  <Mail className="w-5 h-5 text-accent-blue mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-text-dim block">Email Inquiries</span>
                    <a href={`mailto:${contact.email}`} className="text-sm font-semibold text-white hover:text-accent-blue transition">
                      {contact.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Address */}
              {contact?.businessAddress && (
                <div className="flex items-start space-x-3.5 p-3 rounded-xl bg-dark-secondary border border-white/5">
                  <MapPin className="w-5 h-5 text-status-success mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-text-dim block">Pickup Hub & Studio</span>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {contact.businessAddress}
                    </p>
                  </div>
                </div>
              )}

              {/* Hours */}
              {contact?.openingHours && (
                <div className="flex items-start space-x-3.5 p-3 rounded-xl bg-dark-secondary border border-white/5">
                  <Clock className="w-5 h-5 text-text-dim mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-text-dim block">Hours of Operation</span>
                    <p className="text-xs sm:text-sm text-text-muted">{contact.openingHours}</p>
                  </div>
                </div>
              )}

              {/* Social Channels */}
              <div className="pt-4 border-t border-white/5">
                <span className="text-xs text-text-dim block mb-3 font-semibold uppercase tracking-wider">
                  Connect on Social
                </span>
                <div className="flex items-center space-x-3">
                  {contact?.socialLinks?.instagram && (
                    <a
                      href={contact.socialLinks.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-xl bg-dark-secondary border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:border-accent-amber transition"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {contact?.socialLinks?.facebook && (
                    <a
                      href={contact.socialLinks.facebook}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-xl bg-dark-secondary border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:border-accent-blue transition"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}
                  {contact?.socialLinks?.youtube && (
                    <a
                      href={contact.socialLinks.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-xl bg-dark-secondary border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:border-status-error transition"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}
                  {contact?.socialLinks?.twitter && (
                    <a
                      href={contact.socialLinks.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-xl bg-dark-secondary border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:border-accent-blue transition"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: WhatsApp Interactive Contact Form & Map (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  Send a WhatsApp Message
                </h3>
                <p className="text-xs sm:text-sm text-text-muted">
                  Fill in your enquiry details below. Clicking submit will automatically open WhatsApp with your pre-formatted enquiry.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Batra"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-dark-secondary border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent-amber transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-dark-secondary border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent-amber transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                    Service of Interest
                  </label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full bg-dark-secondary border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent-amber transition"
                  >
                    <option value="Luxury Car Rental">Luxury Car Rental</option>
                    <option value="Cinema Camera Equipment">Cinema Camera Equipment</option>
                    <option value="Commercial Production Package">Commercial Production Package</option>
                    <option value="Self-Drive Rental">Self-Drive Rental</option>
                    <option value="Wedding Media Fleet">Wedding Media Fleet</option>
                    <option value="General Enquiry">General Enquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1.5">
                    Your Message / Requirements *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about your shoot dates, car preferences, or any specific requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-dark-secondary border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-accent-amber transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl font-bold text-black bg-gradient-to-r from-accent-amber to-amber-400 hover:from-amber-400 hover:to-accent-amber transition shadow-glow-amber flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <MessageSquare className="w-5 h-5 fill-black" />
                  <span>Send Message via WhatsApp</span>
                </button>
              </form>
            </div>

            {/* Google Maps Embed */}
            {contact?.googleMapsEmbed && (
              <div className="glass-card rounded-3xl overflow-hidden border border-white/5 aspect-[16/9] w-full">
                <iframe
                  title="ApexMotion Location"
                  src={contact.googleMapsEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full filter invert-[0.9] hue-rotate-[180deg] contrast-125"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
