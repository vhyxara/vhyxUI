'use client';

import React, { useMemo, useState } from 'react';
import * as Icons from '@vhyxui/icons';
import meta from '@vhyxui/icons/icons.json';

interface IconMeta {
  name: string;
  component: string;
  category: string;
  tags: string[];
}

const ALL = meta as IconMeta[];
const CATEGORIES = ['all', ...Array.from(new Set(ALL.map((i) => i.category))).sort()];
const components = Icons as unknown as Record<string, React.ComponentType<Icons.IconProps>>;

/** Searchable grid of every icon; clicking a tile copies its import line. */
export function IconGallery(): React.ReactElement {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [copied, setCopied] = useState<string | null>(null);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL.filter((i) => (category === 'all' || i.category === category) && (!q || i.name.includes(q) || i.tags.some((t) => t.includes(q))));
  }, [query, category]);

  const copy = (i: IconMeta): void => {
    void navigator.clipboard?.writeText(`import { ${i.component} } from '@vhyxui/icons';`).then(() => {
      setCopied(i.name);
      window.setTimeout(() => setCopied((c) => (c === i.name ? null : c)), 1500);
    });
  };

  return (
    <div className="icon-gallery">
      <div className="icon-gallery-controls">
        <input
          type="search"
          className="icon-gallery-search"
          placeholder={`Search ${ALL.length} icons…`}
          aria-label="Search icons"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="icon-gallery-categories" role="group" aria-label="Filter by category">
          {CATEGORIES.map((c) => (
            <button key={c} type="button" className="icon-gallery-chip" aria-pressed={category === c} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <p className="icon-gallery-count" aria-live="polite">{shown.length} icon{shown.length === 1 ? '' : 's'}</p>
      <ul className="icon-gallery-grid">
        {shown.map((i) => {
          const Icon = components[i.component];
          return (
            <li key={i.name}>
              <button type="button" className="icon-gallery-tile" onClick={() => copy(i)} title={`Copy import for ${i.component}`}>
                {Icon ? <Icon size="lg" /> : null}
                <span className="icon-gallery-name">{copied === i.name ? 'Copied' : i.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
