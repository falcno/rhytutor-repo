'use client';

import React from 'react';
import { useData } from '@/contexts/DataContext';
import CourseCard from '@/components/CourseCard';
import styles from './page.module.css';

export default function InstructorProfile({ params }: { params: { name: string } }) {
  const { users, courses } = useData();
  const nameDecoded = decodeURIComponent(params.name);
  
  // Try to find the user in mock data
  const instructor = users.find(u => u.name === nameDecoded && u.role === 'INSTRUCTOR');
  const instructorCourses = courses.filter(c => c.instructor === nameDecoded && c.status === 'approved');

  if (!instructor) {
    // If not found in users DB but has courses (mock data mismatch), we can still show a fallback profile
    if (instructorCourses.length === 0) {
      return (
        <div className={styles.container}>
          <h2>Eğitmen bulunamadı.</h2>
        </div>
      );
    }
  }

  const displayName = instructor ? instructor.name : nameDecoded;
  const avatarUrl = instructor ? instructor.avatar : '/images/default_avatar.png';

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <img src={avatarUrl} alt={displayName} className={styles.avatar} />
        <div className={styles.info}>
          <h1 className={styles.name}>{displayName}</h1>
          <p className={styles.bio}>
            {displayName} is a highly experienced musician and instructor on Riffly. 
            With years of professional experience, they bring deep knowledge and passion to every lesson.
          </p>
        </div>
      </div>

      <div className={styles.coursesSection}>
        <h2 className={styles.sectionTitle}>{displayName}'s Courses</h2>
        {instructorCourses.length > 0 ? (
          <div className={styles.courseGrid}>
            {instructorCourses.map(course => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        ) : (
          <p>No published courses yet.</p>
        )}
      </div>
    </div>
  );
}
