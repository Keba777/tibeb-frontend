'use client';

import { useState, useRef } from 'react';
import type { FlashCard } from '@/src/types';

interface FlashcardProps {
  card: FlashCard;
  index: number;
  total: number;
  onKnown: () => void;
  onNeedsReview: () => void;
}

/**
 * Flashcard — 3D flip animation on tap/click, swipe gesture support.
 * Property 25: "known" cards move to end of deck.
 */
export function Flashcard({ card, index, total, onKnown, onNeedsReview }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 60) {
      dx > 0 ? onKnown() : onNeedsReview();
    }
    touchStartX.current = null;
  };

  return (
    <div className="space-y-4">
      {/* Progress indicator (task 17.1.3) */}
      <div className="flex items-center justify-between text-sm text-on-surface-variant">
        <span>Card {index + 1} of {total}</span>
        <div className="w-32 bg-surface-container-high rounded-full h-2">
          <div className="bg-secondary h-2 rounded-full transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </div>

      {/* 3D flip card (task 17.1.1) */}
      <div
        className="relative h-64 cursor-pointer"
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped((f) => !f)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        role="button"
        aria-label={flipped ? 'Answer side. Click to flip back.' : 'Question side. Click to reveal answer.'}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setFlipped((f) => !f)}
      >
        <div
          className="absolute inset-0 transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div className="absolute inset-0 bg-surface-container-lowest rounded-3xl shadow-ambient flex flex-col items-center justify-center p-8 text-center"
            style={{ backfaceVisibility: 'hidden' }}>
            <p className="text-xs font-bold text-outline uppercase tracking-widest mb-4">Prompt</p>
            <p className="text-lg font-medium text-on-surface">{card.prompt}</p>
            <p className="text-xs text-outline mt-6">Tap to reveal answer</p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 bg-primary rounded-3xl shadow-ambient flex flex-col items-center justify-center p-8 text-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <p className="text-xs font-bold text-primary-fixed-dim uppercase tracking-widest mb-4">Answer</p>
            <p className="text-lg font-medium text-on-primary">{card.answer}</p>
          </div>
        </div>
      </div>

      {/* Action buttons (task 17.1.2) */}
      {flipped && (
        <div className="flex gap-3">
          <button onClick={onNeedsReview}
            className="flex-1 bg-error-container text-on-error-container py-3 rounded-2xl font-bold text-sm hover:scale-[1.02] transition-transform">
            Needs Review
          </button>
          <button onClick={onKnown}
            className="flex-1 bg-primary text-on-primary py-3 rounded-2xl font-bold text-sm hover:scale-[1.02] transition-transform">
            Known ✓
          </button>
        </div>
      )}
    </div>
  );
}
