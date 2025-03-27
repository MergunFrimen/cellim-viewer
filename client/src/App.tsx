import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { ViewDemo } from "./pages/ViewDemo";
import { MolstarProvider } from "./context/MolstarContext";
import { ThemeProvider } from "./components/theme/ThemeProvider";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <BrowserRouter basename="cellim-viewer">
        <ScrollToTop />
        {/* <Layout> */}
        <Routes>
          {/* <Route path="/" element={<LandingPage />} />
            <Route path="/entries" element={<EntriesListPage />} />
            <Route path="/entries/new" element={<CreateEntryPage />} />
            <Route path="/entries/:id" element={<EntryDetailPage />} />
            <Route path="/entries/:id/edit" element={<EditEntryPage />} />
            <Route path="/share/:uuid" element={<EntryDetailPage />} />
            <Route path="/edit/:uuid" element={<EditEntryPage />} /> */}
          <Route
            path="/"
            element={
              <MolstarProvider>
                <ViewDemo />
              </MolstarProvider>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {/* </Layout> */}
      </BrowserRouter>
    </ThemeProvider>
  );
}
