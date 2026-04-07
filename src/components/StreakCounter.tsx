interface StreakCounterProps {
  streak: number;
}

export function StreakCounter({ streak }: StreakCounterProps) {
  const isActive = streak > 0;

  return (
    <div
      className={`flex items-center gap-3 px-5 py-4 rounded-2xl ${
        isActive ? 'bg-tertiary-fixed' : 'bg-surface-container-high'
      }`}
      aria-label={`Current study streak: ${streak} day${streak !== 1 ? 's' : ''}`}
    >
      {/* Flame icon */}
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className={`w-8 h-8 shrink-0 ${isActive ? 'text-secondary' : 'text-outline'}`}
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.546 3.75 3.75 0 0 1 3.255 3.718Z"
          clipRule="evenodd"
        />
      </svg>

      <div>
        <p className={`text-3xl font-black font-headline leading-none ${isActive ? 'text-on-tertiary-fixed' : 'text-on-surface-variant'}`}>
          {streak}
        </p>
        <p className={`text-xs font-medium mt-0.5 ${isActive ? 'text-on-tertiary-fixed-variant' : 'text-outline'}`}>
          day{streak !== 1 ? 's' : ''} streak
        </p>
      </div>
    </div>
  );
}
