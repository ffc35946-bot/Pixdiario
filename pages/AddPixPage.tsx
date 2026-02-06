
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PixKeyType } from '../types';

const AddPixPage: React.FC = () => {
  const { currentUser, addUserPix } = useAuth();
  const navigate = useNavigate();
  const [pixKeyType, setPixKeyType] = useState<PixKeyType>(PixKeyType.EMAIL);
  const [pixKey, setPixKey] = useState('');
  const [cpf, setCpf] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    setError('');
    setIsLoading(true);

    if (!currentUser) {
      setError('Sessão expirada. Faça login novamente.');
      setIsLoading(false);
      return;
    }

    if (!isValidCpf(cpf)) {
      setError('O CPF informado é inválido. Verifique os números.');
      setIsLoading(false);
      return;
    }

    try {
      await addUserPix(currentUser.id, pixKeyType, pixKey, cpf);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar seus dados.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-16">
      <div className="mx-auto w-full max-w-lg">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 border-2 border-slate-50 dark:border-slate-800">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Perfil Financeiro
            </h2>
            <p className="mt-3 text-slate-500 font-semibold">
              Precisamos destes dados para processar seus recebimentos com segurança.
            </p>
          </div>

          {error && (
            <div className="mb-8 bg-red-50 border-2 border-red-100 text-red-700 p-5 rounded-2xl font-bold flex items-center gap-3 animate-pulse" role="alert">
              <span>⚠️ {error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="pix-type" className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">Tipo de Chave PIX</label>
              <div className="relative">
                <select
                  id="pix-type"
                  value={pixKeyType}
                  onChange={(e) => setPixKeyType(e.target.value as PixKeyType)}
                  className="block w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 px-5 py-4 text-slate-900 dark:text-white font-bold bg-slate-50 dark:bg-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer"
                >
                  <option value={PixKeyType.EMAIL}>E-mail</option>
                  <option value={PixKeyType.PHONE}>Telefone (Celular)</option>
                  <option value={PixKeyType.CPF}>CPF</option>
                  <option value={PixKeyType.RANDOM}>Chave Aleatória</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="pix-key" className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">Valor da Chave PIX</label>
              <input
                id="pix-key"
                type="text"
                required
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="Insira sua chave exatamente como no banco"
                className="block w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 px-5 py-4 text-slate-900 dark:text-white font-bold bg-slate-50 dark:bg-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="cpf" className="block text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest ml-1">Seu CPF</label>
              <input
                id="cpf"
                type="text"
                required
                value={cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                className="block w-full rounded-2xl border-2 border-slate-200 dark:border-slate-700 px-5 py-4 text-slate-900 dark:text-white font-bold bg-slate-50 dark:bg-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 text-white py-5 px-6 rounded-2xl font-black text-lg hover:bg-emerald-700 shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:bg-emerald-300 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Salvando Dados...' : 'Finalizar Cadastro'}
              </button>
              <p className="mt-4 text-center text-xs text-slate-400 font-bold uppercase tracking-widest">🔒 Seus dados estão seguros e criptografados</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPixPage;
