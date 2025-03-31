import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { ViewDemo } from "./pages/ViewDemo";
import { MolstarProvider } from "./context/MolstarContext";
import { ThemeProvider } from "./context/ThemeProvider";
import { LandingPage } from "./pages/LandingPage";
import { Layout } from "./components/Layout";
import { AboutPage } from "./pages/AboutPage";
import { DocsPage } from "./pages/DocsPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="theme">
        <BrowserRouter basename="cellim-viewer">
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route
                path="/demo"
                element={
                  <MolstarProvider>
                    <ViewDemo />
                  </MolstarProvider>
                }
              />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
