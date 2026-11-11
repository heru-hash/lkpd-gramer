import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Sparkles, 
  Clock, 
  Award, 
  BookOpen, 
  School
} from 'lucide-react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { useIFP } from '../context/IFPContext';

export const Statistik: React.FC = () => {
  const { presentationMode } = useIFP();

  // Materi grammar mastery radar / bar comparison
  const masteryData = {
    labels: [
      'Simple Present',
      'Simple Past',
      'Present Continuous',
      'Future Tense',
      'Subj-Verb Agreement',
      'To Be',
    ],
    datasets: [
      {
        label: 'Tingkat Penguasaan Siswa (%)',
        data: [92, 84, 88, 86, 74, 95],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderRadius: 8,
      },
    ],
  };

  const activityData = {
    labels: ['Pekan 1', 'Pekan 2', 'Pekan 3', 'Pekan 4'],
    datasets: [
      {
        label: 'Aktivitas Game Siswa',
        data: [420, 680, 890, 1140],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const classPerformance = [
    { name: 'X RPL 1 (Software Engineering)', avg: 92.4, tuntas: '97%', badge: 'Sangat Tinggi' },
    { name: 'X AKL 1 (Akuntansi & Keuangan)', avg: 89.8, tuntas: '94%', badge: 'Tinggi' },
    { name: 'X TKJ 1 (Teknik Komputer Jaringan)', avg: 87.2, tuntas: '91%', badge: 'Tinggi' },
    { name: 'X DPIB 1 (Arsitektur Desain)', avg: 85.6, tuntas: '88%', badge: 'Baik' },
    { name: 'X Otomotif 1 (Teknik Kendaraan)', avg: 84.1, tuntas: '86%', badge: 'Baik' },
  ];

  return (
    <div className={`space-y-6 ${presentationMode ? 'scale-[1.01] origin-top' : ''}`}>
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold mb-2 border border-cyan-500/30">
            <BarChart3 className="w-3.5 h-3.5" />
            Dashboard Analitik Pembelajaran Vokasi
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            Statistik & Diagnostik Penguasaan Grammar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Data analitik komprehensif untuk evaluasi guru, kepala sekolah, dan peningkatan mutu belajar.
          </p>
        </div>

        <span className="px-3.5 py-1.5 rounded-2xl bg-slate-800 text-slate-300 text-xs font-bold border border-slate-700">
          Semester Ganjil 2026/2027
        </span>
      </div>

      {/* Key Diagnostic Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Materi Paling Dikuasai</span>
          <p className="font-heading font-black text-2xl text-emerald-400 mt-1">To Be (95%)</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Pemahaman dasar sangat kuat</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Materi Perlu Penguatan</span>
          <p className="font-heading font-black text-2xl text-amber-400 mt-1">S-V Agreement (74%)</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Rekomendasi latihan Level 3</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Rata-rata Waktu Menjawab</span>
          <p className="font-heading font-black text-2xl text-cyan-400 mt-1">8.4 Detik</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Tingkat responsif tinggi</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Total Sesi IFP Terlaksana</span>
          <p className="font-heading font-black text-2xl text-purple-400 mt-1">128 Jam</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Papan interaktif kelas</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Materi Mastery Bar */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-white text-base sm:text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              Tingkat Penguasaan per Modul Grammar (%)
            </h3>
            <span className="text-xs text-slate-400">Target KKM: 76%</span>
          </div>

          <div className="h-64">
            <Bar 
              data={masteryData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  y: { min: 50, max: 100, grid: { color: 'rgba(255, 255, 255, 0.08)' }, ticks: { color: '#94a3b8' } },
                  x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
                }
              }} 
            />
          </div>
        </div>

        {/* Growth over Months */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-white text-base sm:text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Pertumbuhan Partisipasi Belajar Siswa
            </h3>
            <span className="text-xs text-purple-400 font-bold">+170% Bulan Ini</span>
          </div>

          <div className="h-64">
            <Line 
              data={activityData} 
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
      </div>

      {/* Class Comparison Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="font-heading font-bold text-white text-base sm:text-lg flex items-center gap-2">
          <School className="w-5 h-5 text-amber-400" />
          Komparasi Ketuntasan Belajar Antar Konsentrasi Keahlian
        </h3>

        <div className="space-y-3">
          {classPerformance.map((c, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-heading font-bold text-white text-sm sm:text-base">{c.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">Tingkat Ketuntasan: {c.tuntas}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-slate-400">Rata-rata Kelas</span>
                  <p className="font-heading font-black text-xl text-amber-400">{c.avg}</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 font-bold text-xs border border-indigo-500/30">
                  {c.badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
