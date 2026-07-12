/**
 * One-shot DB initializer: creates tables + seeds demo data.
 * Usage:  node db/init.js
 * Run from the backend/ directory so .env is picked up.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function run() {
  const client = await pool.connect();
  try {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const seed   = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');

    console.log('⏳ Creating tables...');
    await client.query(schema);
    console.log('✅ Tables created.');

    console.log('⏳ Seeding demo data...');
    await client.query(seed);
    console.log('✅ Seed data inserted.');
  } catch (err) {
    console.error('❌ Init failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
