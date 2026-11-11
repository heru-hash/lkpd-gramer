import React, { useState } from 'react';
import { 
  Gamepad2, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  Eye, 
  Tv2, 
  Bell, 
  LogOut, 
  UserCheck, 
  Menu, 
  Sparkles,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useIFP } from '../../context/IFPContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { userProfile, logout, loginAsDemo } = useAuth();
  const { 
    isFullscreen, 
    toggleFullscreen, 
    soundEnabled, 
    toggleSound, 
    highContrast, 
    toggleHighContrast,
    presentationMode,
    togglePresentationMode,
    triggerHaptic
  } = useIFP();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const roleColors: Record<UserRole, string> = {
    admin: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    guru: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    siswa: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  };

  const roleIcons: Record<UserRole, React.ReactNode> = {
    admin: <ShieldCheck className="w-4 h-4 text-rose-400" />,
    guru: <GraduationCap className="w-4 h-4 text-amber-400" />,
    siswa: <UserCheck className="w-4 h-4 text-emerald-400" />
  };

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-200 border-b backdrop-blur-md ${
      highContrast 
        ? 'bg-[#0a0f1d] border-amber-400/40 text-white' 
        : 'bg-slate-900/90 border-slate-800 text-slate-100'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Sidebar Toggle & Branding */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => { triggerHaptic(); onToggleSidebar(); }}
            className="p-2 sm:p-2.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition active:scale-95 touch-manipulation"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-2 ring-indigo-400/30">
              <Gamepad2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                  Grammar Challenge X
                </span>
                <span className="hidden md:inline-flex px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  SMK Merdeka
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Interactive Flat Panel & Touchscreen English Gaming
              </p>
            </div>
          </div>
        </div>

        {/* Right: IFP Controls & Profile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick IFP Toolbar */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 shadow-inner">
            {/* Presentation Mode */}
            <button
              onClick={() => { triggerHaptic(); togglePresentationMode(); }}
              title="Mode Presentasi Guru / Proyektor"
              className={`p-2 rounded-lg transition touch-manipulation ${
                presentationMode 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Tv2 className="w-5 h-5" />
            </button>

            {/* High Contrast */}
            <button
              onClick={() => { triggerHaptic(); toggleHighContrast(); }}
              title="Kontras Tinggi (High Contrast)"
              className={`p-2 rounded-lg transition touch-manipulation ${
                highContrast 
                  ? 'bg-yellow-400 text-slate-950 font-bold shadow-md' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
              }`}
            >
              <Eye className="w-5 h-5" />
            </button>

            {/* Sound Effects */}
            <button
              onClick={() => { triggerHaptic(); toggleSound(); }}
              title={soundEnabled ? 'Efek Suara Aktif' : 'Efek Suara Senyap'}
              className={`p-2 rounded-lg transition touch-manipulation ${
                soundEnabled 
                  ? 'text-emerald-400 hover:bg-slate-700/60' 
                  : 'text-rose-400 hover:bg-slate-700/60'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* Fullscreen */}
            <button
              onClick={() => { triggerHaptic(); toggleFullscreen(); }}
              title="Layar Penuh (Interactive Flat Panel)"
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60 transition touch-manipulation"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => { triggerHaptic(); setShowNotifications(!showNotifications); setShowRoleMenu(false); }}
              className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition"
              aria-label="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="font-heading font-bold text-white text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Pemberitahuan Kelas
                  </h4>
                  <span className="text-[11px] text-slate-400">3 Baru</span>
                </div>
                <div className="space-y-2.5 mt-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-slate-200">
                    <p className="font-semibold text-indigo-300">🔥 Tantangan Mingguan Dibuka!</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">Level 5 Grammar Race sekarang aktif dengan bonus double points.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300">
                    <p className="font-semibold text-emerald-400">🏅 Papan Peringkat Diperbarui</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">Kelas X RPL 1 memimpin perolehan skor tertinggi minggu ini!</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Quick Role Switch */}
          <div className="relative">
            <button
              onClick={() => { triggerHaptic(); setShowRoleMenu(!showRoleMenu); setShowNotifications(false); }}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/70 transition"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-indigo-700 flex items-center justify-center font-bold text-white text-sm ring-1 ring-white/20">
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} alt={userProfile.nama} className="w-full h-full object-cover" />
                ) : (
                  userProfile?.nama?.charAt(0) || 'U'
                )}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold text-white leading-tight max-w-[120px] truncate">
                  {userProfile?.nama || 'Tamu SMK'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`px-1.5 py-0.2 text-[10px] uppercase font-bold rounded border ${
                    roleColors[userProfile?.role || 'siswa']
                  }`}>
                    {userProfile?.role || 'siswa'}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[70px]">
                    {userProfile?.kelas || 'X RPL'}
                  </span>
                </div>
              </div>
            </button>

            {/* Quick Demo Switcher & Profile Dropdown */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="p-2 border-b border-slate-800">
                  <p className="text-xs font-semibold text-slate-400">Sedang Masuk Sebagai</p>
                  <p className="text-sm font-bold text-white mt-0.5 flex items-center gap-2">
                    {roleIcons[userProfile?.role || 'siswa']}
                    {userProfile?.nama}
                  </p>
                  <p className="text-[11px] text-indigo-400 mt-0.5">{userProfile?.email}</p>
                </div>

                {/* Secure Simulation Switcher (Only visible to authenticated Administrator) */}
                {userProfile?.role === 'admin' ? (
                  <div className="py-2 border-b border-slate-800">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                      Simulasi Peran (Khusus Admin)
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => { triggerHaptic(); loginAsDemo('siswa'); setShowRoleMenu(false); }}
                        className="p-2 rounded-xl text-center text-xs font-bold transition flex flex-col items-center gap-1 bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 active:scale-95"
                      >
                        <UserCheck className="w-4 h-4 text-emerald-400" />
                        <span>Siswa</span>
                      </button>
                      <button
                        onClick={() => { triggerHaptic(); loginAsDemo('guru'); setShowRoleMenu(false); }}
                        className="p-2 rounded-xl text-center text-xs font-bold transition flex flex-col items-center gap-1 bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 active:scale-95"
                      >
                        <GraduationCap className="w-4 h-4 text-amber-400" />
                        <span>Guru</span>
                      </button>
                      <button
                        onClick={() => { triggerHaptic(); loginAsDemo('admin'); setShowRoleMenu(false); }}
                        className="p-2 rounded-xl text-center text-xs font-bold transition flex flex-col items-center gap-1 bg-rose-600 text-white border border-rose-400 active:scale-95 shadow-sm"
                      >
                        <ShieldCheck className="w-4 h-4 text-rose-200" />
                        <span>Admin</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-2.5 px-2 border-b border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Status Akun:</span>
                      <span className="text-emerald-400 font-bold">Terverifikasi Aktif</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Hak Akses:</span>
                      <span className="text-white font-bold uppercase">{userProfile?.role}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => { triggerHaptic(); logout(); setShowRoleMenu(false); }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition border border-rose-500/20"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar Sistem
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
