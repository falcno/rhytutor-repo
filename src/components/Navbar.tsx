'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import styles from './Navbar.module.css';
import { Music, Globe, LogOut, User, Activity, ChevronDown, ChevronUp, Search, ShoppingCart, Settings, Edit, Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import Metronome from './Metronome';
import Tuner from './Tuner';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const { language, setLanguage, t } = useI18n();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<'metronome' | 'tuner' | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

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
          <Link href="/about" className={styles.link}>
            {t('nav.about')}
          </Link>
          <Link href="/faq" className={styles.link}>
            {t('nav.faq')}
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
          <div className={styles.searchContainer}>
            <Search size={18} className={styles.searchIcon} />
            <input type="text" placeholder="Ara..." className={styles.searchInput} />
          </div>

          <Link href="/cart" className={styles.iconButton} aria-label="Cart">
            <ShoppingCart size={20} />
          </Link>

          <button onClick={toggleTheme} className={styles.iconButton} aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <div className={styles.notificationWrapper}>
            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className={styles.iconButton} aria-label="Notifications">
              <Bell size={20} />
              <span className={styles.notificationBadge}></span>
            </button>
            {isNotificationsOpen && (
              <div className={styles.notificationDropdown}>
                <div className={styles.notificationItem}>
                  <p>Batuhan ödevine yorum yaptı.</p>
                  <span className={styles.notificationTime}>2 saat önce</span>
                </div>
                <div className={styles.notificationItem}>
                  <p>Yeni kurs eklendi: İleri Seviye Slap Bas</p>
                  <span className={styles.notificationTime}>1 gün önce</span>
                </div>
              </div>
            )}
          </div>

          <button onClick={toggleLanguage} className={styles.iconButton} aria-label="Toggle Language">
            <Globe size={20} />
            <span className={styles.langText}>{language}</span>
          </button>

          {!user ? (
            <div className={styles.authButtons}>
              <button className={styles.loginBtn} onClick={() => setIsLoginModalOpen(true)}>
                {t('nav.login')}
              </button>
              <button className={styles.registerBtn} onClick={() => setIsRegisterModalOpen(true)}>
                {t('auth.register')}
              </button>
            </div>
          ) : (
            <div className={styles.userMenuWrapper}>
              <div 
                className={styles.userInfo} 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <img src={user.avatar} alt="Avatar" className={styles.avatar} />
                <span className={styles.userName}>{user.name}</span>
                {isUserMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              
              {isUserMenuOpen && (
                <div className={styles.userDropdown}>
                  <Link href="/profile/edit" className={styles.dropdownItem} onClick={() => setIsUserMenuOpen(false)}>
                    <Edit size={16} />
                    <span>Profil düzenle</span>
                  </Link>
                  <Link href="/settings" className={styles.dropdownItem} onClick={() => setIsUserMenuOpen(false)}>
                    <Settings size={16} />
                    <span>Hesap ayarları</span>
                  </Link>
                  <button onClick={() => { logout(); setIsUserMenuOpen(false); }} className={styles.dropdownItem}>
                    <LogOut size={16} />
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <RegisterModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} />
      
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
