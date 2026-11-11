import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Medal, 
  Flame, 
  Users, 
  School, 
  Calendar, 
  Sparkles,
  ArrowUp,
  Award
} from 'lucide-react';
import { LeaderboardEntry, BadgeType } from '../types';
import { useAuth } from '../context/AuthContext';
import { useIFP } from '../context/IFPContext';
import { db } from '../services/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

export const Leaderboard: React.FC = () => {
  const { userProfile } = useAuth();
  const { triggerHaptic, presentationMode } = useIFP();

  const [activeTab, setActiveTab] = useState<'siswa' | 'kelas' | 'sekolah'>('siswa');
  const [timeFilter, setTimeFilter] = useState<'harian' | 'mingguan' | 'bulanan'>('mingguan');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

  // Sample seed data to ensure instant vibrant display even on fresh database instances
  const SEED_TOP_SISWA: LeaderboardEntry[] = [
    { uid: 'u1', nama: 'Ahmad Rizky Pratama', kelas: 'X RPL 1', jurusan: 'RPL', totalScore: 1480, gamesPlayed: 24, badge: 'Champion' },
    { uid: 'u2', nama: 'Siti Nur Aisyah', kelas: 'X AKL 1', jurusan: 'AKL', totalScore: 1390, gamesPlayed: 22, badge: 'Champion' },
    { uid: 'u3', nama: 'Budi Santoso', kelas: 'X TKJ 1', jurusan: 'TKJ', totalScore: 1250, gamesPlayed: 19, badge: 'Grammar Master' },
    { uid: 'u4', nama: 'Dian Permata', kelas: 'X DPIB 1', jurusan: 'DPIB', totalScore: 1180, gamesPlayed: 18, badge: 'Grammar Master' },
    { uid: 'u5', nama: 'Farhan Maulana', kelas: 'X Otomotif 1', jurusan: 'Otomotif', totalScore: 1040, gamesPlayed: 16, badge: 'Grammar Master' },
    { uid: 'u6', nama: 'Zahra Amelia', kelas: 'X Kuliner 1', jurusan: 'Kuliner', totalScore: 920, gamesPlayed: 14, badge: 'Grammar Hero' },
    { uid: 'u7', nama: 'Indra Lesmana', kelas: 'X Listrik 1', jurusan: 'Listrik', totalScore: 860, gamesPlayed: 13, badge: 'Grammar Hero' },
    { uid: 'u8', nama: 'Maya Safitri', kelas: 'X DKV 1', jurusan: 'DKV', totalScore: 780, gamesPlayed: 12, badge: 'Grammar Hero' },
    { uid: 'u9', nama: 'Rian Hidayat', kelas: 'X RPL 2', jurusan: 'RPL', totalScore: 650, gamesPlayed: 10, badge: 'Grammar Hero' },
    { uid: 'u10', nama: 'Kevin Aditya', kelas: 'X TKJ 2', jurusan: 'TKJ', totalScore: 540, gamesPlayed: 8, badge: 'Explorer' },
  ];

  const SEED_TOP_KELAS = [
    { rank: 1, name: 'X RPL 1 (Software Engineering)', score: 9480, participants: 36, badge: '🏆 Kelas Juara 1' },
    { rank: 2, name: 'X AKL 1 (Akuntansi & Keuangan)', score: 8920, participants: 35, badge: '🥈 Kelas Juara 2' },
    { rank: 3, name: 'X TKJ 1 (Teknik Komputer & Jaringan)', score: 8450, participants: 36, badge: '🥉 Kelas Juara 3' },
    { rank: 4, name: 'X DPIB 1 (Arsitektur Bangunan)', score: 7820, participants: 34, badge: '🏅 Unggulan' },
    { rank: 5, name: 'X Otomotif 1 (Teknik Kendaraan)', score: 7410, participants: 35, badge: '🏅 Unggulan' },
    { rank: 6, name: 'X DKV 1 (Desain Komunikasi Visual)', score: 6980, participants: 33, badge: '🏅 Unggulan' },
    { rank: 7, name: 'X Kuliner 1 (Tata Boga Industri)', score: 6540, participants: 34, badge: '🏅 Unggulan' },
    { rank: 8, name: 'X Listrik 1 (Teknik Instalasi)', score: 6120, participants: 32, badge: '🏅 Unggulan' },
    { rank: 9, name: 'X Pemesinan 1 (Teknik Bubut/CNC)', score: 5890, participants: 34, badge: '🏅 Unggulan' },
    { rank: 10, name: 'X Pengelasan 1 (Teknik Fabrikasi)', score: 5430, participants: 30, badge: '🏅 Unggulan' },
  ];

  const SEED_TOP_SEKOLAH = [
    { rank: 1, name: 'SMKN 1 Sidayu (SMEKSA)', kota: 'Sidayu - Gresik, Jawa Timur', score: 38450, badge: 'Pusat Keunggulan' },
    { rank: 2, name: 'SMK Negeri 2 Surabaya', kota: 'Surabaya, Jawa Timur', score: 35820, badge: 'Pusat Keunggulan' },
    { rank: 3, name: 'SMK Negeri 1 Tuban', kota: 'Tuban, Jawa Timur', score: 32410, badge: 'Rujukan Vokasi' },
    { rank: 4, name: 'SMK Negeri 3 Buduran Sidoarjo', kota: 'Sidoarjo, Jawa Timur', score: 29840, badge: 'Rujukan Vokasi' },
    { rank: 5, name: 'SMK Negeri 1 Malang', kota: 'Malang, Jawa Timur', score: 28100, badge: 'Rujukan Vokasi' },
    { rank: 6, name: 'SMK Negeri 5 Semarang', kota: 'Semarang, Jawa Tengah', score: 25400, badge: 'Mitra Industri' },
    { rank: 7, name: 'SMK Negeri 2 Bandung', kota: 'Bandung, Jawa Barat', score: 24200, badge: 'Mitra Industri' },
    { rank: 8, name: 'SMK Negeri 26 Jakarta', kota: 'Jakarta Timur, DKI Jakarta', score: 22800, badge: 'Mitra Industri' },
    { rank: 9, name: 'SMK Negeri 1 Denpasar', kota: 'Denpasar, Bali', score: 20500, badge: 'Mitra Industri' },
    { rank: 10, name: 'SMK Negeri 1 Medan', kota: 'Medan, Sumatera Utara', score: 19100, badge: 'Mitra Industri' },
  ];

  // Subscribe to realtime leaderboards
  useEffect(() => {
    try {
      const q = query(collection(db, 'leaderboards'), orderBy('totalScore', 'desc'), limit(10));
      const unsub = onSnapshot(q, (snap) => {
        if (!snap.empty) {
          const list: LeaderboardEntry[] = [];
          snap.forEach(docSnap => {
            list.push(docSnap.data() as LeaderboardEntry);
          });
          setEntries(list);
        } else {
          setEntries(SEED_TOP_SISWA);
        }
      }, () => {
        setEntries(SEED_TOP_SISWA);
      });
      return () => unsub();
    } catch {
      setEntries(SEED_TOP_SISWA);
    }
  }, []);

  const badgeStyle = (badge: BadgeType | string) => {
    if (badge === 'Champion') return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    if (badge === 'Grammar Master') return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    if (badge === 'Grammar Hero') return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
    if (badge === 'Explorer') return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    return 'bg-slate-700/50 text-slate-300 border-slate-600';
  };

  return (
    <div className={`space-y-6 ${presentationMode ? 'scale-[1.01] origin-top' : ''}`}>
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-2 border border-amber-500/30">
            <Trophy className="w-3.5 h-3.5" />
            Papan Peringkat Realtime (Firebase)
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            Leaderboard Grammar Challenge SMK
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pantau persaingan positif siswa, kelas, dan antar sekolah vokasi di seluruh Indonesia.
          </p>
        </div>

        {/* Time Filter Pills: Harian, Mingguan, Bulanan */}
        <div className="flex items-center bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
          {(['harian', 'mingguan', 'bulanan'] as const).map(t => (
            <button
              key={t}
              onClick={() => { triggerHaptic(); setTimeFilter(t); }}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition active:scale-95 touch-manipulation ${
                timeFilter === t
                  ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 3 Main View Tabs: Top 10 Siswa, Top 10 Kelas, Top 10 Sekolah */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => { triggerHaptic(); setActiveTab('siswa'); }}
          className={`p-4 rounded-2xl font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all active:scale-95 touch-manipulation ${
            activeTab === 'siswa'
              ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30 font-black'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Top 10 Siswa</span>
        </button>

        <button
          onClick={() => { triggerHaptic(); setActiveTab('kelas'); }}
          className={`p-4 rounded-2xl font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all active:scale-95 touch-manipulation ${
            activeTab === 'kelas'
              ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30 font-black'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Top 10 Kelas</span>
        </button>

        <button
          onClick={() => { triggerHaptic(); setActiveTab('sekolah'); }}
          className={`p-4 rounded-2xl font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all active:scale-95 touch-manipulation ${
            activeTab === 'sekolah'
              ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/30 font-black'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
          }`}
        >
          <School className="w-4 h-4 text-purple-400" />
          <span>Top 10 Sekolah</span>
        </button>
      </div>

      {/* TOP 3 PODIUM DISPLAY */}
      {activeTab === 'siswa' && entries.length >= 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-2">
          {/* Rank 2 */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700 text-center flex flex-col justify-between order-2 sm:order-1 sm:translate-y-4">
            <div>
              <span className="text-3xl">🥈</span>
              <p className="font-heading font-extrabold text-white text-base mt-2">{entries[1].nama}</p>
              <p className="text-xs text-slate-400">{entries[1].kelas}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="font-heading font-black text-2xl text-slate-200">{entries[1].totalScore} pts</span>
              <p className="text-[10px] text-purple-400 font-bold mt-1">🏅 {entries[1].badge}</p>
            </div>
          </div>

          {/* Rank 1 (Tall & Highlighted) */}
          <div className="p-6 rounded-3xl bg-gradient-to-b from-amber-500/20 to-slate-900 border-2 border-amber-400 text-center flex flex-col justify-between order-1 sm:order-2 shadow-2xl scale-105">
            <div>
              <span className="text-4xl animate-bounce">👑</span>
              <span className="text-3xl block mt-1">🥇</span>
              <p className="font-heading font-black text-white text-lg mt-2">{entries[0].nama}</p>
              <p className="text-xs text-amber-300 font-semibold">{entries[0].kelas}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-amber-400/30">
              <span className="font-heading font-black text-3xl text-amber-400">{entries[0].totalScore} pts</span>
              <p className="text-xs text-amber-300 font-extrabold mt-1">🏅 {entries[0].badge}</p>
            </div>
          </div>

          {/* Rank 3 */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700 text-center flex flex-col justify-between order-3 sm:order-3 sm:translate-y-6">
            <div>
              <span className="text-3xl">🥉</span>
              <p className="font-heading font-extrabold text-white text-base mt-2">{entries[2].nama}</p>
              <p className="text-xs text-slate-400">{entries[2].kelas}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="font-heading font-black text-2xl text-amber-600">{entries[2].totalScore} pts</span>
              <p className="text-[10px] text-indigo-400 font-bold mt-1">🏅 {entries[2].badge}</p>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED LIST CARDS */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden p-3 sm:p-5">
        <div className="space-y-2.5">
          {activeTab === 'siswa' && entries.map((entry, idx) => {
            const isMe = userProfile?.nama === entry.nama || userProfile?.uid === entry.uid;

            return (
              <div
                key={entry.uid || idx}
                className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                  isMe 
                    ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-400' 
                    : 'bg-slate-800/70 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-heading font-black text-sm ${
                    idx === 0 ? 'bg-amber-400 text-slate-950' :
                    idx === 1 ? 'bg-slate-300 text-slate-950' :
                    idx === 2 ? 'bg-amber-700 text-white' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </span>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-heading font-bold text-white text-sm sm:text-base leading-tight">
                        {entry.nama}
                      </p>
                      {isMe && (
                        <span className="px-2 py-0.2 rounded-md bg-indigo-500 text-white text-[10px] font-black uppercase">
                          Anda
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{entry.kelas} • {entry.jurusan}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-6 text-right">
                  <span className={`hidden sm:inline-flex px-2.5 py-1 text-xs font-bold rounded-lg border ${badgeStyle(entry.badge)}`}>
                    🏅 {entry.badge}
                  </span>

                  <div>
                    <span className="font-heading font-black text-lg sm:text-xl text-amber-400">
                      {entry.totalScore}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-semibold">
                      {entry.gamesPlayed} Game
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {activeTab === 'kelas' && SEED_TOP_KELAS.map((k) => (
            <div
              key={k.rank}
              className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-heading font-black text-sm ${
                  k.rank === 1 ? 'bg-amber-400 text-slate-950' :
                  k.rank === 2 ? 'bg-slate-300 text-slate-950' :
                  k.rank === 3 ? 'bg-amber-700 text-white' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {k.rank}
                </span>
                <div>
                  <p className="font-heading font-bold text-white text-sm sm:text-base">{k.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{k.participants} Siswa Terdaftar</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-heading font-black text-lg sm:text-xl text-emerald-400">{k.score} pts</p>
                <span className="text-xs text-amber-400 font-bold">{k.badge}</span>
              </div>
            </div>
          ))}

          {activeTab === 'sekolah' && SEED_TOP_SEKOLAH.map((s) => (
            <div
              key={s.rank}
              className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-heading font-black text-sm ${
                  s.rank === 1 ? 'bg-amber-400 text-slate-950' :
                  s.rank === 2 ? 'bg-slate-300 text-slate-950' :
                  s.rank === 3 ? 'bg-amber-700 text-white' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {s.rank}
                </span>
                <div>
                  <p className="font-heading font-bold text-white text-sm sm:text-base">{s.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.kota}</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-heading font-black text-lg sm:text-xl text-purple-400">{s.score} pts</p>
                <span className="text-xs text-indigo-300 font-bold">{s.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
