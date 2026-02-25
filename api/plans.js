import { query } from '../lib/db.js';

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const { userId, code } = req.query;

            // Handle fetching a specific plan publicly by its unique code
            if (code) {
                const planRes = await query(
                    `SELECT id, user_id as "userId", plan_name as "planName", wallet_address as "walletAddress", network_id as "networkId", network_name as "networkName", token_address as "tokenAddress", token_symbol as "tokenSymbol", token_decimals as "tokenDecimals", interval_amount as "intervalAmount", interval_value as "intervalValue", interval_unit as "intervalUnit", plan_code as "planCode", recurring_amount as "recurringAmount", contract_address as "contractAddress", video_url as "videoUrl", created_at as "createdAt" FROM plans WHERE plan_code = $1`,
                    [code]
                );
                if (planRes.rows.length === 0) {
                    return res.status(404).json({ message: 'Plan not found' });
                }
                return res.status(200).json(planRes.rows[0]);
            }

            if (!userId) {
                return res.status(400).json({ message: 'userId is required' });
            }

            const result = await query(
                'SELECT id, user_id as "userId", plan_name as "planName", wallet_address as "walletAddress", network_id as "networkId", network_name as "networkName", token_address as "tokenAddress", token_symbol as "tokenSymbol", token_decimals as "tokenDecimals", interval_amount as "intervalAmount", interval_value as "intervalValue", interval_unit as "intervalUnit", plan_code as "planCode", recurring_amount as "recurringAmount", contract_address as "contractAddress", video_url as "videoUrl", created_at as "createdAt" FROM plans WHERE user_id = $1 ORDER BY created_at DESC',
                [userId]
            );
            return res.status(200).json(result.rows);
        }

        if (req.method === 'POST') {
            let body = req.body;
            if (typeof body === 'string') {
                try { body = JSON.parse(body); } catch (e) { }
            }
            const {
                userId, planName, walletAddress, networkId, networkName,
                tokenAddress, tokenSymbol, tokenDecimals, intervalAmount,
                intervalValue, intervalUnit, videoUrl
            } = body || {};

            if (!userId || !planName || !walletAddress || !networkId || !intervalAmount || !intervalValue || !intervalUnit) {
                return res.status(400).json({ message: 'Missing required plan fields' });
            }

            // Generate unique 6-character alphanumeric plan code
            const charset = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
            let planCode = "";
            for (let i = 0; i < 6; i++) {
                planCode += charset[Math.floor(Math.random() * charset.length)];
            }

            // Create plan
            const result = await query(
                `INSERT INTO plans (
                    user_id, plan_name, wallet_address, network_id, network_name, 
                    token_address, token_symbol, token_decimals, interval_amount, 
                    interval_value, interval_unit, plan_code, video_url
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                RETURNING id, user_id as "userId", plan_name as "planName", plan_code as "planCode"`,
                [
                    userId, planName, walletAddress.toLowerCase(), networkId, networkName,
                    tokenAddress?.toLowerCase(), tokenSymbol, tokenDecimals, intervalAmount,
                    intervalValue, intervalUnit, planCode, videoUrl
                ]
            );

            return res.status(200).json(result.rows[0]);
        }

        if (req.method === 'DELETE') {
            const { id, userId } = req.query;
            if (!id || !userId) {
                return res.status(400).json({ message: 'id and userId are required' });
            }

            // We must verify the plan exists and belongs to the user
            const planRes = await query('SELECT id FROM plans WHERE id = $1 AND user_id = $2', [id, userId]);
            if (planRes.rows.length === 0) {
                return res.status(404).json({ message: 'Plan not found' });
            }

            // Check for active subscriptions
            const activeSubs = await query('SELECT id FROM subscriptions WHERE plan_id = $1 AND is_active = true', [id]);
            if (activeSubs.rows.length > 0) {
                return res.status(409).json({ message: 'Cannot delete plan with active subscriptions.' });
            }

            await query('DELETE FROM plans WHERE id = $1', [id]);
            return res.status(200).json({ success: true, message: 'Plan deleted' });
        }

        return res.status(405).json({ message: 'Method Not Allowed' });
    } catch (error) {
        console.error('Plans API error:', error);
        return res.status(500).json({
            message: 'Fatal Server Error',
            error: error.message || 'Unknown error occurred'
        });
    }
}
