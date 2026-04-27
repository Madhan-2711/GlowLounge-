import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Monitor, Gamepad, Clock, Coins, ArrowLeft, Receipt } from 'lucide-react';

// #9 FIX: Created customer booking history page

const MyBookings = ({ session, profile }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!session || !profile) {
      navigate('/login');
      return;
    }
    if (profile.role === 'admin') {
      navigate('/admin/dashboard');
      return;
    }
    fetchMyBookings();
  }, [session, profile]);

  const fetchMyBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('bookings')
      .select('id, seat_id, cost, created_at')
      .eq('customer_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  const totalSpent = bookings.reduce((sum, b) => sum + b.cost, 0);

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <Link
              to="/availability"
              className="flex items-center gap-2 text-gray-500 hover:text-white text-xs uppercase tracking-widest font-bold transition-colors mb-3"
            >
              <ArrowLeft className="w-3 h-3" /> Back to Grid
            </Link>
            <h1 className="text-3xl font-orbitron font-bold text-white uppercase tracking-widest">My Sessions</h1>
            <p className="text-gray-400 text-sm mt-1">Your complete booking history at Glow Lounge</p>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="glass-panel px-5 py-4 rounded-lg border border-white/10 text-center">
              <div className="text-2xl font-orbitron font-black text-white">{bookings.length}</div>
              <div className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mt-1">Sessions</div>
            </div>
            <div className="glass-panel px-5 py-4 rounded-lg border border-[#ff003c]/30 text-center">
              <div className="text-2xl font-orbitron font-black text-[#ff003c]">🪙 {totalSpent}</div>
              <div className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mt-1">Total Spent</div>
            </div>
            <div className="glass-panel px-5 py-4 rounded-lg border border-green-500/30 text-center">
              <div className="text-2xl font-orbitron font-black text-green-400">🪙 {profile?.wallet_balance ?? 0}</div>
              <div className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mt-1">Balance</div>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="text-center text-gray-400 font-orbitron uppercase tracking-widest animate-pulse py-20">
            Fetching your session logs...
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-panel rounded-lg border border-white/5 p-16 text-center">
            <Receipt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 font-orbitron uppercase tracking-widest font-bold text-sm">No bookings found</p>
            <p className="text-gray-600 text-xs mt-2 mb-6">You haven't booked any stations yet.</p>
            <Link
              to="/availability"
              className="inline-block bg-[#ff003c] hover:bg-[#d00030] text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_15px_rgba(255,0,60,0.4)]"
            >
              Book a Station
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => {
              const date = new Date(booking.created_at);
              return (
                <div
                  key={booking.id}
                  className="glass-panel rounded-lg border border-white/5 hover:border-white/10 transition-all duration-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Left: Index + Icon + Station */}
                  <div className="flex items-center gap-4">
                    <div className="text-gray-600 font-orbitron font-bold text-xs w-6 text-right shrink-0">
                      #{bookings.length - index}
                    </div>
                    <div className="p-2 bg-[#ff003c]/10 border border-[#ff003c]/20 rounded-lg">
                      <Monitor className="w-5 h-5 text-[#ff003c]" />
                    </div>
                    <div>
                      <div className="font-orbitron font-bold text-white tracking-widest">STN-{booking.seat_id}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-gray-500 text-xs">{date.toLocaleDateString()}</span>
                        <span className="text-gray-600 text-xs">·</span>
                        <span className="text-gray-500 text-xs">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Cost */}
                  <div className="flex items-center gap-2 sm:text-right">
                    <span className="text-gray-500 text-xs uppercase font-bold tracking-widest">Deducted:</span>
                    <span className="font-orbitron font-black text-[#ff003c]">🪙 {booking.cost}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
