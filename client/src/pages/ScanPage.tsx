import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useLocation } from "wouter";
import { useTransaction } from "../context/TransactionContext";
import { parseQRData } from "../lib/qrParser";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { ArrowLeft } from "lucide-react";

export default function ScanPage() {
    const { setTxData, setState } = useTransaction();
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [init, setInit] = useState(false);

    useEffect(() => {
        if (init) return;
        setInit(true);

        // Html5QrcodeScanner natively supports both camera scanning and image upload!
        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        const onScanSuccess = (decodedText: string) => {
            try {
                // Determine if this is a web/deep-link URL that we should route to natively vs a payload
                if (decodedText.startsWith("http") || decodedText.startsWith("trust") || decodedText.startsWith("metamask")) {
                    scanner.clear();
                    window.location.href = decodedText;
                    return;
                }

                console.log("QR_SCANNED");
                const parsed = parseQRData(decodedText);
                setTxData(parsed);
                setState("scanned");
                setLocation("/tx/confirm");
                scanner.clear(); // Stop scanning once valid QR found
            } catch (err: any) {
                toast({ title: "Invalid QR Code", description: err.message, variant: "destructive" });
            }
        };

        scanner.render(onScanSuccess, () => { });

        return () => {
            try { scanner.clear(); } catch (e) { }
        };
    }, [init, setTxData, setState, setLocation, toast]);

    return (
        <div className="flex flex-col items-center min-h-[100dvh] bg-slate-50 p-4 pt-10 dark:bg-slate-950">
            <div className="w-full max-w-md space-y-4">
                <Button variant="ghost" onClick={() => setLocation("/dashboard")} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Cancel
                </Button>
                <h2 className="text-2xl font-bold text-center">Scan QR Code</h2>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border overflow-hidden">
                    <div id="qr-reader" className="w-full"></div>
                </div>
            </div>
        </div>
    );
}
