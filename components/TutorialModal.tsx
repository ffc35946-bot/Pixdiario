
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const steps = [
    {
      title: "1. Escolha um Evento",
      description: "Navegue pela Home e escolha uma das oportunidades disponíveis para receber um Pix.",
      icon: "🎯"
    },
    {
      title: "2. Solicite Participação",
      description: "O administrador analisará seu perfil e enviará o valor total do evento para sua conta cadastrada.",
      icon: "🚀"
    },
    {
      title: "3. Receba o Pix",
      description: "Confira seu banco! Você receberá 100% do valor do evento diretamente via Pix.",
      icon: "💰"
    },
    {
      title: "4. Devolva os 75%",
      description: "Para manter o sistema girando e sua conta ativa, você deve devolver 75% do valor recebido para a chave do administrador.",
      icon: "🔄"
    },
    {
      title: "5. Lucro Garantido",
      description: "Você fica com 25% de lucro líquido em cada operação e pode repetir o processo diariamente!",
      icon: "💎"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            <div className="p-8 sm:p-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-3xl mb-4 text-3xl">
                  ❓
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Como Funciona?</h2>
                <p className="text-slate-500 font-bold mt-2">Siga os passos para começar a lucrar.</p>
              </div>

              <div className="space-y-6">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-xl shadow-inner">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white text-lg">{step.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <button
                  onClick={onClose}
                  className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl text-lg hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all uppercase tracking-widest"
                >
                  Entendi, vamos lucrar!
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TutorialModal;
