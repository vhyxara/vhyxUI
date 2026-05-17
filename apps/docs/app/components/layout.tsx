'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

const NAV_GROUPS = [
  {
    label: 'Inputs',
    items: [
      { name: 'Button', href: '/components/button' },
      { name: 'Input', href: '/components/input' },
      { name: 'Textarea', href: '/components/textarea' },
      { name: 'Checkbox', href: '/components/checkbox' },
      { name: 'Radio', href: '/components/radio' },
      { name: 'Switch', href: '/components/switch' },
    ],
  },
  {
    label: 'Form',
    items: [
      { name: 'Form & Field', href: '/components/form' },
      { name: 'Select', href: '/components/select' },
    ],
  },
  {
    label: 'Feedback',
    items: [
      { name: 'Toast', href: '/components/toast' },
      { name: 'Alert', href: '/components/alert' },
      { name: 'Progress', href: '/components/progress' },
      { name: 'Spinner', href: '/components/spinner' },
    ],
  },
  {
    label: 'Display',
    items: [
      { name: 'Badge', href: '/components/badge' },
      { name: 'Card', href: '/components/card' },
      { name: 'Separator', href: '/components/separator' },
    ],
  },
  {
    label: 'Overlay',
    items: [
      { name: 'Dialog', href: '/components/dialog' },
      { name: 'Drawer', href: '/components/drawer' },
      { name: 'Tooltip', href: '/components/tooltip' },
      { name: 'Popover', href: '/components/popover' },
    ],
  },
  {
    label: 'Navigation',
    items: [
      { name: 'Tabs', href: '/components/tabs' },
      { name: 'Breadcrumb', href: '/components/breadcrumb' },
      { name: 'Pagination', href: '/components/pagination' },
    ],
  },
];

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const pathname = usePathname();

  return (
    <>
      {/* Sticky docs header */}
      <header className="docs-header">
        <a href="/" className="docs-nav-brand">VhyxUI</a>
        <nav style={{ display: 'flex', gap: 'var(--vhyx-space-4)', alignItems: 'center' }}>
          <a href="/components/button" style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)', textDecoration: 'none' }}>Components</a>
          <a href="/" style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)', textDecoration: 'none' }}>Home</a>
        </nav>
      </header>

      <div className="docs-content-layout">
        {/* Sidebar */}
        <nav className="docs-sidebar" aria-label="Component navigation">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="docs-sidebar-section">
              <p className="docs-sidebar-label">{group.label}</p>
              {group.items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="docs-sidebar-link"
                  data-active={pathname === item.href ? 'true' : 'false'}
                >
                  {item.name}
                </a>
              ))}
            </div>
          ))}
        </nav>

        {/* Main content */}
        <main id="vhyx-main" className="docs-page">
          {children}
        </main>
      </div>
    </>
  );
}
