import React, { useState, useMemo } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, Car, RefreshCw } from 'lucide-react';
import { useData } from '../context/DataContext';
import CarCard from '../components/CarCard';
import SectionHeader from '../components/SectionHeader';
import SEO from '../components/SEO';

export default function Cars() {
  const { cars } = useData();
  const { openBookingModal } = useOutletContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategoryParam = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(activeCategoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'name'

  // Extract all categories dynamically from active cars
  const categories = useMemo(() => {
    const set = new Set();
    cars.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ['All', ...Array.from(set)];
  }, [cars]);

  // Filter & Sort cars
  const filteredCars = useMemo(() => {
    return cars
      .filter((car) => {
        // Active status
        if (car.active === false) return false;

        // Category filter
        if (selectedCategory !== 'All' && car.category !== selectedCategory) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = car.name.toLowerCase().includes(q);
          const matchBrand = car.brand?.toLowerCase().includes(q);
          const matchCategory = car.category?.toLowerCase().includes(q);
          const matchDesc = car.description?.toLowerCase().includes(q);
          return matchName || matchBrand || matchCategory || matchDesc;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        }
        if (sortBy === 'price-low') {
          return (a.dailyPrice || 0) - (b.dailyPrice || 0);
        }
        if (sortBy === 'price-high') {
          return (b.dailyPrice || 0) - (a.dailyPrice || 0);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [cars, selectedCategory, searchQuery, sortBy]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="pt-28 pb-20 bg-dark-primary min-h-screen">
      <SEO
        title="Luxury Car Rentals"
        description="Browse our fleet of luxury sedans, sports cars, and 7-seater executive SUVs with transparent hourly and daily pricing."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Luxury Fleet"
          title="Rent Premium Vehicles"
          subtitle="Hand-curated luxury cars prepared for executive travel, weddings, cinematic productions, and scenic road trips."
        />

        {/* Filter and Search Bar */}
        <div className="glass-card p-4 sm:p-6 rounded-2xl border border-white/5 mb-10 space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-text-dim absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search car by name, brand, or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-secondary border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-amber transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-xs text-text-dim hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
              <span className="text-xs text-text-dim flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-dark-secondary border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent-amber"
              >
                <option value="featured">Featured First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-white/5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-accent-amber text-black shadow-glow-amber'
                    : 'bg-dark-secondary text-text-muted hover:text-white hover:bg-white/5 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-text-muted mb-6">
          <span>Showing {filteredCars.length} of {cars.length} vehicles</span>
          {(selectedCategory !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                handleCategoryChange('All');
                setSearchQuery('');
              }}
              className="text-accent-amber hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Reset Filters
            </button>
          )}
        </div>

        {/* Cars Grid */}
        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onBookNow={() => openBookingModal(car, 'vehicle')}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center border border-white/5 my-8">
            <Car className="w-12 h-12 text-text-dim mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-white mb-2">No Vehicles Found</h3>
            <p className="text-text-muted text-sm max-w-md mx-auto mb-6">
              We couldn't find any vehicles matching your filter criteria. Try adjusting your search term or select "All".
            </p>
            <button
              onClick={() => {
                handleCategoryChange('All');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-accent-amber text-black shadow-glow-amber"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
