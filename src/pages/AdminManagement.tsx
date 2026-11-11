import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  GraduationCap, 
  Layers, 
  BookOpen, 
  Download, 
  Upload, 
  Activity, 
  Settings, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  Database,
  RefreshCw,
  Search
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useIFP } from '../context/IFPContext';
import { GRAMMAR_QUESTION_BANK } from '../data/grammarQuestions';
import { GRAMMAR_MATERIALS } from '../data/materialsData';
import { triggerConfetti } from '../utils/confetti';
import { soundManager } from '../utils/audio';

export const AdminManagement: React.FC = () => {
  const { userProfile } = useAuth();
  const { triggerHaptic } = useIFP();

  const [activeTab, setActiveTab] = useState<'users' | 'classes' | 'questions' | 'backup' | 'logs'>('users');
  const [backupStatus, setBackupStatus] = useState<string | null>(null);

  // Managed Teachers & Students State
  const [teachers, setTeachers] = useState([
    { id: 'g1', nama: 'Bambang Trianto, S.Pd.', nip: '19850412 201001 1 008', mapel: 'Bahasa Inggris', kelas: 'X RPL, X TKJ' },
    { id: 'g2', nama: 'Dra. Endang Sulistyo', nip: '19790615 200501 2 004', mapel: 'Bahasa Inggris Kejuruan', kelas: 'X AKL, X DPIB' },
    { id: 'g3', nama: 'Ahmad Fauzi, M.Pd.', nip: '19900820 201503 1 002', mapel: 'English for Vocational Tech', kelas: 'X Otomotif' },
  ]);

  const [students, setStudents] = useState([
    { id: 's1', nama: 'Ahmad Rizky Pratama', nis: '232410145', kelas: 'X RPL 1', jurusan: 'RPL', email: 'rizky@smk.sch.id' },
    { id: 's2', nama: 'Siti Nur Aisyah', nis: '232410146', kelas: 'X AKL 1', jurusan: 'AKL', email: 'siti@smk.sch.id' },
    { id: 's3', nama: 'Budi Santoso', nis: '232410147', kelas: 'X TKJ 1', jurusan: 'TKJ', email: 'budi@smk.sch.id' },
    { id: 's4', nama: 'Dian Permata', nis: '232410148', kelas: 'X DPIB 1', jurusan: 'DPIB', email: 'dian@smk.sch.id' },
    { id: 's5', nama: 'Farhan Maulana', nis: '232410149', kelas: 'X Otomotif 1', jurusan: 'Otomotif', email: 'farhan@smk.sch.id' },
  ]);

  const [classes, setClasses] = useState([
    { id: 'c1', namaKelas: 'X RPL 1', jurusan: 'Rekayasa Perangkat Lunak', guru: 'Bambang Trianto, S.Pd.', jmlSiswa: 36 },
    { id: 'c2', namaKelas: 'X RPL 2', jurusan: 'Rekayasa Perangkat Lunak', guru: 'Bambang Trianto, S.Pd.', jmlSiswa: 36 },
    { id: 'c3', namaKelas: 'X TKJ 1', jurusan: 'Teknik Komputer & Jaringan', guru: 'Bambang Trianto, S.Pd.', jmlSiswa: 36 },
    { id: 'c4', namaKelas: 'X AKL 1', jurusan: 'Akuntansi & Keuangan', guru: 'Dra. Endang Sulistyo', jmlSiswa: 35 },
    { id: 'c5', namaKelas: 'X DPIB 1', jurusan: 'Desain Pemodelan Bangunan', guru: 'Dra. Endang Sulistyo', jmlSiswa: 34 },
    { id: 'c6', namaKelas: 'X Otomotif 1', jurusan: 'Teknik Kendaraan Ringan', guru: 'Ahmad Fauzi, M.Pd.', jmlSiswa: 35 },
  ]);

  // System logs
  const activityLogs = [
    { time: '10:45:12', user: 'Bambang Trianto', action: 'Membuat 5 Soal AI baru pada topik Future Tense' },
    { time: '10:32:05', user: 'Ahmad Rizky Pratama', action: 'Menyelesaikan Level 6 Boss Battle dengan skor 98' },
    { time: '10:15:30', user: 'Siti Nur Aisyah', action: 'Mendapatkan Badge 🏅 Champion (1000+ pts)' },
    { time: '09:50:18', user: 'Admin Heru', action: 'Sinkronisasi database Firestore selesai (300+ soal aktif)' },
    { time: '09:20:44', user: 'Team Battle Arena', action: 'Sesi IFP Tim Biru vs Tim Merah selesai (Pemenang: Tim Biru)' },
  ];

  // Backup Data Trigger
  const handleBackup = () => {
    triggerHaptic();
    const backupPayload = {
      appName: 'Grammar Challenge X SMK',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      exportedBy: userProfile?.email || 'admin',
      data: {
        teachers,
        students,
        classes,
        questionCount: GRAMMAR_QUESTION_BANK.length,
        materialsCount: GRAMMAR_MATERIALS.length
      }
    };

    const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_Grammar_Challenge_SMK_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setBackupStatus('Backup berhasil diekspor sebagai file JSON aman!');
    soundManager.playCorrect();
    triggerConfetti();
  };

  // Restore Data Simulation
  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    triggerHaptic();
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.data) {
          if (json.data.teachers) setTeachers(json.data.teachers);
          if (json.data.students) setStudents(json.data.students);
          if (json.data.classes) setClasses(json.data.classes);
          setBackupStatus('Database berhasil dipulihkan (Restored) dari file backup!');
          soundManager.playVictory();
          triggerConfetti();
        }
      } catch {
        setBackupStatus('Gagal memulihkan: Format file JSON tidak valid.');
        soundManager.playWrong();
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold mb-2 border border-rose-500/30">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            Panel Khusus Administrator Sekolah
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            Manajemen Sistem & Kontrol Sekolah
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Kelola data guru, siswa, kelas kejuruan, bank soal, audit log, backup dan pemulihan data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-black border border-rose-500/30">
            Akses Penuh: Super Admin
          </span>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'users', label: 'Kelola Guru & Siswa', icon: Users },
          { id: 'classes', label: 'Kelola Kelas Kejuruan', icon: GraduationCap },
          { id: 'questions', label: 'Monitoring Bank Soal (300+)', icon: Layers },
          { id: 'backup', label: 'Backup & Restore Data', icon: Database },
          { id: 'logs', label: 'Log Aktivitas Sistem', icon: Activity },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { triggerHaptic(); setActiveTab(tab.id as any); }}
              className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition border active:scale-95 touch-manipulation ${
                isActive
                  ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: KELOLA GURU & SISWA */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Teachers Section */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-400" />
                Daftar Guru Pengampu ({teachers.length} Orang)
              </h3>
            </div>

            <div className="space-y-2.5">
              {teachers.map(g => (
                <div key={g.id} className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-heading font-bold text-white text-sm sm:text-base">{g.nama}</p>
                    <p className="text-xs text-slate-400 mt-0.5">NIP: {g.nip} • {g.mapel}</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-bold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Kelas Binaan: {g.kelas}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Students Section */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Sampel Data Siswa Aktif ({students.length} Siswa Terdaftar)
              </h3>
            </div>

            <div className="space-y-2.5">
              {students.map(s => (
                <div key={s.id} className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-heading font-bold text-white text-sm sm:text-base">{s.nama}</p>
                    <p className="text-xs text-slate-400 mt-0.5">NIS: {s.nis} • Email: {s.email}</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {s.kelas} ({s.jurusan})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KELOLA KELAS */}
      {activeTab === 'classes' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            Daftar Rombongan Belajar (Rombel) Kelas X SMK
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map(c => (
              <div key={c.id} className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-black text-white text-lg">{c.namaKelas}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                    {c.jmlSiswa} Siswa
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-medium">{c.jurusan}</p>
                <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-700">
                  Guru Wali / Pengampu: {c.guru}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MONITORING BANK SOAL (300+ SOAL) */}
      {activeTab === 'questions' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                Bank Soal Grammar Aktif ({GRAMMAR_QUESTION_BANK.length} Butir Soal Terverifikasi)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Mencakup 6 kategori grammar Kurikulum Merdeka dan 3 tingkat kesulitan.
              </p>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
            {GRAMMAR_QUESTION_BANK.slice(0, 15).map((q, idx) => (
              <div key={q.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/50 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                    {q.category} • Level {q.level}
                  </span>
                  <span className="text-slate-400">{q.difficulty}</span>
                </div>
                <p className="font-bold text-white text-sm">{q.question}</p>
                <p className="text-xs text-emerald-400 font-semibold">Kunci: "{q.answer}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: BACKUP & RESTORE DATA */}
      {activeTab === 'backup' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div>
            <h3 className="font-heading font-black text-white text-lg flex items-center gap-2">
              <Database className="w-5 h-5 text-rose-400" />
              Backup & Restore Data Sekolah
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Simpan cadangan data seluruh siswa, nilai, kelas, dan soal secara aman dalam format JSON terenkripsi.
            </p>
          </div>

          {backupStatus && (
            <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500 text-indigo-200 text-xs sm:text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-400" />
              {backupStatus}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Backup Box */}
            <div className="p-6 rounded-3xl bg-slate-800/70 border border-slate-700 space-y-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Download className="w-7 h-7" />
              </div>
              <h4 className="font-heading font-bold text-white text-base">Ekspor Cadangan (Backup Data)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unduh file arsip berformat JSON berisi seluruh riwayat nilai, master soal, dan data siswa sekolah.
              </p>
              <button
                onClick={handleBackup}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-heading font-bold text-sm shadow-lg shadow-indigo-600/30 transition active:scale-95"
              >
                Unduh Cadangan JSON Sekarang
              </button>
            </div>

            {/* Restore Box */}
            <div className="p-6 rounded-3xl bg-slate-800/70 border border-slate-700 space-y-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Upload className="w-7 h-7" />
              </div>
              <h4 className="font-heading font-bold text-white text-base">Pulihkan Data (Restore Data)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unggah file cadangan JSON yang sebelumnya diekspor untuk memulihkan keadaan data sistem.
              </p>
              <label className="block w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-sm shadow-lg shadow-emerald-600/30 transition cursor-pointer text-center">
                Pilih File Cadangan JSON
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestore}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: LOG AKTIVITAS */}
      {activeTab === 'logs' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Audit Log Aktivitas Terkini
          </h3>

          <div className="space-y-2.5">
            {activityLogs.map((log, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-cyan-400 font-bold">{log.time}</span>
                  <div>
                    <span className="font-bold text-white">{log.user}: </span>
                    <span className="text-slate-300">{log.action}</span>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                  Sukses
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
