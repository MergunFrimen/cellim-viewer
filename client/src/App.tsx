import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AdminPage } from "./pages/AdminPage";
import { SearchPage } from "./pages/SearchPage";
import { ThemeProvider } from "./components/ThemeProvider";
import { LandingPage } from "./pages/LandingPage";
import { ScrollToTop } from "./components/ScrollToTop";
import { EntryDetailsPage } from "./pages/EntryDetailsPage";
import { EntryEditPage } from "./pages/EntryEditPage";

export function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="theme">
      <BrowserRouter basename="cellim-viewer">
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/entry/:id" element={<EntryDetailsPage />} />
            <Route path="/entry/:id/edit" element={<EntryEditPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
