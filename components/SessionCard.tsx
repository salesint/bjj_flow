import React, { useState } from 'react';
import { Calendar, Clock, Target, Move, FileText, Trash2, Tag, Flame, Zap, Wind, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { TrainingSession, SessionType } from '../types.ts';

interface Props {
  session: TrainingSession;
  onDelete: (id: string) => void;
}

const SessionCard: React.FC<Props> = ({ session, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getIntensityConfig = (level: number) => {
    if (level <= 2) return {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      bar: 'bg-emerald-500',
      border: 'border-emerald-500/20',
      icon: Wind,
      label: 'Leve'
    };
    if (level <= 4) return {
      text: 'text-blue-400',
      bg: 'bg-blue-500/10',
      bar: 'bg-blue-500',
      border: 'border-blue-500/20',
      icon: Zap,
      label: 'Moderado'
    };
    return {
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      bar: 'bg-rose-500',
      border: 'border-rose-500/20',
      icon: Flame,
      label: 'Intenso'
    };
  };

  const getTypeBadgeColor = (type: SessionType) => {
    switch (type) {
      case SessionType.GI: return 'bg-blue-600 text-white';
      case SessionType.NO_GI: return 'bg-zinc-800 text-slate-300';
      case SessionType.DRILL: return 'bg-emerald-600 text-white';
      case SessionType.OPEN_MAT: return 'bg-indigo-600 text-white';
      case SessionType.COMPETITION: return 'bg-rose-600 text-white';
      default: return 'bg-zinc-800 text-slate-400';
    }
  };

  const config = getIntensityConfig(session.intensity);
  const IntensityIcon = config.icon;
  const formattedDate = new Date(session.date);

  return (
    <div className={`bg-zinc-900 border ${isExpanded ? 'border-blue-500/40' : 'border-white/5'} rounded-[2.5rem] shadow-xl overflow-hidden hover:border-blue-500/30 transition-all flex flex-col md:flex-row group`}>
      {/* Sidebar Date Display */}
      <div className="hidden md:flex flex-col items-center justify-center bg-zinc-950/80 border-r border-white/5 px-6 py-4 w-32 shrink-0">
        <span className="text-[11px] font-black text-slate-600 uppercase tracking-widest">
          {formattedDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
        </span>
        <span className="text-4xl font-black text-white leading-none my-1">
          {formattedDate.getUTCDate()}
        </span>
        <span className="text-[11px] font-bold text-slate-600 uppercase">
          {formattedDate.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
        </span>
      </div>

      <div className="flex-1 p-6 md:p-8 flex flex-col">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm ${getTypeBadgeColor(session.type)}`}>
                {session.type}
              </span>
              
              {/* Intensity Visual Meter */}
              <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full border ${config.bg} ${config.border}`}>
                <IntensityIcon size={14} className={config.text} strokeWidth={2.5} />
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div 
                      key={step} 
                      className={`h-1.5 w-3.5 rounded-full transition-colors ${step <= session.intensity ? config.bar : 'bg-zinc-800'}`}
                    />
                  ))}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-tighter ${config.text} ml-1`}>
                  {config.label}
                </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-950 text-blue-400 text-[10px] font-black border border-white/5">
                <Clock size={14} strokeWidth={3} />
                {session.duration} MINUTOS
              </div>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3 mt-1">
              {session.title ? (
                <>
                  <Tag size={24} className="text-blue-500 shrink-0" strokeWidth={3} />
                  {session.title}
                </>
              ) : (
                `Treino de ${session.type}`
              )}
            </h3>
            
            <div className="md:hidden flex items-center gap-2 text-xs font-bold text-slate-500">
              <Calendar size={14} />
              {formattedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => onDelete(session.id)}
              className="text-slate-700 hover:text-rose-500 transition-colors p-2 bg-zinc-950 rounded-2xl border border-white/5"
              title="Excluir treino"
            >
              <Trash2 size={20} />
            </button>
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-2 rounded-2xl border transition-all ${isExpanded ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-950 border-white/5 text-slate-500 hover:text-blue-400'}`}
              title={isExpanded ? "Recolher" : "Ver detalhes"}
            >
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>

        {/* Collapsed Preview Info */}
        {!isExpanded && (
          <div className="mt-4 flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
             <div className="flex items-center gap-2">
                <Move size={12} className="text-blue-500" />
                {session.positions?.length || 0} Técnicas
             </div>
             <div className="flex items-center gap-2">
                <Target size={12} className="text-emerald-500" />
                {session.drills?.length || 0} Drills
             </div>
          </div>
        )}

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-10 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-blue-500 font-black text-[11px] uppercase tracking-widest">
                  <Move size={16} strokeWidth={3} />
                  Técnicas Trabalhadas
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {session.positions && session.positions.length > 0 ? (
                    session.positions.map((pos, i) => (
                      <span key={i} className="bg-zinc-950 text-slate-200 px-4 py-2 rounded-2xl text-xs font-bold border border-white/5 shadow-inner">
                        {pos}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-600 text-xs italic">Nenhuma posição registrada</span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-500 font-black text-[11px] uppercase tracking-widest">
                  <Target size={16} strokeWidth={3} />
                  Drills Realizados
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {session.drills && session.drills.length > 0 ? (
                    session.drills.map((drill, i) => (
                      <span key={i} className="bg-zinc-950 text-slate-200 px-4 py-2 rounded-2xl text-xs font-bold border border-white/5 shadow-inner">
                        {drill}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-600 text-xs italic">Nenhum drill registrado</span>
                  )}
                </div>
              </div>
            </div>

            {session.partners && session.partners.length > 0 && (
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 font-black text-[11px] uppercase tracking-widest">
                  <Users size={16} strokeWidth={3} />
                  Parceiros de Treino
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {session.partners.map((partner, i) => (
                    <span key={i} className="bg-zinc-950 text-slate-300 px-4 py-2 rounded-2xl text-xs font-bold border border-white/5 shadow-inner">
                      {partner}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {session.notes && (
              <div className="mt-10 p-6 bg-zinc-950/50 rounded-[2rem] border border-white/5">
                <div className="flex items-center gap-2 text-slate-500 font-black mb-4 text-[11px] uppercase tracking-widest">
                  <FileText size={16} strokeWidth={3} />
                  Anotações Detalhadas
                </div>
                <p className="text-sm text-slate-400 leading-relaxed font-medium italic">
                  "{session.notes}"
                </p>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-blue-500 transition-colors flex items-center gap-2"
                >
                  Recolher detalhes <ChevronUp size={14} />
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionCard;