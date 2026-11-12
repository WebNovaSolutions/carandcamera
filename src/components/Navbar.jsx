import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Camera, Menu, X, MessageSquare, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { generateDirectContactUrl } from '../services/whatsapp';

export default function Navbar({ onOpenBooking }) {
  const { website, contact, navigation } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = navigation?.headerLinks || [
    { label: 'Home', path: '/' },
    { label: 'Luxury Cars', path: '/cars' },
    { label: 'Cinema Cameras', path: '/cameras' },
    { label: 'Services', path: '/services' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const brandName = website?.name || 'ApexMotion';
  const whatsappUrl = generateDirectContactUrl(contact?.whatsappNumber, 'Hello ApexMotion, I would like to enquire about renting a car or camera.');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'glass-navbar py-3 shadow-xl' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-amber via-amber-500 to-accent-blue p-[1px] shadow-glow-amber/40">
              <div className="w-full h-full bg-dark-primary rounded-[11px] flex items-center justify-center space-x-0.5">
                <Car className="w-4 h-4 text-accent-amber transition-transform group-hover:-translate-x-0.5" />
                <Camera className="w-3.5 h-3.5 text-accent-blue transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white block">
                {brandName.split(' ')[0]}
                <span className="text-accent-amber">{brandName.split(' ')[1] || 'Rentals'}</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase text-text-dim block -mt-1 font-semibold">
                Luxury Cars & Cinema Gear
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-dark-card/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/5">
            {navLinks.map((link) => (
              <NavLink
                key={link.path || link.label}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-accent-amber text-black shadow-glow-amber'
                      : 'text-text-muted hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={() => onOpenBooking && onOpenBooking()}
              className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-accent-amber hover:bg-accent-amberHover transition shadow-glow-amber flex items-center space-x-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-black" />
              <span>WhatsApp Booking</span>
            </button>

            <Link
              to="/admin"
              className="p-2 rounded-xl text-text-dim hover:text-text-muted hover:bg-white/5 border border-white/5 transition"
              title="Admin Portal"
            >
              <ShieldAlert className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => onOpenBooking && onOpenBooking()}
              className="p-2 rounded-xl bg-accent-amber text-black text-xs font-bold"
              aria-label="WhatsApp Booking"
            >
              <MessageSquare className="w-4 h-4 fill-black" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-text-muted hover:text-white bg-dark-card/60 border border-white/5"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-navbar border-b border-white/10 px-4 pt-3 pb-6 space-y-3"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path || link.label}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between ${
                      isActive
                        ? 'bg-accent-amber text-black font-bold'
                        : 'text-text-muted hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </NavLink>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenBooking) onOpenBooking();
                }}
                className="w-full py-3 px-4 rounded-xl text-center text-sm font-bold text-black bg-accent-amber shadow-glow-amber flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4 fill-black" />
                <span>Reserve on WhatsApp</span>
              </button>

              <Link
                to="/admin"
                className="w-full py-2.5 px-4 rounded-xl text-center text-xs font-semibold text-text-muted bg-dark-card border border-white/5 flex items-center justify-center space-x-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
