import { query } from '../../lib/db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { userId, walletAddress, walletNetwork } = req.body;

        if (!userId || !walletAddress) {
            return res.status(400).json({ message: 'userId and valid walletAddress are required' });
        }

        const result = await query(
            'UPDATE users SET wallet_address = $1, wallet_network = $2 WHERE id = $3 RETURNING id, username, wallet_address as "walletAddress", wallet_network as "walletNetwork", executor_private_key as "executorPrivateKey"',
            [walletAddress.toLowerCase(), walletNetwork ?? null, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Update user wallet error:', error);
        return res.status(500).json({
            message: 'Fatal Server Error',
            error: error.message || 'Unknown error occurred'
        });
    }
}
