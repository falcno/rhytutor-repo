'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import CourseCard from '@/components/CourseCard';
import { useData } from '@/contexts/DataContext';
import styles from './page.module.css';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { t, language } = useI18n();
  const { courses } = useData();

  if (!user || user.role !== 'STUDENT') {
    return (
      <div className={styles.container}>
        <h2>Please login as a student to view this page.</h2>
      </div>
    );
  }

  // Mock enrolled courses (first two from mock data)
  const enrolledCourses = courses.filter(c => c.status !== 'pending').slice(0, 2);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('dashboard.student.title')}</h1>
        <p className={styles.subtitle}>{t('dashboard.welcome')}, {user.name}!</p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('dashboard.continueLearning')}</h2>
        <div className={styles.courseGrid}>
          {enrolledCourses.map(courseRaw => {
             const title = language === 'TR' ? courseRaw.titleTr : courseRaw.titleEn;
             return (
             <div key={courseRaw.id} className={styles.progressCard}>
               <img src={courseRaw.thumbnail} alt={title} className={styles.thumbnail} />
               <div className={styles.progressContent}>
                 <h3 className={styles.courseTitle}>{title}</h3>
                 <p className={styles.progressText}>{t('dashboard.lessonProgress') ? t('dashboard.lessonProgress').replace('{n}', '4').replace('{m}', String(courseRaw.lessonCount)) : `Lesson 4 of ${courseRaw.lessonCount}`}</p>
                 <div className={styles.progressBar}>
                   <div className={styles.progressFill} style={{ width: '25%' }}></div>
                 </div>
                 <a href={`/player/${courseRaw.id}`} className={styles.resumeBtn}>
                   {t('dashboard.resumeCourse')}
                 </a>
               </div>
             </div>
             );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>{t('dashboard.recentFeedback')}</h2>
        <div className={styles.feedbackList}>
          <div className={styles.feedbackItem}>
             <div className={styles.feedbackHeader}>
               <span className={styles.lessonName}>Advanced Electric Guitar - Lesson 3</span>
               <span className={styles.statusReviewed}>Reviewed</span>
             </div>
             <p className={styles.feedbackText}>
               "Great timing on the sweep picking! Make sure to mute the lower strings with your palm a bit more." - Alex Musician
             </p>
          </div>
        </div>
      </section>
    </div>
  );
}
