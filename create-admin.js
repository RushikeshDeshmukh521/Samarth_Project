const bcrypt = require('bcryptjs');
const pool = require('./config/db.js');

async function createAdmin() {
  try {
    const password = await bcrypt.hash('admin123', 10);
    // Try to insert an admin if they don't exist
    const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', ['admin@farmdirect.com']);
    
    if (existing.length === 0) {
      await pool.execute(
        'INSERT INTO users (name, email, password, role, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
        ['FarmDirect Admin', 'admin@farmdirect.com', password, 'admin', '1234567890', JSON.stringify({ 'full': 'FarmDirect HQ' })]
      );
      console.log('Admin account created successfully.');
    } else {
      // If it exists, let's reset the password to admin123 and ensure role is admin just to be safe
      await pool.execute(
        'UPDATE users SET password = ?, role = "admin" WHERE email = ?',
        [password, 'admin@farmdirect.com']
      );
      console.log('Admin account already existed. Password reset and role enforced back to admin.');
    }
    
    console.log('--- ADMIN CREDENTIALS ---');
    console.log('Email: admin@farmdirect.com');
    console.log('Password: admin123');
    console.log('-------------------------');
    process.exit(0);
  } catch(e) {
    console.error('Error creating admin:', e);
    process.exit(1);
  }
}

createAdmin();
