import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Fuel, Gauge, Star, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function CarCard({ car, onBookNow }) {
  if (!car) return null;

  const primaryImage =
    car.images && car.images.length > 0
      ? car.images[0]
      : 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="glass-card rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-glow-amber/20 hover:-translate-y-1.5"
    >
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-dark-secondary">
        <img
          src={primaryImage}
          alt={car.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-dark-primary/80 backdrop-blur-md text-white border border-white/10">
            {car.category}
          </span>

          <div className="flex items-center gap-1.5">
            {car.featured && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-accent-amber/90 text-black flex items-center gap-1 shadow-glow-amber">
                <Star className="w-3 h-3 fill-black" />
                Featured
              </span>
            )}

            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                car.available
                  ? 'bg-status-success/20 text-status-success border border-status-success/30'
                  : 'bg-status-error/20 text-status-error border border-status-error/30'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${car.available ? 'bg-status-success' : 'bg-status-error'}`} />
              {car.available ? 'Available' : 'Booked'}
            </span>
          </div>
        </div>

        {/* Brand Overlay */}
        <div className="absolute bottom-2 left-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-accent-amber drop-shadow">
            {car.brand}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/cars/${car.id}`} className="group-hover:text-accent-amber transition-colors">
            <h3 className="text-lg font-bold text-white line-clamp-1 mb-1.5">
              {car.name}
            </h3>
          </Link>

          <p className="text-xs text-text-muted line-clamp-2 mb-4 leading-relaxed">
            {car.description}
          </p>

          {/* Quick Specs Pills */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5 mb-4 text-xs text-text-muted">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-accent-amber" />
              <span className="truncate">{car.specs?.seating || '5 Seats'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-accent-blue" />
              <span className="truncate">{car.specs?.fuel || 'Petrol'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-white/70" />
              <span className="truncate">{car.specs?.transmission?.split(' ')[0] || 'Auto'}</span>
            </div>
          </div>
        </div>

        {/* Pricing and Actions */}
        <div>
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="text-2xl font-extrabold text-white">
                {formatCurrency(car.dailyPrice)}
              </span>
              <span className="text-xs text-text-muted ml-1">/day</span>
            </div>

            {car.hourlyPrice && (
              <div className="text-right">
                <span className="text-sm font-semibold text-text-muted">
                  {formatCurrency(car.hourlyPrice)}
                </span>
                <span className="text-[10px] text-text-dim ml-0.5">/hr</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/cars/${car.id}`}
              className="py-2.5 px-3 rounded-xl border border-white/10 hover:border-white/30 text-white text-xs font-semibold text-center transition flex items-center justify-center gap-1 bg-white/[0.02] hover:bg-white/5"
            >
              <span>View Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>

            <button
              onClick={() => onBookNow && onBookNow(car)}
              className="py-2.5 px-3 rounded-xl bg-accent-amber hover:bg-accent-amberHover text-black text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-glow-amber/50"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-black" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
