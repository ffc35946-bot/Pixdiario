
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddPixPage from './pages/AddPixPage';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import SettingsPage from './pages/SettingsPage';
import UserRequestsPage from './pages/UserRequestsPage';
import MaintenancePage from './pages/MaintenancePage';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { useAuth } from './hooks/useAuth';

const MaintenanceWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMaintenanceMode, isAdmin } = useAuth();
  const location = useLocation();

  // Rotas essenciais para o Admin conseguir desativar a manutenção
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // BLOQUEIO TOTAL: Se estiver em manutenção e não for o Admin autenticado
  if (isMaintenanceMode && !isAdmin && !isAuthPage) {
    return <MaintenancePage />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <MaintenanceWrapper>
        <div className="min-h-screen flex flex-col text-slate-800 dark:text-slate-200">
          <Header />
          <main className="flex-grow container mx-auto p-4 md:p-6">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route 
                path="/add-pix" 
                element={
                  <ProtectedRoute>
                    <AddPixPage />
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
                path="/history" 
                element={
                  <ProtectedRoute>
                    <UserRequestsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </MaintenanceWrapper>
    </HashRouter>
  );
};

export default App;
