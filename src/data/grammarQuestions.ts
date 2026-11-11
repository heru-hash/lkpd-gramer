import { Question, GrammarCategory, DifficultyLevel } from '../types';

// Curated high-yield core questions for SMK Grade X (Kurikulum Merdeka)
// Incorporates vocational contexts: RPL/Software, TKJ/Network, Otomotif/Automotive, Akuntansi/Accounting, DPIB/Architecture, Hospitality
const BASE_QUESTIONS: Question[] = [
  // --- SIMPLE PRESENT ---
  {
    id: 'sp-001',
    category: 'Simple Present',
    level: 2,
    difficulty: 'Mudah',
    question: 'The automotive technician _____ the engine oil every morning.',
    options: ['checks', 'checking', 'check', 'checked'],
    answer: 'checks',
    explanation: 'Subjek tunggal "The automotive technician" (he/she) menggunakan kata kerja bentuk V1 + -s/-es dalam Simple Present.',
    context: 'Bengkel Otomotif'
  },
  {
    id: 'sp-002',
    category: 'Simple Present',
    level: 2,
    difficulty: 'Mudah',
    question: 'Software developers _____ code using modern programming languages.',
    options: ['write', 'writes', 'writing', 'wrote'],
    answer: 'write',
    explanation: 'Subjek jamak "Software developers" (they) menggunakan kata kerja dasar (bare infinitive / V1) tanpa tambahan -s/-es.',
    context: 'Lab RPL'
  },
  {
    id: 'sp-003',
    category: 'Simple Present',
    level: 4,
    difficulty: 'Mudah',
    question: 'Statement: "Does the network technician inspects the server daily?" is grammatically correct.',
    options: ['True', 'False'],
    answer: 'False',
    explanation: 'Setelah auxiliary verb "Does", kata kerja utama harus kembali ke bentuk dasar (infinitive): "inspect", bukan "inspects".',
    context: 'Teknik Komputer & Jaringan'
  },
  {
    id: 'sp-004',
    category: 'Simple Present',
    level: 1,
    difficulty: 'Sedang',
    question: 'The accountant _____ the financial balance sheet at the end of every month.',
    options: ['audits', 'auditing', 'audit', 'has audited'],
    answer: 'audits',
    explanation: '"The accountant" adalah orang ketiga tunggal, sehingga kata kerjanya ditambah "-s" (audits) untuk menyatakan rutinitas bulanan.',
    context: 'Akuntansi & Keuangan'
  },
  {
    id: 'sp-005',
    category: 'Simple Present',
    level: 3,
    difficulty: 'Sedang',
    question: 'Arrange the sentence: [safety goggles / always / wears / the welder / in the workshop]',
    options: ['The welder always wears safety goggles in the workshop', 'Always the welder wears safety goggles in the workshop', 'The welder wears always safety goggles in the workshop', 'In the workshop wears always the welder safety goggles'],
    answer: 'The welder always wears safety goggles in the workshop',
    explanation: 'Urutan adverb of frequency ("always") diletakkan sebelum main verb ("wears"): Subject + Adverb + Verb + Object.',
    context: 'Teknik Pengelasan'
  },
  {
    id: 'sp-006',
    category: 'Simple Present',
    level: 6,
    difficulty: 'Sulit',
    question: 'Neither the workshop supervisor nor the apprentices _____ that the lathe machine vibrates unusually.',
    options: ['realize', 'realizes', 'realizing', 'has realized'],
    answer: 'realize',
    explanation: 'Dalam aturan "Neither ... nor", kata kerja disesuaikan dengan subjek yang paling dekat, yaitu "the apprentices" (jamak), maka gunakan "realize".',
    context: 'Teknik Pemesinan'
  },

  // --- SIMPLE PAST ---
  {
    id: 'past-001',
    category: 'Simple Past',
    level: 2,
    difficulty: 'Mudah',
    question: 'Yesterday, our vocational team _____ first prize in the national robotic competition.',
    options: ['won', 'win', 'wins', 'winning'],
    answer: 'won',
    explanation: 'Keterangan waktu lampau "Yesterday" menandakan peristiwa lampau (Simple Past), kata kerja bentuk kedua dari win adalah "won".',
    context: 'Kompetisi Robotika SMK'
  },
  {
    id: 'past-002',
    category: 'Simple Past',
    level: 4,
    difficulty: 'Mudah',
    question: 'Statement: "The electrician did not replaced the blown fuse last night."',
    options: ['True', 'False'],
    answer: 'False',
    explanation: 'Kalimat negatif Simple Past menggunakan "did not" + V1 (infinitive). Seharusnya "did not replace", bukan "replaced".',
    context: 'Teknik Instalasi Tenaga Listrik'
  },
  {
    id: 'past-003',
    category: 'Simple Past',
    level: 1,
    difficulty: 'Sedang',
    question: 'Last Monday, the drafting student _____ the 3D building blueprint using CAD software.',
    options: ['designed', 'designs', 'designing', 'has design'],
    answer: 'designed',
    explanation: '"Last Monday" menunjukkan kegiatan selesai di masa lalu (Simple Past). Bentuk past regular dari design adalah "designed".',
    context: 'Desain Pemodelan & Informasi Bangunan'
  },
  {
    id: 'past-004',
    category: 'Simple Past',
    level: 3,
    difficulty: 'Sedang',
    question: 'Arrange the sentence: [the database server / successfully / restored / we / yesterday]',
    options: ['We successfully restored the database server yesterday', 'Yesterday restored successfully we the database server', 'We the database server successfully restored yesterday', 'Successfully restored we yesterday the database server'],
    answer: 'We successfully restored the database server yesterday',
    explanation: 'Susunan kalimat Simple Past: Subject (We) + Adverb (successfully) + Verb 2 (restored) + Object (the database server) + Adverb of time (yesterday).',
    context: 'Rekayasa Perangkat Lunak'
  },
  {
    id: 'past-005',
    category: 'Simple Past',
    level: 5,
    difficulty: 'Sulit',
    question: 'When the spark plug failed, the mechanic immediately _____ the ignition system.',
    options: ['examined', 'examines', 'had examined', 'examining'],
    answer: 'examined',
    explanation: 'Klausa "When the spark plug failed" (past) diikuti oleh aksi berurutan di masa lalu dalam bentuk Simple Past (examined).',
    context: 'Teknik Kendaraan Ringan'
  },

  // --- PRESENT CONTINUOUS ---
  {
    id: 'pc-001',
    category: 'Present Continuous',
    level: 2,
    difficulty: 'Mudah',
    question: 'Look! The students _____ a mobile application in the computer laboratory right now.',
    options: ['are developing', 'is developing', 'develop', 'developed'],
    answer: 'are developing',
    explanation: '"Look!" dan "right now" mengindikasikan aktivitas yang sedang berlangsung. Subjek jamak "The students" menggunakan to be "are" + V-ing.',
    context: 'Lab RPL'
  },
  {
    id: 'pc-002',
    category: 'Present Continuous',
    level: 4,
    difficulty: 'Mudah',
    question: 'Statement: "The technician is repairing the CNC milling machine at the moment."',
    options: ['True', 'False'],
    answer: 'True',
    explanation: 'Pernyataan benar: Subjek tunggal (The technician) + is + V-ing (repairing) + time signal (at the moment).',
    context: 'Bengkel CNC'
  },
  {
    id: 'pc-003',
    category: 'Present Continuous',
    level: 1,
    difficulty: 'Sedang',
    question: 'Be quiet please! The chef _____ a new dessert recipe in the culinary kitchen.',
    options: ['is preparing', 'are preparing', 'prepares', 'prepared'],
    answer: 'is preparing',
    explanation: '"Be quiet please!" adalah penanda situasi saat ini (present continuous). "The chef" adalah tunggal, jadi "is preparing".',
    context: 'Kuliner / Tata Boga'
  },
  {
    id: 'pc-004',
    category: 'Present Continuous',
    level: 3,
    difficulty: 'Sedang',
    question: 'Arrange the sentence: [configuring / the network switch / is / right now / the technician]',
    options: ['The technician is configuring the network switch right now', 'Right now is configuring the technician the network switch', 'The technician configuring is the network switch right now', 'Is the technician configuring right now the network switch'],
    answer: 'The technician is configuring the network switch right now',
    explanation: 'Formula Present Continuous: Subject (The technician) + is + V-ing (configuring) + Object (the network switch) + Time (right now).',
    context: 'Teknik Jaringan'
  },

  // --- FUTURE TENSE ---
  {
    id: 'ft-001',
    category: 'Future Tense',
    level: 2,
    difficulty: 'Mudah',
    question: 'Our class _____ the industrial factory visit next Thursday.',
    options: ['will attend', 'attended', 'attends', 'have attended'],
    answer: 'will attend',
    explanation: '"Next Thursday" adalah penanda waktu yang akan datang (Future Tense). Gunakan modal auxiliary "will" + V1.',
    context: 'Kunjungan Industri'
  },
  {
    id: 'ft-002',
    category: 'Future Tense',
    level: 4,
    difficulty: 'Mudah',
    question: 'Statement: "They are going to launch the new school website next week."',
    options: ['True', 'False'],
    answer: 'True',
    explanation: '"Be going to" digunakan untuk rencana masa depan yang telah direncanakan sebelumnya (prior plan).',
    context: 'Proyek Sekolah'
  },
  {
    id: 'ft-003',
    category: 'Future Tense',
    level: 1,
    difficulty: 'Sedang',
    question: 'If the client approves the mockup, we _____ developing the frontend user interface tomorrow.',
    options: ['will start', 'started', 'starts', 'would started'],
    answer: 'will start',
    explanation: 'Dalam First Conditional (kebutuhan masa depan realistis): "If + Simple Present, Subject + will + V1".',
    context: 'Software House'
  },
  {
    id: 'ft-004',
    category: 'Future Tense',
    level: 6,
    difficulty: 'Sulit',
    question: 'By the time the semester ends, the vocational interns _____ their apprenticeship program.',
    options: ['will have completed', 'will complete', 'are completing', 'completed'],
    answer: 'will have completed',
    explanation: '"By the time + present clause" menunjukkan peristiwa yang akan sudah selesai di masa depan (Future Perfect: will have + V3).',
    context: 'Praktik Kerja Lapangan (PKL)'
  },

  // --- SUBJECT VERB AGREEMENT ---
  {
    id: 'sva-001',
    category: 'Subject Verb Agreement',
    level: 2,
    difficulty: 'Mudah',
    question: 'Each of the computer components _____ tested before installation.',
    options: ['is', 'are', 'were', 'being'],
    answer: 'is',
    explanation: 'Frasa yang diawali "Each of..." dianggap singular (tunggal), sehingga kata kerjanya adalah "is".',
    context: 'Lab Hardware'
  },
  {
    id: 'sva-002',
    category: 'Subject Verb Agreement',
    level: 4,
    difficulty: 'Sedang',
    question: 'Statement: "The list of vocational workshop safety regulations hang on the front wall."',
    options: ['True', 'False'],
    answer: 'False',
    explanation: 'Subjek intinya adalah "The list" (tunggal), bukan "regulations". Seharusnya kata kerjanya adalah "hangs".',
    context: 'K3 / Keselamatan Kerja'
  },
  {
    id: 'sva-003',
    category: 'Subject Verb Agreement',
    level: 3,
    difficulty: 'Sedang',
    question: 'Arrange the sentence: [require / both the engine / and the transmission / maintenance]',
    options: ['Both the engine and the transmission require maintenance', 'Require both the engine and the transmission maintenance', 'The engine and both the transmission require maintenance', 'Both require the engine and the transmission maintenance'],
    answer: 'Both the engine and the transmission require maintenance',
    explanation: '"Both ... and ..." menggabungkan dua subjek sehingga bernilai jamak, kata kerjanya menggunakan bentuk plural "require".',
    context: 'Teknik Otomotif'
  },
  {
    id: 'sva-004',
    category: 'Subject Verb Agreement',
    level: 6,
    difficulty: 'Sulit',
    question: 'The quality of the mechanical tools produced by the vocational students _____ international standards.',
    options: ['meets', 'meet', 'meeting', 'are meeting'],
    answer: 'meets',
    explanation: 'Subjek kalimat adalah "The quality" (uncountable / singular), bukan "mechanical tools" atau "students", maka verb-nya "meets".',
    context: 'Standarisasi Industri'
  },

  // --- TO BE ---
  {
    id: 'tb-001',
    category: 'To Be',
    level: 2,
    difficulty: 'Mudah',
    question: 'Mr. Hendra _____ a certified cybersecurity instructor at our vocational high school.',
    options: ['is', 'are', 'am', 'be'],
    answer: 'is',
    explanation: 'Untuk orang ketiga tunggal ("Mr. Hendra" = he), to be bentuk present adalah "is".',
    context: 'Profil Guru SMK'
  },
  {
    id: 'tb-002',
    category: 'To Be',
    level: 1,
    difficulty: 'Mudah',
    question: 'These pneumatic cylinders _____ ready for the automation assembly line.',
    options: ['are', 'is', 'was', 'am'],
    answer: 'are',
    explanation: '"These pneumatic cylinders" adalah kata benda jamak (plural noun), sehingga to be yang tepat adalah "are".',
    context: 'Teknik Mekatronika'
  },
  {
    id: 'tb-003',
    category: 'To Be',
    level: 4,
    difficulty: 'Sedang',
    question: 'Statement: "The vocational students was very enthusiastic during the robotic workshop."',
    options: ['True', 'False'],
    answer: 'False',
    explanation: '"The vocational students" adalah jamak (plural). Seharusnya menggunakan past to be "were", bukan "was".',
    context: 'Kegiatan Ekstrakurikuler'
  },
  {
    id: 'tb-004',
    category: 'To Be',
    level: 3,
    difficulty: 'Mudah',
    question: 'Arrange the sentence: [a talented / graphics designer / she / is / at the studio]',
    options: ['She is a talented graphics designer at the studio', 'She a talented graphics designer is at the studio', 'Is she a talented graphics designer at the studio', 'At the studio she is talented a graphics designer'],
    answer: 'She is a talented graphics designer at the studio',
    explanation: 'Urutan baku: Subject (She) + To Be (is) + Complement (a talented graphics designer) + Place (at the studio).',
    context: 'Desain Komunikasi Visual (DKV)'
  }
];

// Algorithmic expansion to guarantee 300+ diverse, high quality questions
// Across all 6 categories, 3 difficulties, and all 6 levels
const SUBJECTS_SINGULAR = [
  { subj: 'The mechanical engineer', pron: 'he', field: 'Teknik Mesin' },
  { subj: 'The network administrator', pron: 'she', field: 'TKJ' },
  { subj: 'The software programmer', pron: 'he', field: 'RPL' },
  { subj: 'The professional accountant', pron: 'she', field: 'AKL' },
  { subj: 'The architectural drafter', pron: 'he', field: 'DPIB' },
  { subj: 'The culinary pastry chef', pron: 'she', field: 'Tata Boga' },
  { subj: 'The automotive mechanic', pron: 'he', field: 'Otomotif' },
  { subj: 'The graphic designer', pron: 'she', field: 'DKV' },
  { subj: 'The electronic technician', pron: 'he', field: 'Teknik Elektronika' },
  { subj: 'The workshop safety officer', pron: 'he', field: 'K3 Industri' },
];

const SUBJECTS_PLURAL = [
  { subj: 'The vocational students', field: 'SMK Kelas X' },
  { subj: 'The web developers', field: 'RPL' },
  { subj: 'The electrical apprentices', field: 'Listrik' },
  { subj: 'The laboratory assistants', field: 'Laboratorium' },
  { subj: 'The welding trainees', field: 'Pengelasan' },
  { subj: 'The financial auditors', field: 'Akuntansi' },
  { subj: 'The robotic club members', field: 'Robotika' },
  { subj: 'The CAD draftsmen', field: 'DPIB' },
  { subj: 'The automotive specialists', field: 'Bengkel SMK' },
  { subj: 'The network engineers', field: 'TKJ' },
];

const VERB_PAIRS = [
  { v1: 'inspect', v_s: 'inspects', v2: 'inspected', v_ing: 'inspecting', obj: 'the machine safety sensors', ind: 'memeriksa sensor keamanan mesin' },
  { v1: 'compile', v_s: 'compiles', v2: 'compiled', v_ing: 'compiling', obj: 'the source code without any errors', ind: 'mengompilasi kode program tanpa error' },
  { v1: 'calibrate', v_s: 'calibrates', v2: 'calibrated', v_ing: 'calibrating', obj: 'the digital precision multimeter', ind: 'mengalibrasi multimeter digital' },
  { v1: 'assemble', v_s: 'assembles', v2: 'assembled', v_ing: 'assembling', obj: 'the newly designed transmission gear', ind: 'merakit roda gigi transmisi baru' },
  { v1: 'calculate', v_s: 'calculates', v2: 'calculated', v_ing: 'calculating', obj: 'the annual production tax report', ind: 'menghitung laporan pajak produksi tahunan' },
  { v1: 'install', v_s: 'installs', v2: 'installed', v_ing: 'installing', obj: 'the fiber optic network cables', ind: 'memasang kabel jaringan fiber optik' },
  { v1: 'render', v_s: 'renders', v2: 'rendered', v_ing: 'rendering', obj: 'the high-resolution 3D building model', ind: 'merender model bangunan 3D resolusi tinggi' },
  { v1: 'diagnose', v_s: 'diagnoses', v2: 'diagnosed', v_ing: 'diagnosing', obj: 'the car cooling system breakdown', ind: 'mendiagnosis kerusakan sistem pendingin mobil' },
  { v1: 'prepare', v_s: 'prepares', v2: 'prepared', v_ing: 'preparing', obj: 'the sterile kitchen utensils for baking', ind: 'menyiapkan peralatan dapur steril untuk memanggang' },
  { v1: 'clean', v_s: 'cleans', v2: 'cleaned', v_ing: 'cleaning', obj: 'the CNC cutting tools after workshop hours', ind: 'membersihkan alat potong CNC setelah jam bengkel' },
];

export function generateFullQuestionBank(): Question[] {
  const bank: Question[] = [...BASE_QUESTIONS];
  let idCounter = 100;

  // 1. Generate Simple Present Questions
  SUBJECTS_SINGULAR.forEach((s) => {
    VERB_PAIRS.forEach((v) => {
      idCounter++;
      const isHard = idCounter % 3 === 0;
      const difficulty: DifficultyLevel = isHard ? 'Sulit' : (idCounter % 2 === 0 ? 'Sedang' : 'Mudah');
      const level = (idCounter % 6) + 1;

      bank.push({
        id: `sp-gen-${idCounter}`,
        category: 'Simple Present',
        level,
        difficulty,
        question: `${s.subj} _____ ${v.obj} on a regular basis.`,
        options: [v.v_s, v.v1, v.v_ing, v.v2],
        answer: v.v_s,
        explanation: `Subjek tunggal "${s.subj}" (he/she) memerlukan kata kerja berakhiran -s/-es ("${v.v_s}") untuk menyatakan kebiasaan kerja (${v.ind}).`,
        context: s.field
      });
    });
  });

  // 2. Generate Simple Past Questions
  SUBJECTS_PLURAL.forEach((p) => {
    VERB_PAIRS.forEach((v) => {
      idCounter++;
      const difficulty: DifficultyLevel = idCounter % 3 === 0 ? 'Sulit' : (idCounter % 2 === 0 ? 'Sedang' : 'Mudah');
      const level = (idCounter % 6) + 1;

      bank.push({
        id: `past-gen-${idCounter}`,
        category: 'Simple Past',
        level,
        difficulty,
        question: `Yesterday afternoon, ${p.subj.toLowerCase()} _____ ${v.obj}.`,
        options: [v.v2, v.v1, v.v_s, v.v_ing],
        answer: v.v2,
        explanation: `Penanda waktu lampau "Yesterday afternoon" mewajibkan penggunaan Verb-2 ("${v.v2}") dalam Simple Past Tense.`,
        context: p.field
      });
    });
  });

  // 3. Generate Present Continuous Questions
  SUBJECTS_SINGULAR.forEach((s) => {
    VERB_PAIRS.slice(0, 5).forEach((v) => {
      idCounter++;
      const difficulty: DifficultyLevel = idCounter % 3 === 0 ? 'Sulit' : 'Sedang';
      const level = (idCounter % 6) + 1;

      bank.push({
        id: `pc-gen-${idCounter}`,
        category: 'Present Continuous',
        level,
        difficulty,
        question: `Pay attention! ${s.subj} _____ ${v.obj} right now.`,
        options: [`is ${v.v_ing}`, `are ${v.v_ing}`, v.v_s, `was ${v.v_ing}`],
        answer: `is ${v.v_ing}`,
        explanation: `"Pay attention!" dan "right now" menunjukkan aksi sedang berlangsung. Subjek tunggal menggunakan "is" + V-ing ("is ${v.v_ing}").`,
        context: s.field
      });
    });
  });

  // 4. Generate Future Tense Questions
  SUBJECTS_PLURAL.forEach((p) => {
    VERB_PAIRS.slice(0, 5).forEach((v) => {
      idCounter++;
      const difficulty: DifficultyLevel = idCounter % 2 === 0 ? 'Sedang' : 'Mudah';
      const level = (idCounter % 6) + 1;

      bank.push({
        id: `ft-gen-${idCounter}`,
        category: 'Future Tense',
        level,
        difficulty,
        question: `According to the schedule, ${p.subj.toLowerCase()} _____ ${v.obj} tomorrow morning.`,
        options: [`will ${v.v1}`, `would ${v.v1}`, v.v2, `are ${v.v_ing}`],
        answer: `will ${v.v1}`,
        explanation: `"Tomorrow morning" mengindikasikan kegiatan di masa mendatang (Simple Future), menggunakan pola "will + V1" ("will ${v.v1}").`,
        context: p.field
      });
    });
  });

  // 5. Generate Subject Verb Agreement Questions
  SUBJECTS_SINGULAR.slice(0, 8).forEach((s) => {
    VERB_PAIRS.slice(0, 4).forEach((v) => {
      idCounter++;
      const difficulty: DifficultyLevel = 'Sulit';
      const level = (idCounter % 6) + 1;

      bank.push({
        id: `sva-gen-${idCounter}`,
        category: 'Subject Verb Agreement',
        level,
        difficulty,
        question: `Each of the instructions given to ${s.subj.toLowerCase()} _____ very clear and comprehensive.`,
        options: ['is', 'are', 'were', 'have been'],
        answer: 'is',
        explanation: 'Subjek kalimat diawali dengan "Each of...", sehingga secara gramatikal selalu dianggap tunggal (singular verb "is").',
        context: s.field
      });
    });
  });

  // 6. Generate To Be Questions
  const TO_BE_ADJECTIVES = [
    { adj: 'competent in industrial robotics', field: 'Mekatronika' },
    { adj: 'diligent during laboratory practice', field: 'Praktik Bengkel' },
    { adj: 'ready for the national certification exam', field: 'Sertifikasi BNSP' },
    { adj: 'skilled at cybersecurity protection', field: 'TKJ' },
    { adj: 'punctual in attending company briefings', field: 'Budaya Kerja Industri' },
  ];

  SUBJECTS_SINGULAR.slice(0, 6).forEach((s) => {
    TO_BE_ADJECTIVES.forEach((a) => {
      idCounter++;
      const difficulty: DifficultyLevel = 'Mudah';
      const level = (idCounter % 6) + 1;

      bank.push({
        id: `tb-gen-${idCounter}`,
        category: 'To Be',
        level,
        difficulty,
        question: `${s.subj} _____ ${a.adj}.`,
        options: ['is', 'are', 'am', 'were'],
        answer: 'is',
        explanation: `Subjek orang ketiga tunggal ("${s.subj}") menggunakan to be "is" dalam kalimat nominal present tense.`,
        context: a.field
      });
    });
  });

  return bank;
}

// Pre-generated static bank (300+ items ready for immediate offline/online gameplay)
export const GRAMMAR_QUESTION_BANK: Question[] = generateFullQuestionBank();

// Helper to get randomized questions filtered by criteria
export function getRandomQuestions(options?: {
  category?: GrammarCategory;
  level?: number;
  difficulty?: DifficultyLevel;
  count?: number;
}): Question[] {
  let pool = [...GRAMMAR_QUESTION_BANK];

  if (options?.category) {
    pool = pool.filter(q => q.category === options.category);
  }
  if (options?.level) {
    pool = pool.filter(q => q.level === options.level);
  }
  if (options?.difficulty) {
    pool = pool.filter(q => q.difficulty === options.difficulty);
  }

  // Fisher-Yates Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, options?.count || 10);
}
