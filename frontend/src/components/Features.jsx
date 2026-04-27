import React from 'react';
import { Monitor, Trophy, Coffee, Zap } from 'lucide-react';

const features = [
  {
    icon: Monitor,
    title: 'Premium Setups',
    description: 'RTX 5060s, 360Hz monitors, and ergonomic gaming chairs for the ultimate experience.',
    numeral: 'I',
  },
  {
    icon: Trophy,
    title: 'Daily Tournaments',
    description: 'Compete in daily and weekly tournaments across various titles with prize pools.',
    numeral: 'II',
  },
  {
    icon: Coffee,
    title: 'Energy Bar',
    description: 'Stay fueled with our selection of energy drinks, snacks, and proper meals.',
    numeral: 'III',
  },
  {
    icon: Zap,
    title: 'Fiber Internet',
    description: 'Zero lag gaming with our dedicated 10Gbps fiber optic connection.',
    numeral: 'IV',
  },
];

const Features = () => {
  return (
    <section className="py-28 bg-[#0c0c0c] relative" id="features">
      {/* Top rule */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff003c]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Heading — Art Deco style ── */}
        <div className="text-center mb-20">
          {/* Pre-heading divider */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-[1px] w-12 bg-[#ff003c]/50" />
            <div className="w-1.5 h-1.5 rotate-45 border border-[#ff003c]/70" />
            <div className="h-[1px] w-12 bg-[#ff003c]/50" />
          </div>

          <h2 className="font-cinzel font-bold text-3xl sm:text-4xl text-white uppercase tracking-[0.1em] mb-4">
            Why Choose <span className="text-[#ff003c]">Us</span>
          </h2>

          {/* Post-heading decorative line */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#ff003c]/60" />
            <div className="w-2 h-2 rotate-45 bg-[#ff003c]" />
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#ff003c]/60" />
          </div>
        </div>

        {/* ── Feature Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.numeral}
                className="deco-card p-8 flex flex-col items-center text-center group cursor-default"
              >
                {/* Roman numeral — Art Deco touch */}
                <span className="font-cinzel text-[10px] uppercase tracking-[0.4em] text-[#ff003c]/50 mb-5">
                  {feature.numeral}
                </span>

                {/* Rotated diamond icon frame — Art Deco signature */}
                <div className="deco-diamond mb-7">
                  <Icon className="w-6 h-6 text-gray-400 group-hover:text-[#ff003c] transition-colors duration-300" />
                </div>

                <h3 className="font-cinzel font-bold text-white text-base uppercase tracking-[0.12em] mb-3">
                  {feature.title}
                </h3>
                <p className="font-josefin text-gray-500 text-sm leading-relaxed group-hover:text-gray-400 transition-colors">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom rule */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff003c]/40 to-transparent" />
    </section>
  );
};

export default Features;
