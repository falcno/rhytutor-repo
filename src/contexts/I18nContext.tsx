'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'EN' | 'TR';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  EN: {
    'nav.courses': 'Courses',
    'nav.myCourses': 'My Courses',
    'nav.dashboard': 'Dashboard',
    'nav.instructorPanel': 'Instructor Panel',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'home.hero.title': 'Master Your Instrument',
    'home.hero.subtitle': 'Learn from the best musicians in the world. Practice effectively. Get feedback.',
    'home.hero.cta': 'Start Learning',
    'course.start': 'Start Course',
    'course.purchase': 'Purchase Course',
    'course.price': 'Price',
    'course.instructor': 'Instructor',
    'course.duration': 'Duration',
    'dashboard.student.title': 'Student Dashboard',
    'dashboard.instructor.title': 'Instructor Dashboard',
    'dashboard.welcome': 'Welcome back',
    'practice.upload': 'Upload Practice',
    'practice.submit': 'Submit Feedback',
    'role.student': 'Student',
    'role.instructor': 'Instructor',
    'search.placeholder': 'Search for courses...',
  },
  TR: {
    'nav.courses': 'Kurslar',
    'nav.myCourses': 'Kurslarım',
    'nav.dashboard': 'Panel',
    'nav.instructorPanel': 'Eğitmen Paneli',
    'nav.login': 'Giriş',
    'nav.logout': 'Çıkış',
    'home.hero.title': 'Enstrümanında Ustalaş',
    'home.hero.subtitle': 'Dünyanın en iyi müzisyenlerinden öğren. Etkili pratik yap. Geri bildirim al.',
    'home.hero.cta': 'Öğrenmeye Başla',
    'course.start': 'Kursa Başla',
    'course.purchase': 'Kursu Satın Al',
    'course.price': 'Fiyat',
    'course.instructor': 'Eğitmen',
    'course.duration': 'Süre',
    'dashboard.student.title': 'Öğrenci Paneli',
    'dashboard.instructor.title': 'Eğitmen Paneli',
    'dashboard.welcome': 'Tekrar hoş geldin',
    'practice.upload': 'Pratik Kaydı Yükle',
    'practice.submit': 'Geri Bildirim Gönder',
    'role.student': 'Öğrenci',
    'role.instructor': 'Eğitmen',
    'search.placeholder': 'Kurs ara...',
  }
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('EN');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
