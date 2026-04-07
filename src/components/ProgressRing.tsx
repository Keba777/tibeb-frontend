import { progressRingRatio } from '@/src/utils/dashboard';

interface ProgressRingProps {
  /** Number of completed sessions */
  sessions: number;
  /** Weekly goal (sessions) */
  goal: number;
  /** Display label (subject name) */
  label: string;
  /** Ring size in px (default 80) */
  size?: number;
}

/**
 * SVG circular progress ring.
 * Ratio = min(sessions / goal, 1.0) — Property 27.
 */
export function ProgressRing({ sessions, goal, label, size = 80 }: ProgressRingProps) {
  const ratio = progressRingRatio(sessions, goal);
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - ratio);
  const percent = Math.round(ratio * 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-label={`${label}: ${percent}% of weekly goal`}
          role="img"
        >
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-surface-container-high)"
            strokeWidth={8}
          />
          {/* Progress */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-secondary)"
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        {/* Center label */}
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary">
          {percent}%
        </span>
      </div>
      <span className="text-xs text-on-surface-variant text-center max-w-[80px] leading-tight">
        {label}
      </span>
    </div>
  );
}
