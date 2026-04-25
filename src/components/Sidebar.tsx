'use client';

import { useState } from 'react';
import { api } from '@/src/services/api';
import { useLanguageContext } from '@/src/context/languageContext';
import { createTiptapDoc } from '@/src/utils/tiptap';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  /** Whether the mobile bottom sheet is open */
  open?: boolean;
  onClose?: () => void;
  textbookId?: string;
  noteId?: string;
  pageStart?: number;
  pageEnd?: number;
}

export function Sidebar({ open = false, onClose, textbookId, noteId, pageStart, pageEnd }: SidebarProps) {
  const { language } = useLanguageContext();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards' | 'questions'>('summary');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);

  const handleGenerate = async () => {
    if (!textbookId && !noteId) return;

    setLoading(true);
    setError(null);

    try {
      if (activeTab === 'summary' && textbookId) {
        const resp = await api.post<{ summary: string }>('/ai/summary', {
          textbook_id: textbookId,
          page_start: pageStart || 1,
          page_end: pageEnd || 1,
        });
        setSummary(resp.summary);
      } else if (activeTab === 'flashcards') {
        const source = noteId 
          ? { type: 'note', note_id: noteId } 
          : { type: 'textbook_range', textbook_id: textbookId, page_start: pageStart || 1, page_end: pageEnd || 1 };
        const resp = await api.post<{ cards: any[] }>('/ai/flashcards', { source });
        setFlashcards(resp.cards);
      } else if (activeTab === 'questions') {
        const source = noteId 
          ? { type: 'note', note_id: noteId } 
          : { type: 'textbook_range', textbook_id: textbookId, page_start: pageStart || 1, page_end: pageEnd || 1 };
        const resp = await api.post<{ questions: any[] }>('/ai/questions', { source });
        setQuestions(resp.questions);
      }
    } catch (err: any) {
      setError(err.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsNote = async () => {
    const sId = textbookId ? (await api.get<any>(`/textbooks/${textbookId}`)).subjectId : null;
    if (!sId) return;

    setSaving(true);
    setSaveSuccess(false);

    try {
      let content: object;
      let title: string;

      if (activeTab === 'summary' && summary) {
        content = createTiptapDoc(summary, 'text');
        title = `Summary: ${new Date().toLocaleDateString()}`;
      } else if (activeTab === 'flashcards' && flashcards.length > 0) {
        content = createTiptapDoc(flashcards, 'flashcards');
        title = `Flashcards: ${new Date().toLocaleDateString()}`;
      } else if (activeTab === 'questions' && questions.length > 0) {
        content = createTiptapDoc(questions, 'questions');
        title = `Questions: ${new Date().toLocaleDateString()}`;
      } else {
        return;
      }

      const note = await api.post<any>('/notes', {
        subjectId: sId,
        title,
        content
      });

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        router.push(`/notes/${note.id}`);
      }, 1500);
    } catch (err) {
      console.error('Failed to save note:', err);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'summary' as const,    labelEn: 'Summary',    labelAm: 'ማጠቃለያ' },
    { id: 'flashcards' as const, labelEn: 'Flashcards', labelAm: 'ፍላሽካርዶች' },
    { id: 'questions' as const,  labelEn: 'Questions',  labelAm: 'ጥያቄዎች' },
  ];

  const renderActiveTabContent = () => {
    if (loading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-on-surface-variant">Generating magic...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
          <div className="text-error">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto mb-2 opacity-50">
              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.753-2.5-2.598-4.5L9.401 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-bold">{error}</p>
          </div>
          <button onClick={handleGenerate} className="text-primary text-xs font-bold hover:underline">Try Again</button>
        </div>
      );
    }

    if (activeTab === 'summary' && summary) {
      return (
        <div className="flex-1 overflow-y-auto px-2 space-y-4">
          <div className="bg-surface-container-low p-4 rounded-2xl text-sm leading-relaxed text-on-surface prose prose-sm max-w-none">
            {summary.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <button 
            onClick={handleSaveAsNote}
            disabled={saving || saveSuccess}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save as Note'}
          </button>
        </div>
      );
    }

    if (activeTab === 'flashcards' && flashcards.length > 0) {
      return (
        <div className="flex-1 overflow-y-auto px-2 space-y-3">
          {flashcards.map((card, i) => (
            <div key={i} className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant hover:border-primary/30 transition-colors group cursor-pointer">
              <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">Question</p>
              <p className="text-sm font-medium mb-3">{card.prompt}</p>
              <div className="pt-3 border-t border-outline-variant group-hover:border-primary/10">
                <p className="text-xs font-bold text-secondary mb-1 uppercase tracking-wider">Answer</p>
                <p className="text-sm text-on-surface-variant">{card.answer}</p>
              </div>
            </div>
          ))}
          <button 
            onClick={handleSaveAsNote}
            disabled={saving || saveSuccess}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors disabled:opacity-50 mt-3"
          >
            {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save as Note'}
          </button>
        </div>
      );
    }

    if (activeTab === 'questions' && questions.length > 0) {
      return (
        <div className="flex-1 overflow-y-auto px-2 space-y-4">
          {questions.map((q, i) => (
            <div key={i} className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant">
              <p className="text-sm font-bold mb-3">{i + 1}. {q.question_text}</p>
              {q.question_type === 'multiple_choice' && q.choices && (
                <div className="space-y-2">
                  {q.choices.map((choice: string, ci: number) => (
                    <div key={ci} className="text-xs p-2 rounded-lg bg-surface-dim border border-outline-variant flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-outline-variant flex items-center justify-center text-[10px] font-bold">{String.fromCharCode(65 + ci)}</span>
                      {choice}
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 pt-3 border-t border-dashed border-outline-variant">
                <p className="text-[10px] font-bold text-outline uppercase">Correct Answer</p>
                <p className="text-xs font-bold text-primary">{q.correct_answer}</p>
              </div>
            </div>
          ))}
          <button 
            onClick={handleSaveAsNote}
            disabled={saving || saveSuccess}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors disabled:opacity-50 mt-4"
          >
            {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save as Note'}
          </button>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-outline">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
            <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-sm text-on-surface-variant">
          {language === 'am'
            ? 'ለማመንጨት ከታች ያለውን ቁልፍ ይጫኑ'
            : `Click Generate to create ${activeTab} for this content`}
        </p>
        <button 
          onClick={handleGenerate}
          className="bg-primary text-on-primary px-6 py-2 rounded-xl text-sm font-bold shadow-ambient"
        >
          Generate
        </button>
      </div>
    );
  };

  const mainContent = (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2 px-2">
        <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-on-primary shrink-0 shadow-lg shadow-primary/20">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
            <path d="M16.5 7.5h-9v9h9v-9Z" />
            <path fillRule="evenodd" d="M8.25 2.25A.75.75 0 0 1 9 3v.75h2.25V3a.75.75 0 0 1 1.5 0v.75H15V3a.75.75 0 0 1 1.5 0v.75h.75a3 3 0 0 1 3 3v.75H21A.75.75 0 0 1 21 9h-.75v2.25H21a.75.75 0 0 1 0 1.5h-.75V15H21a.75.75 0 0 1 0 1.5h-.75v.75a3 3 0 0 1-3 3h-.75V21a.75.75 0 0 1-1.5 0v-.75h-2.25V21a.75.75 0 0 1-1.5 0v-.75H9V21a.75.75 0 0 1-1.5 0v-.75h-.75a3 3 0 0 1-3-3v-.75H3A.75.75 0 0 1 3 15h.75v-2.25H3a.75.75 0 0 1 0-1.5h.75V9H3a.75.75 0 0 1 0-1.5h.75v-.75a3 3 0 0 1 3-3h.75V3a.75.75 0 0 1 .75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h10.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V6.75Z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-primary font-headline">Tibeb AI</p>
          <p className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">Study Assistant</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-on-surface-variant hover:text-primary transition-colors p-1 rounded-lg hover:bg-surface-container-low">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
          </button>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-surface-container-low rounded-xl p-1 border border-outline-variant/30">
        {tabs.map(({ id, labelEn, labelAm }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 ${
              activeTab === id
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-primary hover:bg-surface-dim'
            }`}
          >
            {language === 'am' ? labelAm : labelEn}
          </button>
        ))}
      </div>

      {/* Content area */}
      {renderActiveTabContent()}

      {/* CTA */}
      <button className="w-full bg-secondary text-on-secondary py-3 rounded-2xl font-bold text-sm shadow-ambient hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2">
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" /></svg>
        {language === 'am' ? 'ረዳቱን ጠይቅ' : 'Ask Assistant'}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop: fixed right sidebar */}
      <aside
        className="hidden lg:flex flex-col fixed right-0 top-0 h-screen w-80 glass shadow-[-20px_0_40px_rgba(0,69,50,0.08)] rounded-l-3xl z-40 border-l border-outline-variant/20"
        aria-label="AI Assistant"
      >
        {mainContent}
      </aside>

      {/* Mobile: bottom sheet */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="AI Assistant">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-on-surface/20 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 h-[80vh] glass rounded-t-3xl flex flex-col shadow-2xl">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-outline-variant" />
            </div>
            {mainContent}
          </div>
        </div>
      )}
    </>
  );
}
