'use client';

import { useState } from 'react';
import { SubjectCard } from '@/src/components/SubjectCard';
import type { Subject } from '@/src/types';

const GRADES = [7, 8, 9, 10, 11, 12];

interface SubjectCatalogProps {
  subjects: Subject[];
}

export function SubjectCatalog({ subjects }: SubjectCatalogProps) {
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);

  const filtered = selectedGrade
    ? subjects.filter((s) => s.grade === selectedGrade)
    : subjects;

  return (
    <div>
      {/* Grade filter — client component, no page reload */}
      <div className="flex flex-wrap justify-center gap-2 mb-8" role="group" aria-label="Filter by grade">
        <button
          onClick={() => setSelectedGrade(null)}
          aria-pressed={selectedGrade === null}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-colors duration-200 ${
            selectedGrade === null
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          All
        </button>
        {GRADES.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGrade(g)}
            aria-pressed={selectedGrade === g}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors duration-200 ${
              selectedGrade === g
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            Grade {g}
          </button>
        ))}
      </div>

      {/* Empty state (task 13.1.3) */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-outline" aria-hidden="true">
              <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
            </svg>
          </div>
          <p className="font-headline font-bold text-primary text-lg mb-1">No subjects found</p>
          <p className="text-on-surface-variant text-sm">
            {selectedGrade
              ? `No subjects available for Grade ${selectedGrade} yet.`
              : 'No subjects available yet.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {filtered.map((subject) => (
            <div key={subject.id} className="w-full sm:w-[280px]">
              <SubjectCard subject={subject} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
