const mysql = require('mysql2/promise');
// Ensure local .env values override any existing environment variables (useful on dev machines where DB creds may already be set).
require('dotenv').config({ override: true });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'farmdirect',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
