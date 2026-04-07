'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import { useLanguage } from '@/src/hooks/useLanguage';
import { api } from '@/src/services/api';
import type { User } from '@/src/types';

const GRADES = [7, 8, 9, 10, 11, 12];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { language, t, changeLanguage } = useLanguage();
  const [grade, setGrade] = useState(user?.grade ?? 9);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    if (user) setGrade(user.grade);
  }, [user]);

  const handleSave = async () => {
    setSaveStatus('saving');
    await api.put<User>('/profile', { grade }).catch(() => {});
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8 space-y-6">
      <h1 className="font-headline text-3xl font-extrabold text-primary">{t.profile.title}</h1>

      {/* User info */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-ambient space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-on-primary text-2xl font-black">
            {user?.displayName?.[0] ?? '?'}
          </div>
          <div>
            <p className="font-bold text-primary text-lg">{user?.displayName}</p>
            <p className="text-sm text-on-surface-variant">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Language toggle */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-ambient space-y-3">
        <p className="font-bold text-primary">{t.profile.language}</p>
        <div className="flex gap-3">
          {(['en', 'am'] as const).map((lang) => (
            <button key={lang} onClick={() => changeLanguage(lang)} aria-pressed={language === lang}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors ${language === lang ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'}`}>
              {lang === 'en' ? 'English' : <span className="ethiopic-text">አማርኛ</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Grade selector */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-ambient space-y-3">
        <p className="font-bold text-primary">{t.profile.grade}</p>
        <div className="flex gap-2 flex-wrap">
          {GRADES.map((g) => (
            <button key={g} onClick={() => setGrade(g)} aria-pressed={grade === g}
              className={`w-12 h-12 rounded-xl font-bold text-sm transition-colors ${grade === g ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'}`}>
              {g}
            </button>
          ))}
        </div>
        <button onClick={handleSave} disabled={saveStatus === 'saving'}
          className="bg-primary text-on-primary px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-[1.02] transition-transform disabled:opacity-60">
          {saveStatus === 'saving' ? 'Saving…' : saveStatus === 'saved' ? t.profile.saved : t.profile.save}
        </button>
      </div>

      {/* Logout */}
      <button onClick={logout}
        className="w-full py-3 rounded-2xl font-bold text-sm text-error hover:bg-error-container transition-colors">
        {t.profile.logout}
      </button>
    </div>
  );
}
