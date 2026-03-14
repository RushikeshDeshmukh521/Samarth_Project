const express = require('express');
const pool = require('../config/db.js');
const { authenticateToken, authorizeRole } = require('../middleware/auth.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Protect all admin routes
router.use(authenticateToken);
router.use(authorizeRole(['admin']));

// --- Multer Setup for Image Upload ---
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

// POST /api/admin/upload-image
router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// GET /api/admin/categories - list all categories
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await pool.execute('SELECT * FROM categories ORDER BY name');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/admin/add-category
router.post('/add-category', async (req, res) => {
  try {
    const { name, imageUrl } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Category name is required' });

    const trimmed = name.trim();
    const [existing] = await pool.execute('SELECT id FROM categories WHERE name = ?', [trimmed]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const [result] = await pool.execute('INSERT INTO categories (name, imageUrl) VALUES (?, ?)', [trimmed, imageUrl || null]);
    res.json({ id: result.insertId, name: trimmed, imageUrl: imageUrl || null });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/admin/edit-category/:id
router.put('/edit-category/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, imageUrl } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Category name is required' });

    const trimmed = name.trim();

    // Ensure category name is unique (excluding current category)
    const [existing] = await pool.execute(
      'SELECT id FROM categories WHERE name = ? AND id != ?',
      [trimmed, id]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Another category with this name already exists' });
    }

    await pool.execute(
      'UPDATE categories SET name = ?, imageUrl = ? WHERE id = ?',
      [trimmed, imageUrl || null, id]
    );

    res.json({ message: 'Category updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/admin/delete-category/:id
router.delete('/delete-category/:id', async (req, res) => {
  try {
    const id = req.params.id;
    // Set any groceries referencing this category to NULL
    await pool.execute('UPDATE groceries SET categoryId = NULL WHERE categoryId = ?', [id]);
    await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/groceries
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

// POST /api/admin/add-grocery
router.post('/add-grocery', async (req, res) => {
  try {
    const { name, description, price, imageUrl, categoryId, stock } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO groceries (name, description, price, imageUrl, categoryId, stock) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, imageUrl, categoryId, stock]
    );
    res.json({ id: result.insertId, message: 'Grocery added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/admin/edit-grocery/:id
router.put('/edit-grocery/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const fields = req.body;
    const updates = Object.keys(fields).map(key => `${key} = ?`).join(', ');
    const values = Object.values(fields).concat(id);
    await pool.execute(`UPDATE groceries SET ${updates} WHERE id = ?`, values);
    res.json({ message: 'Grocery updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/admin/delete-grocery/:id
router.delete('/delete-grocery/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await pool.execute('DELETE FROM groceries WHERE id = ?', [id]);
    res.json({ message: 'Grocery deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/orders
router.get('/orders', async (req, res) => {
  try {
    const [orders] = await pool.execute(`
      SELECT o.*, u.name as userName, d.name as deliveryName, 
      GROUP_CONCAT(i.name, ':', i.quantity SEPARATOR ', ') as items
      FROM orders o 
      LEFT JOIN users u ON o.userId = u.id
      LEFT JOIN users d ON o.deliveryBoyId = d.id
      LEFT JOIN (SELECT oi.*, g.name FROM order_items oi JOIN groceries g ON oi.groceryId = g.id) i ON o.id = i.orderId
      GROUP BY o.id
      ORDER BY o.createdAt DESC
    `);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/admin/update-order-status/:orderId
router.put('/update-order-status/:orderId', async (req, res) => {
  try {
    const { status, deliveryBoyId } = req.body;
    const orderId = req.params.orderId;
    const fields = [];
    const values = [orderId];
    if (status) {
      fields.push('status = ?');
      values.unshift(status);
    }
    if (deliveryBoyId) {
      fields.push('deliveryBoyId = ?');
      values.push(deliveryBoyId);
      await pool.execute(
        'INSERT IGNORE INTO delivery_assignments (orderId, deliveryBoyId) VALUES (?, ?)',
        [orderId, deliveryBoyId]
      );
    }
    if (fields.length > 0) {
      const query = `UPDATE orders SET ${fields.join(', ')} WHERE id = ?`;
      await pool.execute(query, values);
    }
    res.json({ message: 'Order updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const [users] = await pool.execute(`
      SELECT id, name, email, role, phone, isVerified, createdAt 
      FROM users 
      ORDER BY createdAt DESC
    `);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/admin/dashboard-stats
router.get('/dashboard-stats', async (req, res) => {
  try {
    const [userCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [orderCount] = await pool.execute('SELECT COUNT(*) as count FROM orders');
    const [revenue] = await pool.execute('SELECT SUM(total) as total FROM orders WHERE status != "cancelled"');
    const [productCount] = await pool.execute('SELECT COUNT(*) as count FROM groceries');
    
    res.json({
      users: userCount[0].count,
      orders: orderCount[0].count,
      revenue: revenue[0].total || 0,
      products: productCount[0].count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
