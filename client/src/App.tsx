import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { WalletProvider } from "@/lib/wallet";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import OpenPayPage from "@/pages/open-pay";
import PayPage from "@/pages/pay";
import NotFound from "@/pages/not-found";
import SendPage from "@/pages/SendPage";
import ConfirmPage from "@/pages/ConfirmPage";
import ProcessingPage from "@/pages/ProcessingPage";
import SuccessPage from "@/pages/SuccessPage";
import FailedPage from "@/pages/FailedPage";
import { GlobalErrorBoundary } from "@/components/ErrorBoundary";

function Router() {
  return (
    <GlobalErrorBoundary>
      <Switch>
        <Route path="/" component={LoginPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/tx/send" component={SendPage} />
        <Route path="/tx/confirm" component={ConfirmPage} />
        <Route path="/tx/processing" component={ProcessingPage} />
        <Route path="/tx/success" component={SuccessPage} />
        <Route path="/tx/failed" component={FailedPage} />
        <Route path="/open/pay/:code" component={OpenPayPage} />
        <Route path="/pay/:code" component={PayPage} />
        <Route component={NotFound} />
      </Switch>
    </GlobalErrorBoundary>
  );
}

import { TransactionProvider } from "@/context/TransactionContext";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WalletProvider>
            <TransactionProvider>
              <Toaster />
              <Router />
            </TransactionProvider>
          </WalletProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
