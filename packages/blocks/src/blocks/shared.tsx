import React from 'react';

/** Anything that renders a link. Pass Next.js `Link`, React Router `Link`, or leave as `'a'`. */
export type LinkComponent = React.ElementType<{ href: string; className?: string; children?: React.ReactNode }>;

/** A navigation link used by Navbar, Footer, SidebarNav, and layouts. */
export interface NavLink {
  label: React.ReactNode;
  href: string;
  /** Marks the current page (`aria-current="page"`). */
  active?: boolean;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  /** Open in a new tab (adds rel="noreferrer"). */
  external?: boolean;
}

/** Call-to-action rendered as a Button (with `onClick`) or a link-styled Button (with `href`). */
export interface Action {
  label: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  icon?: React.ReactNode;
}

/** Renders a NavLink with the given link component. */
export function renderLink(
  link: NavLink,
  As: LinkComponent,
  props: { className?: string; style?: React.CSSProperties } = {},
): React.ReactElement {
  const external = link.external ? { target: '_blank', rel: 'noreferrer' } : {};
  return (
    <As
      href={link.href}
      aria-current={link.active ? 'page' : undefined}
      data-active={link.active ? 'true' : undefined}
      {...external}
      {...props}
    >
      {link.label}
    </As>
  );
}
