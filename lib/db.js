import pg from 'pg';

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("DATABASE_URL environment variable is not set. Database connections will fail.");
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

let initialized = false;

async function initDb() {
  if (initialized) return;
  if (!databaseUrl) return;

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS wallets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        address TEXT NOT NULL,
        label TEXT,
        network_id TEXT,
        network_name TEXT,
        is_default BOOLEAN DEFAULT false NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        plan_name TEXT NOT NULL,
        wallet_address TEXT NOT NULL,
        network_id TEXT NOT NULL,
        network_name TEXT NOT NULL,
        token_address TEXT,
        token_symbol TEXT,
        token_decimals INTEGER,
        interval_amount TEXT NOT NULL,
        interval_value INTEGER NOT NULL,
        interval_unit TEXT NOT NULL,
        plan_code TEXT UNIQUE NOT NULL,
        recurring_amount TEXT,
        contract_address TEXT,
        video_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    try {
      await pool.query(`
        ALTER TABLE wallets ADD COLUMN IF NOT EXISTS address TEXT;
        ALTER TABLE wallets ADD COLUMN IF NOT EXISTS label TEXT;
        ALTER TABLE wallets ADD COLUMN IF NOT EXISTS network_id TEXT;
        ALTER TABLE wallets ADD COLUMN IF NOT EXISTS network_name TEXT;
        ALTER TABLE wallets ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT false;
      `);
    } catch (alterErr) {
      console.error("ALTER wallets failed (might already be fully configured)", alterErr.message);
    }
    initialized = true;
    console.log("Database tables verified/created successfully.");
  } catch (err) {
    console.error("Failed to initialize database tables:", err);
    throw err;
  }
}

export async function query(text, params) {
  await initDb();
  return pool.query(text, params);
}
