import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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

function Layout({ children }) {
  const { user, permissions } = useAuth();
  const location = useLocation();
  const activeItem = routeToItem[location.pathname] || '';

  return (
    <div className="flex h-screen bg-background text-text overflow-hidden">
      <Sidebar activeItem={activeItem} permissions={permissions} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar user={user} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Login page — no layout */}
      <Route path="/login" element={<Login />} />

      {/* All other pages use the Layout shell.
          Integration will wrap each route in <ProtectedRoute> as pages are built. */}
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      <Route path="/fleet" element={<Layout><VehicleRegistry /></Layout>} />
      <Route path="/drivers" element={<Layout><Drivers /></Layout>} />
      <Route path="/trips" element={<Layout><TripDispatcher /></Layout>} />
      <Route path="/maintenance" element={<Layout><Maintenance /></Layout>} />
      <Route path="/fuel" element={<Layout><FuelExpenses /></Layout>} />
      <Route path="/analytics" element={<Layout><Analytics /></Layout>} />
      <Route path="/settings" element={<Layout><Settings /></Layout>} />
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
