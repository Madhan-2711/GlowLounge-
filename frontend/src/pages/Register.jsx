import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Register = ({ session, profile }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (session && profile) {
      if (profile.role === 'admin') navigate('/admin/dashboard');
      else navigate('/availability');
    }
  }, [session, profile, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
         data: {
            full_name: fullName,
            mobile_number: mobileNumber
         }
      }
    });

    if (error) {
      setError(error.message);
    } else {
      setError('Registration Complete. Identity established.');
    }
    setLoading(false);
  };

  return (
    <div className="pt-32 min-h-screen flex items-center justify-center relative overflow-hidden">
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ff003c]/20 blur-[150px] rounded-full pointer-events-none -z-10"></div>
       
      <div className="glass-panel p-10 rounded-lg max-w-md w-full border border-[#ff003c]/50 relative z-10 shadow-[0_0_50px_rgba(255,0,60,0.15)] mt-10 mb-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff003c] to-transparent"></div>
        
        <h1 className="text-3xl font-orbitron font-bold text-center mb-2 uppercase text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,0,60,0.8)]">
           Glow Lounge
        </h1>
        <p className="text-center text-gray-400 font-bold uppercase tracking-widest text-xs mb-8">Data Onboarding</p>
        
        {error && (
          <div className={`${error.includes('Complete') ? 'bg-green-500/20 text-green-400 border-green-500/50' : 'bg-red-500/20 text-red-500 border-red-500/50'} p-3 rounded mb-6 text-sm text-center font-bold border animate-fade-in-down`}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 relative z-10">
          <div>
            <label className="block text-gray-400 uppercase text-xs font-bold tracking-wider mb-2">Legal Identity (Full Name)</label>
            <input 
              type="text" 
              className="w-full bg-[#090909] text-white p-3 rounded border border-white/20 focus:border-[#ff003c] focus:outline-none transition-colors shadow-inner"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-gray-400 uppercase text-xs font-bold tracking-wider mb-2">Comms Array (Mobile Max 15)</label>
            <input 
              type="tel" 
              className="w-full bg-[#090909] text-white p-3 rounded border border-white/20 focus:border-[#ff003c] focus:outline-none transition-colors shadow-inner"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
              placeholder="+14155552671"
            />
          </div>
          <div>
            <label className="block text-gray-400 uppercase text-xs font-bold tracking-wider mb-2">Email Address</label>
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
            <label className="block text-gray-400 uppercase text-xs font-bold tracking-wider mb-2">Security Cipher</label>
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
            className="w-full bg-[#ff003c] hover:bg-[#d00030] disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3.5 rounded-sm font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(255,0,60,0.5)] hover:shadow-[0_0_25px_rgba(255,0,60,0.8)] mt-4"
          >
            {loading ? 'Processing...' : 'Register Profile'}
          </button>
        </form>

        <div className="mt-6 text-center border-t border-white/10 pt-6">
           <Link 
             to="/login"
             className="text-gray-400 hover:text-white uppercase font-bold text-xs tracking-widest transition-colors block"
           >
              &gt; Return to Gateway &lt;
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
