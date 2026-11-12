import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  Camera,
  Layers,
  Globe,
  Navigation,
  PhoneCall,
  LogOut,
  ExternalLink,
  Menu,
  X,
  RefreshCw,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function AdminLayout() {
  const { isAuthenticated, logout, loading } = useAuth();
  const { refreshData } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-2 border-accent-amber border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-text-muted">Authenticating Admin Session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const handleManualRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setTimeout(() => setRefreshing(false), 500);
  };

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Manage Cars', path: '/admin/cars', icon: Car },
    { label: 'Manage Cameras', path: '/admin/cameras', icon: Camera },
    { label: 'Services & Pricing', path: '/admin/services', icon: Layers },
    { label: 'Website Content', path: '/admin/website', icon: Globe },
    { label: 'Header & Footer', path: '/admin/navigation', icon: Navigation },
    { label: 'Contact Details', path: '/admin/contact', icon: PhoneCall },
  ];

  return (
    <div className="min-h-screen bg-dark-primary text-text-main flex flex-col md:flex-row">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-dark-secondary border-r border-white/5 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Admin Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <Link to="/admin" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-accent-amber text-black flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-extrabold text-white block">OneRentals</span>
                <span className="text-[10px] text-accent-amber font-mono uppercase tracking-wider block font-bold">
                  Admin Control
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-text-dim hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin'}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-accent-amber text-black font-bold shadow-glow-amber'
                        : 'text-text-muted hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer of Sidebar */}
        <div className="p-4 border-t border-white/5 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-dark-card border border-white/5 text-xs text-text-muted hover:text-white transition"
          >
            <span className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5 text-accent-blue" />
              <span>Live Website</span>
            </span>
          </Link>

          <button
            onClick={logout}
            className="w-full flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs text-status-error hover:bg-status-error/10 transition font-semibold"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-dark-primary/90 backdrop-blur-md border-b border-white/5 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-text-muted hover:text-white bg-dark-secondary md:hidden border border-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono text-text-dim hidden sm:inline">
              Source: GitHub JSON Files • Vercel Serverless
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleManualRefresh}
              className="px-3 py-1.5 rounded-xl bg-dark-secondary hover:bg-white/5 border border-white/10 text-xs font-semibold text-text-muted hover:text-white transition flex items-center space-x-1.5"
              title="Reload JSON content"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-accent-amber' : ''}`} />
              <span className="hidden sm:inline">Refresh Data</span>
            </button>

            <div className="flex items-center space-x-2 pl-2 border-l border-white/10">
              <div className="w-7 h-7 rounded-full bg-accent-amber/20 border border-accent-amber/40 flex items-center justify-center text-accent-amber">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-semibold text-white hidden sm:inline">Admin</span>
            </div>
          </div>
        </header>

        {/* Dynamic Admin View */}
        <main className="p-4 sm:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
