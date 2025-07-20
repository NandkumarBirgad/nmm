import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'patient' | 'doctor';
  avatar?: string;
  specialization?: string;
}

interface AuthContextType {
  user: User | null;
  userType: 'patient' | 'doctor';
  login: (email: string, password: string, type: 'patient' | 'doctor') => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, type: 'patient' | 'doctor', specialization?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<'patient' | 'doctor'>('patient');

  const login = async (email: string, password: string, type: 'patient' | 'doctor') => {
    // Mock authentication - in real app, this would call your backend
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: type === 'doctor' ? 'Dr. Sarah Johnson' : 'John Doe',
      email,
      type,
      avatar: `https://images.pexels.com/photos/${type === 'doctor' ? '5998474' : '5668858'}/pexels-photo-${type === 'doctor' ? '5998474' : '5668858'}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`,
      specialization: type === 'doctor' ? 'Internal Medicine' : undefined
    };
    
    setUser(mockUser);
    setUserType(type);
  };

  const register = async (name: string, email: string, password: string, type: 'patient' | 'doctor', specialization?: string) => {
    // Mock registration
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      type,
      avatar: `https://images.pexels.com/photos/${type === 'doctor' ? '5998474' : '5668858'}/pexels-photo-${type === 'doctor' ? '5998474' : '5668858'}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2`,
      specialization: type === 'doctor' ? specialization : undefined
    };
    
    setUser(mockUser);
    setUserType(type);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, userType, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext }