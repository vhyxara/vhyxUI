'use client';

import { ChevronRightIcon } from '@vhyxui/icons';
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
      { name: 'Introduction', href: '/getting-started' },
      { name: 'Installation', href: '/getting-started' },
      { name: 'Theming', href: '/theming' },
      { name: 'Tailwind CSS', href: '/tailwind', badge: 'New' },
      { name: 'Architecture', href: '/architecture', badge: 'New' },
    ],
  },
  {
    label: 'Components',
    groups: [
      {
        label: 'Inputs & Forms',
        items: [
          { name: 'Button', href: '/components/button' },
          { name: 'Input', href: '/components/input' },
          { name: 'Textarea', href: '/components/textarea' },
          { name: 'Select', href: '/components/select' },
          { name: 'Checkbox', href: '/components/checkbox' },
          { name: 'Radio', href: '/components/radio' },
          { name: 'Switch', href: '/components/switch' },
          { name: 'Form & Field', href: '/components/form' },
        ],
      },
      {
        label: 'Feedback',
        items: [
          { name: 'Toast', href: '/components/toast' },
          { name: 'Alert', href: '/components/alert' },
          { name: 'Badge', href: '/components/badge' },
          { name: 'Progress', href: '/components/progress' },
          { name: 'Spinner', href: '/components/spinner' },
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
        label: 'Layout',
        items: [
          { name: 'Layout primitives', href: '/components/layout-primitives', badge: 'New' },
          { name: 'Typography', href: '/components/typography', badge: 'New' },
          { name: 'Data display', href: '/components/data-display', badge: 'New' },
          { name: 'Card', href: '/components/card' },
          { name: 'Separator', href: '/components/separator' },
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
    ],
  },
  {
    label: 'Blocks & Layouts',
    items: [
      { name: 'Blocks', href: '/blocks', badge: 'New' },
      { name: 'Layouts', href: '/layouts', badge: 'New' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { name: 'Tokens', href: '/docs/tokens' },
      { name: 'Icons', href: '/icons', badge: 'New' },
      { name: 'Agent Contracts', href: '/agent-contracts' },
      { name: 'Changelog', href: '/docs/changelog' },
    ],
  },
];

interface ChevronIconProps {
  open: boolean;
  small?: boolean;
}

function ChevronIcon({ open, small = false }: ChevronIconProps): React.ReactElement {
  return <ChevronRightIcon size={small ? 12 : 14} className="docs-sidebar-group-chevron" data-open={open ? 'true' : 'false'} />;
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
