'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import styles from './Navbar.module.css';
import { Music, Globe, LogOut, User, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import LoginModal from './LoginModal';
import Metronome from './Metronome';
import Tuner from './Tuner';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const { language, setLanguage, t } = useI18n();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<'metronome' | 'tuner' | null>(null);

  const toggleTool = (tool: 'metronome' | 'tuner') => {
    setActiveTool(activeTool === tool ? null : tool);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'TR' : 'EN');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.brandGroup}>
          <Link href="/" className={styles.brand}>
            <img src="/logo.png" alt="Riffly" className={styles.logoImg} />
            <span className={styles.brandName}>Riffly</span>
          </Link>

          <div className={styles.quickTools}>
            <button 
              className={`${styles.toolBtn} ${activeTool === 'metronome' ? styles.active : ''}`}
              onClick={() => toggleTool('metronome')}
            >
              <Music size={18} />
              <span>{t('tools.metronome')}</span>
            </button>
            
            <button 
              className={`${styles.toolBtn} ${activeTool === 'tuner' ? styles.active : ''}`}
              onClick={() => toggleTool('tuner')}
            >
              <Activity size={18} />
              <span>{t('tools.tuner')}</span>
            </button>
          </div>
        </div>

        <div className={styles.navLinks}>
          <Link href="/courses" className={styles.link}>
            {t('nav.courses')}
          </Link>

          {user && role === 'STUDENT' && (
            <>
              <Link href="/my-courses" className={styles.link}>
                {t('nav.myCourses')}
              </Link>
              <Link href="/student-dashboard" className={styles.link}>
                {t('nav.dashboard')}
              </Link>
            </>
          )}

          {user && role === 'INSTRUCTOR' && !user.isAdmin && (
            <Link href="/instructor-dashboard" className={styles.link}>
              {t('nav.instructorPanel')}
            </Link>
          )}

          {user && user.isAdmin && (
            <Link href="/admin-dashboard" className={styles.link}>
              {t('nav.adminPanel')}
            </Link>
          )}
        </div>

        <div className={styles.actions}>
          <button onClick={toggleLanguage} className={styles.iconButton} aria-label="Toggle Language">
            <Globe size={20} />
            <span className={styles.langText}>{language}</span>
          </button>

          {!user ? (
            <div className={styles.authButtons}>
              <button className={styles.loginBtn} onClick={() => setIsLoginModalOpen(true)}>
                {t('nav.login')}
              </button>
            </div>
          ) : (
            <div className={styles.userMenu}>
              <div className={styles.userInfo}>
                <img src={user.avatar} alt="Avatar" className={styles.avatar} />
                <span className={styles.userName}>{user.name}</span>
              </div>
              <button onClick={logout} className={styles.iconButton} aria-label="Logout">
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      
      <div className={`${styles.toolDropdown} ${activeTool ? styles.open : ''}`}>
        <div className={styles.dropdownOverlay} onClick={() => setActiveTool(null)} />
        <div className={styles.dropdownContent}>
          {activeTool === 'metronome' && <Metronome />}
          {activeTool === 'tuner' && <Tuner />}
        </div>
      </div>
    </nav>
  );
}
