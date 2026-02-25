import { query } from '../lib/db.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { userId, walletAddress, label } = req.body;

        if (!userId || !walletAddress) {
            return res.status(400).json({ message: 'userId and walletAddress are required' });
        }

        const result = await query(
            'INSERT INTO payment_wallets (user_id, wallet_address, label) VALUES ($1, $2, $3) RETURNING id, user_id, wallet_address, label',
            [userId, walletAddress, label]
        );

        return res.status(200).json({
            success: true,
            message: 'Wallet added',
            wallet: result.rows[0],
        });
    } catch (error) {
        console.error('Add payment wallet error:', error);
        return res.status(500).json({
            message: 'Fatal Server Error',
            error: error.message || 'Unknown error occurred'
        });
    }
}
