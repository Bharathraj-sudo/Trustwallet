import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useTransaction } from "../context/TransactionContext";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { CheckCircle2, Copy } from "lucide-react";

export default function SuccessPage() {
    const { txData, txHash, reset } = useTransaction();
    const [, setLocation] = useLocation();
    const { toast } = useToast();

    useEffect(() => {
        if (!txData || !txHash) {
            setLocation("/dashboard");
        }
    }, [txData, txHash, setLocation]);

    if (!txData || !txHash) return null;

    const shortHash = `${txHash.slice(0, 10)}...${txHash.slice(-8)}`;
    const shortAddr = `${txData.receiverAddress.slice(0, 6)}...${txData.receiverAddress.slice(-4)}`;

    const copyHash = () => {
        navigator.clipboard.writeText(txHash);
        toast({ title: "Copied!", description: "Transaction hash copied to clipboard." });
    };

    const handleDone = () => {
        reset();
        setLocation("/dashboard");
    };

    return (
        <div className="flex flex-col items-center min-h-[100dvh] bg-slate-50 dark:bg-slate-950 p-4 pt-16">
            <Card className="w-full max-w-sm shadow-md border-green-100 overflow-hidden">
                <div className="bg-green-500 h-2 w-full"></div>
                <CardContent className="pt-8 space-y-6 flex flex-col items-center">
                    <CheckCircle2 className="w-20 h-20 text-green-500" />
                    <h2 className="text-2xl font-bold text-center">Payment Sent!</h2>

                    <div className="w-full bg-slate-50 dark:bg-slate-900 border rounded-lg p-4 space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Amount</span>
                            <span className="font-bold">{txData.amount} {txData.token}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">To</span>
                            <span className="font-mono font-medium">{shortAddr}</span>
                        </div>
                        <div className="flex flex-col gap-1 border-t border-slate-200 dark:border-slate-800 pt-3">
                            <span className="text-muted-foreground">Transaction Hash</span>
                            <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-2 rounded border">
                                <span className="font-mono text-xs truncate max-w-[200px]">{shortHash}</span>
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyHash}>
                                    <Copy className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pb-6">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={handleDone}>
                        Done
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
