
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LegalTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LegalTermsModal: React.FC<LegalTermsModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            <div className="p-6 sm:p-10 max-h-[85vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Termos de Uso</h2>
                <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              <div className="prose dark:prose-invert max-w-none space-y-6 text-slate-600 dark:text-slate-400 font-bold text-sm leading-relaxed">
                <section>
                  <h4 className="text-slate-900 dark:text-white font-black uppercase text-xs tracking-widest mb-2">1. Natureza do Serviço</h4>
                  <p>O Pix Diário é uma plataforma de gestão de eventos bonificados. Ao participar, o usuário entende que se trata de uma operação de rotatividade financeira assistida.</p>
                </section>

                <section>
                  <h4 className="text-slate-900 dark:text-white font-black uppercase text-xs tracking-widest mb-2">2. Regra dos 75%</h4>
                  <p>Após a aprovação de sua inscrição, o administrador enviará 100% do valor do evento para sua chave PIX cadastrada. É obrigação irrevogável do usuário devolver 75% desse valor para a chave do administrador em até 30 minutos após o recebimento.</p>
                </section>

                <section>
                  <h4 className="text-slate-900 dark:text-white font-black uppercase text-xs tracking-widest mb-2">3. Penalidades</h4>
                  <p>O não cumprimento da devolução dos 75% resultará no banimento imediato e permanente do CPF, E-mail e Telefone em toda a rede Pix Diário, impossibilitando novos cadastros.</p>
                </section>

                <section>
                  <h4 className="text-slate-900 dark:text-white font-black uppercase text-xs tracking-widest mb-2">4. Prazos e Pagamentos</h4>
                  <p>Os pagamentos são processados por ordem de chegada e análise do administrador. A plataforma não garante lucros fixos sem a devida participação nos eventos ativos.</p>
                </section>

                <section className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                  <p className="text-emerald-700 dark:text-emerald-400 text-xs">Ao marcar "Li e aceito os termos", você declara estar ciente de todas as regras acima e concorda com a política de transparência da plataforma.</p>
                </section>
              </div>

              <div className="mt-10">
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-black rounded-xl uppercase tracking-widest text-xs"
                >
                  Fechar Documento
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LegalTermsModal;
