import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import { App } from "./App.tsx";
import { MolstarProvider } from "./contexts/MolstarProvider.tsx";
import { ThemeProvider } from "./contexts/ThemeProvider.tsx";

import "./index.css";
import { AuthProvider } from "./contexts/AuthProvider.tsx";
import { client } from "./lib/client/client.gen.ts";

client.setConfig({
  credentials: "include",
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="theme">
        <MolstarProvider>
          <App />
        </MolstarProvider>
      </ThemeProvider>
    </QueryClientProvider>
    <Toaster />
  </AuthProvider>,
  // </StrictMode>,
);
