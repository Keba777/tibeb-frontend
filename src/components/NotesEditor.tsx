'use client';

import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

interface NotesEditorProps {
  noteId: string;
  initialContent: object;
  onSave: (content: object) => Promise<void>;
  onDelete: () => void;
}

const AUTOSAVE_INTERVAL = 30_000; // 30 seconds

/**
 * NotesEditor — Tiptap rich-text editor with toolbar.
 * Auto-saves draft to localStorage every 30s.
 */
export function NotesEditor({ noteId, initialContent, onSave, onDelete }: NotesEditorProps) {
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const autosaveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: initialContent,
    onUpdate: ({ editor }) => {
      // Auto-save draft to localStorage
      localStorage.setItem(
        `tibeb:note_draft:${noteId}`,
        JSON.stringify(editor.getJSON()),
      );
    },
  });

  // Restore draft from localStorage on mount
  useEffect(() => {
    if (!editor) return;
    const draft = localStorage.getItem(`tibeb:note_draft:${noteId}`);
    if (draft) {
      try {
        editor.commands.setContent(JSON.parse(draft));
      } catch { /* ignore */ }
    }
  }, [editor, noteId]);

  // Auto-save to server every 30s (task 14.1.2)
  useEffect(() => {
    if (!editor) return;
    autosaveRef.current = setInterval(async () => {
      try {
        await onSave(editor.getJSON());
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch {
        setSaveStatus('error');
      }
    }, AUTOSAVE_INTERVAL);
    return () => { if (autosaveRef.current) clearInterval(autosaveRef.current); };
  }, [editor, onSave]);

  const handleSave = async () => {
    if (!editor) return;
    setSaveStatus('saving');
    try {
      await onSave(editor.getJSON());
      setSaveStatus('saved');
      localStorage.removeItem(`tibeb:note_draft:${noteId}`);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch {
      setSaveStatus('error');
    }
  };

  if (!editor) return null;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 bg-surface-container-low border-b border-surface-container-high flex-wrap">
        {[
          { label: 'B', title: 'Bold', action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
          { label: 'I', title: 'Italic', action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
          { label: 'U', title: 'Underline', action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive('underline') },
        ].map(({ label, title, action, active }) => (
          <button key={label} onClick={action} title={title} aria-label={title} aria-pressed={active}
            className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${active ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}>
            {label}
          </button>
        ))}

        <div className="w-px h-5 bg-outline-variant mx-1" />

        {[1, 2, 3].map((level) => (
          <button key={level}
            onClick={() => editor.chain().focus().toggleHeading({ level: level as 1|2|3 }).run()}
            aria-label={`Heading ${level}`} aria-pressed={editor.isActive('heading', { level })}
            className={`px-2 h-8 rounded-lg text-xs font-bold transition-colors ${editor.isActive('heading', { level }) ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}>
            H{level}
          </button>
        ))}

        <div className="w-px h-5 bg-outline-variant mx-1" />

        <button onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet list" aria-pressed={editor.isActive('bulletList')}
          className={`px-2 h-8 rounded-lg text-xs font-bold transition-colors ${editor.isActive('bulletList') ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}>
          • List
        </button>

        <button onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Ordered list" aria-pressed={editor.isActive('orderedList')}
          className={`px-2 h-8 rounded-lg text-xs font-bold transition-colors ${editor.isActive('orderedList') ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'}`}>
          1. List
        </button>

        {/* Save status + actions */}
        <div className="ml-auto flex items-center gap-2">
          {saveStatus === 'error' && (
            <span className="text-xs text-error bg-error-container px-2 py-1 rounded-lg">
              Changes not saved — retrying…
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="text-xs text-primary">Saved</span>
          )}

          <button onClick={handleSave} disabled={saveStatus === 'saving'}
            className="bg-primary text-on-primary px-4 py-1.5 rounded-lg text-sm font-bold hover:scale-[1.02] transition-transform disabled:opacity-60">
            {saveStatus === 'saving' ? 'Saving…' : 'Save'}
          </button>

          <button onClick={() => setShowDeleteConfirm(true)}
            className="text-error px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-error-container transition-colors"
            aria-label="Delete note">
            Delete
          </button>
        </div>
      </div>

      {/* Editor content */}
      <EditorContent
        editor={editor}
        className="flex-1 overflow-auto px-6 py-4 prose prose-sm max-w-none focus:outline-none text-on-surface"
      />

      {/* Delete confirmation dialog (task 14.1.4) */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/20 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-ambient max-w-sm w-full mx-4">
            <h2 className="font-headline font-bold text-primary text-lg mb-2">Delete note?</h2>
            <p className="text-on-surface-variant text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors">
                Cancel
              </button>
              <button onClick={() => { setShowDeleteConfirm(false); onDelete(); }}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-error text-on-error hover:scale-[1.02] transition-transform">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
