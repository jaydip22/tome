'use client';

import React, { useState, useEffect } from 'react';
import { X, Trash2, Save } from 'lucide-react';
import { Book, BookStatus } from '../lib/types';
import { BookPlaceholder } from './BookPlaceholder';
import { StarRating } from './StarRating';

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateBook: (updated: Book) => void;
  onDeleteBook: (id: string) => void;
}

export function BookDetailModal({
  book,
  isOpen,
  onClose,
  onUpdateBook,
  onDeleteBook,
}: BookDetailModalProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<BookStatus>('wishlist');
  const [rating, setRating] = useState<number>(0);
  const [comments, setComments] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    if (book) {
      setTitle(book.title || '');
      setAuthor(book.author || '');
      setDescription(book.description || '');
      setStatus(book.status);
      setRating(book.rating || 0);
      setComments(book.reflections || '');
      setStartDate(book.started_date || '');
      setEndDate(book.finished_date || '');
    }
  }, [book]);

  if (!isOpen || !book) return null;

  const handleStatusChange = (newStatus: BookStatus) => {
    setStatus(newStatus);
    const nowMonth = new Date().toISOString().slice(0, 7);
    if (newStatus === 'reading' && !startDate) {
      setStartDate(nowMonth);
    }
    if (newStatus === 'finished' && !endDate) {
      setEndDate(nowMonth);
    }
  };

  const handleSave = () => {
    onUpdateBook({
      ...book,
      title: title.trim() || book.title,
      author: author.trim() || book.author,
      description: description.trim() || null,
      status,
      rating: status === 'finished' ? rating : null,
      reflections: comments.trim() || null,
      started_date: startDate || null,
      finished_date: status === 'finished' ? (endDate || null) : null,
      updated_at: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-zinc-900/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full sm:max-w-2xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl border border-zinc-200/80 flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-200">
        
        {/* Mobile Grab Handle */}
        <div className="pt-3 pb-1 sm:hidden flex justify-center bg-zinc-50/50">
          <div className="w-12 h-1.5 bg-zinc-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <span className="text-xs uppercase tracking-wider font-bold text-zinc-500">
            Book Details & Review
          </span>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-200/60 active:scale-95 transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          
          {/* Top Section: Cover + Book Name, Author, Description, Status */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
            
            {/* Book Cover */}
            <div className="w-24 sm:w-32 shrink-0 rounded-lg overflow-hidden shadow-md mx-auto sm:mx-0">
              {book.cover_url ? (
                <img
                  src={book.cover_url}
                  alt={title}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: '2 / 3' }}
                />
              ) : (
                <BookPlaceholder title={title} author={author} />
              )}
            </div>

            {/* Core Fields */}
            <div className="flex-1 w-full space-y-3">
              {/* 1. Book Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Book Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-base font-serif font-bold text-zinc-900 px-3 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              {/* 2. Author Name */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full text-base sm:text-sm font-medium text-zinc-700 px-3 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                />
              </div>

              {/* 3. Book Description (Directly below Author Name) */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Book Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Book summary or premise..."
                  className="w-full text-sm sm:text-xs text-zinc-800 p-3 rounded-xl border border-zinc-200 bg-zinc-50/70 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white resize-y leading-relaxed transition-all"
                />
              </div>

              {/* 4. Reading Status */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Reading Status
                </label>
                <div className="grid grid-cols-3 sm:inline-flex p-1 bg-zinc-100 rounded-xl gap-1">
                  {(['reading', 'finished', 'wishlist'] as BookStatus[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleStatusChange(s)}
                      className={`py-2 px-3 sm:py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                        status === s
                          ? s === 'reading'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : s === 'finished'
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'bg-zinc-800 text-white shadow-sm'
                          : 'text-zinc-600 hover:text-zinc-900 active:bg-zinc-200/50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dates & Rating Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                Start Date
              </label>
              <input
                type="month"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-xs rounded-xl border border-zinc-200 bg-white text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                End Date
              </label>
              <input
                type="month"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={status !== 'finished'}
                className="w-full px-3 py-2 text-sm sm:text-xs rounded-xl border border-zinc-200 bg-white text-zinc-800 disabled:bg-zinc-100 disabled:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                Rating
              </label>
              <div className="pt-1.5 flex items-center gap-2">
                <StarRating
                  rating={rating}
                  onChange={(r) => setRating(r)}
                  size="md"
                />
                <span className="text-xs font-semibold text-zinc-700">
                  {rating > 0 ? `${rating} ★` : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* My Comments / Personal Reflections */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900">
                My Comments & Reflection
              </label>
              <span className="text-[11px] text-zinc-400 italic">How did you feel when you read the book?</span>
            </div>
            <textarea
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Write your honest review, emotional reaction, key takeaways, or favorite quotes..."
              className="w-full p-3.5 text-base sm:text-sm rounded-xl border border-zinc-200 bg-zinc-50/70 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white resize-y font-serif leading-relaxed transition-all"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 sm:px-6 py-4 bg-zinc-50/90 border-t border-zinc-100 flex items-center justify-between gap-3 safe-area-bottom">
          <button
            type="button"
            onClick={() => {
              if (confirm(`Remove "${book.title}" from your library?`)) {
                onDeleteBook(book.id);
                onClose();
              }
            }}
            className="text-zinc-400 hover:text-red-600 p-2.5 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Remove</span>
          </button>

          <div className="flex items-center gap-2 flex-1 sm:flex-initial justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200/70 rounded-xl transition-colors flex-1 sm:flex-initial text-center"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 active:scale-95 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
