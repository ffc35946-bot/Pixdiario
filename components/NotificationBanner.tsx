
import React from 'react';

interface NotificationBannerProps {
  message: string;
  onDismiss: () => void;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ message, onDismiss }) => {
  return (
    <div className="bg-emerald-600 text-white p-5 rounded-[1.5rem] shadow-2xl mb-6 relative overflow-hidden group" role="alert">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
        <svg className="h-24 w-24" fill="currentColor" viewBox="0 0 20 20"><path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm-1-11a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm1-3a1 1 0 0 0-2 0v2a1 1 0 1 0 2 0V6z"/></svg>
      </div>
      <div className="flex items-center gap-4 relative z-10">
        <div className="bg-white/20 p-2 rounded-xl flex-shrink-0">
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div className="flex-grow">
          <p className="font-black text-sm uppercase tracking-widest mb-1">Atenção!</p>
          <p className="text-sm font-bold text-white/90 leading-relaxed">{message}</p>
        </div>
        <button onClick={onDismiss} className="p-2 hover:bg-white/10 rounded-xl transition-colors self-start">
          <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationBanner;
