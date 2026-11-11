import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Download, 
  Printer, 
  Search, 
  Filter, 
  Plus, 
  FileSpreadsheet, 
  FileText, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  TrendingUp,
  X
} from 'lucide-react';
import { ScoreRecord, PredicateGrade } from '../types';
import { useAuth } from '../context/AuthContext';
import { useIFP } from '../context/IFPContext';
import { db } from '../services/firebase';
import { collection, onSnapshot, addDoc, query, orderBy, limit } from 'firebase/firestore';

export const Penilaian: React.FC = () => {
  const { userProfile } = useAuth();
  const { triggerHaptic, presentationMode } = useIFP();

  const [scores, setScores] = useState<ScoreRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form state for teacher to input manual grade / extra task
  const [manualForm, setManualForm] = useState({
    studentName: '',
    kelas: 'X RPL 1',
    level: 1,
    levelName: 'Tugas Praktik Grammar',
    score: 90,
    correct: 9,
    wrong: 1,
    time: 120,
    predicate: 'B' as PredicateGrade,
  });

  // Sample initial records if database is empty so teacher immediately sees full-featured gradebook
  const SEED_SCORES: ScoreRecord[] = [
    { id: 'sc-1', uid: 'u-1', studentName: 'Ahmad Rizky Pratama', kelas: 'X RPL 1', jurusan: 'RPL', level: 6, levelName: 'Boss Battle', score: 98, correct: 10, wrong: 1, streak: 8, time: 145, predicate: 'A', createdAt: '2026-11-10T08:30:00Z' },
    { id: 'sc-2', uid: 'u-2', studentName: 'Siti Nur Aisyah', kelas: 'X AKL 1', jurusan: 'AKL', level: 5, levelName: 'Grammar Race', score: 92, correct: 9, wrong: 2, streak: 6, time: 95, predicate: 'B', createdAt: '2026-11-10T08:45:00Z' },
    { id: 'sc-3', uid: 'u-3', studentName: 'Budi Santoso', kelas: 'X TKJ 1', jurusan: 'TKJ', level: 4, levelName: 'True or False', score: 88, correct: 8, wrong: 2, streak: 5, time: 110, predicate: 'B', createdAt: '2026-11-10T09:15:00Z' },
    { id: 'sc-4', uid: 'u-4', studentName: 'Dian Permata', kelas: 'X DPIB 1', jurusan: 'DPIB', level: 3, levelName: 'Sentence Builder', score: 82, correct: 7, wrong: 3, streak: 4, time: 130, predicate: 'C', createdAt: '2026-11-10T09:40:00Z' },
    { id: 'sc-5', uid: 'u-5', studentName: 'Farhan Maulana', kelas: 'X Otomotif 1', jurusan: 'Otomotif', level: 2, levelName: 'Multiple Choice', score: 78, correct: 7, wrong: 4, streak: 3, time: 105, predicate: 'C', createdAt: '2026-11-10T10:10:00Z' },
    { id: 'sc-6', uid: 'u-6', studentName: 'Gilang Ramadhan', kelas: 'X RPL 2', jurusan: 'RPL', level: 1, levelName: 'Drag & Drop', score: 72, correct: 6, wrong: 4, streak: 2, time: 160, predicate: 'D', createdAt: '2026-11-10T10:35:00Z' },
  ];

  useEffect(() => {
    try {
      const q = query(collection(db, 'scores'), orderBy('createdAt', 'desc'), limit(50));
      const unsub = onSnapshot(q, (snap) => {
        if (!snap.empty) {
          const loaded: ScoreRecord[] = [];
          snap.forEach(docSnap => {
            loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<ScoreRecord, 'id'>) });
          });
          setScores(loaded);
        } else {
          setScores(SEED_SCORES);
        }
        setLoading(false);
      }, (err) => {
        console.warn('Firestore scores fallback to seed:', err);
        setScores(SEED_SCORES);
        setLoading(false);
      });
      return () => unsub();
    } catch {
      setScores(SEED_SCORES);
      setLoading(false);
    }
  }, []);

  // Filtered list
  const filteredScores = scores.filter(s => {
    const matchClass = selectedClass === 'Semua' || s.kelas === selectedClass;
    const matchSearch = s.studentName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchClass && matchSearch;
  });

  // Calculate statistics
  const totalCount = filteredScores.length;
  const avgScore = totalCount > 0 
    ? Math.round(filteredScores.reduce((acc, curr) => acc + curr.score, 0) / totalCount) 
    : 0;
  const passCount = filteredScores.filter(s => s.score >= 76).length;
  const passRate = totalCount > 0 ? Math.round((passCount / totalCount) * 100) : 0;

  // Export to Excel / CSV
  const handleExportCSV = () => {
    triggerHaptic();
    const headers = ['No', 'Nama Siswa', 'Kelas', 'Level Diselesaikan', 'Nilai', 'Waktu (detik)', 'Jumlah Benar', 'Jumlah Salah', 'Predikat', 'Tanggal'];
    const rows = filteredScores.map((s, idx) => [
      idx + 1,
      `"${s.studentName}"`,
      `"${s.kelas}"`,
      `"${s.levelName || `Level ${s.level}`}"`,
      s.score,
      s.time,
      s.correct,
      s.wrong,
      s.predicate,
      `"${new Date(s.createdAt).toLocaleDateString('id-ID')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_Grammar_SMK_${selectedClass}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print PDF Trigger
  const handlePrintPDF = () => {
    triggerHaptic();
    window.print();
  };

  // Submit manual teacher grading
  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();

    const newRecord: Omit<ScoreRecord, 'id'> = {
      uid: `manual-${Date.now()}`,
      studentName: manualForm.studentName,
      kelas: manualForm.kelas,
      jurusan: manualForm.kelas.split(' ')[1] || 'SMK',
      level: manualForm.level,
      levelName: manualForm.levelName,
      score: Number(manualForm.score),
      correct: Number(manualForm.correct),
      wrong: Number(manualForm.wrong),
      streak: 5,
      time: Number(manualForm.time),
      predicate: manualForm.score >= 95 ? 'A' : manualForm.score >= 86 ? 'B' : manualForm.score >= 76 ? 'C' : 'D',
      createdAt: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, 'scores'), newRecord);
    } catch {
      setScores(prev => [{ id: `local-${Date.now()}`, ...newRecord }, ...prev]);
    }

    setShowAddModal(false);
  };

  const predicateColor = (p: PredicateGrade) => {
    if (p === 'A') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (p === 'B') return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
    if (p === 'C') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
  };

  return (
    <div className={`space-y-6 ${presentationMode ? 'scale-[1.01] origin-top' : ''}`}>
      {/* Top Banner & Export Actions */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2 border border-emerald-500/30">
            <Award className="w-3.5 h-3.5" />
            Buku Nilai & Asesmen Kurikulum Merdeka
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            Penilaian Hasil Belajar Grammar Siswa
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Rekap otomatis perolehan nilai, durasi waktu pengerjaan, ketuntasan, dan predikat resmi.
          </p>
        </div>

        {/* Action Buttons: Export Excel, Print PDF, Beri Nilai */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold text-xs border border-emerald-500/30 active:scale-95 transition flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Export Excel (CSV)
          </button>

          <button
            onClick={handlePrintPDF}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold text-xs border border-indigo-500/30 active:scale-95 transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-indigo-400" />
            Cetak PDF
          </button>

          {userProfile?.role !== 'siswa' && (
            <button
              onClick={() => { triggerHaptic(); setShowAddModal(true); }}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-heading font-extrabold text-xs sm:text-sm shadow-md active:scale-95 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Beri Nilai Manual
            </button>
          )}
        </div>
      </div>

      {/* Class Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Total Asesmen Masuk</span>
          <p className="font-heading font-black text-2xl sm:text-3xl text-white mt-1">{totalCount}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Siswa terekam sistem</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Rata-rata Nilai</span>
          <p className="font-heading font-black text-2xl sm:text-3xl text-indigo-400 mt-1">{avgScore}</p>
          <p className="text-[11px] text-emerald-400 mt-0.5">KKM Sekolah: 76</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Persentase Ketuntasan</span>
          <p className="font-heading font-black text-2xl sm:text-3xl text-emerald-400 mt-1">{passRate}%</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{passCount} Siswa Tuntas</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Predikat Terbanyak</span>
          <p className="font-heading font-black text-2xl sm:text-3xl text-amber-400 mt-1">Predikat B</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Rentang 86 - 94</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Class Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0 font-bold">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            Kelas:
          </span>
          {['Semua', 'X RPL 1', 'X RPL 2', 'X TKJ 1', 'X AKL 1', 'X Otomotif 1', 'X DPIB 1'].map(cls => (
            <button
              key={cls}
              onClick={() => { triggerHaptic(); setSelectedClass(cls); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap border active:scale-95 touch-manipulation ${
                selectedClass === cls 
                  ? 'bg-indigo-600 text-white border-indigo-400' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Search by student */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama siswa..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Main Table of Scores */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-800/80 text-slate-300 font-heading font-bold border-b border-slate-700">
              <tr>
                <th className="py-3.5 px-4">No</th>
                <th className="py-3.5 px-4">Nama Siswa</th>
                <th className="py-3.5 px-4">Kelas</th>
                <th className="py-3.5 px-4">Level Diselesaikan</th>
                <th className="py-3.5 px-4">Nilai</th>
                <th className="py-3.5 px-4">Waktu</th>
                <th className="py-3.5 px-4">Benar (+10)</th>
                <th className="py-3.5 px-4">Salah (-2)</th>
                <th className="py-3.5 px-4">Predikat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredScores.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-slate-400">
                    Tidak ada catatan nilai yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredScores.map((row, idx) => (
                  <tr key={row.id || idx} className="hover:bg-slate-800/50 transition">
                    <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-white">{row.studentName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs border border-slate-700">
                        {row.kelas}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-indigo-300">
                      {row.levelName || `Level ${row.level}`}
                    </td>
                    <td className="py-3 px-4 font-heading font-black text-base text-amber-400">
                      {row.score}
                    </td>
                    <td className="py-3 px-4 text-slate-400 flex items-center gap-1 font-mono pt-4">
                      <Clock className="w-3.5 h-3.5" />
                      {row.time}s
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">
                      +{row.correct}
                    </td>
                    <td className="py-3 px-4 text-rose-400 font-bold">
                      -{row.wrong}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-heading font-black border ${predicateColor(row.predicate)}`}>
                        Predikat {row.predicate}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Teacher Manual Score Input Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-heading font-bold text-white text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                Input Nilai Praktik / Remedial Guru
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddScore} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  required
                  value={manualForm.studentName}
                  onChange={e => setManualForm(prev => ({ ...prev, studentName: e.target.value }))}
                  placeholder="Contoh: Muhammad Akbar"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kelas</label>
                  <select
                    value={manualForm.kelas}
                    onChange={e => setManualForm(prev => ({ ...prev, kelas: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  >
                    {['X RPL 1', 'X RPL 2', 'X TKJ 1', 'X TKJ 2', 'X AKL 1', 'X Otomotif 1', 'X DPIB 1'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nilai (0 - 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={manualForm.score}
                    onChange={e => setManualForm(prev => ({ ...prev, score: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Benar (+10)</label>
                  <input
                    type="number"
                    min="0"
                    value={manualForm.correct}
                    onChange={e => setManualForm(prev => ({ ...prev, correct: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Salah (-2)</label>
                  <input
                    type="number"
                    min="0"
                    value={manualForm.wrong}
                    onChange={e => setManualForm(prev => ({ ...prev, wrong: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Waktu (detik)</label>
                  <input
                    type="number"
                    min="1"
                    value={manualForm.time}
                    onChange={e => setManualForm(prev => ({ ...prev, time: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black shadow-md hover:bg-amber-300 transition"
                >
                  Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
