import React, { useState, useEffect, useMemo } from 'react';
import { Plus, LayoutDashboard, Calendar as CalendarIcon, Trophy, Search, User, Sun, Moon, Clock, Filter, X } from 'lucide-react';
import { TrainingSession } from './types.ts';
import SessionCard from './components/SessionCard.tsx';
import SessionForm from './components/SessionForm.tsx';
import StatsBoard from './components/StatsBoard.tsx';

const STORAGE_KEY = 'bjj_flow_journal_data_v2';
const THEME_KEY = 'bjj_flow_theme';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'dashboard'>('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Initialize theme from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Load initial data
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setSessions(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse sessions", e);
      }
    }
  }, []);

  // Theme synchronization
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDarkMode]);

  // Save data persistence
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const handleAddSession = (newSessionData: Omit<TrainingSession, 'id'>) => {
    const newSession: TrainingSession = {
      ...newSessionData,
      id: crypto.randomUUID(),
    };
    setSessions(prev => [newSession, ...prev]);
    setIsFormOpen(false);
  };

  const handleDeleteSession = (id: string) => {
    if (window.confirm('Excluir este treino permanentemente?')) {
      setSessions(prev => prev.filter(s => s.id !== id));
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      const matchesSearch = (s.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        s.positions.some(p => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
        s.drills.some(d => d.toLowerCase().includes(searchQuery.toLowerCase())) ||
        s.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.type.toLowerCase().includes(searchQuery.toLowerCase());

      const sessionDate = new Date(s.date).getTime();
      const start = startDate ? new Date(startDate).getTime() : -Infinity;
      const end = endDate ? new Date(endDate).getTime() : Infinity;
      
      const matchesDate = sessionDate >= start && sessionDate <= end;

      return matchesSearch && matchesDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sessions, searchQuery, startDate, endDate]);

  const totalTimeLabel = useMemo(() => {
    const mins = sessions.reduce((acc, s) => acc + (Number(s.duration) || 0), 0);
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hours}h ${remainingMins}m`;
  }, [sessions]);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 bg-slate-50 dark:bg-slate-950">
      {/* Header Navigation */}
      <header className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl rotate-3 shadow-lg shadow-blue-500/20">
              <Trophy className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">BJJ<span className="text-blue-600">FLOW</span></h1>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Journal de Treino</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button 
              onClick={() => setActiveTab('timeline')}
              className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'timeline' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-500'}`}
            >
              ATIVIDADE
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'dashboard' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-500'}`}
            >
              ESTATÍSTICAS
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-blue-600 flex items-center justify-center shadow-lg">
              <User className="text-white" size={20} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 pb-32">
        {activeTab === 'timeline' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Cronograma de Treinos</h2>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-bold text-sm mt-1">
                  <Clock size={16} className="text-blue-500" />
                  <span>{totalTimeLabel} totais de mat time</span>
                </div>
              </div>

              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input 
                  type="text"
                  placeholder="Buscar técnicas, posições..."
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full md:w-80 shadow-sm transition-all dark:text-white font-bold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Date Filters Row */}
            <div className="bg-white dark:bg-slate-900 p-4 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center gap-3 shrink-0">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl border border-blue-100 dark:border-blue-800/50">
                  <Filter size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Filtrar Período</span>
              </div>

              <div className="flex flex-1 items-center gap-3 w-full">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">De</span>
                  <input 
                    type="date" 
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs font-bold dark:text-white transition-all focus:ring-2 focus:ring-blue-500 outline-none"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">Até</span>
                  <input 
                    type="date" 
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs font-bold dark:text-white transition-all focus:ring-2 focus:ring-blue-500 outline-none"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                {(startDate || endDate || searchQuery) && (
                  <button 
                    onClick={clearFilters}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Limpar filtros"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {filteredSessions.length > 0 ? (
                filteredSessions.map(session => (
                  <SessionCard 
                    key={session.id} 
                    session={session} 
                    onDelete={handleDeleteSession}
                  />
                ))
              ) : (
                <div className="py-24 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800">
                  <CalendarIcon className="text-slate-200 dark:text-slate-800 mx-auto mb-4" size={64} />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Nenhum treino encontrado</h3>
                  <p className="text-slate-500 dark:text-slate-500 text-sm mt-2 max-w-xs mx-auto">
                    {searchQuery || startDate || endDate ? 'Tente ajustar seus filtros para encontrar o que procura.' : 'Sua jornada de evolução técnica começa aqui.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-10">
             <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Análise de Performance</h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-wide mt-1">Sua consistência em dados</p>
            </div>
            <StatsBoard sessions={sessions} />
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none flex justify-center md:justify-end">
        <button 
          onClick={() => setIsFormOpen(true)}
          className="pointer-events-auto bg-blue-600 text-white px-8 py-5 rounded-2xl shadow-2xl shadow-blue-500/40 hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all z-40 flex items-center gap-3 font-black text-sm uppercase tracking-widest"
        >
          <Plus size={24} />
          Novo Registro
        </button>
      </div>

      {isFormOpen && (
        <SessionForm 
          onSave={handleAddSession} 
          onCancel={() => setIsFormOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;