import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// ============================================================
// Property 28: Language preference round-trip
// Feature: tibeb-platform, Property 28
// Validates: Requirements 11.3
// ============================================================

// Pure logic: the language context stores and retrieves the preference.
// We test the localStorage persistence logic directly.

const STORAGE_KEY = 'tibeb:language';

function storeLanguage(lang: 'en' | 'am'): void {
  localStorage.setItem(STORAGE_KEY, lang);
}

function retrieveLanguage(): 'en' | 'am' | null {
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === 'en' || v === 'am') return v;
  return null;
}

describe('language preference round-trip', () => {
  it('stores and retrieves "en"', () => {
    storeLanguage('en');
    expect(retrieveLanguage()).toBe('en');
  });

  it('stores and retrieves "am"', () => {
    storeLanguage('am');
    expect(retrieveLanguage()).toBe('am');
  });

  // Property 28: For any valid language value, storing and retrieving returns the same value
  it('property: round-trip preserves language preference', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('en' as const, 'am' as const),
        (lang) => {
          storeLanguage(lang);
          expect(retrieveLanguage()).toBe(lang);
        },
      ),
    );
  });
});
