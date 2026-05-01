'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Plus, Minus } from 'lucide-react';
import styles from './Metronome.module.css';

export default function Metronome() {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beat, setBeat] = useState(0);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const currentBeatInBarRef = useRef(0);
  const timerIDRef = useRef<number | null>(null);

  const lookahead = 25.0; // How frequently to call scheduling function (in milliseconds)
  const scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (timerIDRef.current !== null) {
        window.clearTimeout(timerIDRef.current);
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const nextNote = () => {
    const secondsPerBeat = 60.0 / bpm;
    nextNoteTimeRef.current += secondsPerBeat;
    currentBeatInBarRef.current = (currentBeatInBarRef.current + 1) % beatsPerMeasure;
    // We update state just for UI visualizer
    setBeat(currentBeatInBarRef.current);
  };

  const scheduleNote = (beatNumber: number, time: number) => {
    if (!audioCtxRef.current) return;
    
    const osc = audioCtxRef.current.createOscillator();
    const envelope = audioCtxRef.current.createGain();

    osc.connect(envelope);
    envelope.connect(audioCtxRef.current.destination);

    if (beatNumber === 0) {
      osc.frequency.value = 880.0; // High pitch for beat 1
    } else {
      osc.frequency.value = 440.0; // Lower pitch for other beats
    }

    envelope.gain.value = 1;
    envelope.gain.exponentialRampToValueAtTime(1, time + 0.001);
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.02);

    osc.start(time);
    osc.stop(time + 0.03);
  };

  const scheduler = () => {
    if (!audioCtxRef.current) return;
    
    while (nextNoteTimeRef.current < audioCtxRef.current.currentTime + scheduleAheadTime) {
      scheduleNote(currentBeatInBarRef.current, nextNoteTimeRef.current);
      nextNote();
    }
    timerIDRef.current = window.setTimeout(scheduler, lookahead);
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (timerIDRef.current !== null) {
        window.clearTimeout(timerIDRef.current);
      }
      setIsPlaying(false);
      setBeat(0);
      currentBeatInBarRef.current = 0;
    } else {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      setIsPlaying(true);
      currentBeatInBarRef.current = 0;
      nextNoteTimeRef.current = audioCtxRef.current.currentTime + 0.05;
      scheduler();
    }
  };

  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBpm(Number(e.target.value));
  };

  const adjustBpm = (amount: number) => {
    setBpm((prev) => Math.min(240, Math.max(40, prev + amount)));
  };

  return (
    <div className={styles.metronome}>
      <div className={styles.header}>
        <h3 className={styles.title}>Practice Metronome</h3>
        <span className={styles.bpmDisplay}>{bpm} BPM</span>
      </div>

      <div className={styles.controls}>
        <button className={styles.adjustBtn} onClick={() => adjustBpm(-1)} disabled={bpm <= 40}>
          <Minus size={20} />
        </button>
        <input 
          type="range" 
          min="40" 
          max="240" 
          value={bpm} 
          onChange={handleBpmChange}
          className={styles.slider} 
        />
        <button className={styles.adjustBtn} onClick={() => adjustBpm(1)} disabled={bpm >= 240}>
          <Plus size={20} />
        </button>
      </div>

      <div className={styles.timeSignature}>
        <label>Time Signature:</label>
        <select 
          value={beatsPerMeasure} 
          onChange={(e) => setBeatsPerMeasure(Number(e.target.value))}
          className={styles.select}
        >
          <option value="2">2/4</option>
          <option value="3">3/4</option>
          <option value="4">4/4</option>
          <option value="5">5/4</option>
          <option value="6">6/8</option>
        </select>
      </div>

      <div className={styles.visualizer}>
        {Array.from({ length: beatsPerMeasure }).map((_, i) => (
          <div 
            key={i} 
            className={`${styles.beatIndicator} ${isPlaying && beat === i ? styles.beatActive : ''} ${i === 0 ? styles.beatFirst : ''}`}
          />
        ))}
      </div>

      <button 
        className={`${styles.playBtn} ${isPlaying ? styles.playBtnActive : ''}`} 
        onClick={togglePlay}
      >
        {isPlaying ? (
          <><Square size={20} /> Stop</>
        ) : (
          <><Play size={20} /> Start</>
        )}
      </button>
    </div>
  );
}
