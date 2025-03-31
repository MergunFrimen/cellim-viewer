import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ScrollToTop } from "./components/ScrollToTop";
import { MolstarProvider } from "./context/MolstarContext";
import { ThemeProvider } from "./context/ThemeProvider";
import { AboutPage } from "./pages/AboutPage";
import { DocsPage } from "./pages/DocsPage";
import { EntryDetailPage } from "./pages/EntryDetailsPage";
import { LandingPage } from "./pages/LandingPage";
import { ViewDemo } from "./pages/ViewDemo";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="theme">
        <MolstarProvider>
          <BrowserRouter basename="cellim-viewer">
            <ScrollToTop />
            <Layout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/entries/:id" element={<EntryDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/docs" element={<DocsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/demo" element={<ViewDemo />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </MolstarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
