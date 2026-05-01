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
    'nav.adminPanel': 'Admin Panel',
    'auth.login': 'Login',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.usernamePlaceholder': 'e.g. jenar.kinik01 or ahmet.yilmaz',
    'auth.error': 'Invalid username or password.',
    'courses.subtitle': 'Explore our premium collection of music courses.',
    'courses.empty': 'No courses found matching your criteria.',
    'courseDetail.reviews': 'reviews',
    'courseDetail.whatYouWillLearn': 'What you\'ll learn',
    'courseDetail.curriculum': 'Course Curriculum',
    'courseDetail.lesson': 'Lesson',
    'courseDetail.includes': 'This course includes:',
    'courseDetail.video': 'on-demand video',
    'courseDetail.resources': '10+ PDF Resources & Tabs',
    'courseDetail.lifetime': 'Full lifetime access',
    'player.backToDashboard': 'Back to Dashboard',
    'player.materials': 'Materials',
    'player.metronome': 'Metronome',
    'player.submitPractice': 'Submit Practice',
    'player.comments': 'Comments',
    'player.download': 'Download',
    'player.uploadHint': 'Upload a video or audio recording of your practice for instructor feedback.',
    'player.dropHint': 'Drag and drop your file here, or click to browse',
    'player.notePlaceholder': 'Add a note for your instructor...',
    'player.submitBtn': 'Submit for Feedback',
    'player.uploading': 'Uploading...',
    'player.success': 'Submission successful! Your instructor will review it soon.',
    'player.discussion': 'Discussion',
    'player.commentPlaceholder': 'Add a comment...',
    'player.loginPrompt': 'Please log in to leave a comment.',
    'player.courseContent': 'Course Content',
    'dashboard.continueLearning': 'Continue Learning',
    'dashboard.recentFeedback': 'Recent Feedback',
    'dashboard.resumeCourse': 'Resume Course',
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
    'nav.adminPanel': 'Yönetim Paneli',
    'auth.login': 'Giriş Yap',
    'auth.username': 'Kullanıcı Adı',
    'auth.password': 'Şifre',
    'auth.usernamePlaceholder': 'örn. ahmet.yilmaz',
    'auth.error': 'Geçersiz kullanıcı adı veya şifre.',
    'courses.subtitle': 'Özenle seçilmiş premium müzik kurslarımızı keşfedin.',
    'courses.empty': 'Kriterlerinize uygun kurs bulunamadı.',
    'courseDetail.reviews': 'değerlendirme',
    'courseDetail.whatYouWillLearn': 'Neler öğreneceksiniz',
    'courseDetail.curriculum': 'Kurs Müfredatı',
    'courseDetail.lesson': 'Ders',
    'courseDetail.includes': 'Bu kursun içindekiler:',
    'courseDetail.video': 'istediğiniz zaman izleyin',
    'courseDetail.resources': '10+ PDF Kaynak ve Tab',
    'courseDetail.lifetime': 'Ömür boyu erişim',
    'player.backToDashboard': 'Panele Dön',
    'player.materials': 'Materyaller',
    'player.metronome': 'Metronom',
    'player.submitPractice': 'Pratik Yükle',
    'player.comments': 'Yorumlar',
    'player.download': 'İndir',
    'player.uploadHint': 'Eğitmenden geri bildirim almak için pratiğinizin videosunu veya ses kaydını yükleyin.',
    'player.dropHint': 'Dosyanızı buraya sürükleyin veya seçmek için tıklayın',
    'player.notePlaceholder': 'Eğitmeniniz için bir not ekleyin...',
    'player.submitBtn': 'Geri Bildirim İçin Gönder',
    'player.uploading': 'Yükleniyor...',
    'player.success': 'Yükleme başarılı! Eğitmeniniz yakında inceleyecek.',
    'player.discussion': 'Tartışma',
    'player.commentPlaceholder': 'Yorum ekle...',
    'player.loginPrompt': 'Yorum yapmak için lütfen giriş yapın.',
    'player.courseContent': 'Kurs İçeriği',
    'dashboard.continueLearning': 'Öğrenmeye Devam Et',
    'dashboard.recentFeedback': 'Son Geri Bildirimler',
    'dashboard.resumeCourse': 'Kursa Devam Et',
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
