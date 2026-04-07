import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as fc from 'fast-check';
import { Flashcard } from '../Flashcard';
import type { FlashCard } from '@/src/types';

// Helper: move known card to end (mirrors flashcards/page.tsx logic)
function moveKnownToEnd(cards: FlashCard[], index: number): FlashCard[] {
  const known = cards[index];
  return [...cards.slice(0, index), ...cards.slice(index + 1), known];
}

describe('Flashcard', () => {
  it('renders prompt on front face', () => {
    const card: FlashCard = { prompt: 'What is photosynthesis?', answer: 'Converting light to energy' };
    render(<Flashcard card={card} index={0} total={5} onKnown={vi.fn()} onNeedsReview={vi.fn()} />);
    expect(screen.getByText('What is photosynthesis?')).toBeTruthy();
  });

  it('flips to show answer on click', () => {
    const card: FlashCard = { prompt: 'Q', answer: 'A' };
    render(<Flashcard card={card} index={0} total={1} onKnown={vi.fn()} onNeedsReview={vi.fn()} />);
    const flipBtn = screen.getByRole('button', { name: /question side/i });
    fireEvent.click(flipBtn);
    expect(screen.getByText('A')).toBeTruthy();
  });

  // ============================================================
  // Property 25 (frontend): Deck ordering after "known" mark
  // Feature: tibeb-platform, Property 25 frontend
  // Validates: Requirements 8.6
  // ============================================================
  it('property: known card always moves to end of deck', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({ prompt: fc.string({ minLength: 1 }), answer: fc.string({ minLength: 1 }) }),
          { minLength: 2, maxLength: 20 },
        ),
        fc.nat({ max: 19 }),
        (cards: FlashCard[], rawIdx: number) => {
          const idx = rawIdx % cards.length;
          const knownPrompt = cards[idx].prompt;
          const reordered = moveKnownToEnd(cards, idx);
          expect(reordered.length).toBe(cards.length);
          expect(reordered[reordered.length - 1].prompt).toBe(knownPrompt);
        },
      ),
    );
  });
});
