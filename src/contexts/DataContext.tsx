'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockCourses as initialCourses } from '@/lib/mockData';
import { USERS_DB } from './AuthContext';
import { User } from './AuthContext';

export interface Course {
  id: string;
  titleEn: string;
  titleTr: string;
  instructor: string;
  thumbnail: string;
  price: number;
  rating: number;
  duration: string;
  lessonCount: number;
  instrument: string;
  difficulty: string;
  language: string;
  status?: 'approved' | 'pending';
}

interface DataContextType {
  courses: Course[];
  users: User[];
  approveCourse: (courseId: string) => void;
  updateUserRole: (userId: string, newRole: 'STUDENT' | 'INSTRUCTOR') => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Initialize courses with status: 'approved', and add one mock pending course
  const [courses, setCourses] = useState<Course[]>([
    ...initialCourses.map(c => ({ ...c, status: 'approved' as const })),
    {
      id: 'c5_pending',
      titleEn: 'Slap Bass Fundamentals',
      titleTr: 'Slap Bas Temelleri',
      instructor: 'Batuhan Akyazı',
      thumbnail: '/images/acoustic_guitar.png', // Reusing image for MVP
      price: 19.99,
      rating: 0,
      duration: '2h 0m',
      lessonCount: 10,
      instrument: 'Bass',
      difficulty: 'Beginner',
      language: 'TR',
      status: 'pending'
    }
  ]);

  const [users, setUsers] = useState<User[]>(Object.values(USERS_DB).map(record => record.user));

  const approveCourse = (courseId: string) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: 'approved' } : c));
  };

  const updateUserRole = (userId: string, newRole: 'STUDENT' | 'INSTRUCTOR') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    
    // Note: Since AuthContext checks USERS_DB on login, ideally this state should be unified or 
    // AuthContext should read from DataContext. For MVP interactive display in admin panel, this is sufficient.
    // If the user logs out and in again, it will reset unless we mutate USERS_DB.
    // We can directly mutate the exported USERS_DB object so it persists across logouts in this MVP session!
    const username = Object.keys(USERS_DB).find(key => USERS_DB[key].user.id === userId);
    if (username) {
      USERS_DB[username].user.role = newRole;
    }
  };

  return (
    <DataContext.Provider value={{ courses, users, approveCourse, updateUserRole }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
