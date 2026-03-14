const express = require('express');
const pool = require('../config/db.js');
const { authenticateToken, authorizeRole } = require('../middleware/auth.js');

const router = express.Router();

// Protect
router.use(authenticateToken);
router.use(authorizeRole(['deliveryboy']));

// GET /api/delivery/get-assignments - pending orders
router.get('/get-assignments', async (req, res) => {
  try {
    const deliveryBoyId = req.user.id;
    const [assignments] = await pool.execute(`
      SELECT da.*, o.* 
      FROM delivery_assignments da
      JOIN orders o ON da.orderId = o.id 
      WHERE da.deliveryBoyId = ? AND da.status = 'pending'
    `, [deliveryBoyId]);
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/delivery/assignment/:id/accept-assignment
router.post('/assignment/:orderId/accept-assignment', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const deliveryBoyId = req.user.id;
    await pool.execute(
      'UPDATE delivery_assignments SET status = "accepted" WHERE orderId = ? AND deliveryBoyId = ?',
      [orderId, deliveryBoyId]
    );
    await pool.execute('UPDATE orders SET status = "confirmed" WHERE id = ?', [orderId]);
    // Emit socket
    res.json({ message: 'Assignment accepted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/delivery/current-order
router.get('/current-order', async (req, res) => {
  try {
    const deliveryBoyId = req.user.id;
    const [orders] = await pool.execute(`
      SELECT o.* 
      FROM orders o 
      JOIN delivery_assignments da ON o.id = da.orderId
      WHERE da.deliveryBoyId = ? AND da.status = 'accepted' 
      ORDER BY da.assignedAt DESC LIMIT 1
    `, [deliveryBoyId]);
    res.json(orders[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/delivery/otp/send & verify simple mock
router.post('/otp/send', (req, res) => {
  // Mock OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Send SMS/email mock
  console.log('OTP sent:', otp);
  res.json({ message: 'OTP sent' });
});

router.post('/otp/verify', (req, res) => {
  const { otp } = req.body;
  // Mock verify
  res.json({ verified: true });
});

module.exports = router;
