import React, { useState } from 'react';
import { Monitor, Gamepad, Zap, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Availability = ({ slots, loading, profile, setProfile }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Aggregate data
  const pcCount = slots.filter(s => s.console_type.includes('PC') && s.is_available).length;
  const consoleCount = slots.filter(s => !s.console_type.includes('PC') && s.is_available).length;

  const handleSlotClick = (slot) => {
    if (slot.is_available) {
      setSelectedSlot(slot);
    }
  };

  const executeBooking = async () => {
    if (!selectedSlot) return;

    if (!profile) {
       alert("Authentication Required: Please login to secure a session.");
       return;
    }

    const cost = selectedSlot.price || 100;

    if (profile.wallet_balance < cost) {
       alert(`Transaction Failed: Hardware access requires ${cost} Coins. Your balance is ${profile.wallet_balance}. Please top up.`);
       return;
    }

    setBookingLoading(true);
    
    // 1. Economy Deduction (Wallet)
    const newBalance = profile.wallet_balance - cost;
    const { error: walletError } = await supabase
       .from('user_profiles')
       .update({ wallet_balance: newBalance })
       .eq('id', profile.id);
       
    if (walletError) {
       alert("Economy transaction failed: " + walletError.message);
       setBookingLoading(false);
       return;
    }

    // Instantly lock out local balance to prevent double-booking attempts
    if (setProfile) {
       setProfile(prev => ({ ...prev, wallet_balance: newBalance }));
    }

    // 2. Booking Ledger Write
    const { error: bookingError } = await supabase
       .from('bookings')
       .insert([{
          customer_id: profile.id,
          seat_id: selectedSlot.seat_id,
          cost: cost
       }]);

    if (bookingError) {
       console.error("Ledger Warning - could not print receipt:", bookingError);
    }

    // 3. Hardware Lock (Change state to OCCUPIED)
    const { error } = await supabase
      .from('gaming_slots')
      .update({ is_available: false })
      .eq('seat_id', selectedSlot.seat_id);

    setBookingLoading(false);
    
    if (error) {
       alert("Error locking the sequence: " + error.message);
    } else {
       setSelectedSlot(null); // Close modal on success
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen relative">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-orbitron font-bold text-[#ff003c] uppercase tracking-widest mb-4 neon-text-red">Live Availability</h1>
          <p className="text-gray-400 text-lg">Check real-time availability. Click an Online rig to secure your session immediately.</p>
        </div>

        {/* Top level stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="glass-panel p-10 rounded-lg text-center border hover:border-[#ff003c]/50 transition-colors relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#ff003c]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Monitor className="w-16 h-16 mx-auto mb-6 text-gray-300 relative z-10" />
            <h2 className="text-2xl font-orbitron font-bold mb-2 uppercase tracking-wider relative z-10">Gaming PCs</h2>
            <div className="text-6xl font-black text-white neon-text-red my-4 relative z-10">{pcCount}</div>
            <p className="text-gray-400 font-medium tracking-wide uppercase relative z-10">Available Now</p>
          </div>

          <div className="glass-panel p-10 rounded-lg text-center border hover:border-[#ff003c]/50 transition-colors relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#ff003c]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Gamepad className="w-16 h-16 mx-auto mb-6 text-gray-300 relative z-10" />
            <h2 className="text-2xl font-orbitron font-bold mb-2 uppercase tracking-wider relative z-10">Consoles</h2>
            <div className="text-6xl font-black text-white neon-text-red my-4 relative z-10">{consoleCount}</div>
            <p className="text-gray-400 font-medium tracking-wide uppercase relative z-10">Available Now</p>
          </div>
        </div>

        {/* Live Grid */}
        <div className="mb-10 text-center flex items-center justify-center gap-3">
           <Zap className="w-6 h-6 text-[#ff003c] animate-pulse" />
           <h2 className="text-2xl font-orbitron font-bold text-white uppercase tracking-widest">Live Arena Grid</h2>
           <Zap className="w-6 h-6 text-[#ff003c] animate-pulse" />
        </div>

        {loading ? (
           <div className="text-center text-gray-400 font-orbitron uppercase tracking-widest animate-pulse mt-20">Accessing Mainframe...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 relative z-0">
            {slots.map(slot => (
              <button 
                key={slot.seat_id} 
                onClick={() => handleSlotClick(slot)}
                disabled={!slot.is_available}
                className={`relative p-6 rounded-lg border flex flex-col items-center justify-center gap-3 transition-all duration-300 shadow-lg ${
                   slot.is_available 
                   ? 'border-green-500/50 bg-green-500/10 hover:bg-green-500/20 hover:scale-105 shadow-[0_0_15px_rgba(34,197,94,0.15)] cursor-pointer' 
                   : 'border-red-500/50 bg-red-500/10 opacity-75 shadow-[0_0_15px_rgba(239,68,68,0.15)] cursor-not-allowed'
                }`}
              >
                {/* Icon based on console_type */}
                {slot.console_type.includes('PC') ? (
                  <Monitor className={`w-8 h-8 ${slot.is_available ? 'text-green-400' : 'text-red-400 shrink-0'}`} />
                ) : (
                  <Gamepad className={`w-8 h-8 ${slot.is_available ? 'text-green-400' : 'text-red-400 shrink-0'}`} />
                )}
                
                {/* Seat ID and Status */}
                <div className="text-center font-orbitron tracking-widest w-full">
                  <div className="text-white font-bold text-lg mb-1">STN-{slot.seat_id}</div>
                  <div className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">{slot.console_type.replace('_', ' ')} System</div>
                  <div className={`text-xs font-black uppercase tracking-wider ${slot.is_available ? 'text-green-400' : 'text-red-400'}`}>
                    {slot.is_available ? 'ONLINE' : 'OCCUPIED'}
                  </div>
                </div>

                {/* Cyberpunk accent lines */}
                {slot.is_available && (
                   <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-green-500 rounded-tr-md"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-down">
          <div className="glass-panel p-8 rounded-lg max-w-md w-full border border-[#ff003c]/50 shadow-[0_0_30px_rgba(255,0,60,0.3)] relative">
            <button 
              onClick={() => setSelectedSlot(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-orbitron font-bold text-white uppercase tracking-widest mb-6">Initialize Booking</h2>
            
            <div className="mb-8 space-y-4">
               <p className="text-gray-300 text-sm tracking-wide">
                 You are about to securely lock the following rigorous hardware sequence:
               </p>
               
               <div className="bg-[#090909] p-4 rounded border border-white/10 flex items-center gap-4">
                 {selectedSlot.console_type.includes('PC') ? <Monitor className="w-10 h-10 text-[#ff003c]" /> : <Gamepad className="w-10 h-10 text-[#ff003c]" />}
                 <div>
                    <div className="text-gray-400 text-xs uppercase font-bold tracking-widest">Target Station</div>
                    <div className="text-xl font-orbitron font-bold text-white tracking-widest">
                      STN-{selectedSlot.seat_id} ({selectedSlot.console_type.replace('_', ' ')})
                    </div>
                 </div>
               </div>
               <div className="bg-[#090909] p-4 rounded border border-white/10 mt-4 flex justify-between items-center text-sm uppercase font-bold tracking-widest text-gray-400">
                  <span>Network Access Fee:</span>
                  <span className="text-[#ff003c]">{selectedSlot.price || 100} Coins</span>
               </div>
            </div>

            <button 
              onClick={executeBooking}
              disabled={bookingLoading}
              className="w-full bg-[#ff003c] hover:bg-[#d00030] disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-sm font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(255,0,60,0.5)]"
            >
              {bookingLoading ? 'Executing...' : 'Confirm Allocation'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Availability;
