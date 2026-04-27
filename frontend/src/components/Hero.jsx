import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

// #12 FIX: Removed unused ChevronRight import
// #7 FIX: Fixed description text (removed stale "tournaments" reference), added CTA button

const Hero = () => {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center" id="home">
      {/* Background with glowing orb effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff003c]/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-[#00ff64]/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-orbitron font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight mb-8">
            LEVEL UP YOUR <br className="hidden sm:block" />
            <span className="text-[#ff003c] neon-text-red">EXPERIENCE</span>
          </h1>

          <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Welcome to Glow Lounge — your premium gaming destination. Book high-end PC rigs and console stations in real time, instantly and effortlessly.
          </p>

          {/* Stats Row */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-lg">
              <Zap className="w-4 h-4 text-[#ff003c]" />
              <span className="font-orbitron font-bold text-white text-sm uppercase tracking-widest">Real-Time Availability</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-lg">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="font-orbitron font-bold text-white text-sm uppercase tracking-widest">Instant Booking</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-3 rounded-lg">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="font-orbitron font-bold text-white text-sm uppercase tracking-widest">Digital Wallet</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/availability"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff003c] text-white px-10 py-4 rounded-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(255,0,60,0.5)] hover:shadow-[0_0_35px_rgba(255,0,60,0.8)] hover:scale-105 border border-[#ff003c]/50 font-orbitron"
            >
              Book a Station
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent text-white px-10 py-4 rounded-sm font-bold uppercase tracking-widest transition-all duration-300 border border-white/20 hover:border-white hover:bg-white/5 font-orbitron"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
