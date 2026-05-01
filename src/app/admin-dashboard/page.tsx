'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import styles from './page.module.css';
import { Users, BookOpen, Shield, Settings, Activity, Flag } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { courses, users, approveCourse, updateUserRole } = useData();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses'>('overview');

  if (!user || !user.isAdmin) {
    return (
      <div className={styles.container}>
        <h2>Unauthorized. Admin access required.</h2>
      </div>
    );
  }

  const pendingCourses = courses.filter(c => c.status === 'pending');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin Control Panel</h1>
          <p className={styles.subtitle}>Welcome, Super Admin {user.name}</p>
        </div>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.tabActive : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`${styles.tabBtn} ${activeTab === 'users' ? styles.tabActive : ''}`} onClick={() => setActiveTab('users')}>Manage Users</button>
        <button className={`${styles.tabBtn} ${activeTab === 'courses' ? styles.tabActive : ''}`} onClick={() => setActiveTab('courses')}>
          Approve Courses {pendingCourses.length > 0 && `(${pendingCourses.length})`}
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(187, 134, 252, 0.1)', color: 'var(--primary)' }}>
                <Users size={24} />
              </div>
              <div className={styles.statInfo}>
                <h3>{users.length}</h3>
                <p>Total Users</p>
              </div>
            </div>
            
            <div className={styles.statCard}>
              <div className={styles.statIconWrapper} style={{ backgroundColor: 'rgba(3, 218, 198, 0.1)', color: 'var(--secondary)' }}>
                <BookOpen size={24} />
              </div>
              <div className={styles.statInfo}>
                <h3>{courses.length}</h3>
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
              <button className={styles.actionBtn} onClick={() => setActiveTab('users')}>
                <Shield size={32} color="var(--primary)" />
                Manage Users & Roles
              </button>
              <button className={styles.actionBtn} onClick={() => setActiveTab('courses')}>
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
        </>
      )}

      {activeTab === 'users' && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Manage Users</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.name} {u.isAdmin && '(Admin)'}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    {!u.isAdmin && (
                      <select 
                        className={styles.roleSelect} 
                        value={u.role} 
                        onChange={(e) => updateUserRole(u.id, e.target.value as any)}
                      >
                        <option value="STUDENT">Student</option>
                        <option value="INSTRUCTOR">Instructor</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {activeTab === 'courses' && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Course Approvals</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Instructor</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.id}>
                  <td>{c.titleEn}</td>
                  <td>{c.instructor}</td>
                  <td>
                    <span className={`${styles.badge} ${c.status === 'pending' ? styles.badgePending : styles.badgeApproved}`}>
                      {c.status ? c.status.toUpperCase() : 'APPROVED'}
                    </span>
                  </td>
                  <td>
                    {c.status === 'pending' && (
                      <button className={styles.approveBtn} onClick={() => approveCourse(c.id)}>
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
