import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, User, ProfessionalType } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: 'client' | 'professional',
    professionalType?: ProfessionalType
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const userData = await api.getProfile();
      setUser(userData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      api.clearToken();
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: 'client' | 'professional',
    professionalType?: ProfessionalType
  ) => {
    const { user: userData } = await api.register({
      email,
      password,
      fullName,
      role,
      professionalType: role === 'professional' ? professionalType : undefined,
    });
    setUser(userData);
  };

  const signIn = async (email: string, password: string) => {
    const { user: userData } = await api.login(email, password);
    setUser(userData);
  };

  const signOut = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
