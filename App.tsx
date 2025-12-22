import React, { useState, useEffect, useMemo } from 'react';
import { Plus, LayoutDashboard, Calendar as CalendarIcon, Trophy, Search, User, Sun, Moon } from 'lucide-react';
import { TrainingSession } from './types';
import SessionCard from './components/SessionCard';
import SessionForm from './components/SessionForm';
import StatsBoard from './components/StatsBoard';

const STORAGE_KEY = 'bjj_flow_journal_data_v2';
const THEME_KEY = 'bjj_flow_theme';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'dashboard'>('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    // Default to dark if not set
    return savedTheme ? savedTheme === 'dark' : true;
  });

  // Load data on mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setSessions(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to load sessions", e);
      }
    }
  }, []);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDarkMode]);

  // Save data on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const handleAddSession = (newSessionData: Omit<TrainingSession, 'id'>) => {
    const newSession: TrainingSession = {
      ...newSessionData,
      id: crypto.randomUUID(),
    };
    setSessions([newSession, ...sessions]);
    setIsFormOpen(false);
  };

  const handleDeleteSession = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este treino?')) {
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  const filteredSessions = useMemo(() => {
    return sessions.filter(s => 
      (s.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      s.positions.some(p => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.drills.some(d => d.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.type.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sessions, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col font-inter transition-colors duration-300 dark:bg-slate-950">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 dark:bg-blue-600 p-2.5 rounded-2xl rotate-3 shadow-xl">
              <Trophy className="text-blue-400 dark:text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 dark:text-white tracking-tighter leading-none">BJJ<span className="text-blue-600 dark:text-blue-400">FLOW</span></h1>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Diário Técnico</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'timeline' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-400 dark:text-slate-500'}`}
            >
              CRONOGRAMA
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'dashboard' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-400 dark:text-slate-500'}`}
            >
              PERFORMANCE
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
              aria-label="Alternar modo escuro"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-700 flex items-center justify-center border border-slate-800 dark:border-slate-600">
              <User className="text-white" size={20} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 pb-24">
        {activeTab === 'timeline' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Evolução Diária</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Registro didático das suas sessões de treino.</p>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Pesquisar técnicas ou notas..."
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-full md:w-72 shadow-sm transition-all dark:text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
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
                <div className="py-24 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                  <CalendarIcon className="text-slate-300 dark:text-slate-700 mx-auto mb-4" size={48} />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Sem treinos registrados</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sua jornada começa com o primeiro registro.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-10 animate-in fade-in duration-500">
             <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Status de Performance</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Visão geral do seu volume técnico acumulado.</p>
            </div>
            
            <StatsBoard sessions={sessions} />
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-blue-500/20 hover:bg-blue-500 hover:scale-105 transition-all z-40 flex items-center gap-3 font-black"
      >
        <Plus size={24} />
        <span className="text-sm uppercase tracking-widest hidden sm:inline">Novo Treino</span>
      </button>

      {/* Modal Form */}
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