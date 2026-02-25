export function parseQRData(qrString) {
    try {
        console.log("Attempting to parse QR:", qrString);

        // Try direct exact JSON Payload matching user rules (amount, tokenSymbol, network, receiverAddress)
        if (qrString.startsWith("{")) {
            const data = JSON.parse(qrString);
            if (!data.receiverWalletAddress || !data.tokenSymbol || !data.amount || !data.network) {
                throw new Error("Missing required QR fields");
            }
            return {
                receiverWalletAddress: data.receiverWalletAddress,
                tokenSymbol: data.tokenSymbol,
                amount: String(data.amount),
                network: data.network,
            };
        }

        // Standard ERC-681 Fallback parsing (ethereum URI format implementation)
        if (qrString.startsWith("ethereum:")) {
            const parts = qrString.replace("ethereum:", "").split("?");
            const mainPart = parts[0];
            const qs = parts[1] || "";
            const searchParams = new URLSearchParams(qs);

            // Strip potential address prefixes like "pay-"
            const address = mainPart.split("@")[0].replace("pay-", "");

            return {
                receiverWalletAddress: address,
                tokenSymbol: searchParams.get("tokenSymbol") || "ETH",
                amount: searchParams.get("amount") || searchParams.get("value") || "0",
                network: searchParams.get("network") || "ethereum"
            };
        }

        throw new Error("Unrecognized format");
    } catch (error) {
        console.error("QR Parse Error encountered:", error);
        throw new Error("Invalid QR Data format. Please scan a valid payment code.");
    }
}
