'use client';

import { MenuIcon, PackageIcon, XIcon } from '@vhyxui/icons';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/app/components/ThemeToggle';
import { Search } from './Search';
import { GITHUB, PLAYGROUND, VHYXCHART, VHYXSEAL } from './links';

function GitHubIcon(): React.ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

const NAV: Array<{ label: string; href: string; match: (path: string) => boolean; external?: boolean }> = [
  { label: 'Docs', href: '/getting-started', match: (p) => ['/getting-started', '/theming', '/tailwind', '/architecture', '/agent-contracts', '/docs'].some((s) => p.startsWith(s)) },
  { label: 'Components', href: '/components/button', match: (p) => p.startsWith('/components') },
  { label: 'Blocks', href: '/blocks', match: (p) => p.startsWith('/blocks') || p.startsWith('/layouts') },
  { label: 'Icons', href: '/icons', match: (p) => p.startsWith('/icons') },
  { label: 'Playground', href: PLAYGROUND, match: () => false, external: true },
];

export interface HeaderProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export function Header({ sidebarOpen, onSidebarToggle }: HeaderProps): React.ReactElement {
  const pathname = usePathname() ?? '/';
  return (
    <header className="docs-header-bar" role="banner">
      <div className="docs-header-start">
        <button
          type="button"
          className="docs-hamburger"
          aria-label={sidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={sidebarOpen}
          aria-controls="docs-sidebar"
          onClick={onSidebarToggle}
        >
          {sidebarOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
        </button>
        <Link href="/" className="docs-header-brand">
          <PackageIcon size={22} className="docs-header-brand-mark" />
          <span>VhyxUI</span>
        </Link>
        <nav className="docs-family" aria-label="Vhyxara libraries">
          <a href="/" className="docs-family-link" aria-current="true">UI</a>
          <a href={VHYXSEAL} className="docs-family-link">Seal</a>
          <a href={VHYXCHART} className="docs-family-link">Chart</a>
        </nav>
      </div>

      <nav className="docs-header-nav" aria-label="Site navigation">
        {NAV.map((item) => {
          const active = item.match(pathname);
          return item.external ? (
            <a key={item.label} href={item.href} className="docs-header-nav-link">{item.label}</a>
          ) : (
            <Link key={item.label} href={item.href} className="docs-header-nav-link" aria-current={active ? 'page' : undefined}>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="docs-header-actions">
        <Search />
        <ThemeToggle />
        <a href={GITHUB} className="docs-header-github" aria-label="View VhyxUI on GitHub" target="_blank" rel="noopener noreferrer">
          <GitHubIcon />
        </a>
      </div>
    </header>
  );
}
