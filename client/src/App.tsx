import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { ViewDemo } from "./pages/ViewDemo";
import { MolstarProvider } from "./context/MolstarContext";
import { ThemeProvider } from "./context/ThemeProvider";
import { Toaster } from "./components/ui/sonner";
import { LandingPage } from "./pages/LandingPage";
import { Layout } from "./components/Layout";
import { AboutPage } from "./pages/AboutPage";
import { DocsPage } from "./pages/DocsPage";
import { EntryCreateProvider } from "./context/EntryCreateContext";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <Toaster />
      <BrowserRouter basename="cellim-viewer">
        <ScrollToTop />
        <EntryCreateProvider>
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
        </EntryCreateProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
