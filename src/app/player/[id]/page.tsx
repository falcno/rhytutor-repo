'use client';

import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import styles from './page.module.css';
import { PlayCircle, CheckCircle, FileText, UploadCloud, ChevronLeft, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Metronome from '@/components/Metronome';
import { useI18n } from '@/contexts/I18nContext';

export default function PlayerPage({ params }: { params: { id: string } }) {
  const { language, t } = useI18n();
  const { user } = useAuth();
  const { courses } = useData();
  const courseRaw = courses.find(c => c.id === params.id);
  const [activeTab, setActiveTab] = useState<'materials' | 'metronome' | 'practice' | 'comments'>('materials');
  const [activeLesson, setActiveLesson] = useState(1);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'uploading' | 'success'>('idle');
  const [comments, setComments] = useState([
    { id: 1, user: 'Ahmet Yılmaz', role: 'STUDENT', text: 'Bu ders çok faydalı oldu, teşekkürler!', time: '2 hours ago' },
    { id: 2, user: 'Jenar Kınık', role: 'INSTRUCTOR', text: 'Harika! Pratik yapmayı unutmayın.', time: '1 hour ago' }
  ]);
  const [newComment, setNewComment] = useState('');

  if (!courseRaw) return <div className={styles.container}>Course not found</div>;

  const course = {
    ...courseRaw,
    title: language === 'TR' ? courseRaw.titleTr : courseRaw.titleEn
  };

  const lessons = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Lesson ${i + 1}: ${i === 0 ? 'Introduction' : 'Technique Part ' + i}`,
    duration: '10:00',
    completed: i < 3
  }));

  const handlePracticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus('uploading');
    setTimeout(() => {
      setSubmissionStatus('success');
      setTimeout(() => setSubmissionStatus('idle'), 3000);
    }, 2000);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    
    setComments([
      ...comments,
      {
        id: Date.now(),
        user: user.name,
        role: user.role,
        text: newComment,
        time: 'Just now'
      }
    ]);
    setNewComment('');
  };

  return (
    <div className={styles.playerContainer}>
      <div className={styles.mainContent}>
        <div className={styles.videoHeader}>
          <Link href="/student-dashboard" className={styles.backBtn}>
            <ChevronLeft size={20} /> {t('player.backToDashboard')}
          </Link>
          <h1 className={styles.courseTitle}>{course.title}</h1>
        </div>

        <div className={styles.videoWrapper}>
          <video 
            className={styles.video} 
            controls 
            poster={course.thumbnail}
          >
            {/* MVP Note: In a real app this would point to the uploaded video file in /public/uploads/ */}
            <source src="" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className={styles.tabsArea}>
          <div className={styles.tabList}>
            <button 
              className={`${styles.tab} ${activeTab === 'materials' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('materials')}
            >
              <FileText size={18} /> {t('player.materials')}
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'metronome' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('metronome')}
            >
              {t('player.metronome')}
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'practice' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('practice')}
            >
              <UploadCloud size={18} /> {t('player.submitPractice')}
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'comments' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              <MessageSquare size={18} /> {t('player.comments')}
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'materials' && (
              <div className={styles.materialsTab}>
                <h3>{t('player.materials')}</h3>
                <div className={styles.materialItem}>
                  <FileText size={20} className={styles.materialIcon} />
                  <span>Lesson_{activeLesson}_Notes.pdf</span>
                  <button className={styles.downloadBtn}>{t('player.download')}</button>
                </div>
                <div className={styles.materialItem}>
                  <FileText size={20} className={styles.materialIcon} />
                  <span>Backing_Track_120bpm.mp3</span>
                  <button className={styles.downloadBtn}>{t('player.download')}</button>
                </div>
              </div>
            )}

            {activeTab === 'metronome' && (
              <div className={styles.metronomeTab}>
                <Metronome />
              </div>
            )}

            {activeTab === 'practice' && (
              <div className={styles.practiceTab}>
                <h3>{t('player.submitTitle')} {activeLesson}</h3>
                <p className={styles.practiceHint}>{t('player.uploadHint')}</p>
                
                {submissionStatus === 'success' ? (
                  <div className={styles.successMessage}>
                    <CheckCircle size={32} />
                    <p>{t('player.success')}</p>
                  </div>
                ) : (
                  <form className={styles.practiceForm} onSubmit={handlePracticeSubmit}>
                    <div className={styles.fileDropZone}>
                      <UploadCloud size={32} className={styles.dropIcon} />
                      <p>{t('player.dropHint')}</p>
                      <input type="file" className={styles.fileInput} accept="video/*,audio/*" required />
                    </div>
                    
                    <textarea 
                      placeholder={t('player.notePlaceholder')} 
                      className={styles.noteInput}
                      rows={3}
                    />
                    
                    <button type="submit" className={styles.submitBtn} disabled={submissionStatus === 'uploading'}>
                      {submissionStatus === 'uploading' ? t('player.uploading') : t('player.submitBtn')}
                    </button>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'comments' && (
              <div className={styles.commentsTab}>
                <h3>{t('player.discussion')}</h3>
                <div className={styles.commentList}>
                  {comments.map(c => (
                    <div key={c.id} className={styles.commentItem}>
                      <div className={styles.commentHeader}>
                        <span className={styles.commentUser}>{c.user}</span>
                        {c.role === 'INSTRUCTOR' && <span className={styles.instructorBadge}>Instructor</span>}
                        <span className={styles.commentTime}>{c.time}</span>
                      </div>
                      <p className={styles.commentText}>{c.text}</p>
                    </div>
                  ))}
                </div>
                
                {user ? (
                  <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
                    <input 
                      type="text" 
                      placeholder={t('player.commentPlaceholder')} 
                      className={styles.commentInput}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button type="submit" className={styles.commentSubmitBtn}>
                      <Send size={18} />
                    </button>
                  </form>
                ) : (
                  <p className={styles.loginPrompt}>{t('player.loginPrompt')}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>{t('player.courseContent')}</h2>
        </div>
        <div className={styles.lessonList}>
          {lessons.map(lesson => (
            <button 
              key={lesson.id} 
              className={`${styles.lessonItem} ${activeLesson === lesson.id ? styles.lessonActive : ''}`}
              onClick={() => setActiveLesson(lesson.id)}
            >
              <div className={styles.lessonStatus}>
                {lesson.completed ? (
                  <CheckCircle size={18} className={styles.completedIcon} />
                ) : (
                  <div className={styles.uncompletedCircle} />
                )}
              </div>
              <div className={styles.lessonInfo}>
                <span className={styles.lessonTitle}>{lesson.title}</span>
                <span className={styles.lessonDuration}>{lesson.duration}</span>
              </div>
              {activeLesson === lesson.id && <PlayCircle size={18} className={styles.playingIcon} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
