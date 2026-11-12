import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle2, MessageSquare, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import SectionHeader from '../components/SectionHeader';
import { formatCurrency } from '../utils/formatters';
import SEO from '../components/SEO';

export default function Services() {
  const { services } = useData();
  const { openBookingModal } = useOutletContext();

  const activeServices = services.filter((s) => s.active !== false);

  return (
    <div className="pt-28 pb-20 bg-dark-primary min-h-screen">
      <SEO
        title="Rental Services & Production Packages"
        description="Explore our customized luxury chauffeur services, cinema camera bundles, and destination shoot packages."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="Tailored Solutions"
          title="Rental Services & Production Packages"
          subtitle="From self-drive sports cars to turnkey cinema camera kits and on-set technical assistants, explore our complete offerings."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeServices.map((service, idx) => (
            <motion.div
              key={service.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-2xl p-6 sm:p-8 border border-white/5 hover:border-accent-amber/40 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/5 text-accent-amber border border-accent-amber/20">
                    {service.category || 'Rental Package'}
                  </span>
                  <Sparkles className="w-4 h-4 text-accent-amber opacity-60 group-hover:opacity-100 transition" />
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent-amber transition-colors">
                  {service.title}
                </h3>

                <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Features checklist */}
                {service.features && service.features.length > 0 && (
                  <div className="space-y-2.5 pb-6 border-b border-white/5 mb-6 text-xs text-text-muted">
                    {service.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent-amber mt-0.5 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                {/* Pricing */}
                <div className="flex items-baseline justify-between mb-5">
                  <div>
                    <span className="text-2xl font-extrabold text-white">
                      {formatCurrency(service.dailyPrice)}
                    </span>
                    <span className="text-xs text-text-muted ml-1">/day</span>
                  </div>

                  {service.hourlyPrice && (
                    <span className="text-xs font-semibold text-text-muted">
                      {formatCurrency(service.hourlyPrice)}/hr
                    </span>
                  )}
                </div>

                <button
                  onClick={() => openBookingModal(service, 'service')}
                  className="w-full py-3 px-4 rounded-xl font-bold text-black bg-accent-amber hover:bg-accent-amberHover transition shadow-glow-amber flex items-center justify-center gap-2 text-xs"
                >
                  <MessageSquare className="w-4 h-4 fill-black" />
                  <span>Enquire on WhatsApp</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
