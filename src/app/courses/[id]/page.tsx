'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useI18n } from '@/contexts/I18nContext';
import styles from './page.module.css';
import { Star, Clock, Video, FileText, Check, PlayCircle } from 'lucide-react';
import CheckoutModal from '@/components/CheckoutModal';

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user, login } = useAuth();
  const { courses } = useData();
  const { t, language } = useI18n();
  const [showCheckout, setShowCheckout] = useState(false);
  
  const courseRaw = courses.find(c => c.id === params.id);

  if (!courseRaw) {
    return <div className={styles.container}>Course not found</div>;
  }

  const course = {
    ...courseRaw,
    title: language === 'TR' ? courseRaw.titleTr : courseRaw.titleEn
  };

  const handlePurchaseClick = () => {
    if (!user) {
      // Force login as student for MVP testing
      login('ahmet.yilmaz', '123456');
      // Then show checkout
      setTimeout(() => setShowCheckout(true), 100);
    } else {
      setShowCheckout(true);
    }
  };

  const handlePurchaseSuccess = () => {
    setShowCheckout(false);
    // Redirect to the course player page
    router.push(`/player/${course.id}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.badge}>{course.instrument}</div>
          <h1 className={styles.title}>{course.title}</h1>
          <p className={styles.subtitle}>Master {course.instrument} with our comprehensive guide designed for {course.difficulty.toLowerCase()} students.</p>
          
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <Star size={18} className={styles.starIcon} />
              <span>{course.rating} (1,234 reviews)</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.instructorLabel}>{t('course.instructor')}:</span>
              <span className={styles.instructorName}>{course.instructor}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainCol}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>What you'll learn</h2>
            <ul className={styles.learningList}>
              <li><Check size={20} className={styles.checkIcon}/> Understand the fundamental techniques</li>
              <li><Check size={20} className={styles.checkIcon}/> Play along with backing tracks</li>
              <li><Check size={20} className={styles.checkIcon}/> Master advanced theory concepts</li>
              <li><Check size={20} className={styles.checkIcon}/> Improve your musicality and phrasing</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Course Curriculum</h2>
            <div className={styles.curriculumList}>
              {[1, 2, 3, 4, 5].map((lesson) => (
                <div key={lesson} className={styles.lessonItem}>
                  <div className={styles.lessonInfo}>
                    <PlayCircle size={20} className={styles.lessonIcon} />
                    <span>Lesson {lesson}: Fundamentals Part {lesson}</span>
                  </div>
                  <span className={styles.lessonDuration}>10:00</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className={styles.sidebarCol}>
          <div className={styles.purchaseCard}>
            <div className={styles.previewImageWrapper}>
              <img src={course.thumbnail} alt={course.title} className={styles.previewImage} />
              <div className={styles.playOverlay}>
                <PlayCircle size={48} className={styles.playIcon} />
              </div>
            </div>
            
            <div className={styles.purchaseContent}>
              <div className={styles.priceSection}>
                <span className={styles.priceLabel}>{t('course.price')}</span>
                <span className={styles.price}>${course.price.toFixed(2)}</span>
              </div>
              
              <button className={styles.purchaseBtn} onClick={handlePurchaseClick}>
                {t('course.purchase')}
              </button>
              
              <div className={styles.includes}>
                <h4>This course includes:</h4>
                <ul>
                  <li><Video size={16} /> {course.duration} on-demand video</li>
                  <li><FileText size={16} /> 10+ PDF Resources & Tabs</li>
                  <li><Clock size={16} /> Full lifetime access</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal 
          course={course} 
          onClose={() => setShowCheckout(false)} 
          onSuccess={handlePurchaseSuccess} 
        />
      )}
    </div>
  );
}
