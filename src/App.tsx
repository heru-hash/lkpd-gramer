import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { IFPProvider, useIFP } from './context/IFPContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Materi } from './pages/Materi';
import { GameHub } from './pages/GameHub';
import { TeamBattle } from './pages/TeamBattle';
import { Penilaian } from './pages/Penilaian';
import { Leaderboard } from './pages/Leaderboard';
import { Statistik } from './pages/Statistik';
import { AiQuestionGenerator } from './pages/AiQuestionGenerator';
import { AdminManagement } from './pages/AdminManagement';
import { Profile } from './pages/Profile';
import { Pengaturan } from './pages/Pengaturan';
import { AuthPage } from './pages/AuthPage';
import { GrammarCategory } from './types';

function MainApp() {
  const { userProfile, loading } = useAuth();
  const { highContrast, presentationMode } = useIFP();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [targetLevel, setTargetLevel] = useState<number | undefined>(undefined);
  const [targetCategory, setTargetCategory] = useState<GrammarCategory | undefined>(undefined);

  const handleNavigate = (tab: string, levelId?: number, categoryName?: string) => {
    setActiveTab(tab);
    if (levelId !== undefined) {
      setTargetLevel(levelId);
    } else {
      setTargetLevel(undefined);
    }
    if (categoryName) {
      setTargetCategory(categoryName as GrammarCategory);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 animate-spin flex items-center justify-center shadow-lg shadow-indigo-500/50">
          <div className="w-4 h-4 bg-white rounded-full" />
        </div>
        <p className="font-heading font-black text-lg tracking-wide text-indigo-300">
          Memuat Grammar Challenge X SMK...
        </p>
      </div>
    );
  }

  // If user is not authenticated, render login & registration page
  if (!userProfile) {
    return <AuthPage />;
  }

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      highContrast 
        ? 'bg-[#050b14] text-white' 
        : 'bg-slate-950 text-slate-100'
    } ${presentationMode ? 'font-medium' : ''}`}>
      {/* Top Interactive Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Responsive Collapsible Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            setTargetLevel(undefined);
          }}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <Dashboard onNavigate={handleNavigate} />
            )}

            {activeTab === 'materi' && (
              <Materi onStartQuiz={(cat) => handleNavigate('games', 2, cat)} />
            )}

            {activeTab === 'games' && (
              <GameHub
                key={`${targetLevel}-${targetCategory}`}
                initialLevel={targetLevel}
                initialCategory={targetCategory}
              />
            )}

            {activeTab === 'battle' && <TeamBattle />}

            {activeTab === 'penilaian' && <Penilaian />}

            {activeTab === 'leaderboard' && <Leaderboard />}

            {activeTab === 'statistik' && <Statistik />}

            {activeTab === 'ai-generator' && (
              userProfile.role === 'siswa' ? <Dashboard onNavigate={handleNavigate} /> : <AiQuestionGenerator />
            )}

            {activeTab === 'admin-panel' && (
              userProfile.role !== 'admin' ? <Dashboard onNavigate={handleNavigate} /> : <AdminManagement />
            )}

            {activeTab === 'profil' && <Profile />}

            {activeTab === 'pengaturan' && <Pengaturan />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <IFPProvider>
        <MainApp />
      </IFPProvider>
    </AuthProvider>
  );
}
