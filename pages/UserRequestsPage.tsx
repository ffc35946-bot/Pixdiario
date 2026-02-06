
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { ADMIN_PIX_KEY } from '../constants';

const UserRequestsPage: React.FC = () => {
  const { requests, currentUser, confirmUserSendback } = useAuth();
  const navigate = useNavigate();

  const userRequests = requests.filter(r => r.userId === currentUser?.id);

  const handleConfirmSendback = (requestId: string) => {
    if(window.confirm('Confirma que já enviou os 75%? Sua solicitação será validada pelo admin.')) {
      confirmUserSendback(requestId);
      // O status muda para 'paid', o que aciona o feedback visual no Histórico
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Chave PIX copiada!');
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-6 sm:space-y-8">
      <div className="flex items-center gap-3 sm:gap-4 px-2">
        <button 
          onClick={() => navigate('/')} 
          className="p-2 sm:p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border-2 border-slate-100 dark:border-slate-700 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Histórico</h1>
          <p className="text-slate-500 font-semibold text-xs sm:text-sm mt-0.5">Acompanhe seu fluxo financeiro.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl border border-slate-50 dark:border-slate-800 overflow-hidden">
        {userRequests.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {userRequests.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(req => (
              <div key={req.id} className="p-5 sm:p-8 flex flex-col gap-5 hover:bg-slate-50/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black tracking-widest uppercase border ${
                        req.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 border-transparent'
                      }`}>
                        {req.status === 'completed' ? 'OK' : 'Ativo'}
                      </span>
                      <span className="text-slate-400 text-[10px] font-bold">{new Date(req.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <h3 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white mb-0.5 leading-tight">{req.eventTitle}</h3>
                    <p className="text-emerald-600 font-black text-base sm:text-lg">R$ {req.eventValue}</p>
                  </div>
                  
                  <div className="flex items-center sm:flex-col sm:items-end gap-2">
                     <div className={`flex-1 sm:flex-none text-center px-4 py-2 rounded-xl border-2 font-black text-[10px] uppercase tracking-wider ${
                       req.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                       req.status === 'waiting_receipt' ? 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse' :
                       req.status === 'paid' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                       'bg-emerald-50 text-emerald-600 border-emerald-100'
                     }`}>
                       {req.status === 'pending' ? 'Análise' : 
                        req.status === 'waiting_receipt' ? 'Aguardando 75%' : 
                        req.status === 'paid' ? 'Validando 75%' : 
                        'Concluído'}
                     </div>
                  </div>
                </div>

                {req.status === 'waiting_receipt' && (
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-4 sm:p-6 rounded-2xl border-2 border-blue-100 dark:border-blue-900/50 space-y-4 shadow-inner">
                    <p className="text-blue-800 dark:text-blue-300 font-bold text-xs sm:text-sm leading-relaxed">
                      O Admin aprovou! Você deve ter recebido o Pix total. Agora devolva <strong className="text-blue-950 dark:text-blue-100">R$ {(parseFloat(req.eventValue) * 0.75).toFixed(2)}</strong> (75%) para o admin manter seu acesso.
                    </p>
                    <div className="flex flex-col gap-3">
                       <div className="flex-1">
                         <label className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-1 ml-1">Chave PIX Admin</label>
                         <div className="flex items-center bg-white dark:bg-slate-800 px-3 py-4 rounded-xl border-2 border-blue-200 dark:border-blue-800 justify-between">
                            <code className="font-black text-blue-700 text-xs truncate mr-2">{ADMIN_PIX_KEY}</code>
                            <button onClick={() => copyToClipboard(ADMIN_PIX_KEY)} className="text-blue-600 font-black text-[10px] uppercase whitespace-nowrap bg-blue-50 px-3 py-1.5 rounded-lg active:scale-95">Copiar</button>
                         </div>
                       </div>
                       <button 
                        onClick={() => handleConfirmSendback(req.id)}
                        className="w-full px-6 py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all uppercase text-xs tracking-widest active:scale-[0.98]"
                       >
                         Confirmar Envio dos 75%
                       </button>
                    </div>
                  </div>
                )}
                
                {req.status === 'paid' && (
                  <div className="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border-2 border-purple-100 dark:border-purple-800 flex flex-col items-center gap-3 text-center">
                    <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center animate-spin-slow">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                    </div>
                    <p className="text-[11px] font-black text-purple-700 dark:text-purple-300 uppercase tracking-widest">Aguardando validação do administrador...</p>
                    <p className="text-[9px] font-bold text-slate-400">Normalmente aprovado em até 15 minutos.</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center px-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Sem atividades</h3>
            <p className="text-slate-500 font-bold mt-2 text-sm">Participe de um evento para lucrar.</p>
            <button onClick={() => navigate('/')} className="mt-6 px-8 py-4 bg-emerald-600 text-white font-black rounded-xl uppercase text-xs tracking-widest">Ver Eventos</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRequestsPage;
