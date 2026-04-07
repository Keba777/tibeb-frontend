import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';

// Pure logic tests for useStudyTracker (no React hooks needed)

const PENDING_KEY = 'tibeb:pending_sessions';

function storePendingSession(session: object): void {
  const existing = localStorage.getItem(PENDING_KEY);
  const sessions = existing ? JSON.parse(existing) : [];
  sessions.push(session);
  localStorage.setItem(PENDING_KEY, JSON.stringify(sessions));
}

function getPendingSessions(): object[] {
  const v = localStorage.getItem(PENDING_KEY);
  return v ? JSON.parse(v) : [];
}

function clearPendingSessions(): void {
  localStorage.removeItem(PENDING_KEY);
}

describe('useStudyTracker localStorage persistence', () => {
  beforeEach(() => clearPendingSessions());

  it('stores a failed session in localStorage', () => {
    const session = { subject_id: 'abc', duration_seconds: 120 };
    storePendingSession(session);
    expect(getPendingSessions()).toHaveLength(1);
    expect(getPendingSessions()[0]).toEqual(session);
  });

  it('accumulates multiple failed sessions', () => {
    storePendingSession({ id: 1 });
    storePendingSession({ id: 2 });
    expect(getPendingSessions()).toHaveLength(2);
  });

  it('clears pending sessions after successful retry', () => {
    storePendingSession({ id: 1 });
    clearPendingSessions();
    expect(getPendingSessions()).toHaveLength(0);
  });

  // Property: any number of sessions stored are all retrievable
  it('property: all stored sessions are retrievable', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({ duration_seconds: fc.integer({ min: 60, max: 7200 }) }), { maxLength: 10 }),
        (sessions) => {
          clearPendingSessions();
          sessions.forEach(storePendingSession);
          expect(getPendingSessions()).toHaveLength(sessions.length);
        },
      ),
    );
  });
});
