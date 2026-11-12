import React from 'react';
import { motion } from 'framer-motion';

export default function SectionHeader({
  badge,
  title,
  subtitle,
  align = 'center',
  accent = 'amber',
}) {
  const isCenter = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`max-w-3xl mb-12 ${isCenter ? 'mx-auto text-center' : 'text-left'}`}
    >
      {badge && (
        <span
          className={`inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 border ${
            accent === 'amber'
              ? 'bg-accent-amber/10 text-accent-amber border-accent-amber/30'
              : 'bg-accent-blue/10 text-accent-blue border-accent-blue/30'
          }`}
        >
          {badge}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-text-muted text-base sm:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
