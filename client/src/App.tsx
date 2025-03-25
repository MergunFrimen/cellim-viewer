import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { LandingPage } from "./pages/LandingPage";
import { ScrollToTop } from "./components/ScrollToTop";
import { EntriesListPage } from "./pages/EntriesListPage";
import { CreateEntryPage } from "./pages/CreateEntryPage";
import { EditEntryPage } from "./pages/EditEntryPage";
import { EntryDetailPage } from "./pages/EntryDetailsPage";

export function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="theme">
      <BrowserRouter basename="cellim-viewer">
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/entries" element={<EntriesListPage />} />
            <Route path="/entries/new" element={<CreateEntryPage />} />
            <Route path="/entries/:id" element={<EntryDetailPage />} />
            <Route path="/entries/:id/edit" element={<EditEntryPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}