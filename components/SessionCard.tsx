
import React, { useState } from 'react';
import { Calendar, Clock, Target, Move, FileText, Trash2, Tag, Flame, Zap, Wind, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { TrainingSession, SessionType } from '../types.ts';

interface Props {
  session: TrainingSession;
  onDelete: (id: string) => void;
}

const SessionCard: React.FC<Props> = ({ session, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIntensity = (level: number) => {
    if (level <= 2) return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', bar: 'bg-emerald-500', icon: Wind, label: 'Leve' };
    if (level <= 4) return { color: 'text-blue-500', bg: 'bg-blue-500/10', bar: 'bg-blue-500', icon: Zap, label: 'Moderado' };
    return { color: 'text-rose-500', bg: 'bg-rose-500/10', bar: 'bg-rose-500', icon: Flame, label: 'Intenso' };
  };

  const style = getIntensity(session.intensity);
  const Icon = style.icon;
  const dateObj = new Date(session.date);

  return (
    <div className={`bg-zinc-900 border ${isExpanded ? 'border-blue-500/50' : 'border-white/5'} rounded-[2rem] overflow-hidden transition-all duration-300`}>
      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
        {/* Date Mini Badge */}
        <div className="bg-black rounded-2xl p-4 flex flex-col items-center justify-center w-20 h-20 shrink-0 border border-white/5">
          <span className="text-[10px] font-black text-slate-500 uppercase">{dateObj.toLocaleDateString('pt-BR', { month: 'short' })}</span>
          <span className="text-2xl font-black text-white">{dateObj.getUTCDate()}</span>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider">
              {session.type}
            </span>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${style.bg} border border-white/5`}>
              <Icon size={12} className={style.color} />
              <span className={`text-[9px] font-black uppercase ${style.color}`}>{style.label}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold">
              <Clock size={12} className="text-blue-500" />
              {session.duration} MIN
            </div>
          </div>

          <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
            {session.title || `Treino de ${session.type}`}
          </h3>

          <div className="flex gap-4">
             <button onClick={() => setIsExpanded(!isExpanded)} className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors">
               {isExpanded ? 'Ocultar Detalhes' : 'Ver Detalhes'} {isExpanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
             </button>
          </div>
        </div>

        <button onClick={() => onDelete(session.id)} className="self-start p-3 bg-black rounded-xl text-slate-600 hover:text-rose-500 border border-white/5 transition-colors">
          <Trash2 size={18} />
        </button>
      </div>

      {isExpanded && (
        <div className="px-8 pb-8 pt-4 border-t border-white/5 animate-in slide-in-from-top-2 duration-300 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-blue-500 uppercase flex items-center gap-2"><Move size={14}/> Técnicas</h4>
              <div className="flex flex-wrap gap-2">
                {session.positions.map((p, i) => <span key={i} className="bg-black border border-white/5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300">{p}</span>)}
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-2"><Target size={14}/> Drills</h4>
              <div className="flex flex-wrap gap-2">
                {session.drills.map((d, i) => <span key={i} className="bg-black border border-white/5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300">{d}</span>)}
              </div>
            </div>
          </div>

          {session.partners.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-purple-500 uppercase flex items-center gap-2"><Users size={14}/> Parceiros</h4>
              <div className="flex flex-wrap gap-2">
                {session.partners.map((p, i) => <span key={i} className="bg-black border border-white/5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300">{p}</span>)}
              </div>
            </div>
          )}

          {session.notes && (
            <div className="bg-black/50 p-6 rounded-2xl border border-white/5">
              <h4 className="text-[10px] font-black text-slate-500 uppercase mb-3 flex items-center gap-2"><FileText size={14}/> Notas de Treino</h4>
              <p className="text-sm text-slate-400 italic leading-relaxed">"{session.notes}"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SessionCard;
