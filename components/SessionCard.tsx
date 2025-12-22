import React from 'react';
import { Calendar, Clock, Activity, Target, Move, FileText, Trash2, Tag } from 'lucide-react';
import { TrainingSession, SessionType } from '../types';

interface Props {
  session: TrainingSession;
  onDelete: (id: string) => void;
}

const SessionCard: React.FC<Props> = ({ session, onDelete }) => {
  const getIntensityColor = (level: number) => {
    if (level <= 2) return 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 border border-green-200 dark:border-green-800';
    if (level <= 4) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800';
    return 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 border border-red-200 dark:border-red-800';
  };

  const getTypeBadgeColor = (type: SessionType) => {
    switch (type) {
      case SessionType.GI: return 'bg-blue-600 text-white';
      case SessionType.NO_GI: return 'bg-slate-800 text-white dark:bg-slate-700';
      case SessionType.DRILL: return 'bg-emerald-500 text-white';
      case SessionType.OPEN_MAT: return 'bg-purple-500 text-white';
      case SessionType.COMPETITION: return 'bg-red-600 text-white';
      default: return 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const formattedDate = new Date(session.date);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col md:flex-row">
      {/* Date Sidebar - Desktop */}
      <div className="hidden md:flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/40 border-r border-slate-100 dark:border-slate-800 px-6 py-4 w-28 shrink-0">
        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          {formattedDate.toLocaleDateString('pt-BR', { month: 'short' })}
        </span>
        <span className="text-4xl font-black text-slate-800 dark:text-white leading-none py-1">
          {formattedDate.getUTCDate()}
        </span>
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
          {formattedDate.toLocaleDateString('pt-BR', { weekday: 'short' })}
        </span>
      </div>

      <div className="flex-1 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${getTypeBadgeColor(session.type)}`}>
                {session.type}
              </span>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black ${getIntensityColor(session.intensity)}`}>
                <Activity size={10} />
                ESFORÇO {session.intensity}
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] font-black border border-slate-200 dark:border-slate-700">
                <Clock size={10} />
                {session.duration} MINUTOS
              </div>
            </div>
            
            {session.title ? (
              <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
                <Tag size={18} className="text-blue-500" />
                {session.title}
              </h3>
            ) : (
              <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
                Sessão de {session.type}
              </h3>
            )}
            
            <div className="md:hidden flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500">
              <Calendar size={12} />
              {formattedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          <button 
            onClick={() => onDelete(session.id)}
            className="text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors p-2"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-wider">
              <Move size={12} />
              Posições & Cenários
            </div>
            <div className="flex flex-wrap gap-1.5">
              {session.positions.length > 0 ? (
                session.positions.map((pos, i) => (
                  <span key={i} className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-lg text-xs font-bold border border-blue-100 dark:border-blue-800">
                    {pos}
                  </span>
                ))
              ) : (
                <span className="text-slate-300 dark:text-slate-700 text-[10px] italic">Não informado</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
              <Target size={12} />
              Drills & Repetições
            </div>
            <div className="flex flex-wrap gap-1.5">
              {session.drills.length > 0 ? (
                session.drills.map((drill, i) => (
                  <span key={i} className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-100 dark:border-emerald-800">
                    {drill}
                  </span>
                ))
              ) : (
                <span className="text-slate-300 dark:text-slate-700 text-[10px] italic">Não informado</span>
              )}
            </div>
          </div>
        </div>

        {session.notes && (
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold mb-2 text-[10px] uppercase tracking-wider">
              <FileText size={12} />
              Notas de Treino
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
              "{session.notes}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionCard;