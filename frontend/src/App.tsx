import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { MainLayout } from "./components/layout/MainLayout";
import { AboutPage } from "./pages/AboutPage";
import { DocsPage } from "./pages/DocsPage";
import { EntryDetailPage } from "./pages/EntryDetailsPage";
import { LandingPage } from "./pages/LandingPage";
import { NewEntryPage } from "./pages/NewEntryPage";

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MainLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/entries/new" element={<NewEntryPage />} />
          <Route path="/entries/:id" element={<EntryDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
