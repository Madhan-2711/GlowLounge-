import React from 'react';
import { Monitor, Gamepad2, Cpu, Zap, Star } from 'lucide-react';

// #8 FIX: Built out the previously empty Games.jsx page

const stations = [
  {
    icon: Monitor,
    name: 'High-End Gaming PCs',
    tag: 'PC Rig',
    description: 'Top-of-the-line custom-built gaming rigs with the latest CPUs, RTX GPUs, high-refresh rate monitors and mechanical keyboards.',
    specs: ['Intel Core i9 / AMD Ryzen 9', 'NVIDIA RTX 4080 / 4090', '240Hz 1ms QHD Display', '32GB DDR5 RAM', '2TB NVMe SSD'],
    color: 'text-[#ff003c]',
    glow: 'shadow-[0_0_20px_rgba(255,0,60,0.15)]',
    border: 'border-[#ff003c]/30',
    accentBg: 'bg-[#ff003c]/10',
  },
  {
    icon: Gamepad2,
    name: 'PlayStation 5',
    tag: 'Console',
    description: 'Sony\'s flagship next-gen console with ultra-fast SSD, DualSense haptic feedback controller, and access to an exclusive game library.',
    specs: ['AMD Zen 2 CPU (8-core)', 'AMD RDNA 2 GPU', '4K / 120fps Gaming', 'DualSense Haptic Controller', '825GB NVMe SSD'],
    color: 'text-blue-400',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]',
    border: 'border-blue-500/30',
    accentBg: 'bg-blue-500/10',
  },
  {
    icon: Cpu,
    name: 'Xbox Series X',
    tag: 'Console',
    description: 'Microsoft\'s most powerful console ever. Experience 4K gaming at 60fps, up to 120fps, and instant load times with Quick Resume.',
    specs: ['AMD Zen 2 CPU (8-core)', '12 TFLOPS GPU', '4K @ 60fps / 120fps', '1TB NVMe SSD', 'Xbox Game Pass Ready'],
    color: 'text-green-400',
    glow: 'shadow-[0_0_20px_rgba(34,197,94,0.15)]',
    border: 'border-green-500/30',
    accentBg: 'bg-green-500/10',
  },
  {
    icon: Zap,
    name: 'Nintendo Switch',
    tag: 'Console',
    description: 'Play anywhere, anytime. Dock it for TV mode, take it on the go in handheld mode — perfect for multiplayer party sessions.',
    specs: ['NVIDIA Tegra Processor', 'Portable + TV Mode', '60fps Handheld Display', 'Joy-Con Controllers', 'Multiplayer Ready'],
    color: 'text-yellow-400',
    glow: 'shadow-[0_0_20px_rgba(250,204,21,0.15)]',
    border: 'border-yellow-500/30',
    accentBg: 'bg-yellow-500/10',
  },
];

const Games = () => {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl font-orbitron font-bold text-white uppercase tracking-widest mb-4">
            Our <span className="text-[#ff003c] neon-text-red">Stations</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Premium hardware. Immersive setups. Every rig is maintained to deliver the highest performance gaming experience.
          </p>
        </div>

        {/* Station Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {stations.map((station) => {
            const Icon = station.icon;
            return (
              <div
                key={station.name}
                className={`glass-panel p-8 rounded-lg border ${station.border} ${station.glow} relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]`}
              >
                {/* Background accent */}
                <div className={`absolute top-0 right-0 w-40 h-40 ${station.accentBg} rounded-bl-[200px] pointer-events-none transition-all duration-300`}></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-30" style={{ color: 'inherit' }}></div>

                <div className="relative z-10">
                  {/* Icon + Tag */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`p-3 rounded-lg ${station.accentBg} border ${station.border}`}>
                      <Icon className={`w-8 h-8 ${station.color}`} />
                    </div>
                    <div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${station.color} block mb-0.5`}>{station.tag}</span>
                      <h2 className="text-2xl font-orbitron font-bold text-white">{station.name}</h2>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">{station.description}</p>

                  {/* Specs */}
                  <div className="space-y-2">
                    {station.specs.map((spec) => (
                      <div key={spec} className="flex items-center gap-2">
                        <Star className={`w-3 h-3 ${station.color} shrink-0`} />
                        <span className="text-gray-300 text-sm font-medium">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="glass-panel rounded-lg border border-[#ff003c]/30 p-12 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-[#ff003c]/10 blur-[80px] rounded-full pointer-events-none"></div>
          <h2 className="text-3xl font-orbitron font-bold text-white uppercase tracking-widest mb-4 relative z-10">
            Ready to Play?
          </h2>
          <p className="text-gray-400 mb-8 relative z-10">Check real-time availability and lock in your rig instantly.</p>
          <a
            href="/availability"
            className="relative z-10 inline-flex items-center gap-2 bg-[#ff003c] hover:bg-[#d00030] text-white px-10 py-4 rounded-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(255,0,60,0.5)] hover:shadow-[0_0_35px_rgba(255,0,60,0.8)] hover:scale-105 font-orbitron"
          >
            View Live Grid
          </a>
        </div>

      </div>
    </div>
  );
};

export default Games;
