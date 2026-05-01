import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/contexts/I18nContext';
import styles from './CourseCard.module.css';
import { Star, Clock, PlayCircle } from 'lucide-react';

interface CourseCardProps {
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
}

export default function CourseCard({
  id,
  titleEn,
  titleTr,
  instructor,
  thumbnail,
  price,
  rating,
  duration,
  lessonCount,
  instrument,
}: CourseCardProps) {
  const { t, language } = useI18n();
  const title = language === 'TR' ? titleTr : titleEn;

  return (
    <Link href={`/courses/${id}`} className={styles.card}>
      <div className={styles.thumbnailWrapper}>
        <img src={thumbnail} alt={title} className={styles.thumbnail} />
        <div className={styles.overlay}>
          <PlayCircle size={48} className={styles.playIcon} />
        </div>
        <span className={styles.badge}>{instrument}</span>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.instructor}>{instructor}</p>
        
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <Star size={14} className={styles.starIcon} />
            <span>{rating.toFixed(1)}</span>
          </div>
          <div className={styles.statItem}>
            <Clock size={14} />
            <span>{duration}</span>
          </div>
          <div className={styles.statItem}>
            <span>{lessonCount} lessons</span>
          </div>
        </div>
        
        <div className={styles.footer}>
          <span className={styles.price}>${price.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
}
