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
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        wallet_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
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
