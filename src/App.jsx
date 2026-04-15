import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import KycForm from './pages/KycForm';
import ProtectedRoute from './components/ProtectedRoute';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/kyc"
        element={
          <ProtectedRoute>
            <KycForm />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
