import React from 'react';
import { Monitor, Trophy, Coffee, Zap } from 'lucide-react';

const features = [
  {
    icon: Monitor,
    title: 'Premium Setups',
    description: 'RTX 4090s, 360Hz monitors, and ergonomic gaming chairs for the ultimate experience.'
  },
  {
    icon: Trophy,
    title: 'Daily Tournaments',
    description: 'Compete in daily and weekly tournaments across various titles with massive prize pools.'
  },
  {
    icon: Coffee,
    title: 'Energy Bar',
    description: 'Stay fueled with our selection of energy drinks, snacks, and proper meals.'
  },
  {
    icon: Zap,
    title: 'Fiber Internet',
    description: 'Zero lag gaming with our dedicated 10Gbps fiber optic connection.'
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-[#121212] relative" id="features">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff003c]/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl font-orbitron font-bold text-white uppercase tracking-widest mb-4">Why Choose <span className="text-[#ff003c]">Us</span></h2>
          <div className="h-1 w-24 bg-[#ff003c] mx-auto shadow-[0_0_10px_rgba(255,0,60,0.8)]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center group cursor-default">
                <div className="w-20 h-20 mb-6 rounded-full glass-panel flex items-center justify-center border border-white/10 group-hover:border-[#ff003c] transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(255,0,60,0.4)] group-hover:-translate-y-2">
                  <Icon className="w-10 h-10 text-gray-300 group-hover:text-[#ff003c] transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-orbitron font-bold text-white mb-3 uppercase tracking-wider">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#ff003c]/50 to-transparent"></div>
    </section>
  );
};

export default Features;
