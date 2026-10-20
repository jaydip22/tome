'use client';

import React from 'react';
import { BookOpen, Plus, Cloud, CloudOff, LogOut } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  onOpenAddModal: () => void;
  isCloudSynced: boolean;
  userEmail?: string | null;
  onSignOut?: () => void;
}

export function Navbar({
  onOpenAddModal,
  isCloudSynced,
  userEmail,
  onSignOut,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200/60 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <BookOpen className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-serif font-black text-xl tracking-tight text-zinc-900">
              Tome
            </span>
          </div>
        </Link>

        {/* Right Section: Add Button & Sync Status */}
        <div className="flex items-center space-x-3">
          
          {/* Cloud Sync Status */}
          {isCloudSynced ? (
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
              <Cloud className="w-3.5 h-3.5 text-emerald-600" />
              <span>Synced</span>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 hover:text-zinc-800 bg-zinc-100 hover:bg-zinc-200/80 px-2.5 py-1 rounded-full transition-colors"
              title="Set up multi-device cloud sync"
            >
              <CloudOff className="w-3.5 h-3.5 text-zinc-400" />
              <span>Cloud Sync</span>
            </Link>
          )}

          {/* User Email & Sign Out */}
          {userEmail && (
            <div className="flex items-center gap-2 pl-1">
              <span className="text-xs text-zinc-500 hidden md:inline max-w-[120px] truncate">
                {userEmail}
              </span>
              {onSignOut && (
                <button
                  onClick={onSignOut}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-md transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Clean Modern "+ Add Book" Pill */}
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 active:scale-95 rounded-full shadow-sm hover:shadow transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Book</span>
          </button>
        </div>
      </div>
    </header>
  );
}
