import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Gamepad2, 
  Swords, 
  Award, 
  Trophy, 
  BarChart3, 
  Sparkles, 
  Settings, 
  User, 
  ShieldAlert, 
  X,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useIFP } from '../../context/IFPContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
}) => {
  const { userProfile } = useAuth();
  const { triggerHaptic, highContrast } = useIFP();

  const role = userProfile?.role || 'siswa';

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null, roles: ['admin', 'guru', 'siswa'] },
    { id: 'materi', label: 'Materi Grammar', icon: BookOpen, badge: '6 Modul', roles: ['admin', 'guru', 'siswa'] },
    { id: 'games', label: 'Game Grammar', icon: Gamepad2, badge: '6 Level', roles: ['admin', 'guru', 'siswa'] },
    { id: 'battle', label: 'Team Battle IFP', icon: Swords, badge: 'Live', roles: ['admin', 'guru', 'siswa'], highlight: true },
    { id: 'penilaian', label: 'Penilaian & Nilai', icon: Award, badge: null, roles: ['admin', 'guru', 'siswa'] },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, badge: 'Top 10', roles: ['admin', 'guru', 'siswa'] },
    { id: 'statistik', label: 'Statistik & Analitik', icon: BarChart3, badge: null, roles: ['admin', 'guru', 'siswa'] },
    { id: 'ai-generator', label: 'AI Generator Soal', icon: Sparkles, badge: 'AI', roles: ['admin', 'guru'] },
    { id: 'admin-panel', label: 'Kelola Sistem', icon: ShieldAlert, badge: 'Admin', roles: ['admin'] },
    { id: 'profil', label: 'Profil Siswa / Guru', icon: User, badge: null, roles: ['admin', 'guru', 'siswa'] },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings, badge: null, roles: ['admin', 'guru', 'siswa'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  const handleSelect = (id: string) => {
    triggerHaptic();
    onSelectTab(id);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile/Tablet Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 transition-all duration-300 ease-in-out flex flex-col border-r ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${
        highContrast 
          ? 'bg-[#080d1a] border-amber-400/40 text-white' 
          : 'bg-slate-900 border-slate-800 text-slate-200'
      }`}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-indigo-400" />
            <span className="font-heading font-bold text-white text-base">Menu Navigasi</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Kurikulum Merdeka Badge */}
        <div className="p-4 mx-3 mt-3 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-pink-900/20 border border-indigo-700/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-300">
              SMKN 1 Sidayu • Fase E
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
          <p className="text-xs font-bold text-white mt-1">
            Grammar Challenge Hub
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            SMKN 1 Sidayu • IFP Optimized
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-700">
          {filteredItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-semibold text-sm transition-all active:scale-[0.98] touch-manipulation ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 font-bold'
                    : item.highlight
                    ? 'bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-200 border border-indigo-700/40'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-xl ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-indigo-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : item.badge === 'Live'
                        ? 'bg-rose-500 text-white animate-pulse'
                        : item.badge === 'AI'
                        ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-white" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500 font-medium">
            Grammar Challenge X SMK v2.0
          </p>
          <p className="text-[10px] text-indigo-400 mt-0.5">
            Designed for IFP & Touchscreen
          </p>
        </div>
      </aside>
    </>
  );
};
