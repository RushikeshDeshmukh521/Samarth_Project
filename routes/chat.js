const express = require('express');
const pool = require('../config/db.js');
const { authenticateToken } = require('../middleware/auth.js');

const router = express.Router();
router.use(authenticateToken);

// POST /api/chat/messages - send message
router.post('/messages', async (req, res) => {
  try {
    const { orderId, content, receiverType } = req.body;
    const senderId = req.user.id;
    const chatId = (await pool.execute('SELECT id FROM chats WHERE orderId = ?', [orderId]))[0][0]?.id;
    
    if (!chatId) {
      // Create chat if not exists
      const [order] = await pool.execute('SELECT userId, deliveryBoyId FROM orders WHERE id = ?', [orderId]);
      const [result] = await pool.execute(
        'INSERT INTO chats (orderId, userId, deliveryBoyId) VALUES (?, ?, ?)',
        [orderId, order[0].userId, order[0].deliveryBoyId]
      );
    }

    await pool.execute(
      'INSERT INTO messages (chatId, senderId, receiverType, content) VALUES (?, ?, ?, ?)',
[chatId, senderId, receiverType || 'deliveryboy', content]
    );

    // Emit via socket server.js
    res.json({ message: 'Sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/chat/messages/:orderId
router.get('/messages/:orderId', async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const [messages] = await pool.execute(`
      SELECT m.*, u.name as senderName 
      FROM messages m 
      JOIN chats c ON m.chatId = c.id 
      JOIN users u ON m.senderId = u.id 
      WHERE c.orderId = ? 
      ORDER BY m.timestamp
    `, [orderId]);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
