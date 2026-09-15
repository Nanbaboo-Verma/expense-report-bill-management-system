import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ReportsProvider } from "./context/ReportsContext";
import ReportsPage from "./pages/ReportsPage";
import ReportDetailsPage from "./pages/ReportDetailsPage";
import BillPreviewPage from "./pages/BillPreviewPage";
import "./App.css";

function App() {
  return (
    <ReportsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ReportsPage />} />
          <Route path="/report/:id" element={<ReportDetailsPage />} />
          <Route
            path="/report/:reportId/bill/:billId"
            element={<BillPreviewPage />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ReportsProvider>
  );
}

export default App;
