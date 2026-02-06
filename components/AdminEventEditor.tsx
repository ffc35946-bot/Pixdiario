
import React, { useState, useEffect } from 'react';
import { Event } from '../types';
import { useAuth } from '../hooks/useAuth';

interface AdminEventEditorProps {
  event: Event | null;
  onClose: () => void;
}

const AdminEventEditor: React.FC<AdminEventEditorProps> = ({ event, onClose }) => {
  const { addOrUpdateEvent, deleteEvent } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setImageUrl(event.imageUrl);
      setValue(event.value || '');
    } else {
      setTitle('');
      setDescription('');
      setValue('');
      setImageUrl(`https://images.unsplash.com/photo-1554224155-1696413575b9?q=80&w=600&auto=format&fit=crop`);
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = { title, description, imageUrl, value, id: event?.id };
    addOrUpdateEvent(eventData);
    onClose();
  };
  
  const handleDelete = () => {
    if (event && window.confirm(`Tem certeza de que deseja excluir o evento "${event.title}"?`)) {
      deleteEvent(event.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 w-full max-w-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">{event ? 'Editar Evento' : 'Criar Novo Evento'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Título do Evento</label>
            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none bg-slate-50 dark:bg-slate-800 transition-all font-semibold" placeholder="Ex: Campanha de Bonus Diário"/>
          </div>
          
          <div>
            <label htmlFor="value" className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Valor (R$)</label>
            <input type="text" id="value" value={value} onChange={e => setValue(e.target.value)} required className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none bg-slate-50 dark:bg-slate-800 transition-all font-bold text-emerald-600" placeholder="Ex: 50.00"/>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">URL da Imagem</label>
            <input type="text" id="imageUrl" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none bg-slate-50 dark:bg-slate-800 transition-all font-medium" placeholder="https://..."/>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-black text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">Descrição Detalhada</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={4} className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none bg-slate-50 dark:bg-slate-800 transition-all font-medium" placeholder="Descreva os benefícios do evento..."/>
          </div>

          <div className="md:col-span-2 flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800">
            <div>
              {event && (
                  <button type="button" onClick={handleDelete} className="px-6 py-3 bg-red-50 text-red-600 font-black rounded-xl hover:bg-red-100 transition-colors">
                    Remover Evento
                  </button>
              )}
            </div>
            <div className="flex space-x-3">
                <button type="button" onClick={onClose} className="px-6 py-3 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-black rounded-xl hover:bg-slate-200 transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-10 py-3 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20">
                  {event ? 'Atualizar Evento' : 'Publicar Evento'}
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminEventEditor;
