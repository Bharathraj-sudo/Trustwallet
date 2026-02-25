import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
                    <div className="bg-red-50 text-red-600 border border-red-200 p-6 rounded-lg max-w-sm text-center">
                        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
                        <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
                        <p className="text-sm">{this.state.error?.message}</p>
                        <button
                            className="mt-6 w-full bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700"
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.href = "/";
                            }}
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
