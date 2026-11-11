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
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useIFP } from '../context/IFPContext';
import { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const { login, registerSiswa, registerGuru, loginWithGoogle, loginAsDemo } = useAuth();
  const { triggerHaptic } = useIFP();

  const [mode, setMode] = useState<'login' | 'reg_siswa' | 'reg_guru'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

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
    mataPelajaran: 'Bahasa Inggris SMK Kelas X',
    email: '',
    password: '',
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();
    setLoading(true);
    setErrorMessage(null);

    try {
      await login(loginEmail, loginPassword);
    } catch (err: any) {
      console.warn('Login error:', err);
      setErrorMessage(
        err.message?.includes('invalid-credential') || err.message?.includes('user-not-found')
          ? 'Email atau password tidak sesuai. Anda juga dapat menggunakan tombol Demo Login di bawah.'
          : 'Gagal masuk: ' + (err.message || 'Periksa koneksi Anda.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSiswaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();
    setLoading(true);
    setErrorMessage(null);

    try {
      await registerSiswa({
        nama: siswaForm.nama,
        nis: siswaForm.nis,
        kelas: siswaForm.kelas,
        jurusan: siswaForm.jurusan,
        email: siswaForm.email,
        pass: siswaForm.password,
      });
    } catch (err: any) {
      console.warn('Register siswa error:', err);
      setErrorMessage('Pendaftaran siswa gagal: ' + (err.message || 'Coba gunakan email lain.'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterGuruSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();
    setLoading(true);
    setErrorMessage(null);

    try {
      await registerGuru({
        nama: guruForm.nama,
        nip: guruForm.nip,
        mataPelajaran: guruForm.mataPelajaran,
        email: guruForm.email,
        pass: guruForm.password,
      });
    } catch (err: any) {
      console.warn('Register guru error:', err);
      setErrorMessage('Pendaftaran guru gagal: ' + (err.message || 'Coba gunakan email lain.'));
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
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              Kurikulum Merdeka • SMK Kelas X
            </span>
            <h1 className="font-heading font-black text-3xl sm:text-4xl text-white tracking-tight mt-2">
              Grammar Challenge X
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Portal Game Interaktif Papan Layar Sentuh & Proyektor Vokasi
            </p>
          </div>
        </div>

        {/* Auth Box Container */}
        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
          {/* Tabs: Login / Daftar Siswa / Daftar Guru */}
          <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-slate-800/90 border border-slate-700">
            <button
              onClick={() => { triggerHaptic(); setMode('login'); setErrorMessage(null); }}
              className={`py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all active:scale-95 touch-manipulation ${
                mode === 'login'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => { triggerHaptic(); setMode('reg_siswa'); setErrorMessage(null); }}
              className={`py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all active:scale-95 touch-manipulation ${
                mode === 'reg_siswa'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Daftar Siswa
            </button>
            <button
              onClick={() => { triggerHaptic(); setMode('reg_guru'); setErrorMessage(null); }}
              className={`py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all active:scale-95 touch-manipulation ${
                mode === 'reg_guru'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Daftar Guru
            </button>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500 text-rose-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* FORM 1: LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Email Akun
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="nama@smk.sch.id"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
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
                  <span>Ingat Saya (Remember Me)</span>
                </label>
                <span className="text-indigo-400 cursor-pointer hover:underline">Lupa Password?</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:brightness-110 text-white font-heading font-black text-sm sm:text-base shadow-xl shadow-indigo-600/30 active:scale-95 transition flex items-center justify-center gap-2 touch-manipulation"
              >
                {loading ? 'Memproses Masuk...' : 'Masuk ke Aplikasi'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* FORM 2: REGISTRASI SISWA */}
          {mode === 'reg_siswa' && (
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
                  <label className="block font-bold text-slate-300 uppercase mb-1">NIS (Nomor Induk Siswa)</label>
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
                    {['X RPL 1', 'X RPL 2', 'X TKJ 1', 'X TKJ 2', 'X AKL 1', 'X Otomotif 1', 'X DPIB 1'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Jurusan / Keahlian</label>
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
                <label className="block font-bold text-slate-300 uppercase mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={siswaForm.email}
                  onChange={e => setSiswaForm({ ...siswaForm, email: e.target.value })}
                  placeholder="siswa@smk.sch.id"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Password</label>
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
                {loading ? 'Mendaftarkan...' : 'Daftar Sebagai Siswa Baru'}
              </button>
            </form>
          )}

          {/* FORM 3: REGISTRASI GURU */}
          {mode === 'reg_guru' && (
            <form onSubmit={handleRegisterGuruSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={guruForm.nama}
                  onChange={e => setGuruForm({ ...guruForm, nama: e.target.value })}
                  placeholder="Contoh: Budi Santoso, M.Pd."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">NIP (Nomor Induk Pegawai)</label>
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
                    placeholder="Bahasa Inggris SMK"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Email Sekolah</label>
                <input
                  type="email"
                  required
                  value={guruForm.email}
                  onChange={e => setGuruForm({ ...guruForm, email: e.target.value })}
                  placeholder="guru@smk.sch.id"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">Password</label>
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
                {loading ? 'Mendaftarkan...' : 'Daftar Sebagai Guru'}
              </button>
            </form>
          )}

          {/* Quick Demo Access for Interactive Flat Panel (IFP) Testing */}
          <div className="pt-3 border-t border-slate-800">
            <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 text-center mb-3">
              ⚡ Akses Demo Instan Layar Sentuh (Tanpa Mengetik)
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => { triggerHaptic(); loginAsDemo('siswa'); }}
                className="p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition flex flex-col items-center gap-1 active:scale-95 touch-manipulation"
              >
                <User className="w-5 h-5 text-emerald-400" />
                <span>Demo Siswa</span>
              </button>

              <button
                type="button"
                onClick={() => { triggerHaptic(); loginAsDemo('guru'); }}
                className="p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex flex-col items-center gap-1 active:scale-95 touch-manipulation"
              >
                <GraduationCap className="w-5 h-5 text-amber-400" />
                <span>Demo Guru</span>
              </button>

              <button
                type="button"
                onClick={() => { triggerHaptic(); loginAsDemo('admin'); }}
                className="p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition flex flex-col items-center gap-1 active:scale-95 touch-manipulation"
              >
                <ShieldCheck className="w-5 h-5 text-rose-400" />
                <span>Demo Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
