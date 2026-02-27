import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessingScreenProps {
    onClose?: () => void;
    onViewDetails?: () => void;
    className?: string;
}

export function ProcessingScreen({
    onClose,
    onViewDetails,
    className,
}: ProcessingScreenProps) {
    return (
        <div
            className={cn(
                "fixed inset-0 z-[100] flex flex-col justify-end",
                className
            )}
        >
            {/* Dim background */}
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            {/* Bottom sheet card */}
            <div className="relative w-full bg-[#17191d] rounded-t-[28px] px-6 pb-10 pt-8 flex flex-col items-center text-center shadow-2xl">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-full text-white/50 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Globe + Checkmark 3D Asset */}
                <div className="relative w-36 h-36 mb-6 flex items-center justify-center">
                    {/* Spinning globe grid */}
                    <svg
                        viewBox="0 0 120 120"
                        className="absolute inset-0 w-full h-full animate-[spin_8s_linear_infinite] opacity-90"
                        fill="none"
                    >
                        {/* Outer circle */}
                        <ellipse cx="60" cy="60" rx="56" ry="56" stroke="#1e3a8a" strokeWidth="1.2" />
                        {/* Horizontal ellipses */}
                        <ellipse cx="60" cy="60" rx="56" ry="18" stroke="#1e3a8a" strokeWidth="1" />
                        <ellipse cx="60" cy="60" rx="56" ry="36" stroke="#1e3a8a" strokeWidth="0.8" />
                        {/* Vertical ellipses */}
                        <ellipse cx="60" cy="60" rx="18" ry="56" stroke="#1e3a8a" strokeWidth="1" />
                        <ellipse cx="60" cy="60" rx="36" ry="56" stroke="#1e3a8a" strokeWidth="0.8" />
                        {/* Vertical line */}
                        <line x1="60" y1="4" x2="60" y2="116" stroke="#1e3a8a" strokeWidth="0.8" />
                        {/* Horizontal line */}
                        <line x1="4" y1="60" x2="116" y2="60" stroke="#1e3a8a" strokeWidth="0.8" />
                    </svg>

                    {/* 3D Checkmark — tilted green checkmark with blue shadow layer */}
                    <div className="relative z-10 transform rotate-[-12deg]">
                        {/* Blue shadow layer */}
                        <div className="absolute inset-0 translate-x-[6px] translate-y-[6px]">
                            <svg viewBox="0 0 60 60" width="60" height="60">
                                <polyline
                                    points="8,32 22,46 52,16"
                                    stroke="#1d4ed8"
                                    strokeWidth="9"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    fill="none"
                                />
                            </svg>
                        </div>
                        {/* Green main checkmark */}
                        <svg viewBox="0 0 60 60" width="60" height="60" className="relative">
                            <polyline
                                points="8,32 22,46 52,16"
                                stroke="#22c55e"
                                strokeWidth="9"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                            />
                        </svg>
                    </div>

                    {/* Small blue diamond decorators */}
                    <div className="absolute top-4 right-5 w-3 h-3 bg-blue-500 rotate-45 opacity-80" />
                    <div className="absolute bottom-6 left-4 w-2 h-2 bg-blue-700 rotate-45 opacity-80" />
                </div>

                {/* Text */}
                <h2 className="text-[22px] font-bold text-white mb-3">Processing...</h2>
                <p className="text-white/55 text-[14px] leading-relaxed mb-8 max-w-[280px]">
                    Transaction in progress! Blockchain validation is underway. This may take a few minutes.
                </p>

                {/* Action Button */}
                <button
                    onClick={onViewDetails}
                    className="w-full h-14 rounded-full bg-[#2ecc71] hover:bg-[#27ae60] active:scale-[0.98] text-[#0a1a10] text-[17px] font-bold transition-all shadow-lg"
                >
                    Transaction details
                </button>
            </div>
        </div>
    );
}
