import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const AdminLogin = ({ session, profile }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Route properly if staff is already logged in
  useEffect(() => {
    if (session && profile) {
      if (profile.role === 'admin') {
         navigate('/admin/dashboard');
      } else {
         // Fallback if somehow they load admin login while being a customer
         navigate('/availability');
      }
    }
  }, [session, profile, navigate]);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Attempt standard sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Await profile validation
    if (authData?.user) {
       const { data: userProfile } = await supabase
         .from('user_profiles')
         .select('role')
         .eq('id', authData.user.id)
         .single();

       if (userProfile?.role !== 'admin') {
          // Block non-admins entirely from completing sign-in here.
          await supabase.auth.signOut();
          setError("SECURITY BREACH: Unauthorized access terminal.");
       } else {
          // Success! handled organically by global router tracking session/profile
       }
    }

    setLoading(false);
  };

  return (
    <div className="pt-32 min-h-screen flex items-center justify-center relative overflow-hidden">
       {/* Distinct intense background accent to indicate high security area */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/20 blur-[150px] rounded-full pointer-events-none -z-10"></div>
       
      <div className="glass-panel p-10 rounded-lg max-w-md w-full border border-red-500/80 relative z-10 shadow-[0_0_50px_rgba(255,0,0,0.3)]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
        
        <h1 className="text-3xl font-orbitron font-bold text-center mb-2 uppercase text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,0,0,1)]">
           Glow Lounge
        </h1>
        <p className="text-center text-red-500 font-bold uppercase tracking-widest text-xs mb-8">High Security Operator Terminal</p>
        
        {error && (
          <div className="bg-red-900/40 text-red-400 border-red-500 p-3 rounded mb-6 text-sm text-center font-bold border animate-fade-in-down">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-6 relative z-10">
          <div>
            <label className="block text-red-400/80 uppercase text-sm font-bold tracking-wider mb-2">Operator Key</label>
            <input 
              type="email" 
              className="w-full bg-[#050000] text-white p-3 rounded border border-red-900/50 focus:border-red-500 focus:outline-none transition-colors shadow-inner"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@glowlounge.com"
            />
          </div>
          <div>
            <label className="block text-red-400/80 uppercase text-sm font-bold tracking-wider mb-2">Override Cipher</label>
            <input 
              type="password" 
              className="w-full bg-[#050000] text-white p-3 rounded border border-red-900/50 focus:border-red-500 focus:outline-none transition-colors shadow-inner"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white py-3.5 rounded-sm font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.8)]"
          >
            {loading ? 'Authenticating...' : 'Access Matrix'}
          </button>
        </form>

        <div className="text-center mt-10 pt-4 border-t border-red-900/50 relative z-10">
           <Link to="/login" className="text-gray-500 hover:text-gray-300 text-[10px] uppercase tracking-widest font-black transition-colors block">
              &lt; Return to Standard Gateway
           </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
