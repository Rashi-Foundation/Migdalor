import { Routes, Route } from "react-router-dom";
import LoginPage from "@pages/LoginPage";
import HomePage from "@pages/HomePage";
import WorkersPage from "@pages/WorkersPage";
import ProductionPage from "@pages/ProductionPage";
import ReportsPage from "@pages/ReportsPage";
import StationPage from "@pages/StationPage";
import SettingsPage from "@pages/SettingsPage";
import UserManualPage from "@pages/UserManualPage";
import DeveloperManualPage from "@pages/DeveloperManualPage";
import ProtectedRoute from "@components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/employees"
        element={
          <ProtectedRoute>
            <WorkersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/production"
        element={
          <ProtectedRoute>
            <ProductionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/station"
        element={
          <ProtectedRoute>
            <StationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manual"
        element={
          <ProtectedRoute>
            <UserManualPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dev-manual"
        element={
          <ProtectedRoute>
            <DeveloperManualPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
