'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LanguageToggle } from './LanguageToggle';
import { useLanguageContext } from '@/src/context/languageContext';

const NAV_LINKS = [
  { href: '/dashboard', labelEn: 'Dashboard', labelAm: 'ዳሽቦርድ' },
  { href: '/subjects',  labelEn: 'Subjects',  labelAm: 'ትምህርቶች' },
  { href: '/notes',     labelEn: 'Notes',     labelAm: 'ማስታወሻ' },
  { href: '/exam',      labelEn: 'Exams',     labelAm: 'ፈተና' },
];

export function Navbar() {
  const pathname = usePathname();
  const { language } = useLanguageContext();

  return (
    <nav
      className="sticky top-0 z-50 glass shadow-ambient"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-black text-primary-container italic font-headline"
          aria-label="Tibeb home"
        >
          Tibeb <span className="ethiopic-text">ጥበብ</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, labelEn, labelAm }) => (
            <Link
              key={href}
              href={href}
              className={`font-headline font-bold text-sm uppercase tracking-wider transition-colors duration-200 ${
                pathname.startsWith(href)
                  ? 'text-secondary'
                  : 'text-on-surface-variant hover:text-secondary'
              }`}
            >
              {language === 'am' ? labelAm : labelEn}
            </Link>
          ))}
        </div>

        {/* Right side: language toggle + profile */}
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link
            href="/profile"
            className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-primary hover:bg-surface-container transition-colors"
            aria-label="Profile"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
      {/* Subtle separator */}
      <div className="h-px bg-surface-container-high" />
    </nav>
  );
}
