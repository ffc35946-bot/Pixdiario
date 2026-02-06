
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PixKeyType } from '../types';
import { useNavigate } from 'react-router-dom';
import Toast, { ToastType } from '../components/Toast';

const SettingsPage: React.FC = () => {
  const { currentUser, updateUserProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [cpf, setCpf] = useState(currentUser?.cpf || '');
  const [pixKeyType, setPixKeyType] = useState<PixKeyType>(currentUser?.pixKeyType || PixKeyType.EMAIL);
  const [pixKey, setPixKey] = useState(currentUser?.pixKey || '');
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Toast State
  const [toast, setToast] = useState<{message: string, type: ToastType, isVisible: boolean}>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const isValidCpf = (value: string) => {
    const cleanCpf = value.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) sum = sum + parseInt(cleanCpf.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) sum = sum + parseInt(cleanCpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;

    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.substring(10, 11))) return false;

    return true;
  };

  const formatCpf = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .substring(0, 14);
  };
  
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCpf(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setIsLoading(true);

    if (!isValidCpf(cpf)) {
      showToast('CPF inválido. Verifique os dados.', 'error');
      setIsLoading(false);
      return;
    }

    try {
      await updateUserProfile(currentUser.id, {
        name,
        email,
        phone,
        cpf,
        pixKeyType,
        pixKey
      });
      showToast('Perfil atualizado com sucesso!');
    } catch (err) {
      showToast('Erro ao atualizar perfil.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Deseja realmente sair da sua conta? Você precisará fazer login novamente para acessar seus dados.')) {
      logout();
      navigate('/login');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 space-y-6 sm:space-y-10 relative">
      <Toast 
        message={toast.message} 
        type={toast.type} 
        isVisible={toast.isVisible} 
        onClose={() => setToast(prev => ({...prev, isVisible: false}))} 
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-4">
          <button 
              onClick={() => navigate('/')} 
              className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border-2 border-slate-100 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-500 transition-all active:scale-95"
              title="Voltar para Início"
          >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Configurações</h1>
            <p className="text-slate-500 font-semibold text-xs sm:text-sm mt-1">Gerencie seus dados pessoais e financeiros.</p>
          </div>
        </div>
        <button 
            onClick={handleLogout}
            className="w-full md:w-auto px-6 py-4 bg-red-50 dark:bg-red-900/10 text-red-600 font-black rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-all active:scale-95 flex items-center justify-center gap-2 border-2 border-red-100 dark:border-red-900/30 shadow-sm"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Sair da Conta
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10 px-2">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border-2 border-slate-50 dark:border-slate-800 text-center">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto mb-6 flex items-center justify-center text-slate-400 border-4 border-slate-50 dark:border-slate-800 shadow-inner">
               <svg className="w-12 h-12 sm:w-16 sm:h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white truncate">{currentUser?.name}</h3>
            <p className="text-slate-400 font-bold text-xs sm:text-sm truncate px-4">{currentUser?.email}</p>
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status da Conta</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">Verificada</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl border-2 border-slate-50 dark:border-slate-800 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-bold focus:border-emerald-500 outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-bold focus:border-emerald-500 outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Número de Telefone</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-bold focus:border-emerald-500 outline-none transition-all text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CPF</label>
                <input 
                  type="text" 
                  value={cpf} 
                  onChange={handleCpfChange}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-bold focus:border-emerald-500 outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
              <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Dados Financeiros (PIX)
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Chave</label>
                  <select 
                    value={pixKeyType} 
                    onChange={e => setPixKeyType(e.target.value as PixKeyType)}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-bold focus:border-emerald-500 outline-none transition-all appearance-none text-sm"
                  >
                    <option value={PixKeyType.EMAIL}>E-mail</option>
                    <option value={PixKeyType.PHONE}>Telefone</option>
                    <option value={PixKeyType.CPF}>CPF</option>
                    <option value={PixKeyType.RANDOM}>Chave Aleatória</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Chave PIX</label>
                  <input 
                    type="text" 
                    value={pixKey} 
                    onChange={e => setPixKey(e.target.value)}
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-bold focus:border-emerald-500 outline-none transition-all text-sm"
                    placeholder="Digite sua chave"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-4 sm:py-5 rounded-2xl font-black text-sm sm:text-lg hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:bg-emerald-300"
            >
              {isLoading ? 'Salvando Alterações...' : 'Atualizar Dados'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
