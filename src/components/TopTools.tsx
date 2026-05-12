'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Music, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import Metronome from './Metronome';
import Tuner from './Tuner';
import styles from './TopTools.module.css';

export default function TopTools() {
  const { t } = useI18n();
  const [activeTool, setActiveTool] = useState<'metronome' | 'tuner' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleTool = (tool: 'metronome' | 'tuner') => {
    setActiveTool(activeTool === tool ? null : tool);
  };

  // Close tools when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveTool(null);
      }
    };

    if (activeTool) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeTool]);

  return (
    <div className={styles.wrapper} ref={containerRef}>
      <div className={styles.bar}>
        <div className={styles.container}>
          <div className={styles.tools}>
            <button 
              className={`${styles.toolBtn} ${activeTool === 'metronome' ? styles.active : ''}`}
              onClick={() => toggleTool('metronome')}
            >
              <Music size={18} />
              <span>{t('tools.metronome')}</span>
              {activeTool === 'metronome' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            
            <button 
              className={`${styles.toolBtn} ${activeTool === 'tuner' ? styles.active : ''}`}
              onClick={() => toggleTool('tuner')}
            >
              <Activity size={18} />
              <span>{t('tools.tuner')}</span>
              {activeTool === 'tuner' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
          
          <div className={styles.info}>
            <span className={styles.badge}>Live Tools</span>
          </div>
        </div>
      </div>

      <div className={`${styles.dropdown} ${activeTool ? styles.open : ''}`}>
        <div className={styles.dropdownContent}>
          {activeTool === 'metronome' && <Metronome />}
          {activeTool === 'tuner' && <Tuner />}
        </div>
      </div>
    </div>
  );
}
