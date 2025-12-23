
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrainingSession, SessionType } from '../types.ts';

interface Props {
  sessions: TrainingSession[];
}

const StatsBoard: React.FC<Props> = ({ sessions }) => {
  const typeData = Object.values(SessionType).map(type => ({
    name: type,
    count: sessions.filter(s => s.type === type).length
  })).filter(d => d.count > 0);

  const totalHours = Math.floor(sessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60);
  const totalTeks = sessions.reduce((acc, s) => acc + s.positions.length, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-zinc-900 border border-white/5 p-8 rounded-[2.5rem] space-y-8">
        <div>
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Consistência</h4>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-white">{sessions.length}</span>
            <span className="text-xs font-black text-slate-600 uppercase">Treinos</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-white/5">
          <div>
            <div className="text-2xl font-black text-blue-500">{totalHours}h</div>
            <div className="text-[9px] font-black text-slate-600 uppercase">Tempo</div>
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-500">{totalTeks}</div>
            <div className="text-[9px] font-black text-slate-600 uppercase">Técnicas</div>
          </div>
        </div>
      </div>

      <div className="md:col-span-2 bg-zinc-900 border border-white/5 p-8 rounded-[2.5rem]">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Frequência por Modalidade</h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" tick={{fill: '#64748b', fontWeight: 900, fontSize: 10}} axisLine={false} tickLine={false} width={80} />
              <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px'}} />
              <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={32}>
                {typeData.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? '#3b82f6' : '#1d4ed8'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsBoard;
