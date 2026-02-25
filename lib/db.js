import pg from 'pg';

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.warn("DATABASE_URL environment variable is not set. Database connections will fail.");
}

export const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
});

// Run table creation on module initialization
(async () => {
    if (databaseUrl) {
        try {
            await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
            console.log("Database tables verified/created successfully.");
        } catch (err) {
            console.error("Failed to initialize database tables:", err);
        }
    }
})();
