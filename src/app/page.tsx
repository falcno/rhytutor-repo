'use client';

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/contexts/I18nContext';
import CourseCard from '@/components/CourseCard';
import { useData } from '@/contexts/DataContext';
import styles from './page.module.css';

export default function Home() {
  const { t } = useI18n();
  const { courses } = useData();

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{t('home.hero.title')}</h1>
          <p className={styles.subtitle}>{t('home.hero.subtitle')}</p>
          <div className={styles.heroActions}>
            <Link href="/courses" className={styles.primaryBtn}>
              {t('home.hero.cta')}
            </Link>
          </div>
        </div>
        <div className={styles.heroBackground}></div>
      </section>

      <section className={styles.featured}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Courses</h2>
          <Link href="/courses" className={styles.viewAll}>View all</Link>
        </div>
        <div className={styles.courseGrid}>
          {courses.filter(c => c.status !== 'pending').map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </section>
    </div>
  );
}
