import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/common/ScrollToTop";
import { MainLayout } from "./components/layout/Layout";
import { AboutPage } from "./pages/AboutPage";
import { DocsPage } from "./pages/DocsPage";
import { LandingPage } from "./pages/LandingPage";
import { NewEntryPage } from "./pages/NewEntryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { EntryDetailsPage } from "./pages/EntryDetailsPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import TaskProgressComponent from "./components/TaskRunner";
import FileUpload from "./components/upload/FileUpload";

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MainLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/entries/new" element={<NewEntryPage />} />
          <Route path="/entries/:entryId" element={<EntryDetailsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/upload" element={<FileUpload />} />
          <Route path="/tasks" element={<TaskProgressComponent />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}
