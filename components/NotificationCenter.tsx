
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationCenter: React.FC = () => {
  const { currentUser, clearUserNotification } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const hasNotification = !!currentUser?.notification;

  // Fecha o menu ao mudar de rota ou ao redimensionar
  useEffect(() => {
    const handleResize = () => setIsOpen(false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 sm:p-2.5 rounded-xl transition-all relative z-50 ${
          isOpen 
            ? 'bg-emerald-600 text-white shadow-lg scale-110' 
            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {hasNotification && !isOpen && (
          <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full animate-bounce"></span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay para fechar ao clicar fora - ajustado para mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/20 backdrop-blur-[2px] z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
              exit={{ opacity: 0, y: 15, scale: 0.95, x: 20 }}
              className="fixed sm:absolute right-4 sm:right-0 top-20 sm:top-auto sm:mt-3 w-[calc(100vw-32px)] sm:w-80 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 z-50 overflow-hidden"
            >
              <div className="p-5 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Minhas Notificações</span>
                {hasNotification && (
                  <button 
                    onClick={() => { clearUserNotification(currentUser!.id); setIsOpen(false); }}
                    className="text-[9px] font-black text-emerald-600 uppercase hover:underline p-1"
                  >
                    Limpar
                  </button>
                )}
              </div>
              
              <div className="p-6">
                {hasNotification ? (
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 text-emerald-600 shadow-inner">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">Aviso do Admin</p>
                      <p className="text-xs font-bold text-slate-500 mt-1.5 leading-relaxed">{currentUser.notification}</p>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nenhuma notificação nova</p>
                  </div>
                )}
              </div>
              
              {/* Botão de fechar visível apenas no mobile para facilitar */}
              <div className="sm:hidden p-4 bg-slate-50 dark:bg-slate-800/50">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-3 bg-white dark:bg-slate-700 text-slate-600 dark:text-white font-black rounded-xl text-[10px] uppercase tracking-widest border border-slate-200 dark:border-slate-600"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
