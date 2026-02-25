import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useTransaction } from "../context/TransactionContext";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Coins } from "lucide-react";

export default function ConfirmPage() {
    const { txData, setState, sendTransaction } = useTransaction();
    const [, setLocation] = useLocation();

    useEffect(() => {
        if (!txData) {
            setLocation("/tx/scan");
        } else {
            setState("confirming");
        }
    }, [txData, setLocation, setState]);

    if (!txData) return null;

    const handleConfirm = async () => {
        console.log("CONFIRM_CLICKED");
        await sendTransaction();
    };

    const shortAddr = `${txData.receiverAddress.slice(0, 6)}...${txData.receiverAddress.slice(-4)}`;

    return (
        <div className="flex flex-col items-center min-h-[100dvh] bg-slate-50 dark:bg-slate-950 p-4 pt-16">
            <Card className="w-full max-w-sm shadow-md">
                <CardContent className="pt-6 space-y-6">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            <Coins size={32} />
                        </div>
                        <h2 className="text-2xl font-bold">{txData.amount} {txData.token}</h2>
                        <span className="text-sm px-2 py-1 bg-slate-100 rounded text-slate-600 uppercase">
                            {txData.network}
                        </span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900 border rounded-lg p-4 space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">To</span>
                            <span className="font-mono font-medium">{shortAddr}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Network</span>
                            <span className="font-medium capitalize">{txData.network}</span>
                        </div>
                        {txData.memo && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Memo</span>
                                <span className="font-medium truncate max-w-[120px]">{txData.memo}</span>
                            </div>
                        )}
                        <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-3">
                            <span className="text-muted-foreground">Est. Gas Fee</span>
                            <span className="font-medium">~0.001 ETH</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex gap-3 pb-6">
                    <Button variant="outline" className="flex-1" onClick={() => setLocation("/tx/scan")}>
                        Cancel
                    </Button>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleConfirm}>
                        Confirm
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
