import React, { useState } from 'react';
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
  Trophy
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useIFP } from '../context/IFPContext';
import { triggerConfetti } from '../utils/confetti';
import { soundManager } from '../utils/audio';

export const Profile: React.FC = () => {
  const { userProfile, updateUserBio } = useAuth();
  const { triggerHaptic } = useIFP();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nama: userProfile?.nama || '',
    kelas: userProfile?.kelas || 'X RPL 1',
    jurusan: userProfile?.jurusan || 'Rekayasa Perangkat Lunak',
    nis: userProfile?.nis || '232410145',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const BADGES = [
    { id: 'b1', name: '🏅 Beginner', desc: 'Selesaikan game grammar pertama', unlocked: true, minScore: 0 },
    { id: 'b2', name: '🏅 Explorer', desc: 'Raih total skor minimal 100 poin', unlocked: true, minScore: 100 },
    { id: 'b3', name: '🏅 Grammar Hero', desc: 'Raih total skor minimal 300 poin', unlocked: true, minScore: 300 },
    { id: 'b4', name: '🏅 Grammar Master', desc: 'Raih total skor minimal 600 poin', unlocked: true, minScore: 600 },
    { id: 'b5', name: '🏅 Champion', desc: 'Raih skor tertinggi di atas 1000 poin', unlocked: true, minScore: 1000 },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();

    await updateUserBio({
      nama: formData.nama,
      kelas: formData.kelas,
      jurusan: formData.jurusan,
      nis: formData.nis,
    });

    setIsEditing(false);
    setSaveSuccess(true);
    soundManager.playCorrect();
    triggerConfetti();

    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-1 shadow-2xl">
              <div className="w-full h-full rounded-[22px] overflow-hidden bg-slate-950 flex items-center justify-center font-heading font-black text-white text-3xl sm:text-4xl">
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} alt={userProfile.nama} className="w-full h-full object-cover" />
                ) : (
                  userProfile?.nama?.charAt(0) || 'U'
                )}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-md uppercase">
              {userProfile?.role || 'siswa'}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
                  {userProfile?.nama}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  {userProfile?.email}
                </p>
              </div>

              <button
                onClick={() => { triggerHaptic(); setIsEditing(!isEditing); }}
                className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center justify-center gap-2 self-center sm:self-start"
              >
                <Edit3 className="w-4 h-4 text-amber-400" />
                {isEditing ? 'Tutup Edit' : 'Edit Profil'}
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
              <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
                Kelas: {userProfile?.kelas || 'X RPL 1'}
              </span>
              <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 font-bold text-xs border border-purple-500/30">
                Jurusan: {userProfile?.jurusan || 'Rekayasa Perangkat Lunak'}
              </span>
              {userProfile?.nis && (
                <span className="px-3 py-1 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700">
                  NIS: {userProfile.nis}
                </span>
              )}
            </div>
          </div>
        </div>

        {saveSuccess && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Profil Anda berhasil diperbarui dan disinkronkan ke Firebase!
          </div>
        )}

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="mt-6 pt-6 border-t border-slate-800 space-y-4">
            <h3 className="font-heading font-bold text-white text-base">Perbarui Data Pribadi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={e => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Kelas</label>
                <select
                  value={formData.kelas}
                  onChange={e => setFormData({ ...formData, kelas: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {['X RPL 1', 'X RPL 2', 'X TKJ 1', 'X TKJ 2', 'X AKL 1', 'X Otomotif 1', 'X DPIB 1'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Jurusan / Konsentrasi Keahlian</label>
                <input
                  type="text"
                  value={formData.jurusan}
                  onChange={e => setFormData({ ...formData, jurusan: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">NIS / NIP</label>
                <input
                  type="text"
                  value={formData.nis}
                  onChange={e => setFormData({ ...formData, nis: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow-md hover:bg-amber-300 transition flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Simpan Perubahan
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
              Lencana Prestasi Gamifikasi (Badges)
            </h3>
            <p className="text-xs text-slate-400">
              Kumpulkan seluruh lencana dengan menyelesaikan tantangan grammar dan meraih streak tinggi.
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
