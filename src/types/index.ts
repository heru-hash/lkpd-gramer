export type UserRole = 'admin' | 'guru' | 'siswa';

export interface UserProfile {
  uid: string;
  nama: string;
  email: string;
  role: UserRole;
  kelas?: string;
  jurusan?: string;
  nis?: string;
  nip?: string;
  mataPelajaran?: string;
  photoURL?: string;
  bio?: string;
  targetScore?: number;
  avatarId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type GrammarCategory = 
  | 'Simple Present'
  | 'Simple Past'
  | 'Present Continuous'
  | 'Future Tense'
  | 'Subject Verb Agreement'
  | 'To Be';

export type DifficultyLevel = 'Mudah' | 'Sedang' | 'Sulit';

export interface Question {
  id: string;
  category: GrammarCategory;
  level: number; // 1-6
  difficulty: DifficultyLevel;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  context?: string; // e.g. "Bengkel Otomotif", "Lab Komputer / RPL", "Kantor AKL"
  createdBy?: string;
}

export interface MaterialModule {
  id: string;
  title: GrammarCategory;
  tujuan: string;
  content: string;
  formula: {
    positive: string;
    negative: string;
    interrogative: string;
  };
  examples: {
    en: string;
    id: string;
    context: string;
  }[];
  video: string; // YouTube video ID or Embed URL
  quizLatihan: {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  }[];
}

export type PredicateGrade = 'A' | 'B' | 'C' | 'D';

export interface ScoreRecord {
  id: string;
  uid: string;
  studentName: string;
  kelas: string;
  jurusan: string;
  level: number;
  levelName: string;
  score: number;
  correct: number;
  wrong: number;
  streak: number;
  time: number; // seconds
  predicate: PredicateGrade;
  createdAt: string;
}

export type BadgeType = 
  | 'Beginner'
  | 'Explorer'
  | 'Grammar Hero'
  | 'Grammar Master'
  | 'Champion';

export interface LeaderboardEntry {
  uid: string;
  nama: string;
  kelas: string;
  jurusan: string;
  totalScore: number;
  gamesPlayed: number;
  badge: BadgeType;
  rank?: number;
  updatedAt?: string;
}

export interface ClassRoom {
  id: string;
  namaKelas: string;
  jurusan: string;
  guru: string;
  jumlahSiswa: number;
}

export type TeamColor = 'red' | 'blue' | 'green' | 'yellow';

export interface TeamBattleState {
  id: string;
  title: string;
  status: 'waiting' | 'active' | 'finished';
  currentQuestionIndex: number;
  timeRemaining: number;
  teams: {
    red: { name: string; score: number; color: string };
    blue: { name: string; score: number; color: string };
    green: { name: string; score: number; color: string };
    yellow: { name: string; score: number; color: string };
  };
}
