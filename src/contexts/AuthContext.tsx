'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'STUDENT' | 'INSTRUCTOR' | 'GUEST';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  isAdmin?: boolean;
}

export const USERS_DB: Record<string, { password: string; user: User }> = {
  'ahmet.yilmaz': {
    password: '123456',
    user: { id: 'student-1', name: 'Ahmet Yılmaz', email: 'ahmet@example.com', role: 'STUDENT', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmet' }
  },
  'ayse.demir': {
    password: '123456',
    user: { id: 'student-2', name: 'Ayşe Demir', email: 'ayse@example.com', role: 'STUDENT', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ayse' }
  },
  'mehmet.kaya': {
    password: '123456',
    user: { id: 'student-3', name: 'Mehmet Kaya', email: 'mehmet@example.com', role: 'STUDENT', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mehmet' }
  },
  'jenar.kinik01': {
    password: '013169',
    user: { id: 'instructor-1', name: 'Jenar Kınık', email: 'jenar@example.com', role: 'INSTRUCTOR', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jenar' }
  },
  'jarl.erdem': {
    password: '013169',
    user: { id: 'instructor-2', name: 'Jarl Erdem', email: 'jarl@example.com', role: 'INSTRUCTOR', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jarl' }
  },
  'bakugan': {
    password: '013169',
    user: { id: 'admin-1', name: 'Batuhan Akyazı', email: 'admin@example.com', role: 'INSTRUCTOR', isAdmin: true, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bakugan' }
  }
};

interface AuthContextType {
  user: User | null;
  role: Role;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string) => {
    const record = USERS_DB[username];
    if (record && record.password === password) {
      setUser(record.user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || 'GUEST', login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
