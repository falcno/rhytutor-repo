'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import styles from './page.module.css';
import { Users, DollarSign, BookOpen, Video, PlayCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useData } from '@/contexts/DataContext';

export default function InstructorDashboard() {
  const { user } = useAuth();
  const { courses } = useData();
  const { t, language } = useI18n();
  const [reviewingId, setReviewingId] = useState<number | null>(null);

  if (!user || user.role !== 'INSTRUCTOR') {
    return (
      <div className={styles.container}>
        <h2>Please login as an instructor to view this page.</h2>
      </div>
    );
  }

  const submissions = [
    { id: 1, studentName: 'Alex Musician', course: language === 'TR' ? 'İleri Seviye Elektro Gitar Teknikleri' : 'Advanced Electric Guitar Techniques', lesson: 'Lesson 3', status: 'pending', date: '2 hours ago' },
    { id: 2, studentName: 'Jane Doe', course: language === 'TR' ? 'Piyano Başlangıç Rehberi' : 'Piano Beginners Guide', lesson: 'Lesson 1', status: 'reviewed', date: '1 day ago' },
  ];

  const handleReview = (id: number) => {
    setReviewingId(id);
  };

  const submitReview = () => {
    alert('Feedback submitted successfully!');
    setReviewingId(null);
  };

  const instructorCourses = courses.filter(c => c.instructor === user.name);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className={styles.title}>{t('dashboard.instructor.title')}</h1>
          <p className={styles.subtitle}>{t('dashboard.welcome')}, {user.name}!</p>
        </div>
        <Link href="/instructor/course/new" className={styles.createBtn}>
          Create New Course
        </Link>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(187, 134, 252, 0.1)', color: 'var(--primary)' }}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>$1,240.50</h3>
            <p>Total Revenue (Mock)</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(3, 218, 198, 0.1)', color: 'var(--secondary)' }}>
            <Users size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>342</h3>
            <p>Total Students</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(207, 102, 121, 0.1)', color: 'var(--error)' }}>
            <BookOpen size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>{instructorCourses.length}</h3>
            <p>Active Courses</p>
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Pending Practice Submissions</h2>
          
          <div className={styles.submissionList}>
            {submissions.map(sub => (
              <div key={sub.id} className={styles.submissionCard}>
                <div className={styles.subHeader}>
                  <div className={styles.studentInfo}>
                    <div className={styles.avatarPlaceholder}>{sub.studentName.charAt(0)}</div>
                    <div>
                      <h4>{sub.studentName}</h4>
                      <p className={styles.subCourseText}>{sub.course} - {sub.lesson}</p>
                    </div>
                  </div>
                  <span className={`${styles.statusBadge} ${sub.status === 'pending' ? styles.statusPending : styles.statusReviewed}`}>
                    {sub.status}
                  </span>
                </div>

                {reviewingId === sub.id ? (
                  <div className={styles.reviewArea}>
                    <div className={styles.mockPlayer}>
                      <PlayCircle size={48} className={styles.playIcon} />
                      <span>Student_Practice_Video.mp4</span>
                    </div>
                    <textarea 
                      className={styles.feedbackInput} 
                      placeholder="Write your feedback here..."
                      rows={4}
                    />
                    <div className={styles.reviewActions}>
                      <button className={styles.cancelBtn} onClick={() => setReviewingId(null)}>Cancel</button>
                      <button className={styles.submitFeedbackBtn} onClick={submitReview}>Submit Feedback</button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.cardActions}>
                    <p className={styles.dateText}>{sub.date}</p>
                    {sub.status === 'pending' && (
                      <button className={styles.reviewBtn} onClick={() => handleReview(sub.id)}>
                        <Video size={16} /> Review Submission
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Your Courses</h2>
          <div className={styles.courseList}>
            {instructorCourses.map(course => (
              <div key={course.id} className={styles.courseListItem}>
                <img src={course.thumbnail} className={styles.courseListThumb} alt={language === 'TR' ? course.titleTr : course.titleEn} />
                <div className={styles.courseListInfo}>
                  <h4>{language === 'TR' ? course.titleTr : course.titleEn}</h4>
                  <p>{course.lessonCount} Lessons • {Math.floor(Math.random() * 200)} Students</p>
                </div>
                <Link href="/instructor/course/edit" className={styles.editBtn}>Edit</Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
