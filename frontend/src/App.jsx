import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Departments from "./pages/Departments.jsx";
import Employees from "./pages/Employees.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import { getStoredUser } from "./services/auth.js";

function RequireAdmin() {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === "ADMIN" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}

function RequireUser() {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return user.role === "USER" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace />
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<RequireAdmin />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/users" element={null} />
      </Route>
      <Route element={<RequireUser />}>
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}