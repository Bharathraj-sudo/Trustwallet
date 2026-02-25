export function parseQRData(qrString: string) {
    try {
        console.log("Parsing QR Code/Address:", qrString);
        let receiverAddress = "";
        let token = "ETH";
        let amount = "0";
        let network = "ethereum";

        // Handle raw string payloads directly
        let processString = qrString.trim();

        // 1. Direct JSON Payload test
        if (processString.startsWith("{")) {
            try {
                const data = JSON.parse(processString);
                receiverAddress = data.receiverAddress || data.address || "";
                token = data.token || data.tokenSymbol || "ETH";
                amount = String(data.amount || "0");
                network = data.network || "ethereum";
            } catch (e) {
                // Ignore json error, fallback
            }
        }
        // 2. Standard ERC-681 / Protocol Specific Fallback
        else if (processString.includes(":")) {
            // e.g. ethereum:0xABC...?amount=0.5
            // e.g. pay-ethereum:0x...
            const protocolSplit = processString.split(":");
            processString = protocolSplit.slice(1).join(":"); // take everything after the first colon

            const parts = processString.split("?");
            const mainPart = parts[0];
            const qs = parts[1] || "";
            const searchParams = new URLSearchParams(qs);

            receiverAddress = mainPart.split("@")[0].replace("pay-", "");
            token = searchParams.get("tokenSymbol") || searchParams.get("token") || "ETH";
            amount = searchParams.get("amount") || searchParams.get("value") || "0";
            network = searchParams.get("network") || "ethereum";
        }
        // 3. Raw Ethereum Address Backup
        else {
            receiverAddress = processString;
        }

        // 4. Validate and Sanitize final extraction
        const ethAddressRegex = /0x[a-fA-F0-9]{40}/;
        if (!receiverAddress || !ethAddressRegex.test(receiverAddress)) {
            // Find an address inside the raw string if the extraction completely missed
            const match = qrString.match(ethAddressRegex);
            if (match) {
                receiverAddress = match[0];
            } else {
                throw new Error("QR code doesn't contain a valid Ethereum address");
            }
        }

        console.log("ADDRESS_PARSED", receiverAddress);

        return {
            receiverAddress,
            token,
            amount,
            network
        };
    } catch (error: any) {
        throw new Error(error.message || "Invalid QR Data format.");
    }
}
