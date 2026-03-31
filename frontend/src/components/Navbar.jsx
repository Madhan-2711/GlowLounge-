import React, { useState, useEffect } from 'react';
import { Menu, X, Gamepad2, User, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Navbar = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Games', path: '/games' },
    { name: 'Availability', path: '/availability' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 top-0 ${scrolled ? 'glass-panel border-b border-white/5 py-0' : 'bg-transparent py-2'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer group">
            <Gamepad2 className="text-[#ff003c] w-8 h-8 drop-shadow-[0_0_10px_rgba(255,0,60,0.8)] group-hover:scale-110 transition-transform" />
            <span className="font-orbitron font-bold text-2xl tracking-wider uppercase text-white">
              Saguni <span className="text-[#ff003c]">Gaming</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`transition-colors duration-200 font-medium uppercase tracking-wide hover:neon-text-red ${location.pathname === link.path ? 'text-white neon-text-red' : 'text-gray-300 hover:text-white'}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User / CTA / Wallet */}
          <div className="hidden md:flex items-center gap-5">
             {profile ? (
                <div className="flex items-center gap-4 mr-2">
                   {profile.role === 'admin' ? (
                      <Link to="/admin/dashboard" className="text-gray-300 hover:text-white hover:neon-text-red transition-all flex items-center gap-2 font-bold uppercase tracking-wide text-sm">
                        <User className="w-5 h-5 text-[#ff003c]" />
                        Operator Panel
                      </Link>
                   ) : (
                      <div className="flex items-center gap-3 bg-[#090909] px-4 py-2 border border-[#ff003c]/30 rounded shadow-[inset_0_0_10px_rgba(255,0,60,0.1)]">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="font-orbitron font-bold text-[#ff003c] tracking-widest text-xs uppercase">🪙 {profile.wallet_balance} Coins</span>
                      </div>
                   )}
                   <button 
                     onClick={handleLogout}
                     className="text-gray-400 hover:text-[#ff003c] transition-colors ml-2 flex items-center gap-1 uppercase font-bold text-[10px] tracking-widest"
                     title="Terminate Session"
                   >
                     <LogOut className="w-4 h-4" /> Terminate
                   </button>
                </div>
             ) : (
                <Link to="/login" className="text-gray-300 hover:text-white uppercase font-bold text-xs tracking-widest transition-colors mr-2">
                   &gt; Authenticate &lt;
                </Link>
             )}

             <Link to="/availability" className="bg-[#ff003c] hover:bg-[#d00030] text-white px-7 py-2.5 rounded-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(255,0,60,0.5)] hover:shadow-[0_0_25px_rgba(255,0,60,0.8)] border border-[#ff003c]/50">
               Book Now
             </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white focus:outline-none">
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-t border-white/5 absolute w-full left-0 origin-top animate-fade-in-down">
          <div className="px-4 pt-2 pb-6 space-y-2">
             {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`block px-3 py-3 text-lg font-medium hover:bg-white/5 rounded-md transition-colors ${location.pathname === link.path ? 'text-white neon-text-red' : 'text-gray-300 hover:text-white'}`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
             {profile ? (
                <>
                   {profile.role === 'admin' ? (
                      <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors flex items-center gap-2">
                        <User className="w-5 h-5 text-[#ff003c]" />
                        Operator Panel
                      </Link>
                   ) : (
                      <div className="mx-3 mt-2 mb-2 bg-[#090909] p-4 text-center border border-[#ff003c]/30 rounded">
                        <span className="font-orbitron font-bold text-[#ff003c] tracking-widest uppercase block mb-1 text-xs">Secure Wallet</span>
                        <span className="font-black text-xl text-white">🪙 {profile.wallet_balance} Coins</span>
                      </div>
                   )}
                   <button 
                     onClick={handleLogout} 
                     className="w-full text-left px-3 py-3 text-lg font-medium text-gray-400 hover:text-[#ff003c] hover:bg-white/5 rounded-md transition-colors flex items-center gap-2 uppercase tracking-wide"
                   >
                     <LogOut className="w-5 h-5" /> Terminate Session
                   </button>
                </>
             ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-lg font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors uppercase tracking-widest">
                   &gt; Authenticate &lt;
                </Link>
             )}

             <Link to="/availability" onClick={() => setIsOpen(false)} className="block text-center w-full mt-4 bg-[#ff003c] text-white px-6 py-3.5 rounded-sm font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(255,0,60,0.5)] border border-[#ff003c]/50">
               Book Now
             </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
