const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'farmdirect',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  try {
    const [dupes] = await pool.execute(
      `SELECT name, GROUP_CONCAT(id ORDER BY id) AS ids, COUNT(*) as cnt
       FROM categories
       GROUP BY name
       HAVING cnt > 1`
    );

    if (!dupes.length) {
      console.log('No duplicate categories found.');
      return;
    }

    for (const row of dupes) {
      const name = row.name;
      const ids = row.ids.split(',').map(Number);
      const keep = Math.min(...ids);
      const remove = ids.filter(id => id !== keep);

      console.log(`Deduping category '${name}' (keep=${keep}, remove=${remove.join(',')})`);

      if (remove.length) {
        await pool.execute(
          `UPDATE groceries SET categoryId = ? WHERE categoryId IN (${remove.map(() => '?').join(',')})`,
          [keep, ...remove]
        );
        await pool.execute(
          `DELETE FROM categories WHERE id IN (${remove.map(() => '?').join(',')})`,
          remove
        );
      }
    }

    console.log('Category deduplication complete.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
