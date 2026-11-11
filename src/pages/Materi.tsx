import React, { useState } from 'react';
import { 
  BookOpen, 
  Target, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Tv, 
  HelpCircle,
  Briefcase,
  Play
} from 'lucide-react';
import { GRAMMAR_MATERIALS } from '../data/materialsData';
import { useIFP } from '../context/IFPContext';
import { soundManager } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

interface MateriProps {
  onStartQuiz: (categoryTitle: string) => void;
}

export const Materi: React.FC<MateriProps> = ({ onStartQuiz }) => {
  const [selectedId, setSelectedId] = useState(GRAMMAR_MATERIALS[0].id);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<Record<string, boolean>>({});
  const { triggerHaptic, presentationMode } = useIFP();

  const activeMaterial = GRAMMAR_MATERIALS.find(m => m.id === selectedId) || GRAMMAR_MATERIALS[0];

  const handleSelectOption = (qIdx: number, option: string) => {
    triggerHaptic();
    setQuizAnswers(prev => ({
      ...prev,
      [`${activeMaterial.id}-${qIdx}`]: option
    }));
  };

  const handleCheckAnswer = (qIdx: number, correctAnswer: string) => {
    triggerHaptic();
    const key = `${activeMaterial.id}-${qIdx}`;
    const selected = quizAnswers[key];
    if (!selected) return;

    setSubmittedQuiz(prev => ({ ...prev, [key]: true }));

    if (selected === correctAnswer) {
      soundManager.playCorrect();
      triggerConfetti();
    } else {
      soundManager.playWrong();
    }
  };

  return (
    <div className={`space-y-6 ${presentationMode ? 'scale-[1.01] origin-top' : ''}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-2 border border-indigo-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            Kurikulum Merdeka SMK Fase E
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            Modul & Materi Grammar Interaktif
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pelajari konsep, rumus, contoh kontekstual dunia kerja kejuruan, video pembelajaran, dan mini quiz.
          </p>
        </div>

        <button
          onClick={() => { triggerHaptic(); onStartQuiz(activeMaterial.title); }}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white font-heading font-extrabold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-95 transition touch-manipulation"
        >
          <Play className="w-4 h-4 fill-current" />
          Tantang Game {activeMaterial.title}
        </button>
      </div>

      {/* 6 Category Selection Tabs (Touch Optimized) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {GRAMMAR_MATERIALS.map(m => {
          const isSelected = m.id === activeMaterial.id;
          return (
            <button
              key={m.id}
              onClick={() => { triggerHaptic(); setSelectedId(m.id); }}
              className={`p-3.5 rounded-2xl font-heading font-bold text-xs sm:text-sm transition-all text-center border active:scale-95 touch-manipulation ${
                isSelected
                  ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/20 scale-[1.02]'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
            >
              {m.title}
            </button>
          );
        })}
      </div>

      {/* Main Material Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tujuan Pembelajaran & Ringkasan Materi */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tujuan Pembelajaran Kurikulum Merdeka */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <h3 className="font-heading font-bold text-white text-base sm:text-lg flex items-center gap-2 text-indigo-400 mb-2">
              <Target className="w-5 h-5 text-indigo-400" />
              Tujuan Pembelajaran (Capaian Pembelajaran Fase E)
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed bg-indigo-950/30 p-4 rounded-2xl border border-indigo-800/30">
              {activeMaterial.tujuan}
            </p>
          </div>

          {/* Formula / Rumus Dasar */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <h3 className="font-heading font-bold text-white text-base sm:text-lg flex items-center gap-2 text-amber-400">
              <Sparkles className="w-5 h-5 text-amber-400" />
              Rumus & Struktur Tata Bahasa
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-700/40">
                <span className="text-[11px] font-extrabold uppercase text-emerald-400">Kalimat Positif (+)</span>
                <p className="font-mono text-xs font-bold text-slate-200 mt-1">{activeMaterial.formula.positive}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-700/40">
                <span className="text-[11px] font-extrabold uppercase text-rose-400">Kalimat Negatif (-)</span>
                <p className="font-mono text-xs font-bold text-slate-200 mt-1">{activeMaterial.formula.negative}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-950/30 border border-sky-700/40">
                <span className="text-[11px] font-extrabold uppercase text-sky-400">Kalimat Tanya (?)</span>
                <p className="font-mono text-xs font-bold text-slate-200 mt-1">{activeMaterial.formula.interrogative}</p>
              </div>
            </div>
          </div>

          {/* Materi Ringkas Text */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <h3 className="font-heading font-bold text-white text-base sm:text-lg">
              Ringkasan Materi & Panduan Penggunaan
            </h3>
            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {activeMaterial.content}
            </div>
          </div>

          {/* Contoh Kontekstual Dunia Kerja SMK */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <h3 className="font-heading font-bold text-white text-base sm:text-lg flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              Contoh Penerapan di Dunia Kerja & Kejuruan SMK
            </h3>

            <div className="space-y-3 mt-3">
              {activeMaterial.examples.map((ex, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {ex.context}
                    </span>
                    <span className="text-[10px] text-slate-400">Contoh #{idx + 1}</span>
                  </div>
                  <p className="font-semibold text-white text-sm sm:text-base leading-snug">
                    "{ex.en}"
                  </p>
                  <p className="text-xs text-slate-400 mt-1 italic">
                    Artinya: {ex.id}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Video YouTube Embed & Quick Quiz Latihan */}
        <div className="space-y-6">
          {/* YouTube Video Player Embed */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <Tv className="w-5 h-5 text-rose-500" />
              <h3 className="font-heading font-bold text-white text-sm sm:text-base">
                Video Penjelasan Guru
              </h3>
            </div>
            
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-inner">
              <iframe
                src={activeMaterial.video}
                title={`Video Pembelajaran ${activeMaterial.title}`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-2 text-center">
              Video tutorial interaktif untuk pemahaman mendalam di kelas
            </p>
          </div>

          {/* Mini Quiz Latihan Interaktif */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                <h3 className="font-heading font-bold text-white text-sm sm:text-base">
                  Kuis Latihan Pemahaman
                </h3>
              </div>
              <span className="text-[11px] font-bold text-indigo-400">Quick Check</span>
            </div>

            <div className="space-y-4">
              {activeMaterial.quizLatihan.map((quiz, qIdx) => {
                const key = `${activeMaterial.id}-${qIdx}`;
                const selected = quizAnswers[key];
                const isSubmitted = submittedQuiz[key];
                const isCorrect = selected === quiz.answer;

                return (
                  <div key={qIdx} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3">
                    <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                      {qIdx + 1}. {quiz.question}
                    </p>

                    <div className="space-y-1.5">
                      {quiz.options.map((opt, oIdx) => {
                        const isChosen = selected === opt;
                        let optionStyle = 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-700';

                        if (isSubmitted) {
                          if (opt === quiz.answer) {
                            optionStyle = 'bg-emerald-600/30 text-emerald-300 border-emerald-500 font-bold';
                          } else if (isChosen) {
                            optionStyle = 'bg-rose-600/30 text-rose-300 border-rose-500 line-through';
                          }
                        } else if (isChosen) {
                          optionStyle = 'bg-indigo-600 text-white border-indigo-400 font-bold';
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={isSubmitted}
                            onClick={() => handleSelectOption(qIdx, opt)}
                            className={`w-full py-2 px-3 text-left rounded-xl text-xs font-medium border transition-all active:scale-[0.98] touch-manipulation ${optionStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {!isSubmitted ? (
                      <button
                        disabled={!selected}
                        onClick={() => handleCheckAnswer(qIdx, quiz.answer)}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition ${
                          selected
                            ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 active:scale-95 shadow-md'
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        Periksa Jawaban
                      </button>
                    ) : (
                      <div className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                        isCorrect ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800/40' : 'bg-rose-950/40 text-rose-300 border border-rose-800/40'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold mb-1">
                          {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                          <span>{isCorrect ? 'Benar Sekali!' : `Kurang Tepat. Jawaban: ${quiz.answer}`}</span>
                        </div>
                        <p className="text-[11px] text-slate-300">{quiz.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
