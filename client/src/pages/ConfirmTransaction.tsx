import { useEffect, useState } from "react";
import { useTransactionFlow } from "../hooks/useTransactionFlow";
import { Card, CardHeader, CardContent, CardTitle, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";

export function ConfirmTransaction() {
    const { loadConfirmData, confirmAndSend, state, txHash, errorObj, resetFlow, txData } = useTransactionFlow();
    const [data, setData] = useState(null);

    useEffect(() => {
        // Protected route: Redirects to /scan if data is missing
        const d = loadConfirmData();
        if (d) {
            setData(d);
        }
    }, [loadConfirmData]);

    if (!data) return <div className="p-8 text-center text-muted-foreground">Redirecting...</div>;

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-xl">Confirm Payment</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 font-mono text-sm leading-relaxed">
                    <div className="bg-slate-50 p-4 rounded-md space-y-2 dark:bg-slate-900">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-muted-foreground">To:</span>
                            <span className="truncate max-w-[150px] font-semibold">{data.receiverWalletAddress}</span>
                        </div>
                        <div className="flex justify-between border-b py-2">
                            <span className="text-muted-foreground">Amount:</span>
                            <span className="font-semibold">{data.amount} {data.tokenSymbol}</span>
                        </div>
                        <div className="flex justify-between pt-2">
                            <span className="text-muted-foreground">Network:</span>
                            <span className="font-semibold uppercase">{data.network}</span>
                        </div>
                    </div>

                    <div className="text-center font-bold">
                        {state === "sending" && <span className="text-orange-500 animate-pulse">Processing Transaction...</span>}
                        {state === "success" && <span className="text-green-600 block mb-2">Success!</span>}
                        {state === "error" && <span className="text-red-500 block mb-2">{errorObj?.message || errorObj?.toString()}</span>}
                    </div>

                    {state === "success" && txHash && (
                        <div className="text-xs bg-green-50 text-green-800 p-2 break-all rounded border border-green-200">
                            TxHash: {txHash}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col gap-3">
                    {state === "confirming" || state === "error" ? (
                        <>
                            <Button
                                className="w-full"
                                onClick={confirmAndSend}
                                disabled={state === "sending"}
                            >
                                Confirm & Send
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={resetFlow}
                                disabled={state === "sending"}
                            >
                                Cancel
                            </Button>
                        </>
                    ) : state === "success" ? (
                        <Button className="w-full" variant="outline" onClick={resetFlow}>Scan Another</Button>
                    ) : null}
                </CardFooter>
            </Card>
        </div>
    );
}

export default ConfirmTransaction;
