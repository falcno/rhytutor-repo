'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './page.module.css';
import { UploadCloud, Plus, Video, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateCoursePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [lessons, setLessons] = useState([{ id: 1, title: '', videoFile: null }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user || user.role !== 'INSTRUCTOR') {
    return <div className={styles.container}>Unauthorized</div>;
  }

  const addLesson = () => {
    setLessons([...lessons, { id: lessons.length + 1, title: '', videoFile: null }]);
  };

  const removeLesson = (id: number) => {
    setLessons(lessons.filter(l => l.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to Next.js API route that would handle file uploads
    setTimeout(() => {
      alert('Course created successfully!');
      router.push('/instructor-dashboard');
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/instructor-dashboard" className={styles.backBtn}>
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
        <h1 className={styles.title}>Create New Course</h1>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Course Details</h2>
          
          <div className={styles.formGroup}>
            <label>Course Title</label>
            <input type="text" placeholder="e.g. Master the Acoustic Guitar" required />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Instrument</label>
              <select required>
                <option value="">Select Instrument</option>
                <option value="Guitar">Guitar</option>
                <option value="Piano">Piano</option>
                <option value="Vocal">Vocal</option>
                <option value="Drums">Drums</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Difficulty</label>
              <select required>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Price ($)</label>
              <input type="number" min="0" step="0.01" placeholder="49.99" required />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea rows={5} placeholder="Describe what students will learn..." required></textarea>
          </div>

          <div className={styles.formGroup}>
            <label>Course Thumbnail</label>
            <div className={styles.fileUploadArea}>
              <UploadCloud size={24} className={styles.uploadIcon} />
              <p>Drag and drop an image, or click to select</p>
              <input type="file" accept="image/*" className={styles.fileInput} />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Curriculum</h2>
            <button type="button" className={styles.addBtn} onClick={addLesson}>
              <Plus size={16} /> Add Lesson
            </button>
          </div>

          <div className={styles.lessonList}>
            {lessons.map((lesson, index) => (
              <div key={lesson.id} className={styles.lessonCard}>
                <div className={styles.lessonHeader}>
                  <h3>Lesson {index + 1}</h3>
                  {lessons.length > 1 && (
                    <button type="button" className={styles.removeBtn} onClick={() => removeLesson(lesson.id)}>
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                
                <div className={styles.formGroup}>
                  <label>Lesson Title</label>
                  <input type="text" placeholder="e.g. Introduction to Chords" required />
                </div>

                <div className={styles.formGroup}>
                  <label>Video File (MP4, MOV)</label>
                  <div className={styles.videoUploadArea}>
                    <Video size={24} className={styles.uploadIcon} />
                    <p>Upload lesson video</p>
                    <input type="file" accept="video/*" className={styles.fileInput} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.actions}>
          <Link href="/instructor-dashboard" className={styles.cancelBtn}>Cancel</Link>
          <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
            {isSubmitting ? 'Publishing...' : 'Publish Course'}
          </button>
        </div>
      </form>
    </div>
  );
}
