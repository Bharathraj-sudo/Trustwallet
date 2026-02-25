import { query } from '../lib/db.js';

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const { userId } = req.query;
            if (!userId) return res.status(400).json({ message: 'userId is required' });

            const result = await query(
                'SELECT id, user_id as "userId", address, label, network_id as "networkId", network_name as "networkName", is_default as "isDefault", created_at as "createdAt" FROM wallets WHERE user_id = $1 ORDER BY created_at DESC',
                [userId]
            );
            return res.status(200).json(result.rows);
        }

        if (req.method === 'POST') {
            const { userId, address, label, networkId, networkName } = req.body;
            if (!userId || !address) return res.status(400).json({ message: 'userId and address are required' });

            const existing = await query('SELECT id FROM wallets WHERE user_id = $1', [userId]);
            if (existing.rows.length >= 6) {
                return res.status(400).json({ message: 'Maximum 6 wallets allowed' });
            }

            const isDefault = existing.rows.length === 0;

            const result = await query(
                'INSERT INTO wallets (user_id, address, label, network_id, network_name, is_default) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, user_id as "userId", address, label, network_id as "networkId", network_name as "networkName", is_default as "isDefault", created_at as "createdAt"',
                [userId, address, label, networkId, networkName, isDefault]
            );

            return res.status(200).json({ success: true, message: 'Wallet added', wallet: result.rows[0] });
        }

        if (req.method === 'DELETE') {
            const { id, userId } = req.query;
            if (!id || !userId) return res.status(400).json({ message: 'id and userId are required' });

            const walletRes = await query('SELECT is_default FROM wallets WHERE id = $1 AND user_id = $2', [id, userId]);
            if (walletRes.rows.length === 0) return res.status(404).json({ message: 'Wallet not found' });

            await query('DELETE FROM wallets WHERE id = $1 AND user_id = $2', [id, userId]);

            if (walletRes.rows[0].is_default) {
                const remaining = await query('SELECT id FROM wallets WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [userId]);
                if (remaining.rows.length > 0) {
                    await query('UPDATE wallets SET is_default = true WHERE id = $1', [remaining.rows[0].id]);
                }
            }

            return res.status(200).json({ success: true, message: 'Wallet deleted' });
        }

        if (req.method === 'PATCH') {
            const { id, userId, action } = req.query;
            if (!id || !userId || action !== 'default') return res.status(400).json({ message: 'Invalid request' });

            await query('UPDATE wallets SET is_default = false WHERE user_id = $1', [userId]);
            await query('UPDATE wallets SET is_default = true WHERE id = $1 AND user_id = $2', [id, userId]);

            return res.status(200).json({ success: true, message: 'Default wallet updated' });
        }

        return res.status(405).json({ message: 'Method Not Allowed' });
    } catch (error) {
        console.error('Wallets API error:', error);
        return res.status(500).json({
            message: 'Fatal Server Error',
            error: error.message || 'Unknown error occurred'
        });
    }
}
