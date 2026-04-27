import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast, ToastContainer } from '../components/Toast';
import { Zap, ArrowLeft, CheckCircle, Coins } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const PACKAGES = [
  {
    id: 'starter',
    label: 'Starter',
    inr: 50,
    coins: 100,
    description: 'Perfect for a quick session',
    color: 'border-gray-500/40 hover:border-gray-300/60',
    badge: null,
  },
  {
    id: 'pro',
    label: 'Pro',
    inr: 100,
    coins: 250,
    description: '25% bonus coins',
    color: 'border-[#ff003c]/50 hover:border-[#ff003c]',
    badge: 'Popular',
    badgeColor: 'bg-[#ff003c]',
  },
  {
    id: 'elite',
    label: 'Elite',
    inr: 200,
    coins: 600,
    description: '50% bonus coins',
    color: 'border-yellow-500/50 hover:border-yellow-400',
    badge: 'Best Value',
    badgeColor: 'bg-yellow-500',
  },
];

const AddCoins = ({ session, profile, setProfile }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toasts, removeToast, toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session || !profile) {
      navigate('/login');
      return;
    }
    if (profile.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [session, profile]);

  // Dynamically load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handlePayment = async () => {
    if (!selectedPackage) {
      toast.warning('Please select a coin package first.', 'No Package Selected');
      return;
    }

    setLoading(true);
    toast.info('Creating your payment order...', 'Processing');

    try {
      // 1. Create order on backend
      const orderRes = await fetch(`${BACKEND_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          customerId: profile.id,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      // 2. Open Razorpay checkout popup
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Glow Lounge',
        description: `${selectedPackage.coins} Coins — ${selectedPackage.label} Pack`,
        order_id: orderData.orderId,
        handler: async (response) => {
          // 3. Verify payment signature on backend
          const verifyRes = await fetch(`${BACKEND_URL}/api/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              customerId: profile.id,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            // Optimistic UI update
            if (setProfile) {
              setProfile(prev => ({ ...prev, wallet_balance: verifyData.newBalance }));
            }
            toast.success(
              `🪙 ${verifyData.coinsAdded} Coins added! New balance: ${verifyData.newBalance} Coins.`,
              'Payment Successful'
            );
            setSelectedPackage(null);
          } else {
            toast.error(verifyData.error || 'Payment verification failed.', 'Verification Error');
          }
          setLoading(false);
        },
        prefill: {
          email: profile.email,
          name: profile.full_name || '',
          contact: profile.mobile_number || '',
        },
        theme: {
          color: '#ff003c',
        },
        modal: {
          ondismiss: () => {
            toast.warning('Payment was cancelled.', 'Cancelled');
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      toast.error(err.message || 'Something went wrong.', 'Error');
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="mb-10">
          <Link
            to="/availability"
            className="flex items-center gap-2 text-gray-500 hover:text-white text-xs uppercase tracking-widest font-bold transition-colors mb-4"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Grid
          </Link>
          <h1 className="text-3xl font-orbitron font-bold text-white uppercase tracking-widest">
            Top Up <span className="text-[#ff003c] neon-text-red">Wallet</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">Select a coin package and pay securely via Razorpay.</p>
        </div>

        {/* Current Balance */}
        <div className="glass-panel rounded-lg border border-[#ff003c]/20 p-5 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-gray-400 uppercase font-bold text-xs tracking-widest">Current Balance</span>
          </div>
          <span className="font-orbitron font-black text-xl text-[#ff003c]">🪙 {profile?.wallet_balance ?? 0} Coins</span>
        </div>

        {/* Coin Packages */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {PACKAGES.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg)}
              className={`relative glass-panel rounded-lg border-2 p-6 text-left transition-all duration-200 ${pkg.color} ${
                selectedPackage?.id === pkg.id
                  ? 'scale-105 shadow-[0_0_25px_rgba(255,0,60,0.3)]'
                  : 'opacity-80 hover:opacity-100'
              }`}
            >
              {/* Badge */}
              {pkg.badge && (
                <span className={`absolute -top-3 left-1/2 -translate-x-1/2 ${pkg.badgeColor} text-white text-[10px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full`}>
                  {pkg.badge}
                </span>
              )}

              {/* Selected Checkmark */}
              {selectedPackage?.id === pkg.id && (
                <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-[#ff003c]" />
              )}

              <div className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-2">{pkg.label} Pack</div>
              <div className="font-orbitron font-black text-3xl text-white mb-1">🪙 {pkg.coins}</div>
              <div className="text-[#ff003c] font-bold text-sm mb-3">₹{pkg.inr}</div>
              <div className="text-gray-500 text-xs">{pkg.description}</div>
            </button>
          ))}
        </div>

        {/* Test Mode Notice */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-8 flex items-start gap-3">
          <Zap className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-1">Test Mode Active</p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Use test card <span className="text-white font-mono">4111 1111 1111 1111</span>, any future expiry, and any CVV. No real money will be charged.
            </p>
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={loading || !selectedPackage}
          className="w-full bg-[#ff003c] hover:bg-[#d00030] disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white py-4 rounded-sm font-orbitron font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,0,60,0.4)] hover:shadow-[0_0_35px_rgba(255,0,60,0.7)] text-sm"
        >
          {loading
            ? 'Processing...'
            : selectedPackage
            ? `Pay ₹${selectedPackage.inr} → Get 🪙 ${selectedPackage.coins} Coins`
            : 'Select a Package to Continue'}
        </button>

      </div>
    </div>
  );
};

export default AddCoins;
