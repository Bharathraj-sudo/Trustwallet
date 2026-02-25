import React, { createContext, useContext, useState, ReactNode } from "react";
import { useLocation } from "wouter";
import { dummySendTransaction } from "../lib/dummyApi";

interface TxData {
    receiverAddress: string;
    token: string;
    amount: string;
    network: string;
    memo?: string;
}

type TxState = "idle" | "scanned" | "confirming" | "sending" | "success" | "failed";

interface TransactionContextType {
    state: TxState;
    txData: TxData | null;
    txHash: string | null;
    error: string | null;
    setTxData: (data: TxData | null) => void;
    setError: (err: string | null) => void;
    setState: (state: TxState) => void;
    sendTransaction: () => Promise<void>;
    reset: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<TxState>("idle");
    const [txData, setTxData] = useState<TxData | null>(null);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [, setLocation] = useLocation();

    const sendTransaction = async () => {
        if (!txData) return;
        try {
            setState("sending");
            console.log("TX_SENT");
            setLocation("/tx/processing");

            // Replace with actual provider sendTransaction in real prod
            const response: any = await dummySendTransaction(txData);

            console.log("TX_SUCCESS");
            setTxHash(response.hash);
            setState("success");
            setLocation("/tx/success");
        } catch (err: any) {
            console.log("TX_FAILED");
            setError(err.message || "Transaction failed");
            setState("failed");
            setLocation("/tx/failed");
        }
    };

    const reset = () => {
        setState("idle");
        setTxData(null);
        setTxHash(null);
        setError(null);
    };

    return (
        <TransactionContext.Provider value={{
            state, txData, txHash, error, setTxData, setError, setState, sendTransaction, reset
        }}>
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransaction() {
    const context = useContext(TransactionContext);
    if (!context) throw new Error("useTransaction must be used within TransactionProvider");
    return context;
}
