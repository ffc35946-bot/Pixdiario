
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
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

// Wrapper para gerenciar a exibição da tela de manutenção de forma inteligente
const MaintenanceWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isMaintenanceMode, isAdmin } = useAuth();
  const location = useLocation();

  // Permite acesso às telas de autenticação mesmo em manutenção para evitar que o Admin fique trancado fora do sistema
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Se o modo manutenção estiver ativo e o usuário NÃO for administrador, 
  // bloqueamos todas as páginas exceto a de Login (para permitir login do admin)
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
              {/* Redireciona qualquer rota inválida para a Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Analytics />
        </div>
      </MaintenanceWrapper>
    </HashRouter>
  );
};

export default App;
