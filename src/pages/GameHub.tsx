import React, { useState } from 'react';
import { 
  Gamepad2, 
  Sparkles, 
  Play, 
  Flame, 
  ShieldCheck, 
  Zap, 
  Layers, 
  CheckCircle2, 
  Timer, 
  Swords, 
  Filter
} from 'lucide-react';
import { GrammarCategory, DifficultyLevel } from '../types';
import { useIFP } from '../context/IFPContext';
import { GameEngine } from './games/GameEngine';

interface GameHubProps {
  initialLevel?: number;
  initialCategory?: GrammarCategory;
}

export const GameHub: React.FC<GameHubProps> = ({ initialLevel, initialCategory }) => {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(initialLevel || null);
  const [category, setCategory] = useState<GrammarCategory | 'Semua'>(initialCategory || 'Semua');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Sedang');

  const { triggerHaptic, presentationMode } = useIFP();

  const CATEGORIES: (GrammarCategory | 'Semua')[] = [
    'Semua',
    'Simple Present',
    'Simple Past',
    'Present Continuous',
    'Future Tense',
    'Subject Verb Agreement',
    'To Be',
  ];

  const LEVELS = [
    {
      level: 1,
      title: 'Level 1: Drag and Drop',
      subtitle: 'Slotting Kata Kosong',
      desc: 'Sentuh dan pasang kata kerja atau to be yang tepat ke dalam ruang kalimat rumpang.',
      badge: 'Sensori Sentuh',
      color: 'from-blue-600 via-indigo-600 to-sky-700',
      icon: Layers,
    },
    {
      level: 2,
      title: 'Level 2: Multiple Choice',
      subtitle: 'Blitz 4 Kartu Warna',
      desc: 'Tantangan pilihan ganda gaya Kahoot/Quizizz dengan timer respons cepat.',
      badge: 'Klasik Interaktif',
      color: 'from-purple-600 via-pink-600 to-rose-700',
      icon: Gamepad2,
    },
    {
      level: 3,
      title: 'Level 3: Sentence Builder',
      subtitle: 'Konstruksi Kalimat',
      desc: 'Sentuh balok-balok kata acak untuk menyusun struktur kalimat standar yang gramatikal.',
      badge: 'Sintaksis',
      color: 'from-amber-500 via-orange-600 to-red-600',
      icon: Zap,
    },
    {
      level: 4,
      title: 'Level 4: True or False',
      subtitle: 'Verifikasi Kaidah',
      desc: 'Putuskan dengan cepat apakah kalimat atau aturan grammar benar atau salah.',
      badge: 'Kecepatan Analisis',
      color: 'from-emerald-600 via-teal-600 to-cyan-700',
      icon: CheckCircle2,
    },
    {
      level: 5,
      title: 'Level 5: Grammar Race',
      subtitle: 'Time Attack & Combo',
      desc: 'Balapan melawan waktu dengan pengganda kombo poin pada streak berturut-turut.',
      badge: 'Adrenalin Tinggi',
      color: 'from-rose-600 via-red-600 to-orange-700',
      icon: Timer,
    },
    {
      level: 6,
      title: 'Level 6: Boss Battle',
      subtitle: 'The Grammar Overlord',
      desc: 'Kalahkan monster penguasa grammar dengan serangan kombo jawaban benar beruntun!',
      badge: 'Tantangan Pamungkas',
      color: 'from-violet-700 via-purple-900 to-slate-950',
      icon: Swords,
    },
  ];

  if (selectedLevel !== null) {
    return (
      <GameEngine
        level={selectedLevel}
        category={category === 'Semua' ? undefined : category}
        difficulty={difficulty}
        onBack={() => setSelectedLevel(null)}
      />
    );
  }

  return (
    <div className={`space-y-6 ${presentationMode ? 'scale-[1.01] origin-top' : ''}`}>
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold mb-2 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Arena Gamifikasi Pembelajaran SMK
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            Pilih Level Game Grammar
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Enam level permainan berjenjang yang melatih pemahaman grammar secara interaktif pada layar sentuh.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Difficulty selector */}
          <div className="flex items-center bg-slate-800 p-1 rounded-2xl border border-slate-700">
            {(['Mudah', 'Sedang', 'Sulit'] as DifficultyLevel[]).map(d => (
              <button
                key={d}
                onClick={() => { triggerHaptic(); setDifficulty(d); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 touch-manipulation ${
                  difficulty === d 
                    ? d === 'Mudah' ? 'bg-emerald-600 text-white' : d === 'Sedang' ? 'bg-amber-500 text-slate-950 font-black' : 'bg-rose-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-2 shrink-0">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>Topik:</span>
        </div>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => { triggerHaptic(); setCategory(cat); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border active:scale-95 touch-manipulation ${
              category === cat
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 6 Level Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {LEVELS.map(lvl => {
          const Icon = lvl.icon;
          return (
            <div
              key={lvl.level}
              className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 shadow-xl transition-all flex flex-col justify-between"
            >
              {/* Card Banner Background */}
              <div className={`p-6 bg-gradient-to-br ${lvl.color} text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase rounded-full bg-black/25 backdrop-blur-md text-white border border-white/20">
                    {lvl.badge}
                  </span>
                </div>

                <h3 className="font-heading font-black text-xl sm:text-2xl tracking-tight leading-tight">
                  {lvl.title}
                </h3>
                <p className="text-white/80 text-xs font-semibold mt-1">
                  {lvl.subtitle}
                </p>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {lvl.desc}
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800 pt-3">
                    <span>Aturan Skor:</span>
                    <span className="font-bold text-amber-400">+10 Benar / -2 Salah</span>
                  </div>

                  <button
                    onClick={() => {
                      triggerHaptic();
                      setSelectedLevel(lvl.level);
                    }}
                    className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 text-white font-heading font-black text-sm shadow-lg shadow-indigo-600/30 active:scale-95 transition flex items-center justify-center gap-2 touch-manipulation"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Mulai Mainkan Level {lvl.level}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
