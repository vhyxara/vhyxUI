import React from 'react';
import { Container, Stack, Text } from '@vhyxui/react';
import { Navbar, type NavbarProps } from '../blocks/Navbar';
import { SidebarNav, type SidebarNavGroup } from './SidebarNav';
import type { LinkComponent } from '../blocks/shared';
import styles from './layouts.module.css';

/** A table-of-contents entry. */
export interface TocItem {
  id: string;
  label: React.ReactNode;
  /** 2 = h2, 3 = h3 (indented). @default 2 */
  level?: 2 | 3;
}

/** Props for DocsLayout. */
export interface DocsLayoutProps {
  navbar: NavbarProps;
  nav: SidebarNavGroup[];
  /** "On this page" entries. */
  toc?: TocItem[];
  children: React.ReactNode;
  linkAs?: LinkComponent;
}

/**
 * DocsLayout — three-column documentation page: nav, content, table of contents.
 * Columns drop away responsively (TOC < 1280px, nav < 768px).
 * @example
 * <DocsLayout navbar={{ brand: 'Docs' }} nav={groups} toc={[{ id: 'install', label: 'Install' }]}>
 *   <article>…</article>
 * </DocsLayout>
 */
export function DocsLayout({ navbar, nav, toc = [], children, linkAs }: DocsLayoutProps): React.ReactElement {
  const link = linkAs ?? navbar.linkAs;
  return (
    <>
      <Navbar {...navbar} size="full" />
      <Container size="full" className={styles['docs']}>
        <aside className={styles['docsSidebar']}>
          <SidebarNav groups={nav} aria-label="Documentation" {...(link ? { linkAs: link } : {})} />
        </aside>
        <main id="vhyx-main" className={styles['docsContent']}>{children}</main>
        {toc.length > 0 && (
          <aside className={styles['docsToc']}>
            <Stack as="nav" gap={2} aria-label="On this page">
              <Text size="xs" weight="semibold" tone="muted" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                On this page
              </Text>
              {toc.map((t) => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  style={{
                    fontSize: 'var(--vhyx-text-sm)',
                    color: 'var(--vhyx-color-text-subtle)',
                    textDecoration: 'none',
                    paddingLeft: t.level === 3 ? 'var(--vhyx-space-3)' : 0,
                  }}
                >
                  {t.label}
                </a>
              ))}
            </Stack>
          </aside>
        )}
      </Container>
    </>
  );
}
