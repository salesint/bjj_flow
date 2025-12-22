import React from 'react';
import { Calendar, Clock, Activity, Target, Move, FileText, Trash2, Tag } from 'lucide-react';
import { TrainingSession, SessionType } from '../types.ts';

interface Props {
  session: TrainingSession;
  onDelete: (id: string) => void;
}

const SessionCard: React.FC<Props> = ({ session, onDelete }) => {
  const getIntensityColors = (level: number) => {
    if (level <= 2) return {
      text: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      bar: 'bg-emerald-500',
      border: 'border-emerald-200 dark:border-emerald-800/50'
    };
    if (level <= 4) return {
      text: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      bar: 'bg-orange-500',
      border: 'border-orange-200 dark:border-orange-800/50'
    };
    return {
      text: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-100 dark:bg-rose-900/30',
      bar: 'bg-rose-500',
      border: 'border-rose-200 dark:border-rose-800/50'
    };
  };

  const getTypeBadgeColor = (type: SessionType) => {
    switch (type) {
      case SessionType.GI: return 'bg-blue-600 text-white';
      case SessionType.NO_GI: return 'bg-slate-800 text-white dark:bg-slate-700';
      case SessionType.DRILL: return 'bg-emerald-500 text-white';
      case SessionType.OPEN_MAT: return 'bg-indigo-500 text-white';
      case SessionType.COMPETITION: return 'bg-rose-600 text-white';
      default: return 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const colors = getIntensityColors(session.intensity);
  const formattedDate = new Date(session.date);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all flex flex-col md:flex-row group">
      {/* Sidebar Date Display */}
      <div className="hidden md:flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/60 border-r border-slate-100 dark:border-slate-800 px-6 py-4 w-32 shrink-0">
        <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          {formattedDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
        </span>
        <span className="text-4xl font-black text-slate-900 dark:text-white leading-none my-1">
          {formattedDate.getUTCDate()}
        </span>
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">
          {formattedDate.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}
        </span>
      </div>

      <div className="flex-1 p-6 md:p-8">
        <div className="flex justify-between items-start mb-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm ${getTypeBadgeColor(session.type)}`}>
                {session.type}
              </span>
              
              {/* Intensity Visual Meter */}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${colors.bg} ${colors.border}`}>
                <Activity size={12} className={colors.text} strokeWidth={3} />
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div 
                      key={step} 
                      className={`h-1.5 w-3 rounded-full transition-colors ${step <= session.intensity ? colors.bar : 'bg-slate-200 dark:bg-slate-700'}`}
                    />
                  ))}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-tighter ${colors.text}`}>
                  NÍVEL {session.intensity}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black border border-blue-100 dark:border-blue-800/50">
                <Clock size={12} strokeWidth={3} />
                {session.duration} MINUTOS
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              {session.title ? (
                <>
                  <Tag size={20} className="text-blue-500 shrink-0" />
                  {session.title}
                </>
              ) : (
                `Treino de ${session.type}`
              )}
            </h3>
            
            <div className="md:hidden flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500">
              <Calendar size={14} />
              {formattedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          <button 
            onClick={() => onDelete(session.id)}
            className="text-slate-300 dark:text-slate-700 hover:text-rose-500 transition-colors p-2"
            title="Excluir treino"
          >
            <Trash2 size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest">
              <Move size={14} strokeWidth={3} />
              Posições e Técnicas
            </div>
            <div className="flex flex-wrap gap-2">
              {session.positions && session.positions.length > 0 ? (
                session.positions.map((pos, i) => (
                  <span key={i} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
                    {pos}
                  </span>
                ))
              ) : (
                <span className="text-slate-300 dark:text-slate-700 text-xs italic">Nenhuma posição registrada</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-black text-[10px] uppercase tracking-widest">
              <Target size={14} strokeWidth={3} />
              Drills Realizados
            </div>
            <div className="flex flex-wrap gap-2">
              {session.drills && session.drills.length > 0 ? (
                session.drills.map((drill, i) => (
                  <span key={i} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
                    {drill}
                  </span>
                ))
              ) : (
                <span className="text-slate-300 dark:text-slate-700 text-xs italic">Nenhum drill registrado</span>
              )}
            </div>
          </div>
        </div>

        {session.notes && (
          <div className="mt-8 p-5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-black mb-3 text-[10px] uppercase tracking-widest">
              <FileText size={14} strokeWidth={3} />
              Observações & Insights
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {session.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionCard;