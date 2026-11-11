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
  Search,
  FileSpreadsheet,
  Edit3,
  X,
  Save,
  UserCheck,
  School,
  FileText,
  ClipboardPaste,
  Smile,
  AlertTriangle,
  UserCog,
  UserPlus
} from 'lucide-react';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { useIFP } from '../context/IFPContext';
import { GRAMMAR_QUESTION_BANK } from '../data/grammarQuestions';
import { GRAMMAR_MATERIALS } from '../data/materialsData';
import { PRESET_AVATARS } from './Profile';
import { triggerConfetti } from '../utils/confetti';
import { soundManager } from '../utils/audio';

interface TeacherItem {
  id: string;
  nama: string;
  nip: string;
  mapel: string;
  kelas: string;
  email: string;
}

interface StudentItem {
  id: string;
  nama: string;
  nis: string;
  kelas: string;
  jurusan: string;
  email: string;
}

interface ClassRoomItem {
  id: string;
  namaKelas: string;
  jurusan: string;
  guru: string;
  jmlSiswa: number;
}

export const AdminManagement: React.FC = () => {
  const { userProfile, updateUserBio } = useAuth();
  const { triggerHaptic } = useIFP();

  const [activeTab, setActiveTab] = useState<'users' | 'classes' | 'admin-profile' | 'questions' | 'backup' | 'logs'>('users');
  const [userSubTab, setUserSubTab] = useState<'guru' | 'siswa'>('guru');
  const [searchQuery, setSearchQuery] = useState('');
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Managed Teachers & Students State (SMKN 1 Sidayu)
  const [teachers, setTeachers] = useState<TeacherItem[]>([
    { id: 'g1', nama: 'Bambang Trianto, S.Pd.', nip: '19850412 201001 1 008', mapel: 'Bahasa Inggris SMK Kelas X', kelas: 'X RPL 1, X RPL 2, X TKJ 1', email: 'bambang.guru@smkn1sidayu.sch.id' },
    { id: 'g2', nama: 'Dra. Endang Sulistyo', nip: '19790615 200501 2 004', mapel: 'Bahasa Inggris Kejuruan Bisnis', kelas: 'X AKL 1, X AKL 2, X DPIB 1', email: 'endang.guru@smkn1sidayu.sch.id' },
    { id: 'g3', nama: 'Ahmad Fauzi, M.Pd.', nip: '19900820 201503 1 002', mapel: 'English for Vocational Tech', kelas: 'X Otomotif 1, X Pemesinan 1', email: 'fauzi.guru@smkn1sidayu.sch.id' },
    { id: 'g4', nama: 'Siti Rahmawati, S.Pd.', nip: '19920110 201902 2 007', mapel: 'English Communication for Hospitality', kelas: 'X Kuliner 1, X DKV 1', email: 'siti.rahma@smkn1sidayu.sch.id' },
  ]);

  const [students, setStudents] = useState<StudentItem[]>([
    { id: 's1', nama: 'Ahmad Rizky Pratama', nis: '232410145', kelas: 'X RPL 1', jurusan: 'Rekayasa Perangkat Lunak', email: 'rizky.siswa@smkn1sidayu.sch.id' },
    { id: 's2', nama: 'Siti Nur Aisyah', nis: '232410146', kelas: 'X AKL 1', jurusan: 'Akuntansi & Keuangan', email: 'siti.siswa@smkn1sidayu.sch.id' },
    { id: 's3', nama: 'Budi Santoso', nis: '232410147', kelas: 'X TKJ 1', jurusan: 'Teknik Komputer & Jaringan', email: 'budi.siswa@smkn1sidayu.sch.id' },
    { id: 's4', nama: 'Dian Permata', nis: '232410148', kelas: 'X DPIB 1', jurusan: 'Desain Pemodelan Bangunan', email: 'dian.siswa@smkn1sidayu.sch.id' },
    { id: 's5', nama: 'Farhan Maulana', nis: '232410149', kelas: 'X Otomotif 1', jurusan: 'Teknik Kendaraan Ringan', email: 'farhan.siswa@smkn1sidayu.sch.id' },
    { id: 's6', nama: 'Zahra Amelia', nis: '232410150', kelas: 'X Kuliner 1', jurusan: 'Tata Boga Industri', email: 'zahra.siswa@smkn1sidayu.sch.id' },
    { id: 's7', nama: 'Muhammad Dimas', nis: '232410151', kelas: 'X RPL 2', jurusan: 'Rekayasa Perangkat Lunak', email: 'dimas.siswa@smkn1sidayu.sch.id' },
    { id: 's8', nama: 'Aulia Rahma Putri', nis: '232410152', kelas: 'X AKL 2', jurusan: 'Akuntansi & Keuangan', email: 'aulia.siswa@smkn1sidayu.sch.id' },
  ]);

  // Managed Classes State (Editable by Admin)
  const [classes, setClasses] = useState<ClassRoomItem[]>([
    { id: 'c1', namaKelas: 'X RPL 1', jurusan: 'Rekayasa Perangkat Lunak', guru: 'Bambang Trianto, S.Pd.', jmlSiswa: 36 },
    { id: 'c2', namaKelas: 'X RPL 2', jurusan: 'Rekayasa Perangkat Lunak', guru: 'Bambang Trianto, S.Pd.', jmlSiswa: 36 },
    { id: 'c3', namaKelas: 'X TKJ 1', jurusan: 'Teknik Komputer & Jaringan', guru: 'Bambang Trianto, S.Pd.', jmlSiswa: 36 },
    { id: 'c4', namaKelas: 'X AKL 1', jurusan: 'Akuntansi & Keuangan', guru: 'Dra. Endang Sulistyo', jmlSiswa: 35 },
    { id: 'c5', namaKelas: 'X AKL 2', jurusan: 'Akuntansi & Keuangan', guru: 'Dra. Endang Sulistyo', jmlSiswa: 35 },
    { id: 'c6', namaKelas: 'X DPIB 1', jurusan: 'Desain Pemodelan Bangunan', guru: 'Dra. Endang Sulistyo', jmlSiswa: 34 },
    { id: 'c7', namaKelas: 'X Otomotif 1', jurusan: 'Teknik Kendaraan Ringan', guru: 'Ahmad Fauzi, M.Pd.', jmlSiswa: 35 },
    { id: 'c8', namaKelas: 'X Kuliner 1', jurusan: 'Tata Boga Industri', guru: 'Siti Rahmawati, S.Pd.', jmlSiswa: 34 },
    { id: 'c9', namaKelas: 'X DKV 1', jurusan: 'Desain Komunikasi Visual', guru: 'Siti Rahmawati, S.Pd.', jmlSiswa: 34 },
  ]);

  // System Activity Logs
  const [activityLogs, setActivityLogs] = useState([
    { time: '10:45:12', user: 'Bambang Trianto', action: 'Membuat 5 Soal AI baru pada topik Future Tense SMKN 1 Sidayu' },
    { time: '10:32:05', user: 'Ahmad Rizky Pratama', action: 'Menyelesaikan Level 6 Boss Battle dengan skor 98' },
    { time: '10:15:30', user: 'Siti Nur Aisyah', action: 'Mendapatkan Badge 🏅 Champion (1000+ pts)' },
    { time: '09:50:18', user: 'Admin Heru', action: 'Sinkronisasi database Firestore SMKN 1 Sidayu selesai (300+ soal aktif)' },
    { time: '09:20:44', user: 'Team Battle Arena', action: 'Sesi IFP Tim Biru vs Tim Merah selesai (Pemenang: Tim Biru)' },
  ]);

  // Modals state for Users
  const [showManualModal, setShowManualModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedRoleToCreate, setSelectedRoleToCreate] = useState<'guru' | 'siswa'>('guru');

  const [editItem, setEditItem] = useState<{
    id: string;
    role: 'guru' | 'siswa';
    nama: string;
    nipOrNis: string;
    kelas: string;
    jurusanOrMapel: string;
    email: string;
  } | null>(null);

  // User Manual Form State (Admin selects Role: Guru or Siswa)
  const [manualUserData, setManualUserData] = useState({
    nama: '',
    nipOrNis: '',
    kelas: 'X RPL 1',
    jurusanOrMapel: 'Bahasa Inggris SMKN 1 Sidayu Kelas X',
    email: '',
  });

  // Modals state for Classes
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [editClassItem, setEditClassItem] = useState<ClassRoomItem | null>(null);
  const [newClassData, setNewClassData] = useState({
    namaKelas: '',
    jurusan: 'Rekayasa Perangkat Lunak',
    guru: 'Bambang Trianto, S.Pd.',
    jmlSiswa: 36,
  });

  // Template Import States
  const [templateTargetRole, setTemplateTargetRole] = useState<'guru' | 'siswa'>('siswa');
  const [rawPastedText, setRawPastedText] = useState('');
  const [parsedPreview, setParsedPreview] = useState<any[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  // Admin Profile Edit State
  const [adminProfileForm, setAdminProfileForm] = useState({
    nama: userProfile?.nama || 'Heru Administrator SMKN 1 Sidayu',
    email: userProfile?.email || 'heru@smanike-gresik.sch.id',
    nip: userProfile?.nip || '19840218 200902 1 004',
    jabatan: userProfile?.jabatan || 'Koordinator IT & Administrator SMKN 1 Sidayu',
    sekolah: 'SMKN 1 Sidayu',
    photoURL: userProfile?.photoURL || PRESET_AVATARS[0].url,
    bio: userProfile?.bio || 'Mengembangkan inovasi pembelajaran grammar interaktif papan sentuh digital di SMKN 1 Sidayu.',
  });

  // Filtered lists
  const filteredTeachers = teachers.filter(t => 
    t.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.nip.includes(searchQuery) ||
    t.kelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStudents = students.filter(s => 
    s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nis.includes(searchQuery) ||
    s.kelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.jurusan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Download Sample CSV Template
  const handleDownloadTemplate = (type: 'guru' | 'siswa') => {
    triggerHaptic();
    let csvContent = '';
    let fileName = '';

    if (type === 'guru') {
      fileName = 'Template_Import_Guru_SMKN1_Sidayu.csv';
      csvContent = 'Nama Lengkap,NIP,Mata Pelajaran,Kelas Binaan,Email Resmi\n' +
        'Bambang Trianto S.Pd.,19850412 201001 1 008,Bahasa Inggris SMK Kelas X,X RPL 1; X TKJ 1,bambang.guru@smkn1sidayu.sch.id\n' +
        'Dra. Endang Sulistyo,19790615 200501 2 004,Bahasa Inggris Kejuruan Bisnis,X AKL 1; X DPIB 1,endang.guru@smkn1sidayu.sch.id\n' +
        'Ahmad Fauzi M.Pd.,19900820 201503 1 002,English for Vocational Tech,X Otomotif 1,fauzi.guru@smkn1sidayu.sch.id';
    } else {
      fileName = 'Template_Import_Siswa_SMKN1_Sidayu.csv';
      csvContent = 'Nama Lengkap Siswa,NIS,Kelas,Jurusan,Email Siswa\n' +
        'Ahmad Rizky Pratama,232410145,X RPL 1,Rekayasa Perangkat Lunak,rizky.siswa@smkn1sidayu.sch.id\n' +
        'Siti Nur Aisyah,232410146,X AKL 1,Akuntansi & Keuangan,siti.siswa@smkn1sidayu.sch.id\n' +
        'Budi Santoso,232410147,X TKJ 1,Teknik Komputer & Jaringan,budi.siswa@smkn1sidayu.sch.id\n' +
        'Dian Permata,232410148,X DPIB 1,Desain Pemodelan Bangunan,dian.siswa@smkn1sidayu.sch.id';
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    soundManager.playCorrect();
  };

  // Parse CSV or TSV
  const handleParseText = (text: string, role: 'guru' | 'siswa') => {
    setParseError(null);
    if (!text.trim()) {
      setParsedPreview([]);
      return;
    }

    try {
      const lines = text.trim().split(/\r\n|\n|\r/);
      if (lines.length < 1) {
        setParseError('Data kosong atau tidak memiliki baris.');
        return;
      }

      const headerLine = lines[0].toLowerCase();
      const hasHeader = headerLine.includes('nama') || headerLine.includes('nip') || headerLine.includes('nis') || headerLine.includes('email');
      const dataRows = hasHeader ? lines.slice(1) : lines;

      const results: any[] = [];

      for (let i = 0; i < dataRows.length; i++) {
        const line = dataRows[i].trim();
        if (!line) continue;

        let parts: string[] = [];
        if (line.includes('\t')) {
          parts = line.split('\t');
        } else if (line.includes(';')) {
          parts = line.split(';');
        } else {
          parts = line.split(',');
        }

        parts = parts.map(p => p.trim().replace(/^["']|["']$/g, ''));

        if (role === 'guru') {
          const nama = parts[0] || `Guru Baru ${i + 1}`;
          const nip = parts[1] || '-';
          const mapel = parts[2] || 'Bahasa Inggris SMKN 1 Sidayu';
          const kelas = parts[3] || 'X RPL 1';
          const email = parts[4] || `${nama.toLowerCase().replace(/[^a-z0-9]/g, '.')}@smkn1sidayu.sch.id`;

          results.push({
            id: `g-import-${Date.now()}-${i}`,
            nama,
            nip,
            mapel,
            kelas,
            email,
          });
        } else {
          const nama = parts[0] || `Siswa Baru ${i + 1}`;
          const nis = parts[1] || String(242510000 + i);
          const kelas = parts[2] || 'X RPL 1';
          const jurusan = parts[3] || (kelas.includes('RPL') ? 'Rekayasa Perangkat Lunak' : kelas.includes('TKJ') ? 'Teknik Komputer & Jaringan' : 'Akuntansi & Keuangan');
          const email = parts[4] || `${nama.toLowerCase().replace(/[^a-z0-9]/g, '.')}@smkn1sidayu.sch.id`;

          results.push({
            id: `s-import-${Date.now()}-${i}`,
            nama,
            nis,
            kelas,
            jurusan,
            email,
          });
        }
      }

      if (results.length === 0) {
        setParseError('Tidak ada baris data valid yang terdeteksi.');
      } else {
        setParsedPreview(results);
      }
    } catch (err: any) {
      setParseError('Gagal memproses data: ' + err.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setRawPastedText(text);
      handleParseText(text, templateTargetRole);
    };
    reader.readAsText(file);
  };

  const handleCommitTemplateImport = async () => {
    triggerHaptic();
    if (parsedPreview.length === 0) return;

    try {
      if (templateTargetRole === 'guru') {
        setTeachers(prev => [...prev, ...parsedPreview]);
        for (const item of parsedPreview) {
          try {
            await setDoc(doc(db, 'users', item.id), {
              uid: item.id,
              nama: item.nama,
              email: item.email,
              role: 'guru',
              nip: item.nip,
              mataPelajaran: item.mapel,
              kelas: item.kelas,
              sekolah: 'SMKN 1 Sidayu',
              createdAt: new Date().toISOString()
            });
          } catch {
            // retain
          }
        }
        setActionSuccessMsg(`Admin berhasil mengimpor ${parsedPreview.length} Role Guru SMKN 1 Sidayu!`);
      } else {
        setStudents(prev => [...prev, ...parsedPreview]);
        for (const item of parsedPreview) {
          try {
            await setDoc(doc(db, 'users', item.id), {
              uid: item.id,
              nama: item.nama,
              email: item.email,
              role: 'siswa',
              nis: item.nis,
              kelas: item.kelas,
              jurusan: item.jurusan,
              sekolah: 'SMKN 1 Sidayu',
              createdAt: new Date().toISOString()
            });
          } catch {
            // retain
          }
        }
        setActionSuccessMsg(`Admin berhasil mengimpor ${parsedPreview.length} Role Siswa SMKN 1 Sidayu!`);
      }

      setActivityLogs(prev => [
        { time: new Date().toLocaleTimeString(), user: userProfile?.nama || 'Admin Heru', action: `Import ${parsedPreview.length} ${templateTargetRole} SMKN 1 Sidayu dari template` },
        ...prev
      ]);

      setShowTemplateModal(false);
      setParsedPreview([]);
      setRawPastedText('');
      soundManager.playVictory();
      triggerConfetti();

      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error(err);
    }
  };

  // ADMIN CREATES ROLE (GURU OR SISWA)
  const handleAdminCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();

    const newId = `${selectedRoleToCreate === 'guru' ? 'g' : 's'}-${Date.now()}`;
    const cleanName = manualUserData.nama.trim();
    const cleanEmail = manualUserData.email.trim() || `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@smkn1sidayu.sch.id`;

    if (selectedRoleToCreate === 'guru') {
      const newTeacher: TeacherItem = {
        id: newId,
        nama: cleanName,
        nip: manualUserData.nipOrNis.trim(),
        mapel: manualUserData.jurusanOrMapel.trim(),
        kelas: manualUserData.kelas.trim(),
        email: cleanEmail,
      };

      setTeachers(prev => [newTeacher, ...prev]);

      try {
        await setDoc(doc(db, 'users', newId), {
          uid: newId,
          nama: cleanName,
          email: cleanEmail,
          role: 'guru',
          nip: manualUserData.nipOrNis.trim(),
          mataPelajaran: manualUserData.jurusanOrMapel.trim(),
          kelas: manualUserData.kelas.trim(),
          sekolah: 'SMKN 1 Sidayu',
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Sync firestore:', err);
      }

      setActionSuccessMsg(`Role GURU berhasil dibuat: "${cleanName}" terdaftar sebagai pengampu di SMKN 1 Sidayu!`);
    } else {
      const newStudent: StudentItem = {
        id: newId,
        nama: cleanName,
        nis: manualUserData.nipOrNis.trim(),
        kelas: manualUserData.kelas,
        jurusan: manualUserData.jurusanOrMapel.trim(),
        email: cleanEmail,
      };

      setStudents(prev => [newStudent, ...prev]);

      try {
        await setDoc(doc(db, 'users', newId), {
          uid: newId,
          nama: cleanName,
          email: cleanEmail,
          role: 'siswa',
          nis: manualUserData.nipOrNis.trim(),
          kelas: manualUserData.kelas,
          jurusan: manualUserData.jurusanOrMapel.trim(),
          sekolah: 'SMKN 1 Sidayu',
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Sync firestore:', err);
      }

      setActionSuccessMsg(`Role SISWA berhasil dibuat: "${cleanName}" terdaftar di kelas ${manualUserData.kelas}!`);
    }

    setManualUserData({
      nama: '',
      nipOrNis: '',
      kelas: 'X RPL 1',
      jurusanOrMapel: selectedRoleToCreate === 'guru' ? 'Bahasa Inggris SMKN 1 Sidayu Kelas X' : 'Rekayasa Perangkat Lunak',
      email: '',
    });

    setShowManualModal(false);
    soundManager.playCorrect();
    triggerConfetti();

    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  // EDIT USER HANDLER (ADMIN CAN ADJUST DETAILS & ROLE)
  const handleSaveEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();
    if (!editItem) return;

    if (editItem.role === 'guru') {
      const updatedTeacher: TeacherItem = {
        id: editItem.id,
        nama: editItem.nama.trim(),
        nip: editItem.nipOrNis.trim(),
        mapel: editItem.jurusanOrMapel.trim(),
        kelas: editItem.kelas.trim(),
        email: editItem.email.trim(),
      };
      setTeachers(prev => prev.map(t => t.id === editItem.id ? updatedTeacher : t));
      setActionSuccessMsg(`Data Guru "${updatedTeacher.nama}" berhasil diperbarui!`);

      try {
        await setDoc(doc(db, 'users', editItem.id), {
          uid: editItem.id,
          nama: updatedTeacher.nama,
          nip: updatedTeacher.nip,
          mataPelajaran: updatedTeacher.mapel,
          kelas: updatedTeacher.kelas,
          email: updatedTeacher.email,
          role: 'guru',
          sekolah: 'SMKN 1 Sidayu',
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch {
        // retain
      }
    } else {
      const updatedStudent: StudentItem = {
        id: editItem.id,
        nama: editItem.nama.trim(),
        nis: editItem.nipOrNis.trim(),
        kelas: editItem.kelas,
        jurusan: editItem.jurusanOrMapel.trim(),
        email: editItem.email.trim(),
      };
      setStudents(prev => prev.map(s => s.id === editItem.id ? updatedStudent : s));
      setActionSuccessMsg(`Data Siswa "${updatedStudent.nama}" berhasil diperbarui!`);

      try {
        await setDoc(doc(db, 'users', editItem.id), {
          uid: editItem.id,
          nama: updatedStudent.nama,
          nis: updatedStudent.nis,
          kelas: updatedStudent.kelas,
          jurusan: updatedStudent.jurusan,
          email: updatedStudent.email,
          role: 'siswa',
          sekolah: 'SMKN 1 Sidayu',
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch {
        // retain
      }
    }

    setEditItem(null);
    soundManager.playCorrect();
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  // DELETE USER
  const handleDeleteUser = (type: 'guru' | 'siswa', id: string, name: string) => {
    triggerHaptic();
    if (confirm(`Apakah Anda yakin ingin menghapus data ${type === 'guru' ? 'Guru' : 'Siswa'} "${name}"?`)) {
      if (type === 'guru') {
        setTeachers(prev => prev.filter(t => t.id !== id));
      } else {
        setStudents(prev => prev.filter(s => s.id !== id));
      }

      try {
        deleteDoc(doc(db, 'users', id));
      } catch {
        // retain
      }

      soundManager.playWrong();
      setActionSuccessMsg(`Data "${name}" berhasil dihapus.`);
      setTimeout(() => setActionSuccessMsg(null), 3000);
    }
  };

  // CLASSROOM CRUD HANDLERS (KELOLA KELAS BISA DIEDIT)
  const handleAddClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();

    const newClassId = `c-${Date.now()}`;
    const item: ClassRoomItem = {
      id: newClassId,
      namaKelas: newClassData.namaKelas.trim(),
      jurusan: newClassData.jurusan.trim(),
      guru: newClassData.guru.trim(),
      jmlSiswa: Number(newClassData.jmlSiswa) || 36,
    };

    setClasses(prev => [...prev, item]);

    try {
      await setDoc(doc(db, 'classes', newClassId), item);
    } catch (err) {
      console.warn('Class sync:', err);
    }

    setShowAddClassModal(false);
    setNewClassData({ namaKelas: '', jurusan: 'Rekayasa Perangkat Lunak', guru: 'Bambang Trianto, S.Pd.', jmlSiswa: 36 });
    setActionSuccessMsg(`Kelas baru "${item.namaKelas}" berhasil ditambahkan ke SMKN 1 Sidayu!`);
    soundManager.playCorrect();
    triggerConfetti();

    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  const handleSaveEditClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();
    if (!editClassItem) return;

    setClasses(prev => prev.map(c => c.id === editClassItem.id ? editClassItem : c));

    try {
      await setDoc(doc(db, 'classes', editClassItem.id), editClassItem, { merge: true });
    } catch (err) {
      console.warn('Class sync edit:', err);
    }

    setActionSuccessMsg(`Rombel Kelas "${editClassItem.namaKelas}" berhasil diperbarui!`);
    setEditClassItem(null);
    soundManager.playCorrect();
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  const handleDeleteClass = async (id: string, name: string) => {
    triggerHaptic();
    if (confirm(`Hapus rombongan belajar kelas "${name}"?`)) {
      setClasses(prev => prev.filter(c => c.id !== id));
      try {
        await deleteDoc(doc(db, 'classes', id));
      } catch {
        // retain
      }
      soundManager.playWrong();
      setActionSuccessMsg(`Kelas "${name}" berhasil dihapus.`);
      setTimeout(() => setActionSuccessMsg(null), 3000);
    }
  };

  // ADMIN PROFILE SAVE
  const handleSaveAdminProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();

    await updateUserBio({
      nama: adminProfileForm.nama.trim(),
      nip: adminProfileForm.nip.trim(),
      jabatan: adminProfileForm.jabatan.trim(),
      sekolah: 'SMKN 1 Sidayu',
      photoURL: adminProfileForm.photoURL,
      bio: adminProfileForm.bio.trim(),
    });

    setActionSuccessMsg('Profil Administrator SMKN 1 Sidayu berhasil disimpan dan diperbarui!');
    soundManager.playCorrect();
    triggerConfetti();

    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  // BACKUP DATA
  const handleBackup = () => {
    triggerHaptic();
    const backupPayload = {
      appName: 'Grammar Challenge X - SMKN 1 Sidayu',
      version: '2.6.0',
      timestamp: new Date().toISOString(),
      school: 'SMKN 1 Sidayu (Gresik)',
      exportedBy: userProfile?.email || 'heru@smanike-gresik.sch.id',
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
    a.download = `Backup_SMKN1_Sidayu_Grammar_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setBackupStatus('Backup data SMKN 1 Sidayu berhasil diekspor sebagai file JSON aman!');
    soundManager.playCorrect();
    triggerConfetti();
  };

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
          setBackupStatus('Database SMKN 1 Sidayu berhasil dipulihkan (Restored) dari file backup!');
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
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold mb-2 border border-rose-500/30">
            <School className="w-3.5 h-3.5 text-rose-400" />
            SMKN 1 Sidayu • Panel Khusus Administrator
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-tight">
            Pusat Kontrol & Manajemen Sistem SMKN 1 Sidayu
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Buat role Guru & Siswa, kelola rombel kelas kejuruan (bisa diedit), edit profil admin, bank soal, dan cadangan data.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-black border border-rose-500/30 flex items-center gap-1.5 shadow-sm">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            Super Admin: {userProfile?.nama || 'Admin Heru'}
          </span>
        </div>
      </div>

      {/* Global Success Notification */}
      {actionSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500 text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'users', label: 'Kelola Role Guru & Siswa', icon: Users },
          { id: 'classes', label: 'Kelola Kelas Kejuruan (Bisa Diedit)', icon: GraduationCap, highlight: true },
          { id: 'admin-profile', label: 'Edit Profil Admin', icon: UserCog },
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
                  : tab.highlight
                  ? 'bg-slate-900 text-amber-300 border-amber-500/40 hover:bg-slate-800'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: KELOLA ROLE GURU & SISWA */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Sub-tab Switcher: Guru vs Siswa */}
            <div className="flex items-center p-1.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 self-start">
              <button
                onClick={() => { triggerHaptic(); setUserSubTab('guru'); }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                  userSubTab === 'guru'
                    ? 'bg-amber-500 text-slate-950 font-heading font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Role Guru Pengampu ({teachers.length})
              </button>
              <button
                onClick={() => { triggerHaptic(); setUserSubTab('siswa'); }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                  userSubTab === 'siswa'
                    ? 'bg-emerald-500 text-slate-950 font-heading font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                Role Siswa Kelas X ({students.length})
              </button>
            </div>

            {/* Action Buttons: Buat Role Baru & Input Template */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  triggerHaptic();
                  setTemplateTargetRole(userSubTab);
                  setParsedPreview([]);
                  setRawPastedText('');
                  setParseError(null);
                  setShowTemplateModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-heading font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 flex items-center gap-2 active:scale-95 transition"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Input dari Template CSV/Excel
              </button>

              <button
                onClick={() => {
                  triggerHaptic();
                  setSelectedRoleToCreate(userSubTab);
                  setManualUserData({
                    nama: '',
                    nipOrNis: '',
                    kelas: 'X RPL 1',
                    jurusanOrMapel: userSubTab === 'guru' ? 'Bahasa Inggris SMKN 1 Sidayu Kelas X' : 'Rekayasa Perangkat Lunak',
                    email: '',
                  });
                  setShowManualModal(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-110 text-slate-950 font-heading font-black text-xs sm:text-sm shadow-md shadow-amber-500/20 flex items-center gap-2 active:scale-95 transition"
              >
                <UserPlus className="w-4 h-4" />
                Buat User Baru (Pilih Role Guru / Siswa)
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Cari nama, ${userSubTab === 'guru' ? 'NIP, mapel' : 'NIS, jurusan'}, atau kelas...`}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* TEACHERS LIST */}
          {userSubTab === 'guru' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-amber-400" />
                  Daftar Pengguna Role Guru SMKN 1 Sidayu ({filteredTeachers.length} Guru)
                </h3>
                <button
                  onClick={() => handleDownloadTemplate('guru')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh Format Template Guru (.csv)
                </button>
              </div>

              <div className="space-y-3">
                {filteredTeachers.map(g => (
                  <div key={g.id} className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-heading font-black text-white text-base">{g.nama}</p>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Role: Guru
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        NIP: <span className="text-slate-300 font-mono">{g.nip}</span> • {g.mapel}
                      </p>
                      <p className="text-xs text-indigo-400 font-mono">
                        {g.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 text-xs font-bold rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
                        Kelas Binaan: {g.kelas}
                      </span>

                      <button
                        onClick={() => {
                          triggerHaptic();
                          setEditItem({
                            id: g.id,
                            role: 'guru',
                            nama: g.nama,
                            nipOrNis: g.nip,
                            kelas: g.kelas,
                            jurusanOrMapel: g.mapel,
                            email: g.email,
                          });
                        }}
                        className="p-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95"
                        title="Edit Data & Role Guru"
                      >
                        <Edit3 className="w-4 h-4 text-amber-400" />
                      </button>

                      <button
                        onClick={() => handleDeleteUser('guru', g.id, g.nama)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition active:scale-95"
                        title="Hapus Guru"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STUDENTS LIST */}
          {userSubTab === 'siswa' && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  Daftar Pengguna Role Siswa SMKN 1 Sidayu ({filteredStudents.length} Siswa Terdaftar)
                </h3>
                <button
                  onClick={() => handleDownloadTemplate('siswa')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh Format Template Siswa (.csv)
                </button>
              </div>

              <div className="space-y-3">
                {filteredStudents.map(s => (
                  <div key={s.id} className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-heading font-black text-white text-base">{s.nama}</p>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Role: Siswa • {s.kelas}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        NIS: <span className="text-slate-300 font-mono">{s.nis}</span> • Jurusan: <span className="text-slate-300">{s.jurusan}</span>
                      </p>
                      <p className="text-xs text-indigo-400 font-mono">
                        {s.email}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => {
                          triggerHaptic();
                          setEditItem({
                            id: s.id,
                            role: 'siswa',
                            nama: s.nama,
                            nipOrNis: s.nis,
                            kelas: s.kelas,
                            jurusanOrMapel: s.jurusan,
                            email: s.email,
                          });
                        }}
                        className="p-2 rounded-xl bg-slate-700/80 hover:bg-slate-700 text-slate-300 hover:text-white transition active:scale-95"
                        title="Edit Data & Role Siswa"
                      >
                        <Edit3 className="w-4 h-4 text-emerald-400" />
                      </button>

                      <button
                        onClick={() => handleDeleteUser('siswa', s.id, s.nama)}
                        className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition active:scale-95"
                        title="Hapus Siswa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: KELOLA KELAS KEJURUAN (BISA DIEDIT) */}
      {activeTab === 'classes' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-heading font-black text-xl text-white flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-indigo-400" />
                Kelola Rombongan Belajar (Rombel) SMKN 1 Sidayu
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Admin dapat menambah, mengedit nama kelas, jurusan, guru wali, dan jumlah siswa secara real-time.
              </p>
            </div>

            <button
              onClick={() => {
                triggerHaptic();
                setShowAddClassModal(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-heading font-black text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 self-start sm:self-auto active:scale-95 transition"
            >
              <Plus className="w-4 h-4" />
              Tambah Kelas Baru
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map(c => (
              <div key={c.id} className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-3 hover:border-indigo-500/50 transition shadow-md">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-black text-white text-lg">{c.namaKelas}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {c.jmlSiswa} Siswa
                  </span>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-slate-300 font-medium">
                    <span className="text-slate-500">Jurusan: </span>{c.jurusan}
                  </p>
                  <p className="text-xs text-slate-400">
                    <span className="text-slate-500">Guru Wali: </span>{c.guru}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-700/60">
                  <button
                    onClick={() => {
                      triggerHaptic();
                      setEditClassItem({ ...c });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition active:scale-95"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    Edit Kelas
                  </button>

                  <button
                    onClick={() => handleDeleteClass(c.id, c.namaKelas)}
                    className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition active:scale-95"
                    title="Hapus Kelas"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EDIT PROFIL ADMIN */}
      {activeTab === 'admin-profile' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold mb-2 border border-rose-500/30">
                <UserCog className="w-3.5 h-3.5 text-rose-400" />
                Pengaturan Akun Administrator
              </div>
              <h2 className="font-heading font-black text-2xl text-white">
                Edit Profil Administrator SMKN 1 Sidayu
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Perbarui nama lengkap, jabatan, foto profil avatar, dan catatan administrator sistem.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveAdminProfile} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-3">
              <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide flex items-center gap-1.5">
                <Smile className="w-4 h-4 text-amber-400" />
                Pilih Karakter Foto Avatar Administrator
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {PRESET_AVATARS.map(av => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic();
                      setAdminProfileForm({ ...adminProfileForm, photoURL: av.url });
                    }}
                    className={`p-2 rounded-2xl border transition-all text-center flex flex-col items-center gap-1 active:scale-95 ${
                      adminProfileForm.photoURL === av.url 
                        ? 'bg-rose-500/20 border-rose-400 ring-2 ring-rose-400 scale-105' 
                        : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-950">
                      <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 truncate max-w-[80px]">
                      {av.label}
                    </span>
                  </button>
                ))}
              </div>

              <div className="pt-1">
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Atau URL Foto Khusus:
                </label>
                <input
                  type="url"
                  value={adminProfileForm.photoURL}
                  onChange={e => setAdminProfileForm({ ...adminProfileForm, photoURL: e.target.value })}
                  placeholder="https://images.unsplash.com/... atau URL foto"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1.5">
                  Nama Lengkap Administrator *
                </label>
                <input
                  type="text"
                  required
                  value={adminProfileForm.nama}
                  onChange={e => setAdminProfileForm({ ...adminProfileForm, nama: e.target.value })}
                  placeholder="Heru Administrator SMKN 1 Sidayu"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white font-bold focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1.5">
                  NIP / ID Pegawai
                </label>
                <input
                  type="text"
                  value={adminProfileForm.nip}
                  onChange={e => setAdminProfileForm({ ...adminProfileForm, nip: e.target.value })}
                  placeholder="19840218 200902 1 004"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1.5">
                  Nama Sekolah
                </label>
                <input
                  type="text"
                  readOnly
                  value="SMKN 1 Sidayu"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-sm text-amber-300 font-bold cursor-not-allowed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1.5">
                  Jabatan / Unit Tugas Administrator
                </label>
                <input
                  type="text"
                  value={adminProfileForm.jabatan}
                  onChange={e => setAdminProfileForm({ ...adminProfileForm, jabatan: e.target.value })}
                  placeholder="Koordinator IT & Administrator SMKN 1 Sidayu"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1.5">
                  Email Akun Terdaftar (Super Admin)
                </label>
                <input
                  type="email"
                  readOnly
                  value={adminProfileForm.email}
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-sm text-slate-400 font-mono cursor-not-allowed"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wide mb-1.5">
                  Bio / Catatan Visi Pembelajaran Admin
                </label>
                <textarea
                  rows={2}
                  value={adminProfileForm.bio}
                  onChange={e => setAdminProfileForm({ ...adminProfileForm, bio: e.target.value })}
                  placeholder="Tuliskan catatan atau visi administrator..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-800">
              <button
                type="submit"
                className="px-7 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:brightness-110 text-white font-heading font-black text-sm shadow-xl shadow-rose-600/25 active:scale-95 transition flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Simpan & Perbarui Profil Admin
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: MONITORING BANK SOAL (300+ SOAL) */}
      {activeTab === 'questions' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-400" />
                Bank Soal Grammar Aktif ({GRAMMAR_QUESTION_BANK.length} Butir Soal Terverifikasi)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Mencakup 6 kategori grammar Kurikulum Merdeka SMKN 1 Sidayu dan 3 tingkat kesulitan.
              </p>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
            {GRAMMAR_QUESTION_BANK.slice(0, 15).map((q) => (
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

      {/* TAB 5: BACKUP & RESTORE DATA */}
      {activeTab === 'backup' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div>
            <h3 className="font-heading font-black text-white text-lg flex items-center gap-2">
              <Database className="w-5 h-5 text-rose-400" />
              Backup & Restore Data SMKN 1 Sidayu
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Simpan cadangan data seluruh siswa, guru, nilai, kelas, dan soal secara aman dalam format JSON terenkripsi.
            </p>
          </div>

          {backupStatus && (
            <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500 text-indigo-200 text-xs sm:text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-400" />
              {backupStatus}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="p-6 rounded-3xl bg-slate-800/70 border border-slate-700 space-y-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Download className="w-7 h-7" />
              </div>
              <h4 className="font-heading font-bold text-white text-base">Ekspor Cadangan (Backup Data)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unduh file arsip berformat JSON berisi seluruh riwayat nilai, master soal, dan data siswa SMKN 1 Sidayu.
              </p>
              <button
                onClick={handleBackup}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-heading font-bold text-sm shadow-lg shadow-indigo-600/30 transition active:scale-95"
              >
                Unduh Cadangan JSON Sekarang
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-slate-800/70 border border-slate-700 space-y-4 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Upload className="w-7 h-7" />
              </div>
              <h4 className="font-heading font-bold text-white text-base">Pulihkan Data (Restore Data)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unggah file cadangan JSON yang sebelumnya diekspor untuk memulihkan keadaan data sistem SMKN 1 Sidayu.
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

      {/* TAB 6: LOG AKTIVITAS */}
      {activeTab === 'logs' && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-heading font-bold text-white text-base flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Audit Log Aktivitas Terkini SMKN 1 Sidayu
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

      {/* MODAL: ADMIN BUAT USER BARU DENGAN PILIHAN ROLE (GURU ATAU SISWA) */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-heading font-black text-lg sm:text-xl text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-amber-400" />
                  Buat Pengguna Baru (Role Guru / Siswa)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Admin dapat menetapkan peran secara langsung untuk warga sekolah SMKN 1 Sidayu.
                </p>
              </div>
              <button
                onClick={() => setShowManualModal(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdminCreateUserSubmit} className="space-y-4 text-xs">
              {/* Role Selection Tabs */}
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1.5">
                  Pilih Peran Akun (Role) *
                </label>
                <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-800 border border-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRoleToCreate('guru');
                      setManualUserData(prev => ({
                        ...prev,
                        jurusanOrMapel: 'Bahasa Inggris SMKN 1 Sidayu Kelas X'
                      }));
                    }}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
                      selectedRoleToCreate === 'guru'
                        ? 'bg-amber-500 text-slate-950 shadow-md font-heading font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    Role Guru
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRoleToCreate('siswa');
                      setManualUserData(prev => ({
                        ...prev,
                        jurusanOrMapel: 'Rekayasa Perangkat Lunak'
                      }));
                    }}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
                      selectedRoleToCreate === 'siswa'
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-heading font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    Role Siswa
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  value={manualUserData.nama}
                  onChange={e => setManualUserData({ ...manualUserData, nama: e.target.value })}
                  placeholder={selectedRoleToCreate === 'guru' ? 'Contoh: Bambang Trianto, S.Pd.' : 'Contoh: Ahmad Dimas Pratama'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">
                    {selectedRoleToCreate === 'guru' ? 'NIP / NUPTK' : 'NIS (Nomor Induk Siswa)'}
                  </label>
                  <input
                    type="text"
                    value={manualUserData.nipOrNis}
                    onChange={e => setManualUserData({ ...manualUserData, nipOrNis: e.target.value })}
                    placeholder={selectedRoleToCreate === 'guru' ? '19850412 201001 1 008' : '24251001'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">
                    {selectedRoleToCreate === 'guru' ? 'Kelas Binaan' : 'Kelas Kejuruan *'}
                  </label>
                  {selectedRoleToCreate === 'guru' ? (
                    <input
                      type="text"
                      value={manualUserData.kelas}
                      onChange={e => setManualUserData({ ...manualUserData, kelas: e.target.value })}
                      placeholder="X RPL 1, X TKJ 1"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    />
                  ) : (
                    <select
                      value={manualUserData.kelas}
                      onChange={e => setManualUserData({ ...manualUserData, kelas: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-400"
                    >
                      {classes.map(c => (
                        <option key={c.id} value={c.namaKelas}>{c.namaKelas}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  {selectedRoleToCreate === 'guru' ? 'Mata Pelajaran yang Diampu' : 'Jurusan / Konsentrasi Keahlian'}
                </label>
                <input
                  type="text"
                  required
                  value={manualUserData.jurusanOrMapel}
                  onChange={e => setManualUserData({ ...manualUserData, jurusanOrMapel: e.target.value })}
                  placeholder={selectedRoleToCreate === 'guru' ? 'Bahasa Inggris SMKN 1 Sidayu Kelas X' : 'Rekayasa Perangkat Lunak'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  Email Akun Resmi SMKN 1 Sidayu
                </label>
                <input
                  type="email"
                  value={manualUserData.email}
                  onChange={e => setManualUserData({ ...manualUserData, email: e.target.value })}
                  placeholder={selectedRoleToCreate === 'guru' ? 'guru@smkn1sidayu.sch.id' : 'siswa@smkn1sidayu.sch.id'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-heading font-black shadow-lg shadow-amber-500/20 active:scale-95 transition"
                >
                  Buat Akun ({selectedRoleToCreate.toUpperCase()})
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER (TERMASUK EDIT ROLE GURU/SISWA) */}
      {editItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading font-black text-lg text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-indigo-400" />
                Edit Data & Role Pengguna
              </h3>
              <button
                onClick={() => setEditItem(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Role Akun</label>
                <select
                  value={editItem.role}
                  onChange={e => setEditItem({ ...editItem, role: e.target.value as 'guru' | 'siswa' })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold focus:outline-none focus:border-indigo-400"
                >
                  <option value="guru">Guru Pengampu</option>
                  <option value="siswa">Siswa Kelas X</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={editItem.nama}
                  onChange={e => setEditItem({ ...editItem, nama: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">
                    {editItem.role === 'guru' ? 'NIP / NUPTK' : 'NIS'}
                  </label>
                  <input
                    type="text"
                    value={editItem.nipOrNis}
                    onChange={e => setEditItem({ ...editItem, nipOrNis: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Kelas</label>
                  <input
                    type="text"
                    value={editItem.kelas}
                    onChange={e => setEditItem({ ...editItem, kelas: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  {editItem.role === 'guru' ? 'Mata Pelajaran' : 'Jurusan'}
                </label>
                <input
                  type="text"
                  value={editItem.jurusanOrMapel}
                  onChange={e => setEditItem({ ...editItem, jurusanOrMapel: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Email</label>
                <input
                  type="email"
                  value={editItem.email}
                  onChange={e => setEditItem({ ...editItem, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-heading font-black shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                  Simpan Perubahan User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAMBAH KELAS KEJURUAN BARU (BISA DIEDIT) */}
      {showAddClassModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading font-black text-lg text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                Tambah Rombel Kelas Kejuruan Baru
              </h3>
              <button
                onClick={() => setShowAddClassModal(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddClassSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Nama Rombel Kelas *</label>
                <input
                  type="text"
                  required
                  value={newClassData.namaKelas}
                  onChange={e => setNewClassData({ ...newClassData, namaKelas: e.target.value })}
                  placeholder="Contoh: X RPL 3 atau X TKR 1"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Jurusan / Konsentrasi Keahlian *</label>
                <input
                  type="text"
                  required
                  value={newClassData.jurusan}
                  onChange={e => setNewClassData({ ...newClassData, jurusan: e.target.value })}
                  placeholder="Contoh: Rekayasa Perangkat Lunak"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Guru Wali / Pengampu</label>
                  <input
                    type="text"
                    value={newClassData.guru}
                    onChange={e => setNewClassData({ ...newClassData, guru: e.target.value })}
                    placeholder="Contoh: Bambang Trianto, S.Pd."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Jumlah Siswa</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={newClassData.jmlSiswa}
                    onChange={e => setNewClassData({ ...newClassData, jmlSiswa: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-400 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddClassModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-heading font-black shadow-lg shadow-indigo-600/30 active:scale-95"
                >
                  Simpan Kelas Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT KELAS KEJURUAN */}
      {editClassItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-heading font-black text-lg text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                Edit Rombel Kelas: {editClassItem.namaKelas}
              </h3>
              <button
                onClick={() => setEditClassItem(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditClassSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Nama Rombel Kelas *</label>
                <input
                  type="text"
                  required
                  value={editClassItem.namaKelas}
                  onChange={e => setEditClassItem({ ...editClassItem, namaKelas: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Jurusan / Konsentrasi Keahlian *</label>
                <input
                  type="text"
                  required
                  value={editClassItem.jurusan}
                  onChange={e => setEditClassItem({ ...editClassItem, jurusan: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Guru Wali / Pengampu</label>
                  <input
                    type="text"
                    value={editClassItem.guru}
                    onChange={e => setEditClassItem({ ...editClassItem, guru: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">Jumlah Siswa</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={editClassItem.jmlSiswa}
                    onChange={e => setEditClassItem({ ...editClassItem, jmlSiswa: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400 font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditClassItem(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-heading font-black shadow-lg shadow-amber-500/20 active:scale-95"
                >
                  Simpan Perubahan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INPUT DARI TEMPLATE CSV/EXCEL */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-black text-lg sm:text-xl text-white">
                    Input Data Pengguna dari Template
                  </h3>
                  <p className="text-xs text-slate-400">
                    SMKN 1 Sidayu • Unggah file CSV atau salin-tempel baris data dari Excel / Spreadsheet.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Pilih Target Role yang Dibuat:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTemplateTargetRole('siswa');
                      if (rawPastedText) handleParseText(rawPastedText, 'siswa');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      templateTargetRole === 'siswa'
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md font-heading font-black'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Role Siswa
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTemplateTargetRole('guru');
                      if (rawPastedText) handleParseText(rawPastedText, 'guru');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition ${
                      templateTargetRole === 'guru'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-heading font-black'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Role Guru
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Unduh Format Template:
                </label>
                <button
                  type="button"
                  onClick={() => handleDownloadTemplate(templateTargetRole)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition"
                >
                  <Download className="w-4 h-4" />
                  Unduh Template CSV {templateTargetRole === 'guru' ? 'Guru' : 'Siswa'}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-indigo-400" />
                  Unggah File .CSV / .TXT
                </span>
                <span className="text-[11px] text-slate-500">atau salin baris dari Excel di bawah</span>
              </div>

              <input
                type="file"
                accept=".csv, .txt"
                onChange={handleFileUpload}
                className="w-full text-xs text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer bg-slate-800/80 p-2 rounded-2xl border border-slate-700"
              />

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1 flex items-center gap-1.5">
                  <ClipboardPaste className="w-4 h-4 text-amber-400" />
                  Atau Tempel (Paste) Teks Baris dari Excel / Spreadsheet:
                </label>
                <textarea
                  rows={4}
                  value={rawPastedText}
                  onChange={(e) => {
                    setRawPastedText(e.target.value);
                    handleParseText(e.target.value, templateTargetRole);
                  }}
                  placeholder={
                    templateTargetRole === 'guru'
                      ? 'Nama\tNIP\tMata Pelajaran\tKelas\tEmail\nBambang Trianto S.Pd.\t19850412...\tBahasa Inggris\tX RPL 1\tbambang@smkn1sidayu.sch.id'
                      : 'Nama\tNIS\tKelas\tJurusan\tEmail\nAhmad Rizky\t232410145\tX RPL 1\tRekayasa Perangkat Lunak\trizky@smkn1sidayu.sch.id'
                  }
                  className="w-full p-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {parseError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{parseError}</span>
              </div>
            )}

            {parsedPreview.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span>Pratinjau Hasil Pembacaan ({parsedPreview.length} Baris Siap Diimpor)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Format Terdeteksi Valid</span>
                </div>

                <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950/80 p-2 space-y-1.5">
                  {parsedPreview.slice(0, 8).map((p, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between text-[11px]">
                      <div>
                        <span className="font-bold text-white">{p.nama}</span>
                        <span className="text-slate-400 ml-2">
                          ({templateTargetRole === 'guru' ? `NIP: ${p.nip}` : `NIS: ${p.nis}`})
                        </span>
                      </div>
                      <div className="text-indigo-400 font-mono">
                        {templateTargetRole === 'guru' ? p.kelas : `${p.kelas} • ${p.jurusan}`}
                      </div>
                    </div>
                  ))}
                  {parsedPreview.length > 8 && (
                    <p className="text-center text-[10px] text-slate-500 py-1 italic">
                      + {parsedPreview.length - 8} baris data lainnya...
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={parsedPreview.length === 0}
                onClick={handleCommitTemplateImport}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 disabled:opacity-50 text-slate-950 font-heading font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95"
              >
                <Save className="w-4 h-4" />
                Konfirmasi & Impor {parsedPreview.length} Data ke Sistem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
