import React, { useEffect } from "react";
import { useLocation } from "wouter";
import { useTransaction } from "../context/TransactionContext";
import { Card, CardContent, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { XCircle } from "lucide-react";

export default function FailedPage() {
    const { error, setState } = useTransaction();
    const [, setLocation] = useLocation();

    useEffect(() => {
        if (!error) {
            setLocation("/dashboard");
        }
    }, [error, setLocation]);

    if (!error) return null;

    const handleRetry = () => {
        setState("confirming");
        setLocation("/tx/confirm");
    };

    const handleCancel = () => {
        setLocation("/tx/scan");
    };

    return (
        <div className="flex flex-col items-center min-h-[100dvh] bg-slate-50 dark:bg-slate-950 p-4 pt-16">
            <Card className="w-full max-w-sm shadow-md border-red-100 overflow-hidden">
                <div className="bg-red-500 h-2 w-full"></div>
                <CardContent className="pt-8 space-y-4 flex flex-col items-center">
                    <XCircle className="w-20 h-20 text-red-500" />
                    <h2 className="text-2xl font-bold text-center">Transaction Failed</h2>

                    <div className="w-full bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-200 border border-red-100 dark:border-red-900 rounded-lg p-4 text-sm text-center">
                        {error || "An unknown error occurred while processing your transaction."}
                    </div>
                </CardContent>
                <CardFooter className="flex gap-3 pb-6">
                    <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleRetry}>
                        Try Again
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
