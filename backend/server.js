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

// Legacy routes bypassed & successfully scrubbed from memory matrix.
app.get('/', (req, res) => {
  res.send('GLOW LOUNGE OPERATION MATRIX ACTIVE.');
});

// ENGAGE LISTENERS
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Core Neural Net securely listening on port ${PORT}...`);
});
