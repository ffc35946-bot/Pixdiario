
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import EventCard from '../components/EventCard';
import EventSkeleton from '../components/EventSkeleton';
import NotificationBanner from '../components/NotificationBanner';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TutorialModal from '../components/TutorialModal';

const HomePage: React.FC = () => {
  const { events, currentUser, clearUserNotification, requests } = useAuth();
  const navigate = useNavigate();
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Ordena eventos do mais recente para o mais antigo
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [events]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    const tutorialSeen = localStorage.getItem(`tutorial_seen_${currentUser?.id}`);
    if (!tutorialSeen && currentUser) setIsFirstVisit(true);
    return () => clearTimeout(timer);
  }, [currentUser]);

  const handleCloseTutorial = () => {
    setIsFirstVisit(false);
    localStorage.setItem(`tutorial_seen_${currentUser?.id}`, 'true');
  };

  const handleDismissNotification = () => {
    if (currentUser) clearUserNotification(currentUser.id);
  };

  const pendingConfirmation = requests.find(r => r.userId === currentUser?.id && r.status === 'paid');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="space-y-6 sm:space-y-8 py-2">
      <AnimatePresence>
        {currentUser?.notification && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <NotificationBanner message={currentUser.notification} onDismiss={handleDismissNotification} />
          </motion.div>
        )}
      </AnimatePresence>

      <TutorialModal isOpen={isFirstVisit} onClose={handleCloseTutorial} />

      {pendingConfirmation && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-600 p-5 rounded-[1.5rem] shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-4 border-2 border-emerald-400/30">
          <div className="flex items-center gap-4 text-center md:text-left flex-col md:flex-row">
             <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <div>
                <h2 className="text-lg font-black">PIX Disponível!</h2>
                <p className="text-emerald-50/80 font-bold text-[10px] uppercase tracking-widest">Confirme o envio no histórico para continuar.</p>
             </div>
          </div>
          <button onClick={() => navigate('/history')} className="w-full md:w-auto px-6 py-3 bg-white text-emerald-600 font-black rounded-xl text-xs uppercase tracking-widest shadow-lg">Confirmar</button>
        </motion.div>
      )}

      <div className="flex items-center justify-between px-1">
        <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">
          Oportunidades <span className="text-emerald-500">Hoje</span>
        </h1>
        <div className="flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full">
           <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
           <span className="text-[8px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest">Ao Vivo</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, idx) => <EventSkeleton key={idx} />)
        ) : sortedEvents.length > 0 ? (
          <motion.div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" variants={containerVariants} initial="hidden" animate="visible">
            {sortedEvents.map(event => (
              <motion.div key={event.id} variants={itemVariants}>
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800">
            <p className="text-slate-400 font-black uppercase tracking-widest text-sm">Aguardando novos eventos...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
