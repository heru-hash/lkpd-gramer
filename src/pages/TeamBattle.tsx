import React, { useState, useEffect } from 'react';
import { 
  Swords, 
  Play, 
  RotateCcw, 
  Trophy, 
  Flame, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Timer,
  Volume2,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { TeamColor, Question } from '../types';
import { GRAMMAR_QUESTION_BANK, getRandomQuestions } from '../data/grammarQuestions';
import { soundManager } from '../utils/audio';
import { triggerConfetti, triggerGrandCelebration } from '../utils/confetti';
import { useIFP } from '../context/IFPContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

interface TeamScore {
  name: string;
  score: number;
  color: string;
  badge: string;
}

export const TeamBattle: React.FC = () => {
  const { userProfile } = useAuth();
  const { triggerHaptic, presentationMode, toggleFullscreen } = useIFP();

  const [teams, setTeams] = useState<Record<TeamColor, TeamScore>>({
    red: { name: 'Tim Merah', score: 0, color: 'from-rose-600 to-red-700 border-rose-500', badge: '🔴' },
    blue: { name: 'Tim Biru', score: 0, color: 'from-blue-600 to-indigo-700 border-blue-500', badge: '🔵' },
    green: { name: 'Tim Hijau', score: 0, color: 'from-emerald-600 to-teal-700 border-emerald-500', badge: '🟢' },
    yellow: { name: 'Tim Kuning', score: 0, color: 'from-amber-500 to-yellow-600 border-amber-400', badge: '🟡' },
  });

  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [battleStatus, setBattleStatus] = useState<'idle' | 'question_active' | 'answered' | 'finished'>('idle');
  const [activeTeamBuzzer, setActiveTeamBuzzer] = useState<TeamColor | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const [round, setRound] = useState(1);
  const totalRounds = 10;

  // Real-time Firestore sync for battles collection
  useEffect(() => {
    const battleRef = doc(db, 'battles', 'active_session');
    const unsub = onSnapshot(battleRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.teams) setTeams(data.teams);
        if (data.round) setRound(data.round);
      }
    }, (err) => {
      console.warn('Realtime battle sync error:', err);
    });

    return () => unsub();
  }, []);

  const syncTeamsToDb = async (newTeams: Record<TeamColor, TeamScore>, currentRound: number) => {
    try {
      await setDoc(doc(db, 'battles', 'active_session'), {
        teams: newTeams,
        round: currentRound,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('Battle sync warning:', err);
    }
  };

  // Start new round
  const startNewRound = () => {
    triggerHaptic();
    const [q] = getRandomQuestions({ count: 1 });
    setActiveQuestion(q || GRAMMAR_QUESTION_BANK[0]);
    setBattleStatus('question_active');
    setActiveTeamBuzzer(null);
    setSelectedAnswer(null);
    setTimeLeft(20);
    soundManager.playTick();
  };

  // Countdown timer
  useEffect(() => {
    if (battleStatus !== 'question_active') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          soundManager.playTimeUp();
          setBattleStatus('answered');
          return 0;
        }
        if (prev <= 5) soundManager.playTick();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [battleStatus]);

  // Team buzzes in on touchscreen
  const handleTeamBuzz = (color: TeamColor) => {
    if (battleStatus !== 'question_active') return;
    triggerHaptic();
    soundManager.playStreak();
    setActiveTeamBuzzer(color);
  };

  // Process chosen answer for the active buzzing team
  const handleAnswerChoice = (ans: string) => {
    if (!activeQuestion || !activeTeamBuzzer) return;
    triggerHaptic();
    setSelectedAnswer(ans);
    setBattleStatus('answered');

    const isCorrect = ans.trim().toLowerCase() === activeQuestion.answer.trim().toLowerCase();
    const updated = { ...teams };

    if (isCorrect) {
      soundManager.playCorrect();
      triggerConfetti();
      updated[activeTeamBuzzer].score += 10;
    } else {
      soundManager.playWrong();
      updated[activeTeamBuzzer].score = Math.max(0, updated[activeTeamBuzzer].score - 2);
    }

    setTeams(updated);
    syncTeamsToDb(updated, round);

    if (round >= totalRounds) {
      setTimeout(() => {
        setBattleStatus('finished');
        soundManager.playVictory();
        triggerGrandCelebration();
      }, 1500);
    }
  };

  const handleNextRound = () => {
    if (round < totalRounds) {
      setRound(prev => prev + 1);
      startNewRound();
    } else {
      setBattleStatus('finished');
      soundManager.playVictory();
      triggerGrandCelebration();
    }
  };

  const resetBattle = () => {
    triggerHaptic();
    const resetTeams: Record<TeamColor, TeamScore> = {
      red: { name: 'Tim Merah', score: 0, color: 'from-rose-600 to-red-700 border-rose-500', badge: '🔴' },
      blue: { name: 'Tim Biru', score: 0, color: 'from-blue-600 to-indigo-700 border-blue-500', badge: '🔵' },
      green: { name: 'Tim Hijau', score: 0, color: 'from-emerald-600 to-teal-700 border-emerald-500', badge: '🟢' },
      yellow: { name: 'Tim Kuning', score: 0, color: 'from-amber-500 to-yellow-600 border-amber-400', badge: '🟡' },
    };
    setTeams(resetTeams);
    setRound(1);
    setBattleStatus('idle');
    setActiveQuestion(null);
    setActiveTeamBuzzer(null);
    syncTeamsToDb(resetTeams, 1);
  };

  // Rank teams for podium
  const sortedTeams = (Object.keys(teams) as TeamColor[])
    .map(c => ({ colorKey: c, ...teams[c] }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className={`space-y-6 ${presentationMode ? 'scale-[1.02] origin-top' : ''}`}>
      {/* Header & Arena Control */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold mb-2 border border-rose-500/30">
            <Swords className="w-3.5 h-3.5" />
            Papan Interaktif Digital (Interactive Flat Panel)
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            Team Battle Grammar Arena ⚔️
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Moda kompetisi kelas 4 tim interaktif dengan skor realtime untuk proyektor dan layar sentuh.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => { triggerHaptic(); toggleFullscreen(); }}
            className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 active:scale-95 transition flex items-center gap-2"
          >
            <Maximize2 className="w-4 h-4" />
            Layar Penuh
          </button>

          {battleStatus === 'idle' ? (
            <button
              onClick={startNewRound}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-heading font-black text-sm shadow-xl shadow-amber-500/20 active:scale-95 transition flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Mulai Pertandingan
            </button>
          ) : (
            <button
              onClick={resetBattle}
              className="px-4 py-3 rounded-2xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold text-xs border border-rose-500/30 active:scale-95 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Pertandingan
            </button>
          )}
        </div>
      </div>

      {/* Realtime 4-Team Live Scoreboard (Interactive Flat Panel Display) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {(Object.keys(teams) as TeamColor[]).map((cKey) => {
          const t = teams[cKey];
          const isBuzzed = activeTeamBuzzer === cKey;

          return (
            <div
              key={cKey}
              onClick={() => handleTeamBuzz(cKey)}
              className={`p-5 rounded-3xl bg-gradient-to-br ${t.color} text-white shadow-xl transition-all relative overflow-hidden border-2 cursor-pointer active:scale-95 touch-manipulation ${
                isBuzzed ? 'ring-4 ring-white animate-streak scale-105' : 'opacity-90 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-heading font-extrabold text-lg sm:text-xl flex items-center gap-2">
                  {t.badge} {t.name}
                </span>
                {isBuzzed && (
                  <span className="px-2 py-0.5 rounded-full bg-white text-slate-950 font-black text-[10px] animate-pulse">
                    BUZZ!
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-xs uppercase font-bold tracking-wider opacity-80">Skor Tim</span>
                <span className="font-heading font-black text-3xl sm:text-4xl">{t.score}</span>
              </div>

              {battleStatus === 'question_active' && !activeTeamBuzzer && (
                <div className="mt-3 py-1.5 px-3 rounded-xl bg-black/25 text-center text-xs font-bold border border-white/20">
                  👆 Sentuh untuk Menjawab
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Central Battle Arena & Question Zone */}
      {battleStatus !== 'idle' && battleStatus !== 'finished' && activeQuestion && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border-2 border-slate-700 shadow-2xl space-y-6">
          {/* Round & Timer bar */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 font-heading font-black text-xs sm:text-sm border border-indigo-500/30">
              Ronde {round} dari {totalRounds} • {activeQuestion.category}
            </span>

            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-2xl font-heading font-black text-base sm:text-lg border ${
              timeLeft <= 5 ? 'bg-rose-500/20 text-rose-400 border-rose-500 animate-pulse' : 'bg-slate-800 text-cyan-300 border-slate-700'
            }`}>
              <Timer className="w-5 h-5" />
              <span>{timeLeft}s</span>
            </div>
          </div>

          {/* Question text */}
          <div className="text-center py-4">
            <h2 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-snug">
              "{activeQuestion.question}"
            </h2>
            {activeQuestion.context && (
              <p className="text-xs text-slate-400 mt-2 font-semibold">
                Konteks: {activeQuestion.context}
              </p>
            )}
          </div>

          {/* Buzzer Alert */}
          {activeTeamBuzzer ? (
            <div className={`p-4 rounded-2xl text-center font-heading font-black text-base sm:text-lg border-2 animate-bounce ${
              teams[activeTeamBuzzer].color
            } text-white shadow-lg`}>
              ⚡ {teams[activeTeamBuzzer].name} Sedang Menjawab! Sentuh opsi pilihan jawaban:
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 text-center text-xs sm:text-sm font-bold text-indigo-300">
              🔔 Sentuh tombol kartu tim di atas untuk memencet bel (Buzzer) sebelum menjawab!
            </div>
          )}

          {/* 4 Interactive Answer Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {activeQuestion.options.map((opt, idx) => {
              const isCorrectAnswer = opt.trim().toLowerCase() === activeQuestion.answer.trim().toLowerCase();
              const isPicked = selectedAnswer === opt;

              let btnStyle = 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white';

              if (battleStatus === 'answered') {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-600 border-emerald-400 text-white font-black scale-102';
                } else if (isPicked) {
                  btnStyle = 'bg-rose-600 border-rose-400 text-white line-through';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={!activeTeamBuzzer || battleStatus === 'answered'}
                  onClick={() => handleAnswerChoice(opt)}
                  className={`min-h-[80px] p-5 rounded-2xl border-2 font-heading font-black text-lg sm:text-xl text-left flex items-center justify-between transition-all active:scale-95 touch-manipulation shadow-lg ${btnStyle} ${
                    !activeTeamBuzzer ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="truncate pr-2">{opt}</span>
                  <span className="w-8 h-8 rounded-full bg-black/25 flex items-center justify-center text-xs font-black">
                    {String.fromCharCode(65 + idx)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Explanation & Next Round button */}
          {battleStatus === 'answered' && (
            <div className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
              <div className="text-xs sm:text-sm text-slate-200">
                <span className="font-bold text-amber-400">💡 Penjelasan: </span>
                {activeQuestion.explanation}
              </div>
              <button
                onClick={handleNextRound}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-heading font-black text-sm shrink-0 shadow-lg active:scale-95 transition"
              >
                Ronde Berikutnya ({round + 1}/{totalRounds}) →
              </button>
            </div>
          )}
        </div>
      )}

      {/* FINISHED PODIUM SCREEN */}
      {battleStatus === 'finished' && (
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-400 flex items-center justify-center shadow-xl shadow-amber-500/30">
            <Trophy className="w-10 h-10 text-slate-950" />
          </div>

          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
              Pertandingan Selesai
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-white mt-1">
              Juara Team Battle: {sortedTeams[0].name}! 🏆
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Selamat kepada seluruh tim atas kerja sama dan penguasaan grammar yang hebat!
            </p>
          </div>

          {/* Podium Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-2">
            {sortedTeams.map((t, idx) => (
              <div
                key={t.colorKey}
                className={`p-5 rounded-3xl bg-gradient-to-br ${t.color} text-white shadow-xl border-2 flex flex-col items-center justify-between ${
                  idx === 0 ? 'scale-105 ring-4 ring-amber-300' : ''
                }`}
              >
                <span className="text-2xl font-black">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '🎖️'}</span>
                <p className="font-heading font-bold text-base mt-2">{t.name}</p>
                <p className="font-heading font-black text-3xl mt-1">{t.score} pts</p>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={resetBattle}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-heading font-black text-base shadow-xl shadow-amber-500/20 active:scale-95 transition"
            >
              Mulai Pertandingan Baru
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
