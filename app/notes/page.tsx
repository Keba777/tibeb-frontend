'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/src/services/api';
import { SubjectCard } from '@/src/components/SubjectCard';
import { createTiptapDoc } from '@/src/utils/tiptap';
import type { Note, Subject } from '@/src/types';
import { useRouter } from 'next/navigation';

const GRADES = [7, 8, 9, 10, 11, 12];

export default function NotesListPage() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    api.get<Subject[]>('/subjects').then(setSubjects).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedSubject) return;
    setLoading(true);
    api.get<Note[]>(`/notes?subject_id=${selectedSubject.id}`)
      .then((ns) => setNotes(ns.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())))
      .catch(() => setNotes([]))
      .finally(() => setLoading(false));
  }, [selectedSubject]);

  const filteredSubjects = selectedGrade
    ? subjects.filter((s) => s.grade === selectedGrade)
    : subjects;

  const handleCreateNote = async () => {
    if (!selectedSubject) return;
    setCreating(true);
    try {
      const note = await api.post<any>('/notes', {
        subjectId: selectedSubject.id,
        title: 'New Note',
        content: createTiptapDoc('', 'text')
      });
      router.push(`/notes/${note.id}`);
    } catch (err) {
      console.error('Failed to create note:', err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline text-3xl font-extrabold text-primary">Notes</h1>
          <p className="text-on-surface-variant mt-1">Review and manage your study notes</p>
        </div>

        {selectedSubject && (
          <button
            onClick={() => setSelectedSubject(null)}
            className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z" clipRule="evenodd" /></svg>
            Change Subject
          </button>
        )}
      </div>

      {!selectedSubject ? (
        <div className="space-y-8">
          {/* Grade filter */}
          <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Filter by grade">
            <button
              onClick={() => setSelectedGrade(null)}
              aria-pressed={selectedGrade === null}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${selectedGrade === null ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'}`}
            >
              All
            </button>
            {GRADES.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                aria-pressed={selectedGrade === g}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${selectedGrade === g ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'}`}
              >
                Grade {g}
              </button>
            ))}
          </div>

          {/* Subject grid */}
          <div className="flex flex-wrap justify-center gap-6">
            {filteredSubjects.map((s) => (
              <div key={s.id} className="w-full sm:w-[280px]" onClick={() => setSelectedSubject(s)}>
                <SubjectCard subject={s} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                {selectedSubject.grade}
              </div>
              <h2 className="text-xl font-bold text-primary font-headline">{selectedSubject.nameEn}</h2>
            </div>
            
            <button
              onClick={handleCreateNote}
              disabled={creating}
              className="bg-primary text-on-primary px-5 py-2 rounded-xl text-sm font-bold shadow-ambient hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {creating ? 'Creating...' : '+ New Note'}
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-20 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline-variant">
              <p className="text-on-surface-variant text-sm mb-4">No notes for this subject yet.</p>
              <button onClick={handleCreateNote} className="text-primary font-bold hover:underline">
                Create your first note
              </button>
            </div>
          ) : (
            <ul className="grid grid-cols-1 gap-3">
              {notes.map((note) => (
                <li key={note.id}>
                  <Link href={`/notes/${note.id}`}
                    className="flex items-center gap-4 p-5 bg-surface-container-lowest rounded-2xl shadow-ambient hover:bg-surface-container-low transition-all group border border-transparent hover:border-primary/10">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-secondary" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75-6.75a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                        {note.title || 'Untitled note'}
                      </p>
                      <p className="text-xs text-outline mt-0.5">
                        Last edited {new Date(note.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-outline group-hover:text-primary transition-colors"><path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" /></svg>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
