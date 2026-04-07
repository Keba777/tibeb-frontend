'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '@/src/services/api';

const PENDING_KEY = 'tibeb:pending_sessions';
const BREAK_INTERVAL = 25 * 60; // 25 minutes in seconds

export interface StudyTrackerState {
  isRunning: boolean;
  elapsed: number; // seconds
  showBreakPrompt: boolean;
  subjectId: string | null;
  start: (subjectId: string) => void;
  stop: () => Promise<void>;
  dismissBreak: () => void;
}

/**
 * useStudyTracker — timer state, 1s interval, 25-min break prompt,
 * localStorage persistence for failed sessions.
 */
export function useStudyTracker(): StudyTrackerState {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showBreakPrompt, setShowBreakPrompt] = useState(false);
  const [subjectId, setSubjectId] = useState<string | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Retry pending sessions on mount
  useEffect(() => {
    const pending = localStorage.getItem(PENDING_KEY);
    if (!pending) return;
    try {
      const sessions: object[] = JSON.parse(pending);
      Promise.all(sessions.map((s) => api.post('/study/sessions', s)))
        .then(() => localStorage.removeItem(PENDING_KEY))
        .catch(() => { /* keep for next retry */ });
    } catch { /* ignore */ }
  }, []);

  const start = useCallback((sid: string) => {
    setSubjectId(sid);
    setElapsed(0);
    setIsRunning(true);
    startTimeRef.current = new Date();
  }, []);

  const stop = useCallback(async () => {
    if (!isRunning || !startTimeRef.current || !subjectId) return;
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);

    const endedAt = new Date();
    const durationSeconds = Math.floor((endedAt.getTime() - startTimeRef.current.getTime()) / 1000);

    if (durationSeconds < 60) return; // too short

    const session = {
      subject_id: subjectId,
      started_at: startTimeRef.current.toISOString(),
      ended_at: endedAt.toISOString(),
      duration_seconds: durationSeconds,
    };

    try {
      await api.post('/study/sessions', session);
    } catch {
      // Store for retry (task 15.1.4)
      const pending = localStorage.getItem(PENDING_KEY);
      const sessions = pending ? JSON.parse(pending) : [];
      sessions.push(session);
      localStorage.setItem(PENDING_KEY, JSON.stringify(sessions));
    }
  }, [isRunning, subjectId]);

  // 1s interval (task 15.1.2)
  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setElapsed((e) => {
        const next = e + 1;
        // 25-minute break prompt (task 15.1.3)
        if (next > 0 && next % BREAK_INTERVAL === 0) {
          setShowBreakPrompt(true);
        }
        return next;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  return {
    isRunning,
    elapsed,
    showBreakPrompt,
    subjectId,
    start,
    stop,
    dismissBreak: () => setShowBreakPrompt(false),
  };
}
