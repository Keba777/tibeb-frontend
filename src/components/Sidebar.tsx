'use client';

import { useState } from 'react';
import { useLanguageContext } from '@/src/context/languageContext';

interface SidebarProps {
  /** Whether the mobile bottom sheet is open */
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ open = false, onClose }: SidebarProps) {
  const { language } = useLanguageContext();
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards' | 'questions'>('summary');

  const tabs = [
    { id: 'summary' as const,    labelEn: 'Summary',    labelAm: 'ማጠቃለያ' },
    { id: 'flashcards' as const, labelEn: 'Flashcards', labelAm: 'ፍላሽካርዶች' },
    { id: 'questions' as const,  labelEn: 'Questions',  labelAm: 'ጥያቄዎች' },
  ];

  const content = (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2 px-2">
        <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-on-primary shrink-0">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
            <path d="M16.5 7.5h-9v9h9v-9Z" />
            <path fillRule="evenodd" d="M8.25 2.25A.75.75 0 0 1 9 3v.75h2.25V3a.75.75 0 0 1 1.5 0v.75H15V3a.75.75 0 0 1 1.5 0v.75h.75a3 3 0 0 1 3 3v.75H21A.75.75 0 0 1 21 9h-.75v2.25H21a.75.75 0 0 1 0 1.5h-.75V15H21a.75.75 0 0 1 0 1.5h-.75v.75a3 3 0 0 1-3 3h-.75V21a.75.75 0 0 1-1.5 0v-.75h-2.25V21a.75.75 0 0 1-1.5 0v-.75H9V21a.75.75 0 0 1-1.5 0v-.75h-.75a3 3 0 0 1-3-3v-.75H3A.75.75 0 0 1 3 15h.75v-2.25H3a.75.75 0 0 1 0-1.5h.75V9H3a.75.75 0 0 1 0-1.5h.75v-.75a3 3 0 0 1 3-3h.75V3a.75.75 0 0 1 .75-.75ZM6 6.75A.75.75 0 0 1 6.75 6h10.5a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V6.75Z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-primary font-headline">Tibeb AI</p>
          <p className="text-xs text-on-surface-variant">
            {language === 'am' ? 'የጥናት ረዳትዎ' : 'Your Study Companion'}
          </p>
        </div>
        {/* Close button (mobile only) */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-on-surface-variant hover:text-primary transition-colors"
            aria-label="Close AI assistant"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-surface-container-low rounded-xl p-1">
        {tabs.map(({ id, labelEn, labelAm }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors duration-200 ${
              activeTab === id
                ? 'bg-primary text-on-primary'
                : 'text-on-surface-variant hover:text-primary'
            } ${language === 'am' ? 'ethiopic-text' : ''}`}
          >
            {language === 'am' ? labelAm : labelEn}
          </button>
        ))}
      </div>

      {/* Tab content placeholder */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-outline">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
            <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5Z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-sm text-on-surface-variant">
          {language === 'am'
            ? 'ለማጠቃለያ ወይም ፍላሽካርዶች ትምህርቱን ይምረጡ'
            : 'Open a textbook or note to generate AI content'}
        </p>
      </div>

      {/* CTA */}
      <button className="w-full bg-secondary text-on-secondary py-3 rounded-2xl font-bold text-sm shadow-ambient active:scale-95 transition-transform">
        {language === 'am' ? 'ረዳቱን ጠይቅ' : 'Ask Assistant'}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop: fixed right sidebar */}
      <aside
        className="hidden lg:flex flex-col fixed right-0 top-0 h-screen w-72 glass shadow-[-20px_0_40px_rgba(0,69,50,0.08)] rounded-l-3xl z-40"
        aria-label="AI Assistant"
      >
        {content}
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
          <div className="absolute bottom-0 left-0 right-0 h-[70vh] glass rounded-t-3xl flex flex-col">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-outline-variant" />
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
