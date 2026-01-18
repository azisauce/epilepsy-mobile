import { createContext, useContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { login as loginService, register as registerService, logout as logoutService, getUserProfile } from '../services/auth.service';
import { User } from '../types/user.types';

interface AuthContextType {
  user: any | null;             // Firebase user
  profile: User | null;         // Firestore user profile
  loading: boolean;             // true while checking auth status
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;  // NEW: Manually refresh profile
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase authentication state
  useEffect(() => {
    const sub = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        const profileData = await getUserProfile(firebaseUser.uid);
        setProfile(profileData ?? null);
      } else {
        setUser(null);
        setProfile(null);
      }

      setLoading(false);
    });

    return sub;
  }, []);

  // Auth functions
  const login = async (email: string, password: string) => {
    await loginService({ email, password });
  };

  const register = async (data: any) => {
    const newUser = await registerService(data);
    setProfile(newUser);
  };

  const logout = async () => {
    await logoutService();
  };

  // NEW: Refresh profile from Firestore
  const refreshProfile = async () => {
    if (user) {
      console.log('[AUTH] Refreshing profile for user:', user.uid);
      const profileData = await getUserProfile(user.uid);
      setProfile(profileData ?? null);
      console.log('[AUTH] Profile refreshed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        login,
        register,
        logout,
        refreshProfile,  // NEW: Expose refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
