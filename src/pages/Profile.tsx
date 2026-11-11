import React, { useState, useEffect } from 'react';
import { 
  User, 
  Award, 
  Flame, 
  Edit3, 
  Save, 
  CheckCircle2, 
  Sparkles, 
  GraduationCap, 
  ShieldCheck,
  Trophy,
  Target,
  Smile,
  Image,
  BookOpen,
  Briefcase,
  IdCard,
  School,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useIFP } from '../context/IFPContext';
import { triggerConfetti } from '../utils/confetti';
import { soundManager } from '../utils/audio';

// Pre-curated high quality vocational avatar icons
export const PRESET_AVATARS = [
  { id: 'av-1', label: 'Programmer RPL', icon: '💻', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'av-2', label: 'Teknisi Jaringan TKJ', icon: '🌐', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
  { id: 'av-3', label: 'Spesialis Otomotif', icon: '🔧', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { id: 'av-4', label: 'Akuntan Perbankan', icon: '📊', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { id: 'av-5', label: 'Arsitek Desain DPIB', icon: '📐', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { id: 'av-6', label: 'Master Chef Kuliner', icon: '👨‍🍳', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
];

export const Profile: React.FC = () => {
  const { userProfile, updateUserBio } = useAuth();
  const { triggerHaptic, presentationMode } = useIFP();

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State initialized from userProfile
  const [formData, setFormData] = useState({
    nama: userProfile?.nama || '',
    kelas: userProfile?.kelas || 'X RPL 1',
    jurusan: userProfile?.jurusan || 'Rekayasa Perangkat Lunak',
    nis: userProfile?.nis || '',
    nip: userProfile?.nip || '',
    mataPelajaran: userProfile?.mataPelajaran || 'Bahasa Inggris SMK Kelas X',
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
        mataPelajaran: userProfile.mataPelajaran || 'Bahasa Inggris SMK Kelas X',
        photoURL: userProfile.photoURL || PRESET_AVATARS[0].url,
        bio: userProfile.bio || 'Mempersiapkan kemahiran bahasa Inggris untuk karir industri global.',
        targetScore: userProfile.targetScore || 95,
      });
    }
  }, [userProfile]);

  const BADGES = [
    { id: 'b1', name: '🏅 Beginner', desc: 'Selesaikan tantangan kuis grammar pertama Anda', minScore: 0, unlocked: true },
    { id: 'b2', name: '🏅 Explorer', desc: 'Akumulasi total 100 poin pada game grammar', minScore: 100, unlocked: true },
    { id: 'b3', name: '🏅 Grammar Hero', desc: 'Raih total skor 300 poin dan pertahankan streak', minScore: 300, unlocked: true },
    { id: 'b4', name: '🏅 Grammar Master', desc: 'Kuasai 6 level tantangan hingga skor 600', minScore: 600, unlocked: true },
    { id: 'b5', name: '🏅 Champion', desc: 'Peringkat elit sekolah dengan skor di atas 1000 poin', minScore: 1000, unlocked: true },
  ];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();

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

    setIsEditing(false);
    setSaveSuccess(true);
    soundManager.playCorrect();
    triggerConfetti();

    setTimeout(() => setSaveSuccess(false), 3500);
  };

  const roleLabel = {
    admin: 'Administrator Sistem',
    guru: 'Guru Pengampu SMK',
    siswa: 'Siswa Kelas X SMK',
  }[userProfile?.role || 'siswa'];

  const roleBadgeColor = {
    admin: 'bg-rose-500 text-white shadow-rose-500/30',
    guru: 'bg-amber-500 text-slate-950 shadow-amber-500/30',
    siswa: 'bg-emerald-500 text-slate-950 shadow-emerald-500/30',
  }[userProfile?.role || 'siswa'];

  return (
    <div className={`max-w-4xl mx-auto space-y-6 ${presentationMode ? 'scale-[1.01] origin-top' : ''}`}>
      {/* Profile Overview Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with Ring */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-1 shadow-2xl">
              <div className="w-full h-full rounded-[22px] overflow-hidden bg-slate-950 flex items-center justify-center font-heading font-black text-white text-3xl sm:text-4xl">
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
            <div className={`absolute -bottom-2 -right-2 px-3 py-0.5 rounded-xl font-heading font-black text-xs shadow-md uppercase tracking-wider ${roleBadgeColor}`}>
              {userProfile?.role || 'siswa'}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
                  {userProfile?.nama || 'Pengguna SMK'}
                  {userProfile?.role === 'admin' ? (
                    <ShieldCheck className="w-6 h-6 text-rose-400" />
                  ) : userProfile?.role === 'guru' ? (
                    <GraduationCap className="w-6 h-6 text-amber-400" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                  )}
                </h1>
                <p className="text-xs sm:text-sm text-indigo-400 mt-0.5 font-semibold">
                  {userProfile?.email}
                </p>
                <p className="text-xs text-slate-300 mt-1 italic max-w-xl">
                  "{formData.bio}"
                </p>
              </div>

              <button
                onClick={() => { triggerHaptic(); setIsEditing(!isEditing); }}
                className={`px-5 py-2.5 rounded-2xl font-heading font-bold text-xs sm:text-sm border transition flex items-center justify-center gap-2 active:scale-95 touch-manipulation self-center sm:self-start shadow-md ${
                  isEditing 
                    ? 'bg-rose-600/20 text-rose-300 border-rose-500/40 hover:bg-rose-600/30' 
                    : 'bg-indigo-600 text-white border-indigo-400 hover:bg-indigo-500 shadow-indigo-600/25'
                }`}
              >
                <Edit3 className="w-4 h-4" />
                {isEditing ? 'Batal Edit' : 'Pengaturan Profil'}
              </button>
            </div>

            {/* Badges / Chips */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                {roleLabel}
              </span>

              {userProfile?.role === 'siswa' && (
                <>
                  <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30 flex items-center gap-1.5">
                    <School className="w-3.5 h-3.5" />
                    Kelas: {userProfile?.kelas || 'X RPL 1'}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-500/30">
                    {userProfile?.jurusan || 'Rekayasa Perangkat Lunak'}
                  </span>
                  {userProfile?.nis && (
                    <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 flex items-center gap-1">
                      <IdCard className="w-3.5 h-3.5 text-slate-400" />
                      NIS: {userProfile.nis}
                    </span>
                  )}
                </>
              )}

              {userProfile?.role === 'guru' && (
                <>
                  <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    Mapel: {userProfile?.mataPelajaran || 'Bahasa Inggris SMK'}
                  </span>
                  {userProfile?.nip && (
                    <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 flex items-center gap-1">
                      <IdCard className="w-3.5 h-3.5 text-slate-400" />
                      NIP: {userProfile.nip}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Feedback message */}
        {saveSuccess && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500 text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Pengaturan profil berhasil disimpan dan diperbarui ke Firebase Firestore!</span>
          </div>
        )}

        {/* FULL PROFILE SETTINGS FORM */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-slate-800 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-black text-white text-base sm:text-lg flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                Formulir Pengaturan Profil Pengguna
              </h3>
              <span className="text-[11px] text-slate-400">Tersinkronisasi ke Firestore</span>
            </div>

            {/* Avatar Selector */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <label className="block text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-amber-400" />
                Pilih Karakter Foto Profil Vokasi (Avatar)
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {PRESET_AVATARS.map(av => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic();
                      setFormData({ ...formData, photoURL: av.url });
                    }}
                    className={`p-2 rounded-2xl border transition-all text-center flex flex-col items-center gap-1 active:scale-95 touch-manipulation ${
                      formData.photoURL === av.url 
                        ? 'bg-indigo-600/30 border-indigo-400 ring-2 ring-indigo-400 scale-105' 
                        : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950">
                      <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 truncate max-w-[80px]">
                      {av.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-1">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Atau masukkan URL Foto Khusus:
                </label>
                <input
                  type="url"
                  value={formData.photoURL}
                  onChange={e => setFormData({ ...formData, photoURL: e.target.value })}
                  placeholder="https://example.com/foto.jpg"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={e => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              {userProfile?.role === 'siswa' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                    Nomor Induk Siswa (NIS)
                  </label>
                  <input
                    type="text"
                    value={formData.nis}
                    onChange={e => setFormData({ ...formData, nis: e.target.value })}
                    placeholder="Contoh: 232410145"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              {userProfile?.role === 'guru' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                    NIP / NUPTK Pengampu
                  </label>
                  <input
                    type="text"
                    value={formData.nip}
                    onChange={e => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="Contoh: 19850412 201001 1 008"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              {userProfile?.role === 'siswa' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                    Kelas Kejuruan *
                  </label>
                  <select
                    value={formData.kelas}
                    onChange={e => setFormData({ ...formData, kelas: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-amber-400"
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

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                  Jurusan / Konsentrasi Keahlian *
                </label>
                <input
                  type="text"
                  required
                  value={formData.jurusan}
                  onChange={e => setFormData({ ...formData, jurusan: e.target.value })}
                  placeholder="Contoh: Rekayasa Perangkat Lunak"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {userProfile?.role === 'guru' && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                    Mata Pelajaran yang Diampu
                  </label>
                  <input
                    type="text"
                    value={formData.mataPelajaran}
                    onChange={e => setFormData({ ...formData, mataPelajaran: e.target.value })}
                    placeholder="Bahasa Inggris SMK Kelas X"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                  Moto Belajar / Bio Profil
                </label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tuliskan moto atau target belajar grammar Anda..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {userProfile?.role === 'siswa' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    Target Nilai Akhir Grammar (76 - 100)
                  </label>
                  <input
                    type="number"
                    min="76"
                    max="100"
                    value={formData.targetScore}
                    onChange={e => setFormData({ ...formData, targetScore: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-heading font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Simpan & Sinkronkan Profil
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Gamification Badges Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-heading font-black text-white text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Lencana Prestasi Gamifikasi Siswa (Badges)
            </h3>
            <p className="text-xs text-slate-400">
              Kumpulkan seluruh lencana prestasi dengan menyelesaikan soal level 1-6 dan meraih streak tertinggi.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-400">5 Terbuka</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BADGES.map(b => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border transition-all ${
                b.unlocked 
                  ? 'bg-slate-800/80 border-amber-400/30 shadow-md' 
                  : 'bg-slate-900/50 border-slate-800 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-heading font-black text-base text-white">{b.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {b.minScore} pts
                </span>
              </div>
              <p className="text-xs text-slate-300">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
