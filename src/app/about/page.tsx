'use client';

import React from 'react';
import { useI18n } from '@/contexts/I18nContext';
import styles from './page.module.css';

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('about.title')}</h1>
      <div className={styles.content}>
        <p>{t('about.content')}</p>
      </div>
    </div>
  );
}
