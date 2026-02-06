
import React, { useState, useCallback, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Event, ParticipationRequest, User } from '../types';
import AdminEventEditor from '../components/AdminEventEditor';
import { useNavigate } from 'react-router-dom';
import { ADMIN_PIX_KEY } from '../constants';
import Toast, { ToastType } from '../components/Toast';

const AdminPage: React.FC = () => {
  const { 
    events, 
    requests, 
    notifyUser, 
    confirmAdminReceipt, 
    users, 
    banUser, 
    unbanUser, 
    isMaintenanceMode, 
    toggleMaintenanceMode 
  } = useAuth();
  
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'requests' | 'banned'>('requests');
  const [requestFilter, setRequestFilter] = useState<'pending' | 'paid' | 'waiting_receipt' | 'completed'>('pending');
  const [userSearch, setUserSearch] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  // Toast State
  const [toast, setToast] = useState<{message: string, type: ToastType, isVisible: boolean}>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const navigate = useNavigate();

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const handleAddNewEvent = () => {
    setEditingEvent(null);
    setIsEditorOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = useCallback(() => {
    setIsEditorOpen(false);
    setEditingEvent(null);
  }, []);
  
  const handleToggleMaintenance = () => {
    const status = !isMaintenanceMode ? "ativado" : "desativado";
    toggleMaintenanceMode();
    showToast(`Modo Manutenção ${status}!`, !isMaintenanceMode ? 'info' : 'success');
  };

  const handleApproveRegistration = async (req: ParticipationRequest) => {
    if(window.confirm(`Aprovar entrada de ${req.userName}?`)) {
        setIsProcessing(req.id);
        try {
          const msg = `Sua entrada no evento "${req.eventTitle}" foi APROVADA! O Pix de R$ ${req.eventValue} será enviado. Após receber, envie os 75% para continuar lucrando.`;
          await notifyUser(req.userId, req.id, msg, 'waiting_receipt');
          showToast('Inscrição aprovada com sucesso!');
        } catch (error) {
          showToast('Erro ao processar aprovação.', 'error');
        } finally {
          setIsProcessing(null);
        }
    }
  };

  const handleRemindUser = (req: ParticipationRequest) => {
    const msg = `Lembrete: Envie a porcentagem de 75% (R$ ${(parseFloat(req.eventValue) * 0.75).toFixed(2)}) para a chave PIX: ${ADMIN_PIX_KEY}`;
    notifyUser(req.userId, req.id, msg);
    showToast('Notificação de cobrança enviada!');
  };

  const handleConfirmFinalReceipt = (requestId: string) => {
    if(window.confirm('Confirma que recebeu os 75%?')) {
        confirmAdminReceipt(requestId);
        showToast('Sucesso! Pagamento confirmado.');
    }
  };

  const filteredRequests = useMemo(() => {
    if (requestFilter === 'waiting_receipt') {
      return requests.filter(r => r.status === 'waiting_receipt' || r.status === 'paid')
                     .sort((a, b) => {
                       if (a.status === 'paid' && b.status !== 'paid') return -1;
                       if (a.status !== 'paid' && b.status === 'paid') return 1;
                       return b.createdAt.localeCompare(a.createdAt);
                     });
    }
    return requests.filter(r => r.status === requestFilter)
                   .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [requests, requestFilter]);

  const stats = useMemo(() => ({
    pending: requests.filter(r => r.status === 'pending').length,
    waiting: requests.filter(r => r.status === 'waiting_receipt' || r.status === 'paid').length,
    check: requests.filter(r => r.status === 'paid').length,
    completed: requests.filter(r => r.status === 'completed').length,
  }), [requests]);

  const searchedUsers = useMemo(() => {
    if (!userSearch) return [];
    const lower = userSearch.toLowerCase();
    return users.filter(u => 
      u.email.toLowerCase().includes(lower) || 
      u.phone.includes(lower) || 
      (u.cpf && u.cpf.replace(/\D/g, '').includes(lower.replace(/\D/g, '')))
    );
  }, [users, userSearch]);

  const bannedUsers = useMemo(() => users.filter(u => u.isBanned), [users]);

  return (
    <div className="space-y-6 sm:space-y-10 py-4 sm:py-6 relative">
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast(prev => ({...prev, isVisible: false}))} 
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 sm:gap-4 mb-1">
            <button 
                onClick={() => navigate('/')} 
                className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </button>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Painel Admin</h1>
          </div>
          <p className="text-slate-500 font-semibold text-xs sm:text-sm ml-11 sm:ml-14">Central de operações Pix Diário.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleToggleMaintenance}
            className={`flex-1 md:flex-none px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
              isMaintenanceMode 
                ? 'bg-red-100 text-red-600 border-2 border-red-200' 
                : 'bg-slate-100 text-slate-600 border-2 border-slate-200'
            }`}
          >
            {isMaintenanceMode ? '🔓 Abrir Sistema' : '🔒 Travar Sistema'}
          </button>
          
          <button onClick={handleAddNewEvent} className="flex-1 md:flex-none bg-emerald-600 text-white px-6 py-4 rounded-2xl font-black hover:bg-emerald-700 shadow-xl transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
            Novo Evento
          </button>
        </div>
      </div>

      <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1.5 rounded-2xl w-full gap-1 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('requests')} 
            className={`flex-1 min-w-[100px] py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'requests' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-md scale-[1.02]' : 'text-slate-500'}`}
          >
              Fluxo
          </button>
          <button 
            onClick={() => setActiveTab('events')} 
            className={`flex-1 min-w-[100px] py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'events' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-md scale-[1.02]' : 'text-slate-500'}`}
          >
              Eventos
          </button>
          <button 
            onClick={() => setActiveTab('banned')} 
            className={`flex-1 min-w-[100px] py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'banned' ? 'bg-white dark:bg-slate-700 text-red-600 shadow-md scale-[1.02]' : 'text-slate-500'}`}
          >
              Banidos
          </button>
      </div>

      {isEditorOpen && <AdminEventEditor event={editingEvent} onClose={handleCloseEditor} />}
      
      {activeTab === 'requests' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'pending', label: 'Inscrições', count: stats.pending, color: 'emerald' },
              { id: 'waiting_receipt', label: 'AP75%', count: stats.waiting, color: 'blue' },
              { id: 'paid', label: 'Verificar', count: stats.check, color: 'purple' },
              { id: 'completed', label: 'Feitos', count: stats.completed, color: 'slate' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setRequestFilter(cat.id as any)}
                className={`p-4 sm:p-6 rounded-[1.5rem] border-2 transition-all flex flex-col items-center text-center gap-1 ${
                  requestFilter === cat.id 
                    ? `bg-${cat.color}-50 border-${cat.color}-500 dark:bg-${cat.color}-900/20 shadow-lg scale-[1.02]` 
                    : 'bg-white dark:bg-slate-900 border-slate-50 dark:border-slate-800 opacity-60'
                }`}
              >
                <span className={`text-2xl sm:text-3xl font-black text-${cat.color}-600`}>{cat.count}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/30">
              <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight">
                {requestFilter === 'pending' ? '🚀 Inscrições Pendentes' : 
                 requestFilter === 'waiting_receipt' ? '🔍 Aguardando Devolução' : 
                 requestFilter === 'paid' ? '💜 Confirmar Recebimento' : 
                 '✅ Finalizados'}
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Usuário</th>
                    <th className="px-6 py-4 text-left text-[9px] font-black text-slate-400 uppercase tracking-widest">Valor</th>
                    <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {filteredRequests.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-none">{req.userName}</span>
                          <span className="text-[10px] font-bold text-slate-400">{req.userPhone}</span>
                          {(req.status === 'waiting_receipt' || req.status === 'paid') && (
                            <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md mt-1 self-start">PIX: {req.userPixKey}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                         <div className="flex flex-col">
                            <span className="text-emerald-600 text-xs font-black">R$ {req.eventValue}</span>
                            <span className="text-slate-400 text-[9px] font-bold italic">75%: R$ {(parseFloat(req.eventValue) * 0.75).toFixed(2)}</span>
                         </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        {req.status === 'pending' && (
                          <button 
                            disabled={isProcessing === req.id}
                            onClick={() => handleApproveRegistration(req)} 
                            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 ml-auto disabled:bg-slate-300"
                          >
                            {isProcessing === req.id ? (
                               <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : 'Confirmar'}
                          </button>
                        )}
                        {(req.status === 'waiting_receipt' || req.status === 'paid') && (
                          <div className="flex flex-col sm:flex-row gap-2 justify-end items-center">
                            {req.status === 'paid' && (
                              <span className="text-[8px] font-black text-purple-600 uppercase bg-purple-50 px-2 py-1 rounded-md">Confirmou!</span>
                            )}
                            <button onClick={() => handleRemindUser(req)} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-blue-100 transition-colors">Cobrar</button>
                            <button onClick={() => handleConfirmFinalReceipt(req.id)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase shadow-md active:scale-95 hover:bg-emerald-700">Baixa</button>
                          </div>
                        )}
                        {req.status === 'completed' && <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md uppercase tracking-widest">✅ Pago</span>}
                      </td>
                    </tr>
                  ))}
                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-8 py-20 text-center text-slate-300 text-[10px] font-black uppercase tracking-widest">Nenhum registro encontrado</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black tracking-tight uppercase">Gerenciar Eventos</h2>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(event => (
              <div key={event.id} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-transparent hover:border-emerald-500 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">R$ {event.value}</span>
                  <button onClick={() => handleEditEvent(event)} className="text-slate-400 hover:text-emerald-600 font-black text-[9px] uppercase tracking-wider">Editar</button>
                </div>
                <h4 className="font-extrabold text-base mb-1 truncate">{event.title}</h4>
                <p className="text-slate-500 text-[11px] line-clamp-2 font-bold leading-relaxed">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'banned' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-10 shadow-xl border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl sm:text-2xl font-black mb-6 uppercase tracking-tight">Banir Participante</h2>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Busque por Nome, E-mail ou Telefone..." 
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-bold focus:border-red-500 outline-none transition-all"
              />
            </div>
            {searchedUsers.length > 0 && (
              <div className="mt-8 space-y-3">
                {searchedUsers.map(u => (
                  <div key={u.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-between gap-4 border border-slate-100 dark:border-slate-700">
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-900 dark:text-white truncate">{u.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{u.email} • {u.phone}</p>
                    </div>
                    <button 
                      onClick={() => {
                        if(u.isBanned) { unbanUser(u.id); showToast('Usuário liberado!'); }
                        else { banUser(u.id); showToast('Usuário banido!', 'error'); }
                      }}
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${u.isBanned ? 'bg-slate-200 text-slate-600' : 'bg-red-600 text-white shadow-lg'}`}
                    >
                      {u.isBanned ? 'Liberar' : 'Banir'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
