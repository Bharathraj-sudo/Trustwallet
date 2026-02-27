import React from "react";
import { ChevronLeft, Share2, Info, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransactionDetailViewProps {
    amount: string;
    tokenSymbol: string;
    usdValue?: string;
    recipientAddress: string;
    date?: string;
    status?: "Pending" | "Completed" | "Failed";
    networkFee?: string;
    networkFeeUsd?: string;
    confirmations?: string;
    nonce?: number;
    txHash?: string;
    onClose: () => void;
    onViewOnExplorer?: () => void;
}

export function TransactionDetailView({
    amount,
    tokenSymbol,
    usdValue,
    recipientAddress,
    date,
    status = "Pending",
    networkFee = "--",
    networkFeeUsd,
    confirmations = "--",
    nonce,
    txHash,
    onClose,
    onViewOnExplorer,
}: TransactionDetailViewProps) {
    const displayDate =
        date ||
        new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }) +
        ", " +
        new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });

    const shortAddr = recipientAddress
        ? `${recipientAddress.slice(0, 7)}...${recipientAddress.slice(-5)}`
        : "--";

    return (
        <div className="fixed inset-0 z-[110] bg-[#0f0f0f] text-white flex flex-col select-none">
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-12 pb-4">
                <button
                    onClick={onClose}
                    className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h1 className="text-[17px] font-semibold">Transfer</h1>
                <button className="p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors">
                    <Share2 className="w-4.5 h-4.5" />
                </button>
            </div>

            {/* Amount section */}
            <div className="flex flex-col items-center pt-6 pb-8 px-6">
                <p className="text-[38px] font-bold tracking-tight mb-1">
                    -{amount} {tokenSymbol}
                </p>
                {usdValue && (
                    <p className="text-white/50 text-[16px]">≈ {usdValue}</p>
                )}
            </div>

            {/* Info cards */}
            <div className="px-4 flex flex-col gap-4 flex-1">
                {/* Card 1: Date / Status / Recipient */}
                <div className="bg-[#1c1c1e] rounded-[16px] overflow-hidden">
                    <Row label="Date" value={displayDate} />
                    <Row
                        label="Status"
                        value={status}
                        valueClass={cn(
                            status === "Pending" && "text-[#f0b429]",
                            status === "Completed" && "text-green-400",
                            status === "Failed" && "text-red-400"
                        )}
                    />
                    <Row label="Recipient" value={shortAddr} last />
                </div>

                {/* Card 2: Network fee / Confirmations / Nonce */}
                <div className="bg-[#1c1c1e] rounded-[16px] overflow-hidden">
                    <Row
                        label="Network fee"
                        value={networkFee + " " + tokenSymbol}
                        subValue={networkFeeUsd ? `(${networkFeeUsd})` : undefined}
                        showInfo
                    />
                    <Row
                        label="Confirmations"
                        value={confirmations}
                        showInfo
                    />
                    {nonce !== undefined && (
                        <Row label="Nonce" value={String(nonce)} last />
                    )}
                </div>

                {/* More Details */}
                <button
                    onClick={onViewOnExplorer}
                    className="w-full bg-[#1c1c1e] rounded-[16px] flex items-center justify-between px-4 py-4 hover:bg-white/5 active:scale-[0.99] transition-all"
                >
                    <span className="text-[16px] font-medium">More Details</span>
                    <ChevronRight className="w-5 h-5 text-white/40" />
                </button>
            </div>

            {/* Safe bottom area */}
            <div className="h-8" />
        </div>
    );
}

/* ─── Helper ─────────────────────────────────────────────────── */

function Row({
    label,
    value,
    subValue,
    showInfo = false,
    valueClass,
    last = false,
}: {
    label: string;
    value: string;
    subValue?: string;
    showInfo?: boolean;
    valueClass?: string;
    last?: boolean;
}) {
    return (
        <div
            className={cn(
                "flex items-start justify-between px-4 py-3.5",
                !last && "border-b border-white/[0.06]"
            )}
        >
            <div className="flex items-center gap-1 text-white/55 text-[15px]">
                {label}
                {showInfo && <Info className="w-3.5 h-3.5 opacity-40 ml-0.5" />}
            </div>
            <div className="flex flex-col items-end max-w-[55%]">
                <span
                    className={cn(
                        "text-[15px] font-medium text-right",
                        valueClass || "text-white"
                    )}
                >
                    {value}
                </span>
                {subValue && (
                    <span className="text-[12px] text-white/35 mt-0.5">{subValue}</span>
                )}
            </div>
        </div>
    );
}
