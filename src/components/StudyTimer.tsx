'use client';

import { useStudyTracker } from '@/src/hooks/useStudyTracker';

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

interface StudyTimerProps {
  subjectId?: string;
}

/**
 * StudyTimer — persistent bottom-bar timer for active study sessions.
 * Shows on mobile during active session.
 */
export function StudyTimer({ subjectId }: StudyTimerProps) {
  const { isRunning, elapsed, showBreakPrompt, start, stop, dismissBreak } = useStudyTracker();

  return (
    <>
      {/* Bottom bar (task 15.1.1) */}
      {isRunning && (
        <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-72 z-40 bg-primary text-on-primary rounded-2xl px-5 py-3 flex items-center gap-4 shadow-ambient">
          <div className="flex-1">
            <p className="text-xs font-medium opacity-80">Study Session</p>
            <p className="text-2xl font-black font-headline tabular-nums">{formatTime(elapsed)}</p>
          </div>
          <button
            onClick={stop}
            className="bg-on-primary/20 hover:bg-on-primary/30 text-on-primary px-4 py-2 rounded-xl font-bold text-sm transition-colors"
            aria-label="Stop study session"
          >
            Stop
          </button>
        </div>
      )}

      {/* Start button when not running */}
      {!isRunning && subjectId && (
        <button
          onClick={() => start(subjectId)}
          className="fixed bottom-20 md:bottom-4 right-4 z-40 bg-secondary text-on-secondary px-5 py-3 rounded-2xl font-bold text-sm shadow-ambient hover:scale-[1.02] transition-transform"
          aria-label="Start study session"
        >
          Start Timer
        </button>
      )}

      {/* 25-minute break prompt (task 15.1.3) */}
      {showBreakPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/20 backdrop-blur-sm" role="alertdialog" aria-modal="true">
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-ambient max-w-sm w-full mx-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-tertiary-fixed flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-on-tertiary-fixed" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="font-headline font-bold text-primary text-xl mb-2">Time for a break!</h2>
            <p className="text-on-surface-variant text-sm mb-6">You&apos;ve been studying for 25 minutes. Take a 5-minute break.</p>
            <button onClick={dismissBreak}
              className="bg-primary text-on-primary px-8 py-3 rounded-xl font-bold hover:scale-[1.02] transition-transform">
              Keep Going
            </button>
          </div>
        </div>
      )}
    </>
  );
}
