import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { username, password, confirmPassword } = req.body;

        // Validate inputs
        if (!username || !password || !confirmPassword) {
            return res.status(400).json({ message: 'Username, password, and confirm password are required' });
        }

        if (username.length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords don't match" });
        }

        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            return res.status(500).json({ message: 'DATABASE_URL environment variable is not set' });
        }

        // Connect to database
        const pool = new Pool({
            connectionString: databaseUrl,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
        });

        try {
            // Check if user exists
            const existingUser = await pool.query('SELECT username FROM users WHERE username = $1', [username]);
            if (existingUser.rows.length > 0) {
                return res.status(409).json({ message: 'Username already taken' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Insert new user
            const result = await pool.query(
                'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
                [username, hashedPassword]
            );

            const user = result.rows[0];

            return res.status(200).json({
                success: true,
                message: 'Registration successful',
                user: {
                    id: user.id,
                    username: user.username,
                }
            });
        } finally {
            await pool.end();
        }
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            message: 'Fatal Server Error',
            error: error.message || 'Unknown error occurred'
        });
    }
}
