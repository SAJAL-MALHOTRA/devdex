'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';

type AuthMode = 'sign-in' | 'sign-up';

const inputClass =
  'mt-2 w-full rounded-lg border border-white/10 bg-[#0b0b0b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-700 focus:border-[#e85d4a]/70';

export default function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode: AuthMode = searchParams.get('mode') === 'sign-in' ? 'sign-in' : 'sign-up';
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const name = String(formData.get('name') ?? '').trim();
    const supabase = createSupabaseBrowserClient();

    try {
      if (mode === 'sign-up') {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (authError) throw authError;
        if (data.session) {
          router.replace('/dashboard');
          return;
        }
        setMessage('Check your email to confirm your account, then sign in to build your profile.');
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
        router.replace('/dashboard');
        return;
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to authenticate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-5 py-10">
      <section className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111] p-7 sm:p-9">
        <Link href="/" className="font-mono text-xs tracking-[0.22em] text-gray-500 transition hover:text-white">
          DEVDEX
        </Link>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight text-white">
          {mode === 'sign-up' ? 'Create your profile' : 'Welcome back'}
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-500">
          {mode === 'sign-up'
            ? 'Make your work easy to discover, share, and save.'
            : 'Sign in to update your developer portfolio.'}
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {mode === 'sign-up' && (
            <label className="block text-xs font-medium text-gray-300">
              Full name
              <input className={inputClass} name="name" autoComplete="name" required maxLength={100} />
            </label>
          )}
          <label className="block text-xs font-medium text-gray-300">
            Email
            <input className={inputClass} name="email" type="email" autoComplete="email" required maxLength={254} />
          </label>
          <label className="block text-xs font-medium text-gray-300">
            Password
            <input
              className={inputClass}
              name="password"
              type="password"
              autoComplete={mode === 'sign-up' ? 'new-password' : 'current-password'}
              required
              minLength={8}
              maxLength={128}
            />
          </label>
          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
          {message && <p role="status" className="text-sm text-emerald-400">{message}</p>}
          <button
            className="w-full rounded-lg bg-[#e85d4a] py-3 text-sm font-semibold text-white transition hover:bg-[#d14e3d] disabled:cursor-wait disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'PLEASE WAIT…' : mode === 'sign-up' ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </button>
        </form>
        {searchParams.get('authError') === 'confirmation' && (
          <p role="alert" className="mt-4 text-sm text-red-400">
            We couldn&apos;t confirm your email. Please try signing in again or request a new confirmation email.
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          {mode === 'sign-up' ? 'Already have an account?' : 'New to DevDex?'}{' '}
          <button
            type="button"
            onClick={() => {
              const nextMode = mode === 'sign-up' ? 'sign-in' : 'sign-up';
              router.replace(`/login?mode=${nextMode}`);
              setError('');
              setMessage('');
            }}
            className="font-medium text-white transition hover:text-[#e85d4a]"
          >
            {mode === 'sign-up' ? 'Sign in' : 'Create an account'}
          </button>
        </p>
      </section>
    </main>
  );
}
