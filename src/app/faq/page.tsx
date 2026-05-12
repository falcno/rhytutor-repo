'use client';

import React from 'react';
import { useI18n } from '@/contexts/I18nContext';
import styles from './page.module.css';

export default function FAQPage() {
  const { t } = useI18n();

  const faqs = [
    { q: 'faq.q1', a: 'faq.a1' },
    { q: 'faq.q2', a: 'faq.a2' },
    { q: 'faq.q3', a: 'faq.a3' },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('faq.title')}</h1>
      <div className={styles.faqList}>
        {faqs.map((faq, idx) => (
          <div key={idx} className={styles.faqItem}>
            <h3 className={styles.question}>{t(faq.q)}</h3>
            <p className={styles.answer}>{t(faq.a)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
