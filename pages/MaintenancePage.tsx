
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const MaintenancePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center p-6 overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg text-center"
      >
        <div className="mb-10 inline-flex items-center justify-center w-24 h-24 bg-slate-900 border-2 border-slate-800 rounded-[2.5rem] shadow-2xl relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="text-5xl"
          >
            ⚙️
          </motion.div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full animate-pulse border-4 border-slate-950"></div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-tight">
          Plataforma em <br />
          <span className="text-emerald-500">Manutenção</span>
        </h1>
        
        <p className="text-slate-400 font-bold text-sm sm:text-lg leading-relaxed mb-10 max-w-sm mx-auto">
          Estamos preparando novidades e melhorando nossa segurança. Voltamos em alguns minutos!
        </p>

        <div className="flex flex-col gap-4">
           <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status do Sistema</p>
              <div className="flex items-center justify-center gap-2">
                 <span className="w-2 h-2 bg-yellow-500 rounded-full animate-ping"></span>
                 <span className="text-xs font-black text-yellow-500 uppercase tracking-wider">Otimização de Banco de Dados</span>
              </div>
           </div>
           
           <div className="pt-4 flex flex-col gap-4 items-center">
              <p className="text-[9px] font-black text-slate-700 uppercase tracking-[0.2em]">© {new Date().getFullYear()} Pix Diário - Gestão Segura</p>
              
              {/* Botão discreto para o Admin conseguir entrar */}
              <button 
                onClick={() => navigate('/login')}
                className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-emerald-500 transition-colors"
              >
                Acesso Administrativo
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MaintenancePage;
