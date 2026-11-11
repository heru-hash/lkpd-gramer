import { MaterialModule } from '../types';

export const GRAMMAR_MATERIALS: MaterialModule[] = [
  {
    id: 'simple-present',
    title: 'Simple Present',
    tujuan: 'Siswa SMK Fase E mampu menganalisis fungsi sosial, struktur teks, dan unsur kebahasaan Simple Present Tense untuk menyatakan kebenaran umum (general truths), fakta teknis, serta rutinitas pekerjaan di dunia industri dan lingkungan kerja kejuruan.',
    content: `Simple Present Tense digunakan untuk mendeskripsikan:
1. **Facts & General Truths**: Fakta ilmiah atau teknis (contoh: *Water boils at 100°C*, *An internal combustion engine requires oxygen*).
2. **Habits & Workplace Routines**: Kebiasaan atau jadwal harian di bengkel/kantor (contoh: *The technician inspects the circuit breaker every morning*).
3. **Scheduled Events**: Jadwal resmi moda transportasi, shift kerja, atau agenda sekolah.

**Ciri Khas Kebahasaan:**
- Menggunakan Verb-1 (Bare Infinitive).
- Jika subjek berupa orang ketiga tunggal (*He, She, It, The Technician*), tambahkan akhiran **-s / -es** pada kata kerja.
- Sering menggunakan **Adverbs of Frequency**: *always, usually, often, sometimes, rarely, never, every day*.`,
    formula: {
      positive: 'S + V1 (-s/-es) + Object/Complement',
      negative: 'S + do/does not + V1 (infinitive) + Object',
      interrogative: 'Do/Does + S + V1 (infinitive) + Object?'
    },
    examples: [
      {
        en: 'The software programmer always tests the application before deploying to production.',
        id: 'Programmer perangkat lunak selalu menguji aplikasi sebelum meluncurkannya ke lingkungan produksi.',
        context: 'Rekayasa Perangkat Lunak'
      },
      {
        en: 'We do not operate heavy machinery without wearing personal protective equipment (PPE).',
        id: 'Kami tidak mengoperasikan mesin berat tanpa mengenakan alat pelindung diri (APD).',
        context: 'K3 & Keselamatan Kerja Bengkel'
      },
      {
        en: 'Does the accountant balance the journal entries at the end of the shift?',
        id: 'Apakah staf akuntansi menyeimbangkan jurnal pembukuan pada akhir shift?',
        context: 'Akuntansi & Keuangan Lembaga'
      }
    ],
    video: 'https://www.youtube.com/embed/L9AWRTcMQLs', // Educational grammar embed
    quizLatihan: [
      {
        question: 'My supervisor _____ the workshop inventory every Friday morning.',
        options: ['updates', 'update', 'updating', 'is update'],
        answer: 'updates',
        explanation: '"My supervisor" adalah orang ketiga tunggal (he/she), sehingga kata kerja bentuk pertama ditambah akhiran "-s".'
      },
      {
        question: 'Vocational students _____ not enter the server room without authorization.',
        options: ['do', 'does', 'are', 'is'],
        answer: 'do',
        explanation: 'Subjek jamak "Vocational students" (they) menggunakan auxiliary verb "do" dalam bentuk kalimat negatif.'
      }
    ]
  },
  {
    id: 'simple-past',
    title: 'Simple Past',
    tujuan: 'Siswa SMK Fase E mampu menyusun dan memahami teks recount, logbook harian, dan laporan kegiatan magang/PKL (incident report, maintenance logs) dengan struktur Simple Past Tense yang tepat.',
    content: `Simple Past Tense digunakan untuk menyatakan peristiwa atau kegiatan yang:
1. **Selesai di Masa Lalu**: Terjadi pada waktu tertentu di masa lampau dan telah berakhir (completed actions).
2. **Maintenance Logs & Recount**: Catatan perbaikan mesin, riwayat coding bug, atau laporan praktikum kejuruan.

**Bentuk Kata Kerja (V2):**
- **Regular Verbs**: V1 + -ed / -d (contoh: *install -> installed*, *repair -> repaired*, *check -> checked*).
- **Irregular Verbs**: Berubah bentuk unik (contoh: *write -> wrote*, *make -> made*, *buy -> bought*, *find -> found*).

**Keterangan Waktu Khas (Adverbs of Time):**
*yesterday, last night, two days ago, in 2023, during the industrial visit*.`,
    formula: {
      positive: 'S + V2 (Past Form) + Object/Complement',
      negative: 'S + did not + V1 (infinitive) + Object',
      interrogative: 'Did + S + V1 (infinitive) + Object?'
    },
    examples: [
      {
        en: 'The mechanic replaced the damaged timing belt two hours ago.',
        id: 'Montir tersebut mengganti sabuk timing yang rusak dua jam yang lalu.',
        context: 'Teknik Kendaraan Ringan'
      },
      {
        en: 'The cybersecurity team did not detect any unauthorized network breach yesterday.',
        id: 'Tim keamanan siber tidak mendeteksi adanya pelanggaran jaringan tanpa izin kemarin.',
        context: 'Teknik Komputer & Jaringan'
      },
      {
        en: 'Did you submit the architectural floor plan to the chief engineer last Monday?',
        id: 'Apakah kamu sudah menyerahkan denah arsitektur ke kepala insinyur Senin lalu?',
        context: 'Desain Pemodelan Bangunan'
      }
    ],
    video: 'https://www.youtube.com/embed/0b4rsUt5Aoc',
    quizLatihan: [
      {
        question: 'Last week, our robotic team _____ the automated conveyor prototype.',
        options: ['assembled', 'assemble', 'assembles', 'assembling'],
        answer: 'assembled',
        explanation: 'Keterangan waktu "Last week" mengindikasikan kegiatan masa lampau (Simple Past), gunakan V2 "assembled".'
      },
      {
        question: 'Did the electrician _____ the faulty capacitor in the circuit?',
        options: ['fix', 'fixed', 'fixes', 'fixing'],
        answer: 'fix',
        explanation: 'Dalam kalimat tanya dengan auxiliary "Did", kata kerja utama harus kembali ke V1 (infinitive) "fix".'
      }
    ]
  },
  {
    id: 'present-continuous',
    title: 'Present Continuous',
    tujuan: 'Siswa SMK Fase E mampu mengidentifikasi dan mendeskripsikan aktivitas proses produksi, perakitan perangkat, atau demonstrasi kejuruan yang sedang berlangsung saat pembicaraan terjadi.',
    content: `Present Continuous Tense digunakan untuk:
1. **Actions Happening Right Now**: Aktivitas yang sedang terjadi di depan mata saat ini.
2. **Temporary Situations**: Keadaan sementara selama periode waktu tertentu (contoh: *I am doing my industrial internship at PT Dirgantara this month*).
3. **Trends & Changing States**: Perkembangan teknologi atau tren industri (*Renewable energy is growing rapidly*).

**Formula Kunci:**
Auxiliary Be (am / is / are) + Present Participle (V-ing).`,
    formula: {
      positive: 'S + am/is/are + V-ing + Object',
      negative: 'S + am/is/are + not + V-ing + Object',
      interrogative: 'Am/Is/Are + S + V-ing + Object?'
    },
    examples: [
      {
        en: 'The apprentices are currently welding the steel support frame in the fabrication shop.',
        id: 'Para siswa magang sedang mengelas rangka penopang baja di bengkel fabrikasi saat ini.',
        context: 'Teknik Pengelasan'
      },
      {
        en: 'The web developer is not debugging the server right now; she is attending a client briefing.',
        id: 'Pengembang web tidak sedang mendebug server saat ini; ia sedang menghadiri briefing klien.',
        context: 'Rekayasa Perangkat Lunak'
      },
      {
        en: 'Are the culinary students preparing the traditional banquet dishes for the guests?',
        id: 'Apakah siswa tata boga sedang menyiapkan hidangan jamuan tradisional untuk para tamu?',
        context: 'Kuliner & Perhotelan'
      }
    ],
    video: 'https://www.youtube.com/embed/UdEZsVb_eNk',
    quizLatihan: [
      {
        question: 'Listen! The alarm _____ because of high pressure in the hydraulic system.',
        options: ['is sounding', 'are sounding', 'sounds', 'sounded'],
        answer: 'is sounding',
        explanation: '"Listen!" adalah tanda aksi sedang berlangsung. Subjek tunggal "The alarm" menggunakan "is sounding".'
      }
    ]
  },
  {
    id: 'future-tense',
    title: 'Future Tense',
    tujuan: 'Siswa SMK Fase E mampu menyusun rencana proyek kejuruan, karir masa depan di industri, serta memprediksi tren kompetensi vokasi menggunakan Future Tense (Will & Be Going To).',
    content: `Future Tense digunakan untuk merencanakan dan memproyeksikan kejadian mendatang:
1. **Will**: Keputusan spontan (*instant decisions*), janji (*promises*), dan prediksi (*predictions*).
2. **Be Going To**: Rencana yang sudah disiapkan sebelumnya (*prior plans & intentions*) atau bukti nyata di depan mata (*evidence-based predictions*).
3. **Workplace Application**: Presentasi proposal bisnis (*business pitch*), jadwal perbaikan berkala, dan target produksi industri.`,
    formula: {
      positive: 'S + will + V1 (infinitive) ATAU S + be (am/is/are) going to + V1',
      negative: 'S + will not (won\'t) + V1 ATAU S + be + not going to + V1',
      interrogative: 'Will + S + V1? ATAU Be + S + going to + V1?'
    },
    examples: [
      {
        en: 'Our company will deliver the manufactured gear components by next Wednesday.',
        id: 'Perusahaan kami akan mengirimkan komponen roda gigi hasil produksi paling lambat Rabu depan.',
        context: 'Manufaktur & Logistik'
      },
      {
        en: 'I am going to take the national competency certification exam next month.',
        id: 'Saya akan mengikuti ujian sertifikasi kompetensi nasional bulan depan.',
        context: 'Sertifikasi Kejuruan SMK'
      }
    ],
    video: 'https://www.youtube.com/embed/c4H-sA-2L4s',
    quizLatihan: [
      {
        question: 'The vocational principal announced that our school _____ build a smart laboratory next semester.',
        options: ['will', 'did', 'is', 'has'],
        answer: 'will',
        explanation: '"Next semester" menandakan masa depan, setelah modal auxiliary "will" diikuti kata kerja dasar "build".'
      }
    ]
  },
  {
    id: 'subject-verb-agreement',
    title: 'Subject Verb Agreement',
    tujuan: 'Siswa SMK Fase E mampu menelaah dan menerapkan keselarasan antara subjek tunggal/jamak dengan kata kerja dalam penulisan manual instruksi teknis, SOP, dan laporan formal.',
    content: `Subject-Verb Agreement adalah prinsip dasar tata bahasa di mana bentuk kata kerja harus selalu selaras (agree) dengan jumlah dan jenis subjeknya.

**Aturan Emas:**
1. **Singular Subject -> Singular Verb**: *The engine runs smoothly.*
2. **Plural Subject -> Plural Verb**: *The engines run smoothly.*
3. **Compound Subjects with "And"**: Menggunakan kata kerja jamak (*The mouse and keyboard are connected*).
4. **Indefinite Pronouns**: Kata seperti *each, every, everyone, anyone, somebody, neither* selalu dianggap tunggal (*Each of the components is certified*).
5. **Prepositional Phrases**: Jangan tertipu kata benda dalam frase preposisi (*The quality of the tools is superior* - subjeknya adalah 'quality', bukan 'tools').`,
    formula: {
      positive: 'Singular Subj + Singular Verb (V-s / is / was / has) | Plural Subj + Plural Verb (V1 / are / were / have)',
      negative: 'Singular Subj + does not + V1 | Plural Subj + do not + V1',
      interrogative: 'Does + Singular Subj + V1? | Do + Plural Subj + V1?'
    },
    examples: [
      {
        en: 'The maintenance manual for all CNC lathes contains comprehensive safety guidelines.',
        id: 'Buku panduan perawatan untuk semua mesin bubut CNC memuat panduan keselamatan yang lengkap.',
        context: 'Teknik Pemesinan'
      },
      {
        en: 'Neither the monitor nor the graphics cards were damaged in the electrical surge.',
        id: 'Baik monitor maupun kartu grafis tidak mengalami kerusakan dalam lonjakan arus listrik.',
        context: 'Hardware Komputer'
      }
    ],
    video: 'https://www.youtube.com/embed/0B9H_P7lV4Y',
    quizLatihan: [
      {
        question: 'The set of technical drawing instruments _____ placed in the cabinet.',
        options: ['is', 'are', 'were', 'have been'],
        answer: 'is',
        explanation: 'Subjek intinya adalah "The set" (kolektif/tunggal), sehingga kata kerjanya adalah "is".'
      }
    ]
  },
  {
    id: 'to-be',
    title: 'To Be',
    tujuan: 'Siswa SMK Fase E mampu menggunakan kata kerja bantu To Be (am, is, are, was, were, been) untuk mendeskripsikan spesifikasi teknis peralatan, status sistem komputer, dan identitas profesional di tempat kerja.',
    content: `To Be berfungsi sebagai kata kerja penghubung (linking verb) antara subjek dengan:
1. **Adjective (Kata Sifat)**: Menjelaskan kondisi (*The workshop floor is clean and dry*).
2. **Noun (Kata Benda)**: Menjelaskan profesi atau objek (*Mr. Rahman is an industrial CAD instructor*).
3. **Adverb of Place (Keterangan Tempat)**: Menyatakan lokasi (*The oscilloscope is on the second workbench*).

**Matriks To Be:**
- **Present**: I -> *am*; He/She/It/Singular -> *is*; You/We/They/Plural -> *are*.
- **Past**: I/He/She/It/Singular -> *was*; You/We/They/Plural -> *were*.`,
    formula: {
      positive: 'S + To Be + Adjective / Noun / Adverb',
      negative: 'S + To Be + not + Adjective / Noun / Adverb',
      interrogative: 'To Be + S + Adjective / Noun / Adverb?'
    },
    examples: [
      {
        en: 'The pneumatic valves are operational and ready for automated packaging.',
        id: 'Katup-katup pneumatik tersebut beroperasi dengan baik dan siap untuk pengemasan otomatis.',
        context: 'Otomasi Industri'
      },
      {
        en: 'She was the most outstanding vocational graduate in the provincial skills competition.',
        id: 'Ia adalah lulusan vokasi terbaik dalam lomba kompetensi siswa (LKS) tingkat provinsi.',
        context: 'LKS SMK'
      }
    ],
    video: 'https://www.youtube.com/embed/9w_v06qXjJ8',
    quizLatihan: [
      {
        question: 'These high-voltage electrical transformers _____ very dangerous to touch without insulated gloves.',
        options: ['are', 'is', 'was', 'am'],
        answer: 'are',
        explanation: '"These ... transformers" berbentuk jamak (plural), maka to be bentuk present yang sesuai adalah "are".'
      }
    ]
  }
];
