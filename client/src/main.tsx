// src/main.tsx
import { createRoot } from "react-dom/client";
import { QueryClient } from "@tanstack/react-query";
import { App } from "./App.tsx";

import "./index.css";
import { MainModel } from "./models/main-model.ts";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  // <QueryClientProvider client={queryClient}>
    <App />
  // </QueryClientProvider>
  // </StrictMode>,
);
