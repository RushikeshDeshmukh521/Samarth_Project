const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db.js');
const { authenticateToken } = require('../middleware/auth.js');
require('dotenv').config();

const router = express.Router();

// POST /api/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [existing] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'user', phone, JSON.stringify(address || {})]
    );

    const token = jwt.sign({ id: result.insertId, role: role || 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: result.insertId, name, email, role: role || 'user' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/login
router.post('/login', async (req, res) => {
  try {
    const { email, password, requiredRole } = req.body;

    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    if (rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Role check
    if (requiredRole && user.role !== requiredRole) {
      const message = requiredRole === 'admin' 
        ? 'This account does not have admin privileges.' 
        : 'Admins must use the dedicated admin login page.';
      return res.status(403).json({ error: message });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    delete user.password;
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, phone, address FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
