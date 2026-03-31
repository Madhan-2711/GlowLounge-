const express = require('express');
const router = express.Router();
const supabase = require('../lib/supabase');
const auth = require('../middleware/auth');

/**
 * @route POST /api/bookings/
 * @desc CUSTOMER MODE: Attempt to securely lock a temporal slot for a rig. System will actively scan and REJECT overlaps.
 */
router.post('/', auth, async (req, res) => {
  const { seat_id, start_time, end_time } = req.body;
  const user_id = req.user.sub || req.user.id;

  try {
    // 1. Hardware Status Diagnostic
    // Ensure the machine hasn't been locked down by Admin Protocol
    const { data: slot, error: slotErr } = await supabase
      .from('gaming_slots')
      .select('is_available')
      .eq('seat_id', seat_id)
      .single();

    if (slotErr || !slot) {
      return res.status(404).json({ msg: 'Rig footprint not found in the matrix.' });
    }
    
    // Core directive: Strictly prevent booking if the station is in maintenance or unavailable
    if (slot.is_available === false) {
      return res.status(403).json({ msg: `Access Denied: STN-${seat_id} is currently under Maintenance Protocol or Disabled.` });
    }

    // 2. Temporal Collision Scan
    // Searching the 'bookings' ledger for ANY existing reservations that overlap with the requested time block.
    // Logic: Existing start is BEFORE requested end AND Existing end is AFTER requested start.
    const { data: existingBookings, error: checkErr } = await supabase
      .from('bookings')
      .select('*')
      .eq('seat_id', seat_id)
      .eq('status', 'active')
      .lt('start_time', end_time)
      .gt('end_time', start_time);

    if (checkErr) throw checkErr;

    // Direct fulfillment of user prompt: "**Just reject**" if occupied.
    if (existingBookings.length > 0) {
      return res.status(409).json({ 
        msg: `Collision Detected: STN-${seat_id} is already reserved during this temporal window. Operation Rejected.` 
      });
    }

    // 3. Initiate Sequence (Locking the reservation)
    const { data: booking, error: insertErr } = await supabase
      .from('bookings')
      .insert([
        { 
          customer_id: user_id, 
          seat_id, 
          start_time, 
          end_time,
          status: 'active'
        }
      ])
      .select();

    if (insertErr) throw insertErr;

    res.json({ msg: 'Access Granted: Temporal block secured.', booking });
  } catch (err) {
    console.error('Core Engine Error:', err);
    res.status(500).json({ msg: 'Core System Error occurred during booking sequence.' });
  }
});

/**
 * @route PUT /api/bookings/admin/slots/:seat_id
 * @desc ADMIN MODE: Force-override the status of a specific station (e.g., mark as "Under Maintenance" or "Tournament").
 */
router.put('/admin/slots/:seat_id', auth, async (req, res) => {
  // Enforce Admin guardrails
  if (!req.isAdmin) {
    return res.status(403).json({ msg: 'Access Denied: You lack OPERATOR clearance to alter hardware topology.' });
  }

  const { is_available } = req.body;
  const { seat_id } = req.params;

  try {
    const { data, error } = await supabase
      .from('gaming_slots')
      .update({ is_available })
      .eq('seat_id', seat_id)
      .select();

    if (error) throw error;

    res.json({ msg: `Operator Override Confirmed. STN-${seat_id} is_available state switched to ${is_available}.`, data });
  } catch (err) {
    console.error('Admin Override Sequence Failed:', err);
    res.status(500).json({ msg: 'Admin override sequence experienced fatal error.' });
  }
});

module.exports = router;
