import React, { useState } from 'react';
import { useParams, Link, useOutletContext, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Layers,
  Video,
  Package,
  CheckCircle2,
  ChevronLeft,
  Star,
  Clock,
  Sparkles,
  Share2,
  MessageSquare,
  ShieldCheck,
  Disc,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../utils/formatters';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';

export default function CameraDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cameras } = useData();
  const { openBookingModal } = useOutletContext();

  const camera = cameras.find((c) => c.id === id);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!camera) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-white mb-4">Equipment Not Found</h2>
        <p className="text-text-muted mb-6">The equipment you are looking for does not exist or has been removed.</p>
        <Link to="/cameras" className="px-6 py-2.5 rounded-xl bg-accent-blue text-black font-bold text-xs">
          Back to Equipment Catalog
        </Link>
      </div>
    );
  }

  const images = camera.images && camera.images.length > 0 ? camera.images : [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80'
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${camera.name} - OneRentals`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Equipment link copied to clipboard!');
    }
  };

  return (
    <div className="pt-28 pb-20 bg-dark-primary min-h-screen">
      <SEO
        title={`${camera.name} Rental`}
        description={camera.description}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-1.5 text-xs text-text-muted hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Equipment</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-dark-card border border-white/10 text-text-muted hover:text-white transition text-xs flex items-center gap-1.5"
            title="Share equipment"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Gallery & Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Product Image */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden glass-card border border-white/10 bg-dark-secondary">
              <motion.img
                key={activeImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={images[activeImageIndex]}
                alt={camera.name}
                className="w-full h-full object-cover"
              />

              {/* Status and Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-dark-primary/90 text-white backdrop-blur-md border border-white/10">
                  {camera.category}
                </span>
                {camera.featured && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-blue text-black shadow-glow-blue flex items-center gap-1">
                    <Star className="w-3 h-3 fill-black" />
                    Featured
                  </span>
                )}
              </div>

              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 ${
                    camera.available
                      ? 'bg-status-success/30 text-status-success border border-status-success/40'
                      : 'bg-status-error/30 text-status-error border border-status-error/40'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${camera.available ? 'bg-status-success' : 'bg-status-error'}`} />
                  {camera.available ? 'Gear In Stock' : 'Currently On Shoot'}
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                      activeImageIndex === idx
                        ? 'border-accent-blue scale-105'
                        : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${camera.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Technical Specifications */}
            {camera.specs && (
              <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent-blue" />
                  Technical Specifications
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {Object.entries(camera.specs).map(([key, value]) => (
                    <div key={key} className="p-3.5 rounded-xl bg-dark-secondary border border-white/5">
                      <div className="text-[11px] text-text-dim uppercase tracking-wider mb-1 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-white">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accessories Included */}
            {camera.includedAccessories && camera.includedAccessories.length > 0 && (
              <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-accent-blue" />
                  Included In Rental Kit
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {camera.includedAccessories.map((acc, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-text-muted">
                      <CheckCircle2 className="w-4 h-4 text-accent-blue mt-0.5 flex-shrink-0" />
                      <span>{acc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Production Features */}
            {camera.features && camera.features.length > 0 && (
              <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Disc className="w-4 h-4 text-accent-amber" />
                  Camera Highlights & Capabilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {camera.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-text-muted">
                      <CheckCircle2 className="w-4 h-4 text-accent-amber mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Pricing & Booking Card (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-accent-blue/20 sticky top-28 space-y-6 shadow-glow-blue/10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent-blue">
                  {camera.brand} {camera.model && `• ${camera.model}`}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-3">
                  {camera.name}
                </h1>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  {camera.description}
                </p>
              </div>

              {/* Pricing Box */}
              <div className="p-5 rounded-2xl bg-dark-primary border border-white/5 space-y-3">
                <div className="flex items-baseline justify-between pb-3 border-b border-white/5">
                  <span className="text-xs text-text-muted font-medium">Daily Shoot Rate:</span>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-accent-blue">
                      {formatCurrency(camera.dailyPrice)}
                    </span>
                    <span className="text-xs text-text-muted ml-1">/ day</span>
                  </div>
                </div>

                {camera.hourlyPrice && (
                  <div className="flex items-baseline justify-between text-xs text-text-muted">
                    <span>Hourly Rate (Studio min. 4 hrs):</span>
                    <span className="text-base font-bold text-white">
                      {formatCurrency(camera.hourlyPrice)}/hr
                    </span>
                  </div>
                )}
              </div>

              {/* Booking CTA Button */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => openBookingModal(camera, 'camera')}
                  className="w-full py-4 px-6 rounded-xl font-bold text-black bg-accent-blue hover:bg-sky-400 transition shadow-glow-blue flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <MessageSquare className="w-5 h-5 fill-black" />
                  <span>Reserve Gear on WhatsApp</span>
                </button>

                <p className="text-center text-xs text-text-dim flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-accent-blue" />
                  Direct equipment check with our technician on WhatsApp
                </p>
              </div>

              {/* Guarantees Box */}
              <div className="pt-4 border-t border-white/5 space-y-2.5 text-xs text-text-muted">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Freshly formatted high-speed media included</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Full sensor cleaning and test shot before release</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Delivery to shoot location or studio available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
