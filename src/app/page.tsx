'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { AddBookModal } from '../components/AddBookModal';
import { ManualBookModal } from '../components/ManualBookModal';
import { BookDetailModal } from '../components/BookDetailModal';
import { BookPlaceholder } from '../components/BookPlaceholder';
import { Book, BookStatus, GoogleBookSearchResult } from '../lib/types';
import { fetchBooks, saveBook, updateBookStatus, deleteBook } from '../lib/storage';
import { isSupabaseConfigured, supabase } from '../lib/supabase/client';
import { Search, Plus, Check, Star, X } from 'lucide-react';

type FilterType = 'all' | 'reading' | 'finished' | 'wishlist';

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  // Auth
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    loadLibrary();

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUserEmail(session?.user?.email || null);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUserEmail(session?.user?.email || null);
        loadLibrary();
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  async function loadLibrary() {
    setLoading(true);
    const data = await fetchBooks();
    setBooks(data);
    setLoading(false);
  }

  // Add book from search
  const handleAddFromSearch = async (result: GoogleBookSearchResult, targetStatus: BookStatus) => {
    const nowMonth = new Date().toISOString().slice(0, 7);
    const newBook: Omit<Book, 'id' | 'created_at' | 'updated_at'> = {
      title: result.title,
      author: result.authors.join(', ') || 'Unknown Author',
      cover_url: result.coverUrl,
      status: targetStatus,
      pages: result.pageCount || null,
      published_year: result.publishedDate || null,
      isbn: result.isbn || null,
      description: result.description || null,
      started_date: targetStatus === 'reading' ? nowMonth : null,
      finished_date: targetStatus === 'finished' ? nowMonth : null,
    };

    const saved = await saveBook(newBook);
    setBooks((prev) => [saved, ...prev]);
    setIsAddModalOpen(false);
    showToast(`Added "${result.title}" to library!`);
  };

  // Add book manually
  const handleSaveManualBook = async (manualBook: Omit<Book, 'id' | 'created_at' | 'updated_at'>) => {
    const saved = await saveBook(manualBook);
    setBooks((prev) => [saved, ...prev]);
    showToast(`Added "${manualBook.title}" to library!`);
  };

  // Update existing book
  const handleUpdateBook = async (updated: Book) => {
    const saved = await saveBook(updated);
    setBooks((prev) => prev.map((b) => (b.id === saved.id ? saved : b)));
    showToast(`Updated "${saved.title}".`);
  };

  // Delete book
  const handleDeleteBook = async (id: string) => {
    await deleteBook(id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
    showToast('Book removed from library.');
  };

  // Counts for the 4 filters
  const counts = {
    all: books.length,
    reading: books.filter((b) => b.status === 'reading').length,
    finished: books.filter((b) => b.status === 'finished').length,
    wishlist: books.filter((b) => b.status === 'wishlist').length,
  };

  // Filter books by active filter & search query
  const filteredBooks = books
    .filter((b) => {
      if (activeFilter === 'all') return true;
      return b.status === activeFilter;
    })
    .filter((b) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.description && b.description.toLowerCase().includes(q)) ||
        (b.reflections && b.reflections.toLowerCase().includes(q))
      );
    });

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] pb-24 sm:pb-12">
      
      {/* Toast */}
      {toast && (
        <div className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white text-xs font-medium px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in duration-150 max-w-[90vw]">
          <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2.5]" />
          <span className="truncate">{toast}</span>
        </div>
      )}

      {/* Header */}
      <Navbar
        onOpenAddModal={() => setIsAddModalOpen(true)}
        isCloudSynced={Boolean(isSupabaseConfigured && userEmail)}
        userEmail={userEmail}
        onSignOut={async () => {
          if (supabase) {
            await supabase.auth.signOut();
            setUserEmail(null);
            loadLibrary();
          }
        }}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-8 py-4 sm:py-8">
        
        {/* Controls: Filters + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
          
          {/* 4 Filters: Smooth horizontal scroll strip on mobile */}
          <div className="flex items-center gap-1.5 p-1 bg-zinc-200/60 rounded-xl overflow-x-auto no-scrollbar w-full sm:w-auto">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'reading', label: 'Reading' },
                { id: 'finished', label: 'Finished' },
                { id: 'wishlist', label: 'Wishlist' },
              ] as { id: FilterType; label: string }[]
            ).map((tab) => {
              const isActive = activeFilter === tab.id;
              const count = counts[tab.id];

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 active:scale-95 ${
                    isActive
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-zinc-100 text-zinc-800' : 'bg-zinc-200/80 text-zinc-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library..."
              className="w-full pl-9 pr-8 py-2 text-base sm:text-xs rounded-xl border border-zinc-200 bg-white text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 1. DESKTOP VIEW: Full 6-Column Table (Hidden on small screens) */}
        {/* ========================================================= */}
        <div className="hidden md:block bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-200/80 bg-zinc-50/70 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                <th className="py-3 px-4 w-12 text-center">#</th>
                <th className="py-3 px-3 w-16">Cover</th>
                <th className="py-3 px-4 w-60">Book Name</th>
                <th className="py-3 px-3 w-28">Status</th>
                <th className="py-3 px-4 w-44">Author Name</th>
                <th className="py-3 px-4 min-w-[200px]">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-xs text-zinc-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-zinc-400">
                    Loading library...
                  </td>
                </tr>
              ) : filteredBooks.length > 0 ? (
                filteredBooks.map((book, index) => (
                  <tr
                    key={book.id}
                    onClick={() => {
                      setSelectedBook(book);
                      setIsDetailModalOpen(true);
                    }}
                    className="hover:bg-zinc-50/90 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5 px-4 text-center font-mono text-zinc-400 text-xs">
                      {index + 1}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="w-9 h-13 shrink-0 rounded overflow-hidden shadow-sm bg-zinc-100 border border-zinc-200/60">
                        {book.cover_url ? (
                          <img
                            src={book.cover_url}
                            alt={book.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                            style={{ aspectRatio: '2 / 3' }}
                            loading="lazy"
                          />
                        ) : (
                          <BookPlaceholder
                            title={book.title}
                            author={book.author}
                            className="text-[7px] p-1"
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-medium text-zinc-900">
                      <div className="line-clamp-2 font-serif group-hover:text-amber-800 transition-colors">
                        {book.title}
                      </div>
                      {book.status === 'finished' && book.rating && (
                        <div className="flex items-center gap-1 text-[11px] text-amber-600 mt-0.5">
                          <span>★ {book.rating}.0</span>
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      {book.status === 'reading' && (
                        <span className="inline-flex items-center text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          Reading
                        </span>
                      )}
                      {book.status === 'finished' && (
                        <span className="inline-flex items-center text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                          Finished
                        </span>
                      )}
                      {book.status === 'wishlist' && (
                        <span className="inline-flex items-center text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200/60">
                          Wishlist
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-zinc-600">
                      <span className="line-clamp-1">{book.author}</span>
                    </td>
                    <td className="py-2.5 px-4 text-zinc-500">
                      <span className="line-clamp-2 leading-relaxed text-[11px]">
                        {book.description || (book.reflections ? `"${book.reflections}"` : '—')}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-zinc-400">
                    <p className="text-sm font-medium text-zinc-600">No books found</p>
                    <p className="text-xs text-zinc-400 mt-1">
                      {searchQuery
                        ? 'Try adjusting your search query.'
                        : `No books currently in "${activeFilter}".`}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Desktop Table Footer */}
          <div className="py-2.5 px-4 bg-zinc-50/70 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
            <span>
              Showing {filteredBooks.length} of {books.length} books
            </span>
            <span className="text-[11px] italic">
              Click any row to view details, update rating, or add comments
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. MOBILE VIEW: Touch-Optimized Compact List (Hidden on desktop) */}
        {/* ========================================================= */}
        <div className="md:hidden space-y-2.5">
          {loading ? (
            <div className="py-16 text-center text-xs text-zinc-400 bg-white rounded-2xl border border-zinc-200/80">
              Loading library...
            </div>
          ) : filteredBooks.length > 0 ? (
            filteredBooks.map((book, index) => (
              <div
                key={book.id}
                onClick={() => {
                  setSelectedBook(book);
                  setIsDetailModalOpen(true);
                }}
                className="bg-white p-3 rounded-2xl border border-zinc-200/80 shadow-sm flex items-start gap-3 active:bg-zinc-50 active:scale-[0.99] transition-all"
              >
                {/* Cover Thumbnail */}
                <div className="w-12 h-17 shrink-0 rounded-md overflow-hidden shadow-sm bg-zinc-100 border border-zinc-200/60 relative">
                  {book.cover_url ? (
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      style={{ aspectRatio: '2 / 3' }}
                      loading="lazy"
                    />
                  ) : (
                    <BookPlaceholder
                      title={book.title}
                      author={book.author}
                      className="text-[7px] p-1"
                    />
                  )}
                  {/* Row index indicator */}
                  <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[9px] font-mono px-1 rounded-tl">
                    #{index + 1}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-serif font-bold text-sm text-zinc-900 leading-snug line-clamp-2">
                      {book.title}
                    </h4>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {book.status === 'reading' && (
                        <span className="text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          Reading
                        </span>
                      )}
                      {book.status === 'finished' && (
                        <span className="text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                          Finished
                        </span>
                      )}
                      {book.status === 'wishlist' && (
                        <span className="text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200/60">
                          Wishlist
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-500 font-medium truncate mt-0.5">
                    {book.author}
                  </p>

                  {/* Rating or Description snippet */}
                  <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px]">
                    {book.description ? (
                      <p className="text-zinc-400 line-clamp-1 italic">
                        {book.description}
                      </p>
                    ) : (
                      <span className="text-zinc-300 italic text-[10px]">Tap to add details</span>
                    )}

                    {book.status === 'finished' && book.rating && (
                      <span className="shrink-0 font-semibold text-amber-600">
                        ★ {book.rating}.0
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-zinc-400 bg-white rounded-2xl border border-zinc-200/80 px-4">
              <p className="text-sm font-medium text-zinc-600">No books found</p>
              <p className="text-xs text-zinc-400 mt-1">
                {searchQuery
                  ? 'Try adjusting your search query.'
                  : `No books in "${activeFilter}".`}
              </p>
            </div>
          )}

          {/* Mobile Count Info */}
          {filteredBooks.length > 0 && (
            <div className="text-center text-[11px] text-zinc-400 pt-1">
              Showing {filteredBooks.length} of {books.length} books • Tap any book to view details
            </div>
          )}
        </div>
      </main>

      {/* ========================================================= */}
      {/* Mobile Floating Action Button (FAB) for fast 1-thumb add */}
      {/* ========================================================= */}
      <button
        onClick={() => setIsAddModalOpen(true)}
        className="md:hidden fixed bottom-6 right-5 z-40 w-13 h-13 rounded-full bg-zinc-900 text-white shadow-xl shadow-zinc-900/30 flex items-center justify-center active:scale-90 transition-transform"
        aria-label="Add Book"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddBook={handleAddFromSearch}
        onOpenManualEntry={() => setIsManualModalOpen(true)}
      />

      {/* Manual Entry Modal */}
      <ManualBookModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSaveManualBook={handleSaveManualBook}
      />

      {/* Book Level Detail Modal */}
      <BookDetailModal
        book={selectedBook}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedBook(null);
        }}
        onUpdateBook={handleUpdateBook}
        onDeleteBook={handleDeleteBook}
      />
    </div>
  );
}
