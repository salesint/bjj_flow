
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, LayoutDashboard, Calendar as CalendarIcon, Trophy, Search, User, Clock, Filter, X } from 'lucide-react';
import { TrainingSession } from './types.ts';
import SessionCard from './components/SessionCard.tsx';
import SessionForm from './components/SessionForm.tsx';
import StatsBoard from './components/StatsBoard.tsx';
import SenseiInsight from './components/SenseiInsight.tsx';

const STORAGE_KEY = 'bjj_flow_journal_v4';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'dashboard'>('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setSessions(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const handleAddSession = (data: Omit<TrainingSession, 'id'>) => {
    const session: TrainingSession = { ...data, id: crypto.randomUUID() };
    setSessions(prev => [session, ...prev]);
    setIsFormOpen(false);
  };

  const handleDeleteSession = (id: string) => {
    if (confirm('Deseja excluir este treino?')) {
      setSessions(prev => prev.filter(s => s.id !== id));
    }
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query || 
        (s.title?.toLowerCase().includes(query)) ||
        s.positions.some(p => p.toLowerCase().includes(query)) ||
        s.type.toLowerCase().includes(query);

      const sDate = new Date(s.date).getTime();
      const start = startDate ? new Date(startDate).getTime() : -Infinity;
      const end = endDate ? new Date(endDate).getTime() : Infinity;
      const matchesDate = sDate >= start && sDate <= end;

      return matchesSearch && matchesDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sessions, searchQuery, startDate, endDate]);

  const totalTimeLabel = useMemo(() => {
    const mins = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }, [sessions]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-slate-100">
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
              <Trophy className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tighter">BJJ<span className="text-blue-500">FLOW</span></h1>
          </div>
          
          <nav className="hidden md:flex bg-zinc-900/50 p-1 rounded-2xl border border-white/5">
            <button onClick={() => setActiveTab('timeline')} className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === 'timeline' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>ATIVIDADE</button>
            <button onClick={() => setActiveTab('dashboard')} className={`px-6 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>DASHBOARD</button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] font-black text-slate-500 uppercase">Mat Time</p>
              <p className="text-sm font-black text-blue-500">{totalTimeLabel}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center">
              <User size={20} className="text-slate-400" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 pb-32">
        {activeTab === 'timeline' ? (
          <div className="space-y-8">
            {/* Added SenseiInsight component here */}
            <SenseiInsight sessions={sessions} />

            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
              <h2 className="text-3xl font-black">Meus Treinos</h2>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar técnica..."
                  className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="bg-zinc-900/50 p-6 rounded-[2rem] border border-white/5 flex flex-wrap gap-4 items-center">
              <Filter size={18} className="text-blue-500" />
              <div className="flex gap-2 flex-1 min-w-[300px]">
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-black border border-white/10 rounded-xl px-4 py-2 text-xs font-bold flex-1" />
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-black border border-white/10 rounded-xl px-4 py-2 text-xs font-bold flex-1" />
                {(startDate || endDate) && <button onClick={() => {setStartDate(''); setEndDate('');}} className="p-2 text-rose-500"><X size={20}/></button>}
              </div>
            </div>

            <div className="space-y-4">
              {filteredSessions.map(s => <SessionCard key={s.id} session={s} onDelete={handleDeleteSession} />)}
              {filteredSessions.length === 0 && (
                <div className="py-20 text-center border border-dashed border-white/10 rounded-[3rem]">
                  <CalendarIcon className="mx-auto text-zinc-800 mb-4" size={48} />
                  <p className="text-slate-500 font-bold">Nenhum treino registrado.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <StatsBoard sessions={sessions} />
        )}
      </main>

      <div className="fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none">
        <button 
          onClick={() => setIsFormOpen(true)}
          className="pointer-events-auto bg-blue-600 text-white px-8 py-4 rounded-2xl shadow-2xl shadow-blue-600/40 hover:scale-105 transition-all flex items-center gap-3 font-black text-sm tracking-widest"
        >
          <Plus size={20} strokeWidth={3} /> NOVO TREINO
        </button>
      </div>

      {isFormOpen && <SessionForm onSave={handleAddSession} onCancel={() => setIsFormOpen(false)} />}
    </div>
  );
};

export default App;
