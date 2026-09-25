import React from 'react';
import { Container, Grid, Separator, Stack, Text } from '@vhyxui/react';
import { renderLink, type LinkComponent, type NavLink } from './shared';

/** A titled column of footer links. */
export interface FooterColumn {
  title: React.ReactNode;
  links: NavLink[];
}

/** Props for Footer. */
export interface FooterProps {
  brand?: React.ReactNode;
  tagline?: React.ReactNode;
  columns?: FooterColumn[];
  /** Bottom line, e.g. "© 2026 Acme". */
  legal?: React.ReactNode;
  linkAs?: LinkComponent;
}

const LINK_STYLE: React.CSSProperties = {
  color: 'var(--vhyx-color-text-subtle)',
  fontSize: 'var(--vhyx-text-sm)',
  textDecoration: 'none',
};

/**
 * Footer — brand, link columns and legal line.
 * @example
 * <Footer brand="Acme" columns={[{ title: 'Product', links: [{ label: 'Pricing', href: '/pricing' }] }]} legal="© 2026 Acme" />
 */
export function Footer({ brand, tagline, columns = [], legal, linkAs = 'a' }: FooterProps): React.ReactElement {
  return (
    <footer style={{ borderTop: 'var(--vhyx-border-width) solid var(--vhyx-color-border)', marginTop: 'auto' }}>
      <Container size="xl" style={{ paddingBlock: 'var(--vhyx-space-12)' }}>
        <Stack gap={10}>
          <Grid minChildWidth="10rem" gap={8}>
            {(brand || tagline) && (
              <Stack gap={2}>
                {brand && <Text weight="semibold">{brand}</Text>}
                {tagline && <Text size="sm" tone="subtle">{tagline}</Text>}
              </Stack>
            )}
            {columns.map((col, i) => (
              <Stack as="nav" key={i} gap={3} aria-label={typeof col.title === 'string' ? col.title : undefined}>
                <Text size="sm" weight="semibold">{col.title}</Text>
                <Stack as="ul" gap={2} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {col.links.map((l) => (
                    <li key={l.href}>{renderLink(l, linkAs, { style: LINK_STYLE })}</li>
                  ))}
                </Stack>
              </Stack>
            ))}
          </Grid>
          {legal && (
            <>
              <Separator />
              <Text size="sm" tone="muted">{legal}</Text>
            </>
          )}
        </Stack>
      </Container>
    </footer>
  );
}
