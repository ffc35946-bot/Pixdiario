
import React from 'react';

const EventSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl overflow-hidden flex flex-col border border-slate-100 dark:border-slate-800 animate-pulse">
      {/* Imagem Placeholder */}
      <div className="relative w-full h-48 sm:h-56 bg-slate-200 dark:bg-slate-800">
        <div className="absolute top-4 right-4 w-20 h-8 bg-slate-300 dark:bg-slate-700 rounded-xl"></div>
      </div>
      
      {/* Conteúdo Placeholder */}
      <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between">
        <div className="mb-6 space-y-3">
          {/* Título */}
          <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4"></div>
          {/* Descrição */}
          <div className="space-y-2">
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg w-full"></div>
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-lg w-5/6"></div>
          </div>
        </div>
        
        {/* Botão Placeholder */}
        <div className="w-full h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
      </div>
    </div>
  );
};

export default EventSkeleton;
