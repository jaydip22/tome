import { GoogleBookSearchResult } from './types';

// Searches Google Books first, and falls back to Open Library if needed
export async function searchGoogleBooks(query: string): Promise<GoogleBookSearchResult[]> {
  if (!query || query.trim().length === 0) return [];

  const cleanQuery = query.trim();

  // 1. Try Google Books API
  try {
    const encoded = encodeURIComponent(cleanQuery);
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encoded}&maxResults=15&printType=books`
    );

    if (res.ok) {
      const data = await res.json();
      if (data.items && Array.isArray(data.items) && data.items.length > 0) {
        return data.items.map((item: any) => {
          const info = item.volumeInfo || {};

          let coverUrl: string | null = null;
          if (info.imageLinks) {
            coverUrl =
              info.imageLinks.extraLarge ||
              info.imageLinks.large ||
              info.imageLinks.medium ||
              info.imageLinks.small ||
              info.imageLinks.thumbnail ||
              null;

            if (coverUrl) {
              // Ensure https and clean parameters for high quality
              coverUrl = coverUrl.replace(/^http:\/\//i, 'https://');
              coverUrl = coverUrl.replace('&edge=curl', '');
            }
          }

          let isbn: string | undefined = undefined;
          if (Array.isArray(info.industryIdentifiers)) {
            const isbn13 = info.industryIdentifiers.find((id: any) => id.type === 'ISBN_13');
            const isbn10 = info.industryIdentifiers.find((id: any) => id.type === 'ISBN_10');
            isbn = isbn13?.identifier || isbn10?.identifier;
          }

          const publishedYear = info.publishedDate ? info.publishedDate.split('-')[0] : undefined;

          return {
            id: item.id || `gb-${Math.random()}`,
            title: info.title || 'Untitled',
            authors: info.authors && info.authors.length > 0 ? info.authors : ['Unknown Author'],
            coverUrl,
            description: info.description || '',
            publishedDate: publishedYear,
            pageCount: info.pageCount || undefined,
            isbn,
          };
        });
      }
    }
  } catch (err) {
    console.warn('Google Books API fetch failed, trying OpenLibrary fallback...', err);
  }

  // 2. Open Library API Fallback
  try {
    const encoded = encodeURIComponent(cleanQuery);
    const res = await fetch(
      `https://openlibrary.org/search.json?q=${encoded}&limit=10`
    );
    if (res.ok) {
      const data = await res.json();
      if (data.docs && Array.isArray(data.docs)) {
        return data.docs.map((doc: any) => {
          const coverId = doc.cover_i;
          const coverUrl = coverId
            ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
            : null;

          return {
            id: doc.key || `ol-${Math.random()}`,
            title: doc.title || 'Untitled',
            authors: doc.author_name && doc.author_name.length > 0 ? doc.author_name : ['Unknown Author'],
            coverUrl,
            description: doc.first_sentence ? doc.first_sentence[0] : '',
            publishedDate: doc.first_publish_year ? String(doc.first_publish_year) : undefined,
            pageCount: doc.number_of_pages_median || undefined,
            isbn: doc.isbn ? doc.isbn[0] : undefined,
          };
        });
      }
    }
  } catch (err) {
    console.error('OpenLibrary fallback also failed:', err);
  }

  return [];
}
