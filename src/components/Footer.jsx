import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Camera, MessageSquare, Phone, Mail, MapPin, Instagram, Facebook, Youtube, Twitter, ArrowUpRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { generateDirectContactUrl } from '../services/whatsapp';

export default function Footer({ onOpenBooking }) {
  const { website, contact, navigation } = useData();

  const brandName = website?.name || 'OneRentals';
  const footerDesc = website?.footer?.description ||
    'Your ultimate destination for premium car rentals and cinema-grade camera gear. Elevating creative productions and executive travel with speed, elegance, and reliability.';
  const copyright = website?.footer?.copyright || '© 2026 OneRentals. All rights reserved.';

  const footerCols = navigation?.footerColumns || [];
  const whatsappUrl = generateDirectContactUrl(contact?.whatsappNumber);

  return (
    <footer className="bg-dark-secondary border-t border-white/5 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          {/* Brand Info (2 columns wide on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-amber to-accent-blue p-[1px]">
                <div className="w-full h-full bg-dark-primary rounded-[11px] flex items-center justify-center space-x-0.5">
                  <Car className="w-4 h-4 text-accent-amber" />
                  <Camera className="w-3.5 h-3.5 text-accent-blue" />
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                One<span className="text-accent-amber">Rentals</span>
              </span>
            </Link>

            <p className="text-text-muted text-sm leading-relaxed max-w-sm">
              {footerDesc}
            </p>

            {/* Direct Contact details */}
            <div className="space-y-2 pt-2 text-xs text-text-muted">
              {contact?.phoneNumber && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-accent-amber" />
                  <span>{contact.phoneNumber}</span>
                </div>
              )}
              {contact?.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-accent-blue" />
                  <span>{contact.email}</span>
                </div>
              )}
              {contact?.businessAddress && (
                <div className="flex items-start space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-status-success mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{contact.businessAddress}</span>
                </div>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-3">
              {contact?.socialLinks?.instagram && (
                <a
                  href={contact.socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-dark-card border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:border-accent-amber transition"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {contact?.socialLinks?.facebook && (
                <a
                  href={contact.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-dark-card border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:border-accent-blue transition"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {contact?.socialLinks?.youtube && (
                <a
                  href={contact.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-dark-card border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:border-status-error transition"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {contact?.socialLinks?.twitter && (
                <a
                  href={contact.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-dark-card border border-white/10 flex items-center justify-center text-text-muted hover:text-white hover:border-accent-blue transition"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-status-success/20 border border-status-success/30 flex items-center justify-center text-status-success hover:bg-status-success hover:text-black transition"
                aria-label="WhatsApp"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Dynamic Footer Columns */}
          {footerCols.map((col) => (
            <div key={col.id || col.title} className="space-y-4">
              <h4 className="text-sm font-bold text-white tracking-wider uppercase">
                {col.title}
              </h4>
              <ul className="space-y-2.5 text-xs text-text-muted">
                {col.links &&
                  col.links.map((link, idx) => (
                    <li key={idx}>
                      {link.path.startsWith('http') || link.path.startsWith('https://wa.me') ? (
                        <a
                          href={link.path}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-accent-amber transition flex items-center space-x-1"
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight className="w-3 h-3 opacity-60" />
                        </a>
                      ) : (
                        <Link
                          to={link.path}
                          className="hover:text-accent-amber transition"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-text-dim gap-4">
          <p>{copyright}</p>
          <div className="flex items-center space-x-6">
            <span>Powered by GitHub JSON Storage & Vercel Serverless</span>
            <Link to="/admin" className="hover:text-text-muted transition">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
