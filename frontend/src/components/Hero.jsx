import React from 'react';
import { Link } from 'react-router-dom';

const Hero = ({ session }) => {
  return (
    <div className="relative pt-36 pb-24 lg:pt-52 lg:pb-36 overflow-hidden min-h-screen flex items-center" id="home">

      {/* ── Art Deco Sunburst background radial ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] deco-sunburst" />
        {/* Vertical architectural lines */}
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-[#ff003c]/8 to-transparent" />
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-[#ff003c]/8 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">

        {/* ── Art Deco pre-heading tag ── */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-[1px] w-16 bg-[#ff003c]/60" />
          <span className="font-josefin text-[11px] uppercase tracking-[0.4em] text-[#ff003c]">Premium Gaming Lounge</span>
          <div className="h-[1px] w-16 bg-[#ff003c]/60" />
        </div>

        {/* ── Main Heading — Cinzel (Art Deco Roman) ── */}
        <h1 className="font-cinzel font-black uppercase tracking-[0.06em] mb-6 leading-[1.05]">
          <span className="block text-5xl sm:text-7xl lg:text-8xl text-white">Level Up</span>
          <span className="block text-5xl sm:text-7xl lg:text-8xl text-[#ff003c] neon-text-red">Your Experience</span>
        </h1>

        {/* ── Decorative separator ── */}
        <div className="flex items-center justify-center gap-4 my-8">
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-[#ff003c]/50" />
          {/* Art Deco diamond ornament */}
          <div className="w-2 h-2 rotate-45 border border-[#ff003c]/80" />
          <div className="w-3 h-3 rotate-45 bg-[#ff003c]/20 border border-[#ff003c]" />
          <div className="w-2 h-2 rotate-45 border border-[#ff003c]/80" />
          <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-[#ff003c]/50" />
        </div>

        {/* ── Subtitle — Josefin Sans ── */}
        <p className="font-josefin text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed tracking-wide">
          Your premier destination for high-end PC rigs and console stations.
          Book in real time, instantly and effortlessly.
        </p>

        {/* ── Stats Badges — Art Deco sharp rectangles ── */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14">
          {[
            { label: 'Real-Time Availability' },
            { label: 'Instant Booking' },
            { label: 'Digital Wallet' },
          ].map(({ label }) => (
            <div
              key={label}
              className="relative flex items-center gap-2 border border-[#ff003c]/20 px-7 py-3 bg-[#ff003c]/4 group hover:border-[#ff003c]/50 transition-all duration-300"
            >
              {/* Corner embellishments */}
              <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ff003c]/50" />
              <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ff003c]/50" />
              <div className="w-1 h-1 bg-[#ff003c] rotate-45" />
              <span className="font-josefin text-xs uppercase tracking-[0.22em] text-gray-300 group-hover:text-white transition-colors">{label}</span>
            </div>
          ))}
        </div>

        {/* ── CTA Buttons — Art Deco sharp ── */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Primary CTA */}
          <Link
            to="/availability"
            className="relative w-full sm:w-auto font-cinzel text-sm uppercase tracking-[0.25em] bg-[#ff003c] text-white px-12 py-4 transition-all duration-400 shadow-[0_0_22px_rgba(255,0,60,0.5)] hover:shadow-[0_0_38px_rgba(255,0,60,0.75)] hover:bg-[#cc002f] border border-[#ff003c] flex items-center justify-center gap-3 group"
          >
            {/* Animated left arrow */}
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">›</span>
            Book a Station
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">‹</span>
          </Link>

          {/* Secondary CTA — only show when not signed in */}
          {!session && (
            <Link
              to="/login"
              className="relative w-full sm:w-auto font-cinzel text-sm uppercase tracking-[0.25em] text-white px-12 py-4 transition-all duration-400 border border-white/20 hover:border-[#ff003c]/60 hover:bg-[#ff003c]/5 flex items-center justify-center"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* ── Bottom Art Deco rule ── */}
        <div className="flex items-center justify-center gap-4 mt-20 opacity-30">
          <div className="h-[1px] w-32 bg-[#ff003c]" />
          <div className="w-1.5 h-1.5 rotate-45 bg-[#ff003c]" />
          <div className="h-[1px] w-32 bg-[#ff003c]" />
        </div>
      </div>
    </div>
  );
};

export default Hero;
