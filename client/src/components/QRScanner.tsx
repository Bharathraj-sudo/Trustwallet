import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useTransactionFlow } from "../hooks/useTransactionFlow";
import { Button } from "./ui/button";

export function QRScanner() {
    const { handleScan, state, errorObj } = useTransactionFlow();
    const [init, setInit] = useState(false);

    useEffect(() => {
        if (init) return;
        setInit(true);

        // Create new HTML5 QR Code Scanner
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        const onScanSuccess = (decodedText) => {
            console.log("QR Parsed:", decodedText);
            scanner.pause();
            try {
                handleScan(decodedText);
            } catch (e) {
                scanner.resume();
            }
        };

        const onScanFailure = (error) => {
            // Ignored. Continuously scans.
        };

        scanner.render(onScanSuccess, onScanFailure);

        // Cleanup when component unmounts
        return () => {
            try {
                scanner.clear();
            } catch (e) {
                console.error("Scanner clear error", e);
            }
        };
    }, [handleScan, init]);

    return (
        <div className="flex flex-col items-center max-w-sm mx-auto p-4 space-y-4">
            <h2 className="text-xl font-bold">Scan Payment QR Code</h2>

            {state === "error" && (
                <div className="bg-red-100 text-red-700 p-3 rounded">
                    {errorObj?.toString() || "Invalid QR"}
                </div>
            )}

            {/* HTML5 QR Camera View Container */}
            <div id="qr-reader" className="w-full bg-slate-100 min-h-[300px] rounded overflow-hidden"></div>

            <p className="text-sm text-gray-500">
                Align the QR code within the frame to automatically scan.
            </p>
        </div>
    );
}

export default QRScanner;
