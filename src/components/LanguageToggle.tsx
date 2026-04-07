'use client';

import { useLanguageContext } from '@/src/context/languageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguageContext();

  return (
    <div className="flex items-center gap-1 bg-surface-container-low rounded-full px-1 py-1">
      <button
        onClick={() => setLanguage('am')}
        className={`px-3 py-1 rounded-full text-sm font-bold transition-colors duration-200 ethiopic-text ${
          language === 'am'
            ? 'bg-primary text-on-primary'
            : 'text-on-surface-variant hover:text-primary'
        }`}
        aria-label="Switch to Amharic"
        aria-pressed={language === 'am'}
      >
        አማ
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full text-sm font-bold transition-colors duration-200 ${
          language === 'en'
            ? 'bg-primary text-on-primary'
            : 'text-on-surface-variant hover:text-primary'
        }`}
        aria-label="Switch to English"
        aria-pressed={language === 'en'}
      >
        EN
      </button>
    </div>
  );
}
