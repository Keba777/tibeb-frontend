import Link from 'next/link';
import { cookies } from 'next/headers';
import { ProgressRing } from '@/src/components/ProgressRing';
import { StreakCounter } from '@/src/components/StreakCounter';
import { aggregateWeeklyTotals, formatDuration } from '@/src/utils/dashboard';
import type { StudyStats, StreakData, Note, Textbook, SubjectExamScore } from '@/src/types';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:9000';

async function serverFetch<T>(path: string, cookieHeader: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: { Cookie: cookieHeader },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<T>;
  } catch {
    return null;
  }
}

// Weekly goal: 5 sessions per subject
const WEEKLY_GOAL = 5;

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  // Parallel fetch (task 12.1.1)
  const [stats, streakData, examSessions, recentNotes, recentTextbooks] = await Promise.all([
    serverFetch<StudyStats>('/study/stats?period=weekly', cookieHeader),
    serverFetch<StreakData>('/study/streak', cookieHeader),
    serverFetch<{ scores: SubjectExamScore[] }>('/exams/sessions', cookieHeader),
    serverFetch<Note[]>('/notes?subject_id=00000000-0000-0000-0000-000000000000', cookieHeader),
    serverFetch<Textbook[]>('/textbooks', cookieHeader),
  ]);

  const streak = streakData?.streak ?? 0;
  const weeklyTotals = aggregateWeeklyTotals(stats?.totals ?? []);
  const hasActivity = (stats?.totals?.length ?? 0) > 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-headline text-3xl font-extrabold text-primary">Dashboard</h1>
        <p className="text-on-surface-variant mt-1">Your learning overview for this week</p>
      </div>

      {/* Onboarding prompt (task 12.1.6) */}
      {!hasActivity && (
        <div className="bg-surface-container-low rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-on-primary shrink-0">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8" aria-hidden="true">
              <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
            </svg>
          </div>
          <div>
            <h2 className="font-headline font-bold text-xl text-primary mb-1">Start your first session</h2>
            <p className="text-on-surface-variant text-sm mb-4">
              Open a textbook or start a study timer to begin tracking your progress.
            </p>
            <Link
              href="/subjects"
              className="inline-block bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-lg font-bold text-sm shadow-ambient hover:scale-[1.02] transition-transform"
            >
              Browse Subjects
            </Link>
          </div>
        </div>
      )}

      {/* Top row: streak + weekly bar chart */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Streak (task 12.1.3) */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-ambient flex flex-col gap-4">
          <h2 className="font-headline font-bold text-primary">Study Streak</h2>
          <StreakCounter streak={streak} />
        </div>

        {/* Weekly bar chart (task 12.1.4) */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-ambient">
          <h2 className="font-headline font-bold text-primary mb-4">This Week</h2>
          {Object.keys(weeklyTotals).length === 0 ? (
            <p className="text-on-surface-variant text-sm">No sessions recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(weeklyTotals)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 4)
                .map(([subjectId, seconds]) => {
                  const maxSeconds = Math.max(...Object.values(weeklyTotals));
                  const pct = maxSeconds > 0 ? (seconds / maxSeconds) * 100 : 0;
                  return (
                    <div key={subjectId} className="flex items-center gap-3">
                      <span className="text-xs text-on-surface-variant w-20 truncate">{subjectId.slice(0, 8)}</span>
                      <div className="flex-1 bg-surface-container-high rounded-full h-2">
                        <div
                          className="bg-secondary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                          aria-label={formatDuration(seconds)}
                        />
                      </div>
                      <span className="text-xs font-medium text-on-surface-variant w-12 text-right">
                        {formatDuration(seconds)}
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Subject progress rings (task 12.1.1 + 12.1.2) */}
      {hasActivity && (
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-ambient">
          <h2 className="font-headline font-bold text-primary mb-6">Subject Progress</h2>
          <div className="flex flex-wrap gap-6">
            {Object.entries(weeklyTotals).map(([subjectId, seconds]) => {
              const sessions = Math.ceil(seconds / 1800); // ~30 min per session
              return (
                <ProgressRing
                  key={subjectId}
                  sessions={sessions}
                  goal={WEEKLY_GOAL}
                  label={subjectId.slice(0, 8)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Recent items (task 12.1.5) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent textbooks */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-ambient">
          <h2 className="font-headline font-bold text-primary mb-4">Recent Textbooks</h2>
          {(recentTextbooks ?? []).length === 0 ? (
            <p className="text-on-surface-variant text-sm">No textbooks opened yet.</p>
          ) : (
            <ul className="space-y-3">
              {(recentTextbooks ?? []).slice(0, 3).map((tb) => (
                <li key={tb.id}>
                  <Link
                    href={`/textbooks/${tb.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary-container/20 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary" aria-hidden="true">
                        <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors truncate">
                      {tb.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent notes */}
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-ambient">
          <h2 className="font-headline font-bold text-primary mb-4">Recent Notes</h2>
          {(recentNotes ?? []).length === 0 ? (
            <p className="text-on-surface-variant text-sm">No notes yet.</p>
          ) : (
            <ul className="space-y-3">
              {(recentNotes ?? []).slice(0, 3).map((note) => (
                <li key={note.id}>
                  <Link
                    href={`/notes/${note.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-secondary" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75-6.75a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
                        <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors truncate">
                        {note.title || 'Untitled note'}
                      </p>
                      <p className="text-xs text-outline truncate">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Exam scores */}
      {(examSessions?.scores?.length ?? 0) > 0 && (
        <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-ambient">
          <h2 className="font-headline font-bold text-primary mb-4">Exam Scores</h2>
          <div className="flex flex-wrap gap-4">
            {examSessions!.scores.map((s) => (
              <div key={s.subjectId} className="bg-surface-container-low rounded-2xl px-5 py-4 text-center">
                <p className="text-2xl font-black text-primary font-headline">
                  {Math.round(s.scorePercent)}%
                </p>
                <p className="text-xs text-on-surface-variant mt-1">
                  {s.correctAnswers}/{s.totalAnswers} correct
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
