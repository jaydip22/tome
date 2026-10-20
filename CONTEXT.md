# Tome — Project Context & Implementation Summary

**Location:** `/Users/jaideep/Documents/Books App`  
**Application Name:** Tome (Personal Book Keeper & Reading Journal)  
**Date Created:** October 20, 2026  

---

## 1. Project Overview & Motivation

### The Problem
- **Google Keep & Notion:** Manual data entry is too slow and cumbersome (manually copying titles, authors, page counts, and pasting cover images).
- **Goodreads & Bookmory:** Cluttered with community social feeds, unsolicited recommendations, friend activity, and micro-tracking bloat.
- **The Vision:** A private, personal, distraction-free book keeping web application designed for both mobile and desktop. Zero social graph, zero algorithmic feeds.

### Key Requirements
- **Frictionless Entry:** Auto-fetch book metadata and cover images via APIs (Google Books + Open Library fallback).
- **Graceful Fallback:** If a book isn't indexed, allow manual entry. If cover art is missing, dynamically generate an aesthetic typographic placeholder cover.
- **Shelves:** Track books across **Reading**, **Finished**, and **Wishlist**.
- **Reviews & Reflection:** 5-star rating system + dedicated "My Comments / Reflection" journal capturing personal feelings and key takeaways upon completing a book.
- **Table View:** Compact table with row numbers, cover thumbnail, book name, status pill, author name, and description preview.
- **Mobile Optimized:** Touch-friendly, bottom-sheet dialogs, floating action button, adaptive mobile cards without horizontal scrolling.
- **Multi-Device Cloud Sync:** Free Supabase backend (PostgreSQL + Auth) with email password reset and magic links, with a transparent local-storage fallback.

---

## 2. Tech Stack & Architecture

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) + TypeScript |
| **Styling** | Tailwind CSS (ES module PostCSS config) |
| **Icons** | Lucide React |
| **Database & Auth** | Supabase (PostgreSQL with Row Level Security) + Built-in Auth |
| **Local Storage** | Transparent browser `localStorage` fallback (works with zero config out of the box) |
| **Book APIs** | Google Books API with automatic fallback to Open Library API |
| **PWA** | Web App Manifest (`manifest.json`) + SVG App Icon |

---

## 3. Directory & File Structure

```
Books App/
├── CONTEXT.md                    # This project context summary file
├── README.md                     # Quickstart and setup guide
├── supabase_schema.sql           # SQL migration for Supabase tables & RLS policies
├── .env.local.example            # Template for Supabase URL and anon key
├── package.json                  # Scripts & dependencies
├── tsconfig.json                 # TypeScript compiler configuration
├── next.config.mjs               # Next.js configuration (remote image patterns)
├── tailwind.config.ts            # Tailwind CSS configuration
├── postcss.config.mjs            # PostCSS configuration for Tailwind
├── public/
│   ├── manifest.json             # PWA metadata for home screen installation
│   └── icon.svg                  # Vector application icon
└── src/
    ├── app/
    │   ├── globals.css           # Global Tailwind directives & scrollbar styles
    │   ├── layout.tsx            # Root layout with viewport & PWA meta tags
    │   ├── page.tsx              # Main table view, 4 filters, search & state management
    │   ├── login/
    │   │   └── page.tsx          # Login, signup, magic link, & password reset request
    │   ├── reset-password/
    │   │   └── page.tsx          # New password/PIN entry from email reset link
    │   └── auth/callback/
    │       └── route.ts          # Supabase auth code exchange handler
    ├── components/
    │   ├── Navbar.tsx            # Minimalist header (logo, sync status, Add Book CTA)
    │   ├── BookDetailModal.tsx   # Full book view (description below author, rating, reflection)
    │   ├── AddBookModal.tsx      # Google Books + Open Library debounced search modal
    │   ├── ManualBookModal.tsx   # Custom manual book entry form
    │   ├── BookCard.tsx          # Card view component (available for grid layouts)
    │   ├── BookPlaceholder.tsx   # Dynamic typographic aesthetic book cover generator
    │   ├── StarRating.tsx        # Interactive 5-star rating component
    │   └── BottomNav.tsx         # Mobile bottom navigation bar
    └── lib/
        ├── types.ts              # TypeScript interfaces (Book, BookStatus, SearchResult)
        ├── storage.ts            # Unified storage engine (Supabase <-> LocalStorage)
        ├── googleBooks.ts        # Dual search engine (Google Books + Open Library fallback)
        └── supabase/
            └── client.ts         # Browser Supabase client initialization
```

---

## 4. Key Workflows & Features Implemented

### A. Main Page Table View
- **Columns:**
  1. `#` (Row Number): Sequential index.
  2. `Cover`: Small thumbnail (`36px × 52px`), just high enough to preview the cover.
  3. `Book Name`: Title in bold serif + gold star indicator if finished.
  4. `Status`: Distinctive pills (`Reading` = soft emerald, `Finished` = soft amber, `Wishlist` = neutral gray).
  5. `Author Name`: Clean secondary text.
  6. `Description`: Compact preview of the synopsis or personal reflection.
- **Row Height:** Compact and optimized to match the thumbnail height without wasted vertical space.
- **Row Click:** Tapping or clicking any row opens the **Book Details Modal**.

### B. 4 Filters & Search Bar
- **Filters:** `All`, `Reading`, `Finished`, `Wishlist` with live count badges.
- **Search:** Instant client-side search across book title, author, description, and reflections.

### C. Book Details Modal
- **Layout Order:**
  1. **Book Name** (Editable)
  2. **Author Name** (Editable)
  3. **Book Description** *(Positioned directly below Author Name as requested)*
  4. **Reading Status** (One-tap pills: Reading, Finished, Wishlist)
  5. **Start Date & End Date** (Month/year pickers)
  6. **Rating** (Interactive 5-star rating)
  7. **My Comments & Reflection** (Spacious textarea for personal feedback on how the book felt)
  8. **Save Changes & Remove Book** buttons.

### D. Zero-Friction Book Addition
- **Instant Search:** Type any title, author, or ISBN → queries Google Books API with a 300ms debounce.
- **Open Library Fallback:** If Google Books fails or returns empty, automatically falls back to Open Library API.
- **1-Tap Add Buttons:** Add directly to `+ Wishlist`, `+ Reading`, or `+ Finished` straight from search results.
- **Manual Entry:** If an indie/rare book isn't indexed, tap "Manual Entry" to set custom details.
- **Smart Typographic Cover:** Generates a custom gradient cover with title, author, and spine if no image exists.
- **`referrerPolicy="no-referrer"`:** Added to all cover images to prevent Google Books 403 Forbidden blocking.

### E. Mobile-First Experience
- **Adaptive List View on Mobile (`< 768px`):** Replaces horizontal table scrolling with clean, compact touch cards showing cover, index badge, title, author, status, and description snippet.
- **Bottom-Sheet Modals:** Dialogs slide up from the bottom with a native grab handle on phones.
- **16px Mobile Form Inputs:** Prevents iOS Safari from jarringly zooming into inputs on focus.
- **Floating Action Button (FAB):** Fixed `+` button in the bottom-right corner for one-thumb book additions.
- **Horizontal Scrollable Filter Strip:** Clean swipeable pills on mobile with hidden scrollbars.

### F. Multi-Device Cloud Sync & Recovery
- **Works Instantly:** Operates locally in the browser with pre-seeded demo books.
- **Supabase Cloud Sync:** Connecting `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` syncs books to PostgreSQL via Row Level Security (RLS).
- **Password Recovery:** Includes email reset links (`/reset-password`) and passwordless magic links (`/login`).

---

## 5. Development & Running

### Starting Development Server
```bash
npm run dev
```
Accessible at: **`http://localhost:3000`**

### Production Build
```bash
npm run build
npm run start
```

### Connecting Supabase (Optional for Multi-Device Sync)
1. Run [`supabase_schema.sql`](./supabase_schema.sql) in the Supabase SQL editor.
2. Add your credentials into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Restart `npm run dev`. Log in or create an account via `/login`.
