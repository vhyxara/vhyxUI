import React from 'react';
import { Badge } from '@vhyxui/react';
import type { LinkComponent, NavLink } from '../blocks/shared';
import styles from './layouts.module.css';

/** A labelled group of sidebar links. */
export interface SidebarNavGroup {
  label?: React.ReactNode;
  items: NavLink[];
}

/** Props for SidebarNav. */
export interface SidebarNavProps {
  groups: SidebarNavGroup[];
  linkAs?: LinkComponent;
  /** Called after a link is chosen — used by AppShell to close the mobile drawer. */
  onNavigate?: () => void;
  'aria-label'?: string;
}

/**
 * SidebarNav — grouped navigation with icons, badges and active state.
 * @example
 * <SidebarNav groups={[{ label: 'Workspace', items: [{ label: 'Overview', href: '/', icon: <HomeIcon/>, active: true }] }]} />
 */
export function SidebarNav({ groups, linkAs = 'a', onNavigate, 'aria-label': ariaLabel = 'Sidebar' }: SidebarNavProps): React.ReactElement {
  const LinkTag = linkAs;
  return (
    <nav aria-label={ariaLabel} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-4)' }}>
      {groups.map((group, gi) => (
        <div key={gi} className={styles['navGroup']}>
          {group.label && <div className={styles['navLabel']}>{group.label}</div>}
          <ul className={styles['navList']}>
            {group.items.map((item) => (
              <li key={item.href}>
                <LinkTag
                  href={item.href}
                  className={styles['navLink']}
                  aria-current={item.active ? 'page' : undefined}
                  data-active={item.active ? 'true' : undefined}
                  title={typeof item.label === 'string' ? item.label : undefined}
                  onClick={onNavigate}
                  {...(item.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  {item.icon && <span className={styles['navIcon']} aria-hidden="true">{item.icon}</span>}
                  <span className={styles['navText']}>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={styles['navBadge']}>
                      {typeof item.badge === 'number' ? <Badge count={item.badge} size="sm" /> : item.badge}
                    </span>
                  )}
                </LinkTag>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
