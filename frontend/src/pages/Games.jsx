import React from 'react';
import { Monitor, Gamepad2, Cpu, Zap, ChevronRight } from 'lucide-react';

const stations = [
  {
    icon: Monitor,
    name: 'High-End Gaming PCs',
    tag: 'PC Rig',
    numeral: 'I',
    description: 'Top-of-the-line custom-built gaming rigs with the latest CPUs, RTX GPUs, high-refresh rate monitors and mechanical keyboards.',
    specs: ['Intel Core i9 / AMD Ryzen 9', 'NVIDIA RTX 5060 / 5060 Ti', '240Hz 1ms QHD Display', '32GB DDR5 RAM', '2TB NVMe SSD'],
    accentColor: '#ff003c',
  },
  {
    icon: Gamepad2,
    name: 'PlayStation 5',
    tag: 'Console',
    numeral: 'II',
    description: "Sony's flagship next-gen console with ultra-fast SSD, DualSense haptic feedback controller, and access to an exclusive game library.",
    specs: ['AMD Zen 2 CPU (8-core)', 'AMD RDNA 2 GPU', '4K / 120fps Gaming', 'DualSense Haptic Controller', '825GB NVMe SSD'],
    accentColor: '#3b82f6',
  },
  {
    icon: Cpu,
    name: 'Xbox Series X',
    tag: 'Console',
    numeral: 'III',
    description: "Microsoft's most powerful console ever. Experience 4K gaming at 60fps, up to 120fps, and instant load times with Quick Resume.",
    specs: ['AMD Zen 2 CPU (8-core)', '12 TFLOPS GPU', '4K @ 60fps / 120fps', '1TB NVMe SSD', 'Xbox Game Pass Ready'],
    accentColor: '#22c55e',
  },
  {
    icon: Zap,
    name: 'Nintendo Switch',
    tag: 'Console',
    numeral: 'IV',
    description: 'Play anywhere, anytime. Dock it for TV mode, take it on the go in handheld mode — perfect for multiplayer party sessions.',
    specs: ['NVIDIA Tegra Processor', 'Portable + TV Mode', '60fps Handheld Display', 'Joy-Con Controllers', 'Multiplayer Ready'],
    accentColor: '#eab308',
  },
];

const Games = () => {
  return (
    <div className="pt-36 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">

        {/* ── Section Header ── */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-[1px] w-12 bg-[#ff003c]/50" />
            <div className="w-1.5 h-1.5 rotate-45 border border-[#ff003c]/70" />
            <div className="h-[1px] w-12 bg-[#ff003c]/50" />
          </div>
          <h1 className="font-cinzel font-black text-4xl sm:text-5xl text-white uppercase tracking-[0.08em] mb-4">
            Our <span className="text-[#ff003c] neon-text-red">Stations</span>
          </h1>
          <p className="font-josefin text-gray-400 text-base max-w-xl mx-auto leading-relaxed tracking-wide">
            Premium hardware. Immersive setups. Every rig is maintained to deliver the highest performance gaming experience.
          </p>
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#ff003c]/60" />
            <div className="w-2 h-2 rotate-45 bg-[#ff003c]" />
            <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#ff003c]/60" />
          </div>
        </div>

        {/* ── Station Cards — Art Deco Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {stations.map((station) => {
            const Icon = station.icon;
            return (
              <div
                key={station.name}
                className="deco-card p-8 group"
              >
                {/* Top row: Roman numeral tag + icon */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="font-josefin text-[10px] uppercase tracking-[0.4em] text-gray-600 block mb-1">
                      {station.numeral} — {station.tag}
                    </span>
                    <h2 className="font-cinzel font-bold text-xl text-white uppercase tracking-[0.08em]">
                      {station.name}
                    </h2>
                  </div>

                  {/* Diamond icon frame */}
                  <div
                    className="w-12 h-12 rotate-45 flex items-center justify-center flex-shrink-0 ml-4 transition-all duration-400"
                    style={{
                      border: `1px solid ${station.accentColor}40`,
                      background: `${station.accentColor}08`,
                    }}
                  >
                    <Icon
                      className="w-5 h-5 -rotate-45 transition-colors duration-300"
                      style={{ color: station.accentColor }}
                    />
                  </div>
                </div>

                {/* Separator */}
                <div className="h-[1px] bg-gradient-to-r from-[#ff003c]/20 via-white/5 to-transparent mb-5" />

                {/* Description */}
                <p className="font-josefin text-gray-500 text-sm leading-relaxed mb-6 group-hover:text-gray-400 transition-colors">
                  {station.description}
                </p>

                {/* Specs */}
                <ul className="space-y-2">
                  {station.specs.map((spec) => (
                    <li key={spec} className="flex items-center gap-3">
                      <ChevronRight className="w-3 h-3 text-[#ff003c] shrink-0" />
                      <span className="font-josefin text-gray-400 text-sm">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="deco-card p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 deco-sunburst pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-[1px] w-10 bg-[#ff003c]/50" />
              <div className="w-1.5 h-1.5 rotate-45 border border-[#ff003c]" />
              <div className="h-[1px] w-10 bg-[#ff003c]/50" />
            </div>
            <h2 className="font-cinzel font-bold text-3xl text-white uppercase tracking-[0.1em] mb-4">
              Ready to Play?
            </h2>
            <p className="font-josefin text-gray-400 mb-10 tracking-wide">
              Check real-time availability and lock in your rig instantly.
            </p>
            <a
              href="/availability"
              className="inline-flex items-center gap-3 font-cinzel text-sm uppercase tracking-[0.22em] bg-[#ff003c] text-white px-12 py-4 shadow-[0_0_22px_rgba(255,0,60,0.5)] hover:shadow-[0_0_38px_rgba(255,0,60,0.75)] hover:bg-[#cc002f] transition-all duration-400 border border-[#ff003c]"
            >
              View Live Grid
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Games;
