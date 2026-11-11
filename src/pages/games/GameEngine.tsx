import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RotateCcw, 
  ArrowLeft, 
  Flame, 
  Award, 
  Zap, 
  Volume2, 
  CheckCircle2, 
  XCircle, 
  Swords,
  Timer,
  GripVertical,
  Target,
  Move
} from 'lucide-react';
import { Question, GrammarCategory, DifficultyLevel, PredicateGrade, ScoreRecord } from '../../types';
import { getRandomQuestions } from '../../data/grammarQuestions';
import { soundManager } from '../../utils/audio';
import { triggerConfetti, triggerGrandCelebration } from '../../utils/confetti';
import { useAuth } from '../../context/AuthContext';
import { useIFP } from '../../context/IFPContext';
import { db, handleFirestoreError, OperationType } from '../../services/firebase';
import { collection, addDoc, doc, setDoc, getDoc } from 'firebase/firestore';

interface GameEngineProps {
  level: number;
  category?: GrammarCategory;
  difficulty?: DifficultyLevel;
  onBack: () => void;
}

export const GameEngine: React.FC<GameEngineProps> = ({
  level,
  category,
  difficulty = 'Sedang',
  onBack,
}) => {
  const { userProfile } = useAuth();
  const { triggerHaptic, presentationMode, highContrast } = useIFP();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string; explanation: string } | null>(null);

  // Level 1: Drag & Drop slots state
  const [dragSlot, setDragSlot] = useState<string | null>(null);
  const [droppedWord, setDroppedWord] = useState<string | null>(null);
  const [draggedOption, setDraggedOption] = useState<string | null>(null);
  const [isOverDropZone, setIsOverDropZone] = useState<boolean>(false);
  const [touchDragPos, setTouchDragPos] = useState<{ x: number; y: number } | null>(null);
  const [touchDraggedWord, setTouchDraggedWord] = useState<string | null>(null);
  const dropZoneRef = useRef<HTMLSpanElement | null>(null);

  // Level 3: Sentence builder selected words
  const [selectedWordOrder, setSelectedWordOrder] = useState<string[]>([]);

  // Level 6: Boss Battle HP
  const [bossHp, setBossHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(100);

  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const LEVEL_NAMES: Record<number, { name: string; tag: string }> = {
    1: { name: 'Drag & Drop Slotter', tag: 'Level 1: Sentuh & Lengkapi' },
    2: { name: 'Multiple Choice Blitz', tag: 'Level 2: 4 Kartu Kahoot Style' },
    3: { name: 'Sentence Builder', tag: 'Level 3: Susun Konstruksi Kalimat' },
    4: { name: 'True or False Quickfire', tag: 'Level 4: Verifikasi Kaidah Cepat' },
    5: { name: 'Grammar Time Race', tag: 'Level 5: Serangan Kecepatan & Kombo' },
    6: { name: 'Boss Battle: The Grammar Overlord', tag: 'Level 6: Pertarungan Penakluk Grammar' },
  };

  // Initialize questions
  const initGame = () => {
    const qList = getRandomQuestions({
      category,
      level,
      difficulty,
      count: level === 6 ? 12 : 8,
    });
    setQuestions(qList);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setWrongCount(0);
    setStreak(0);
    setHighestStreak(0);
    setTimeLeft(level === 5 ? 15 : (level === 2 ? 20 : 30));
    setIsGameOver(false);
    setFeedback(null);
    setDragSlot(null);
    setDroppedWord(null);
    setIsOverDropZone(false);
    setTouchDragPos(null);
    setTouchDraggedWord(null);
    setSelectedWordOrder([]);
    setBossHp(100);
    setPlayerHp(100);
    startTimeRef.current = Date.now();
  };

  useEffect(() => {
    initGame();
  }, [level, category, difficulty]);

  // Countdown Timer
  useEffect(() => {
    if (isGameOver || feedback !== null) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        if (prev <= 5) {
          soundManager.playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isGameOver, feedback]);

  const currentQ = questions[currentIndex];

  const handleTimeOut = () => {
    soundManager.playTimeUp();
    triggerHaptic();
    handleAnswerSubmit('__TIMEOUT__');
  };

  const calculatePredicate = (finalScore: number, totalQ: number): PredicateGrade => {
    const maxPossible = totalQ * 10;
    const percentage = Math.min(100, Math.round((Math.max(0, finalScore) / Math.max(1, maxPossible)) * 100));

    if (percentage >= 95) return 'A';
    if (percentage >= 86) return 'B';
    if (percentage >= 76) return 'C';
    return 'D';
  };

  const finishGame = async (finalScore: number, finalCorrect: number, finalWrong: number) => {
    setIsGameOver(true);
    soundManager.playVictory();
    triggerGrandCelebration();

    const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    const predicate = calculatePredicate(finalScore, questions.length);

    // Record score to Firestore
    if (userProfile?.uid) {
      const record: Omit<ScoreRecord, 'id'> = {
        uid: userProfile.uid,
        studentName: userProfile.nama,
        kelas: userProfile.kelas || 'X RPL 1',
        jurusan: userProfile.jurusan || 'SMK',
        level,
        levelName: LEVEL_NAMES[level].name,
        score: finalScore,
        correct: finalCorrect,
        wrong: finalWrong,
        streak: highestStreak,
        time: durationSeconds,
        predicate,
        createdAt: new Date().toISOString()
      };

      try {
        await addDoc(collection(db, 'scores'), record);

        // Update leaderboard
        const lbRef = doc(db, 'leaderboards', userProfile.uid);
        const lbSnap = await getDoc(lbRef);

        const currentTotal = lbSnap.exists() ? (lbSnap.data().totalScore || 0) : 0;
        const currentGames = lbSnap.exists() ? (lbSnap.data().gamesPlayed || 0) : 0;
        const newTotal = currentTotal + Math.max(0, finalScore);
        const newGames = currentGames + 1;

        let badge = 'Beginner';
        if (newTotal >= 1000) badge = 'Champion';
        else if (newTotal >= 600) badge = 'Grammar Master';
        else if (newTotal >= 300) badge = 'Grammar Hero';
        else if (newTotal >= 100) badge = 'Explorer';

        await setDoc(lbRef, {
          uid: userProfile.uid,
          nama: userProfile.nama,
          kelas: userProfile.kelas || 'X RPL 1',
          jurusan: userProfile.jurusan || 'SMK',
          totalScore: newTotal,
          gamesPlayed: newGames,
          badge,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Score recording to Firestore fallback:', err);
      }
    }
  };

  const handleAnswerSubmit = (submittedAnswer: string) => {
    triggerHaptic();
    if (feedback !== null || !currentQ) return;

    let isCorrect = false;

    if (level === 3) {
      // Sentence builder verification
      isCorrect = submittedAnswer.trim().toLowerCase() === currentQ.answer.trim().toLowerCase();
    } else {
      isCorrect = submittedAnswer.trim().toLowerCase() === currentQ.answer.trim().toLowerCase();
    }

    let pointsDelta = 0;
    let nextStreak = streak;

    if (isCorrect) {
      pointsDelta += 10;
      nextStreak += 1;
      soundManager.playCorrect();
      triggerConfetti();

      // Streak Bonus per specification:
      // Streak 5: +20 bonus
      // Streak 10: +50 bonus
      if (nextStreak === 5) {
        pointsDelta += 20;
        soundManager.playStreak();
      } else if (nextStreak === 10) {
        pointsDelta += 50;
        soundManager.playStreak();
      }

      setStreak(nextStreak);
      if (nextStreak > highestStreak) setHighestStreak(nextStreak);
      setCorrectCount(prev => prev + 1);

      if (level === 6) {
        setBossHp(prev => Math.max(0, prev - (nextStreak >= 5 ? 25 : 15)));
      }
    } else {
      // Wrong answer: -2 points per specification
      pointsDelta = -2;
      setStreak(0);
      setWrongCount(prev => prev + 1);
      soundManager.playWrong();

      if (level === 6) {
        setPlayerHp(prev => Math.max(0, prev - 20));
      }
    }

    const nextScore = Math.max(0, score + pointsDelta);
    setScore(nextScore);

    setFeedback({
      isCorrect,
      message: isCorrect 
        ? `Benar! (+${pointsDelta} pts)${nextStreak >= 5 ? ` 🔥 STREAK x${nextStreak}!` : ''}` 
        : `Kurang Tepat (-2 pts). Jawaban Benar: "${currentQ.answer}"`,
      explanation: currentQ.explanation
    });
  };

  const handleNextQuestion = () => {
    triggerHaptic();
    setFeedback(null);
    setDragSlot(null);
    setDroppedWord(null);
    setIsOverDropZone(false);
    setTouchDragPos(null);
    setTouchDraggedWord(null);
    setSelectedWordOrder([]);

    // Check boss battle early win/loss
    if (level === 6) {
      if (bossHp <= 0 || playerHp <= 0) {
        finishGame(score, correctCount, wrongCount);
        return;
      }
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(level === 5 ? 15 : (level === 2 ? 20 : 30));
    } else {
      finishGame(score, correctCount, wrongCount);
    }
  };

  // Drag and drop event handlers (HTML5 Drag & Drop)
  const handleDragStart = (e: React.DragEvent, word: string) => {
    e.dataTransfer.setData('text/plain', word);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedOption(word);
    triggerHaptic();
  };

  const handleDragEnd = () => {
    setDraggedOption(null);
    setIsOverDropZone(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isOverDropZone) setIsOverDropZone(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOverDropZone(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOverDropZone(false);
    const word = e.dataTransfer.getData('text/plain') || draggedOption;
    if (word && feedback === null) {
      setDroppedWord(word);
      handleAnswerSubmit(word);
    }
    setDraggedOption(null);
  };

  // Touch Drag & Drop for Touchscreens and Interactive Flat Panel (IFP)
  const handleTouchStart = (e: React.TouchEvent, word: string) => {
    if (feedback !== null) return;
    const touch = e.touches[0];
    setTouchDraggedWord(word);
    setTouchDragPos({ x: touch.clientX, y: touch.clientY });
    triggerHaptic();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchDraggedWord) return;
    const touch = e.touches[0];
    setTouchDragPos({ x: touch.clientX, y: touch.clientY });

    if (dropZoneRef.current) {
      const rect = dropZoneRef.current.getBoundingClientRect();
      const isInside = (
        touch.clientX >= rect.left - 25 &&
        touch.clientX <= rect.right + 25 &&
        touch.clientY >= rect.top - 25 &&
        touch.clientY <= rect.bottom + 25
      );
      setIsOverDropZone(isInside);
    }
  };

  const handleTouchEnd = () => {
    if (touchDraggedWord && isOverDropZone && feedback === null) {
      setDroppedWord(touchDraggedWord);
      handleAnswerSubmit(touchDraggedWord);
    }
    setTouchDraggedWord(null);
    setTouchDragPos(null);
    setIsOverDropZone(false);
  };

  // Color cards for Level 2 (Kahoot / Quizizz style)
  const OPTION_THEMES = [
    'from-red-600 to-rose-700 border-red-400 hover:brightness-110',
    'from-blue-600 to-indigo-700 border-blue-400 hover:brightness-110',
    'from-amber-500 to-yellow-600 border-yellow-300 hover:brightness-110',
    'from-emerald-600 to-teal-700 border-emerald-400 hover:brightness-110',
  ];

  if (!currentQ && !isGameOver) {
    return (
      <div className="p-12 text-center text-white space-y-4">
        <p className="font-heading font-bold text-xl">Menyiapkan Tantangan Grammar...</p>
        <button onClick={onBack} className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold">
          Kembali ke Menu
        </button>
      </div>
    );
  }

  // GAME OVER / RESULT SCREEN
  if (isGameOver) {
    const predicate = calculatePredicate(score, questions.length);
    const predicateColors: Record<PredicateGrade, { bg: string; text: string; label: string }> = {
      A: { bg: 'bg-emerald-500/20 border-emerald-500/40', text: 'text-emerald-400', label: 'Sangat Memuaskan (A)' },
      B: { bg: 'bg-indigo-500/20 border-indigo-500/40', text: 'text-indigo-400', label: 'Tuntas Baik (B)' },
      C: { bg: 'bg-amber-500/20 border-amber-500/40', text: 'text-amber-400', label: 'Cukup Tuntas (C)' },
      D: { bg: 'bg-rose-500/20 border-rose-500/40', text: 'text-rose-400', label: 'Perlu Remedial (D)' },
    };

    return (
      <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-6 animate-in zoom-in-95">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center shadow-xl shadow-amber-500/30">
          <Award className="w-10 h-10 text-slate-950" />
        </div>

        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400">
            Hasil Game Pembelajaran SMK
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mt-1">
            Tantangan Selesai! 🎉
          </h2>
          <p className="text-sm text-slate-400 mt-1">{LEVEL_NAMES[level].name}</p>
        </div>

        {/* Predikat Badge */}
        <div className={`p-4 rounded-2xl border ${predicateColors[predicate].bg}`}>
          <span className="text-xs font-bold text-slate-400 uppercase">Predikat Nilai Kurikulum Merdeka</span>
          <div className={`font-heading font-black text-4xl mt-1 ${predicateColors[predicate].text}`}>
            {predicate}
          </div>
          <p className={`text-sm font-bold mt-0.5 ${predicateColors[predicate].text}`}>
            {predicateColors[predicate].label}
          </p>
        </div>

        {/* Score & Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/50">
            <span className="text-[11px] font-bold text-slate-400">Total Skor</span>
            <p className="font-heading font-black text-2xl text-amber-400 mt-0.5">{score} pts</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/50">
            <span className="text-[11px] font-bold text-slate-400">Benar (+10)</span>
            <p className="font-heading font-black text-2xl text-emerald-400 mt-0.5">{correctCount}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/50">
            <span className="text-[11px] font-bold text-slate-400">Salah (-2)</span>
            <p className="font-heading font-black text-2xl text-rose-400 mt-0.5">{wrongCount}</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/50">
            <span className="text-[11px] font-bold text-slate-400">Max Streak</span>
            <p className="font-heading font-black text-2xl text-orange-400 mt-0.5">x{highestStreak}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => { triggerHaptic(); initGame(); }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-heading font-black text-sm shadow-lg shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Main Lagi (Soal Acak)
          </button>
          <button
            onClick={() => { triggerHaptic(); onBack(); }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-heading font-bold text-sm border border-slate-700 active:scale-95 transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Hub Game
          </button>
        </div>
      </div>
    );
  }

  // ACTIVE GAMEPLAY SCREEN
  return (
    <div className={`max-w-4xl mx-auto space-y-5 ${presentationMode ? 'scale-[1.02] origin-top' : ''}`}>
      {/* Top HUD: Level Tag, Timer, Score, Streak */}
      <div className="flex items-center justify-between p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { triggerHaptic(); onBack(); }}
            className="p-2.5 rounded-2xl bg-slate-800 text-slate-400 hover:text-white border border-slate-700 active:scale-95 transition"
            title="Keluar ke Menu"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-400">
              {LEVEL_NAMES[level].tag}
            </span>
            <h2 className="font-heading font-bold text-white text-sm sm:text-base leading-tight">
              Soal {currentIndex + 1} dari {questions.length}
            </h2>
          </div>
        </div>

        {/* Center Countdown Timer */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-heading font-black text-sm sm:text-lg border ${
          timeLeft <= 5 
            ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' 
            : 'bg-slate-800 text-cyan-300 border-slate-700'
        }`}>
          <Timer className="w-5 h-5" />
          <span>{timeLeft}s</span>
        </div>

        {/* Right Stats: Streak & Score */}
        <div className="flex items-center gap-2 sm:gap-4">
          {streak > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400 font-heading font-black text-xs animate-streak">
              <Flame className="w-4 h-4 fill-current" />
              <span>Streak x{streak}</span>
            </div>
          )}

          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-bold">Skor</span>
            <p className="font-heading font-black text-xl sm:text-2xl text-amber-400 leading-tight">
              {score}
            </p>
          </div>
        </div>
      </div>

      {/* Level 6 Boss Battle HP Bars */}
      {level === 6 && (
        <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-purple-400 flex items-center gap-1.5">
              <Swords className="w-4 h-4" />
              The Grammar Overlord (Boss)
            </span>
            <span className="text-purple-400">{bossHp} / 100 HP</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-rose-600 transition-all duration-300"
              style={{ width: `${bossHp}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-bold pt-1">
            <span className="text-emerald-400">Kesehatan Siswa ({userProfile?.nama})</span>
            <span className="text-emerald-400">{playerHp} / 100 HP</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
              style={{ width: `${playerHp}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Question Card (High Contrast & Large for IFP) */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl transition-all ${
        highContrast 
          ? 'bg-[#0b1329] border-amber-400 text-white' 
          : 'bg-slate-900/95 border-slate-800 text-white'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 text-xs font-bold rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {currentQ.category}
          </span>
          {currentQ.context && (
            <span className="text-xs font-semibold text-slate-400 italic">
              Konteks: {currentQ.context}
            </span>
          )}
        </div>

        {/* Question Prompt - Level 1 shows Interactive Drop Target Slot */}
        {level === 1 && currentQ.question.split(/_{2,}/).length > 1 ? (
          (() => {
            const parts = currentQ.question.split(/_{2,}/);
            return (
              <h3 className={`font-heading font-extrabold text-xl sm:text-2xl md:text-3xl tracking-tight leading-snug flex flex-wrap items-center gap-y-2.5 ${
                presentationMode ? 'text-2xl sm:text-3xl' : ''
              }`}>
                <span>{parts[0]}</span>
                <span
                  ref={dropZoneRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`inline-flex items-center justify-center min-w-[170px] sm:min-w-[210px] min-h-[54px] px-4 py-1.5 mx-2 my-1 rounded-2xl border-2 border-dashed transition-all duration-200 select-none ${
                    droppedWord 
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-black shadow-lg scale-105' 
                      : isOverDropZone 
                      ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 ring-4 ring-cyan-400/40 scale-105 animate-pulse' 
                      : 'bg-slate-850 border-indigo-400/60 text-slate-300 hover:border-amber-400'
                  }`}
                >
                  {droppedWord ? (
                    <span className="font-heading font-black text-xl text-amber-400">{droppedWord}</span>
                  ) : isOverDropZone ? (
                    <span className="text-cyan-300 font-extrabold text-sm flex items-center gap-1.5 animate-bounce">
                      <Target className="w-5 h-5 text-cyan-300" />
                      Lepaskan di Sini!
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs sm:text-sm font-bold flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-amber-400 animate-pulse" />
                      Tarik / Geser ke Sini
                    </span>
                  )}
                </span>
                <span>{parts[1]}</span>
              </h3>
            );
          })()
        ) : (
          <h3 className={`font-heading font-extrabold text-xl sm:text-2xl md:text-3xl tracking-tight leading-snug ${
            presentationMode ? 'text-2xl sm:text-3xl' : ''
          }`}>
            {currentQ.question}
          </h3>
        )}
      </div>

      {/* INTERACTIVE INPUT ZONE DEPENDING ON LEVEL */}

      {/* LEVEL 1: True Drag & Drop with Mouse and Touch Support */}
      {level === 1 && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-300 text-xs sm:text-sm font-bold pb-2 border-b border-slate-800 gap-2">
            <span className="flex items-center gap-2 text-amber-400">
              <Move className="w-4 h-4 text-amber-400 animate-pulse" />
              Tarik (geser) kartu kata di bawah ke kotak target di atas, atau sentuh langsung:
            </span>
            <span className="text-slate-400 text-[11px] font-semibold">
              Mendukung Drag Mouse & Touchscreen IFP
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = droppedWord === opt;
              const isBeingDragged = draggedOption === opt || touchDraggedWord === opt;

              return (
                <div
                  key={idx}
                  draggable={feedback === null}
                  onDragStart={(e) => handleDragStart(e, opt)}
                  onDragEnd={handleDragEnd}
                  onTouchStart={(e) => handleTouchStart(e, opt)}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onClick={() => {
                    if (feedback === null) {
                      triggerHaptic();
                      setDroppedWord(opt);
                      handleAnswerSubmit(opt);
                    }
                  }}
                  className={`min-h-[80px] sm:min-h-[90px] p-4 rounded-2xl font-heading font-black text-lg sm:text-xl border-2 transition-all active:scale-95 touch-manipulation shadow-xl cursor-grab active:cursor-grabbing flex items-center justify-center gap-2 select-none ${
                    isSelected 
                      ? 'bg-amber-500 text-slate-950 border-amber-300 scale-105 ring-4 ring-amber-400/30' 
                      : isBeingDragged
                      ? 'opacity-30 border-dashed border-indigo-400 bg-slate-800'
                      : 'bg-gradient-to-br from-slate-800 to-slate-900 text-white border-slate-700 hover:border-amber-400 hover:bg-slate-750'
                  }`}
                >
                  <GripVertical className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span className="truncate">{opt}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LEVEL 2 & 5: Multiple Choice / Grammar Race (Kahoot / Quizizz vibrant color cards) */}
      {(level === 2 || level === 5 || level === 6) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          {currentQ.options.map((option, idx) => {
            const theme = OPTION_THEMES[idx % OPTION_THEMES.length];
            return (
              <button
                key={idx}
                disabled={feedback !== null}
                onClick={() => handleAnswerSubmit(option)}
                className={`min-h-[85px] sm:min-h-[105px] p-5 rounded-2xl bg-gradient-to-r ${theme} border text-white font-heading font-black text-lg sm:text-xl md:text-2xl shadow-xl flex items-center justify-between transition-all active:scale-95 touch-manipulation`}
              >
                <span className="truncate pr-2">{option}</span>
                <span className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-xs font-black">
                  {String.fromCharCode(65 + idx)}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* LEVEL 3: Sentence Builder (Tap word blocks in order) */}
      {level === 3 && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
          <p className="text-xs sm:text-sm font-bold text-slate-300">
            Susun kata-kata berikut secara berurutan hingga membentuk kalimat yang benar:
          </p>

          {/* Constructed Sentence Box */}
          <div className="min-h-[70px] p-4 rounded-2xl bg-slate-950 border-2 border-dashed border-indigo-500/40 flex flex-wrap items-center gap-2">
            {selectedWordOrder.length === 0 ? (
              <span className="text-xs text-slate-500 italic">Sentuh balok kata di bawah untuk menyusun kalimat...</span>
            ) : (
              selectedWordOrder.map((word, wIdx) => (
                <button
                  key={wIdx}
                  onClick={() => {
                    triggerHaptic();
                    setSelectedWordOrder(prev => prev.filter((_, i) => i !== wIdx));
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow hover:bg-rose-600 transition"
                >
                  {word} ✕
                </button>
              ))
            )}
          </div>

          {/* Available Word Chips */}
          <div className="flex flex-wrap items-center gap-2.5">
            {currentQ.answer.split(' ').sort().map((word, wIdx) => {
              const countUsed = selectedWordOrder.filter(w => w === word).length;
              const countTotal = currentQ.answer.split(' ').filter(w => w === word).length;
              const isUsedUp = countUsed >= countTotal;

              return (
                <button
                  key={wIdx}
                  disabled={isUsedUp || feedback !== null}
                  onClick={() => {
                    triggerHaptic();
                    setSelectedWordOrder(prev => [...prev, word]);
                  }}
                  className={`px-4 py-2.5 rounded-2xl font-heading font-extrabold text-sm sm:text-base border transition-all active:scale-95 touch-manipulation ${
                    isUsedUp
                      ? 'bg-slate-800/40 text-slate-600 border-slate-800 cursor-not-allowed'
                      : 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:border-amber-400'
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>

          {selectedWordOrder.length > 0 && feedback === null && (
            <button
              onClick={() => handleAnswerSubmit(selectedWordOrder.join(' '))}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-heading font-black text-base shadow-lg shadow-amber-500/20 active:scale-95 transition"
            >
              Periksa Susunan Kalimat
            </button>
          )}
        </div>
      )}

      {/* LEVEL 4: True or False (Giant touch friendly buttons) */}
      {level === 4 && (
        <div className="grid grid-cols-2 gap-4">
          <button
            disabled={feedback !== null}
            onClick={() => handleAnswerSubmit('True')}
            className="min-h-[110px] sm:min-h-[140px] rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 border-2 border-emerald-400 text-white font-heading font-black text-2xl sm:text-3xl shadow-xl hover:brightness-110 active:scale-95 transition flex flex-col items-center justify-center gap-2 touch-manipulation"
          >
            <CheckCircle2 className="w-10 h-10" />
            <span>TRUE (BENAR)</span>
          </button>

          <button
            disabled={feedback !== null}
            onClick={() => handleAnswerSubmit('False')}
            className="min-h-[110px] sm:min-h-[140px] rounded-3xl bg-gradient-to-br from-rose-500 to-red-700 border-2 border-rose-400 text-white font-heading font-black text-2xl sm:text-3xl shadow-xl hover:brightness-110 active:scale-95 transition flex flex-col items-center justify-center gap-2 touch-manipulation"
          >
            <XCircle className="w-10 h-10" />
            <span>FALSE (SALAH)</span>
          </button>
        </div>
      )}

      {/* FEEDBACK POPUP / MODAL (Instant touch feedback) */}
      {feedback && (
        <div className={`p-6 rounded-3xl border-2 shadow-2xl animate-in zoom-in-95 space-y-3 ${
          feedback.isCorrect 
            ? 'bg-emerald-950/90 border-emerald-500 text-emerald-100' 
            : 'bg-rose-950/90 border-rose-500 text-rose-100'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {feedback.isCorrect ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-7 h-7 text-rose-400 shrink-0" />
              )}
              <h4 className="font-heading font-black text-xl sm:text-2xl">
                {feedback.message}
              </h4>
            </div>

            <button
              onClick={handleNextQuestion}
              className={`px-6 py-3 rounded-2xl font-heading font-black text-sm sm:text-base shadow-xl active:scale-95 transition shrink-0 ${
                feedback.isCorrect 
                  ? 'bg-emerald-400 text-slate-950 hover:bg-emerald-300' 
                  : 'bg-rose-400 text-slate-950 hover:bg-rose-300'
              }`}
            >
              Lanjut Soal Berikutnya →
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 text-xs sm:text-sm leading-relaxed text-slate-200">
            <span className="font-bold text-amber-300">💡 Penjelasan Kaidah Grammar: </span>
            {feedback.explanation}
          </div>
        </div>
      )}

      {/* Floating Ghost Element for Touchscreen / IFP Drag Gesture */}
      {touchDragPos && touchDraggedWord && (
        <div 
          className="fixed pointer-events-none z-50 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-heading font-black text-xl shadow-2xl border-2 border-white -translate-x-1/2 -translate-y-1/2 opacity-95 scale-110 flex items-center gap-2"
          style={{ left: touchDragPos.x, top: touchDragPos.y }}
        >
          <GripVertical className="w-5 h-5 text-slate-950" />
          {touchDraggedWord}
        </div>
      )}
    </div>
  );
};
