import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Volume2, 
  Eye, 
  Tv2, 
  ShieldCheck, 
  Info,
  CheckCircle2,
  User,
  GraduationCap,
  Sparkles,
  Save,
  RotateCcw,
  Smile,
  BookOpen,
  Briefcase,
  IdCard,
  School,
  Maximize2,
  Minimize2,
  Play
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useIFP } from '../context/IFPContext';
import { PRESET_AVATARS } from './Profile';
import { soundManager } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

export const Pengaturan: React.FC = () => {
  const { userProfile, updateUserBio } = useAuth();
  const { 
    soundEnabled, 
    toggleSound, 
    highContrast, 
    toggleHighContrast, 
    presentationMode, 
    togglePresentationMode,
    isFullscreen,
    toggleFullscreen,
    triggerHaptic 
  } = useIFP();

  const [activeTab, setActiveTab] = useState<'profil' | 'display' | 'akun'>('profil');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Profile Form State
  const [formData, setFormData] = useState({
    nama: userProfile?.nama || '',
    kelas: userProfile?.kelas || 'X RPL 1',
    jurusan: userProfile?.jurusan || 'Rekayasa Perangkat Lunak',
    nis: userProfile?.nis || '',
    nip: userProfile?.nip || '',
    mataPelajaran: userProfile?.mataPelajaran || 'Bahasa Inggris SMKN 1 Sidayu Kelas X',
    photoURL: userProfile?.photoURL || PRESET_AVATARS[0].url,
    bio: userProfile?.bio || 'Mempersiapkan kemahiran bahasa Inggris untuk karir industri global.',
    targetScore: userProfile?.targetScore || 95,
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        nama: userProfile.nama || '',
        kelas: userProfile.kelas || 'X RPL 1',
        jurusan: userProfile.jurusan || 'Rekayasa Perangkat Lunak',
        nis: userProfile.nis || '',
        nip: userProfile.nip || '',
        mataPelajaran: userProfile.mataPelajaran || 'Bahasa Inggris SMKN 1 Sidayu Kelas X',
        photoURL: userProfile.photoURL || PRESET_AVATARS[0].url,
        bio: userProfile.bio || 'Mempersiapkan kemahiran bahasa Inggris untuk karir industri global.',
        targetScore: userProfile.targetScore || 95,
      });
    }
  }, [userProfile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();
    setIsSaving(true);

    try {
      await updateUserBio({
        nama: formData.nama.trim(),
        kelas: formData.kelas,
        jurusan: formData.jurusan.trim(),
        nis: formData.nis.trim(),
        nip: formData.nip.trim(),
        mataPelajaran: formData.mataPelajaran.trim(),
        photoURL: formData.photoURL,
        bio: formData.bio.trim(),
        targetScore: Number(formData.targetScore),
      });

      setSaveSuccess(true);
      soundManager.playCorrect();
      triggerConfetti();

      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetForm = () => {
    triggerHaptic();
    if (userProfile) {
      setFormData({
        nama: userProfile.nama || '',
        kelas: userProfile.kelas || 'X RPL 1',
        jurusan: userProfile.jurusan || 'Rekayasa Perangkat Lunak',
        nis: userProfile.nis || '',
        nip: userProfile.nip || '',
        mataPelajaran: userProfile.mataPelajaran || 'Bahasa Inggris SMK Kelas X',
        photoURL: userProfile.photoURL || PRESET_AVATARS[0].url,
        bio: userProfile.bio || 'Mempersiapkan kemahiran bahasa Inggris untuk karir industri global.',
        targetScore: userProfile.targetScore || 95,
      });
    }
  };

  const testAudio = () => {
    triggerHaptic();
    soundManager.playCorrect();
    setTimeout(() => {
      soundManager.playStreak();
    }, 350);
  };

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${presentationMode ? 'scale-[1.01] origin-top' : ''}`}>
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-indigo-300 text-xs font-bold mb-2 border border-slate-700">
            <Settings className="w-3.5 h-3.5 text-indigo-400" />
            Pusat Pengaturan Sistem
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            Pengaturan Profil & Sistem IFP
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Kelola nama profil, avatar vokasi, identitas sekolah, audio interaktif, dan preferensi layar sentuh.
          </p>
        </div>

        {/* Tab Navigation Pill */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 self-stretch sm:self-auto overflow-x-auto">
          <button
            onClick={() => { triggerHaptic(); setActiveTab('profil'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === 'profil' 
                ? 'bg-amber-400 text-slate-950 shadow-md font-heading font-black' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            Setting Profil
          </button>
          <button
            onClick={() => { triggerHaptic(); setActiveTab('display'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === 'display' 
                ? 'bg-indigo-600 text-white shadow-md font-heading font-black' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tv2 className="w-4 h-4" />
            Display & IFP
          </button>
          <button
            onClick={() => { triggerHaptic(); setActiveTab('akun'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
              activeTab === 'akun' 
                ? 'bg-purple-600 text-white shadow-md font-heading font-black' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Akun & Cloud
          </button>
        </div>
      </div>

      {/* SUCCESS BANNER */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/80 text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Pengaturan profil berhasil disimpan dan disinkronkan ke Firebase Firestore!</span>
        </div>
      )}

      {/* TAB 1: SETTING PROFIL */}
      {activeTab === 'profil' && (
        <div className="space-y-6">
          {/* Identity Preview Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-tr from-amber-400 to-orange-500 p-0.5 shadow-lg shrink-0">
              <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-950 flex items-center justify-center font-heading font-black text-2xl text-white">
                {formData.photoURL ? (
                  <img 
                    src={formData.photoURL} 
                    alt={formData.nama} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = PRESET_AVATARS[0].url;
                    }}
                  />
                ) : (
                  formData.nama?.charAt(0) || 'U'
                )}
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="font-heading font-black text-xl text-white">
                  {formData.nama || 'Nama Pengguna'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {userProfile?.role || 'siswa'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {userProfile?.email}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-slate-300 font-semibold">
                {userProfile?.role === 'siswa' && (
                  <>
                    <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                      Kelas: {formData.kelas}
                    </span>
                    <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                      Jurusan: {formData.jurusan}
                    </span>
                    {formData.nis && (
                      <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                        NIS: {formData.nis}
                      </span>
                    )}
                  </>
                )}
                {userProfile?.role === 'guru' && (
                  <>
                    <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                      Mapel: {formData.mataPelajaran}
                    </span>
                    {formData.nip && (
                      <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                        NIP: {formData.nip}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="font-heading font-black text-lg sm:text-xl text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-amber-400" />
                  Formulir Pengaturan Profil Pengguna
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ubah nama, avatar vokasi, nomor induk, dan preferensi pembelajaran kejuruan.
                </p>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/60 hidden sm:inline-block">
                ● Tersinkron Realtime
              </span>
            </div>

            {/* AVATAR SELECTOR */}
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-3">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-amber-400" />
                Pilih Karakter Foto Profil Vokasi SMK (Avatar)
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {PRESET_AVATARS.map(av => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic();
                      setFormData({ ...formData, photoURL: av.url });
                    }}
                    className={`p-2.5 rounded-2xl border transition-all text-center flex flex-col items-center gap-1.5 active:scale-95 touch-manipulation ${
                      formData.photoURL === av.url 
                        ? 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400 scale-[1.03] shadow-lg shadow-amber-500/20' 
                        : 'bg-slate-900 border-slate-700/80 hover:border-slate-500'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-700">
                      <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 truncate w-full text-center">
                      {av.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Atau masukkan URL foto khusus (misal: Google Drive / CDN foto Anda):
                </label>
                <input
                  type="url"
                  value={formData.photoURL}
                  onChange={e => setFormData({ ...formData, photoURL: e.target.value })}
                  placeholder="https://images.unsplash.com/... atau URL foto"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* INPUT FIELDS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Nama Lengkap */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={e => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Masukkan nama lengkap..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white font-bold focus:outline-none focus:border-amber-400 shadow-inner"
                />
              </div>

              {/* NIS (Siswa) */}
              {userProfile?.role === 'siswa' && (
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <IdCard className="w-3.5 h-3.5 text-amber-400" />
                    Nomor Induk Siswa (NIS)
                  </label>
                  <input
                    type="text"
                    value={formData.nis}
                    onChange={e => setFormData({ ...formData, nis: e.target.value })}
                    placeholder="Contoh: 232410145"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400 shadow-inner"
                  />
                </div>
              )}

              {/* NIP (Guru) */}
              {userProfile?.role === 'guru' && (
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <IdCard className="w-3.5 h-3.5 text-amber-400" />
                    NIP / NUPTK Pengampu
                  </label>
                  <input
                    type="text"
                    value={formData.nip}
                    onChange={e => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="Contoh: 19850412 201001 1 008"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400 shadow-inner"
                  />
                </div>
              )}

              {/* Kelas (Siswa) */}
              {userProfile?.role === 'siswa' && (
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5 text-amber-400" />
                    Kelas Kejuruan *
                  </label>
                  <select
                    value={formData.kelas}
                    onChange={e => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white font-bold focus:outline-none focus:border-amber-400 shadow-inner cursor-pointer"
                  >
                    {[
                      'X RPL 1', 'X RPL 2', 
                      'X TKJ 1', 'X TKJ 2', 
                      'X AKL 1', 'X AKL 2', 
                      'X Otomotif 1', 'X Otomotif 2', 
                      'X DPIB 1', 'X DPIB 2', 
                      'X Kuliner 1', 'X DKV 1', 
                      'X Pemesinan 1', 'X Pengelasan 1'
                    ].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Jurusan */}
              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                  Jurusan / Konsentrasi Keahlian *
                </label>
                <input
                  type="text"
                  required
                  value={formData.jurusan}
                  onChange={e => setFormData({ ...formData, jurusan: e.target.value })}
                  placeholder="Contoh: Rekayasa Perangkat Lunak"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400 shadow-inner"
                />
              </div>

              {/* Mata Pelajaran (Guru) */}
              {userProfile?.role === 'guru' && (
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    Mata Pelajaran yang Diampu
                  </label>
                  <input
                    type="text"
                    value={formData.mataPelajaran}
                    onChange={e => setFormData({ ...formData, mataPelajaran: e.target.value })}
                    placeholder="Bahasa Inggris SMK Kelas X"
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400 shadow-inner"
                  />
                </div>
              )}

              {/* Target Nilai (Siswa) */}
              {userProfile?.role === 'siswa' && (
                <div>
                  <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Target Nilai Akhir Grammar (76 - 100)
                  </label>
                  <input
                    type="number"
                    min="76"
                    max="100"
                    value={formData.targetScore}
                    onChange={e => setFormData({ ...formData, targetScore: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white font-bold focus:outline-none focus:border-amber-400 shadow-inner"
                  />
                </div>
              )}

              {/* Bio / Moto */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1.5">
                  Bio Profil / Moto Belajar Bahasa Inggris
                </label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tuliskan moto atau tujuan karir kejuruan Anda..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400 shadow-inner"
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={handleResetForm}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                Reset ke Semula
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-heading font-black text-sm shadow-xl shadow-amber-500/20 hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan Profil'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: DISPLAY & IFP HARDWARE */}
      {activeTab === 'display' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="font-heading font-black text-white text-lg sm:text-xl flex items-center gap-2">
                <Tv2 className="w-5 h-5 text-indigo-400" />
                Pengaturan Papan Interaktif Digital (Interactive Flat Panel)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Optimasi hardware untuk layar sentuh 65"-86", proyektor sekolah, dan interaksi kelas.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Sound Effects */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400">
                  <Volume2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-heading font-bold text-white text-sm sm:text-base">Efek Suara Sintetis (Web Audio)</p>
                  <p className="text-xs text-slate-400">Memainkan nada lonceng (+10), buzzer salah (-2), dan arpeggio bonus streak</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={testAudio}
                  className="px-3 py-1.5 rounded-xl bg-slate-700 text-slate-200 text-xs font-bold hover:bg-slate-600 flex items-center gap-1 active:scale-95"
                  title="Uji coba suara"
                >
                  <Play className="w-3.5 h-3.5 text-amber-400" />
                  Tes
                </button>
                <button
                  onClick={() => { triggerHaptic(); toggleSound(); }}
                  className={`w-14 h-8 rounded-full transition-colors relative p-1 shrink-0 ${
                    soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            {/* High Contrast */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-heading font-bold text-white text-sm sm:text-base">Mode Kontras Tinggi (High Contrast)</p>
                  <p className="text-xs text-slate-400">Mempertegas batas kartu, teks soal, dan tombol pilihan untuk ruangan terang</p>
                </div>
              </div>
              <button
                onClick={() => { triggerHaptic(); toggleHighContrast(); }}
                className={`w-14 h-8 rounded-full transition-colors relative p-1 shrink-0 ${
                  highContrast ? 'bg-amber-400' : 'bg-slate-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  highContrast ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Presentation Mode */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400">
                  <Tv2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-heading font-bold text-white text-sm sm:text-base">Mode Presentasi Guru / Proyektor</p>
                  <p className="text-xs text-slate-400">Memperbesar elemen soal dan kartu pilihan untuk audiens jarak jauh di kelas</p>
                </div>
              </div>
              <button
                onClick={() => { triggerHaptic(); togglePresentationMode(); }}
                className={`w-14 h-8 rounded-full transition-colors relative p-1 shrink-0 ${
                  presentationMode ? 'bg-purple-500' : 'bg-slate-700'
                }`}
              >
                <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  presentationMode ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Fullscreen IFP Toggle */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400">
                  {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
                </div>
                <div>
                  <p className="font-heading font-bold text-white text-sm sm:text-base">Layar Penuh IFP (Fullscreen Mode)</p>
                  <p className="text-xs text-slate-400">Menghilangkan bilah browser untuk pengalaman papan tulis interaktif murni</p>
                </div>
              </div>
              <button
                onClick={() => { triggerHaptic(); toggleFullscreen(); }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  isFullscreen 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                {isFullscreen ? 'Keluar Fullscreen' : 'Aktifkan Fullscreen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AKUN & DATABASE CLOUD */}
      {activeTab === 'akun' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="font-heading font-black text-white text-lg sm:text-xl flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                Informasi Akun & Status Cloud Firestore
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Status sinkronisasi data pembelajaran terpusat Firebase Enterprise.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Role Terdaftar</span>
              <p className="font-heading font-black text-lg text-white capitalize">{userProfile?.role || 'siswa'}</p>
              <p className="text-xs text-slate-400">Memiliki hak akses sesuai tingkatan peran.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Status Database</span>
              <p className="font-heading font-black text-lg text-emerald-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                Terhubung Firestore
              </p>
              <p className="text-xs text-slate-400">Database ID: ai-studio-grammarchallenge</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1 sm:col-span-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase">User UID (Identitas Unik)</span>
              <p className="font-mono text-xs text-slate-300 break-all bg-slate-900 p-2 rounded-xl border border-slate-800">
                {userProfile?.uid || 'Tidak terdeteksi'}
              </p>
            </div>
          </div>

          {/* Kurikulum Merdeka Information Box */}
          <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-2">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Info className="w-4 h-4" />
              <span>Spesifikasi Kurikulum Merdeka SMKN 1 Sidayu</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Aplikasi ini dikembangkan selaras dengan Capaian Pembelajaran (CP) Bahasa Inggris Fase E untuk SMKN 1 Sidayu Kelas X, mengintegrasikan teks transaksional, recount teks praktikum bengkel dan lab, serta komunikasi instruksional di tempat kerja kejuruan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
