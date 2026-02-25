import { useState, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { parseQRData } from "../lib/qrParser";
import { BrowserProvider, parseEther } from "ethers";

export function useTransactionFlow() {
    const [, setLocation] = useLocation();
    const [state, setState] = useState("idle"); // idle -> scanned -> confirming -> sending -> success -> error
    const [txData, setTxData] = useState(null);
    const [txHash, setTxHash] = useState(null);
    const [errorObj, setErrorObj] = useState(null);

    const handleScan = useCallback((qrString) => {
        try {
            setState("scanned");
            console.log("QR Parsed:", qrString);

            const parsed = parseQRData(qrString);
            console.log("QR Parsed:", parsed);

            // Store in session storage for persistence
            sessionStorage.setItem("scanned_qr_tx", JSON.stringify(parsed));
            setTxData(parsed);

            console.log("Navigating to confirm");
            setLocation("/confirm");
        } catch (err) {
            console.error("Scanning Error:", err);
            setState("error");
            setErrorObj(err.message || "Failed to scan QR");
        }
    }, [setLocation]);

    const loadConfirmData = useCallback(() => {
        try {
            const stored = sessionStorage.getItem("scanned_qr_tx");
            if (!stored) {
                throw new Error("Missing QR Data. Please scan again.");
            }
            const parsed = JSON.parse(stored);
            setTxData(parsed);
            setState("confirming");
            return parsed;
        } catch (err) {
            console.error(err);
            setLocation("/scan"); // protected routing redirect
            return null;
        }
    }, [setLocation]);

    const confirmAndSend = useCallback(async () => {
        try {
            if (!txData) throw new Error("No transaction data loaded");

            console.log("Sending tx...");
            setState("sending");

            if (!window.ethereum) {
                throw new Error("No Web3 Provider (MetaMask/Trust) found in browser");
            }

            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const txResponse = await signer.sendTransaction({
                to: txData.receiverWalletAddress,
                value: parseEther(txData.amount || "0"),
            });

            console.log("Transaction successfully submitted:", txResponse.hash);
            setTxHash(txResponse.hash);
            setState("success");

            sessionStorage.removeItem("scanned_qr_tx");
            return txResponse.hash;
        } catch (err) {
            console.error("Transation Send Error:", err);
            setState("error");
            setErrorObj(err.message || "Transaction Failed");
            throw err;
        }
    }, [txData]);

    const resetFlow = useCallback(() => {
        setState("idle");
        setTxData(null);
        setTxHash(null);
        setErrorObj(null);
        sessionStorage.removeItem("scanned_qr_tx");
        setLocation("/scan");
    }, [setLocation]);

    return {
        state,
        txData,
        txHash,
        errorObj,
        handleScan,
        loadConfirmData,
        confirmAndSend,
        resetFlow
    };
}
