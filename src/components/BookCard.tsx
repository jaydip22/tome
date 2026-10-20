'use client';

import React, { useState } from 'react';
import { Book, BookStatus } from '../lib/types';
import { BookPlaceholder } from './BookPlaceholder';
import { StarRating } from './StarRating';
import { CheckCircle2, BookOpen, Bookmark, Calendar, Trash2, ArrowRight } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onOpenDetails: (book: Book) => void;
  onQuickFinish: (book: Book) => void;
  onStatusChange: (id: string, newStatus: BookStatus) => void;
  onDelete: (id: string) => void;
}

export function BookCard({
  book,
  onOpenDetails,
  onQuickFinish,
  onStatusChange,
  onDelete,
}: BookCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative bg-white rounded-2xl border border-zinc-200/70 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Cover Container */}
      <div
        onClick={() => onOpenDetails(book)}
        className="cursor-pointer relative w-full pt-6 pb-4 px-4 bg-gradient-to-b from-zinc-50 to-white flex items-center justify-center"
      >
        <div className="w-28 sm:w-32 rounded-lg overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.12)] group-hover:shadow-[0_12px_24px_rgba(0,0,0,0.16)] transition-all duration-300 transform group-hover:scale-[1.02]">
          {book.cover_url && !imageError ? (
            <img
              src={book.cover_url}
              alt={book.title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-auto object-cover"
              style={{ aspectRatio: '2 / 3' }}
              loading="lazy"
            />
          ) : (
            <BookPlaceholder title={book.title} author={book.author} />
          )}
        </div>

        {/* Minimalist Status Indicator */}
        <div className="absolute top-3 left-3">
          {book.status === 'reading' && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              Reading
            </span>
          )}
          {book.status === 'finished' && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
              Finished
            </span>
          )}
          {book.status === 'wishlist' && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200/60">
              Wishlist
            </span>
          )}
        </div>
      </div>

      {/* Book Information */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div onClick={() => onOpenDetails(book)} className="cursor-pointer space-y-1">
          <h4 className="font-serif font-bold text-zinc-900 text-sm leading-snug line-clamp-2 group-hover:text-amber-800 transition-colors">
            {book.title}
          </h4>
          <p className="text-xs text-zinc-500 font-normal line-clamp-1">
            {book.author}
          </p>

          {/* Rating for finished books */}
          {book.status === 'finished' && (
            <div className="pt-2 flex items-center gap-1.5">
              <StarRating rating={book.rating || 0} readOnly size="sm" />
              {book.rating ? (
                <span className="text-[11px] font-semibold text-zinc-700">
                  {book.rating}.0
                </span>
              ) : (
                <span className="text-[10px] text-zinc-400 italic">Unrated</span>
              )}
            </div>
          )}

          {/* Editorial Reflection snippet */}
          {book.status === 'finished' && book.reflections && (
            <div className="pt-2">
              <p className="text-[11px] text-zinc-600 italic line-clamp-2 bg-zinc-50/80 p-2 rounded-lg border border-zinc-100 leading-relaxed font-serif">
                “{book.reflections}”
              </p>
            </div>
          )}

          {/* Metadata: Dates or Pages */}
          <div className="pt-2 flex items-center gap-2 text-[10px] text-zinc-400">
            {book.status === 'reading' && book.started_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Started {book.started_date}
              </span>
            )}
            {book.status === 'finished' && book.finished_date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Finished {book.finished_date}
              </span>
            )}
            {book.pages && <span>• {book.pages}p</span>}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
          {book.status === 'wishlist' && (
            <button
              onClick={() => onStatusChange(book.id, 'reading')}
              className="text-zinc-700 hover:text-emerald-700 font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5" /> Start Reading
            </button>
          )}

          {book.status === 'reading' && (
            <button
              onClick={() => onQuickFinish(book)}
              className="text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Finish Book
            </button>
          )}

          {book.status === 'finished' && (
            <button
              onClick={() => onOpenDetails(book)}
              className="text-zinc-500 hover:text-zinc-900 font-medium inline-flex items-center gap-1 transition-colors"
            >
              Reflection <ArrowRight className="w-3 h-3" />
            </button>
          )}

          {/* Delete Button */}
          <button
            onClick={() => onDelete(book.id)}
            className="p-1 text-zinc-300 hover:text-red-500 rounded transition-colors ml-auto"
            title="Remove from library"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
