import Link from 'next/link';
import type { Subject } from '@/src/types';

interface SubjectCardProps {
  subject: Subject;
}

/**
 * SubjectCard — displays EN + AM name and grade badge.
 * Property 6: both nameEn and nameAm are rendered.
 */
export function SubjectCard({ subject }: SubjectCardProps) {
  // Determine color based on subject name (Property 6: premium aesthetics)
  const getSubjectColor = (name: string | undefined) => {
    if (!name) return 'bg-outline text-white';
    const n = name.toLowerCase();
    if (n.includes('math')) return 'bg-primary text-on-primary';
    if (n.includes('english') || n.includes('amharic')) return 'bg-secondary text-on-secondary';
    if (n.includes('bio') || n.includes('chem') || n.includes('phys') || n.includes('science')) return 'bg-tertiary text-on-tertiary';
    if (n.includes('hist') || n.includes('geo') || n.includes('civic')) return 'bg-inverse-surface text-inverse-on-surface';
    return 'bg-outline text-white';
  };

  const badgeClass = getSubjectColor(subject.nameEn);

  return (
    <Link
      href={`/subject/${subject.id}`}
      className="block bg-surface-container-lowest rounded-2xl p-6 shadow-ambient hover:bg-surface-container-low hover:shadow-[0_20px_40px_-15px_rgba(0,69,50,0.12)] transition-all duration-300 group border border-transparent hover:border-primary/10"
    >
      {/* Grade badge */}
      <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-4 ${badgeClass}`}>
        Grade {subject.grade}
      </span>

      {/* English name */}
      <h3 className="font-headline font-bold text-lg text-primary group-hover:text-primary-container transition-colors leading-tight">
        {subject.nameEn}
      </h3>

      {/* Amharic name */}
      <p className="ethiopic-text text-on-surface-variant mt-1 text-base">
        {subject.nameAm}
      </p>
    </Link>
  );
}
