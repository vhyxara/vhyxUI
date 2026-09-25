import React, { useState } from 'react';
import { Button, Container, Drawer, Stack } from '@vhyxui/react';
import { renderLink, type LinkComponent, type NavLink } from './shared';
import styles from './Navbar.module.css';

/** Props for Navbar. */
export interface NavbarProps {
  /** Logo / product name. Rendered inside a link to `brandHref`. */
  brand: React.ReactNode;
  /** @default '/' */
  brandHref?: string;
  links?: NavLink[];
  /** Right-side slot: buttons, theme toggle, avatar… */
  actions?: React.ReactNode;
  linkAs?: LinkComponent;
  /** Container width. @default 'xl' */
  size?: 'lg' | 'xl' | 'full';
}

/**
 * Navbar — sticky, translucent top bar that collapses into a Drawer on mobile.
 * @example
 * <Navbar brand="Acme" links={[{ label: 'Docs', href: '/docs', active: true }]} actions={<Button size="sm">Sign in</Button>} linkAs={Link} />
 */
export function Navbar({ brand, brandHref = '/', links = [], actions, linkAs = 'a', size = 'xl' }: NavbarProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const Brand = linkAs;
  return (
    <header className={styles['navbar']}>
      <Container size={size} className={styles['inner']}>
        <Brand href={brandHref} className={styles['brand']}>{brand}</Brand>
        <nav aria-label="Main" className={styles['desktop']}>
          <ul className={styles['links']}>
            {links.map((l) => (
              <li key={l.href}>{renderLink(l, linkAs, { className: styles['link'] })}</li>
            ))}
          </ul>
        </nav>
        <span className={styles['spacer']} />
        <div className={styles['desktop']}>{actions}</div>
        {(links.length > 0 || actions) && (
          <Drawer open={open} onOpenChange={setOpen} side="right" size="sm">
            <Drawer.Trigger asChild>
              <Button variant="ghost" size="sm" iconOnly aria-label="Open menu" className={styles['mobileToggle']} icon={<MenuIcon />} />
            </Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Title>Menu</Drawer.Title>
              <Stack gap={6} style={{ marginTop: 'var(--vhyx-space-4)' }}>
                <nav aria-label="Mobile">
                  <ul className={styles['mobileLinks']}>
                    {links.map((l) => (
                      <li key={l.href} onClick={() => setOpen(false)}>
                        {renderLink(l, linkAs, { className: styles['link'] })}
                      </li>
                    ))}
                  </ul>
                </nav>
                {actions}
              </Stack>
            </Drawer.Content>
          </Drawer>
        )}
      </Container>
    </header>
  );
}

function MenuIcon(): React.ReactElement {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="none" aria-hidden="true">
      <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
