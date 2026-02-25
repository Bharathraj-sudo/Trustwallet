import { query } from '../../../lib/db.js';

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const { code } = req.query;

            if (!code) {
                return res.status(400).json({ message: 'Plan code is required' });
            }

            const result = await query(
                `SELECT 
                 id, user_id as "userId", plan_name as "planName", wallet_address as "walletAddress", 
                 network_id as "networkId", network_name as "networkName", token_address as "tokenAddress", 
                 token_symbol as "tokenSymbol", token_decimals as "tokenDecimals", interval_amount as "intervalAmount", 
                 interval_value as "intervalValue", interval_unit as "intervalUnit", plan_code as "planCode", 
                 recurring_amount as "recurringAmount", contract_address as "contractAddress", video_url as "videoUrl", 
                 created_at as "createdAt"
                 FROM plans 
                 WHERE plan_code = $1`,
                [code]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ message: 'Plan not found' });
            }

            return res.status(200).json(result.rows[0]);
        }

        return res.status(405).json({ message: 'Method Not Allowed' });
    } catch (error) {
        console.error('Plan By Code API error:', error);
        return res.status(500).json({
            message: 'Fatal Server Error',
            error: error.message || 'Unknown error occurred'
        });
    }
}
