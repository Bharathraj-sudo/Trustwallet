import bcrypt from 'bcryptjs';
import { query } from '../lib/db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const userResult = await query('SELECT id, username, password FROM users WHERE username = $1', [username]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = userResult.rows[0];

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            message: 'Fatal Server Error',
            error: error.message || 'Unknown error occurred'
        });
    }
}
