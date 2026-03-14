const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const pool = require('../config/db.js');
const { authenticateToken } = require('../middleware/auth.js');

// Routes
const authRoutes = require('../routes/auth');
const userRoutes = require('../routes/user');
const adminRoutes = require('../routes/admin');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Basic API test
app.get('/api/test', async (req, res) => {
  const [rows] = await pool.execute('SELECT 1 + 1 as result');
  res.json(rows[0]);
});

// Global API error handler (ensures JSON responses for API errors)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (req.path.startsWith('/api/')) {
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
  } else {
    next(err);
  }
});

// Socket.io for real-time: chat, location, order updates
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join order room for tracking/chat
  socket.on('join-order', (orderId) => {
    socket.join(`order_${orderId}`);
    console.log(`User ${socket.id} joined order ${orderId}`);
  });

  // Location updates for delivery tracking
  socket.on('update-location', (data) => {
    socket.to(`order_${data.orderId}`).emit('delivery-location', data.location);
  });

  // Chat messages
  socket.on('send-message', (data) => {
    // Save to DB here later
    io.to(`order_${data.orderId}`).emit('new-message', data);
  });

  // Order status update
  socket.on('update-order-status', (data) => {
    io.to(`order_${data.orderId}`).emit('order-status', data.status);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
