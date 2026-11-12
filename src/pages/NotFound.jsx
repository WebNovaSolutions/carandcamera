import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Car, Camera, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-dark-primary flex items-center justify-center text-center px-4">
      <SEO title="404 - Page Not Found" />
      <div className="max-w-lg glass-card p-8 sm:p-12 rounded-3xl border border-white/5 space-y-6">
        <span className="text-7xl sm:text-8xl font-black amber-gradient-text block font-mono">
          404
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Page Off The Grid
        </h1>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
          The page or gear you are searching for might have been relocated, renamed, or is temporarily out of service.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-accent-amber text-black font-bold text-xs flex items-center justify-center gap-2 shadow-glow-amber"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/cars"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-dark-secondary border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2"
          >
            <Car className="w-4 h-4 text-accent-amber" />
            <span>Browse Cars</span>
          </Link>
          <Link
            to="/cameras"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-dark-secondary border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4 text-accent-blue" />
            <span>Browse Gear</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
