import { cookies } from 'next/headers';
import { formatDuration } from '@/src/utils/dashboard';
import type { StudyStats, StreakData } from '@/src/types';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:9000';

async function fetchData<T>(path: string, cookieHeader: string): Promise<T | null> {
  try {
    const res = await fetch(`${API}${path}`, { headers: { Cookie: cookieHeader }, next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

export default async function StudyTrackerPage() {
  const cookieStore = await cookies();
  const ch = cookieStore.toString();
  const [weekly, daily, streak] = await Promise.all([
    fetchData<StudyStats>('/study/stats?period=weekly', ch),
    fetchData<StudyStats>('/study/stats?period=daily', ch),
    fetchData<StreakData>('/study/streak', ch),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <h1 className="font-headline text-3xl font-extrabold text-primary">Study Tracker</h1>

      {/* Streak */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-ambient flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-tertiary-fixed flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-secondary" aria-hidden="true">
            <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="text-3xl font-black text-primary font-headline">{streak?.streak ?? 0}</p>
          <p className="text-sm text-on-surface-variant">day streak</p>
        </div>
      </div>

      {/* Daily */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-ambient">
        <h2 className="font-headline font-bold text-primary mb-4">Today</h2>
        {(daily?.totals?.length ?? 0) === 0 ? (
          <p className="text-on-surface-variant text-sm">No sessions today.</p>
        ) : (
          <ul className="space-y-2">
            {daily!.totals.map((t) => (
              <li key={t.subjectId} className="flex justify-between text-sm">
                <span className="text-on-surface-variant truncate">{t.subjectId.slice(0, 8)}</span>
                <span className="font-bold text-primary">{formatDuration(t.totalSeconds)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Weekly */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-ambient">
        <h2 className="font-headline font-bold text-primary mb-4">This Week</h2>
        {(weekly?.totals?.length ?? 0) === 0 ? (
          <p className="text-on-surface-variant text-sm">No sessions this week.</p>
        ) : (
          <ul className="space-y-2">
            {weekly!.totals.map((t) => (
              <li key={t.subjectId} className="flex justify-between text-sm">
                <span className="text-on-surface-variant truncate">{t.subjectId.slice(0, 8)}</span>
                <span className="font-bold text-primary">{formatDuration(t.totalSeconds)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
