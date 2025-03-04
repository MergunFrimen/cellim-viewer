import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AdminPage } from "./pages/AdminPage";
import { EntryDetailsPage } from "./pages/EntryDetailsPage";
import { LandingPage } from "./pages/LandingPage";

export function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/entry/:id" element={<EntryDetailsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
