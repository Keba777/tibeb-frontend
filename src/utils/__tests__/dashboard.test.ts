import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { progressRingRatio, aggregateWeeklyTotals } from '../dashboard';
import type { SubjectStudyTotal } from '@/src/types';

// ============================================================
// Property 27: Progress ring ratio calculation
// Feature: tibeb-platform, Property 27
// Validates: Requirements 10.6
// ============================================================
describe('progressRingRatio', () => {
  it('returns 0 when goal is 0', () => {
    expect(progressRingRatio(5, 0)).toBe(0);
  });

  it('returns 1.0 when sessions equals goal', () => {
    expect(progressRingRatio(7, 7)).toBe(1.0);
  });

  it('caps at 1.0 when sessions exceeds goal', () => {
    expect(progressRingRatio(10, 5)).toBe(1.0);
  });

  it('returns fractional ratio when sessions < goal', () => {
    expect(progressRingRatio(3, 6)).toBeCloseTo(0.5);
  });

  // Property 27: For any S ≥ 0 and G > 0, result === min(S / G, 1.0)
  it('property: result equals min(S/G, 1.0) for all valid inputs', () => {
    fc.assert(
      fc.property(
        fc.nat({ max: 100 }),          // sessions
        fc.integer({ min: 1, max: 100 }), // goal (> 0)
        (sessions, goal) => {
          const result = progressRingRatio(sessions, goal);
          const expected = Math.min(sessions / goal, 1.0);
          expect(Math.abs(result - expected)).toBeLessThan(1e-10);
          expect(result).toBeGreaterThanOrEqual(0);
          expect(result).toBeLessThanOrEqual(1.0);
        },
      ),
    );
  });
});

// ============================================================
// Property 14 (frontend): Weekly total aggregation
// Feature: tibeb-platform, Property 14 frontend
// Validates: Requirements 5.5, 10.1
// ============================================================
describe('aggregateWeeklyTotals', () => {
  it('returns empty object for empty input', () => {
    expect(aggregateWeeklyTotals([])).toEqual({});
  });

  it('sums totals for the same subject', () => {
    const totals: SubjectStudyTotal[] = [
      { subjectId: 'a', totalSeconds: 100 },
      { subjectId: 'a', totalSeconds: 200 },
      { subjectId: 'b', totalSeconds: 50 },
    ];
    const result = aggregateWeeklyTotals(totals);
    expect(result['a']).toBe(300);
    expect(result['b']).toBe(50);
  });

  // Property: sum of all aggregated values equals sum of all input totalSeconds
  it('property: total sum is preserved after aggregation', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            subjectId: fc.constantFrom('s1', 's2', 's3'),
            totalSeconds: fc.nat({ max: 3600 }),
          }),
          { maxLength: 20 },
        ),
        (totals: SubjectStudyTotal[]) => {
          const inputSum = totals.reduce((s, t) => s + t.totalSeconds, 0);
          const aggregated = aggregateWeeklyTotals(totals);
          const outputSum = Object.values(aggregated).reduce((s, v) => s + v, 0);
          expect(outputSum).toBe(inputSum);
        },
      ),
    );
  });
});
