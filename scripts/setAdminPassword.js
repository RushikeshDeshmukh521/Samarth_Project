require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const NEW_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

(async () => {
  try {
    const pool = await mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'farmdirect',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const hash = bcrypt.hashSync(NEW_PASSWORD, 10);
    const [result] = await pool.execute(
      'UPDATE users SET password = ? WHERE email = ?',
      [hash, ADMIN_EMAIL]
    );

    if (result.affectedRows === 0) {
      console.log(`No user found with email ${ADMIN_EMAIL}.`);
    } else {
      console.log(`Password for ${ADMIN_EMAIL} updated (hashed, length ${hash.length}).`);
    }

    const [rows] = await pool.execute(
      'SELECT email, role, LENGTH(password) AS len FROM users WHERE email = ?',
      [ADMIN_EMAIL]
    );
    console.log(rows);
    await pool.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
