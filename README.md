# Tome — Personal Book Keeper & Reading Journal

A distraction-free, zero-bloat personal reading keeper and wishlist tracker built for web and mobile.

---

## ✨ Features

- **Effortless Auto-Fill:** Search by title, author, or ISBN powered by the **Google Books API**. 1-tap add to your library with high-res covers.
- **Graceful Fallback:** If a book isn't indexed, add it manually in seconds. If cover art is missing, Tome dynamically generates a beautiful typographic cover.
- **Focused Shelves:** 
  - **Currently Reading** (with started date)
  - **Finished** (with 5-star rating, finish month, and personal reflection journal)
  - **Wishlist** (books you want to read next)
- **Zero Distractions:** No social feeds, no algorithmic recommendations, no unsolicited community comments.
- **Mobile & Web Friendly (PWA):** Responsive touch-first design with bottom navigation on mobile. Can be installed directly to your phone's home screen.
- **Cloud Sync & Safety Net:** 
  - Works out of the box in local mode (saved in your browser).
  - Connect free **Supabase** for seamless multi-device sync across your phone and laptop with your email + PIN/password.
  - **Forgot Password Recovery:** 1-click email reset link or passwordless magic login.

---

## 🚀 Quick Start

### 1. Start the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 2. (Optional) Connect Cloud Sync Across Devices

To access your reading list from both your phone and laptop:

1. Create a free account at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard and run the code from [`supabase_schema.sql`](./supabase_schema.sql).
3. Create a `.env.local` file with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Restart `npm run dev`. You can now log in from any phone or computer with your email and PIN!
