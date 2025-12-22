
import React, { useState } from 'react';
import { Sparkles, RefreshCw, MessageCircle } from 'lucide-react';
import { getTechnicalInsights } from '../services/geminiService';
import { TrainingSession } from '../types';

interface Props {
  sessions: TrainingSession[];
}

const SenseiInsight: React.FC<Props> = ({ sessions }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsight = async () => {
    setLoading(true);
    const result = await getTechnicalInsights(sessions);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl p-6 text-white shadow-xl mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-500/20 p-2 rounded-lg">
            <MessageCircle className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Sensei AI Insight</h3>
            <p className="text-xs text-blue-200">Análise técnica baseada no seu progresso</p>
          </div>
        </div>

        {insight ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-4 border border-white/10">
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {insight}
            </p>
          </div>
        ) : (
          <p className="text-sm text-blue-100 mb-6 italic">
            "A técnica supera a força. Deixe-me analisar seus últimos treinos e apontar o caminho."
          </p>
        )}

        <button 
          onClick={fetchInsight}
          disabled={loading || sessions.length === 0}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-4 py-2 rounded-lg font-bold text-sm"
        >
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
          {insight ? 'Recalcular Análise' : 'Pedir Feedback do Mestre'}
        </button>
        
        {sessions.length === 0 && (
          <p className="text-[10px] text-blue-300 mt-2">Registre pelo menos um treino para receber insights.</p>
        )}
      </div>
    </div>
  );
};

export default SenseiInsight;
