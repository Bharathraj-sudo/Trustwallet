export function parseQRData(qrString: string) {
    try {
        // Direct JSON Payload
        if (qrString.startsWith("{")) {
            const data = JSON.parse(qrString);
            if (!data.receiverAddress || !data.token || !data.amount || !data.network) {
                throw new Error("Missing required QR fields");
            }
            return {
                receiverAddress: data.receiverAddress,
                token: data.token,
                amount: String(data.amount),
                network: data.network,
                memo: data.memo || "",
            };
        }

        // Standard ERC-681 Fallback
        if (qrString.startsWith("ethereum:")) {
            const parts = qrString.replace("ethereum:", "").split("?");
            const mainPart = parts[0];
            const qs = parts[1] || "";
            const searchParams = new URLSearchParams(qs);

            const address = mainPart.split("@")[0].replace("pay-", "").replace("ethereum:", "");

            return {
                receiverAddress: address,
                token: searchParams.get("tokenSymbol") || searchParams.get("token") || "ETH",
                amount: searchParams.get("amount") || searchParams.get("value") || "0",
                network: searchParams.get("network") || "ethereum",
                memo: searchParams.get("memo") || ""
            };
        }

        throw new Error("Unrecognized format");
    } catch (error: any) {
        throw new Error(error.message || "Invalid QR Data format.");
    }
}
