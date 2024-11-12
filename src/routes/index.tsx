import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Spinner, Box } from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = lazy(() => import('@/components/Dashboard'));
const NetworkView = lazy(() => import('@/components/NetworkView'));
const MessageCenter = lazy(() => import('@/components/MessageCenter'));
const AdminPanel = lazy(() => import('@/components/AdminPanel'));
const Login = lazy(() => import('@/components/auth/Login'));

function LoadingSpinner() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
      <Spinner size="xl" />
    </Box>
  );
}

function ProtectedRoute({ children, requiredClearance = 1 }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.clearanceLevel < requiredClearance) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/network"
          element={
            <ProtectedRoute requiredClearance={2}>
              <NetworkView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute requiredClearance={2}>
              <MessageCenter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredClearance={5}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}