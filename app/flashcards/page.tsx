'use client';

import { useState } from 'react';
import { Flashcard } from '@/src/components/Flashcard';
import { api } from '@/src/services/api';
import type { AiFlashcards, FlashCard } from '@/src/types';

/** Move card at `index` to end of deck — Property 25 */
function moveKnownToEnd(cards: FlashCard[], index: number): FlashCard[] {
  const known = cards[index];
  return [...cards.slice(0, index), ...cards.slice(index + 1), known];
}

export default function FlashcardsPage() {
  const [deckId, setDeckId] = useState<string | null>(null);
  const [cards, setCards] = useState<FlashCard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [noteId, setNoteId] = useState('');

  const generateFromNote = async () => {
    if (!noteId.trim()) return;
    setLoading(true);
    try {
      const res = await api.post<AiFlashcards>('/ai/flashcards', { source: { type: 'note', note_id: noteId } });
      setDeckId(res.id);
      setCards(res.cards);
      setCurrentIdx(0);
    } finally {
      setLoading(false);
    }
  };

  const handleKnown = async () => {
    if (deckId) {
      await api.put(`/ai/flashcards/${deckId}/review?card_index=${currentIdx}`, { status: 'known' }).catch(() => {});
    }
    const reordered = moveKnownToEnd(cards, currentIdx);
    setCards(reordered);
    // Stay at same index (now points to next card)
    if (currentIdx >= reordered.length) setCurrentIdx(0);
  };

  const handleNeedsReview = async () => {
    if (deckId) {
      await api.put(`/ai/flashcards/${deckId}/review?card_index=${currentIdx}`, { status: 'needs_review' }).catch(() => {});
    }
    setCurrentIdx((i) => (i + 1) % cards.length);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <h1 className="font-headline text-3xl font-extrabold text-primary">Flashcards</h1>

      {cards.length === 0 ? (
        <div className="space-y-4">
          <p className="text-on-surface-variant text-sm">Generate flashcards from a note or textbook section.</p>
          <div className="flex gap-3">
            <input type="text" value={noteId} onChange={(e) => setNoteId(e.target.value)}
              placeholder="Note ID"
              className="flex-1 bg-surface-container-highest px-4 py-3 rounded-xl text-on-surface placeholder:text-outline focus:outline-none border-b-2 border-transparent focus:border-primary transition-colors"
              aria-label="Note ID for flashcard generation"
            />
            <button onClick={generateFromNote} disabled={loading || !noteId.trim()}
              className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-3 rounded-xl font-bold text-sm shadow-ambient hover:scale-[1.02] transition-transform disabled:opacity-60">
              {loading ? 'Generating…' : 'Generate'}
            </button>
          </div>
        </div>
      ) : (
        <Flashcard
          card={cards[currentIdx]}
          index={currentIdx}
          total={cards.length}
          onKnown={handleKnown}
          onNeedsReview={handleNeedsReview}
        />
      )}
    </div>
  );
}
