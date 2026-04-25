'use client';

import { useState, useEffect, useCallback } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import { NotesEditor } from '@/src/components/NotesEditor';
import { Sidebar } from '@/src/components/Sidebar';
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
  const [aiOpen, setAiOpen] = useState(false);

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
    <div className="flex flex-col h-[calc(100vh-4rem)] relative">
      <div className="px-4 sm:px-6 py-3 bg-surface-container-lowest border-b border-surface-container-high flex items-center justify-between">
        <h1 className="font-headline font-bold text-primary truncate">{note.title || 'Untitled note'}</h1>
        
        <button
          onClick={() => setAiOpen(!aiOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            aiOpen ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-primary hover:bg-primary/10'
          }`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Z" clipRule="evenodd" />
          </svg>
          AI Assistant
        </button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <NotesEditor
          noteId={id}
          initialContent={note.content}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </div>

      <Sidebar 
        open={aiOpen} 
        onClose={() => setAiOpen(false)} 
        noteId={id}
      />
    </div>
  );
}
