'use client';

import React from 'react';
import { BookOpen, Plus, Cloud, CloudOff } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  onOpenAddModal: () => void;
  isCloudSynced: boolean;
}

export function Navbar({
  onOpenAddModal,
  isCloudSynced,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200/60 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-serif font-black text-xl tracking-tight text-zinc-900">Tome</span>
          </div>
        </Link>
        <div className="flex items-center space-x-3">
          {isCloudSynced ? (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              <Cloud className="w-3.5 h-3.5 text-emerald-600" /><span>Synced</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full border border-zinc-200/60">
              <CloudOff className="w-3.5 h-3.5 text-zinc-400" /><span>Not Connected</span>
            </div>
          )}
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 active:scale-95 rounded-full shadow-sm hover:shadow transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" /><span>Add Book</span>
          </button>
        </div>
      </div>
    </header>
  );
}
