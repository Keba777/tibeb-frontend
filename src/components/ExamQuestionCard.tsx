'use client';

import { useState } from 'react';
import type { ExamQuestion, AnswerResult } from '@/src/types';

interface ExamQuestionCardProps {
  question: ExamQuestion;
  onSubmit: (answer: string) => Promise<AnswerResult>;
}

export function ExamQuestionCard({ question, onSubmit }: ExamQuestionCardProps) {
  const [selected, setSelected] = useState('');
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!selected.trim()) return;
    setLoading(true);
    try {
      const r = await onSubmit(selected);
      setResult(r);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-ambient space-y-4">
      {/* AI badge (task 16.1.4) */}
      {question.isAiGenerated && (
        <span className="inline-block bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold px-3 py-1 rounded-full">
          AI Generated
        </span>
      )}

      <p className="font-medium text-on-surface leading-relaxed">{question.questionText}</p>

      {/* MC choices */}
      {question.questionType === 'multiple_choice' && question.choices && (
        <div className="space-y-2" role="radiogroup" aria-label="Answer choices">
          {question.choices.map((choice, i) => (
            <button key={i} onClick={() => !result && setSelected(choice)}
              disabled={!!result}
              aria-pressed={selected === choice}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                result
                  ? choice === result.correctAnswer
                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                    : choice === result.submittedAnswer && !result.isCorrect
                    ? 'bg-error/10 text-error border-l-4 border-error'
                    : 'bg-surface-container-high text-on-surface-variant'
                  : selected === choice
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
              }`}>
              {choice}
            </button>
          ))}
        </div>
      )}

      {/* Short answer */}
      {question.questionType === 'short_answer' && (
        <input type="text" value={selected} onChange={(e) => setSelected(e.target.value)}
          disabled={!!result}
          placeholder="Your answer…"
          className="w-full bg-surface-container-highest px-4 py-3 rounded-xl text-on-surface placeholder:text-outline focus:outline-none border-b-2 border-transparent focus:border-primary transition-colors disabled:opacity-60"
          aria-label="Short answer input"
        />
      )}

      {/* Feedback (task 16.1.2) */}
      {result && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${result.isCorrect ? 'bg-primary/10 text-primary' : 'bg-error-container text-on-error-container'}`}
          role="status">
          {result.isCorrect ? '✓ Correct!' : `✗ Incorrect. Correct answer: ${result.correctAnswer}`}
        </div>
      )}

      {!result && (
        <button onClick={handleSubmit} disabled={!selected.trim() || loading}
          className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-xl font-bold text-sm shadow-ambient hover:scale-[1.02] transition-transform disabled:opacity-60">
          {loading ? 'Checking…' : 'Submit'}
        </button>
      )}
    </div>
  );
}
