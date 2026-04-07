'use client';

const GRADES = [7, 8, 9, 10, 11, 12] as const;

interface GradeFilterProps {
  selectedGrade: number;
  onChange: (grade: number) => void;
}

export function GradeFilter({ selectedGrade, onChange }: GradeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by grade">
      {GRADES.map((grade) => (
        <button
          key={grade}
          type="button"
          onClick={() => onChange(grade)}
          aria-pressed={selectedGrade === grade}
          className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-primary ${
            selectedGrade === grade
              ? 'bg-primary text-on-primary shadow-ambient'
              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          Grade {grade}
        </button>
      ))}
    </div>
  );
}
