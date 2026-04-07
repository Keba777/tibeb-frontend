/**
 * Pure dashboard utility functions — no React dependency, easy to property-test.
 */

import type { SubjectStudyTotal } from '@/src/types';

/**
 * Calculate the progress ring ratio for a subject.
 * Returns min(sessions / goal, 1.0).
 *
 * Property 27: For any S and G, result === min(S / G, 1.0)
 */
export function progressRingRatio(sessions: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(sessions / goal, 1.0);
}

/**
 * Aggregate total study seconds per subject from a list of totals.
 * Returns a map of subjectId → totalSeconds.
 *
 * Property 14 (frontend): sum of all totals equals the sum of individual durations.
 */
export function aggregateWeeklyTotals(
  totals: SubjectStudyTotal[],
): Record<string, number> {
  return totals.reduce<Record<string, number>>((acc, t) => {
    acc[t.subjectId] = (acc[t.subjectId] ?? 0) + t.totalSeconds;
    return acc;
  }, {});
}

/** Format seconds as "Xh Ym" or "Ym" */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
