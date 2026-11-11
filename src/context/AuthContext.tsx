import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../services/firebase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  registerSiswa: (data: { nama: string; nis: string; kelas: string; jurusan: string; email: string; pass: string }) => Promise<void>;
  registerGuru: (data: { nama: string; nip: string; mataPelajaran: string; email: string; pass: string }) => Promise<void>;
  loginWithGoogle: (role?: UserRole) => Promise<void>;
  loginAsDemo: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUserBio: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default mock profiles for instant IFP classroom demonstration
const DEMO_PROFILES: Record<UserRole, UserProfile> = {
  admin: {
    uid: 'demo-admin-id',
    nama: 'Heru Administrator SMK',
    email: 'heru@smanike-gresik.sch.id',
    role: 'admin',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    createdAt: new Date().toISOString()
  },
  guru: {
    uid: 'demo-guru-id',
    nama: 'Bambang Trianto, S.Pd.',
    email: 'bambang.guru@smk.sch.id',
    role: 'guru',
    nip: '19850412 201001 1 008',
    mataPelajaran: 'Bahasa Inggris SMK Kelas X',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    createdAt: new Date().toISOString()
  },
  siswa: {
    uid: 'demo-siswa-id',
    nama: 'Ahmad Rizky Pratama',
    email: 'rizky.siswa@smk.sch.id',
    role: 'siswa',
    nis: '232410145',
    kelas: 'X RPL 1',
    jurusan: 'Rekayasa Perangkat Lunak',
    photoURL: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    createdAt: new Date().toISOString()
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync profile from Firestore or localStorage fallback
  const fetchProfile = async (firebaseUser: User) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        setUserProfile(snap.data() as UserProfile);
      } else {
        // Automatically give admin privileges to heru@smanike-gresik.sch.id or default to siswa
        const isAdminEmail = firebaseUser.email?.toLowerCase().includes('smanike') || 
                             firebaseUser.email?.toLowerCase() === 'heru@smanike-gresik.sch.id';
        const defaultRole: UserRole = isAdminEmail ? 'admin' : 'siswa';
        
        const initialProfile: UserProfile = {
          uid: firebaseUser.uid,
          nama: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Siswa SMK',
          email: firebaseUser.email || '',
          role: defaultRole,
          kelas: defaultRole === 'siswa' ? 'X RPL 1' : 'Semua Kelas',
          jurusan: defaultRole === 'siswa' ? 'RPL' : 'Kejuruan',
          photoURL: firebaseUser.photoURL || undefined,
          createdAt: new Date().toISOString(),
        };

        await setDoc(userRef, initialProfile);
        setUserProfile(initialProfile);
      }
    } catch (err) {
      console.warn('Could not read user profile from Firestore, using fallback:', err);
      // Construct fallback profile
      const fallback: UserProfile = {
        uid: firebaseUser.uid,
        nama: firebaseUser.displayName || firebaseUser.email || 'Pengguna SMK',
        email: firebaseUser.email || '',
        role: firebaseUser.email?.includes('admin') || firebaseUser.email?.includes('heru') ? 'admin' : 'siswa',
        kelas: 'X RPL 1',
        jurusan: 'Rekayasa Perangkat Lunak'
      };
      setUserProfile(fallback);
    }
  };

  useEffect(() => {
    const storedDemo = localStorage.getItem('gcs_demo_role');
    if (storedDemo && (storedDemo in DEMO_PROFILES)) {
      setUserProfile(DEMO_PROFILES[storedDemo as UserRole]);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchProfile(user);
      } else {
        // If no user is logged in, check if there's a stored role or default to demo siswa for instant play on touch screen
        const savedProfile = localStorage.getItem('gcs_active_profile');
        if (savedProfile) {
          try {
            setUserProfile(JSON.parse(savedProfile));
          } catch {
            setUserProfile(DEMO_PROFILES.siswa);
          }
        } else {
          // Provide default guest student session so interactive board can be tested instantly!
          setUserProfile(DEMO_PROFILES.siswa);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    localStorage.removeItem('gcs_demo_role');
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      await fetchProfile(res.user);
    } catch (err: unknown) {
      setLoading(false);
      throw err;
    }
  };

  const registerSiswa = async (data: { nama: string; nis: string; kelas: string; jurusan: string; email: string; pass: string }) => {
    setLoading(true);
    localStorage.removeItem('gcs_demo_role');
    try {
      const res = await createUserWithEmailAndPassword(auth, data.email, data.pass);
      await updateProfile(res.user, { displayName: data.nama });

      const profile: UserProfile = {
        uid: res.user.uid,
        nama: data.nama,
        email: data.email,
        role: 'siswa',
        nis: data.nis,
        kelas: data.kelas,
        jurusan: data.jurusan,
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'users', res.user.uid), profile);
      } catch (e) {
        handleFirestoreError(e, OperationType.CREATE, `users/${res.user.uid}`);
      }
      setUserProfile(profile);
    } finally {
      setLoading(false);
    }
  };

  const registerGuru = async (data: { nama: string; nip: string; mataPelajaran: string; email: string; pass: string }) => {
    setLoading(true);
    localStorage.removeItem('gcs_demo_role');
    try {
      const res = await createUserWithEmailAndPassword(auth, data.email, data.pass);
      await updateProfile(res.user, { displayName: data.nama });

      const profile: UserProfile = {
        uid: res.user.uid,
        nama: data.nama,
        email: data.email,
        role: 'guru',
        nip: data.nip,
        mataPelajaran: data.mataPelajaran,
        kelas: 'Semua Kelas',
        jurusan: 'Kurikulum Merdeka',
        createdAt: new Date().toISOString()
      };

      try {
        await setDoc(doc(db, 'users', res.user.uid), profile);
      } catch (e) {
        handleFirestoreError(e, OperationType.CREATE, `users/${res.user.uid}`);
      }
      setUserProfile(profile);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (role: UserRole = 'siswa') => {
    setLoading(true);
    localStorage.removeItem('gcs_demo_role');
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const userRef = doc(db, 'users', res.user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        const isAdmin = res.user.email === 'heru@smanike-gresik.sch.id';
        const profile: UserProfile = {
          uid: res.user.uid,
          nama: res.user.displayName || 'Pengguna Baru',
          email: res.user.email || '',
          role: isAdmin ? 'admin' : role,
          kelas: role === 'siswa' ? 'X RPL 1' : 'Semua Kelas',
          jurusan: 'SMK',
          photoURL: res.user.photoURL || undefined,
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, profile);
        setUserProfile(profile);
      } else {
        setUserProfile(snap.data() as UserProfile);
      }
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = async (role: UserRole) => {
    setLoading(true);
    const demo = DEMO_PROFILES[role];
    localStorage.setItem('gcs_demo_role', role);
    localStorage.setItem('gcs_active_profile', JSON.stringify(demo));
    setUserProfile(demo);
    setLoading(false);
  };

  const logout = async () => {
    localStorage.removeItem('gcs_demo_role');
    localStorage.removeItem('gcs_active_profile');
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setUserProfile(null);
    setCurrentUser(null);
  };

  const updateUserBio = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return;
    const updated = { ...userProfile, ...updates, updatedAt: new Date().toISOString() };
    setUserProfile(updated);
    localStorage.setItem('gcs_active_profile', JSON.stringify(updated));

    if (currentUser?.uid && !currentUser.uid.startsWith('demo-')) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), updates);
      } catch (err) {
        console.warn('Profile update Firestore sync error:', err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile,
      loading,
      login,
      registerSiswa,
      registerGuru,
      loginWithGoogle,
      loginAsDemo,
      logout,
      updateUserBio
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
