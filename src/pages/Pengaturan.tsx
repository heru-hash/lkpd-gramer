import React from 'react';
import { 
  Settings, 
  Volume2, 
  Eye, 
  Tv2, 
  Smartphone, 
  ShieldCheck, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { useIFP } from '../context/IFPContext';

export const Pengaturan: React.FC = () => {
  const { 
    soundEnabled, 
    toggleSound, 
    highContrast, 
    toggleHighContrast, 
    presentationMode, 
    togglePresentationMode,
    triggerHaptic 
  } = useIFP();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-bold mb-2 border border-slate-700">
            <Settings className="w-3.5 h-3.5" />
            Konfigurasi Pembelajaran
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            Pengaturan Aplikasi & Perangkat IFP
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Sesuaikan audio, kontras layar, mode proyektor, dan preferensi tampilan interaktif.
          </p>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <h3 className="font-heading font-bold text-white text-lg border-b border-slate-800 pb-3">
          Pengaturan Papan Interaktif Digital (Interactive Flat Panel)
        </h3>

        <div className="space-y-4">
          {/* Sound Effects */}
          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-heading font-bold text-white text-sm">Efek Suara Sintetis (Web Audio)</p>
                <p className="text-xs text-slate-400">Memainkan lonceng benar (+10), buzzer salah (-2), dan fanfare kemenangan</p>
              </div>
            </div>
            <button
              onClick={() => { triggerHaptic(); toggleSound(); }}
              className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
                soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* High Contrast */}
          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <p className="font-heading font-bold text-white text-sm">Mode Kontras Tinggi (High Contrast)</p>
                <p className="text-xs text-slate-400">Meningkatkan visibilitas teks tajam di proyektor dan layar besar</p>
              </div>
            </div>
            <button
              onClick={() => { triggerHaptic(); toggleHighContrast(); }}
              className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
                highContrast ? 'bg-amber-400' : 'bg-slate-700'
              }`}
            >
              <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                highContrast ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {/* Presentation Mode */}
          <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <Tv2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-heading font-bold text-white text-sm">Mode Presentasi Guru / Proyektor</p>
                <p className="text-xs text-slate-400">Memperbesar elemen soal dan kartu pilihan untuk audiens jarak jauh</p>
              </div>
            </div>
            <button
              onClick={() => { triggerHaptic(); togglePresentationMode(); }}
              className={`w-14 h-8 rounded-full transition-colors relative p-1 ${
                presentationMode ? 'bg-purple-500' : 'bg-slate-700'
              }`}
            >
              <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                presentationMode ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </div>

        {/* Kurikulum Merdeka Information Box */}
        <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-2">
          <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
            <Info className="w-4 h-4" />
            <span>Spesifikasi Kurikulum Merdeka</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Aplikasi ini dikembangkan selaras dengan Capaian Pembelajaran (CP) Bahasa Inggris Fase E untuk SMK Kelas X, mengintegrasikan teks transaksional, recount teks praktikum, dan komunikasi instruksional di tempat kerja kejuruan.
          </p>
        </div>
      </div>
    </div>
  );
};
