import { Routes, Route } from "react-router-dom";
import LoginPage from "@pages/LoginPage";
import HomePage from "@pages/HomePage";
import WorkersPage from "@pages/WorkersPage";
import ProductionPage from "@pages/ProductionPage";
import ReportsPage from "@pages/ReportsPage";
import StationPage from "@pages/StationPage";
import SettingsPage from "@pages/SettingsPage";
function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/employees" element={<WorkersPage />} />
      <Route path="/production" element={<ProductionPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/station" element={<StationPage />} />
      <Route path="/Settings" element={<SettingsPage />} />
    </Routes>
  );
}

export default App;
