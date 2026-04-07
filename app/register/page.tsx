'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/src/hooks/useAuth';
import { ApiRequestError } from '@/src/services/api';

const GRADES = [7, 8, 9, 10, 11, 12];

export default function RegisterPage() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [grade, setGrade] = useState<number>(9);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(email, displayName, password, grade);
    } catch (err) {
      if (err instanceof ApiRequestError) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-primary-container italic font-headline">
            Tibeb <span className="ethiopic-text">ጥበብ</span>
          </h1>
          <p className="text-on-surface-variant mt-2 text-sm">Create your account to start learning</p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-ambient">
          <h2 className="text-xl font-bold text-primary font-headline mb-6">Create account</h2>

          {error && (
            <div
              role="alert"
              className="mb-4 px-4 py-3 rounded-xl bg-error-container text-on-error-container text-sm"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {/* Display name */}
            <div className="flex flex-col gap-1">
              <label htmlFor="displayName" className="text-sm font-medium text-on-surface-variant">
                Full name
              </label>
              <input
                id="displayName"
                type="text"
                autoComplete="name"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="bg-surface-container-highest px-4 py-3 rounded-lg text-on-surface placeholder:text-outline focus:outline-none border-b-2 border-transparent focus:border-primary transition-colors"
                placeholder="Selamawit Tadesse"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-sm font-medium text-on-surface-variant">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-surface-container-highest px-4 py-3 rounded-lg text-on-surface placeholder:text-outline focus:outline-none border-b-2 border-transparent focus:border-primary transition-colors"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="password" className="text-sm font-medium text-on-surface-variant">
                Password <span className="text-outline text-xs">(min. 8 characters)</span>
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-surface-container-highest px-4 py-3 rounded-lg text-on-surface placeholder:text-outline focus:outline-none border-b-2 border-transparent focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Grade selector */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface-variant">
                Grade
              </label>
              <div className="flex gap-2 flex-wrap" role="group" aria-label="Select your grade">
                {GRADES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    aria-pressed={grade === g}
                    className={`w-12 h-12 rounded-xl font-bold text-sm transition-colors duration-200 ${
                      grade === g
                        ? 'bg-primary text-on-primary shadow-ambient'
                        : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-gradient-to-br from-primary to-primary-container text-on-primary py-3 rounded-lg font-bold text-base shadow-ambient hover:scale-[1.01] active:scale-[0.99] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            Already have an account?{' '}
            <Link href="/login" className="text-secondary font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
