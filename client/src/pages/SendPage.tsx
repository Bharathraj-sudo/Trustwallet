import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useLocation } from "wouter";
import { useTransaction } from "../context/TransactionContext";
import { parseQRData } from "../lib/qrParser";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useToast } from "../hooks/use-toast";
import { ArrowLeft, Camera, ClipboardPaste, Send } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";

export default function SendPage() {
    const { setTxData, setState } = useTransaction();
    const [, setLocation] = useLocation();
    const { toast } = useToast();

    const [isScanning, setIsScanning] = useState(false);
    const [receiverAddress, setReceiverAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [token, setToken] = useState("ETH");
    const [network, setNetwork] = useState("ethereum");

    useEffect(() => {
        if (!isScanning) return;

        const scanner = new Html5QrcodeScanner(
            "qr-reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false
        );

        const onScanSuccess = (decodedText: string) => {
            try {
                console.log("QR_SCANNED", decodedText);

                if (decodedText.startsWith("http") || decodedText.startsWith("trust") || decodedText.startsWith("metamask")) {
                    scanner.clear();
                    window.location.href = decodedText;
                    return;
                }

                const parsed = parseQRData(decodedText);
                setReceiverAddress(parsed.receiverAddress);
                setAmount(parsed.amount || "0");
                setToken(parsed.token || "ETH");
                setNetwork(parsed.network || "ethereum");

                setIsScanning(false);
                scanner.clear();
                toast({ title: "Scanner parsed address successfully!" });
            } catch (err: any) {
                toast({ title: "QR Error", description: err.message, variant: "destructive" });
            }
        };

        scanner.render(onScanSuccess, () => { });

        return () => {
            try { scanner.clear(); } catch (e) { }
        };
    }, [isScanning, toast]);

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const parsed = parseQRData(text);
            setReceiverAddress(parsed.receiverAddress);
            toast({ title: "Pasted successfully!" });
        } catch (err: any) {
            toast({ title: "Invalid Paste", description: err.message, variant: "destructive" });
        }
    };

    const handleNext = () => {
        try {
            if (!receiverAddress) throw new Error("Please enter a valid receiver address.");
            if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) throw new Error("Please enter a valid amount.");
            console.log("NEXT_CLICKED");

            // Final sanity extraction through parser (handles raw string inputs correctly now)
            const finalData = parseQRData(receiverAddress);
            finalData.amount = amount;
            finalData.token = token;
            finalData.network = network;

            setTxData(finalData);
            setState("ready"); // Flow to confirm page dynamically via React context passing
            setLocation("/tx/confirm");
        } catch (err: any) {
            toast({ title: "Validation Error", description: err.message, variant: "destructive" });
        }
    };

    return (
        <div className="flex flex-col items-center min-h-[100dvh] bg-slate-50 p-4 pt-10 dark:bg-slate-950">
            <div className="w-full max-w-md space-y-6">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h2 className="text-2xl font-bold">Send Crypto</h2>
                </div>

                <Card className="shadow-sm">
                    <CardContent className="pt-6 space-y-6">

                        {isScanning ? (
                            <div className="bg-white dark:bg-slate-900 p-2 rounded-xl shadow-sm border overflow-hidden">
                                <div id="qr-reader" className="w-full h-[300px]"></div>
                                <Button variant="outline" className="w-full mt-4" onClick={() => setIsScanning(false)}>Cancel Scanner</Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recipient Address</label>
                                    <div className="flex gap-2">
                                        <Input
                                            className="flex-1 font-mono text-xs py-5"
                                            placeholder="0x..."
                                            value={receiverAddress}
                                            onChange={e => setReceiverAddress(e.target.value)}
                                        />
                                        <Button variant="secondary" size="icon" onClick={handlePaste} title="Paste from clipboard">
                                            <ClipboardPaste className="w-4 h-4" />
                                        </Button>
                                        <Button variant="secondary" size="icon" onClick={() => setIsScanning(true)} title="Scan QR Code">
                                            <Camera className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Network</label>
                                        <Select value={network} onValueChange={setNetwork}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Network" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ethereum">Ethereum</SelectItem>
                                                <SelectItem value="bsc">Binance Smart Chain</SelectItem>
                                                <SelectItem value="polygon">Polygon</SelectItem>
                                                <SelectItem value="optimism">Optimism</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Token</label>
                                        <Select value={token} onValueChange={setToken}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Token" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ETH">ETH</SelectItem>
                                                <SelectItem value="USDT">USDT</SelectItem>
                                                <SelectItem value="USDC">USDC</SelectItem>
                                                <SelectItem value="BNB">BNB</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Amount</label>
                                    <Input
                                        type="number"
                                        step="any"
                                        className="text-lg py-5"
                                        placeholder="0.00"
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}

                        {!isScanning && (
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg rounded-xl"
                                onClick={handleNext}
                                disabled={!receiverAddress || receiverAddress.length < 10}
                            >
                                Next <Send className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
