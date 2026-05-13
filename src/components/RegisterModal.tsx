import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useI18n } from '@/contexts/I18nContext';
import styles from './RegisterModal.module.css';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [role, setRole] = useState<'STUDENT' | 'INSTRUCTOR'>('STUDENT');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Instructor specific fields
  const [instrument, setInstrument] = useState('');
  const [bio, setBio] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const { t } = useI18n();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError(t('auth.passwordsNotMatch'));
      return;
    }

    // Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 symbol
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
    if (!passwordRegex.test(password)) {
      setError(t('auth.passwordComplexity'));
      return;
    }

    if (role === 'INSTRUCTOR' && bio.length < 200) {
      setError(t('auth.bioLengthError'));
      return;
    }

    const successReg = register({
      username,
      password,
      name,
      email,
      role
      // We can extend the DB later to save dob, instrument, bio, etc.
    });

    if (successReg) {
      setSuccess(t('auth.registerSuccess'));
      setTimeout(() => {
        onClose();
        // Reset form
        setUsername('');
        setName('');
        setEmail('');
        setDob('');
        setPassword('');
        setConfirmPassword('');
        setInstrument('');
        setBio('');
        setRole('STUDENT');
        setSuccess('');
      }, 2000);
    } else {
      setError(t('auth.usernameExists'));
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>
        
        <h2 className={styles.title}>{t('auth.register')}</h2>

        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${role === 'STUDENT' ? styles.active : ''}`}
            onClick={() => { setRole('STUDENT'); setError(''); }}
          >
            {t('auth.studentTab')}
          </button>
          <button 
            className={`${styles.tab} ${role === 'INSTRUCTOR' ? styles.active : ''}`}
            onClick={() => { setRole('INSTRUCTOR'); setError(''); }}
          >
            {t('auth.instructorTab')}
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="reg-username">{t('auth.username')}</label>
            <input 
              type="text" 
              id="reg-username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="reg-name">{t('auth.nameSurname')}</label>
            <input 
              type="text" 
              id="reg-name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="reg-dob">{t('auth.dob')}</label>
            <input 
              type="date" 
              id="reg-dob" 
              value={dob} 
              onChange={(e) => setDob(e.target.value)} 
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="reg-email">{t('auth.email')}</label>
            <input 
              type="email" 
              id="reg-email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="reg-password">{t('auth.password')}</label>
            <input 
              type="password" 
              id="reg-password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              minLength={6}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="reg-confirm-password">{t('auth.passwordConfirm')}</label>
            <input 
              type="password" 
              id="reg-confirm-password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>

          {role === 'INSTRUCTOR' && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="reg-instrument">{t('auth.instrument')}</label>
                <input 
                  type="text" 
                  id="reg-instrument" 
                  value={instrument} 
                  onChange={(e) => setInstrument(e.target.value)} 
                  required 
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="reg-bio">{t('auth.bio')}</label>
                <textarea 
                  id="reg-bio" 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)} 
                  required 
                  minLength={200}
                />
                <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', display: 'block', marginTop: '0.25rem' }}>
                  {bio.length} / 200
                </small>
              </div>
            </>
          )}
          
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          
          <button type="submit" className={styles.submitBtn} disabled={!!success}>
            {t('auth.register')}
          </button>
        </form>
      </div>
    </div>
  );
}
