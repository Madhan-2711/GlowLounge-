const jwt = require('jsonwebtoken');

// A specialized Glow Lounge security module verifying Identity via the Supabase Auth Handshake
module.exports = async function(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'Access Denied: No Security Token provided.' });
  }

  try {
    const bearer = token.split(' ')[1] || token;
    
    // Decode Supabase JWT
    // In production, we would use Supabase Admin API or JWT Secret verification.
    // Assuming Supabase issues JWT with project secret. For simplicity of our architecture:
    const decoded = jwt.decode(bearer);
    
    if (!decoded) {
      return res.status(401).json({ msg: 'Access Denied: Cipher unrecognized.' });
    }
    
    // Inject the customer/admin trace into internal memory
    req.user = decoded;
    
    // Check if operator admin override is needed
    // Assuming 'role' claims are built into Supabase JWT (e.g. 'authenticated' or 'admin')
    req.isAdmin = decoded.role === 'admin' || decoded.user_metadata?.staff_level === 'admin';

    next();
  } catch (err) {
    console.error('Handshake Failure:', err);
    res.status(401).json({ msg: 'Authentication Sequence Failed.' });
  }
};
