import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Games from './pages/Games';
import Availability from './pages/Availability';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // 1. Initial Fetch
    fetchSlots();

    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
    });

    // Listen for login/logout changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        // slight delay to ensure Postgres Trigger completes execution on signup
        setTimeout(() => fetchProfile(session.user.id), 500);
      } else {
        setProfile(null);
      }
    });

    // 2. Realtime Listener for gaming slots
    const channel = supabase
      .channel('gaming_slots_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gaming_slots' },
        (payload) => {
          console.log('Change received!', payload);
          setSlots((currentSlots) => {
            return currentSlots.map((slot) =>
              slot.seat_id === payload.new.seat_id ? payload.new : slot
            );
          });
        }
      )
      .subscribe();
      
    // 3. Realtime Listener for User Profile (Wallet Balance Updates)
    const profileChannel = supabase
      .channel('user_profiles_channel')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'user_profiles' },
        (payload) => {
           // If the currently logged in user's profile gets updated (like coin deductions or additions)
           setProfile((currentProfile) => {
              if (currentProfile && currentProfile.id === payload.new.id) {
                 return payload.new;
              }
              return currentProfile;
           });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(profileChannel);
      subscription.unsubscribe();
    };
  }, []);

  async function fetchProfile(userId) {
    const { data, error } = await supabase
       .from('user_profiles')
       .select('*')
       .eq('id', userId)
       .maybeSingle(); // Use maybeSingle to prevent absolute crash if trigger lagged
    if (data) {
       setProfile(data);
    }
  }

  async function fetchSlots() {
    setLoading(true);
    const { data, error } = await supabase
      .from('gaming_slots')
      .select('*')
      .order('seat_id', { ascending: true });

    if (error) {
      console.error('Error fetching slots:', error);
    } else {
      setSlots(data || []);
    }
    setLoading(false);
  }

  return (
    <Router>
      <div className="bg-[#0f0f11] min-h-screen text-white font-inter selection:bg-[#ff003c]/30 selection:text-white">
        <Navbar profile={profile} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/availability" element={<Availability slots={slots} loading={loading} session={session} profile={profile} setProfile={setProfile} />} />
          <Route path="/login" element={<Login session={session} profile={profile} />} />
          <Route path="/register" element={<Register session={session} profile={profile} />} />
          <Route path="/admin-login" element={<AdminLogin session={session} profile={profile} />} />
          
          {/* Legacy and Root Fallbacks */}
          <Route path="/auth" element={<Navigate to="/login" replace />} />
          <Route path="/admin" element={<Navigate to="/admin-login" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard slots={slots} session={session} profile={profile} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;