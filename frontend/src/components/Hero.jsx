import React from 'react';
import { ChevronRight } from 'lucide-react';

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
            Welcome to Saguni Gaming. Unleash your potential in our premium esports arenas, book high-end setups, and compete in epic tournaments.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#ff003c] text-white px-8 py-4 rounded-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_20px_rgba(255,0,60,0.5)] hover:shadow-[0_0_35px_rgba(255,0,60,0.8)] hover:scale-105 border border-[#ff003c]/50">
              Book A Setup <ChevronRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent text-white px-8 py-4 rounded-sm font-bold uppercase tracking-widest transition-all duration-300 border border-white/20 hover:border-white hover:bg-white/5">
              View Tournaments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
