import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AdminPage } from "./pages/AdminPage";
import { EntryDetailsPage } from "./pages/EntryDetailsPage";
import { SearchPage } from "./pages/SearchPage";
import { ThemeProvider } from "./components/ThemeProvider";
import { LandingPage } from "./pages/LandingPage";
import { EntryDetailsPage2 } from "./pages/EntryDetailsPage2";
import { EntryDetailsPage3 } from "./pages/EntryDetailsPage3";
import { EntryDetailsPage4 } from "./pages/EntryDetailsPage4";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/entry/:id" element={<EntryDetailsPage />} />
            <Route path="/entry/v2/:id" element={<EntryDetailsPage2 />} />
            <Route path="/entry/v3/:id" element={<EntryDetailsPage3 />} />
            <Route path="/entry/v4/:id" element={<EntryDetailsPage4 />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
