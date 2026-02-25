import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useTransaction } from "../context/TransactionContext";
import { Loader2 } from "lucide-react";

export default function ProcessingPage() {
    const { state, txData } = useTransaction();
    const [, setLocation] = useLocation();

    useEffect(() => {
        if (!txData || state !== "sending") {
            setLocation("/tx/send");
        }
    }, [txData, state, setLocation]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-slate-50 dark:bg-slate-950 p-4">
            <div className="flex flex-col items-center animate-pulse">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin mb-6" />
                <h2 className="text-xl font-semibold">Transaction in progress...</h2>
                <p className="text-muted-foreground mt-2 text-sm">Please do not close this window</p>
            </div>
        </div>
    );
}
