'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/src/services/api';
import type { Note, Subject } from '@/src/types';

export default function NotesListPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Subject[]>('/subjects').then(setSubjects).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedSubject) return;
    setLoading(true);
    api.get<Note[]>(`/notes?subject_id=${selectedSubject}`)
      .then((ns) => setNotes(ns.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())))
      .catch(() => setNotes([]))
      .finally(() => setLoading(false));
  }, [selectedSubject]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-headline text-3xl font-extrabold text-primary mb-6">Notes</h1>

      {/* Subject filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {subjects.map((s) => (
          <button key={s.id} onClick={() => setSelectedSubject(s.id)}
            aria-pressed={selectedSubject === s.id}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${selectedSubject === s.id ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'}`}>
            {s.nameEn}
          </button>
        ))}
      </div>

      {!selectedSubject ? (
        <p className="text-on-surface-variant text-sm">Select a subject to view notes.</p>
      ) : loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" aria-label="Loading" />
        </div>
      ) : notes.length === 0 ? (
        <p className="text-on-surface-variant text-sm">No notes for this subject yet.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note.id}>
              <Link href={`/notes/${note.id}`}
                className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-2xl shadow-ambient hover:bg-surface-container-low transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-secondary" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-on-surface group-hover:text-primary transition-colors truncate">
                    {note.title || 'Untitled note'}
                  </p>
                  <p className="text-xs text-outline mt-0.5">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
