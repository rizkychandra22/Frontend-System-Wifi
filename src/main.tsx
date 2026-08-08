import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import App from "./App";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
    },
  },
});

function GlobalErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const message =
    error instanceof Error
      ? error.message
      : "Halaman sementara tidak dapat ditampilkan dengan benar. Silakan coba muat ulang.";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-gradient-blue">!</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Terjadi Kesalahan Sistem
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {message}
        </p>
        <div className="mt-6">
          <button
            onClick={resetErrorBoundary}
            className="inline-flex items-center justify-center rounded-full bg-gradient-blue px-5 py-2 text-sm font-semibold text-primary-foreground shadow-blue transition-transform hover:scale-105 active:scale-95"
          >
            Muat Ulang Halaman
          </button>
        </div>
      </div>
    </div>
  );
}

const container = document.getElementById("root")!;
const root = (container as any).__reactRoot || ReactDOM.createRoot(container);
(container as any).__reactRoot = root;

root.render(
  <React.StrictMode>
    <ErrorBoundary
      FallbackComponent={GlobalErrorFallback}
      onReset={() => window.location.reload()}
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
