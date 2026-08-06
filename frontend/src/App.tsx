import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import LoginPage from './pages/LoginPage';
import OverviewPage from './pages/OverviewPage';
import RegionsPage from './pages/RegionsPage';
import FarmsPage from './pages/FarmsPage';
import PlantingsPage from './pages/PlantingsPage';
import HarvestsPage from './pages/HarvestsPage';
import SeedsPage from './pages/SeedsPage';
import FinancePage from './pages/FinancePage';
import UsersPage from './pages/UsersPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div></div>;
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppLayout() {
  return (
    <div className="flex min-h-screen" dir="rtl">
      <MobileNav />
      <Sidebar />
      <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-6xl overflow-x-auto">
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/regions" element={<RegionsPage />} />
          <Route path="/farms" element={<FarmsPage />} />
          <Route path="/plantings" element={<PlantingsPage />} />
          <Route path="/harvests" element={<HarvestsPage />} />
          <Route path="/seeds" element={<SeedsPage />} />
          <Route path="/finance" element={<FinancePage />} />
          <Route path="/users" element={<AdminRoute><UsersPage /></AdminRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
