import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Car,
  Camera,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Clock,
  Headphones,
  MessageSquare,
  Star,
  ChevronDown,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import SectionHeader from '../components/SectionHeader';
import CarCard from '../components/CarCard';
import CameraCard from '../components/CameraCard';
import SEO from '../components/SEO';
import { generateDirectContactUrl } from '../services/whatsapp';

// Map icon strings to Lucide components
const iconMap = {
  DollarSign: DollarSign,
  Car: Car,
  Camera: Camera,
  MessageSquare: MessageSquare,
  Clock: Clock,
  Headphones: Headphones,
};

export default function Home() {
  const { website, cars, cameras, contact } = useData();
  const { openBookingModal } = useOutletContext();

  const hero = website?.hero || {};
  const stats = hero.stats || [];
  const whyChooseUs = website?.whyChooseUs || [];
  const howItWorks = website?.howItWorks || [];
  const testimonials = website?.testimonials || [];
  const ctaBanner = website?.ctaBanner || {};

  const featuredCars = cars.filter((c) => c.featured && c.active !== false).slice(0, 3);
  const featuredCameras = cameras.filter((c) => c.featured && c.active !== false).slice(0, 3);

  const whatsappDeskUrl = generateDirectContactUrl(contact?.whatsappNumber);

  return (
    <>
      <SEO
        title="Luxury Car & Cinema Camera Rentals"
        description={hero.subtitle || 'Premium car rentals and cinema equipment hire with instant WhatsApp booking.'}
      />

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
        {/* Hero Background with High-Quality Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={hero.bgImage || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=80'}
            alt="Hero Luxury Background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute inset-0 bg-dark-primary/60 backdrop-blur-[2px]" />
        </div>

        {/* Floating subtle glowing ambient blobs */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-accent-amber/15 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent-blue/15 rounded-full filter blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6"
          >
            <Sparkles className="w-4 h-4 text-accent-amber" />
            <span className="text-xs sm:text-sm font-semibold text-text-muted">
              Premium Vehicle & Cinema Optics Fleet
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-5xl mx-auto"
          >
            Your Journey. <span className="amber-gradient-text">Your Gear.</span>{' '}
            <span className="blue-gradient-text">Your Experience.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-text-muted max-w-3xl mx-auto leading-relaxed"
          >
            {hero.subtitle ||
              'Experience the thrill of elite luxury cars paired with cinema-grade camera rigs. Premium rentals crafted for filmmakers, creators, road trippers, and luxury enthusiasts.'}
          </motion.p>

          {/* Two Prominent CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/cars"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold text-black bg-gradient-to-r from-accent-amber to-amber-400 hover:from-amber-400 hover:to-accent-amber transition shadow-glow-amber flex items-center justify-center space-x-2 group"
            >
              <Car className="w-5 h-5 fill-black" />
              <span>{hero.ctaPrimary?.label || 'Explore Luxury Cars'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/cameras"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold text-white bg-dark-card border border-accent-blue/30 hover:border-accent-blue hover:bg-accent-blue/10 transition shadow-glow-blue/30 flex items-center justify-center space-x-2 group"
            >
              <Camera className="w-5 h-5 text-accent-blue" />
              <span>{hero.ctaSecondary?.label || 'Explore Cinema Cameras'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-accent-blue" />
            </Link>
          </motion.div>

          {/* Floating Stats Counters */}
          {stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className="glass-card p-4 rounded-2xl border border-white/5 text-center"
                >
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-text-muted mt-1 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Scroll Down Indicator */}
          <div className="mt-12 flex justify-center">
            <a
              href="#categories"
              className="animate-bounce p-2 rounded-full text-text-dim hover:text-white transition"
              aria-label="Scroll down"
            >
              <ChevronDown className="w-6 h-6" />
            </a>
          </div>
        </div>
      </section>

      {/* Category Selection Section */}
      <section id="categories" className="py-20 bg-dark-secondary relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Categories"
            title="Choose Your Rental Category"
            subtitle="Whether you need high-performance vehicles for an epic road journey or cinema-standard optics for your production, we have you covered."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Car Rentals Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 border border-accent-amber/20 hover:border-accent-amber/50 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-amber/10 rounded-full filter blur-[60px] pointer-events-none group-hover:bg-accent-amber/20 transition" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-accent-amber/20 text-accent-amber flex items-center justify-center mb-6 border border-accent-amber/30">
                  <Car className="w-7 h-7" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Luxury & Sports Cars
                </h3>
                <p className="text-text-muted text-sm sm:text-base leading-relaxed mb-6">
                  From roaring AMG V8s and track-ready BMW sedans to comfortable Toyota Innova Crystas for your entourage, explore our pristine self-drive and chauffeur fleet.
                </p>
                <div className="space-y-2 mb-8 text-xs sm:text-sm text-text-muted">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent-amber" />
                    <span>Hourly and daily flexible booking options</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent-amber" />
                    <span>Sanitized and fully insured vehicles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent-amber" />
                    <span>Chauffeur and self-drive availability</span>
                  </div>
                </div>
              </div>

              <Link
                to="/cars"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-black bg-accent-amber hover:bg-accent-amberHover transition flex items-center justify-center gap-2 shadow-glow-amber text-sm"
              >
                <span>Browse Luxury Fleet</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Camera Rentals Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 border border-accent-blue/20 hover:border-accent-blue/50 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 rounded-full filter blur-[60px] pointer-events-none group-hover:bg-accent-blue/20 transition" />
              <div>
                <div className="w-14 h-14 rounded-2xl bg-accent-blue/20 text-accent-blue flex items-center justify-center mb-6 border border-accent-blue/30">
                  <Camera className="w-7 h-7" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Cinema Camera Rigs
                </h3>
                <p className="text-text-muted text-sm sm:text-base leading-relaxed mb-6">
                  Industry-standard Sony FX6, A7S III, Canon R5 C, G-Master cinema primes, Aputure 600W lights, and DJI Ronin stabilizers prepped for commercial shoots.
                </p>
                <div className="space-y-2 mb-8 text-xs sm:text-sm text-text-muted">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent-blue" />
                    <span>Full cinema packages with media and power</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent-blue" />
                    <span>Tested sensors and cleaned optics before handover</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent-blue" />
                    <span>Optional on-set camera assistant (1st AC)</span>
                  </div>
                </div>
              </div>

              <Link
                to="/cameras"
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-accent-blue/90 hover:bg-accent-blue transition flex items-center justify-center gap-2 shadow-glow-blue text-sm"
              >
                <span>Browse Camera Gear</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-20 bg-dark-primary relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent-amber">
                Exclusive Fleet
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                Featured Luxury Cars
              </h2>
            </div>
            <Link
              to="/cars"
              className="mt-4 sm:mt-0 text-sm font-semibold text-accent-amber hover:text-amber-300 transition flex items-center gap-1 group"
            >
              <span>View All Vehicles ({cars.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} onBookNow={() => openBookingModal(car, 'vehicle')} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cameras Section */}
      <section className="py-20 bg-dark-secondary relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-accent-blue">
                Production Equipment
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                Featured Cinema Cameras & Gear
              </h2>
            </div>
            <Link
              to="/cameras"
              className="mt-4 sm:mt-0 text-sm font-semibold text-accent-blue hover:text-sky-300 transition flex items-center gap-1 group"
            >
              <span>View All Equipment ({cameras.length})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCameras.map((camera) => (
              <CameraCard
                key={camera.id}
                camera={camera}
                onBookNow={() => openBookingModal(camera, 'camera')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-us" className="py-20 bg-dark-primary relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="The ApexMotion Standard"
            title="Why Choose Our Rental Platform"
            subtitle="Built for discerning clients who demand absolute reliability, pristine presentation, and friction-free booking."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((feature) => {
              const IconComp = iconMap[feature.icon] || ShieldCheck;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 rounded-2xl border border-white/5 hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-accent-amber/15 text-accent-amber border border-accent-amber/25 flex items-center justify-center mb-5">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-dark-secondary relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            badge="Seamless Process"
            title="How It Works in 4 Simple Steps"
            subtitle="No lengthy paperwork or online payment gateway friction. Direct human assistance on WhatsApp."
            accent="blue"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-6 rounded-2xl border border-white/5 relative flex flex-col justify-between"
              >
                <div>
                  <span className="text-4xl font-extrabold text-white/10 block mb-3 font-mono">
                    {step.step}
                  </span>
                  <h4 className="text-base font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-xs text-text-muted leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-dark-primary relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionHeader
              badge="Client Reviews"
              title="Trusted by Filmmakers & Travelers"
              subtitle="Hear what our clients say about our vehicle condition and camera equipment support."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-1 text-accent-amber mb-4">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-accent-amber" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-text-muted italic leading-relaxed mb-6">
                      "{t.comment}"
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 pt-4 border-t border-white/5">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white">{t.name}</h4>
                      <p className="text-[11px] text-text-dim">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner Section */}
      <section className="py-16 bg-gradient-to-b from-dark-secondary to-dark-primary relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="glass-card p-8 sm:p-12 rounded-3xl border border-accent-amber/30 shadow-glow-amber/20">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              {ctaBanner.title || 'Ready to Gear Up for Your Next Journey?'}
            </h2>
            <p className="text-text-muted text-base max-w-2xl mx-auto mb-8">
              {ctaBanner.subtitle ||
                'Connect directly with our concierge team over WhatsApp for customized packages, vehicle availability, and gear recommendations.'}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={whatsappDeskUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-black bg-gradient-to-r from-accent-amber to-amber-400 hover:from-amber-400 hover:to-accent-amber transition shadow-glow-amber flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-5 h-5 fill-black" />
                <span>{ctaBanner.buttonText || 'Chat on WhatsApp Now'}</span>
              </a>

              <button
                onClick={() => openBookingModal()}
                className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold text-white bg-dark-secondary border border-white/10 hover:border-white/30 transition flex items-center justify-center space-x-2"
              >
                <span>Open Booking Form</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
