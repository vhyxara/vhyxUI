'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, Badge, Spinner } from '@vhyxui/react';

// Pagefind types
interface PagefindResult {
  url: string;
  meta: { title?: string };
  excerpt: string;
  sub_results?: Array<{ title: string; url: string; excerpt: string }>;
}

interface PagefindAPI {
  search: (query: string) => Promise<{ results: Array<{ id: string; data: () => Promise<PagefindResult> }> }>;
  options?: (opts: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    __pagefind__?: PagefindAPI;
  }
}

function SearchIcon(): React.ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function KbdHint(): React.ReactElement {
  return (
    <span className="search-kbd-hint" aria-hidden="true">
      <kbd>⌘</kbd><kbd>K</kbd>
    </span>
  );
}

interface SearchResult {
  url: string;
  title: string;
  excerpt: string;
  category: string;
}

function categoryFromUrl(url: string): string {
  if (url.includes('/components/')) return 'Component';
  if (url.includes('/getting-started')) return 'Guide';
  if (url.includes('/theming')) return 'Guide';
  if (url.includes('/agent-contracts')) return 'Guide';
  if (url.includes('/tokens')) return 'Reference';
  if (url.includes('/changelog')) return 'Reference';
  return 'Docs';
}

export function Search(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagefindReady, setPagefindReady] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);

  // Load Pagefind on first open
  const loadPagefind = useCallback(async (): Promise<void> => {
    if (window.__pagefind__) {
      setPagefindReady(true);
      return;
    }
    try {
      const pf = await import('/pagefind/pagefind.js' as string) as { default: PagefindAPI } | PagefindAPI;
      const api = 'default' in pf ? pf.default : pf;
      window.__pagefind__ = api;
      setPagefindReady(true);
    } catch {
      // Pagefind index not built yet — show graceful empty state
      setPagefindReady(false);
    }
  }, []);

  // Open / close
  const openSearch = useCallback((): void => {
    setOpen(true);
    void loadPagefind();
  }, [loadPagefind]);

  const closeSearch = useCallback((): void => {
    setOpen(false);
    setQuery('');
    setResults([]);
    setSelectedIndex(0);
  }, []);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) closeSearch();
        else openSearch();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => { window.removeEventListener('keydown', handleKeyDown); };
  }, [open, openSearch, closeSearch]);

  // Focus input when dialog opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => { inputRef.current?.focus(); }, 50);
      return () => { clearTimeout(timer); };
    }
    return undefined;
  }, [open]);

  // Search as user types
  useEffect(() => {
    if (!query.trim() || !pagefindReady || !window.__pagefind__) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void (async () => {
      try {
        const search = await window.__pagefind__!.search(query);
        const top = search.results.slice(0, 8);
        const settled = await Promise.allSettled(top.map((r) => r.data()));
        const parsed: SearchResult[] = [];
        for (const s of settled) {
          if (s.status === 'fulfilled') {
            const d = s.value;
            parsed.push({
              url: d.url,
              title: d.meta.title ?? 'Untitled',
              excerpt: d.excerpt,
              category: categoryFromUrl(d.url),
            });
          }
        }
        if (!cancelled) {
          setResults(parsed);
          setSelectedIndex(0);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setResults([]);
          setLoading(false);
        }
      }
    })();

    return () => { cancelled = true; };
  }, [query, pagefindReady]);

  // Keyboard navigation inside results
  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results.length > 0) {
      const r = results[selectedIndex];
      if (r) {
        window.location.href = r.url;
        closeSearch();
      }
    }
  }

  const badgeVariantFor = (cat: string): 'default' | 'info' | 'success' => {
    if (cat === 'Component') return 'info';
    if (cat === 'Guide') return 'success';
    return 'default';
  };

  return (
    <>
      {/* Trigger button in header */}
      <button
        type="button"
        className="search-trigger"
        aria-label="Search documentation (⌘K)"
        onClick={openSearch}
      >
        <SearchIcon />
        <span className="search-trigger-text">Search…</span>
        <KbdHint />
      </button>

      {/* Search modal */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) closeSearch(); }}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content
            className="search-dialog-content"
            aria-label="Search documentation"
          >
            <Dialog.Title className="sr-only">Search documentation</Dialog.Title>
            {/* Input */}
            <div className="search-input-row">
              <SearchIcon />
              <input
                ref={inputRef}
                type="search"
                className="search-input"
                placeholder="Search components, guides, tokens…"
                value={query}
                onChange={(e) => { setQuery(e.target.value); }}
                onKeyDown={handleInputKeyDown}
                autoComplete="off"
                spellCheck={false}
              />
              {loading && <Spinner size="xs" label="Searching" />}
              <button
                type="button"
                className="search-close-btn"
                onClick={closeSearch}
                aria-label="Close search"
              >
                <kbd>Esc</kbd>
              </button>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <ul ref={resultsRef} className="search-results" role="listbox" aria-label="Search results">
                {results.map((r, i) => (
                  <li key={r.url} role="option" aria-selected={i === selectedIndex}>
                    <a
                      href={r.url}
                      className="search-result-item"
                      data-selected={i === selectedIndex ? 'true' : 'false'}
                      onClick={closeSearch}
                      onMouseEnter={() => { setSelectedIndex(i); }}
                    >
                      <div className="search-result-top">
                        <span className="search-result-title">{r.title}</span>
                        <Badge variant={badgeVariantFor(r.category)} size="sm">{r.category}</Badge>
                      </div>
                      {/* Pagefind wraps matches in <mark> — dangerouslySetInnerHTML is safe here */}
                      <p
                        className="search-result-excerpt"
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{ __html: r.excerpt }}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {/* Empty state */}
            {!loading && query.trim().length > 0 && results.length === 0 && (
              <div className="search-empty">
                {pagefindReady
                  ? `No results for "${query}"`
                  : 'Search index not available. Run pnpm build to generate the index.'}
              </div>
            )}

            {/* Idle state */}
            {!query.trim() && (
              <div className="search-idle">
                <p>Type to search components, guides, and reference pages.</p>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  );
}
