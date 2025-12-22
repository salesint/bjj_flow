import React, { useState } from 'react';
import { X, Plus, Save, Move, Target, FileText, Calendar, Clock, Tag, ChevronDown } from 'lucide-react';
import { TrainingSession, SessionType } from '../types.ts';

interface Props {
  onSave: (session: Omit<TrainingSession, 'id'>) => void;
  onCancel: () => void;
}

const SessionForm: React.FC<Props> = ({ onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<SessionType>(SessionType.GI);
  const [duration, setDuration] = useState(60);
  const [intensity, setIntensity] = useState(3);
  const [notes, setNotes] = useState('');
  
  const [posInput, setPosInput] = useState('');
  const [positions, setPositions] = useState<string[]>([]);
  
  const [drillInput, setDrillInput] = useState('');
  const [drills, setDrills] = useState<string[]>([]);

  const handleAddPos = () => {
    if (posInput.trim()) {
      setPositions([...positions, posInput.trim()]);
      setPosInput('');
    }
  };

  const handleAddDrill = () => {
    if (drillInput.trim()) {
      setDrills([...drills, drillInput.trim()]);
      setDrillInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: title.trim() || undefined,
      date,
      type,
      duration,
      intensity,
      notes,
      positions,
      drills,
      partners: []
    });
  };

  const inputClass = "w-full border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 dark:bg-slate-800 dark:text-white font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all";

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in duration-200 border border-transparent dark:border-slate-800">
        <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/40">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Registrar Treino</h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mt-1">Sua jornada técnica em detalhes</p>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 overflow-y-auto space-y-8 no-scrollbar">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
              <Tag size={12} className="text-blue-500" strokeWidth={3} /> Título da Sessão
            </label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Foco em Raspagens de Meia-Guarda"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                <Calendar size={12} strokeWidth={3} /> Data
              </label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                <Target size={12} strokeWidth={3} /> Categoria
              </label>
              <div className="relative">
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value as SessionType)}
                  className={`${inputClass} appearance-none cursor-pointer pr-10`}
                >
                  {Object.values(SessionType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                <Clock size={12} strokeWidth={3} /> Duração (min)
              </label>
              <input 
                type="number" 
                value={duration} 
                onChange={(e) => setDuration(Number(e.target.value))}
                className={inputClass}
                min="1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest ml-1">
                <Move size={14} strokeWidth={3} /> Posições Trabalhadas
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={posInput}
                  onChange={(e) => setPosInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPos())}
                  placeholder="Guarda X, Passagem..."
                  className={inputClass}
                />
                <button type="button" onClick={handleAddPos} className="bg-blue-600 text-white px-4 rounded-2xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
                  <Plus size={20} strokeWidth={3} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {positions.map((p, i) => (
                  <span key={i} className="bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border border-blue-100 dark:border-blue-800 shadow-sm">
                    {p}
                    <button type="button" onClick={() => setPositions(positions.filter((_, idx) => idx !== i))} className="hover:text-rose-500 transition-colors">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[10px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-widest ml-1">
                <Target size={14} strokeWidth={3} /> Drills Realizados
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={drillInput}
                  onChange={(e) => setDrillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDrill())}
                  placeholder="30 reps de armlock..."
                  className={inputClass}
                />
                <button type="button" onClick={handleAddDrill} className="bg-emerald-600 text-white px-4 rounded-2xl hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-500/20">
                  <Plus size={20} strokeWidth={3} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {drills.map((d, i) => (
                  <span key={i} className="bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-100 dark:border-emerald-800 shadow-sm">
                    {d}
                    <button type="button" onClick={() => setDrills(drills.filter((_, idx) => idx !== i))} className="hover:text-rose-500 transition-colors">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
              <FileText size={14} strokeWidth={3} /> Observações Pessoais
            </label>
            <textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descreva o que sentiu hoje, dificuldades ou pontos de melhora..."
              className={`${inputClass} h-32 resize-none`}
            />
          </div>

          <div className="space-y-5">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
              Nível de Esforço ({intensity}/5)
            </label>
            <input 
              type="range" 
              min="1" max="5" 
              value={intensity} 
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
            />
            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 dark:text-slate-600">
              <span>Baixo</span>
              <span>Moderado</span>
              <span>Extremo</span>
            </div>
          </div>

          <div className="flex gap-4 pt-6 sticky bottom-0 bg-white dark:bg-slate-900 pb-2">
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black py-4 rounded-2xl text-xs uppercase tracking-widest"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Save size={18} strokeWidth={3} />
              Salvar Treino
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionForm;