
import React, { useState } from 'react';
import { Event } from '../types';
import { useAuth } from '../hooks/useAuth';
import { ADMIN_PIX_KEY } from '../constants';
import { useNavigate } from 'react-router-dom';
import LegalTermsModal from './LegalTermsModal';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const { currentUser, createRequest, requests } = useAuth();
  const navigate = useNavigate();

  // Verifica se existe um pedido ATIVO (não finalizado)
  const activeParticipation = requests.find(
    (r) => r.eventId === event.id && r.userId === currentUser?.id && r.status !== 'completed'
  );

  // Verifica se o usuário já completou este evento pelo menos uma vez
  const hasCompletedBefore = requests.some(
    (r) => r.eventId === event.id && r.userId === currentUser?.id && r.status === 'completed'
  );

  const handleParticipateClick = () => {
    if (activeParticipation) {
      navigate('/history');
      return;
    }
    setMessage(null);
    setTermsAccepted(false);
    setIsModalOpen(true);
  };

  const handleSendRequest = async () => {
      if (!currentUser) return;
      setIsLoading(true);
      setMessage(null);
      try {
          await createRequest(currentUser.id, event.id);
          setMessage({type: 'success', text: 'Pedido enviado!'});
          setTimeout(() => {
              setIsModalOpen(false);
              navigate('/history');
          }, 1500);
      } catch (err) {
          setMessage({type: 'error', text: err instanceof Error ? err.message : 'Erro.'});
      } finally {
          setIsLoading(false);
      }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl overflow-hidden flex flex-col border border-slate-100 dark:border-slate-800 transition-transform duration-300 hover:scale-[1.02]">
        <div className="relative">
          <img src={event.imageUrl} alt={event.title} className="w-full h-48 sm:h-56 object-cover" />
          <div className="absolute top-4 right-4 bg-emerald-600 text-white font-black px-3 py-1.5 rounded-xl shadow-lg text-sm sm:text-lg">
            R$ {event.value}
          </div>
          {hasCompletedBefore && !activeParticipation && (
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-emerald-600 font-black px-2 py-1 rounded-lg text-[10px] uppercase tracking-widest shadow-sm border border-emerald-100">
              ✓ Lucro Obtido
            </div>
          )}
        </div>
        <div className="p-5 sm:p-6 flex-grow flex flex-col justify-between">
          <div className="mb-6">
            <h3 className="text-xl sm:text-2xl font-black mb-2 text-slate-900 dark:text-white leading-tight uppercase tracking-tight truncate">{event.title}</h3>
            <p className="text-slate-500 text-xs sm:text-sm font-bold leading-relaxed line-clamp-2">{event.description}</p>
          </div>
          <button
            onClick={handleParticipateClick}
            className={`w-full font-black py-4 px-6 rounded-xl transition-all shadow-md active:scale-95 text-xs sm:text-sm uppercase tracking-widest ${
              activeParticipation 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/10'
            }`}
          >
            {activeParticipation ? 'Acompanhar no Histórico' : 'Quero Participar'}
          </button>
        </div>
      </div>

      <LegalTermsModal isOpen={isLegalModalOpen} onClose={() => setIsLegalModalOpen(false)} />

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white dark:bg-slate-900 rounded-t-[2rem] sm:rounded-[2.5rem] shadow-2xl p-6 sm:p-10 w-full max-w-xl border-t sm:border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl sm:text-3xl font-black mb-6 text-slate-900 dark:text-white uppercase tracking-tight">Regras de Inscrição</h2>
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-4 font-bold">
              <p>Ao participar do evento <span className="text-emerald-600">R$ {event.value}</span>:</p>
              <ul className="space-y-4 text-xs uppercase tracking-wider">
                  <li className="flex gap-3 items-start">
                    <span className="text-emerald-500 font-black">✓</span>
                    <span>Pagamento enviado após aprovação do admin.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-emerald-500 font-black">✓</span>
                    <span className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-slate-100 dark:border-slate-700 block w-full">
                      Você transfere <strong className="text-emerald-600">75%</strong> para:
                      <code className="block mt-2 font-black text-emerald-700 text-xs truncate select-all">{ADMIN_PIX_KEY}</code>
                    </span>
                  </li>
              </ul>
            </div>

            {message && (
                <div className={`mt-6 p-4 rounded-xl font-black text-xs text-center border-2 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                    {message.text}
                </div>
            )}

            <div className="mt-8">
              <label className="flex items-center cursor-pointer group">
                <input type="checkbox" className="sr-only peer" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} />
                <div className="w-7 h-7 border-2 border-slate-200 rounded-lg peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-all flex items-center justify-center">
                   <svg className="w-5 h-5 text-white opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
                </div>
                <div className="ml-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                   Li e aceito os <button type="button" onClick={() => setIsLegalModalOpen(true)} className="text-blue-600 underline hover:text-blue-700">termos de uso</button>
                </div>
              </label>
            </div>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button onClick={() => setIsModalOpen(false)} className="order-2 sm:order-1 flex-1 py-4 text-slate-400 font-black uppercase text-xs hover:text-slate-600 transition-colors">Cancelar</button>
              <button
                onClick={handleSendRequest}
                disabled={!termsAccepted || isLoading}
                className="order-1 sm:order-2 flex-[2] py-4 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 disabled:opacity-50 text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/10 active:scale-95 transition-all"
              >
                {isLoading ? 'Enviando...' : 'Confirmar Inscrição'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventCard;
