'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/src/context/authContext';
import { api, ApiRequestError } from '@/src/services/api';
import type { User } from '@/src/types';

interface AuthResponse {
  token: string;
  user: User;
}

/**
 * useAuth — auth state, login/register/logout actions, JWT expiry detection.
 *
 * JWT is stored in an httpOnly cookie set by the backend.
 * It is NEVER stored in localStorage or sessionStorage.
 */
export function useAuth() {
  const { user, setUser, logout } = useAuthContext();
  const router = useRouter();

  // On mount, fetch the current user profile to hydrate auth state.
  // If the cookie is missing/expired the backend returns 401, which the
  // api wrapper converts to a redirect to /login.
  useEffect(() => {
    if (user) return; // already hydrated

    api
      .get<User>('/profile')
      .then((u) => setUser(u))
      .catch((err) => {
        // 401 is handled by api.ts (redirects to /login); ignore other errors
        if (!(err instanceof ApiRequestError && err.status === 401)) {
          console.error('Failed to fetch profile:', err);
        }
      });
  }, [user, setUser]);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      const res = await api.post<AuthResponse>('/auth/login', { email, password });
      // JWT is set as httpOnly cookie by the backend — we only store the profile
      setUser(res.user);
      router.push('/dashboard');
    },
    [setUser, router],
  );

  const register = useCallback(
    async (
      email: string,
      displayName: string,
      password: string,
      grade: number,
    ): Promise<void> => {
      const res = await api.post<AuthResponse>('/auth/register', {
        email,
        display_name: displayName,
        password,
        grade,
      });
      setUser(res.user);
      router.push('/dashboard');
    },
    [setUser, router],
  );

  return { user, login, register, logout };
}
