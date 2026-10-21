import { Book, BookStatus } from './types';
import { supabase, isSupabaseConfigured } from './supabase/client';

const LOCAL_STORAGE_KEY = 'books_app_personal_library';

export async function fetchBooks(): Promise<Book[]> {
  if (typeof window === 'undefined') return [];

  // Try Supabase if configured and logged in
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase
          .from('books')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data as Book[];
        }
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local storage:', e);
    }
  }

  // Fallback to localStorage
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed reading localStorage:', e);
    return [];
  }
}

export async function saveBook(book: Omit<Book, 'id' | 'created_at' | 'updated_at'> & { id?: string }): Promise<Book> {
  const now = new Date().toISOString();
  const bookToSave: Book = {
    ...book,
    id: book.id || crypto.randomUUID(),
    created_at: (book as Book).created_at || now,
    updated_at: now,
  };

  // Try Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const payload = {
          ...bookToSave,
          user_id: session.user.id,
        };
        const { data, error } = await supabase
          .from('books')
          .upsert(payload)
          .select()
          .single();

        if (!error && data) {
          return data as Book;
        }
      }
    } catch (e) {
      console.warn('Supabase upsert failed, saving locally:', e);
    }
  }

  // Fallback to localStorage
  const existing = await fetchBooks();
  const index = existing.findIndex((b) => b.id === bookToSave.id);
  let updatedList: Book[];

  if (index >= 0) {
    updatedList = [...existing];
    updatedList[index] = {
      ...existing[index],
      ...bookToSave,
      updated_at: now,
    };
  } else {
    updatedList = [bookToSave, ...existing];
  }

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
  return bookToSave;
}

export async function updateBookStatus(
  id: string,
  status: BookStatus,
  extra?: { started_date?: string | null; finished_date?: string | null; rating?: number | null; reflections?: string | null }
): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase
          .from('books')
          .update({
            status,
            ...extra,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);
        return;
      }
    } catch (e) {
      console.warn('Supabase status update failed:', e);
    }
  }

  // Local storage update
  const books = await fetchBooks();
  const updated = books.map((b) => {
    if (b.id === id) {
      return {
        ...b,
        status,
        ...(extra || {}),
        updated_at: new Date().toISOString(),
      };
    }
    return b;
  });
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
}

export async function deleteBook(id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('books').delete().eq('id', id);
        return;
      }
    } catch (e) {
      console.warn('Supabase delete failed:', e);
    }
  }

  const books = await fetchBooks();
  const updated = books.filter((b) => b.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
}
