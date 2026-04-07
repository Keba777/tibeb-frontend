'use client';

import { useState, useEffect, useCallback } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { NotesEditor } from '@/src/components/NotesEditor';
import { api } from '@/src/services/api';
import type { Note } from '@/src/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default function NoteEditorPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Note>(`/notes/${id}`)
      .then(setNote)
      .catch(() => router.push('/notes'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleSave = useCallback(async (content: object) => {
    await api.put(`/notes/${id}`, { content });
  }, [id]);

  const handleDelete = useCallback(async () => {
    await api.delete(`/notes/${id}`);
    router.push('/notes');
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" aria-label="Loading" />
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="px-4 sm:px-6 py-3 bg-surface-container-lowest border-b border-surface-container-high">
        <h1 className="font-headline font-bold text-primary truncate">{note.title || 'Untitled note'}</h1>
      </div>
      <NotesEditor
        noteId={id}
        initialContent={note.content}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
}
