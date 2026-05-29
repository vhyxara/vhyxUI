'use client';

import React, { useEffect, useState } from 'react';

export interface PageHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

interface OnThisPageProps {
  headings: ReadonlyArray<PageHeading>;
}

export function OnThisPage({ headings }: OnThisPageProps): React.ReactElement {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      {
        rootMargin: '-10% 0% -75% 0%',
        threshold: 0,
      },
    );

    for (const { id } of headings) {
      const el = document.getElementById(id);
      if (el !== null) observer.observe(el);
    }

    return (): void => { observer.disconnect(); };
  }, [headings]);

  function scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <aside className="gs-toc">
      <p className="gs-toc-title">On This Page</p>
      <nav aria-label="Page sections">
        <ul className="gs-toc-list" role="list">
          {headings.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={[
                  'gs-toc-link',
                  h.level === 3 ? 'gs-toc-link--sub' : '',
                  activeId === h.id ? 'gs-toc-link--active' : '',
                ].filter(Boolean).join(' ')}
                onClick={(e): void => {
                  e.preventDefault();
                  scrollTo(h.id);
                }}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
