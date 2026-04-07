import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Pure streak calculation — mirrors backend logic in TypeScript
function calculateStreak(studyDates: string[]): number {
  const unique = [...new Set(studyDates)].sort();
  if (unique.length === 0) return 0;

  const today = new Date().toISOString().slice(0, 10);
  const mostRecent = unique[unique.length - 1];
  const daysDiff = Math.floor((new Date(today).getTime() - new Date(mostRecent).getTime()) / 86400000);
  if (daysDiff > 1) return 0;

  let streak = 1;
  for (let i = unique.length - 2; i >= 0; i--) {
    const diff = Math.floor((new Date(unique[i + 1]).getTime() - new Date(unique[i]).getTime()) / 86400000);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

// ============================================================
// Property 15 (frontend): Streak calculation correctness
// Feature: tibeb-platform, Property 15 frontend
// Validates: Requirements 5.7, 10.2
// ============================================================
describe('calculateStreak', () => {
  it('returns 0 for empty dates', () => {
    expect(calculateStreak([])).toBe(0);
  });

  it('returns 1 for today only', () => {
    const today = new Date().toISOString().slice(0, 10);
    expect(calculateStreak([today])).toBe(1);
  });

  it('returns 0 when most recent date is more than 1 day ago', () => {
    const old = new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10);
    expect(calculateStreak([old])).toBe(0);
  });

  // Property: N consecutive days ending today → streak = N
  it('property: N consecutive days ending today gives streak N', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 30 }),
        (n) => {
          const today = new Date();
          const dates = Array.from({ length: n }, (_, i) => {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            return d.toISOString().slice(0, 10);
          });
          expect(calculateStreak(dates)).toBe(n);
        },
      ),
    );
  });
});
