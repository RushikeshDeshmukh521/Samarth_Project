const express = require('express');
const pool = require('../config/db.js');
const { authenticateToken } = require('../middleware/auth.js');

const router = express.Router();

// GET /api/user/groceries - list all groceries
router.get('/groceries', async (req, res) => {
  try {
    const [groceries] = await pool.execute(`
      SELECT g.*, c.name as categoryName 
      FROM groceries g 
      LEFT JOIN categories c ON g.categoryId = c.id
    `);
    res.json(groceries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/user/categories - list all categories
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await pool.execute('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/user/category/:id/groceries - list groceries by category
router.get('/category/:id/groceries', async (req, res) => {
  try {
    const [groceries] = await pool.execute(`
      SELECT g.*, c.name as categoryName 
      FROM groceries g 
      LEFT JOIN categories c ON g.categoryId = c.id
      WHERE g.categoryId = ?
    `, [req.params.id]);
    res.json(groceries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/user/grocery/:id - get single grocery
router.get('/grocery/:id', async (req, res) => {
  try {
    const [grocery] = await pool.execute(`
      SELECT g.*, c.name as categoryName 
      FROM groceries g 
      LEFT JOIN categories c ON g.categoryId = c.id
      WHERE g.id = ?
    `, [req.params.id]);
    if (grocery.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(grocery[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/order - place order from cart
router.post('/order', authenticateToken, async (req, res) => {
  try {
    const { items, address, total } = req.body; // items: [{groceryId, qty}]
    const userId = req.user.id;

    const connection = await pool.getConnection();
    await connection.beginTransaction();

    const [orderResult] = await connection.execute(
      'INSERT INTO orders (userId, total, address, status) VALUES (?, ?, ?, ?)',
      [userId, total, JSON.stringify(address), 'pending']
    );
    const orderId = orderResult.insertId;

    // Add order items
    for (const item of items) {
      await connection.execute(
        'INSERT INTO order_items (orderId, groceryId, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.groceryId, item.qty, item.price]
      );
      // Update stock
      await connection.execute(
        'UPDATE groceries SET stock = stock - ? WHERE id = ?',
        [item.qty, item.groceryId]
      );
    }

    await connection.commit();
    connection.release();

    // Emit socket for new order
    // io.emit('new-order', {orderId}); later

    res.json({ orderId, message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/my-orders
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [orders] = await pool.execute(`
      SELECT o.*, u.name as deliveryName 
      FROM orders o 
      LEFT JOIN users u ON o.deliveryBoyId = u.id 
      WHERE o.userId = ?
      ORDER BY o.createdAt DESC
    `, [userId]);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/order/:id
router.get('/order/:orderId', authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.user.id;
    const [orders] = await pool.execute(`
      SELECT o.*, GROUP_CONCAT(i.groceryId, ':', i.quantity) as items
      FROM orders o 
      LEFT JOIN order_items i ON o.id = i.orderId
      WHERE o.id = ? AND o.userId = ?
      GROUP BY o.id
    `, [orderId, userId]);
    res.json(orders[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
