import fs from 'fs';
import { Client } from 'pg';

export default async function globalSetup() {
  // Fresh heal log for every run
  if (fs.existsSync('healed-locators.jsonl')) fs.unlinkSync('healed-locators.jsonl');

  // Module 1.3: seed the test DB only when TEST_DB_URL is set (npm run db:up)
  if (!process.env.TEST_DB_URL) return;
  const products = JSON.parse(fs.readFileSync('test-data/products.json', 'utf8'));
  const db = new Client({ connectionString: process.env.TEST_DB_URL });
  try {
    await db.connect();
  } catch {
    console.warn(`\n[DB seeding skipped] Could not connect to ${process.env.TEST_DB_URL}.` +
      `\nStart the database with "npm run db:up" (Docker must be running),` +
      `\nor comment out TEST_DB_URL in .env. Tests will continue without seeding.\n`);
    return;
  }
  await db.query('TRUNCATE products RESTART IDENTITY CASCADE');
  for (const p of products) {
    await db.query(
      'INSERT INTO products (name, category, price, stock) VALUES ($1, $2, $3, $4)',
      [p.name, p.category, p.price, p.stock]);
  }
  await db.end();
  console.log(`Seeded ${products.length} products into the test DB`);
}
