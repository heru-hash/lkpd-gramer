import React from 'react';
import { 
  Users, 
  GraduationCap, 
  Gamepad2, 
  Trophy, 
  Sparkles, 
  Swords, 
  BookOpen, 
  Play, 
  ArrowUpRight,
  TrendingUp,
  Target
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import { useIFP } from '../context/IFPContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardProps {
  onNavigate: (tab: string, levelId?: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { userProfile } = useAuth();
  const { presentationMode, triggerHaptic } = useIFP();

  // Statistics metrics
  const stats = [
    { title: 'Jumlah Siswa Aktif', value: '384', change: '+12% minggu ini', icon: Users, color: 'from-blue-600 to-cyan-500' },
    { title: 'Jumlah Guru Pengampu', value: '18', change: '5 Konsentrasi Keahlian', icon: GraduationCap, color: 'from-purple-600 to-indigo-500' },
    { title: 'Total Game Selesai', value: '1,420', change: '+184 hari ini', icon: Gamepad2, color: 'from-emerald-600 to-teal-500' },
    { title: 'Rata-rata Nilai Siswa', value: '88.4', change: 'Predikat B (Tuntas)', icon: Trophy, color: 'from-amber-500 to-orange-500' },
  ];

  // Chart 1: Nilai Rata-rata per Kelas
  const barData = {
    labels: ['X RPL 1', 'X RPL 2', 'X TKJ 1', 'X TKJ 2', 'X AKL 1', 'X Otomotif 1', 'X DPIB 1'],
    datasets: [
      {
        label: 'Rata-rata Skor Grammar',
        data: [92, 88, 85, 87, 90, 84, 89],
        backgroundColor: [
          'rgba(99, 102, 241, 0.85)',
          'rgba(168, 85, 247, 0.85)',
          'rgba(236, 72, 153, 0.85)',
          'rgba(59, 130, 246, 0.85)',
          'rgba(16, 185, 129, 0.85)',
          'rgba(245, 158, 11, 0.85)',
          'rgba(14, 165, 233, 0.85)',
        ],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 13 },
      },
    },
    scales: {
      y: {
        min: 60,
        max: 100,
        grid: { color: 'rgba(255, 255, 255, 0.08)' },
        ticks: { color: '#94a3b8' },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' },
      },
    },
  };

  // Chart 2: Ketuntasan Belajar (KKM = 76)
  const doughnutData = {
    labels: ['Sangat Tuntas (95-100 A)', 'Tuntas (86-94 B)', 'Cukup (76-85 C)', 'Remedial (<76 D)'],
    datasets: [
      {
        data: [38, 42, 14, 6],
        backgroundColor: [
          '#10b981', // emerald
          '#6366f1', // indigo
          '#f59e0b', // amber
          '#ef4444', // rose
        ],
        borderWidth: 0,
      },
    ],
  };

  // Chart 3: Tren Aktivitas Harian
  const lineData = {
    labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
    datasets: [
      {
        label: 'Sesi Game Grammar',
        data: [210, 260, 310, 290, 380, 180, 140],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#06b6d4',
        pointRadius: 5,
      },
    ],
  };

  const topStudents = [
    { rank: 1, name: 'Ahmad Rizky Pratama', class: 'X RPL 1', score: 1280, badge: '🏅 Champion' },
    { rank: 2, name: 'Siti Nur Aisyah', class: 'X AKL 1', score: 1190, badge: '🏅 Grammar Master' },
    { rank: 3, name: 'Budi Santoso', class: 'X TKJ 2', score: 1120, badge: '🏅 Grammar Master' },
    { rank: 4, name: 'Dian Permata', class: 'X DPIB 1', score: 980, badge: '🏅 Grammar Hero' },
    { rank: 5, name: 'Farhan Maulana', class: 'X Otomotif 1', score: 940, badge: '🏅 Grammar Hero' },
  ];

  return (
    <div className={`space-y-6 ${presentationMode ? 'scale-[1.02] origin-top' : ''}`}>
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 border border-indigo-700/50 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              SMKN 1 Sidayu • Kurikulum Merdeka Fase E
            </div>
            <h1 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight">
              Selamat Datang, {userProfile?.nama || 'Siswa SMKN 1 Sidayu'}! 👋
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              Tingkatkan penguasaan grammar bahasa Inggris kejuruan SMKN 1 Sidayu melalui game interaktif yang dirancang khusus untuk papan interaktif digital, touchscreen, dan proyektor.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button
                onClick={() => { triggerHaptic(); onNavigate('games'); }}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-heading font-extrabold text-sm sm:text-base shadow-lg shadow-amber-500/30 hover:brightness-110 active:scale-95 transition flex items-center gap-2.5 touch-manipulation"
              >
                <Play className="w-5 h-5 fill-current" />
                Mulai Game Grammar
              </button>

              <button
                onClick={() => { triggerHaptic(); onNavigate('battle'); }}
                className="px-5 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-heading font-bold text-sm sm:text-base border border-slate-700 shadow-md active:scale-95 transition flex items-center gap-2.5 touch-manipulation"
              >
                <Swords className="w-5 h-5 text-rose-400" />
                Live Team Battle (IFP)
              </button>
            </div>
          </div>

          {/* Quick IFP Status Pill */}
          <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/70 shadow-xl flex flex-col gap-3 min-w-[240px]">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Status Perangkat</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Touchscreen Ready
              </span>
            </div>
            <div className="h-px bg-slate-800"></div>
            <div className="text-xs space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Mode Tampilan:</span>
                <span className="font-bold text-indigo-400">{presentationMode ? 'Presentasi Guru' : 'Standard IFP'}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Target Kurikulum:</span>
                <span className="font-bold text-amber-400">Fase E (Kelas X)</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Bank Soal:</span>
                <span className="font-bold text-emerald-400">300+ Soal Aktif</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-lg transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{s.title}</span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${s.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="font-heading font-black text-3xl text-white tracking-tight">{s.value}</h3>
                <p className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {s.change}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Level Quick Select Carousel / Buttons */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-heading font-extrabold text-lg sm:text-xl text-white flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-indigo-400" />
              6 Level Tantangan Game Grammar
            </h2>
            <p className="text-xs text-slate-400">Pilih level untuk dimainkan langsung di layar interaktif</p>
          </div>
          <button 
            onClick={() => onNavigate('games')}
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            Lihat Semua <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { level: 1, name: 'Drag & Drop', desc: 'Lengkapi Kalimat', color: 'from-blue-600 to-indigo-600' },
            { level: 2, name: 'Multiple Choice', desc: '4 Pilihan Cepat', color: 'from-purple-600 to-pink-600' },
            { level: 3, name: 'Sentence Builder', desc: 'Susun Kata Acak', color: 'from-amber-500 to-orange-600' },
            { level: 4, name: 'True or False', desc: 'Verifikasi Kaidah', color: 'from-emerald-500 to-teal-600' },
            { level: 5, name: 'Grammar Race', desc: 'Tantangan Waktu', color: 'from-rose-500 to-red-600' },
            { level: 6, name: 'Boss Battle', desc: 'Kalahkan Overlord', color: 'from-violet-600 to-indigo-900' },
          ].map(lvl => (
            <button
              key={lvl.level}
              onClick={() => { triggerHaptic(); onNavigate('games', lvl.level); }}
              className="group p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 transition-all text-left flex flex-col justify-between h-36 active:scale-95 touch-manipulation"
            >
              <div className="flex items-center justify-between">
                <span className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${lvl.color} flex items-center justify-center font-heading font-black text-white text-sm shadow-md`}>
                  L{lvl.level}
                </span>
                <span className="text-[10px] uppercase font-bold text-indigo-400 group-hover:translate-x-0.5 transition">
                  Main →
                </span>
              </div>
              <div>
                <p className="font-heading font-bold text-white text-sm leading-tight">{lvl.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{lvl.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Grid Grafik: Chart.js */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Nilai per kelas (2 columns wide) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-400" />
                Rata-rata Nilai Grammar per Kelas (KKM: 76)
              </h3>
              <p className="text-xs text-slate-400">Analisis pencapaian kompetensi grammar SMK Kelas X</p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Fase E
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* Chart 2: Ketuntasan Belajar */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-white text-base sm:text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Tingkat Ketuntasan
            </h3>
            <p className="text-xs text-slate-400">Persentase predikat nilai siswa SMK</p>
          </div>

          <div className="h-56 relative flex items-center justify-center my-2">
            <Doughnut 
              data={doughnutData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'bottom', labels: { boxWidth: 12, color: '#94a3b8', font: { size: 11 } } }
                }
              }} 
            />
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
            <p className="text-xs font-bold text-emerald-400">94% Siswa Melampaui KKM (76)</p>
          </div>
        </div>
      </div>

      {/* Row 3: Daily Activity & Top Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Aktivitas Harian */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-white text-base sm:text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Tren Aktivitas Belajar & Game Harian
              </h3>
              <p className="text-xs text-slate-400">Jumlah penyelesaian tantangan grammar per hari</p>
            </div>
            <span className="text-xs text-cyan-400 font-bold">1,420 Total Sesi</span>
          </div>

          <div className="h-60 w-full">
            <Line 
              data={lineData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { grid: { color: 'rgba(255, 255, 255, 0.08)' }, ticks: { color: '#94a3b8' } },
                  x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
                }
              }} 
            />
          </div>
        </div>

        {/* Top 5 Siswa Ranking */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Peringkat Tertinggi
              </h3>
              <p className="text-xs text-slate-400">Top 5 Siswa Grammar Challenge</p>
            </div>
            <button
              onClick={() => onNavigate('leaderboard')}
              className="text-xs font-bold text-amber-400 hover:text-amber-300"
            >
              Semua →
            </button>
          </div>

          <div className="space-y-2.5">
            {topStudents.map(student => (
              <div 
                key={student.rank}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/50"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold ${
                    student.rank === 1 ? 'bg-amber-500 text-slate-950 font-black' :
                    student.rank === 2 ? 'bg-slate-300 text-slate-950' :
                    student.rank === 3 ? 'bg-amber-700 text-white' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {student.rank}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">{student.name}</p>
                    <p className="text-[10px] text-slate-400">{student.class}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-black text-amber-400">{student.score} pts</p>
                  <p className="text-[10px] text-slate-400">{student.badge}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigate('materi')}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold text-xs border border-indigo-500/30 transition flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Pelajari Materi Grammar
          </button>
        </div>
      </div>
    </div>
  );
};
