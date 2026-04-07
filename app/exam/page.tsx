'use client';

import { useState, useEffect } from 'react';
import { ExamQuestionCard } from '@/src/components/ExamQuestionCard';
import { api } from '@/src/services/api';
import type { ExamQuestion, AnswerResult, Subject } from '@/src/types';

interface SessionResult { question: ExamQuestion; result: AnswerResult }

export default function ExamPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [grade, setGrade] = useState(9);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get<Subject[]>('/subjects').then(setSubjects).catch(() => {});
  }, []);

  const loadQuestions = async () => {
    if (!selectedSubject) return;
    setLoading(true);
    try {
      const qs = await api.get<ExamQuestion[]>(`/exams/questions?subject_id=${selectedSubject}&grade=${grade}`);
      setQuestions(qs);
      setCurrentIdx(0);
      setSessionResults([]);
      setShowSummary(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (answer: string): Promise<AnswerResult> => {
    const q = questions[currentIdx];
    const result = await api.post<AnswerResult>('/exams/answers', { question_id: q.id, submitted_answer: answer });
    const newResults = [...sessionResults, { question: q, result }];
    setSessionResults(newResults);
    if (currentIdx + 1 >= questions.length) {
      setTimeout(() => setShowSummary(true), 1500);
    } else {
      setTimeout(() => setCurrentIdx((i) => i + 1), 1500);
    }
    return result;
  };

  const score = sessionResults.filter((r) => r.result.isCorrect).length;

  if (showSummary) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <h1 className="font-headline text-3xl font-extrabold text-primary">Session Summary</h1>
        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-ambient text-center">
          <p className="text-5xl font-black text-primary font-headline">{Math.round((score / sessionResults.length) * 100)}%</p>
          <p className="text-on-surface-variant mt-2">{score} / {sessionResults.length} correct</p>
        </div>
        <div className="space-y-3">
          {sessionResults.map(({ question, result }, i) => (
            <div key={i} className={`px-4 py-3 rounded-xl text-sm ${result.isCorrect ? 'bg-primary/10 text-primary' : 'bg-error-container text-on-error-container'}`}>
              <p className="font-medium">{question.questionText}</p>
              {!result.isCorrect && <p className="mt-1 text-xs">Correct: {result.correctAnswer}</p>}
            </div>
          ))}
        </div>
        <button onClick={() => { setShowSummary(false); setQuestions([]); }}
          className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold hover:scale-[1.02] transition-transform">
          New Session
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <h1 className="font-headline text-3xl font-extrabold text-primary">Exam Practice</h1>

      {questions.length === 0 ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {subjects.map((s) => (
              <button key={s.id} onClick={() => setSelectedSubject(s.id)} aria-pressed={selectedSubject === s.id}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${selectedSubject === s.id ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'}`}>
                {s.nameEn}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {[7,8,9,10,11,12].map((g) => (
              <button key={g} onClick={() => setGrade(g)} aria-pressed={grade === g}
                className={`w-12 h-12 rounded-xl font-bold text-sm transition-colors ${grade === g ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'}`}>
                {g}
              </button>
            ))}
          </div>
          <button onClick={loadQuestions} disabled={!selectedSubject || loading}
            className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-3 rounded-xl font-bold shadow-ambient hover:scale-[1.02] transition-transform disabled:opacity-60">
            {loading ? 'Loading…' : 'Start Practice'}
          </button>
          {/* Empty state (task 16.1.5) */}
          {!loading && selectedSubject && questions.length === 0 && (
            <p className="text-on-surface-variant text-sm">No questions available for this subject and grade. Try another subject.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-on-surface-variant">
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <div className="w-32 bg-surface-container-high rounded-full h-2">
              <div className="bg-secondary h-2 rounded-full transition-all" style={{ width: `${((currentIdx) / questions.length) * 100}%` }} />
            </div>
          </div>
          <ExamQuestionCard question={questions[currentIdx]} onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
}
