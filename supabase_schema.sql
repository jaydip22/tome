-- ========================================================
-- Tome: Personal Book Keeper Database Schema
-- Run this in your Supabase SQL Editor (supabase.com/dashboard)
-- ========================================================

-- 1. Create books table
CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_url TEXT,
  status TEXT NOT NULL CHECK (status IN ('wishlist', 'reading', 'finished')),
  started_date TEXT,
  finished_date TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  reflections TEXT,
  pages INTEGER,
  published_year TEXT,
  isbn TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS) so each user only accesses their own books
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- 3. Policy: User can view their own books
CREATE POLICY "Users can view own books"
  ON public.books
  FOR SELECT
  USING (auth.uid() = user_id);

-- 4. Policy: User can insert their own books
CREATE POLICY "Users can insert own books"
  ON public.books
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. Policy: User can update their own books
CREATE POLICY "Users can update own books"
  ON public.books
  FOR UPDATE
  USING (auth.uid() = user_id);

-- 6. Policy: User can delete their own books
CREATE POLICY "Users can delete own books"
  ON public.books
  FOR DELETE
  USING (auth.uid() = user_id);

-- 7. Index for fast shelf lookups
CREATE INDEX IF NOT EXISTS books_user_status_idx ON public.books (user_id, status);
