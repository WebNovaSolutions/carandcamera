import React, { useState } from 'react';
import { useParams, Link, useOutletContext, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Fuel,
  Gauge,
  Calendar,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  Star,
  Clock,
  Sparkles,
  Share2,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { formatCurrency } from '../utils/formatters';
import SEO from '../components/SEO';
import toast from 'react-hot-toast';

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cars } = useData();
  const { openBookingModal } = useOutletContext();

  const car = cars.find((c) => c.id === id);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!car) {
    return (
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-white mb-4">Vehicle Not Found</h2>
        <p className="text-text-muted mb-6">The vehicle you are looking for does not exist or has been removed.</p>
        <Link to="/cars" className="px-6 py-2.5 rounded-xl bg-accent-amber text-black font-bold text-xs">
          Back to Fleet
        </Link>
      </div>
    );
  }

  const images = car.images && car.images.length > 0 ? car.images : [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${car.name} - OneRentals`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="pt-28 pb-20 bg-dark-primary min-h-screen">
      <SEO
        title={`${car.name} Rental`}
        description={car.description}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-1.5 text-xs text-text-muted hover:text-white transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Listings</span>
          </button>

          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-dark-card border border-white/10 text-text-muted hover:text-white transition text-xs flex items-center gap-1.5"
            title="Share this vehicle"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Image Gallery & Features (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Main Image */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden glass-card border border-white/10 bg-dark-secondary">
              <motion.img
                key={activeImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={images[activeImageIndex]}
                alt={car.name}
                className="w-full h-full object-cover"
              />

              {/* Status and Featured Badges */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-dark-primary/90 text-white backdrop-blur-md border border-white/10">
                  {car.category}
                </span>
                {car.featured && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-accent-amber text-black shadow-glow-amber flex items-center gap-1">
                    <Star className="w-3 h-3 fill-black" />
                    Featured
                  </span>
                )}
              </div>

              <div className="absolute top-4 right-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 ${
                    car.available
                      ? 'bg-status-success/30 text-status-success border border-status-success/40'
                      : 'bg-status-error/30 text-status-error border border-status-error/40'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${car.available ? 'bg-status-success' : 'bg-status-error'}`} />
                  {car.available ? 'Available Now' : 'Currently Booked'}
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
                        ? 'border-accent-amber scale-105'
                        : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${car.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Vehicle Specifications */}
            <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-amber" />
                Technical Specifications
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 rounded-xl bg-dark-secondary border border-white/5">
                  <div className="text-[11px] text-text-dim uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Users className="w-3 h-3 text-accent-amber" />
                    Seating
                  </div>
                  <div className="text-sm font-semibold text-white">{car.specs?.seating || '5 Seats'}</div>
                </div>

                <div className="p-3 rounded-xl bg-dark-secondary border border-white/5">
                  <div className="text-[11px] text-text-dim uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Fuel className="w-3 h-3 text-accent-blue" />
                    Fuel Type
                  </div>
                  <div className="text-sm font-semibold text-white">{car.specs?.fuel || 'Petrol'}</div>
                </div>

                <div className="p-3 rounded-xl bg-dark-secondary border border-white/5">
                  <div className="text-[11px] text-text-dim uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-white/70" />
                    Transmission
                  </div>
                  <div className="text-sm font-semibold text-white truncate">{car.specs?.transmission || 'Automatic'}</div>
                </div>

                {car.specs?.engine && (
                  <div className="p-3 rounded-xl bg-dark-secondary border border-white/5 sm:col-span-2">
                    <div className="text-[11px] text-text-dim uppercase tracking-wider mb-1">Engine / Power</div>
                    <div className="text-sm font-semibold text-white">{car.specs.engine}</div>
                  </div>
                )}

                {car.specs?.mileage && (
                  <div className="p-3 rounded-xl bg-dark-secondary border border-white/5">
                    <div className="text-[11px] text-text-dim uppercase tracking-wider mb-1">Mileage</div>
                    <div className="text-sm font-semibold text-white">{car.specs.mileage}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Premium Features List */}
            {car.features && car.features.length > 0 && (
              <div className="glass-card p-6 rounded-2xl border border-white/5 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-accent-amber" />
                  Key Features & Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {car.features.map((feat, idx) => (
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
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-accent-amber/20 sticky top-28 space-y-6 shadow-glow-amber/10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-accent-amber">
                  {car.brand}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 mb-3">
                  {car.name}
                </h1>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  {car.description}
                </p>
              </div>

              {/* Pricing Box */}
              <div className="p-5 rounded-2xl bg-dark-primary border border-white/5 space-y-3">
                <div className="flex items-baseline justify-between pb-3 border-b border-white/5">
                  <span className="text-xs text-text-muted font-medium">Daily Rental Rate:</span>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold text-accent-amber">
                      {formatCurrency(car.dailyPrice)}
                    </span>
                    <span className="text-xs text-text-muted ml-1">/ day</span>
                  </div>
                </div>

                {car.hourlyPrice && (
                  <div className="flex items-baseline justify-between text-xs text-text-muted">
                    <span>Hourly Rate (min. 4 hrs):</span>
                    <span className="text-base font-bold text-white">
                      {formatCurrency(car.hourlyPrice)}/hr
                    </span>
                  </div>
                )}
              </div>

              {/* Booking CTA Button */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => openBookingModal(car, 'vehicle')}
                  className="w-full py-4 px-6 rounded-xl font-bold text-black bg-gradient-to-r from-accent-amber to-amber-400 hover:from-amber-400 hover:to-accent-amber transition shadow-glow-amber flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <MessageSquare className="w-5 h-5 fill-black" />
                  <span>Reserve This Car on WhatsApp</span>
                </button>

                <p className="text-center text-xs text-text-dim flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-accent-amber" />
                  Quick response within 10 minutes on WhatsApp
                </p>
              </div>

              {/* Guarantees Box */}
              <div className="pt-4 border-t border-white/5 space-y-2.5 text-xs text-text-muted">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Doorstep delivery across major NCR hubs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Zero security deposit options for verified corporate clients</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-status-success" />
                  <span>Chauffeur or self-drive option available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
