
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, LayoutDashboard, Calendar as CalendarIcon, Trophy, Search, User, Target } from 'lucide-react';
import { TrainingSession, BeltLevel } from './types';
import SessionCard from './components/SessionCard';
import SessionForm from './components/SessionForm';
import StatsBoard from './components/StatsBoard';

const STORAGE_KEY = 'bjj_flow_journal_data_v2';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'dashboard'>('timeline');
  const [searchQuery, setSearchQuery] = useState('');

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
    if (window.confirm('Tem certeza que deseja excluir este treino? O registro é fundamental para sua evolução.')) {
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-inter selection:bg-blue-100 selection:text-blue-700">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2.5 rounded-2xl rotate-3 shadow-xl shadow-slate-900/10">
              <Trophy className="text-blue-400" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-none">BJJ<span className="text-blue-600">FLOW</span></h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Diário de Evolução Técnica</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'timeline' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              CRONOGRAMA
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${activeTab === 'dashboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              PERFORMANCE
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex flex-col items-end mr-1">
              <span className="text-xs font-black text-slate-800 leading-none">Minha Jornada</span>
              <div className="flex items-center gap-1 mt-1.5">
                {[1,2,3,4].map(i => <div key={i} className="h-1 w-3 rounded-full bg-slate-200"></div>)}
              </div>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center border-2 border-slate-800 shadow-lg">
              <User className="text-white" size={22} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 pb-24">
        {activeTab === 'timeline' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Seu Progresso</h2>
                <p className="text-slate-500 font-medium">Refletir sobre o treino é o primeiro passo para a maestria.</p>
              </div>

              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="text"
                  placeholder="Buscar título, posição, drill ou notas..."
                  className="bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-6 text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:outline-none w-full md:w-80 shadow-sm transition-all"
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
                <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                  <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <CalendarIcon className="text-slate-300" size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">Nenhum registro encontrado</h3>
                  <p className="text-slate-500 max-w-xs mx-auto mt-2">Use o botão abaixo para registrar sua primeira sessão de hoje!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
             <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Insights de Performance</h2>
              <p className="text-slate-500 font-medium">Dados reais sobre seu volume técnico e consistência.</p>
            </div>
            
            <StatsBoard sessions={sessions} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-blue-50 rounded-lg"><Target className="text-blue-600" size={20} /></div>
                  <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Mosaico de Técnicas</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(sessions.flatMap(s => [...s.positions, ...s.drills]))).slice(0, 20).map((tech, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs border border-slate-100 font-bold hover:bg-white hover:shadow-sm transition-all cursor-default">
                      {tech}
                    </span>
                  ))}
                  {sessions.length === 0 && <p className="text-sm text-slate-400 italic">O tatame aguarda seus primeiros registros.</p>}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-xl shadow-blue-600/20">
                 <h3 className="text-lg font-black mb-2">Construindo sua Faixa</h3>
                 <p className="text-blue-100 text-sm mb-6">A consistência é o segredo. Cada treino registrado é um tijolo na sua evolução.</p>
                 <div className="bg-white/10 h-3 rounded-full overflow-hidden mb-2">
                    <div className="bg-white h-full" style={{ width: `${Math.min(sessions.length * 2, 100)}%` }}></div>
                 </div>
                 <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span>{sessions.length} Treinos</span>
                    <span>Meta atual: 50 treinos</span>
                 </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-10 right-10 bg-slate-900 text-white pl-5 pr-7 py-5 rounded-3xl shadow-2xl shadow-slate-900/40 hover:bg-blue-600 hover:-translate-y-2 hover:rotate-1 transition-all z-40 flex items-center gap-3 font-black group"
      >
        <div className="bg-blue-500 p-1.5 rounded-xl group-hover:bg-white transition-colors">
          <Plus size={24} className="group-hover:text-blue-600" />
        </div>
        <span className="text-sm uppercase tracking-widest">Registrar Treino</span>
      </button>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-md border-t border-slate-100 h-20 flex items-center justify-around z-30 px-6">
        <button 
          onClick={() => setActiveTab('timeline')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'timeline' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <CalendarIcon size={22} strokeWidth={activeTab === 'timeline' ? 3 : 2} />
          <span className="text-[10px] font-black uppercase tracking-tighter">DIÁRIO</span>
        </button>
        <div className="w-12"></div> {/* Spacer for FAB */}
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <LayoutDashboard size={22} strokeWidth={activeTab === 'dashboard' ? 3 : 2} />
          <span className="text-[10px] font-black uppercase tracking-tighter">STATUS</span>
        </button>
      </nav>

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
