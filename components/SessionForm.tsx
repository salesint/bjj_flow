
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

  const handleAddPartner = () => {
    if (partnersInput.trim()) {
      setPartners([...partners, partnersInput.trim()]);
      setPartnersInput('');
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

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Registro de Evolução</h2>
            <p className="text-xs text-slate-500 font-medium">Preencha os detalhes para um estudo posterior eficiente</p>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full shadow-sm">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
          {/* Title Field - Optional but didactic */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Tag size={14} className="text-blue-500" /> Título da Sessão (Opcional)
            </label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: 'Foco na Passagem de Guarda' ou 'Sparring com João'"
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 font-medium placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date Picker */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Calendar size={14} className="text-blue-500" /> Data do Treino
              </label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                required
              />
            </div>

            {/* Session Type Select */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Target size={14} className="text-slate-500" /> Categoria/Modalidade
              </label>
              <div className="relative">
                <select 
                  value={type} 
                  onChange={(e) => setType(e.target.value as SessionType)}
                  className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 appearance-none cursor-pointer"
                >
                  {Object.values(SessionType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Clock size={14} className="text-slate-500" /> Duração (minutos)
              </label>
              <input 
                type="number" 
                value={duration} 
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50"
                min="0"
                placeholder="Ex: 60, 90..."
              />
            </div>
          </div>

          {/* Positions Section */}
          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <Move size={16} /> Posições Trabalhadas (Foco Estrutural)
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={posInput}
                onChange={(e) => setPosInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPos())}
                placeholder="Ex: Guarda De La Riva, Meia-guarda Profunda..."
                className="flex-1 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <button type="button" onClick={handleAddPos} className="bg-blue-600 text-white px-4 rounded-xl hover:bg-blue-700 transition-colors">
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {positions.map((p, i) => (
                <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border border-blue-100">
                  {p}
                  <button type="button" onClick={() => setPositions(positions.filter((_, idx) => idx !== i))} className="hover:text-blue-900">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Drills Section */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
              <Target size={16} /> Drills Realizados (Repetição Técnica)
            </label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={drillInput}
                onChange={(e) => setDrillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddDrill())}
                placeholder="Ex: 20x Raspagem Tesourinha, Drill de Rolamento..."
                className="flex-1 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button type="button" onClick={handleAddDrill} className="bg-emerald-600 text-white px-4 rounded-xl hover:bg-emerald-700 transition-colors">
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {drills.map((d, i) => (
                <span key={i} className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border border-emerald-100">
                  {d}
                  <button type="button" onClick={() => setDrills(drills.filter((_, idx) => idx !== i))} className="hover:text-emerald-900">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Observations */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <FileText size={16} /> Observações & Insights Pessoais
            </label>
            <textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descreva o que aprendeu, erros cometidos ou sensações do treino..."
              className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none h-24 resize-none bg-slate-50 placeholder:italic"
            />
          </div>

          {/* Intensity Slider */}
          <div className="space-y-4 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Intensidade (Nível de Esforço)
            </label>
            <input 
              type="range" 
              min="1" max="5" 
              value={intensity} 
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 px-1">
              <span>Recuperação (1)</span>
              <span>Moderado (3)</span>
              <span>Competição (5)</span>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-4 pt-6 sticky bottom-0 bg-white pb-2">
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-all"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="flex-[2] bg-slate-900 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10"
            >
              <Save size={20} />
              Salvar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionForm;