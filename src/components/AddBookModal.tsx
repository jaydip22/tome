'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, Plus, PenSquare, Bookmark, BookOpen, CheckCircle2 } from 'lucide-react';
import { GoogleBookSearchResult, BookStatus } from '../lib/types';
import { searchGoogleBooks } from '../lib/googleBooks';
import { BookPlaceholder } from './BookPlaceholder';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (result: GoogleBookSearchResult, status: BookStatus) => void;
  onOpenManualEntry: () => void;
}

export function AddBookModal({
  isOpen,
  onClose,
  onAddBook,
  onOpenManualEntry,
}: AddBookModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GoogleBookSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
      setResults([]);
      setHasSearched(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const res = await searchGoogleBooks(query);
      setResults(res);
      setHasSearched(true);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full sm:max-w-xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-zinc-200/80 flex flex-col max-h-[90vh] sm:max-h-[85vh] overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-200">
        
        {/* Mobile grab handle */}
        <div className="pt-3 pb-1 sm:hidden flex justify-center bg-zinc-50/50">
          <div className="w-12 h-1.5 bg-zinc-300 rounded-full" />
        </div>

        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-serif font-bold text-lg text-zinc-900">
              Add to Library
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-200/60 active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, author, or ISBN..."
              className="w-full pl-10 pr-10 py-2.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-all shadow-sm"
            />
            {loading && (
              <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 animate-spin" />
            )}
          </div>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {query.trim().length === 0 && (
            <div className="text-center py-10 px-4 text-zinc-400">
              <Search className="w-10 h-10 mx-auto mb-2 opacity-30 stroke-[1.5]" />
              <p className="text-xs text-zinc-500">
                Type a title or author above to auto-fetch details and covers.
              </p>
              <div className="mt-4">
                <button
                  onClick={() => {
                    onClose();
                    onOpenManualEntry();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 px-4 py-2 rounded-full transition-colors"
                >
                  <PenSquare className="w-3.5 h-3.5" /> Or add details manually
                </button>
              </div>
            </div>
          )}

          {query.trim().length > 0 && !loading && results.length === 0 && hasSearched && (
            <div className="text-center py-10 px-4">
              <p className="text-xs text-zinc-500">No books found for &quot;{query}&quot;.</p>
              <button
                onClick={() => {
                  onClose();
                  onOpenManualEntry();
                }}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 px-4 py-2 rounded-full transition-colors"
              >
                <PenSquare className="w-3.5 h-3.5" /> Can&apos;t find it? Add manually
              </button>
            </div>
          )}

          {results.map((book) => (
            <div
              key={book.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-zinc-150 hover:border-zinc-300 hover:bg-zinc-50/70 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Cover */}
                <div className="w-11 h-16 shrink-0 rounded overflow-hidden shadow-sm bg-zinc-100">
                  {book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookPlaceholder
                      title={book.title}
                      author={book.authors[0] || 'Unknown'}
                      className="text-[8px] p-1"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h4 className="font-serif font-bold text-sm text-zinc-900 truncate">
                    {book.title}
                  </h4>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">
                    {book.authors.join(', ')}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
                    {book.publishedDate && <span>{book.publishedDate}</span>}
                    {book.pageCount && <span>• {book.pageCount}p</span>}
                  </div>
                </div>
              </div>

              {/* 1-Tap Add Action Buttons */}
              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 w-full sm:w-auto justify-end pt-1 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                <button
                  onClick={() => onAddBook(book, 'wishlist')}
                  className="flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-100 hover:bg-zinc-200 active:scale-95 text-zinc-700 transition-all text-center"
                >
                  + Wishlist
                </button>
                <button
                  onClick={() => onAddBook(book, 'reading')}
                  className="flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-700 transition-all text-center"
                >
                  + Reading
                </button>
                <button
                  onClick={() => onAddBook(book, 'finished')}
                  className="flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-700 transition-all text-center"
                >
                  + Finished
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 safe-area-bottom">
          <span className="text-[11px]">Powered by Google & OpenLibrary</span>
          <button
            onClick={() => {
              onClose();
              onOpenManualEntry();
            }}
            className="text-zinc-800 hover:text-black font-semibold flex items-center gap-1.5 transition-colors"
          >
            <PenSquare className="w-3.5 h-3.5" /> Manual Entry
          </button>
        </div>
      </div>
    </div>
  );
}
