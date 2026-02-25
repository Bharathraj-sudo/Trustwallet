# Valid QR Code Formats

Our centralized QR Parser (`lib/qrParser.ts`) universally intercepts and maps these payloads cleanly for routing to the confirm screen.

## Option 1: Direct JSON Payload (Preferred for precise UI mapping)
```json
{
  "receiverWalletAddress": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "tokenSymbol": "USDT",
  "amount": "50.00",
  "network": "ethereum"
}
```

## Option 2: Standard Ethereum URI (EIP-681)
```text
ethereum:0x742d35Cc6634C0532925a3b844Bc454e4438f44e?tokenSymbol=USDT&amount=50.00&network=ethereum
```

## How to use
Scan either of these strings using our `Html5QrcodeScanner` inside `/scan`. The state machine hooks dynamically parse this metadata and forward it into `/confirm` without hard reloads via `wouter`.
