'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import styles from './Navbar.module.css';
import { Music, Globe, LogOut, User } from 'lucide-react';
import LoginModal from './LoginModal';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const { language, setLanguage, t } = useI18n();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'TR' : 'EN');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>
          <Music className={styles.brandIcon} size={28} />
          <span className={styles.brandName}>Rhytutor</span>
        </Link>

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
    </nav>
  );
}
