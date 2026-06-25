const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = { pool };
