
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const steps = [
    {
      title: "Escolha",
      description: "Selecione um evento disponível na tela inicial.",
      icon: "🎯",
      color: "bg-blue-500"
    },
    {
      title: "Participe",
      description: "O Admin aprova e envia 100% do valor para você.",
      icon: "🚀",
      color: "bg-purple-500"
    },
    {
      title: "Receba",
      description: "Dinheiro direto na sua conta via Pix.",
      icon: "💰",
      color: "bg-emerald-500"
    },
    {
      title: "Devolva 75%",
      description: "Retorne a parte do admin para liberar novos ganhos.",
      icon: "🔄",
      color: "bg-orange-500"
    },
    {
      title: "Lucro Real",
      description: "Fique com 25% limpo e repita todo dia!",
      icon: "💎",
      color: "bg-pink-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl overflow-hidden border-t sm:border border-slate-200 dark:border-slate-800"
          >
            {/* Barra de arraste visual para mobile */}
            <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mt-4 sm:hidden" />

            <div className="p-6 sm:p-10">
              <div className="text-center mb-10">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                  Guia <span className="text-emerald-500">Rápido</span>
                </h2>
                <div className="h-1 w-12 bg-emerald-500 mx-auto mt-2 rounded-full" />
              </div>

              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8 relative"
              >
                {/* Linha conectora vertical */}
                <div className="absolute left-[19px] top-2 bottom-10 w-0.5 bg-slate-100 dark:bg-slate-800 -z-10" />

                {steps.map((step, idx) => (
                  <motion.div 
                    key={idx} 
                    variants={itemVariants}
                    className="flex gap-5 items-start group"
                  >
                    <div className={`flex-shrink-0 w-10 h-10 ${step.color} rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-current/20 border-4 border-white dark:border-slate-900 z-10 transition-transform group-hover:scale-110`}>
                      {step.icon}
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-1">{step.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs font-bold leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <div className="mt-12">
                <button
                  onClick={onClose}
                  className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl text-sm hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.2em] shadow-xl"
                >
                  Vamos começar
                </button>
                <p className="text-center text-[10px] text-slate-400 font-bold uppercase mt-4 tracking-widest">Toque fora para fechar</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TutorialModal;
