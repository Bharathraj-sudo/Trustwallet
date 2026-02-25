const COINGECKO_ID_BY_SYMBOL = {
    ETH: "ethereum",
    WETH: "ethereum",
    BNB: "binancecoin",
    WBNB: "binancecoin",
    MATIC: "matic-network",
    POL: "matic-network",
    AVAX: "avalanche-2",
    FTM: "fantom",
    USDC: "usd-coin",
    USDT: "tether",
};

async function fetchUsdPrice(symbol) {
    const id = COINGECKO_ID_BY_SYMBOL[symbol.toUpperCase()];
    if (!id) return null;

    try {
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=usd`;
        const res = await fetch(url, { headers: { accept: "application/json" } });
        if (!res.ok) return null;
        const data = await res.json();
        const value = Number(data?.[id]?.usd);
        return Number.isFinite(value) && value > 0 ? value : null;
    } catch {
        return null;
    }
}

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { tokenSymbol, networkId } = req.query;
    if (!tokenSymbol || !networkId) {
        return res.status(400).json({ message: "tokenSymbol and networkId are required" });
    }

    try {
        const ts = String(tokenSymbol).toUpperCase();
        const ni = String(networkId);
        const usdRate = await fetchUsdPrice(ts);

        let gasFeeToken = "ETH";
        if (ni === "137") gasFeeToken = "POL";
        if (ni === "56" || ni === "97") gasFeeToken = "BNB";
        if (ni === "43114") gasFeeToken = "AVAX";
        if (ni === "250") gasFeeToken = "FTM";

        let gasFeeUsd = null;
        const nativeUsdRate = await fetchUsdPrice(gasFeeToken);
        if (nativeUsdRate) {
            gasFeeUsd = nativeUsdRate * 0.001;
        }

        return res.status(200).json({
            tokenSymbol: ts,
            networkId: ni,
            usdRate,
            gasFeeToken,
            gasFeeUsd,
            asOf: new Date().toISOString(),
            stale: usdRate === null
        });
    } catch (e) {
        return res.status(500).json({ message: e.message || "Failed to fetch quote" });
    }
}
