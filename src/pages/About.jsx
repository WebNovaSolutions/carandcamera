import React from 'react';
import { motion } from 'framer-motion';
import { Car, Camera, ShieldCheck, Award, Users, HeartHandshake } from 'lucide-react';
import { useData } from '../context/DataContext';
import SectionHeader from '../components/SectionHeader';
import SEO from '../components/SEO';

export default function About() {
  const { website } = useData();

  const about = website?.about || {
    title: 'Elevating Every Drive and Every Shot',
    description:
      'We bridge the gap between luxury transportation and cinema-standard visual storytelling. Whether you are filming a high-production commercial, attending an executive gala, or embarking on a scenic mountain drive, our hand-curated fleet of premium vehicles and cutting-edge cameras deliver excellence without compromise.',
  };

  const stats = website?.hero?.stats || [];

  return (
    <div className="pt-28 pb-20 bg-dark-primary min-h-screen">
      <SEO
        title="About Us"
        description="Learn about ApexMotion Rentals: our mission to blend luxury automotive rentals with cinema-standard camera equipment."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Our Story"
          title={about.title}
          subtitle="Redefining equipment and vehicle hire with modern convenience, premium quality, and personalized service."
        />

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Crafted for Creators, Executives & Visionaries
            </h3>
            <p className="text-text-muted text-base leading-relaxed">
              {about.description}
            </p>
            <p className="text-text-muted text-sm leading-relaxed">
              Founded by passionate visual artists and automotive connoisseurs, ApexMotion was created to eliminate the friction in renting high-end equipment. We maintain our fleet to immaculate standards, ensuring every car feels brand new and every cinema camera kit is flight-case ready with fully charged batteries and verified media.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-dark-card border border-white/5">
                <ShieldCheck className="w-6 h-6 text-accent-amber mb-2" />
                <h4 className="text-sm font-bold text-white mb-1">100% Insured Fleet</h4>
                <p className="text-xs text-text-dim">Full comprehensive coverage and verified road permits.</p>
              </div>

              <div className="p-4 rounded-xl bg-dark-card border border-white/5">
                <Award className="w-6 h-6 text-accent-blue mb-2" />
                <h4 className="text-sm font-bold text-white mb-1">Cine-Grade Standards</h4>
                <p className="text-xs text-text-dim">Optics and camera sensors cleaned and calibrated.</p>
              </div>
            </div>
          </motion.div>

          {/* Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden glass-card border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80"
                alt="ApexMotion Luxury Fleet"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-panel">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-amber flex items-center justify-center text-black font-bold">
                    <Car className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">Primacy in Motion</h5>
                    <p className="text-xs text-text-muted">Serving New Delhi, NCR, and Northern India shoots</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-3xl glass-card border border-white/5 text-center mb-16">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-text-muted font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
