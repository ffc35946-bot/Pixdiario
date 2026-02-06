
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!termsAccepted) {
      setError('Você precisa aceitar os termos de uso.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await register(name, email, phone, password);
      navigate('/add-pix');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center py-8 sm:py-16 px-4">
      <div className="mx-auto w-full max-w-lg">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-6 sm:p-10 border-2 border-slate-50 dark:border-slate-800">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
              Nova Conta
            </h2>
            <p className="text-slate-500 font-bold text-sm sm:text-lg">
              Comece a ganhar Pix diariamente.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-100 text-red-700 p-4 rounded-2xl font-bold text-center text-xs">
              {error}
            </div>
          )}

          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
              <input type="text" placeholder="Ex: João da Silva" required value={name} onChange={e => setName(e.target.value)} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none transition-all font-bold text-sm text-slate-900 dark:text-white"/>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
              <input type="email" placeholder="nome@email.com" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none transition-all font-bold text-sm text-slate-900 dark:text-white"/>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Celular / WhatsApp</label>
              <input type="tel" placeholder="(00) 00000-0000" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none transition-all font-bold text-sm text-slate-900 dark:text-white"/>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha</label>
                <input type="password" placeholder="••••••••" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none transition-all font-bold text-sm text-slate-900 dark:text-white"/>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Repetir Senha</label>
                <input type="password" placeholder="••••••••" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none transition-all font-bold text-sm text-slate-900 dark:text-white"/>
              </div>
            </div>

            <div className="py-2">
              <label className="flex items-center cursor-pointer group">
                <input type="checkbox" className="sr-only peer" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} />
                <div className="w-6 h-6 border-2 border-slate-200 rounded-lg peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-all flex items-center justify-center">
                   <svg className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span className="ml-3 text-[10px] font-black uppercase tracking-widest">
                   Aceito os <span className="text-blue-600 underline cursor-help">termos de uso</span>
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:bg-emerald-300 mt-2"
            >
              {isLoading ? 'Criando Conta...' : 'Criar Conta Agora'}
            </button>
            
            <p className="text-center text-slate-500 font-bold mt-6 text-sm">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-700 decoration-2 underline-offset-4 hover:underline">
                Fazer Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
