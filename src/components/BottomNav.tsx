'use client';

import React from 'react';
import { Bookmark, BookOpen, CheckCircle2, Plus } from 'lucide-react';
import { BookStatus } from '../lib/types';

interface BottomNavProps {
  currentTab: BookStatus;
  onSelectTab: (tab: BookStatus) => void;
  onOpenAddModal: () => void;
  counts: {
    wishlist: number;
    reading: number;
    finished: number;
  };
}

export function BottomNav({
  currentTab,
  onSelectTab,
  onOpenAddModal,
  counts,
}: BottomNavProps) {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-zinc-200/80 px-4 py-2 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      
      {/* Reading */}
      <button
        onClick={() => onSelectTab('reading')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          currentTab === 'reading'
            ? 'text-zinc-900 font-bold scale-105'
            : 'text-zinc-400 hover:text-zinc-600'
        }`}
      >
        <div className="relative">
          <BookOpen className="w-5 h-5" />
          {counts.reading > 0 && (
            <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[9px] font-bold px-1 rounded-full">
              {counts.reading}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-1">Reading</span>
      </button>

      {/* Center Action: Add Book */}
      <button
        onClick={onOpenAddModal}
        className="-mt-5 w-12 h-12 rounded-full bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 flex items-center justify-center active:scale-95 transition-transform"
        aria-label="Add Book"
      >
        <Plus className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Finished */}
      <button
        onClick={() => onSelectTab('finished')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          currentTab === 'finished'
            ? 'text-zinc-900 font-bold scale-105'
            : 'text-zinc-400 hover:text-zinc-600'
        }`}
      >
        <div className="relative">
          <CheckCircle2 className="w-5 h-5" />
          {counts.finished > 0 && (
            <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[9px] font-bold px-1 rounded-full">
              {counts.finished}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-1">Finished</span>
      </button>

      {/* Wishlist */}
      <button
        onClick={() => onSelectTab('wishlist')}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
          currentTab === 'wishlist'
            ? 'text-zinc-900 font-bold scale-105'
            : 'text-zinc-400 hover:text-zinc-600'
        }`}
      >
        <div className="relative">
          <Bookmark className="w-5 h-5" />
          {counts.wishlist > 0 && (
            <span className="absolute -top-1 -right-2 bg-zinc-500 text-white text-[9px] font-bold px-1 rounded-full">
              {counts.wishlist}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-1">Wishlist</span>
      </button>
    </div>
  );
}
