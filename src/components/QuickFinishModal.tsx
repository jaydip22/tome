'use client';

import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';
import { Book } from '../lib/types';
import { StarRating } from './StarRating';

interface QuickFinishModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onFinishAndSave: (id: string, rating: number, reflections: string, finishedDate: string) => void;
}

export function QuickFinishModal({
  book,
  isOpen,
  onClose,
  onFinishAndSave,
}: QuickFinishModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [reflections, setReflections] = useState<string>('');
  const [finishedDate, setFinishedDate] = useState<string>(
    new Date().toISOString().slice(0, 7) // Current month
  );

  if (!isOpen || !book) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFinishAndSave(book.id, rating, reflections.trim(), finishedDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-zinc-200/80 p-6 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-serif font-bold text-lg text-zinc-900">
              Finished Reading!
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-zinc-500 mb-5">
          Record your rating and final impressions for <strong className="text-zinc-800">{book.title}</strong> by {book.author}.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Star Rating */}
          <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/60 flex flex-col items-center justify-center gap-2">
            <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
              Rate this book
            </span>
            <StarRating rating={rating} onChange={(r) => setRating(r)} size="lg" />
            <span className="text-xs font-semibold text-amber-900">
              {rating > 0 ? `${rating}.0 of 5 Stars` : 'Tap to rate'}
            </span>
          </div>

          {/* Finished Month */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
              Finished Date / Month
            </label>
            <input
              type="month"
              value={finishedDate}
              onChange={(e) => setFinishedDate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          {/* Reflection */}
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 mb-1">
              How did you feel when you finished?
            </label>
            <textarea
              rows={4}
              value={reflections}
              onChange={(e) => setReflections(e.target.value)}
              placeholder="What made this memorable? How did it leave you feeling? Any key insights?"
              className="w-full p-3 text-xs rounded-xl border border-zinc-200 bg-zinc-50/70 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white resize-none font-serif leading-relaxed"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors"
            >
              Skip for now
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl shadow-sm transition-colors"
            >
              Save to Finished Shelf
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
