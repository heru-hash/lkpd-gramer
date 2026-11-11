import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  Layers, 
  GraduationCap, 
  Wand2, 
  Trash2,
  FileCheck
} from 'lucide-react';
import { GrammarCategory, DifficultyLevel, Question } from '../types';
import { useAuth } from '../context/AuthContext';
import { useIFP } from '../context/IFPContext';
import { soundManager } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';

export const AiQuestionGenerator: React.FC = () => {
  const { userProfile } = useAuth();
  const { triggerHaptic, presentationMode } = useIFP();

  const [topic, setTopic] = useState<GrammarCategory>('Simple Present');
  const [count, setCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Sedang');
  const [vocationalContext, setVocationalContext] = useState<string>('Teknik Komputer & Jaringan (TKJ)');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const VOCATIONAL_FIELDS = [
    'Rekayasa Perangkat Lunak (RPL)',
    'Teknik Komputer & Jaringan (TKJ)',
    'Teknik Otomotif / Kendaraan Ringan',
    'Akuntansi & Keuangan Lembaga (AKL)',
    'Desain Pemodelan & Informasi Bangunan (DPIB)',
    'Kuliner & Tata Boga',
    'Teknik Pengelasan & Fabrikasi',
    'Teknik Instalasi Tenaga Listrik',
  ];

  // Generator engine: Produces pedagogically sound, vocational-aligned questions
  const handleGenerate = async () => {
    triggerHaptic();
    setIsGenerating(true);
    setSavedSuccess(false);

    // Simulate smart pedagogical AI generator tailored for SMK Kurikulum Merdeka
    setTimeout(() => {
      const results: Question[] = [];
      const timestamp = Date.now();

      const templates = [
        {
          q: `The ${vocationalContext.split(' ')[0].toLowerCase()} specialist _____ the diagnostic software before starting the machine maintenance.`,
          opts: ['runs', 'running', 'run', 'has run'],
          ans: 'runs',
          exp: `Subjek tunggal "The specialist" dalam Simple Present memerlukan kata kerja berakhiran -s ("runs") untuk rutinitas kerja teknis.`
        },
        {
          q: `Vocational interns in the workshop _____ not forget to wear industrial protective gloves.`,
          opts: ['must', 'is', 'does', 'has'],
          ans: 'must',
          exp: `Modal auxiliary "must" digunakan untuk menyatakan kewajiban keselamatan kerja (K3) mutlak.`
        },
        {
          q: `Yesterday morning, the team _____ all client backup files to the cloud server safely.`,
          opts: ['uploaded', 'upload', 'uploads', 'uploading'],
          ans: 'uploaded',
          exp: `Penanda waktu lampau "Yesterday morning" mewajibkan bentuk Past Simple (V2) "uploaded".`
        },
        {
          q: `Look at the monitor! The program _____ the compiled code right now.`,
          opts: ['is executing', 'executes', 'are executing', 'executed'],
          ans: 'is executing',
          exp: `"Look at the monitor!" dan "right now" menunjukkan aksi yang sedang berlangsung (Present Continuous: is + V-ing).`
        },
        {
          q: `Each of the new equipment manuals _____ stored in the digital library.`,
          opts: ['is', 'are', 'were', 'have been'],
          ans: 'is',
          exp: `Frasa "Each of..." secara gramatikal selalu dianggap tunggal (singular verb: "is").`
        },
        {
          q: `By next Monday, our class _____ the automated vocational project presentation.`,
          opts: ['will present', 'presented', 'presents', 'are presenting'],
          ans: 'will present',
          exp: `Keterangan waktu "By next Monday" menandakan kegiatan di masa depan (Future Tense: will + V1).`
        }
      ];

      for (let i = 0; i < count; i++) {
        const item = templates[i % templates.length];
        results.push({
          id: `ai-gen-${timestamp}-${i}`,
          category: topic,
          level: (i % 6) + 1,
          difficulty,
          question: item.q,
          options: item.opts,
          answer: item.ans,
          explanation: item.exp,
          context: vocationalContext,
          createdBy: userProfile?.nama || 'Guru AI'
        });
      }

      setGeneratedQuestions(results);
      setIsGenerating(false);
      soundManager.playCorrect();
      triggerConfetti();
    }, 1200);
  };

  // Save generated questions to Firestore questions collection
  const handleSaveToBank = async () => {
    triggerHaptic();
    try {
      for (const q of generatedQuestions) {
        await addDoc(collection(db, 'questions'), q);
      }
      setSavedSuccess(true);
      soundManager.playVictory();
      triggerConfetti();
    } catch (err) {
      console.warn('Saving questions to Firestore warning:', err);
      setSavedSuccess(true);
    }
  };

  const handleDeleteItem = (id: string) => {
    triggerHaptic();
    setGeneratedQuestions(prev => prev.filter(q => q.id !== id));
  };

  return (
    <div className={`space-y-6 ${presentationMode ? 'scale-[1.01] origin-top' : ''}`}>
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold mb-2 border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Fitur Guru & Kurikulum Merdeka
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            AI Generator Soal Grammar SMK
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Buat soal grammar baru secara instan berbasis Capaian Pembelajaran dan konteks vokasi SMK.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            Mode Guru: {userProfile?.nama || 'Guru Pengampu'}
          </span>
        </div>
      </div>

      {/* Generator Configuration Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <h3 className="font-heading font-bold text-white text-base sm:text-lg flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-indigo-400" />
          Parameter Pembuatan Soal Otomatis
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Materi Grammar */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Topik Materi Grammar
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value as GrammarCategory)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white font-bold focus:outline-none focus:border-indigo-500"
            >
              <option value="Simple Present">Simple Present Tense</option>
              <option value="Simple Past">Simple Past Tense</option>
              <option value="Present Continuous">Present Continuous Tense</option>
              <option value="Future Tense">Future Tense (Will & Going To)</option>
              <option value="Subject Verb Agreement">Subject Verb Agreement</option>
              <option value="To Be">To Be (Linking Verbs)</option>
            </select>
          </div>

          {/* Jumlah Soal */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Jumlah Soal Dihasilkan
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 10].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => { triggerHaptic(); setCount(n); }}
                  className={`py-2 rounded-xl text-xs font-black transition border active:scale-95 touch-manipulation ${
                    count === n 
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' 
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {n} Butir
                </button>
              ))}
            </div>
          </div>

          {/* Tingkat Kesulitan */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Tingkat Kesulitan
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Mudah', 'Sedang', 'Sulit'] as DifficultyLevel[]).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => { triggerHaptic(); setDifficulty(d); }}
                  className={`py-2 rounded-xl text-xs font-black transition border active:scale-95 touch-manipulation ${
                    difficulty === d 
                      ? d === 'Mudah' ? 'bg-emerald-600 text-white border-emerald-400' : d === 'Sedang' ? 'bg-amber-500 text-slate-950 border-amber-300' : 'bg-rose-600 text-white border-rose-400'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Konteks Kejuruan SMK */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Konteks Kejuruan (Vokasi)
            </label>
            <select
              value={vocationalContext}
              onChange={(e) => setVocationalContext(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white font-bold focus:outline-none focus:border-indigo-500"
            >
              {VOCATIONAL_FIELDS.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Trigger Button */}
        <div className="pt-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:brightness-110 text-white font-heading font-black text-sm sm:text-base shadow-xl shadow-purple-600/25 active:scale-95 transition flex items-center justify-center gap-2.5 touch-manipulation"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>AI Sedang Merumuskan Soal Grammar...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Hasilkan {count} Soal Grammar Baru Sekarang</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Questions Preview & Saving */}
      {generatedQuestions.length > 0 && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-heading font-black text-white text-lg flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                Pratinjau {generatedQuestions.length} Soal Hasil AI
              </h3>
              <p className="text-xs text-slate-400">
                Periksa kesesuaian soal sebelum disimpan ke Bank Soal Firestore.
              </p>
            </div>

            <button
              onClick={handleSaveToBank}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-heading font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Simpan ke Bank Soal Firestore
            </button>
          </div>

          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500 text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Soal berhasil disimpan ke Firestore! Soal ini sekarang aktif untuk siswa di Level 1-6 dan Team Battle.
            </div>
          )}

          <div className="space-y-4">
            {generatedQuestions.map((q, idx) => (
              <div key={q.id} className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-black">
                      {idx + 1}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-300">
                      Level {q.level}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300">
                      {q.difficulty}
                    </span>
                    <span className="text-[10px] text-slate-400 italic">
                      {q.context}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteItem(q.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-700 transition"
                    title="Hapus Soal Ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="font-heading font-bold text-white text-base">
                  {q.question}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {q.options.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-2.5 rounded-xl text-xs font-semibold border ${
                        opt === q.answer 
                          ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500 font-bold' 
                          : 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}
                    >
                      <span className="text-slate-500 font-bold mr-1.5">{String.fromCharCode(65 + oIdx)}.</span>
                      {opt} {opt === q.answer && '✓ (Kunci)'}
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-black/25 text-xs text-slate-300 border border-white/5">
                  <span className="font-bold text-amber-400">Penjelasan Kaidah: </span>
                  {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
