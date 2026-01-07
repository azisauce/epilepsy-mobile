import { createContext, useContext, useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth';
import { login as loginService, register as registerService, logout as logoutService, getUserProfile } from '../services/auth.service';
import { User } from '../types/user.types';
import { logger } from '../utils/logger';

interface AuthContextType {
  user: any | null;             // Firebase user
  profile: User | null;         // Firestore user profile
  loading: boolean;             // true while checking auth status
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase authentication state
  useEffect(() => {
    console.log('🔐 Setting up Firebase auth state listener');
    const sub = auth().onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          console.log('✅ User authenticated:', firebaseUser.email, 'UID:', firebaseUser.uid);
          setUser(firebaseUser);

          console.log('📖 Fetching user profile from Firestore');
          const profileData = await getUserProfile(firebaseUser.uid);
          if (profileData) {
            console.log('✅ User profile loaded:', profileData.firstName, profileData.lastName);
            setProfile(profileData);
          } else {
            console.warn('⚠️ User profile not found in Firestore');
            setProfile(null);
          }
        } else {
          console.log('🚪 No user authenticated');
          setUser(null);
          setProfile(null);
        }
      } catch (error: any) {
        console.error('❌ Error in auth state change:', error);
        console.error('Error message:', error.message);
      } finally {
        setLoading(false);
      }
    });

    return sub;
  }, []);

  // Auth functions
  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login for:', email);
      await loginService({ email, password });
      console.log('✅ Login successful');
    } catch (error: any) {
      console.error('❌ Login failed:', error.message);
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      console.log('🔐 Attempting registration for:', data.email);
      const newUser = await registerService(data);
      console.log('✅ Registration successful');
      setProfile(newUser);
    } catch (error: any) {
      console.error('❌ Registration failed:', error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('🔐 Attempting logout');
      await logoutService();
      console.log('✅ Logout successful');
    } catch (error: any) {
      console.error('❌ Logout failed:', error.message);
      throw error;
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
