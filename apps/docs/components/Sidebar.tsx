'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@vhyxui/react';

interface NavItem {
  name: string;
  href: string;
  badge?: string;
}

interface NavSubGroup {
  label: string;
  items: NavItem[];
}

interface NavGroup {
  label: string;
  items?: NavItem[];
  groups?: NavSubGroup[];
}

const NAV: NavGroup[] = [
  {
    label: 'Getting Started',
    items: [
      { name: 'Introduction', href: '/docs/introduction' },
      { name: 'Installation', href: '/docs/installation' },
      { name: 'Theming', href: '/docs/theming' },
      { name: 'Dark Mode', href: '/docs/dark-mode' },
    ],
  },
  {
    label: 'Components',
    groups: [
      {
        label: 'Inputs & Forms',
        items: [
          { name: 'Button', href: '/components/button', badge: 'Stable' },
          { name: 'Input', href: '/components/input', badge: 'Stable' },
          { name: 'Textarea', href: '/components/textarea', badge: 'Stable' },
          { name: 'Select', href: '/components/select', badge: 'Stable' },
          { name: 'Checkbox', href: '/components/checkbox', badge: 'Stable' },
          { name: 'Radio', href: '/components/radio', badge: 'Stable' },
          { name: 'Switch', href: '/components/switch', badge: 'Stable' },
          { name: 'Form & Field', href: '/components/form', badge: 'Stable' },
        ],
      },
      {
        label: 'Feedback',
        items: [
          { name: 'Toast', href: '/components/toast', badge: 'Stable' },
          { name: 'Alert', href: '/components/alert', badge: 'Stable' },
          { name: 'Badge', href: '/components/badge', badge: 'Stable' },
          { name: 'Progress', href: '/components/progress', badge: 'Stable' },
          { name: 'Spinner', href: '/components/spinner', badge: 'Stable' },
        ],
      },
      {
        label: 'Overlay',
        items: [
          { name: 'Dialog', href: '/components/dialog', badge: 'Stable' },
          { name: 'Drawer', href: '/components/drawer', badge: 'Stable' },
          { name: 'Tooltip', href: '/components/tooltip', badge: 'Stable' },
          { name: 'Popover', href: '/components/popover', badge: 'Stable' },
        ],
      },
      {
        label: 'Layout',
        items: [
          { name: 'Card', href: '/components/card', badge: 'Stable' },
          { name: 'Separator', href: '/components/separator', badge: 'Stable' },
        ],
      },
      {
        label: 'Navigation',
        items: [
          { name: 'Tabs', href: '/components/tabs', badge: 'Stable' },
          { name: 'Breadcrumb', href: '/components/breadcrumb', badge: 'Stable' },
          { name: 'Pagination', href: '/components/pagination', badge: 'Stable' },
        ],
      },
    ],
  },
  {
    label: 'Reference',
    items: [
      { name: 'Tokens', href: '/docs/tokens' },
      { name: 'Agent Contracts', href: '/docs/contracts' },
      { name: 'Changelog', href: '/docs/changelog' },
    ],
  },
];

interface ChevronIconProps {
  open: boolean;
  small?: boolean;
}

function ChevronIcon({ open, small = false }: ChevronIconProps): React.ReactElement {
  const size = small ? 12 : 14;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="docs-sidebar-group-chevron"
      data-open={open ? 'true' : 'false'}
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps): React.ReactElement {
  const pathname = usePathname();

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    NAV.forEach((group) => {
      initial[group.label] = true;
      group.groups?.forEach((sub) => {
        initial[sub.label] = true;
      });
    });
    return initial;
  });

  function toggleGroup(label: string): void {
    setOpenGroups((prev) => ({ ...prev, [label]: !(prev[label] ?? true) }));
  }

  return (
    <nav
      id="docs-sidebar"
      className="docs-sidebar-nav"
      data-open={open ? 'true' : 'false'}
      aria-label="Documentation navigation"
    >
      <div className="docs-sidebar-scroll">
        {NAV.map((group) => {
          const groupOpen = openGroups[group.label] ?? true;

          return (
            <div key={group.label} className="docs-sidebar-group">
              <button
                className="docs-sidebar-group-trigger"
                aria-expanded={groupOpen}
                onClick={() => toggleGroup(group.label)}
              >
                {group.label}
                <ChevronIcon open={groupOpen} />
              </button>

              <div
                className="docs-sidebar-group-items"
                data-open={groupOpen ? 'true' : 'false'}
              >
                {group.items?.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="docs-sidebar-nav-link"
                    data-active={pathname === item.href ? 'true' : 'false'}
                    onClick={onClose}
                  >
                    {item.name}
                  </Link>
                ))}

                {group.groups?.map((sub) => {
                  const subOpen = openGroups[sub.label] ?? true;

                  return (
                    <div key={sub.label} className="docs-sidebar-sub-group">
                      <button
                        className="docs-sidebar-sub-label"
                        aria-expanded={subOpen}
                        onClick={() => toggleGroup(sub.label)}
                      >
                        {sub.label}
                        <ChevronIcon open={subOpen} small />
                      </button>

                      <div
                        className="docs-sidebar-group-items"
                        data-open={subOpen ? 'true' : 'false'}
                      >
                        {sub.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="docs-sidebar-nav-link indented"
                            data-active={pathname === item.href ? 'true' : 'false'}
                            onClick={onClose}
                          >
                            <span>{item.name}</span>
                            {item.badge !== undefined && (
                              <Badge variant="success" size="sm">
                                {item.badge}
                              </Badge>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
