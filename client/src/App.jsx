import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/context/AuthContext';
import './App.css';
import HomePage from './components/pages/HomePage/HomePage';
import UserCabinet from './components/UserCabinet/UserCabinet';
import AdminPanel from './components/AdminPanel/AdminPanel';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import CatalogPage from './components/pages/CatalogPage/CatalogPage';
import ServicesPage from './components/pages/Services/ServicesPage';
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy';
import { ToastProvider } from './components/context/ToastContext';
import ManagerPanel from './components/ManagerPanel/ManagerPanel';
import WorkPage from './components/pages/WorkPage/WorkPage';
import { ChatProvider } from './components/context/ChatContext';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Загрузка...</div>;
  }

  const getDashboardRoute = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'manager') return '/manager';
    return '/cabinet';
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/works" element={<WorkPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route 
        path="/cabinet" 
        element={
          <PrivateRoute>
            <UserCabinet />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <PrivateRoute requireAdmin={true}>
            <AdminPanel />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/manager" 
        element={
          <PrivateRoute requireAdmin={false}>
            {user?.role === 'manager' || user?.role === 'admin' ? <ManagerPanel /> : <Navigate to="/cabinet" />}
          </PrivateRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <ChatProvider>
        <Router>
          <AppRoutes />
        </Router>
        </ChatProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;