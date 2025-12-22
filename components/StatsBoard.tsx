
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrainingSession, SessionType } from '../types';

interface Props {
  sessions: TrainingSession[];
}

const StatsBoard: React.FC<Props> = ({ sessions }) => {
  if (sessions.length === 0) return null;

  // Process data for charts
  const typeData = Object.values(SessionType).map(type => ({
    name: type,
    count: sessions.filter(s => s.type === type).length
  })).filter(d => d.count > 0);

  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
  const totalPositions = sessions.reduce((acc, s) => acc + s.positions.length, 0);
  const totalDrills = sessions.reduce((acc, s) => acc + s.drills.length, 0);
  
  const COLORS = ['#2563eb', '#334155', '#10b981', '#a855f7', '#f59e0b'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <h4 className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">Volume Total</h4>
        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-slate-800 dark:text-white">{sessions.length}</span>
            <span className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase">Treinos</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 dark:border-slate-800">
            <div>
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400 leading-none">{totalPositions}</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1">Posições</div>
            </div>
            <div>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 leading-none">{totalDrills}</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase mt-1">Drills</div>
            </div>
          </div>

          <div className="pt-2">
             <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
               {Math.round(totalMinutes / 60)}h <span className="text-slate-400 dark:text-slate-500 font-normal italic">no tatame</span>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 md:col-span-2 transition-colors">
        <h4 className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">Frequência por Modalidade</h4>
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" className="dark:opacity-10" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={90} 
                style={{ fontSize: '10px', fontWeight: 'bold' }}
                tick={{ fill: 'currentColor', opacity: 0.6 }}
              />
              <Tooltip 
                cursor={{fill: '#f8fafc', opacity: 0.1}} 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  backgroundColor: 'var(--tw-slate-900)',
                  color: 'white'
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={24}>
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
