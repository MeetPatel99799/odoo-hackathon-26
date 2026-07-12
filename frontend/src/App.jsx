import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VehicleRegistry from './pages/VehicleRegistry';
import Drivers from './pages/Drivers';
import TripDispatcher from './pages/TripDispatcher';
import Maintenance from './pages/Maintenance';
import FuelExpenses from './pages/FuelExpenses';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import { useAuth } from './context/AuthContext';

const routeToItem = {
  '/': 'Dashboard',
  '/fleet': 'Fleet',
  '/drivers': 'Drivers',
  '/trips': 'Trips',
  '/maintenance': 'Maintenance',
  '/fuel': 'Fuel & Expenses',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

function UnauthorizedToast({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      className="fixed top-6 right-6 z-50 max-w-md bg-zinc-900/95 border border-amber-500/60 text-amber-300 px-4 py-3 rounded-lg shadow-xl shadow-black/40 backdrop-blur-sm"
      role="alert"
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold tracking-wide">{message}</span>
        <button
          type="button"
          onClick={onDismiss}
          className="ml-2 text-amber-400/80 hover:text-amber-200 text-xs"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

function Layout({ children }) {
  const { user, permissions } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const activeItem = routeToItem[location.pathname] || '';
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (location.state?.unauthorizedToast) {
      setToastMessage(location.state.unauthorizedToast);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.unauthorizedToast, location.pathname, navigate]);

  useEffect(() => {
    if (!toastMessage) return undefined;
    const timer = setTimeout(() => setToastMessage(''), 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  return (
    <div className="flex h-screen bg-background text-text overflow-hidden">
      <Sidebar activeItem={activeItem} permissions={permissions} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar user={user} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
      <UnauthorizedToast message={toastMessage} onDismiss={() => setToastMessage('')} />
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/fleet"
        element={
          <ProtectedRoute module="vehicles">
            <Layout><VehicleRegistry /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/drivers"
        element={
          <ProtectedRoute module="drivers">
            <Layout><Drivers /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips"
        element={
          <ProtectedRoute module="trips">
            <Layout><TripDispatcher /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/maintenance"
        element={
          <ProtectedRoute module="fleet">
            <Layout><Maintenance /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/fuel"
        element={
          <ProtectedRoute module="expenses">
            <Layout><FuelExpenses /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
            <Layout><Analytics /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout><Settings /></Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
