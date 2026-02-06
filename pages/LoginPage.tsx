
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Credenciais inválidas.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-8 sm:py-16 px-4">
      <div className="mx-auto w-full max-w-lg">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl p-6 sm:p-10 border border-slate-50 dark:border-slate-800">
          <div className="text-center mb-8 sm:mb-10">
            <div className="flex justify-center mb-4 sm:mb-6">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 sm:p-4 rounded-2xl text-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
              </div>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
              Bem-vindo
            </h2>
            <p className="text-slate-500 font-bold text-sm sm:text-lg">
              Acesse sua conta agora.
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl font-black text-center text-xs">
              {error}
            </div>
          )}

          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
              <input 
                type="email" 
                placeholder="nome@email.com" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-emerald-500 outline-none transition-all font-bold text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-emerald-500 outline-none transition-all font-bold text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-sm sm:text-lg hover:bg-emerald-700 shadow-xl transition-all disabled:bg-emerald-300 mt-2"
            >
              {isLoading ? 'Entrando...' : 'Entrar Agora'}
            </button>
            
            <p className="text-center text-slate-500 font-bold mt-6 text-sm">
              Novo por aqui?{' '}
              <Link to="/register" className="text-emerald-600 hover:underline">
                Criar Cadastro
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
