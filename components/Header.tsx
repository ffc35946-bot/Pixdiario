
import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import TutorialModal from './TutorialModal';
import NotificationCenter from './NotificationCenter';

const Header: React.FC = () => {
  const { isAuthenticated, isAdmin, currentUser, logout } = useAuth();
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair da sua conta?')) {
      logout();
      navigate('/login', { replace: true });
    }
  };

  const MoneyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-500"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  );

  const UserIcon = () => (
    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-600 overflow-hidden hover:border-emerald-500 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    </div>
  );

  return (
    <>
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-slate-900/90">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <NavLink to="/" className="flex items-center gap-2">
              <MoneyIcon />
              <span className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tighter whitespace-nowrap uppercase">PIX DIÁRIO</span>
            </NavLink>
            
            <nav className="flex items-center gap-2 sm:gap-4">
              {isAuthenticated && (
                <>
                  <div className="flex flex-col items-end mr-1 hidden lg:flex">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuário Ativo</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      Olá, {isAdmin ? 'ADMIN' : currentUser?.name.split(' ')[0]}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-2">
                    <NotificationCenter />
                    
                    <button
                      onClick={() => setIsTutorialOpen(true)}
                      className="p-2 sm:p-2.5 rounded-xl text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 transition-all font-black text-lg"
                      title="Como funciona?"
                    >
                      ?
                    </button>

                    <NavLink 
                      to="/history" 
                      className={({isActive}) => `p-2 sm:p-2.5 rounded-xl transition-all ${isActive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                      title="Histórico"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="9"/></svg>
                    </NavLink>

                    {isAdmin && (
                      <NavLink 
                        to="/admin" 
                        className={({isActive}) => `px-3 sm:px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                      >
                        <span className="hidden sm:inline">Admin</span>
                        <span className="sm:hidden text-[8px]">ADM</span>
                      </NavLink>
                    )}

                    <Link to="/settings" className="flex-shrink-0 ml-1">
                      <UserIcon />
                    </Link>

                    {/* Botão de Logout Rápido */}
                    <button 
                      onClick={handleLogout}
                      className="ml-1 p-2 sm:p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                      title="Sair da Conta"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                    </button>
                  </div>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      <TutorialModal isOpen={isTutorialOpen} onClose={() => setIsTutorialOpen(false)} />
    </>
  );
};

export default Header;
