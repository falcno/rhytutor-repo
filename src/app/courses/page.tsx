'use client';

import React, { useState } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import CourseCard from '@/components/CourseCard';
import { useData } from '@/contexts/DataContext';
import styles from './page.module.css';
import { Search, Filter } from 'lucide-react';

const INSTRUMENTS = ['All', 'Guitar', 'Piano', 'Vocal', 'Drums', 'Production'];

export default function CoursesPage() {
  const { t } = useI18n();
  const { courses } = useData();
  const [search, setSearch] = useState('');
  const [selectedInstrument, setSelectedInstrument] = useState('All');

  const filteredCourses = courses.filter(course => {
    if (course.status === 'pending') return false;
    const matchesSearch = course.titleEn.toLowerCase().includes(search.toLowerCase()) || 
                          course.titleTr.toLowerCase().includes(search.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(search.toLowerCase());
    const matchesInstrument = selectedInstrument === 'All' || course.instrument === selectedInstrument;
    return matchesSearch && matchesInstrument;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('nav.courses')}</h1>
        <p className={styles.subtitle}>{t('courses.subtitle')}</p>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder={t('search.placeholder')} 
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className={styles.instrumentFilter}>
          <Filter size={20} className={styles.filterIcon} />
          <div className={styles.pills}>
            {INSTRUMENTS.map(inst => (
              <button 
                key={inst}
                className={`${styles.pill} ${selectedInstrument === inst ? styles.pillActive : ''}`}
                onClick={() => setSelectedInstrument(inst)}
              >
                {inst}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.courseGrid}>
        {filteredCourses.length > 0 ? (
          filteredCourses.map(course => (
            <CourseCard key={course.id} {...course} />
          ))
        ) : (
          <div className={styles.emptyState}>
            <p>{t('courses.empty')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
