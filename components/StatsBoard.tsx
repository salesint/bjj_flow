import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrainingSession, SessionType } from '../types.ts';

interface Props {
  sessions: TrainingSession[];
}

const StatsBoard: React.FC<Props> = ({ sessions }) => {
  if (sessions.length === 0) return null;

  const typeData = Object.values(SessionType).map(type => ({
    name: type,
    count: sessions.filter(s => s.type === type).length
  })).filter(d => d.count > 0);

  const totalMinutes = sessions.reduce((acc, s) => acc + (Number(s.duration) || 0), 0);
  const totalPositions = sessions.reduce((acc, s) => acc + (s.positions?.length || 0), 0);
  const totalDrills = sessions.reduce((acc, s) => acc + (s.drills?.length || 0), 0);
  
  const COLORS = ['#3b82f6', '#1d4ed8', '#10b981', '#6366f1', '#f43f5e'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      <div className="bg-zinc-900 p-8 rounded-[3rem] shadow-xl border border-white/5">
        <h4 className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Volume Consolidado</h4>
        <div className="space-y-8">
          <div className="flex items-baseline gap-3">
            <span className="text-7xl font-black text-white tracking-tighter leading-none">{sessions.length}</span>
            <span className="text-slate-600 text-xs font-black uppercase tracking-widest">Sessões</span>
          </div>
          
          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
            <div>
              <div className="text-3xl font-black text-blue-500 leading-none">{totalPositions}</div>
              <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-3">Técnicas</div>
            </div>
            <div>
              <div className="text-3xl font-black text-emerald-500 leading-none">{totalDrills}</div>
              <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-3">Drills</div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
             <div className="flex flex-col gap-2">
               <span className="text-blue-500 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-2xl text-lg font-black w-fit">
                 {Math.round(totalMinutes / 60)} HORAS
               </span> 
               <span className="text-slate-600 uppercase text-[10px] tracking-[0.2em] font-black ml-1">No tatame</span>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 p-8 rounded-[3rem] shadow-xl border border-white/5 md:col-span-2">
        <h4 className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] mb-8">Modalidades Praticadas</h4>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={100} 
                style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                tick={{ fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{fill: '#1e293b', opacity: 0.3}} 
                contentStyle={{ 
                  borderRadius: '24px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.8)',
                  backgroundColor: '#000000',
                  color: 'white'
                }}
                itemStyle={{ color: '#3b82f6', fontSize: '12px', fontWeight: 'black' }}
              />
              <Bar dataKey="count" radius={[0, 16, 16, 0]} barSize={40}>
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsBoard;