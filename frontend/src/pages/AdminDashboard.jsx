import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Monitor, Gamepad, LogOut, CheckCircle, XCircle, Search, DollarSign, Calendar, TrendingUp, Users } from 'lucide-react';

const AdminDashboard = ({ slots, session, profile }) => {
  const navigate = useNavigate();
  const [topupIdentifier, setTopupIdentifier] = useState('');
  const [topupAmount, setTopupAmount] = useState(100);
  const [topupMsg, setTopupMsg] = useState('');

  const [priceSeatId, setPriceSeatId] = useState('');
  const [newPrice, setNewPrice] = useState(100);
  const [priceMsg, setPriceMsg] = useState('');

  // Ledger state
  const [bookings, setBookings] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Route properly if staff member gets logged out or isn't admin
  useEffect(() => {
    if (!session || (profile && profile.role !== 'admin')) {
      navigate('/login');
    } else {
      fetchBookings();
      fetchUsers();
    }
  }, [session, profile, navigate, fromDate, toDate]);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, mobile_number, wallet_balance, created_at')
      .eq('role', 'customer')
      .order('created_at', { ascending: false });

    if (error) {
       console.error('Error fetching global identities:', error);
    } else {
       setRegisteredUsers(data || []);
    }
  };

  const fetchBookings = async () => {
    let query = supabase
      .from('bookings')
      .select(`
        id,
        seat_id,
        cost,
        created_at,
        user_profiles!inner ( email )
      `)
      .order('created_at', { ascending: false });

    if (fromDate) query = query.gte('created_at', new Date(fromDate).toISOString());
    if (toDate) {
      const toDateObj = new Date(toDate);
      toDateObj.setHours(23, 59, 59, 999);
      query = query.lte('created_at', toDateObj.toISOString());
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching ledger:', error);
    } else {
      setBookings(data || []);
    }
  };

  const handleTopup = async (e) => {
    e.preventDefault();
    setTopupMsg('Scanning matrix...');

    const { data: users, error: userError } = await supabase
      .from('user_profiles')
      .select('id, wallet_balance, email, mobile_number')
      .or(`email.eq.${topupIdentifier},mobile_number.eq.${topupIdentifier}`);

    if (userError || !users || users.length === 0) {
      setTopupMsg('Error: Identity not found in matrix.');
      return;
    }

    const user = users[0];
    const newBalance = user.wallet_balance + Number(topupAmount);

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ wallet_balance: newBalance })
      .eq('id', user.id);

    if (updateError) {
      setTopupMsg('Error: Ledger injection failed.');
    } else {
      setTopupMsg(`Success: ${user.email} injected with ${topupAmount} Coins.`);
      setTopupIdentifier('');
      setTopupAmount(100);
      fetchUsers(); // Refresh live table
    }
  };

  const handlePriceUpdate = async (e) => {
     e.preventDefault();
     setPriceMsg('Overriding pricing circuit...');

     const { error } = await supabase
       .from('gaming_slots')
       .update({ price: Number(newPrice) })
       .eq('seat_id', Number(priceSeatId));

     if (error) {
        setPriceMsg('Error: Target station not found or offline.');
     } else {
        setPriceMsg(`Success: STN-${priceSeatId} rating changed to ${newPrice} Coins.`);
        setPriceSeatId('');
        setNewPrice(100);
     }
  };

  const toggleAvailability = async (seatId, currentStatus) => {
    const newStatus = !currentStatus;
    const { error } = await supabase
      .from('gaming_slots')
      .update({ is_available: newStatus })
      .eq('seat_id', seatId);

    if (error) alert('Critical Error: Supabase blocked the override. Have you run the specific RLS SQL injection inside Supabase? ' + error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!session || (profile && profile.role !== 'admin')) return null;

  const pcSlots = slots.filter(s => s.console_type.includes('PC'));
  const consoleSlots = slots.filter(s => !s.console_type.includes('PC'));

  const availablePcCount = pcSlots.filter(s => s.is_available).length;
  const availableConsoleCount = consoleSlots.filter(s => s.is_available).length;

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-white/10 pb-6 gap-6">
          <div>
             <h1 className="text-3xl font-orbitron font-bold text-white uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Command Center</h1>
             <p className="text-[#ff003c] font-black tracking-widest uppercase text-sm mt-1 neon-text-red">Administrator Access Authorized</p>
          </div>
          <button 
            onClick={logout} 
            className="flex items-center gap-2 px-6 py-2 border border-gray-600 rounded bg-[#090909] text-gray-400 hover:text-[#ff003c] hover:border-[#ff003c] transition-colors shadow-lg"
          >
            <LogOut className="w-5 h-5" />
            <span className="uppercase font-bold text-sm tracking-wider">Terminate Session</span>
          </button>
        </div>

        {/* Global HUD available counts & Control Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
            <div className="glass-panel py-6 px-4 rounded-lg text-center border overflow-hidden relative shadow-[0_0_15px_rgba(34,197,94,0.1)] border-[#090909]">
               <div className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-2">Available PCs</div>
               <div className="text-3xl font-orbitron font-black text-white">{availablePcCount} <span className="text-sm font-normal text-gray-500">/ {pcSlots.length}</span></div>
            </div>
            
            <div className="glass-panel py-6 px-4 rounded-lg text-center border overflow-hidden relative shadow-[0_0_15px_rgba(34,197,94,0.1)] border-[#090909]">
               <div className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mb-2">Consoles</div>
               <div className="text-3xl font-orbitron font-black text-white">{availableConsoleCount} <span className="text-sm font-normal text-gray-500">/ {consoleSlots.length}</span></div>
            </div>
            
            {/* Operator Credit Injection Module */}
            <div className="glass-panel p-4 rounded-lg border border-[#ff003c]/30 shadow-[0_0_15px_rgba(255,0,60,0.1)] relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff003c]/5 rounded-bl-[100px] pointer-events-none"></div>
               <h3 className="text-white font-orbitron uppercase tracking-widest font-bold mb-3 flex items-center gap-2 text-xs"><DollarSign className="w-3 h-3 text-[#ff003c]"/> Economy Load</h3>
               <form onSubmit={handleTopup} className="space-y-2 relative z-10">
                 <input 
                   type="text" 
                   required
                   value={topupIdentifier}
                   onChange={e => setTopupIdentifier(e.target.value)}
                   placeholder="Email or Mobile #"
                   className="w-full bg-[#090909] text-white p-2 text-xs rounded border border-white/20 focus:border-[#ff003c] focus:outline-none transition-colors"
                 />
                 <div className="flex gap-2">
                   <input 
                     type="number" 
                     required
                     min="1"
                     value={topupAmount}
                     onChange={e => setTopupAmount(e.target.value)}
                     className="w-1/3 bg-[#090909] text-white p-2 text-xs rounded border border-white/20 focus:border-[#ff003c] focus:outline-none transition-colors"
                   />
                   <button type="submit" className="w-2/3 bg-[#ff003c] hover:bg-[#d00030] text-white py-1.5 rounded font-bold uppercase tracking-widest text-[10px] transition-colors">
                     Inject Funds
                   </button>
                 </div>
               </form>
               {topupMsg && <div className={`mt-2 text-[10px] font-bold ${topupMsg.includes('Error') ? 'text-red-500' : 'text-green-500'} leading-tight`}>{topupMsg}</div>}
            </div>

            {/* Dynamic Pricing Controller */}
            <div className="glass-panel p-4 rounded-lg border border-white/10 relative overflow-hidden hover:border-white/30 transition-colors">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] pointer-events-none"></div>
               <h3 className="text-white font-orbitron uppercase tracking-widest font-bold mb-3 flex items-center gap-2 text-xs"><TrendingUp className="w-3 h-3 text-gray-400"/> Price Sync</h3>
               <form onSubmit={handlePriceUpdate} className="space-y-2 relative z-10">
                 <input 
                   type="number" 
                   required
                   value={priceSeatId}
                   onChange={e => setPriceSeatId(e.target.value)}
                   placeholder="Target Seat ID (e.g. 1)"
                   className="w-full bg-[#090909] text-white p-2 text-xs rounded border border-white/20 focus:border-white/50 focus:outline-none transition-colors"
                 />
                 <div className="flex gap-2">
                   <input 
                     type="number" 
                     required
                     min="1"
                     value={newPrice}
                     onChange={e => setNewPrice(e.target.value)}
                     placeholder="New Cost"
                     className="w-1/3 bg-[#090909] text-white p-2 text-xs rounded border border-white/20 focus:border-white/50 focus:outline-none transition-colors"
                   />
                   <button type="submit" className="w-2/3 bg-white hover:bg-gray-300 text-black py-1.5 rounded font-bold uppercase tracking-widest text-[10px] transition-colors">
                     Override
                   </button>
                 </div>
               </form>
               {priceMsg && <div className={`mt-2 text-[10px] font-bold ${priceMsg.includes('Error') ? 'text-red-400' : 'text-green-400'} leading-tight`}>{priceMsg}</div>}
            </div>
        </div>

        {/* Management Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mb-16">
          {/* PC Section */}
          <div className="glass-panel p-8 rounded-lg border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff003c]/5 rounded-bl-[100px] pointer-events-none"></div>
            <div className="flex items-center gap-4 mb-8">
              <Monitor className="w-8 h-8 text-gray-300" />
              <h2 className="text-xl font-orbitron font-bold uppercase tracking-wider">Modify PCs</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {pcSlots.map(slot => (
                <button
                  key={slot.seat_id}
                  onClick={() => toggleAvailability(slot.seat_id, slot.is_available)}
                  className={`relative p-5 pr-4 pl-6 text-left rounded-lg transition-all duration-300 group flex items-start flex-col gap-2 
                    ${slot.is_available ? 'bg-green-500/10 hover:bg-red-500/10' : 'bg-red-500/10 hover:bg-green-500/10'}`}
                >
                   <div className={`absolute top-0 left-0 w-2 h-full rounded-l-lg transition-colors ${slot.is_available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                   <div className="flex w-full justify-between items-center opacity-80">
                       <Monitor className="w-5 h-5 text-gray-400" />
                       {slot.is_available ? <CheckCircle className="w-4 h-4 text-green-400 group-hover:hidden" /> : <XCircle className="w-4 h-4 text-red-500 group-hover:hidden" />}
                       {slot.is_available ? <XCircle className="w-4 h-4 text-red-500 hidden group-hover:block" /> : <CheckCircle className="w-4 h-4 text-green-400 hidden group-hover:block" />}
                   </div>
                   <div className="mt-1">
                      <div className="font-orbitron font-bold text-white text-lg leading-tight mb-1 flex justify-between items-end">
                         <span>STN-{slot.seat_id}</span>
                         <span className="text-[10px] text-gray-400 bg-black/40 px-1 rounded">🪙 {slot.price || 100}</span>
                      </div>
                      <div className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">{slot.console_type.replace('_', ' ')} System</div>
                      <div className={`text-[10px] font-black uppercase tracking-wider ${slot.is_available ? 'text-green-400' : 'text-red-500'}`}>
                         {slot.is_available ? 'ONLINE' : 'OCCUPIED'}
                      </div>
                   </div>
                </button>
              ))}
            </div>
          </div>

          {/* Console Section */}
          <div className="glass-panel p-8 rounded-lg border border-white/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff003c]/5 rounded-bl-[100px] pointer-events-none"></div>
             <div className="flex items-center gap-4 mb-8">
              <Gamepad className="w-8 h-8 text-gray-300" />
              <h2 className="text-xl font-orbitron font-bold uppercase tracking-wider">Modify Consoles</h2>
            </div>
             <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {consoleSlots.map(slot => (
                <button
                  key={slot.seat_id}
                  onClick={() => toggleAvailability(slot.seat_id, slot.is_available)}
                  className={`relative p-5 pr-4 pl-6 text-left rounded-lg transition-all duration-300 group flex items-start flex-col gap-2 
                    ${slot.is_available ? 'bg-green-500/10 hover:bg-red-500/10' : 'bg-red-500/10 hover:bg-green-500/10'}`}
                >
                   <div className={`absolute top-0 left-0 w-2 h-full rounded-l-lg transition-colors ${slot.is_available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                   <div className="flex w-full justify-between items-center opacity-80">
                       <Gamepad className="w-5 h-5 text-gray-400" />
                       {slot.is_available ? <CheckCircle className="w-4 h-4 text-green-400 group-hover:hidden" /> : <XCircle className="w-4 h-4 text-red-500 group-hover:hidden" />}
                       {slot.is_available ? <XCircle className="w-4 h-4 text-red-500 hidden group-hover:block" /> : <CheckCircle className="w-4 h-4 text-green-400 hidden group-hover:block" />}
                   </div>
                   <div className="mt-1">
                      <div className="font-orbitron font-bold text-white text-lg leading-tight mb-1 flex justify-between items-end">
                         <span>STN-{slot.seat_id}</span>
                         <span className="text-[10px] text-gray-400 bg-black/40 px-1 rounded">🪙 {slot.price || 100}</span>
                      </div>
                      <div className="text-gray-400 text-[10px] uppercase font-bold tracking-widest mb-1">{slot.console_type.replace('_', ' ')} System</div>
                      <div className={`text-[10px] font-black uppercase tracking-wider ${slot.is_available ? 'text-green-400' : 'text-red-500'}`}>
                         {slot.is_available ? 'ONLINE' : 'OCCUPIED'}
                      </div>
                   </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Global Identities Ledger */}
        <div className="glass-panel p-8 rounded-lg border border-white/5 relative mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-white/10 pb-6">
            <h2 className="text-xl font-orbitron font-bold uppercase tracking-wider flex items-center gap-3">
               <Users className="w-5 h-5 text-white" /> Registered Identities Log
            </h2>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-widest font-bold">
                      <th className="p-4">Full Name</th>
                      <th className="p-4">Email Protocol</th>
                      <th className="p-4">Mobile Link</th>
                      <th className="p-4">Access Time (UTC)</th>
                      <th className="p-4 text-right">Current Balance</th>
                   </tr>
                </thead>
                <tbody>
                   {registeredUsers.length > 0 ? registeredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm">
                         <td className="p-4 text-green-400 font-bold">{u.full_name || 'System Undefined'}</td>
                         <td className="p-4 font-bold text-white">{u.email}</td>
                         <td className="p-4 font-orbitron tracking-widest text-gray-400">{u.mobile_number || 'N/A'}</td>
                         <td className="p-4 text-gray-500 text-xs">{new Date(u.created_at).toLocaleString()}</td>
                         <td className="p-4 text-right font-black text-[#ff003c]">🪙 {u.wallet_balance}</td>
                      </tr>
                   )) : (
                      <tr>
                         <td colSpan="5" className="p-8 text-center text-gray-500 font-bold tracking-widest uppercase">
                            No active citizen identities located.
                         </td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
        </div>

        {/* Dynamic Bookings Ledger */}
        <div className="glass-panel p-8 rounded-lg border border-white/5 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-[#ff003c]/20 pb-6">
            <h2 className="text-xl font-orbitron font-bold uppercase tracking-wider flex items-center gap-3">
               <Search className="w-5 h-5 text-[#ff003c]" /> Booking Ledger Matrix
            </h2>
            <div className="flex flex-wrap items-center gap-3 bg-[#111111] p-3 rounded-md border border-[#ff003c]/40 shadow-[0_0_10px_rgba(255,0,60,0.1)]">
               <span className="text-[10px] uppercase font-bold text-[#ff003c] tracking-widest ml-1">Filter Timeline:</span>
               <Calendar className="w-4 h-4 text-gray-400 ml-1" />
               <input 
                 type="date" 
                 title="From Date"
                 value={fromDate}
                 onChange={(e) => setFromDate(e.target.value)}
                 className="bg-black text-white px-2 py-1 rounded border border-gray-700 text-sm focus:outline-none focus:border-[#ff003c] [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]"
               />
               <span className="text-gray-500 mx-1">&rarr;</span>
               <input 
                 type="date" 
                 title="To Date"
                 value={toDate}
                 onChange={(e) => setToDate(e.target.value)}
                 className="bg-black text-white px-2 py-1 rounded border border-gray-700 text-sm focus:outline-none focus:border-[#ff003c] [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]"
               />
            </div>
          </div>

          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="border-b border-white/10 text-gray-400 text-xs uppercase tracking-widest font-bold">
                      <th className="p-4">Timestamp</th>
                      <th className="p-4">Identity (Email)</th>
                      <th className="p-4">Station ID</th>
                      <th className="p-4 text-right">Fee Deducted</th>
                   </tr>
                </thead>
                <tbody>
                   {bookings.length > 0 ? bookings.map((b) => (
                      <tr key={b.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm">
                         <td className="p-4 text-gray-300">{new Date(b.created_at).toLocaleString()}</td>
                         <td className="p-4 font-bold text-white">{b.user_profiles?.email}</td>
                         <td className="p-4 font-orbitron tracking-widest text-[#ff003c]">STN-{b.seat_id}</td>
                         <td className="p-4 text-right font-bold text-green-400">🪙 {b.cost}</td>
                      </tr>
                   )) : (
                      <tr>
                         <td colSpan="4" className="p-8 text-center text-gray-500 font-bold tracking-widest uppercase">
                            No ledger entries found for this temporal range.
                         </td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
