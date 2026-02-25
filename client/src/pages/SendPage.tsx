import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useLocation } from "wouter";
import { useTransaction } from "../context/TransactionContext";
import { parseQRData } from "../lib/qrParser";
import { ArrowLeft, Scan, Clipboard, ChevronDown, ShieldAlert } from "lucide-react";

export default function SendPage() {
    const { setTxData, setState } = useTransaction();
    const [, setLocation] = useLocation();

    const [isScanning, setIsScanning] = useState(false);
    const [receiverAddress, setReceiverAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [token, setToken] = useState("ETH");
    const [network, setNetwork] = useState("ethereum");

    // Local toast for exact TrustWallet replication
    const [twToast, setTwToast] = useState<string | null>(null);

    const showToast = (msg: string) => {
        setTwToast(msg);
        setTimeout(() => setTwToast(null), 3000);
    };

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
            } catch (err: any) {
                // The exact requirement: "QR code doesn't contain valid address"
                showToast(err.message || "QR code doesn't contain valid address");
            }
        };

        scanner.render(onScanSuccess, () => { });

        return () => {
            try { scanner.clear(); } catch (e) { }
        };
    }, [isScanning]);

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const parsed = parseQRData(text);
            setReceiverAddress(parsed.receiverAddress);
        } catch (err: any) {
            showToast(err.message || "Invalid Paste data");
        }
    };

    const handleNext = () => {
        try {
            if (!receiverAddress) throw new Error("Please enter a valid receiver address.");
            if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) throw new Error("Please enter a valid amount.");
            console.log("NEXT_CLICKED");

            const finalData = parseQRData(receiverAddress);
            finalData.amount = amount;
            finalData.token = token;
            finalData.network = network;

            setTxData(finalData);
            setState("ready");
            setLocation("/tx/confirm");
        } catch (err: any) {
            showToast(err.message || "Validation Error");
        }
    };

    const isNextEnabled = receiverAddress.length >= 10;

    return (
        <div className="relative flex flex-col min-h-[100dvh] bg-[#121212] text-white font-sans sm:items-center">
            <div className="w-full max-w-md flex flex-col min-h-[100dvh] bg-[#121212]">

                {/* Header */}
                <header className="flex items-center px-4 h-14 relative shrink-0">
                    <button
                        onClick={() => setLocation("/dashboard")}
                        className="p-2 -ml-2 text-gray-300 hover:text-white"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="flex-1 text-center text-lg font-semibold mr-8">Send {token}</h1>
                </header>

                {/* Main Content */}
                <div className="flex-1 px-4 py-2 space-y-6">

                    {isScanning ? (
                        <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-lg border border-[#2a2a2a]">
                            <div id="qr-reader" className="w-full h-[300px]"></div>
                            <button
                                className="w-full py-4 text-center font-semibold text-[#05a660] border-t border-[#2a2a2a]"
                                onClick={() => setIsScanning(false)}
                            >
                                Cancel Scanner
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Address Input */}
                            <div className="space-y-1.5">
                                <label className="text-[14px] font-medium text-[#8f96a1]">
                                    Address or Domain Name
                                </label>
                                <div className={`flex items-center bg-transparent border rounded-xl overflow-hidden px-3 py-1 ${receiverAddress || isScanning ? 'border-[#05a660]' : 'border-[#3d434c] focus-within:border-[#05a660]'}`}>
                                    <input
                                        type="text"
                                        placeholder="Search or Enter"
                                        value={receiverAddress}
                                        onChange={e => setReceiverAddress(e.target.value)}
                                        className="flex-1 bg-transparent border-none outline-none text-white text-base py-3 placeholder-[#6b7280] min-w-0"
                                    />
                                    <div className="flex items-center gap-4 text-[#05a660] shrink-0 ml-2">
                                        {!receiverAddress && (
                                            <button onClick={handlePaste} className="flex items-center gap-1.5 font-semibold text-sm">
                                                Paste <Clipboard className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button onClick={() => setIsScanning(true)}>
                                            <Scan className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Network Select */}
                            <div className="space-y-1.5">
                                <label className="text-[14px] font-medium text-[#8f96a1]">
                                    Destination network
                                </label>
                                <div className="inline-flex items-center gap-2 bg-[#1b1e24] px-3 py-1.5 rounded-full text-sm font-medium text-gray-300">
                                    <div className="w-5 h-5 bg-[#627eea] rounded-full flex items-center justify-center">
                                        {/* Simple Eth logo approximation */}
                                        <svg width="12" height="12" viewBox="0 0 256 417" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                                            <path fill="#fff" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" />
                                            <path fill="#fff" opacity=".7" d="M127.962 0L0 212.32l127.962 75.639V154.158z" />
                                            <path fill="#fff" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" />
                                            <path fill="#fff" opacity=".7" d="M127.962 416.905v-104.72L0 236.585z" />
                                            <path fill="#fff" opacity=".5" d="M127.961 287.958l127.96-75.637-127.96-58.162z" />
                                            <path fill="#fff" opacity=".3" d="M0 212.32l127.96 75.638v-133.8z" />
                                        </svg>
                                    </div>
                                    <select
                                        className="bg-transparent border-none outline-none appearance-none pr-1"
                                        value={network}
                                        onChange={(e) => setNetwork(e.target.value)}
                                    >
                                        <option value="ethereum">Ethereum</option>
                                        <option value="bsc">BNB Chain</option>
                                        <option value="polygon">Polygon</option>
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            {/* Amount Input */}
                            <div className="space-y-1.5 pt-2">
                                <label className="text-[14px] font-medium text-[#8f96a1]">
                                    Amount
                                </label>
                                <div className="bg-[#1c1c1e] rounded-xl px-3 py-1 flex items-center">
                                    <input
                                        type="number"
                                        placeholder={`${token} Amount`}
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        className="flex-1 bg-transparent border-none outline-none text-white text-base py-3 placeholder-[#6b7280]"
                                    />
                                    <div className="flex items-center gap-3 shrink-0 ml-2 font-semibold">
                                        <span className="text-gray-400">{token}</span>
                                        <button className="text-[#05a660]" onClick={() => setAmount("1.0")}>Max</button>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 font-medium px-1">
                                    ≈ ${amount ? (Number(amount) * 3000).toFixed(2) : "0.00"}
                                </div>
                            </div>
                        </>
                    )}

                </div>

                {/* Footer Next Button */}
                {!isScanning && (
                    <div className="px-4 pb-8 shrink-0">
                        <button
                            className={`w-full py-4 rounded-full font-bold text-[17px] transition-colors ${isNextEnabled ? 'bg-[#05a660] text-white hover:bg-[#04884f]' : 'bg-[#1e2a24] text-[#2c523f]'}`}
                            disabled={!isNextEnabled}
                            onClick={handleNext}
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Custom Trust Wallet Style Toast */}
                {twToast && (
                    <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[85%] max-w-[320px] bg-[#222222] rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200 z-50">
                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0">
                            <ShieldAlert className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-white text-[15px] font-medium leading-snug">
                            {twToast}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
