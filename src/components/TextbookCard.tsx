import Link from 'next/link';
import type { Textbook } from '@/src/types';

interface TextbookCardProps {
  textbook: Textbook;
}

export function TextbookCard({ textbook }: TextbookCardProps) {
  return (
    <Link
      href={`/textbooks/${textbook.id}`}
      className="flex items-start gap-4 bg-surface-container-lowest rounded-2xl p-5 shadow-ambient hover:bg-surface-container-low hover:shadow-lg transition-all duration-300 group border border-transparent hover:border-primary/10"
    >
      {/* Icon/Cover Placeholder */}
      <div className="w-16 h-20 rounded-lg bg-primary-container/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-primary" aria-hidden="true">
          <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
        </svg>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-headline font-bold text-primary group-hover:text-primary-container transition-colors truncate leading-tight">
          {textbook.title}
        </h4>
        <p className="text-sm text-on-surface-variant mt-1 mb-3">
          Grade {textbook.grade} Textbook
        </p>
        
        <span className="inline-flex items-center text-xs font-bold text-primary gap-1 group-hover:translate-x-1 transition-transform duration-300">
          Read Book
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
