import React, { useState } from 'react';
import { 
  Gamepad2, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  User, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  School,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Shield,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAuth, SUPER_ADMIN_EMAIL } from '../context/AuthContext';
import { useIFP } from '../context/IFPContext';

export const AuthPage: React.FC = () => {
  const { login, registerSiswa, registerGuru, loginWithGoogle } = useAuth();
  const { triggerHaptic } = useIFP();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [registerRole, setRegisterRole] = useState<'siswa' | 'guru'>('siswa');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Single door login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sembunyikan Kredensial (Mode Privasi Kelas / IFP)
  const [hideCredentials, setHideCredentials] = useState<boolean>(() => {
    return localStorage.getItem('gcs_hide_login_credentials') === 'true';
  });
  const [maskPasswords, setMaskPasswords] = useState<boolean>(false);

  const toggleHideCredentials = () => {
    triggerHaptic();
    setHideCredentials(prev => {
      const next = !prev;
      localStorage.setItem('gcs_hide_login_credentials', String(next));
      return next;
    });
  };

  // Siswa registration form state
  const [siswaForm, setSiswaForm] = useState({
    nama: '',
    nis: '',
    kelas: 'X RPL 1',
    jurusan: 'Rekayasa Perangkat Lunak',
    email: '',
    password: '',
  });

  // Guru registration form state
  const [guruForm, setGuruForm] = useState({
    nama: '',
    nip: '',
    mataPelajaran: 'Bahasa Inggris SMKN 1 Sidayu Kelas X',
    email: '',
    password: '',
  });

  // Translate Firebase error codes to helpful Indonesian messages
  const formatAuthError = (err: any): string => {
    const msg = err?.message || String(err);
    const code = err?.code || '';

    if (code === 'auth/invalid-credential' || msg.includes('invalid-credential')) {
      return 'Email atau password salah. Pastikan data akun yang Anda masukkan benar.';
    }
    if (code === 'auth/user-not-found' || msg.includes('user-not-found')) {
      return 'Akun belum terdaftar. Silakan hubungi Administrator SMKN 1 Sidayu atau daftar akun baru.';
    }
    if (code === 'auth/wrong-password' || msg.includes('wrong-password')) {
      return 'Password yang dimasukkan tidak cocok. Periksa kembali huruf besar/kecil.';
    }
    if (code === 'auth/email-already-in-use' || msg.includes('email-already-in-use')) {
      return 'Email ini sudah terdaftar. Silakan langsung masuk pada form login.';
    }
    if (code === 'auth/weak-password' || msg.includes('weak-password')) {
      return 'Password terlalu lemah. Masukkan minimal 6 karakter kombinasi huruf dan angka.';
    }
    if (code === 'auth/invalid-email' || msg.includes('invalid-email')) {
      return 'Format email tidak valid. Masukkan alamat email yang benar (contoh: nama@smkn1sidayu.sch.id).';
    }
    if (code === 'auth/too-many-requests' || msg.includes('too-many-requests')) {
      return 'Terlalu banyak percobaan gagal. Demi keamanan, akun ditangguhkan sementara. Coba beberapa saat lagi.';
    }
    return 'Terjadi kendala otentikasi: ' + (msg || 'Periksa koneksi internet Anda.');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    let email = loginEmail.trim();
    const pass = loginPassword.trim();

    // Friendly smart aliases so typing 'admin' or 'heru' automatically maps to Super Admin
    const lower = email.toLowerCase();
    if (lower === 'admin' || lower === 'administrator' || lower === 'heru' || lower.startsWith('heru@') || lower === 'admin@smkn1sidayu.sch.id') {
      email = SUPER_ADMIN_EMAIL;
    } else if (lower === 'guru' || lower === 'bambang' || lower.startsWith('bambang@')) {
      email = 'bambang.guru@smkn1sidayu.sch.id';
    } else if (lower === 'siswa' || lower === 'rizky' || lower.startsWith('rizky@')) {
      email = 'rizky.siswa@smkn1sidayu.sch.id';
    }

    if (!email.includes('@')) {
      setErrorMessage('Format email tidak valid. Masukkan alamat email lengkap (contoh: heru@smanike-gresik.sch.id atau username: admin).');
      setLoading(false);
      return;
    }

    if (pass.length < 3) {
      setErrorMessage('Password minimal 3 karakter.');
      setLoading(false);
      return;
    }

    try {
      await login(email, pass, rememberMe);
    } catch (err: any) {
      console.warn('Login error:', err);
      setErrorMessage(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSiswaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!siswaForm.nama.trim() || !siswaForm.nis.trim()) {
      setErrorMessage('Nama lengkap dan NIS wajib diisi.');
      setLoading(false);
      return;
    }

    if (siswaForm.password.length < 6) {
      setErrorMessage('Password keamanan minimal 6 karakter.');
      setLoading(false);
      return;
    }

    try {
      await registerSiswa({
        nama: siswaForm.nama,
        nis: siswaForm.nis,
        kelas: siswaForm.kelas,
        jurusan: siswaForm.jurusan,
        email: siswaForm.email,
        pass: siswaForm.password,
      });
      setSuccessMessage('Akun siswa berhasil dibuat! Anda langsung terhubung ke sistem.');
    } catch (err: any) {
      console.warn('Register siswa error:', err);
      setErrorMessage(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterGuruSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!guruForm.nama.trim() || !guruForm.nip.trim()) {
      setErrorMessage('Nama lengkap dan NIP pengampu wajib diisi.');
      setLoading(false);
      return;
    }

    if (guruForm.password.length < 6) {
      setErrorMessage('Password keamanan minimal 6 karakter.');
      setLoading(false);
      return;
    }

    try {
      await registerGuru({
        nama: guruForm.nama,
        nip: guruForm.nip,
        mataPelajaran: guruForm.mataPelajaran,
        email: guruForm.email,
        pass: guruForm.password,
      });
      setSuccessMessage('Akun guru berhasil dibuat! Anda langsung terhubung ke sistem.');
    } catch (err: any) {
      console.warn('Register guru error:', err);
      setErrorMessage(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    triggerHaptic();
    setLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle('siswa');
    } catch (err: any) {
      if (!err.message?.includes('popup-closed-by-user')) {
        setErrorMessage(formatAuthError(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30 ring-2 ring-indigo-400/40 animate-bounce">
            <Gamepad2 className="w-9 h-9 text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <School className="w-3.5 h-3.5 text-emerald-400" />
              SMKN 1 Sidayu • Kurikulum Merdeka Fase E
            </div>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight mt-2">
              Grammar Challenge X
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              Pintu Masuk Terpadu (Satu Pintu) untuk Administrator, Guru, dan Siswa
            </p>
          </div>
        </div>

        {/* Auth Box Container */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
          {/* Header Switcher: Login Satu Pintu vs Pendaftaran Akun */}
          <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-800/90 border border-slate-700">
            <button
              onClick={() => { triggerHaptic(); setMode('login'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`flex-1 py-2.5 rounded-xl font-heading font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-95 touch-manipulation ${
                mode === 'login'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Login Satu Pintu (Semua Role)
            </button>
            <button
              onClick={() => { triggerHaptic(); setMode('register'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`flex-1 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-95 touch-manipulation ${
                mode === 'register'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Daftar Akun Baru
            </button>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500 text-rose-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500 text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* FORM: SATU PINTU LOGIN (UNTUK ADMIN, GURU, DAN SISWA) */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200">
                <span className="font-bold text-white">Satu Pintu Masuk:</span> Masukkan email dan password akun Anda. Sistem otomatis mengenali hak akses Anda sebagai <span className="text-rose-400 font-bold">Admin</span>, <span className="text-amber-400 font-bold">Guru</span>, atau <span className="text-emerald-400 font-bold">Siswa</span>.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Email Akun SMKN 1 Sidayu
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="email@smkn1sidayu.sch.id atau email Anda"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Password Keamanan
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan password Anda..."
                    className="w-full pl-11 pr-12 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0"
                  />
                  <span>Ingat Saya (Sesi Persisten)</span>
                </label>
                <span className="text-slate-500">
                  SMKN 1 Sidayu Secure Portal
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white font-heading font-black text-sm sm:text-base shadow-xl shadow-indigo-600/30 active:scale-95 transition flex items-center justify-center gap-2 touch-manipulation cursor-pointer"
              >
                {loading ? 'Memverifikasi Kredensial...' : 'Masuk ke Sistem (Satu Pintu)'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 my-2">
                <div className="h-px bg-slate-800 flex-1" />
                <span className="text-[11px] text-slate-500 uppercase font-bold">atau</span>
                <div className="h-px bg-slate-800 flex-1" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2.5 transition active:scale-95 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Masuk dengan Akun Google / Akun Belajar.id
              </button>

              {/* Menu Sembunyikan / Tampilkan Kredensial Akun (Mode Aman Layar IFP / Proyektor) */}
              <div className="mt-4">
                {hideCredentials ? (
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2.5 transition">
                    <div className="flex items-center gap-2 text-xs">
                      <EyeOff className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Bantuan kredensial login disembunyikan (Mode Privasi Layar).</span>
                    </div>
                    <button
                      type="button"
                      onClick={toggleHideCredentials}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-slate-700 active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Tampilkan Kredensial
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-[11px] space-y-2.5 text-slate-300 transition animate-in fade-in">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/50 pb-2">
                      <div className="flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="font-bold text-white">
                          Kredensial Akun SMKN 1 Sidayu:
                        </span>
                      </div>

                      {/* Menu Kontrol Privasi Kredensial */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => { triggerHaptic(); setMaskPasswords(!maskPasswords); }}
                          className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700 flex items-center gap-1 transition cursor-pointer active:scale-95"
                          title={maskPasswords ? 'Buka sensor teks password' : 'Bintang-bintangkan teks password'}
                        >
                          {maskPasswords ? <Eye className="w-3 h-3 text-amber-400" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
                          {maskPasswords ? 'Buka Password' : 'Sensor Password'}
                        </button>

                        <button
                          type="button"
                          onClick={toggleHideCredentials}
                          className="px-2.5 py-1 rounded-xl bg-rose-950/50 hover:bg-rose-900/70 text-rose-300 hover:text-rose-200 text-[10px] font-bold border border-rose-800/60 flex items-center gap-1 transition cursor-pointer active:scale-95"
                          title="Sembunyikan kotak kredensial ini sepenuhnya"
                        >
                          <EyeOff className="w-3 h-3 text-rose-400" />
                          Sembunyikan Kredensial
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[10px]">
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic();
                          setLoginEmail('heru@smanike-gresik.sch.id');
                          setLoginPassword('AdminSMK2026!');
                          setErrorMessage(null);
                        }}
                        className="p-2.5 rounded-xl bg-slate-900 border border-rose-500/40 hover:border-rose-400 hover:bg-slate-800/80 transition text-left cursor-pointer active:scale-95 group"
                      >
                        <span className="text-rose-400 font-bold block flex items-center justify-between">
                          <span>👑 Administrator</span>
                          <span className="text-[9px] text-rose-300 opacity-0 group-hover:opacity-100 transition">Pilih</span>
                        </span>
                        <span className="text-slate-300 block truncate">heru@smanike-gresik.sch.id</span>
                        <span className="text-slate-400 block font-sans">
                          Pass: {maskPasswords ? '••••••••••••' : 'AdminSMK2026!'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic();
                          setLoginEmail('bambang.guru@smkn1sidayu.sch.id');
                          setLoginPassword('GuruSMK2026!');
                          setErrorMessage(null);
                        }}
                        className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/40 hover:border-amber-400 hover:bg-slate-800/80 transition text-left cursor-pointer active:scale-95 group"
                      >
                        <span className="text-amber-400 font-bold block flex items-center justify-between">
                          <span>👨‍🏫 Guru Pengampu</span>
                          <span className="text-[9px] text-amber-300 opacity-0 group-hover:opacity-100 transition">Pilih</span>
                        </span>
                        <span className="text-slate-300 block truncate">bambang.guru@smkn1sidayu.sch.id</span>
                        <span className="text-slate-400 block font-sans">
                          Pass: {maskPasswords ? '••••••••••••' : 'GuruSMK2026!'}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic();
                          setLoginEmail('rizky.siswa@smkn1sidayu.sch.id');
                          setLoginPassword('SiswaSMK2026!');
                          setErrorMessage(null);
                        }}
                        className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 hover:border-emerald-400 hover:bg-slate-800/80 transition text-left cursor-pointer active:scale-95 group"
                      >
                        <span className="text-emerald-400 font-bold block flex items-center justify-between">
                          <span>🎒 Siswa Kelas X</span>
                          <span className="text-[9px] text-emerald-300 opacity-0 group-hover:opacity-100 transition">Pilih</span>
                        </span>
                        <span className="text-slate-300 block truncate">rizky.siswa@smkn1sidayu.sch.id</span>
                        <span className="text-slate-400 block font-sans">
                          Pass: {maskPasswords ? '••••••••••••' : 'SiswaSMK2026!'}
                        </span>
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-400 text-center italic">
                      Tip: Klik salah satu kartu di atas untuk mengisi formulir satu pintu secara otomatis.
                    </p>
                  </div>
                )}
              </div>
            </form>
          )}

          {/* FORM: PENDAFTARAN AKUN BARU (JIKA DIPERLUKAN) */}
          {mode === 'register' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRegisterRole('siswa')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    registerRole === 'siswa'
                      ? 'bg-emerald-600 text-white border-emerald-400'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Daftar Sebagai Siswa
                </button>
                <button
                  type="button"
                  onClick={() => setRegisterRole('guru')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition ${
                    registerRole === 'guru'
                      ? 'bg-amber-500 text-slate-950 border-amber-400 font-heading font-black'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Daftar Sebagai Guru
                </button>
              </div>

              {registerRole === 'siswa' ? (
                <form onSubmit={handleRegisterSiswaSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Nama Lengkap Siswa</label>
                    <input
                      type="text"
                      required
                      value={siswaForm.nama}
                      onChange={e => setSiswaForm({ ...siswaForm, nama: e.target.value })}
                      placeholder="Contoh: Muhammad Akbar"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 uppercase mb-1">NIS</label>
                      <input
                        type="text"
                        required
                        value={siswaForm.nis}
                        onChange={e => setSiswaForm({ ...siswaForm, nis: e.target.value })}
                        placeholder="232410145"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 uppercase mb-1">Kelas</label>
                      <select
                        value={siswaForm.kelas}
                        onChange={e => setSiswaForm({ ...siswaForm, kelas: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                      >
                        {['X RPL 1', 'X RPL 2', 'X TKJ 1', 'X TKJ 2', 'X AKL 1', 'X AKL 2', 'X Otomotif 1', 'X DPIB 1', 'X Kuliner 1', 'X DKV 1'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Jurusan / Konsentrasi Keahlian</label>
                    <input
                      type="text"
                      required
                      value={siswaForm.jurusan}
                      onChange={e => setSiswaForm({ ...siswaForm, jurusan: e.target.value })}
                      placeholder="Contoh: Rekayasa Perangkat Lunak"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Email Siswa SMKN 1 Sidayu</label>
                    <input
                      type="email"
                      required
                      value={siswaForm.email}
                      onChange={e => setSiswaForm({ ...siswaForm, email: e.target.value })}
                      placeholder="siswa@smkn1sidayu.sch.id"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Password Keamanan</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={siswaForm.password}
                      onChange={e => setSiswaForm({ ...siswaForm, password: e.target.value })}
                      placeholder="Minimal 6 karakter"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 mt-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-black text-sm shadow-xl active:scale-95 transition"
                  >
                    {loading ? 'Mendaftarkan Akun Siswa...' : 'Daftar Sebagai Siswa Baru'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegisterGuruSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Nama Lengkap & Gelar</label>
                    <input
                      type="text"
                      required
                      value={guruForm.nama}
                      onChange={e => setGuruForm({ ...guruForm, nama: e.target.value })}
                      placeholder="Contoh: Budi Santoso, S.Pd."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-300 uppercase mb-1">NIP / NUPTK</label>
                      <input
                        type="text"
                        required
                        value={guruForm.nip}
                        onChange={e => setGuruForm({ ...guruForm, nip: e.target.value })}
                        placeholder="19850412 201001 1 008"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-300 uppercase mb-1">Mata Pelajaran</label>
                      <input
                        type="text"
                        required
                        value={guruForm.mataPelajaran}
                        onChange={e => setGuruForm({ ...guruForm, mataPelajaran: e.target.value })}
                        placeholder="Bahasa Inggris SMKN 1 Sidayu Kelas X"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Email Resmi Guru SMKN 1 Sidayu</label>
                    <input
                      type="email"
                      required
                      value={guruForm.email}
                      onChange={e => setGuruForm({ ...guruForm, email: e.target.value })}
                      placeholder="guru@smkn1sidayu.sch.id"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase mb-1">Password Keamanan</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={guruForm.password}
                      onChange={e => setGuruForm({ ...guruForm, password: e.target.value })}
                      placeholder="Minimal 6 karakter"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 mt-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-heading font-black text-sm shadow-xl active:scale-95 transition"
                  >
                    {loading ? 'Mendaftarkan Akun Guru...' : 'Daftar Sebagai Guru'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
