require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// CORE INITIALIZATION
console.log('Glow Lounge AI Operational Core: BOOT SEQUENCE INITIATED.');

// MIDDLWARE PROTOCOLS
app.use(cors());
app.use(express.json());

// API ROUTING CHANNELS
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/payment', require('./routes/payment'));

// Legacy routes bypassed & successfully scrubbed from memory matrix.
app.get('/', (req, res) => {
  res.send('GLOW LOUNGE OPERATION MATRIX ACTIVE.');
});

// ENGAGE LISTENERS
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Core Neural Net securely listening on port ${PORT}...`);
  console.log(`ENV CHECK: RAZORPAY_KEY_ID=${process.env.RAZORPAY_KEY_ID ? 'SET' : 'MISSING'}, SUPABASE_URL=${process.env.SUPABASE_URL ? 'SET' : 'MISSING'}`);
});

// Global crash handlers so errors are logged before process dies
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err.message, err.stack);
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});
