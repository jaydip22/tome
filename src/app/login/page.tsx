'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '../../lib/supabase/client';
import { BookMarked, ArrowLeft, Mail, Lock, Sparkles, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase) {
      setMessage({
        type: 'error',
        text: 'Supabase credentials are not configured yet. See .env.local.example to connect your free Supabase instance.',
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      if (useMagicLink) {
        // Send passwordless magic link to email
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage({
          type: 'success',
          text: 'Magic login link sent to your email! Click the link in your inbox to enter.',
        });
      } else if (isSignUp) {
        // Sign up with Email + Password/PIN
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage({
          type: 'success',
          text: 'Account created! If email confirmation is required, check your inbox.',
        });
      } else {
        // Sign in with Email + Password/PIN
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Authentication failed. Please check your credentials.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setMessage({
        type: 'error',
        text: 'Please enter your email address first so we know where to send the reset link.',
      });
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setMessage({
        type: 'error',
        text: 'Supabase credentials are not configured in .env.local yet.',
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setMessage({
        type: 'success',
        text: `Password reset link sent to ${email}! Check your inbox.`,
      });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Failed to send reset link.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Library
        </Link>

        {/* Brand */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md">
            <BookMarked className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-black text-2xl text-stone-900 dark:text-stone-100">
            Tome <span className="text-amber-600">.</span>
          </h2>
        </div>

        <h3 className="mt-4 text-center font-serif text-lg font-bold text-stone-800 dark:text-stone-200">
          {useMagicLink
            ? 'Passwordless Email Login'
            : isSignUp
            ? 'Create Your Personal Archive'
            : 'Access Your Personal Archive'}
        </h3>
        <p className="mt-1 text-center text-xs text-stone-500">
          Keep your books and reflections privately synced across all devices.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-stone-900 py-8 px-6 shadow-xl shadow-stone-200/50 dark:shadow-none rounded-2xl border border-stone-200/80 dark:border-stone-800">
          
          {/* Notification Message */}
          {message && (
            <div
              className={`mb-5 p-3 rounded-xl flex items-start gap-2 text-xs leading-relaxed ${
                message.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200'
                  : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 border border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {!isSupabaseConfigured && (
            <div className="mb-5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-xs text-amber-800 dark:text-amber-300">
              <strong>Notice:</strong> Running in local-first demo mode. To sync across multiple devices, connect your free Supabase credentials in <code className="bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded">.env.local</code>.
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Your Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            </div>

            {!useMagicLink && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Password / Master PIN
                  </label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11px] text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Forgot? Send reset link
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              {loading ? (
                'Processing...'
              ) : useMagicLink ? (
                <>
                  <Send className="w-3.5 h-3.5" /> Email Me a Login Link
                </>
              ) : isSignUp ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Alternate login modes */}
          <div className="mt-6 pt-5 border-t border-stone-100 dark:border-stone-800 flex flex-col gap-2 text-center text-xs">
            <button
              type="button"
              onClick={() => {
                setUseMagicLink(!useMagicLink);
                setMessage(null);
              }}
              className="text-stone-600 dark:text-stone-400 hover:text-amber-600 transition-colors"
            >
              {useMagicLink
                ? '← Use password / master PIN instead'
                : 'Or log in without a password via Email Link →'}
            </button>

            {!useMagicLink && (
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setMessage(null);
                }}
                className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 transition-colors font-medium"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : 'First time? Create your personal archive'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
