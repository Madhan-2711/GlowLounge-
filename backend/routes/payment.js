require('dotenv').config();
const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Coin packages available
const COIN_PACKAGES = {
  starter: { inr: 50,  coins: 100 },
  pro:     { inr: 100, coins: 250 },
  elite:   { inr: 200, coins: 600 },
};

// POST /api/payment/create-order
// Creates a Razorpay order and logs it as 'pending' in our transactions table
router.post('/create-order', async (req, res) => {
  try {
    const { packageId, customerId } = req.body;

    const pkg = COIN_PACKAGES[packageId];
    if (!pkg) {
      return res.status(400).json({ error: 'Invalid coin package selected.' });
    }

    // Lazy-init Razorpay and Supabase inside handler so missing env vars don't crash server
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // Create order with Razorpay (amount is in paise = INR * 100)
    const order = await razorpay.orders.create({
      amount: pkg.inr * 100,
      currency: 'INR',
      receipt: `glow_${customerId}_${Date.now()}`,
    });

    // Log pending transaction in Supabase
    const { error: dbError } = await supabase
      .from('transactions')
      .insert([{
        customer_id: customerId,
        razorpay_order_id: order.id,
        amount_inr: pkg.inr,
        coins_credited: pkg.coins,
        status: 'pending',
      }]);

    if (dbError) {
      console.error('Transaction log error:', dbError);
    }

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      coins: pkg.coins,
      keyId: process.env.RAZORPAY_KEY_ID,
    });

  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: 'Failed to create payment order.' });
  }
});

// POST /api/payment/verify
// Verifies Razorpay signature, credits coins to wallet, marks transaction success
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, customerId } = req.body;
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );

    // SECURITY: Verify signature using HMAC SHA256
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // Mark transaction as failed
      await supabase
        .from('transactions')
        .update({ status: 'failed' })
        .eq('razorpay_order_id', razorpay_order_id);

      return res.status(400).json({ error: 'Payment verification failed. Signature mismatch.' });
    }

    // Fetch the pending transaction to get coins_credited
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .select('coins_credited')
      .eq('razorpay_order_id', razorpay_order_id)
      .eq('customer_id', customerId)
      .single();

    if (txError || !transaction) {
      return res.status(404).json({ error: 'Transaction not found.' });
    }

    // Fetch current wallet balance
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('wallet_balance')
      .eq('id', customerId)
      .single();

    if (profileError || !userProfile) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    const newBalance = userProfile.wallet_balance + transaction.coins_credited;

    // Credit coins to wallet
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({ wallet_balance: newBalance })
      .eq('id', customerId);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to credit coins to wallet.' });
    }

    // Mark transaction as success
    await supabase
      .from('transactions')
      .update({
        status: 'success',
        razorpay_payment_id: razorpay_payment_id,
      })
      .eq('razorpay_order_id', razorpay_order_id);

    res.json({
      success: true,
      coinsAdded: transaction.coins_credited,
      newBalance: newBalance,
    });

  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ error: 'Internal server error during verification.' });
  }
});

module.exports = router;
