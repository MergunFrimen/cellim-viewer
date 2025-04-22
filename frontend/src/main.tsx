import { client } from "@/client/client.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import { App } from "./App.tsx";
import { MolstarProvider } from "./context/MolstarContext.tsx";
import { ThemeProvider } from "./context/ThemeProvider.tsx";

import "./index.css";

client.setConfig({
  auth: () => "TOKEN",
});

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="theme">
        <MolstarProvider>
          <App />
        </MolstarProvider>
      </ThemeProvider>
    </QueryClientProvider>
    <Toaster />
  </StrictMode>,
);
