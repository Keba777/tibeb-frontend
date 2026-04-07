import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as fc from 'fast-check';
import { SubjectCard } from '../SubjectCard';
import type { Subject } from '@/src/types';

// ============================================================
// Property 6: Bilingual subject display
// Feature: tibeb-platform, Property 6
// Validates: Requirements 2.3
// ============================================================
describe('SubjectCard', () => {
  it('renders both English and Amharic names', () => {
    const subject: Subject = {
      id: '1',
      nameEn: 'Mathematics',
      nameAm: 'ሒሳብ',
      grade: 9,
    };
    render(<SubjectCard subject={subject} />);
    expect(screen.getByText('Mathematics')).toBeTruthy();
    expect(screen.getByText('ሒሳብ')).toBeTruthy();
  });

  it('renders the grade badge', () => {
    const subject: Subject = { id: '1', nameEn: 'Physics', nameAm: 'ፊዚክስ', grade: 11 };
    render(<SubjectCard subject={subject} />);
    expect(screen.getByText('Grade 11')).toBeTruthy();
  });

  // Property 6: For any subject, the card SHALL contain both nameEn and nameAm
  it('property: always renders both language names', () => {
    // Use a non-empty string with visible content so getByText can locate it.
    // getByText normalizes whitespace, so we need at least one non-whitespace char.
    const visibleString = fc
      .string({ minLength: 1, maxLength: 50 })
      .map(s => s.trim())
      .filter(s => s.length > 0);

    fc.assert(
      fc.property(
        fc.record({
          id: fc.uuid(),
          nameEn: visibleString,
          nameAm: visibleString,
          grade: fc.integer({ min: 7, max: 12 }),
        }),
        (subject: Subject) => {
          const { unmount } = render(<SubjectCard subject={subject} />);
          expect(screen.getByText(subject.nameEn)).toBeTruthy();
          expect(screen.getByText(subject.nameAm)).toBeTruthy();
          unmount();
        },
      ),
    );
  });
});
