
import React, { useState } from 'react';
import { X, Save, Plus, Tag, Calendar, Clock, Target, Move, FileText, Users } from 'lucide-react';
import { TrainingSession, SessionType } from '../types.ts';

interface Props {
  onSave: (data: Omit<TrainingSession, 'id'>) => void;
  onCancel: () => void;
}

const SessionForm: React.FC<Props> = ({ onSave, onCancel }) => {
  // Added partners to the initial state to match TrainingSession type
  const [formData, setFormData] = useState({
    title: '', 
    date: new Date().toISOString().split('T')[0], 
    type: SessionType.GI,
    duration: 60, 
    intensity: 3, 
    notes: '', 
    positions: [] as string[], 
    drills: [] as string[],
    partners: [] as string[]
  });
  const [inputs, setInputs] = useState({ pos: '', drill: '', partner: '' });

  const inputStyle = "w-full bg-black border border-white/10 rounded-xl p-4 text-sm font-bold text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700";

  const addItem = (field: 'positions' | 'drills' | 'partners', val: string) => {
    if (val.trim()) {
      setFormData({ ...formData, [field]: [...formData[field], val.trim()] });
      setInputs({ 
        ...inputs, 
        [field === 'positions' ? 'pos' : field === 'drills' ? 'drill' : 'partner']: '' 
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 w-full max-w-2xl rounded-[2.5rem] border border-white/10 flex flex-col max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black/20">
          <h2 className="text-2xl font-black text-white">Novo Treino</h2>
          <button onClick={onCancel} className="p-2 text-slate-500 hover:text-white transition-colors"><X size={24}/></button>
        </div>

        <form className="p-8 overflow-y-auto space-y-8 no-scrollbar" onSubmit={e => {
          e.preventDefault();
          onSave(formData);
        }}>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Título do Treino</label>
            <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Ex: Foco na Meia Guarda" className={inputStyle} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Data</label>
              <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={inputStyle} required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Categoria</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as SessionType})} className={inputStyle}>
                {Object.values(SessionType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-2 col-span-2 md:col-span-1">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Duração (Min)</label>
              <input type="number" value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} className={inputStyle} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-blue-500 uppercase ml-1">Técnicas</label>
              <div className="flex gap-2">
                <input value={inputs.pos} onChange={e => setInputs({...inputs, pos: e.target.value})} className={inputStyle} placeholder="Adicionar posição..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem('positions', inputs.pos))} />
                <button type="button" onClick={() => addItem('positions', inputs.pos)} className="bg-blue-600 p-4 rounded-xl text-white"><Plus size={20}/></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.positions.map((p, i) => <span key={i} className="text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-lg flex items-center gap-2">{p} <X size={10} className="cursor-pointer" onClick={() => setFormData({...formData, positions: formData.positions.filter((_, idx) => idx !== i)})}/></span>)}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-emerald-500 uppercase ml-1">Drills</label>
              <div className="flex gap-2">
                <input value={inputs.drill} onChange={e => setInputs({...inputs, drill: e.target.value})} className={inputStyle} placeholder="Adicionar drill..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem('drills', inputs.drill))} />
                <button type="button" onClick={() => addItem('drills', inputs.drill)} className="bg-emerald-600 p-4 rounded-xl text-white"><Plus size={20}/></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.drills.map((d, i) => <span key={i} className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg flex items-center gap-2">{d} <X size={10} className="cursor-pointer" onClick={() => setFormData({...formData, drills: formData.drills.filter((_, idx) => idx !== i)})}/></span>)}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-purple-500 uppercase ml-1">Parceiros de Treino</label>
            <div className="flex gap-2">
              <input value={inputs.partner} onChange={e => setInputs({...inputs, partner: e.target.value})} className={inputStyle} placeholder="Nome do parceiro..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addItem('partners', inputs.partner))} />
              <button type="button" onClick={() => addItem('partners', inputs.partner)} className="bg-purple-600 p-4 rounded-xl text-white"><Plus size={20}/></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.partners.map((p, i) => <span key={i} className="text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-3 py-1 rounded-lg flex items-center gap-2">{p} <X size={10} className="cursor-pointer" onClick={() => setFormData({...formData, partners: formData.partners.filter((_, idx) => idx !== i)})}/></span>)}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Intensidade: {formData.intensity}/5</label>
            </div>
            <input type="range" min="1" max="5" value={formData.intensity} onChange={e => setFormData({...formData, intensity: Number(e.target.value)})} className="w-full h-1.5 bg-black rounded-lg appearance-none accent-blue-600 cursor-pointer" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-1">Anotações</label>
            <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className={`${inputStyle} h-24 resize-none`} placeholder="O que aprendeu hoje?" />
          </div>

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-zinc-900 pb-2">
            <button type="button" onClick={onCancel} className="flex-1 bg-black border border-white/5 py-4 rounded-xl font-black text-xs text-slate-500">CANCELAR</button>
            <button type="submit" className="flex-[2] bg-blue-600 py-4 rounded-xl font-black text-xs text-white shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"><Save size={16}/> SALVAR REGISTRO</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionForm;
