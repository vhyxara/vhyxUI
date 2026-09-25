import React, { useState } from 'react';
import { Button, Drawer } from '@vhyxui/react';
import { SidebarNav, type SidebarNavGroup } from './SidebarNav';
import type { LinkComponent } from '../blocks/shared';
import styles from './layouts.module.css';

/** Props for AppShell. */
export interface AppShellProps {
  /** Brand / logo at the top of the sidebar. */
  brand?: React.ReactNode;
  /** Sidebar navigation groups. Or pass `sidebar` for full control. */
  nav?: SidebarNavGroup[];
  /** Custom sidebar content (replaces `nav`). */
  sidebar?: React.ReactNode;
  /** Pinned to the bottom of the sidebar (user menu, plan info). */
  sidebarFooter?: React.ReactNode;
  /** Header content (search, actions, avatar). A menu button is added on mobile automatically. */
  header?: React.ReactNode;
  children: React.ReactNode;
  /** Icon-only sidebar on desktop. */
  collapsed?: boolean;
  /** Sidebar width on desktop. @default '16rem' */
  sidebarWidth?: string;
  linkAs?: LinkComponent;
}

/**
 * AppShell — responsive application frame: sticky sidebar, sticky header,
 * scrollable main. Below 1024px the sidebar moves into a Drawer.
 *
 * @example
 * <AppShell brand="Acme" nav={[{ items: [{ label: 'Home', href: '/', active: true }] }]} header={<Search/>}>
 *   <PageHeader title="Home" />
 * </AppShell>
 */
export function AppShell({
  brand,
  nav = [],
  sidebar,
  sidebarFooter,
  header,
  children,
  collapsed = false,
  sidebarWidth,
  linkAs,
}: AppShellProps): React.ReactElement {
  const [mobileOpen, setMobileOpen] = useState(false);
  const content = (onNavigate?: () => void): React.ReactNode => (
    <>
      {brand && <div style={{ padding: 'var(--vhyx-space-1) var(--vhyx-space-3)', fontWeight: 600 }}>{brand}</div>}
      <div style={{ flex: 1 }}>
        {sidebar ?? <SidebarNav groups={nav} {...(linkAs ? { linkAs } : {})} {...(onNavigate ? { onNavigate } : {})} />}
      </div>
      {sidebarFooter}
    </>
  );

  return (
    <div
      className={styles['shell']}
      data-collapsed={collapsed ? 'true' : undefined}
      style={sidebarWidth ? ({ '--vhyx-shell-sidebar': sidebarWidth } as React.CSSProperties) : undefined}
    >
      <aside className={styles['sidebar']}>{content()}</aside>
      <header className={styles['header']}>
        <Drawer open={mobileOpen} onOpenChange={setMobileOpen} side="left" size="sm">
          <Drawer.Trigger asChild>
            <Button variant="ghost" size="sm" iconOnly aria-label="Open navigation" className={styles['mobileOnly']} icon={<span aria-hidden="true">☰</span>} />
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Title>Navigation</Drawer.Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-4)', marginTop: 'var(--vhyx-space-4)' }}>
              {content(() => setMobileOpen(false))}
            </div>
          </Drawer.Content>
        </Drawer>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--vhyx-space-3)', flex: 1, minWidth: 0 }}>{header}</div>
      </header>
      <main id="vhyx-main" className={styles['main']}>{children}</main>
    </div>
  );
}
