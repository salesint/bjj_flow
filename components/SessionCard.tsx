
import React from 'react';
import { Calendar, Clock, Activity, Users, Target, Move, FileText, Trash2, Tag } from 'lucide-react';
import { TrainingSession, SessionType } from '../types';

interface Props {
  session: TrainingSession;
  onDelete: (id: string) => void;
}

const SessionCard: React.FC<Props> = ({ session, onDelete }) => {
  const getIntensityColor = (level: number) => {
    if (level <= 2) return 'bg-green-100 text-green-700';
    if (level <= 4) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const getTypeBadgeColor = (type: SessionType) => {
    switch (type) {
      case SessionType.GI: return 'bg-blue-600 text-white';
      case SessionType.NO_GI: return 'bg-slate-800 text-white';
      case SessionType.DRILL: return 'bg-emerald-500 text-white';
      case SessionType.OPEN_MAT: return 'bg-purple-500 text-white';
      case SessionType.COMPETITION: return 'bg-red-600 text-white';
      default: return 'bg-slate-200 text-slate-700';
    }
  };

  const formattedDate = new Date(session.date);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col md:flex-row group">
      {/* Date Sidebar - Desktop */}
      <div className="hidden md:flex flex-col items-center justify-center bg-slate-50 border-r border-slate-100 px-6 py-4 w-32 shrink-0 group-hover:bg-slate-100/50 transition-colors">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          {formattedDate.toLocaleDateString('pt-BR', { month: 'short' })}
        </span>
        <span className="text-4xl font-black text-slate-800 leading-none py-1">
          {formattedDate.getDate() + 1}
        </span>
        <span className="text-[10px] font-bold text-slate-500 uppercase">
          {formattedDate.toLocaleDateString('pt-BR', { weekday: 'short' })}
        </span>
      </div>

      <div className="flex-1 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getTypeBadgeColor(session.type)}`}>
                {session.type}
              </span>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${getIntensityColor(session.intensity)}`}>
                <Activity size={10} />
                Nível {session.intensity}
              </div>
            </div>
            
            {/* Title or Dynamic Label */}
            {session.title ? (
              <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                <Tag size={18} className="text-blue-500 hidden sm:inline" />
                {session.title}
              </h3>
            ) : (
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                Sessão de {session.type}
              </h3>
            )}
            
            <div className="md:hidden flex items-center gap-2 text-xs font-bold text-slate-400">
              <Calendar size={12} />
              {formattedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          <button 
            onClick={() => onDelete(session.id)}
            className="text-slate-200 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
            title="Excluir treino"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Section: Positions */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-wider">
              <Move size={12} />
              Cenários & Posições
            </div>
            <div className="flex flex-wrap gap-1.5">
              {session.positions.length > 0 ? (
                session.positions.map((pos, i) => (
                  <span key={i} className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-blue-100">
                    {pos}
                  </span>
                ))
              ) : (
                <span className="text-slate-300 text-[10px] italic">Não especificado</span>
              )}
            </div>
          </div>

          {/* Section: Drills */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-wider">
              <Target size={12} />
              Repetições & Técnicas
            </div>
            <div className="flex flex-wrap gap-1.5">
              {session.drills.length > 0 ? (
                session.drills.map((drill, i) => (
                  <span key={i} className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-100">
                    {drill}
                  </span>
                ))
              ) : (
                <span className="text-slate-300 text-[10px] italic">Não especificado</span>
              )}
            </div>
          </div>
        </div>

        {/* Section: Observations */}
        {session.notes && (
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-all">
            <div className="flex items-center gap-2 text-slate-400 font-bold mb-2 text-[10px] uppercase tracking-wider">
              <FileText size={12} />
              Observações Didáticas
            </div>
            <p className="text-sm text-slate-600 leading-relaxed italic">
              "{session.notes}"
            </p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[10px] text-slate-400 font-black uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <Clock size={12} />
              {session.duration} min de tatame
            </div>
            {session.partners.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Users size={12} />
                {session.partners.length} {session.partners.length === 1 ? 'Parceiro' : 'Parceiros'}
              </div>
            )}
          </div>
          
          {session.partners.length > 0 && (
             <div className="flex -space-x-2">
                {session.partners.slice(0, 4).map((p, i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500" title={p}>
                    {p.charAt(0).toUpperCase()}
                  </div>
                ))}
                {session.partners.length > 4 && (
                   <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400">
                    +{session.partners.length - 4}
                  </div>
                )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionCard;