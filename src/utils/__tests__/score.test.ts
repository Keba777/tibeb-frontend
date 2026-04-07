import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Pure score calculation
function calculateScorePercent(correct: number, total: number): number {
  if (total === 0) return 0;
  return (correct / total) * 100;
}

// ============================================================
// Property 20 (frontend): Exam score calculation
// Feature: tibeb-platform, Property 20 frontend
// Validates: Requirements 6.6
// ============================================================
describe('calculateScorePercent', () => {
  it('returns 0 for 0 total', () => {
    expect(calculateScorePercent(0, 0)).toBe(0);
  });

  it('returns 100 for all correct', () => {
    expect(calculateScorePercent(10, 10)).toBe(100);
  });

  it('returns 50 for half correct', () => {
    expect(calculateScorePercent(5, 10)).toBe(50);
  });

  // Property: score = (correct / total) * 100 for any valid inputs
  it('property: score equals (correct/total)*100', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        fc.float({ min: 0, max: 1 }),
        (total, frac) => {
          const correct = Math.floor(total * frac);
          const score = calculateScorePercent(correct, total);
          const expected = (correct / total) * 100;
          expect(Math.abs(score - expected)).toBeLessThan(1e-9);
        },
      ),
    );
  });
});
