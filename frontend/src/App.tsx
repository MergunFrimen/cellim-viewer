import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { MainLayout } from "./components/layout/Layout";
import { LandingPage } from "./pages/LandingPage";
import EntryCreatePage, { NewEntryPage } from "./pages/CreateEntryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { EntryDetailsPage } from "./pages/EntryDetailsPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MainLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/entries/new" element={<EntryCreatePage />} />
          <Route path="/entries/:entryId" element={<EntryDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
