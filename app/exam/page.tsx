'use client';

import { useState, useEffect } from 'react';
import { ExamQuestionCard } from '@/src/components/ExamQuestionCard';
import { SubjectCard } from '@/src/components/SubjectCard';
import { api } from '@/src/services/api';
import type { ExamQuestion, AnswerResult, Subject } from '@/src/types';

interface SessionResult { question: ExamQuestion; result: AnswerResult }

const GRADES = [7, 8, 9, 10, 11, 12];

export default function ExamPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get<Subject[]>('/subjects').then(setSubjects).catch(() => {});
  }, []);

  const loadQuestions = async (subject: Subject) => {
    setLoading(true);
    setSelectedSubject(subject);
    try {
      const qs = await api.get<ExamQuestion[]>(`/exams/questions?subject_id=${subject.id}&grade=${subject.grade}`);
      setQuestions(qs);
      setCurrentIdx(0);
      setSessionResults([]);
      setShowSummary(false);
    } catch (err) {
      console.error('Failed to load questions:', err);
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

  const filteredSubjects = selectedGrade
    ? subjects.filter((s) => s.grade === selectedGrade)
    : subjects;

  const score = sessionResults.filter((r) => r.result.isCorrect).length;

  if (showSummary) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6 text-center">
        <h1 className="font-headline text-3xl font-extrabold text-primary">Session Summary</h1>
        <div className="bg-surface-container-lowest rounded-3xl p-10 shadow-ambient">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl font-black text-primary font-headline">
              {sessionResults.length > 0 ? Math.round((score / sessionResults.length) * 100) : 0}%
            </span>
          </div>
          <p className="text-on-surface-variant font-medium">{score} out of {sessionResults.length} correct</p>
        </div>
        <div className="space-y-3 text-left">
          {sessionResults.map(({ question, result }, i) => (
            <div key={i} className={`p-4 rounded-2xl text-sm border ${result.isCorrect ? 'bg-primary/5 border-primary/10 text-primary' : 'bg-error-container/20 border-error/10 text-on-error-container'}`}>
              <p className="font-bold mb-1">Q: {question.questionText}</p>
              {!result.isCorrect && (
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="font-bold opacity-70">Correct:</span>
                  <span className="font-black">{result.correctAnswer}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <button onClick={() => { setShowSummary(false); setQuestions([]); setSelectedSubject(null); }}
          className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold shadow-ambient hover:scale-[1.02] transition-transform">
          Try Another Subject
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline text-3xl font-extrabold text-primary">Exam Practice</h1>
          <p className="text-on-surface-variant mt-1">Challenge yourself with curriculum-aligned questions</p>
        </div>

        {questions.length > 0 && (
          <button
            onClick={() => { setQuestions([]); setSelectedSubject(null); }}
            className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" /></svg>
            Back to Selection
          </button>
        )}
      </div>

      {questions.length === 0 ? (
        <div className="space-y-8">
          {/* Grade filter */}
          <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by grade">
            <button
              onClick={() => setSelectedGrade(null)}
              aria-pressed={selectedGrade === null}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${selectedGrade === null ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'}`}
            >
              All
            </button>
            {GRADES.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                aria-pressed={selectedGrade === g}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${selectedGrade === g ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'}`}
              >
                Grade {g}
              </button>
            ))}
          </div>

          {/* Subject grid */}
          <div className="flex flex-wrap justify-center gap-6">
            {filteredSubjects.map((s) => (
              <div key={s.id} className="w-full sm:w-[280px]" onClick={() => loadQuestions(s)}>
                <SubjectCard subject={s} />
              </div>
            ))}
          </div>

          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/5 backdrop-blur-sm">
              <div className="bg-surface-container-lowest p-8 rounded-3xl shadow-ambient text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="font-bold text-primary">Preparing your practice session...</p>
              </div>
            </div>
          )}

          {!loading && selectedSubject && questions.length === 0 && (
            <div className="text-center py-20 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant max-w-2xl mx-auto">
              <p className="font-bold text-primary mb-1">No questions found</p>
              <p className="text-on-surface-variant text-sm">There are no practice questions available for {selectedSubject.nameEn} (Grade {selectedSubject.grade}) at the moment.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary">{selectedSubject?.nameEn}</span>
              <span className="text-outline">•</span>
              <span className="text-on-surface-variant">Question {currentIdx + 1} of {questions.length}</span>
            </div>
            <div className="w-32 bg-surface-container-high rounded-full h-2">
              <div className="bg-secondary h-2 rounded-full transition-all duration-700" style={{ width: `${((currentIdx) / questions.length) * 100}%` }} />
            </div>
          </div>
          <ExamQuestionCard question={questions[currentIdx]} onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
}
