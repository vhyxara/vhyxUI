import React from 'react';
import Link from 'next/link';

export interface PageNavItem {
  title: string;
  href: string;
}

interface PageNavProps {
  prev?: PageNavItem;
  next?: PageNavItem;
}

export function PageNav({ prev, next }: PageNavProps): React.ReactElement {
  return (
    <nav className="pn-wrap" aria-label="Page navigation">
      <div className="pn-prev">
        {prev !== undefined && (
          <Link href={prev.href} className="pn-link">
            <span className="pn-arrow" aria-hidden="true">←</span>
            <span className="pn-label-wrap">
              <span className="pn-label">Previous</span>
              <span className="pn-title">{prev.title}</span>
            </span>
          </Link>
        )}
      </div>
      <div className="pn-next">
        {next !== undefined && (
          <Link href={next.href} className="pn-link pn-link--next">
            <span className="pn-label-wrap pn-label-wrap--next">
              <span className="pn-label">Next</span>
              <span className="pn-title">{next.title}</span>
            </span>
            <span className="pn-arrow" aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
