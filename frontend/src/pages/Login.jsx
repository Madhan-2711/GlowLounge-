import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Login = ({ session, profile }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Route properly if customer is already verified
  useEffect(() => {
    if (session && profile) {
      if (profile.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/availability');
      }
    }
  }, [session, profile, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="pt-32 min-h-screen flex items-center justify-center relative overflow-hidden">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ff003c]/20 blur-[150px] rounded-full pointer-events-none -z-10"></div>
       
      <div className="glass-panel p-10 rounded-lg max-w-md w-full border border-[#ff003c]/50 relative z-10 shadow-[0_0_50px_rgba(255,0,60,0.15)] flex flex-col min-h-[500px]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff003c] to-transparent"></div>
        
        <div className="flex-grow">
           <h1 className="text-3xl font-orbitron font-bold text-center mb-2 uppercase text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,0,60,0.8)]">
              Glow Lounge
           </h1>
           <p className="text-center text-gray-400 font-bold uppercase tracking-widest text-xs mb-8">Customer Access Portal</p>
           
           {error && (
             <div className="bg-red-500/20 text-red-500 border-red-500/50 p-3 rounded mb-6 text-sm text-center font-bold border animate-fade-in-down">
               {error}
             </div>
           )}

           <form onSubmit={handleLogin} className="space-y-6 relative z-10">
             <div>
               <label className="block text-gray-400 uppercase text-sm font-bold tracking-wider mb-2">Email Identity</label>
               <input 
                 type="email" 
                 className="w-full bg-[#090909] text-white p-3 rounded border border-white/20 focus:border-[#ff003c] focus:outline-none transition-colors shadow-inner"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
                 placeholder="citizen@glowlounge.com"
               />
             </div>
             <div>
               <label className="block text-gray-400 uppercase text-sm font-bold tracking-wider mb-2">Security Cipher</label>
               <input 
                 type="password" 
                 className="w-full bg-[#090909] text-white p-3 rounded border border-white/20 focus:border-[#ff003c] focus:outline-none transition-colors shadow-inner"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                 placeholder="••••••••"
               />
             </div>
             <button 
               type="submit" 
               disabled={loading}
               className="w-full bg-[#ff003c] hover:bg-[#d00030] disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3.5 rounded-sm font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(255,0,60,0.5)] hover:shadow-[0_0_25px_rgba(255,0,60,0.8)]"
             >
               {loading ? 'Processing...' : 'Initialize Session'}
             </button>
           </form>

           <div className="mt-8 text-center border-t border-white/10 pt-6">
              <Link 
                to="/register"
                className="text-gray-400 hover:text-white uppercase font-bold text-xs tracking-widest transition-colors block mb-4"
              >
                 &gt; Generate New Identity &lt;
              </Link>
           </div>
        </div>

        {/* Subtle Staff Login Link at the exact bottom */}
        <div className="text-center mt-auto pt-4 relative z-10">
           <Link to="/admin-login" className="text-gray-600 hover:text-gray-400 text-[10px] uppercase tracking-widest font-black transition-colors block">
              Operator Console Access
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
