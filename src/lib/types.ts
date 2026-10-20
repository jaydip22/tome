export type BookStatus = 'wishlist' | 'reading' | 'finished';

export interface Book {
  id: string;
  user_id?: string;
  title: string;
  author: string;
  cover_url?: string | null;
  status: BookStatus;
  started_date?: string | null; // e.g., '2026-10' or '2026-10-15'
  finished_date?: string | null; // e.g., '2026-10' or '2026-10-20'
  rating?: number | null; // 1 to 5
  reflections?: string | null; // Personal notes, feelings, takeaways
  pages?: number | null;
  published_year?: string | null;
  isbn?: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface GoogleBookSearchResult {
  id: string;
  title: string;
  authors: string[];
  coverUrl: string | null;
  description: string;
  publishedDate?: string;
  pageCount?: number;
  isbn?: string;
}
