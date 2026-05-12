'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Settings } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import styles from './Tuner.module.css';

const INSTRUMENTS = {
  GUITAR_6: {
    name: 'tuner.guitar6',
    tunings: {
      STANDARD: {
        name: 'tuning.standard',
        notes: [
          { note: 'E', freq: 82.41, oct: 2 },
          { note: 'A', freq: 110.00, oct: 2 },
          { note: 'D', freq: 146.83, oct: 3 },
          { note: 'G', freq: 196.00, oct: 3 },
          { note: 'B', freq: 246.94, oct: 3 },
          { note: 'E', freq: 329.63, oct: 4 },
        ]
      },
      DROP_D: {
        name: 'tuning.dropD',
        notes: [
          { note: 'D', freq: 73.42, oct: 2 },
          { note: 'A', freq: 110.00, oct: 2 },
          { note: 'D', freq: 146.83, oct: 3 },
          { note: 'G', freq: 196.00, oct: 3 },
          { note: 'B', freq: 246.94, oct: 3 },
          { note: 'E', freq: 329.63, oct: 4 },
        ]
      },
      DROP_C: {
        name: 'tuning.dropC',
        notes: [
          { note: 'C', freq: 65.41, oct: 2 },
          { note: 'G', freq: 98.00, oct: 2 },
          { note: 'C', freq: 130.81, oct: 3 },
          { note: 'F', freq: 174.61, oct: 3 },
          { note: 'A', freq: 220.00, oct: 3 },
          { note: 'D', freq: 293.66, oct: 4 },
        ]
      },
      DADGAD: {
        name: 'tuning.dadgad',
        notes: [
          { note: 'D', freq: 73.42, oct: 2 },
          { note: 'A', freq: 110.00, oct: 2 },
          { note: 'D', freq: 146.83, oct: 3 },
          { note: 'G', freq: 196.00, oct: 3 },
          { note: 'A', freq: 220.00, oct: 3 },
          { note: 'D', freq: 293.66, oct: 4 },
        ]
      },
      OPEN_G: {
        name: 'tuning.openG',
        notes: [
          { note: 'D', freq: 73.42, oct: 2 },
          { note: 'G', freq: 98.00, oct: 2 },
          { note: 'D', freq: 146.83, oct: 3 },
          { note: 'G', freq: 196.00, oct: 3 },
          { note: 'B', freq: 246.94, oct: 3 },
          { note: 'D', freq: 293.66, oct: 4 },
        ]
      }
    }
  },
  BASS_4: {
    name: 'tuner.bass4',
    tunings: {
      STANDARD: {
        name: 'tuning.standard',
        notes: [
          { note: 'E', freq: 41.20, oct: 1 },
          { note: 'A', freq: 55.00, oct: 1 },
          { note: 'D', freq: 73.42, oct: 2 },
          { note: 'G', freq: 98.00, oct: 2 },
        ]
      },
      DROP_D: {
        name: 'tuning.dropD',
        notes: [
          { note: 'D', freq: 36.71, oct: 1 },
          { note: 'A', freq: 55.00, oct: 1 },
          { note: 'D', freq: 73.42, oct: 2 },
          { note: 'G', freq: 98.00, oct: 2 },
        ]
      }
    }
  },
  BASS_5: {
    name: 'tuner.bass5',
    tunings: {
      STANDARD: {
        name: 'tuning.standard',
        notes: [
          { note: 'B', freq: 30.87, oct: 0 },
          { note: 'E', freq: 41.20, oct: 1 },
          { note: 'A', freq: 55.00, oct: 1 },
          { note: 'D', freq: 73.42, oct: 2 },
          { note: 'G', freq: 98.00, oct: 2 },
        ]
      }
    }
  },
  UKULELE: {
    name: 'tuner.ukulele',
    tunings: {
      STANDARD: {
        name: 'tuning.standard',
        notes: [
          { note: 'G', freq: 392.00, oct: 4 },
          { note: 'C', freq: 261.63, oct: 4 },
          { note: 'E', freq: 329.63, oct: 4 },
          { note: 'A', freq: 440.00, oct: 4 },
        ]
      }
    }
  }
};

export default function Tuner() {
  const { t } = useI18n();
  const [instrument, setInstrument] = useState<keyof typeof INSTRUMENTS>('GUITAR_6');
  const [tuning, setTuning] = useState<string>('STANDARD');
  const [isListening, setIsListening] = useState(false);
  const [pitch, setPitch] = useState<number | null>(null);
  const [closestNote, setClosestNote] = useState<any>(null);
  const [diff, setDiff] = useState(0); 
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  const startTuner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 4096; // Increased FFT size for better low-frequency detection (bass)
      source.connect(analyser);
      analyserRef.current = analyser;
      
      setIsListening(true);
      updatePitch();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      alert(t('tuner.micError'));
    }
  };

  const stopTuner = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (audioCtxRef.current) audioCtxRef.current.close();
    
    setIsListening(false);
    setPitch(null);
    setClosestNote(null);
  };

  const updatePitch = () => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.fftSize;
    const buffer = new Float32Array(bufferLength);
    analyserRef.current.getFloatTimeDomainData(buffer);
    
    const freq = autoCorrelate(buffer, audioCtxRef.current!.sampleRate);
    
    if (freq !== -1) {
      setPitch(freq);
      findClosestNote(freq);
    }
    
    animationRef.current = requestAnimationFrame(updatePitch);
  };

  const findClosestNote = (freq: number) => {
    const tunings = INSTRUMENTS[instrument].tunings as any;
    const notes = tunings[tuning].notes;
    let minDiff = Infinity;
    let closest = null;

    notes.forEach((n: { freq: number; note: string; oct: number }) => {
      const difference = 1200 * Math.log2(freq / n.freq);
      if (Math.abs(difference) < Math.abs(minDiff)) {
        minDiff = difference;
        closest = n;
      }
    });

    if (Math.abs(minDiff) < 100) {
      setClosestNote(closest);
      setDiff(minDiff);
    } else {
      setClosestNote(null);
    }
  };

  const autoCorrelate = (buffer: Float32Array, sampleRate: number) => {
    const SIZE = buffer.length;
    let rms = 0;

    for (let i = 0; i < SIZE; i++) {
      rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1;

    let r1 = 0, r2 = SIZE - 1, thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buffer[SIZE - i]) < thres) { r2 = SIZE - i; break; }
    }

    const bufferShort = buffer.slice(r1, r2);
    const newSize = bufferShort.length;

    const c = new Array(newSize).fill(0);
    for (let i = 0; i < newSize; i++) {
      for (let j = 0; j < newSize - i; j++) {
        c[i] = c[i] + bufferShort[j] * bufferShort[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < newSize; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;

    const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    const a = (x1 + x3 - 2 * x2) / 2;
    const b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  };

  const handleInstrumentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newInst = e.target.value as keyof typeof INSTRUMENTS;
    setInstrument(newInst);
    setTuning('STANDARD'); // Reset to standard when changing instrument
  };

  return (
    <div className={styles.tuner}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h3 className={styles.title}>{t('tools.tuner')}</h3>
          <div className={styles.selectors}>
            <select 
              value={instrument} 
              onChange={handleInstrumentChange}
              className={styles.select}
            >
              {Object.entries(INSTRUMENTS).map(([key, value]) => (
                <option key={key} value={key}>{t(value.name)}</option>
              ))}
            </select>
            
            <select 
              value={tuning} 
              onChange={(e) => setTuning(e.target.value)}
              className={styles.select}
            >
              {Object.entries(INSTRUMENTS[instrument].tunings).map(([key, value]) => (
                <option key={key} value={key}>{t(value.name)}</option>
              ))}
            </select>
          </div>
        </div>
        
        <button 
          className={`${styles.toggleBtn} ${isListening ? styles.active : ''}`}
          onClick={isListening ? stopTuner : startTuner}
        >
          {isListening ? <Mic size={20} /> : <MicOff size={20} />}
          <span>{isListening ? t('tuner.stop') : t('tuner.start')}</span>
        </button>
      </div>

      <div className={styles.display}>
        {closestNote ? (
          <div className={styles.noteContainer}>
            <div className={styles.noteName}>
              {closestNote.note}
              <span className={styles.octave}>{closestNote.oct}</span>
            </div>
            <div className={styles.status}>
              {Math.abs(diff) < 5 ? (
                <span className={styles.inTune}>{t('tuner.inTune')}</span>
              ) : diff < 0 ? (
                <span className={styles.flat}>{t('tuner.flat')}</span>
              ) : (
                <span className={styles.sharp}>{t('tuner.sharp')}</span>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.listening}>
            {isListening ? t('tuner.listening') : '--'}
          </div>
        )}

        <div className={styles.gauge}>
          <div className={styles.gaugeLine} />
          <div 
            className={styles.needle} 
            style={{ 
              transform: `translateX(-50%) rotate(${closestNote ? Math.max(-45, Math.min(45, diff)) : 0}deg)` 
            }} 
          />
          <div className={styles.centerPoint} />
        </div>
      </div>

      <div className={styles.noteList}>
        {(INSTRUMENTS[instrument].tunings as any)[tuning].notes.map((n: any, i: number) => (
          <div 
            key={i} 
            className={`${styles.noteItem} ${closestNote?.freq === n.freq ? styles.noteActive : ''}`}
          >
            {n.note}
          </div>
        ))}
      </div>
    </div>
  );
}
