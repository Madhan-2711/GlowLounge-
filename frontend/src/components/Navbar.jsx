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
    { name: 'Availability', path: '/availability' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 top-0 ${
      scrolled
        ? 'bg-[#090909]/95 backdrop-blur-md border-b border-[#ff003c]/20 py-0'
        : 'bg-transparent py-2'
    }`}>
      {/* Top Art Deco double-line when scrolled */}
      {scrolled && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff003c]/60 to-transparent" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* ── LOGO ── Art Deco diamond frame + Saguni Gaming */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="w-9 h-9 border border-[#ff003c]/60 rotate-45 flex items-center justify-center group-hover:border-[#ff003c] group-hover:shadow-[0_0_12px_rgba(255,0,60,0.5)] transition-all duration-300">
              <Gamepad2 className="w-4 h-4 text-[#ff003c] -rotate-45" />
            </div>
            <span className="font-cinzel-deco font-bold text-lg tracking-widest uppercase text-white">
              Saguni <span className="text-[#ff003c]">Gaming</span>
            </span>
          </Link>

          {/* ── DESKTOP NAV LINKS ── Josefin Sans, fine tracking */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative font-josefin font-600 text-sm uppercase tracking-[0.2em] transition-all duration-300 pb-1 group ${
                  location.pathname === link.path
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {link.name}
                {/* Animated underline — full width on active, grows from center on hover */}
                <span className={`absolute bottom-0 left-0 h-[1px] bg-[#ff003c] transition-all duration-300 ${
                  location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            ))}
          </div>

          {/* ── USER / CTA AREA ── */}
          <div className="hidden md:flex items-center gap-4">
            {profile ? (
              <>
                {profile.role === 'admin' ? (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center gap-2 text-gray-300 hover:text-white font-josefin text-xs uppercase tracking-[0.2em] transition-colors"
                  >
                    <User className="w-4 h-4 text-[#ff003c]" />
                    Operator Panel
                  </Link>
                ) : (
                  <>
                    {/* Wallet Balance — Art Deco badge */}
                    <div className="flex items-center gap-2 border border-[#ff003c]/30 px-4 py-2 bg-[#ff003c]/5 relative">
                      {/* Corner embellishments */}
                      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ff003c]/60" />
                      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ff003c]/60" />
                      <div className="w-1.5 h-1.5 bg-green-500 animate-pulse" />
                      <span className="font-cinzel text-xs text-[#ff003c] tracking-widest uppercase font-bold">
                        🪙 {profile.wallet_balance}
                      </span>
                    </div>
                    <Link
                      to="/my-bookings"
                      className="font-josefin text-[11px] uppercase tracking-[0.18em] text-gray-400 hover:text-white transition-colors"
                    >
                      My Sessions
                    </Link>
                    <Link
                      to="/add-coins"
                      className="font-josefin text-[11px] uppercase tracking-[0.18em] text-green-400 hover:text-green-300 border border-green-500/30 px-3 py-1.5 transition-all hover:border-green-400/60 hover:bg-green-500/5"
                    >
                      + Add Coins
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-[#ff003c] transition-colors ml-1"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="font-josefin text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* CTA Button — Art Deco sharp, red */}
            <Link
              to="/availability"
              className="relative font-cinzel text-xs uppercase tracking-[0.2em] bg-[#ff003c] text-white px-7 py-3 transition-all duration-300 hover:bg-[#cc002f] shadow-[0_0_18px_rgba(255,0,60,0.45)] hover:shadow-[0_0_28px_rgba(255,0,60,0.7)] border border-[#ff003c]"
            >
              Book Now
            </Link>
          </div>

          {/* ── MOBILE MENU TOGGLE ── */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none border border-[#ff003c]/20 p-1.5 transition-colors hover:border-[#ff003c]/60"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {isOpen && (
        <div className="md:hidden bg-[#090909]/98 border-t border-[#ff003c]/15 absolute w-full left-0">
          <div className="px-5 py-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`block py-3 font-josefin text-sm uppercase tracking-[0.2em] border-b border-white/5 transition-colors ${
                  location.pathname === link.path
                    ? 'text-white border-[#ff003c]/20'
                    : 'text-gray-400 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {profile ? (
              <>
                {profile.role === 'admin' ? (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block py-3 font-josefin text-sm uppercase tracking-[0.15em] text-gray-300 hover:text-white border-b border-white/5 flex items-center gap-2"
                  >
                    <User className="w-4 h-4 text-[#ff003c]" /> Operator Panel
                  </Link>
                ) : (
                  <>
                    <div className="py-4 border border-[#ff003c]/25 bg-[#ff003c]/5 px-4 text-center my-3">
                      <p className="font-cinzel text-[10px] uppercase tracking-widest text-gray-500 mb-1">Wallet Balance</p>
                      <p className="font-cinzel font-bold text-[#ff003c] text-lg">🪙 {profile.wallet_balance} Coins</p>
                    </div>
                    <Link to="/my-bookings" onClick={() => setIsOpen(false)} className="block py-3 font-josefin text-sm uppercase tracking-[0.15em] text-gray-400 hover:text-white border-b border-white/5">My Sessions</Link>
                    <Link to="/add-coins" onClick={() => setIsOpen(false)} className="block py-3 font-josefin text-sm uppercase tracking-[0.15em] text-green-400 hover:text-green-300 border-b border-white/5">+ Add Coins</Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-3 font-josefin text-sm uppercase tracking-[0.15em] text-gray-500 hover:text-[#ff003c] flex items-center gap-2 transition-colors border-b border-white/5"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block py-3 font-josefin text-sm uppercase tracking-[0.2em] text-gray-400 hover:text-white border-b border-white/5">Sign In</Link>
            )}

            <Link
              to="/availability"
              onClick={() => setIsOpen(false)}
              className="block text-center mt-5 font-cinzel text-sm uppercase tracking-[0.2em] bg-[#ff003c] text-white py-3.5 shadow-[0_0_15px_rgba(255,0,60,0.4)] border border-[#ff003c]"
            >
              Book Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
