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
import WorkPage from './components/pages/WorkPage/WorkPage';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/works" element={<WorkPage />} />
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;