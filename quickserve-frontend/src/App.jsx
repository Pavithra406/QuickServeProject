import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import Booking from "./pages/Booking";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>

      {/* Default Route */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Customer Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Booking Page (Customer Only) */}
      <Route
        path="/booking"
        element={
          <ProtectedRoute allowedRole="CUSTOMER">
            <Booking />
          </ProtectedRoute>
        }
      />

      {/* Provider Dashboard */}
      <Route
        path="/provider-dashboard"
        element={
          <ProtectedRoute allowedRole="PROVIDER">
            <ProviderDashboard />
          </ProtectedRoute>
        }
      />

      {/* Unknown Routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
}

export default App;
