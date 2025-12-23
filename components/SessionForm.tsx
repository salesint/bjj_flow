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

  const inputClass = "w-full border border-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-black text-white font-bold placeholder:text-slate-600 transition-all";

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in duration-200 border border-white/10">
        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-zinc-950/40">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Registrar Treino</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Sua jornada técnica em detalhes</p>
          </div>
          <button onClick={onCancel} className="text-slate-500 hover:text-white p-3 bg-zinc-950 rounded-2xl transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-10 overflow-y-auto space-y-10 no-scrollbar">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
              <Tag size={12} className="text-blue-500" strokeWidth={3} /> Título da Sessão (Opcional)
            </label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Foco em Passagem de Guarda"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
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

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
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
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[11px] font-black text-blue-500 uppercase tracking-widest ml-1">
                <Move size={14} strokeWidth={3} /> Técnicas
              </label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={posInput}
                  onChange={(e) => setPosInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPos())}
                  placeholder="Guarda, Raspagem..."
                  className={inputClass}
                />
                <button type="button" onClick={handleAddPos} className="bg-blue-600 text-white px-5 rounded-2xl hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20">
                  <Plus size={20} strokeWidth={3} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {positions.map((p, i) => (
                  <span key={i} className="bg-blue-500/10 text-blue-400 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-blue-500/20">
                    {p}
                    <button type="button" onClick={() => setPositions(positions.filter((_, idx) => idx !== i))} className="hover:text-rose-500 transition-colors">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[11px] font-black text-emerald-500 uppercase tracking-widest ml-1">
                <Target size={14} strokeWidth={3} /> Drills
              </label>
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={drillInput}
                  onChange={(e) => setDrillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDrill())}
                  placeholder="30 reps de Armlock..."
                  className={inputClass}
                />
                <button type="button" onClick={handleAddDrill} className="bg-emerald-600 text-white px-5 rounded-2xl hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20">
                  <Plus size={20} strokeWidth={3} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {drills.map((d, i) => (
                  <span key={i} className="bg-emerald-500/10 text-emerald-400 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-500/20">
                    {d}
                    <button type="button" onClick={() => setDrills(drills.filter((_, idx) => idx !== i))} className="hover:text-rose-500 transition-colors">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
              <FileText size={14} strokeWidth={3} /> Observações
            </label>
            <textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Como foi o treino? Pontos de melhoria..."
              className={`${inputClass} h-32 resize-none`}
            />
          </div>

          <div className="space-y-6">
            <label className="flex items-center justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">
              <span>Nível de Esforço</span>
              <span className="text-blue-500 font-black">{intensity}/5</span>
            </label>
            <input 
              type="range" 
              min="1" max="5" 
              value={intensity} 
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-2 bg-black border border-white/5 rounded-full appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[9px] font-black uppercase text-slate-700">
              <span>Baixo</span>
              <span>Moderado</span>
              <span>Extremo</span>
            </div>
          </div>

          <div className="flex gap-4 pt-10 sticky bottom-0 bg-zinc-900 pb-2">
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 bg-black border border-white/5 text-slate-500 font-black py-5 rounded-2xl text-xs uppercase tracking-widest hover:text-white transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl text-xs uppercase tracking-widest shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 transition-all border-t border-white/20 active:scale-95"
            >
              <Save size={18} strokeWidth={3} />
              Finalizar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionForm;