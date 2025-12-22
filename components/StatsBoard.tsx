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
  
  const COLORS = ['#2563eb', '#64748b', '#10b981', '#6366f1', '#f43f5e'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800">
        <h4 className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Volume Consolidado</h4>
        <div className="space-y-6">
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{sessions.length}</span>
            <span className="text-slate-400 dark:text-slate-500 text-xs font-black uppercase tracking-widest">Sessões</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 leading-none">{totalPositions}</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-2">Técnicas</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none">{totalDrills}</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-2">Drills</div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
             <div className="text-sm font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
               <span className="text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
                 {Math.round(totalMinutes / 60)} HORAS
               </span> 
               <span className="text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-widest">acumuladas</span>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 md:col-span-2">
        <h4 className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Frequência por Modalidade</h4>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData} layout="vertical" margin={{ left: 10, right: 30, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={90} 
                style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                tick={{ fill: 'currentColor', opacity: 0.7 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{fill: 'currentColor', opacity: 0.05}} 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
                  backgroundColor: '#020617',
                  color: 'white'
                }}
                itemStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
              />
              <Bar dataKey="count" radius={[0, 12, 12, 0]} barSize={32}>
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