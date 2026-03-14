const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Patil@2004',
    database: 'farmdirect',
  });

  const [rows] = await conn.execute(
    "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA='farmdirect' AND TABLE_NAME='categories' AND COLUMN_NAME='imageUrl'"
  );

  if (rows.length === 0) {
    console.log('Adding imageUrl column to categories...');
    await conn.execute('ALTER TABLE categories ADD COLUMN imageUrl VARCHAR(500)');
    console.log('Done.');
  } else {
    console.log('imageUrl column already exists.');
  }

  await conn.end();
})();
