'use client';

import React, { useState } from 'react';
import { X, BookPlus } from 'lucide-react';
import { Book, BookStatus } from '../lib/types';
import { BookPlaceholder } from './BookPlaceholder';

interface ManualBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveManualBook: (book: Omit<Book, 'id' | 'created_at' | 'updated_at'>) => void;
}

export function ManualBookModal({
  isOpen,
  onClose,
  onSaveManualBook,
}: ManualBookModalProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [status, setStatus] = useState<BookStatus>('wishlist');
  const [pages, setPages] = useState<string>('');
  const [publishedYear, setPublishedYear] = useState<string>('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSaveManualBook({
      title: title.trim(),
      author: author.trim() || 'Unknown Author',
      cover_url: coverUrl.trim() || null,
      status,
      pages: pages ? parseInt(pages, 10) : null,
      published_year: publishedYear.trim() || null,
      description: description.trim() || null,
      started_date: status === 'reading' ? new Date().toISOString().slice(0, 7) : null,
      finished_date: status === 'finished' ? new Date().toISOString().slice(0, 7) : null,
    });

    setTitle('');
    setAuthor('');
    setCoverUrl('');
    setPages('');
    setPublishedYear('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-zinc-200/80 flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-200">
        
        {/* Mobile grab handle */}
        <div className="pt-3 pb-1 sm:hidden flex justify-center bg-zinc-50/50">
          <div className="w-12 h-1.5 bg-zinc-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <h3 className="font-serif font-bold text-lg text-zinc-900 flex items-center gap-2">
            <BookPlus className="w-5 h-5 text-zinc-800" /> Add Book Manually
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-200/60 active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <div className="flex gap-4 items-start">
            {/* Live Preview */}
            <div className="w-20 sm:w-24 shrink-0 rounded-lg overflow-hidden shadow-sm">
              {coverUrl.trim() ? (
                <img
                  src={coverUrl}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  onError={() => {}}
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: '2 / 3' }}
                />
              ) : (
                <BookPlaceholder
                  title={title || 'Book Title'}
                  author={author || 'Author'}
                  className="text-[8px] p-1.5"
                />
              )}
              <span className="block text-[9px] text-center text-zinc-400 mt-1">Preview</span>
            </div>

            {/* Title & Author Inputs */}
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Book Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sapiens"
                  className="w-full px-3 py-2 text-base sm:text-sm rounded-xl border border-zinc-200 bg-zinc-50/60 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Yuval Noah Harari"
                  className="w-full px-3 py-2 text-base sm:text-sm rounded-xl border border-zinc-200 bg-zinc-50/60 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Shelf Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
              Initial Shelf
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['wishlist', 'reading', 'finished'] as BookStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl capitalize border transition-all ${
                    status === s
                      ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                      : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Cover Image URL */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
              Cover Image URL <span className="font-normal text-zinc-400 lowercase">(optional)</span>
            </label>
            <input
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://example.com/cover.jpg"
              className="w-full px-3 py-2 text-base sm:text-sm rounded-xl border border-zinc-200 bg-zinc-50/60 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Pages <span className="font-normal text-zinc-400 lowercase">(optional)</span>
              </label>
              <input
                type="number"
                value={pages}
                onChange={(e) => setPages(e.target.value)}
                placeholder="350"
                className="w-full px-3 py-2 text-base sm:text-sm rounded-xl border border-zinc-200 bg-zinc-50/60 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                Year <span className="font-normal text-zinc-400 lowercase">(optional)</span>
              </label>
              <input
                type="text"
                value={publishedYear}
                onChange={(e) => setPublishedYear(e.target.value)}
                placeholder="2022"
                className="w-full px-3 py-2 text-base sm:text-sm rounded-xl border border-zinc-200 bg-zinc-50/60 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
              Short Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary..."
              className="w-full px-3 py-2 text-base sm:text-sm rounded-xl border border-zinc-200 bg-zinc-50/60 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white resize-none transition-all"
            />
          </div>

          <div className="pt-3 border-t border-zinc-100 flex justify-end gap-2 safe-area-bottom">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2.5 text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 rounded-xl shadow-sm transition-colors"
            >
              Save to Library
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
