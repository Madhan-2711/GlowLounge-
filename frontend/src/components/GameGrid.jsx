import React from 'react';
import { Star, Users, Trophy } from 'lucide-react';

const games = [
  { id: 1, title: 'Valorant', category: 'FPS Tactical', players: '5v5', rating: '4.8', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop' },
  { id: 2, title: 'League of Legends', category: 'MOBA', players: '5v5', rating: '4.9', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop' },
  { id: 3, title: 'CS:GO 2', category: 'FPS Tactical', players: '5v5', rating: '4.7', image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=2038&auto=format&fit=crop' },
  { id: 4, title: 'Apex Legends', category: 'Battle Royale', players: 'Squads', rating: '4.6', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=2070&auto=format&fit=crop' }
];

const GameGrid = () => {
  return (
    <section className="py-24 bg-[#090909] relative" id="games">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-orbitron font-bold text-[#ff003c] uppercase tracking-widest mb-2 neon-text-red">Featured Games</h2>
            <p className="text-gray-400 max-w-2xl text-lg">Top tier competitive titles available on our premium rigs.</p>
          </div>
          <button className="text-white border-b border-[#ff003c] pb-1 hover:text-[#ff003c] transition-colors uppercase tracking-wider font-semibold text-sm">
            View All Games
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {games.map((game) => (
            <div key={game.id} className="group relative rounded-sm overflow-hidden glass-panel border border-white/5 hover:border-[#ff003c]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,0,60,0.3)] hover:-translate-y-2">
              <div className="aspect-[4/5] overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-[#090909] via-[#090909]/50 to-transparent z-10"></div>
                <img 
                  src={game.image} 
                  alt={game.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />
                
                <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                  <div className="text-xs font-bold uppercase tracking-widest text-[#ff003c] mb-2">{game.category}</div>
                  <h3 className="text-2xl font-orbitron font-bold text-white mb-4 group-hover:neon-text-red transition-all">{game.title}</h3>
                  
                  <div className="flex items-center justify-between text-gray-300 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{game.players}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{game.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameGrid;
