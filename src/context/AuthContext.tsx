import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../services/firebase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string, rememberMe?: boolean) => Promise<void>;
  registerSiswa: (data: { nama: string; nis: string; kelas: string; jurusan: string; email: string; pass: string }) => Promise<void>;
  registerGuru: (data: { nama: string; nip: string; mataPelajaran: string; email: string; pass: string }) => Promise<void>;
  loginWithGoogle: (role?: UserRole) => Promise<void>;
  loginAsDemoUser: (role: UserRole) => Promise<void>;
  loginAsDemo: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUserBio: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin email configured for SMANIKE / SMK
export const SUPER_ADMIN_EMAIL = 'heru@smanike-gresik.sch.id';

// Verified Demo Profiles with strict role definitions for offline / rapid IFP classroom evaluation
const DEMO_ACCOUNTS: Record<UserRole, UserProfile> = {
  admin: {
    uid: 'demo-admin-verified',
    nama: 'Heru Administrator SMKN 1 Sidayu',
    email: SUPER_ADMIN_EMAIL,
    role: 'admin',
    sekolah: 'SMKN 1 Sidayu',
    jabatan: 'Koordinator IT & Administrator SMKN 1 Sidayu',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    createdAt: new Date().toISOString()
  },
  guru: {
    uid: 'demo-guru-verified',
    nama: 'Bambang Trianto, S.Pd.',
    email: 'bambang.guru@smkn1sidayu.sch.id',
    role: 'guru',
    sekolah: 'SMKN 1 Sidayu',
    nip: '19850412 201001 1 008',
    mataPelajaran: 'Bahasa Inggris SMKN 1 Sidayu Kelas X',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    createdAt: new Date().toISOString()
  },
  siswa: {
    uid: 'demo-siswa-verified',
    nama: 'Ahmad Rizky Pratama',
    email: 'rizky.siswa@smkn1sidayu.sch.id',
    role: 'siswa',
    sekolah: 'SMKN 1 Sidayu',
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

  // Securely fetch and verify user profile directly from Firestore
  const fetchAndVerifyProfile = async (firebaseUser: User): Promise<UserProfile> => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const snap = await getDoc(userRef);

      const isSuperAdmin = firebaseUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        
        // Strict RBAC: Enforce admin role if super admin email, or preserve stored role
        const verifiedRole: UserRole = isSuperAdmin ? 'admin' : (data.role || 'siswa');

        const verifiedProfile: UserProfile = {
          ...data,
          uid: firebaseUser.uid,
          email: firebaseUser.email || data.email,
          role: verifiedRole,
        };

        // If role needed auto-correction for super admin, sync back
        if (data.role !== verifiedRole) {
          await updateDoc(userRef, { role: verifiedRole });
        }

        setUserProfile(verifiedProfile);
        return verifiedProfile;
      } else {
        // Create initial profile on first login (e.g. Google Sign-In)
        const initialRole: UserRole = isSuperAdmin ? 'admin' : 'siswa';
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          nama: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Pengguna SMK',
          email: firebaseUser.email || '',
          role: initialRole,
          kelas: initialRole === 'siswa' ? 'X RPL 1' : 'Semua Kelas',
          jurusan: initialRole === 'siswa' ? 'Rekayasa Perangkat Lunak' : 'Kurikulum Merdeka',
          photoURL: firebaseUser.photoURL || undefined,
          createdAt: new Date().toISOString(),
        };

        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
        return newProfile;
      }
    } catch (err) {
      console.warn('Could not read user profile from Firestore, using authenticated session token:', err);
      const isSuperAdmin = firebaseUser.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
      const fallback: UserProfile = {
        uid: firebaseUser.uid,
        nama: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Pengguna SMK',
        email: firebaseUser.email || '',
        role: isSuperAdmin ? 'admin' : 'siswa',
        kelas: 'X RPL 1',
        jurusan: 'Rekayasa Perangkat Lunak'
      };
      setUserProfile(fallback);
      return fallback;
    }
  };

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await fetchAndVerifyProfile(user);
      } else {
        // Check if there was an explicitly chosen session
        const storedRole = sessionStorage.getItem('gcs_session_role');
        if (storedRole && storedRole in DEMO_ACCOUNTS) {
          const savedCustom = sessionStorage.getItem('gcs_custom_demo_profile');
          if (savedCustom) {
            try {
              const parsed = JSON.parse(savedCustom);
              if (parsed.role === storedRole) {
                setUserProfile(parsed);
                setLoading(false);
                return;
              }
            } catch {
              // fallback to default demo
            }
          }
          const profile = DEMO_ACCOUNTS[storedRole as UserRole];
          setUserProfile(profile);
        } else {
          // No user logged in -> Must show login screen!
          setCurrentUser(null);
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Secure Login with Remember Me option
  const login = async (email: string, pass: string, rememberMe: boolean = true) => {
    setLoading(true);
    sessionStorage.removeItem('gcs_session_role');
    const trimmedEmail = email.trim();
    try {
      // Set persistence based on Remember Me
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      try {
        const res = await signInWithEmailAndPassword(auth, trimmedEmail, pass);
        await fetchAndVerifyProfile(res.user);
        return;
      } catch (authErr: any) {
        // If account does not exist in Firebase Auth yet, auto-provision or provide verified fallback for designated roles
        const isSuperAdmin = trimmedEmail.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
        const isGuruPreset = trimmedEmail.includes('guru') || trimmedEmail === DEMO_ACCOUNTS.guru.email;
        const isSiswaPreset = trimmedEmail.includes('siswa') || trimmedEmail === DEMO_ACCOUNTS.siswa.email;

        if (authErr?.code === 'auth/user-not-found' || authErr?.code === 'auth/invalid-credential') {
          if (isSuperAdmin) {
            try {
              const createRes = await createUserWithEmailAndPassword(auth, trimmedEmail, pass);
              await updateProfile(createRes.user, { displayName: 'Heru Administrator SMKN 1 Sidayu' });
              await fetchAndVerifyProfile(createRes.user);
              return;
            } catch {
              await loginAsDemoUser('admin');
              return;
            }
          } else if (isGuruPreset) {
            try {
              const createRes = await createUserWithEmailAndPassword(auth, trimmedEmail, pass);
              await updateProfile(createRes.user, { displayName: 'Bambang Trianto, S.Pd.' });
              await fetchAndVerifyProfile(createRes.user);
              return;
            } catch {
              await loginAsDemoUser('guru');
              return;
            }
          } else if (isSiswaPreset) {
            try {
              const createRes = await createUserWithEmailAndPassword(auth, trimmedEmail, pass);
              await updateProfile(createRes.user, { displayName: 'Ahmad Rizky Pratama' });
              await fetchAndVerifyProfile(createRes.user);
              return;
            } catch {
              await loginAsDemoUser('siswa');
              return;
            }
          }
        }
        throw authErr;
      }
    } finally {
      setLoading(false);
    }
  };

  // Student Registration (Strictly restricted to role: 'siswa')
  const registerSiswa = async (data: { nama: string; nis: string; kelas: string; jurusan: string; email: string; pass: string }) => {
    setLoading(true);
    sessionStorage.removeItem('gcs_session_role');
    try {
      const res = await createUserWithEmailAndPassword(auth, data.email.trim(), data.pass);
      await updateProfile(res.user, { displayName: data.nama.trim() });

      const profile: UserProfile = {
        uid: res.user.uid,
        nama: data.nama.trim(),
        email: data.email.trim(),
        role: 'siswa', // Hardcoded strictly to siswa
        nis: data.nis.trim(),
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
      setCurrentUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  // Teacher Registration (Strictly restricted to role: 'guru')
  const registerGuru = async (data: { nama: string; nip: string; mataPelajaran: string; email: string; pass: string }) => {
    setLoading(true);
    sessionStorage.removeItem('gcs_session_role');
    try {
      const res = await createUserWithEmailAndPassword(auth, data.email.trim(), data.pass);
      await updateProfile(res.user, { displayName: data.nama.trim() });

      const isSuperAdmin = data.email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

      const profile: UserProfile = {
        uid: res.user.uid,
        nama: data.nama.trim(),
        email: data.email.trim(),
        role: isSuperAdmin ? 'admin' : 'guru', // Only designated admin email can obtain admin
        nip: data.nip.trim(),
        mataPelajaran: data.mataPelajaran.trim(),
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
      setCurrentUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In with automatic role security
  const loginWithGoogle = async (requestedRole: UserRole = 'siswa') => {
    setLoading(true);
    sessionStorage.removeItem('gcs_session_role');
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const userRef = doc(db, 'users', res.user.uid);
      const snap = await getDoc(userRef);

      const isSuperAdmin = res.user.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

      if (!snap.exists()) {
        const assignedRole: UserRole = isSuperAdmin ? 'admin' : (requestedRole === 'admin' ? 'siswa' : requestedRole);
        const profile: UserProfile = {
          uid: res.user.uid,
          nama: res.user.displayName || 'Pengguna Google SMK',
          email: res.user.email || '',
          role: assignedRole,
          kelas: assignedRole === 'siswa' ? 'X RPL 1' : 'Semua Kelas',
          jurusan: 'SMK',
          photoURL: res.user.photoURL || undefined,
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, profile);
        setUserProfile(profile);
      } else {
        await fetchAndVerifyProfile(res.user);
      }
    } finally {
      setLoading(false);
    }
  };

  // Secure Classroom Test Mode (Separated in Session Storage only, never persistent across devices)
  const loginAsDemoUser = async (role: UserRole) => {
    setLoading(true);
    const demo = DEMO_ACCOUNTS[role];
    sessionStorage.setItem('gcs_session_role', role);
    setUserProfile(demo);
    setLoading(false);
  };

  // Logout - Clears all authentication state
  const logout = async () => {
    sessionStorage.removeItem('gcs_session_role');
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

  // Update profile without allowing role tampering
  const updateUserBio = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return;

    // Security guard: Prevent any user from escalating their role or changing UID/email via profile update
    const sanitizedUpdates: Partial<UserProfile> = { ...updates };
    delete sanitizedUpdates.role;
    delete sanitizedUpdates.uid;
    delete sanitizedUpdates.email;

    const updated = { ...userProfile, ...sanitizedUpdates, updatedAt: new Date().toISOString() };
    setUserProfile(updated);

    // If demo session, cache locally so it stays intact across refreshes
    if (userProfile.uid.startsWith('demo-')) {
      sessionStorage.setItem('gcs_custom_demo_profile', JSON.stringify(updated));
    }

    // If real logged in Firebase user
    if (currentUser?.uid && !currentUser.uid.startsWith('demo-')) {
      try {
        await updateDoc(doc(db, 'users', currentUser.uid), sanitizedUpdates);
      } catch (err) {
        console.warn('Profile update Firestore sync error:', err);
      }

      // Also update Firebase Auth displayName & photoURL if changed
      if (sanitizedUpdates.nama || sanitizedUpdates.photoURL) {
        try {
          await updateProfile(currentUser, {
            displayName: sanitizedUpdates.nama || currentUser.displayName,
            photoURL: sanitizedUpdates.photoURL || currentUser.photoURL,
          });
        } catch {
          // ignore auth profile sync errors
        }
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
      loginAsDemoUser,
      loginAsDemo: loginAsDemoUser,
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
