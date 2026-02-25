export function parseQRData(qrString: string) {
    try {
        let receiverAddress = "";
        let token = "ETH";
        let amount = "0";
        let network = "ethereum";
        let memo = "";

        // Direct JSON Payload
        if (qrString.startsWith("{")) {
            const data = JSON.parse(qrString);
            receiverAddress = data.receiverAddress || data.address || "";
            token = data.token || data.tokenSymbol || "ETH";
            amount = String(data.amount || "0");
            network = data.network || "ethereum";
            memo = data.memo || "";
        }
        // Standard ERC-681 Fallback
        else if (qrString.startsWith("ethereum:")) {
            const parts = qrString.replace("ethereum:", "").split("?");
            const mainPart = parts[0];
            const qs = parts[1] || "";
            const searchParams = new URLSearchParams(qs);

            receiverAddress = mainPart.split("@")[0].replace("pay-", "").replace("ethereum:", "");
            token = searchParams.get("tokenSymbol") || searchParams.get("token") || "ETH";
            amount = searchParams.get("amount") || searchParams.get("value") || "0";
            network = searchParams.get("network") || "ethereum";
            memo = searchParams.get("memo") || "";
        }
        // Bare Address Backup
        else {
            receiverAddress = qrString.trim();
        }

        // Extremely robust regex check for an EVM address anywhere if previous extraction is bad
        const ethAddressRegex = /0x[a-fA-F0-9]{40}/;
        if (!receiverAddress || !ethAddressRegex.test(receiverAddress)) {
            // Find an address inside the raw string just in case
            const match = qrString.match(ethAddressRegex);
            if (match) {
                receiverAddress = match[0];
            } else {
                // Exact error handling the user specifically encounters / expects regarding validation
                throw new Error("QR code dons't contain vaild adress");
            }
        }

        return {
            receiverAddress,
            token,
            amount: amount,
            network: network,
            memo: memo,
        };
    } catch (error: any) {
        throw new Error(error.message || "Invalid QR Data format.");
    }
}
