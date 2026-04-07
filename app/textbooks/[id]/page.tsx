'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { PDFViewer } from '@/src/components/PDFViewer';
import { Sidebar } from '@/src/components/Sidebar';
import { api } from '@/src/services/api';
import type { Textbook, TextbookBookmark } from '@/src/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default function TextbookPage({ params }: Props) {
  const { id } = use(params);
  const [textbook, setTextbook] = useState<Textbook | null>(null);
  const [initialPage, setInitialPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [aiOpen, setAiOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    api.get<Textbook>(`/textbooks/${id}`).then((tb) => {
      setTextbook(tb);
    }).catch(() => {});

    // Restore last-read position (task 13.2.5)
    api.get<TextbookBookmark[]>(`/textbooks/${id}/bookmarks`).then((bms) => {
      const lastRead = bms.find((b) => b.isLastRead);
      if (lastRead) {
        setInitialPage(lastRead.pageNumber);
        setCurrentPage(lastRead.pageNumber);
      }
    }).catch(() => {});
  }, [id]);

  const handleBookmark = async () => {
    await api.put(`/textbooks/${id}/bookmark`, { page_number: currentPage, is_last_read: true });
    setBookmarked(true);
    setTimeout(() => setBookmarked(false), 2000);
  };

  if (!textbook) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Main PDF area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header bar */}
        <div className="flex items-center gap-3 px-4 py-3 bg-surface-container-lowest border-b border-surface-container-high">
          <h1 className="font-headline font-bold text-primary truncate flex-1">{textbook.title}</h1>

          {/* Search (task 13.2.6) */}
          <input
            type="search"
            placeholder="Search…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="hidden sm:block w-40 bg-surface-container-highest px-3 py-1.5 rounded-lg text-sm text-on-surface placeholder:text-outline focus:outline-none border-b-2 border-transparent focus:border-primary transition-colors"
            aria-label="Search in PDF"
          />

          {/* Bookmark button (task 13.2.5) */}
          <button
            onClick={handleBookmark}
            aria-label="Bookmark current page"
            className={`p-2 rounded-lg transition-colors ${bookmarked ? 'text-tertiary bg-tertiary-fixed' : 'text-on-surface-variant hover:bg-surface-container'}`}
          >
            <svg viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} className="w-5 h-5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
            </svg>
          </button>

          {/* AI assistant toggle (mobile) */}
          <button
            onClick={() => setAiOpen(true)}
            aria-label="Open AI assistant"
            className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary" aria-hidden="true">
              <path d="M16.5 7.5h-9v9h9v-9Z" />
              <path fillRule="evenodd" d="M8.25 2.25A.75.75 0 0 1 9 3v.75h2.25V3a.75.75 0 0 1 1.5 0v.75H15V3a.75.75 0 0 1 1.5 0v.75h.75a3 3 0 0 1 3 3v.75H21A.75.75 0 0 1 21 9h-.75v2.25H21a.75.75 0 0 1 0 1.5h-.75V15H21a.75.75 0 0 1 0 1.5h-.75v.75a3 3 0 0 1-3 3h-.75V21a.75.75 0 0 1-1.5 0v-.75h-2.25V21a.75.75 0 0 1-1.5 0v-.75H9V21a.75.75 0 0 1-1.5 0v-.75h-.75a3 3 0 0 1-3-3v-.75H3A.75.75 0 0 1 3 15h.75v-2.25H3a.75.75 0 0 1 0-1.5h.75V9H3a.75.75 0 0 1 0-1.5h.75v-.75a3 3 0 0 1 3-3h.75V3a.75.75 0 0 1 .75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h10.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V6.75Z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <PDFViewer
          url={textbook.fileUrl}
          initialPage={initialPage}
          onPageChange={setCurrentPage}
          searchTerm={searchTerm}
        />
      </div>

      {/* AI sidebar (task 13.2.9) */}
      <Sidebar open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}
