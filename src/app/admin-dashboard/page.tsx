'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import styles from './page.module.css';
import { Users, BookOpen, Shield, Settings, Activity, Flag } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();

  if (!user || !user.isAdmin) {
    return (
      <div className={styles.container}>
        <h2>Unauthorized. Admin access required.</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin Control Panel</h1>
          <p className={styles.subtitle}>Welcome, Super Admin {user.name}</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(187, 134, 252, 0.1)', color: 'var(--primary)' }}>
            <Users size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>1,420</h3>
            <p>Total Users</p>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(3, 218, 198, 0.1)', color: 'var(--secondary)' }}>
            <BookOpen size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>45</h3>
            <p>Total Courses</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(207, 102, 121, 0.1)', color: 'var(--error)' }}>
            <Activity size={24} />
          </div>
          <div className={styles.statInfo}>
            <h3>$12,450</h3>
            <p>Platform Revenue</p>
          </div>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <button className={styles.actionBtn}>
            <Shield size={32} color="var(--primary)" />
            Manage Users & Roles
          </button>
          <button className={styles.actionBtn}>
            <BookOpen size={32} color="var(--secondary)" />
            Approve Courses
          </button>
          <button className={styles.actionBtn}>
            <Flag size={32} color="var(--error)" />
            Review Reports
          </button>
          <button className={styles.actionBtn}>
            <Settings size={32} color="#fff" />
            Platform Settings
          </button>
        </div>
      </section>
    </div>
  );
}
