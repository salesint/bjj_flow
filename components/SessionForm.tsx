import React, { useState } from 'react';
import { X, Plus, Save, Move, Target, FileText, Calendar, Clock, Tag, ChevronDown } from 'lucide-react';
import { TrainingSession, SessionType } from '../types';

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
  
  const [partnersInput, setPartnersInput] = useState('');
  const [partners, setPartners] = useState<string[]>([]);

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
      partners
    });
  };

  const inputClass = "w-full border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 dark:bg-slate-800 dark:text-white font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-colors";

  return (
    <div className="fixed inset-0 bg-slate-900/70 dark:bg-slate-950/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in duration-200 border border-transparent dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/20">
          <div>
            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Registro de Sessão</h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest mt-0.5">Mantenha seu fluxo de evolução</p>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-2">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <Tag size={12} className="text-blue-500" /> Título (Ex: Passagem de Meia)
            </label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Opcional..."
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <Calendar size={12} /> Data
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
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <Target size={12} /> Categoria
              </label>
              <div className="relative">
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value as SessionType)}
                  className={`${inputClass} appearance-none cursor-pointer pr-10`}
                >
                  {Object.values(SessionType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <Clock size={12} /> Duração (min)
              </label>
              <input 
                type="number" 
                value={duration} 
                onChange={(e) => setDuration(Number(e.target.value))}
                className={inputClass}
                min="1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest">
                <Move size={14} /> Posições
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={posInput}
                  onChange={(e) => setPosInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPos())}
                  placeholder="Guarda, Passagem..."
                  className={inputClass}
                />
                <button type="button" onClick={handleAddPos} className="bg-blue-600 text-white px-3 rounded-xl hover:bg-blue-500 transition-colors">
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {positions.map((p, i) => (
                  <span key={i} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-2 border border-blue-100 dark:border-blue-800">
                    {p}
                    <button type="button" onClick={() => setPositions(positions.filter((_, idx) => idx !== i))} className="opacity-60 hover:opacity-100">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[10px] font-black text-emerald-500 dark:text-emerald-400 uppercase tracking-widest">
                <Target size={14} /> Drills
              </label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={drillInput}
                  onChange={(e) => setDrillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDrill())}
                  placeholder="Técnica X..."
                  className={inputClass}
                />
                <button type="button" onClick={handleAddDrill} className="bg-emerald-600 text-white px-3 rounded-xl hover:bg-emerald-500 transition-colors">
                  <Plus size={18} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {drills.map((d, i) => (
                  <span key={i} className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-2 border border-emerald-100 dark:border-emerald-800">
                    {d}
                    <button type="button" onClick={() => setDrills(drills.filter((_, idx) => idx !== i))} className="opacity-60 hover:opacity-100">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <FileText size={14} /> Observações
            </label>
            <textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              placeholder="O que funcionou hoje? O que precisa melhorar?"
              className={`${inputClass} h-24 resize-none`}
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Nível de Esforço ({intensity})
            </label>
            <input 
              type="range" 
              min="1" max="5" 
              value={intensity} 
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
            />
            <div className="flex justify-between text-[9px] font-black uppercase text-slate-300 dark:text-slate-600">
              <span>Leve</span>
              <span>Moderado</span>
              <span>Máximo</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4 sticky bottom-0 bg-white dark:bg-slate-900 pb-2">
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold py-3 rounded-xl text-sm"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Salvar Treino
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionForm;