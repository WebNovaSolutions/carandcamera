import React from 'react';
import { Link } from 'react-router-dom';
import {
  Car,
  Camera,
  Layers,
  Star,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Globe,
  Phone,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { formatCurrency } from '../../utils/formatters';
import SEO from '../../components/SEO';

export default function Dashboard() {
  const { cars, cameras, services, website, contact } = useData();

  // Calculate genuine statistics from JSON files
  const totalCars = cars.length;
  const availableCars = cars.filter((c) => c.available).length;
  const featuredCars = cars.filter((c) => c.featured).length;

  const totalCameras = cameras.length;
  const availableCameras = cameras.filter((c) => c.available).length;
  const featuredCameras = cameras.filter((c) => c.featured).length;

  const totalFeatured = featuredCars + featuredCameras;
  const totalServices = services.length;

  // Recent items combined and sorted by updatedAt
  const recentItems = [
    ...cars.map((c) => ({ ...c, type: 'Car', path: '/admin/cars' })),
    ...cameras.map((c) => ({ ...c, type: 'Camera', path: '/admin/cameras' })),
  ]
    .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
    .slice(0, 6);

  return (
    <div className="space-y-8">
      <SEO title="Admin Dashboard Overview" />

      {/* Welcome Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-accent-amber block mb-2">
            Operations & Fleet Center
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome to ApexMotion Control
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-2 leading-relaxed">
            All prices, availability flags, and content edits are committed to GitHub JSON storage and refreshed immediately for website visitors.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Link
            to="/admin/cars"
            className="px-4 py-2.5 rounded-xl bg-accent-amber hover:bg-accent-amberHover text-black text-xs font-bold transition flex items-center space-x-1.5 shadow-glow-amber"
          >
            <Plus className="w-4 h-4" />
            <span>Add Car</span>
          </Link>
          <Link
            to="/admin/cameras"
            className="px-4 py-2.5 rounded-xl bg-accent-blue hover:bg-accent-blueHover text-black text-xs font-bold transition flex items-center space-x-1.5 shadow-glow-blue"
          >
            <Plus className="w-4 h-4" />
            <span>Add Camera</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid - Calculated Strictly From Content */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total & Available Cars */}
        <div className="glass-card p-5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted">Total Luxury Cars</span>
            <div className="w-8 h-8 rounded-lg bg-accent-amber/20 text-accent-amber flex items-center justify-center">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{totalCars}</div>
          <div className="text-[11px] text-status-success font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{availableCars} ready to rent</span>
          </div>
        </div>

        {/* Total & Available Cameras */}
        <div className="glass-card p-5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted">Total Camera Equipment</span>
            <div className="w-8 h-8 rounded-lg bg-accent-blue/20 text-accent-blue flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{totalCameras}</div>
          <div className="text-[11px] text-accent-blue font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{availableCameras} in stock</span>
          </div>
        </div>

        {/* Featured Items */}
        <div className="glass-card p-5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted">Featured Highlights</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-accent-amber flex items-center justify-center">
              <Star className="w-4 h-4 fill-accent-amber" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{totalFeatured}</div>
          <div className="text-[11px] text-text-dim mt-1">
            {featuredCars} cars • {featuredCameras} cameras
          </div>
        </div>

        {/* Total Services */}
        <div className="glass-card p-5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-text-muted">Production Services</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{totalServices}</div>
          <div className="text-[11px] text-text-dim mt-1">
            Active rental & shoot packages
          </div>
        </div>
      </div>

      {/* Quick Jump Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/admin/cars"
          className="glass-card p-6 rounded-2xl border border-white/5 hover:border-accent-amber/40 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent-amber/20 text-accent-amber flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-text-dim group-hover:translate-x-1 group-hover:text-accent-amber transition" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Vehicle Fleet</h3>
          <p className="text-xs text-text-muted">
            Update daily/hourly rates, add new luxury cars, toggle availability flags.
          </p>
        </Link>

        <Link
          to="/admin/cameras"
          className="glass-card p-6 rounded-2xl border border-white/5 hover:border-accent-blue/40 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent-blue/20 text-accent-blue flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-text-dim group-hover:translate-x-1 group-hover:text-accent-blue transition" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">Cinema Gear</h3>
          <p className="text-xs text-text-muted">
            Manage mirrorless, cinema bodies, master prime lenses, and studio lighting.
          </p>
        </Link>

        <Link
          to="/admin/contact"
          className="glass-card p-6 rounded-2xl border border-white/5 hover:border-status-success/40 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-status-success/20 text-status-success flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-text-dim group-hover:translate-x-1 group-hover:text-status-success transition" />
          </div>
          <h3 className="text-base font-bold text-white mb-1">WhatsApp & Contact</h3>
          <p className="text-xs text-text-muted">
            Configure the recipient WhatsApp business phone number: <span className="text-status-success font-mono font-semibold">+{contact?.whatsappNumber || '919876543210'}</span>
          </p>
        </Link>
      </div>

      {/* Recently Updated Fleet & Equipment */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recently Updated Listings</h3>
            <p className="text-xs text-text-dim">Latest cars and cameras recorded in JSON storage</p>
          </div>
          <span className="text-xs text-text-muted">Calculated from JSON</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-secondary/60 text-text-dim uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-5">Type</th>
                <th className="py-3 px-5">Item Name</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Daily Rate</th>
                <th className="py-3 px-5">Availability</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-text-muted">
              {recentItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.type === 'Car'
                          ? 'bg-accent-amber/20 text-accent-amber'
                          : 'bg-accent-blue/20 text-accent-blue'
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-semibold text-white">
                    {item.name}
                  </td>
                  <td className="py-3.5 px-5">{item.category}</td>
                  <td className="py-3.5 px-5 font-bold text-white">
                    {formatCurrency(item.dailyPrice)}/day
                  </td>
                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        item.available
                          ? 'text-status-success bg-status-success/10'
                          : 'text-status-error bg-status-error/10'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${item.available ? 'bg-status-success' : 'bg-status-error'}`} />
                      {item.available ? 'Available' : 'Booked'}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <Link
                      to={item.path}
                      className="text-accent-amber hover:underline text-xs font-semibold"
                    >
                      Edit In Admin
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
