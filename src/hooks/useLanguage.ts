'use client';

import { useLanguageContext, type Language } from '@/src/context/languageContext';
import { en } from '@/src/i18n/en';
import { am } from '@/src/i18n/am';
import { api } from '@/src/services/api';

/**
 * useLanguage — reads from languageContext, persists preference via PUT /profile.
 * Property 28: language preference round-trip.
 */
export function useLanguage() {
  const { language, setLanguage } = useLanguageContext();
  const t = language === 'am' ? am : en;

  const changeLanguage = async (lang: Language) => {
    setLanguage(lang);
    // Persist to backend profile (best-effort)
    await api.put('/profile', { language_pref: lang }).catch(() => {});
  };

  return { language, t, changeLanguage };
}
