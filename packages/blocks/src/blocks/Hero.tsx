import React from 'react';
import { Badge, Container, Heading, HStack, Stack, Text } from '@vhyxui/react';
import { ActionButton } from './ActionButton';
import type { Action, LinkComponent } from './shared';

/** Props for Hero. */
export interface HeroProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Small badge above the title, e.g. "New · v2 is out". */
  eyebrow?: React.ReactNode;
  actions?: Action[];
  /** Visual shown beside (split) or below (center) the copy. */
  media?: React.ReactNode;
  /** @default 'center' */
  align?: 'center' | 'split';
  linkAs?: LinkComponent;
}

/**
 * Hero — landing-page opener with headline, supporting copy and CTAs.
 * @example
 * <Hero eyebrow="v2 is live" title="Ship faster" description="…"
 *   actions={[{ label: 'Get started', href: '/docs' }, { label: 'GitHub', href: gh, variant: 'outline' }]} />
 */
export function Hero({ title, description, eyebrow, actions = [], media, align = 'center', linkAs }: HeroProps): React.ReactElement {
  const centered = align === 'center';
  const copy = (
    <Stack gap={5} align={centered ? 'center' : 'start'} style={{ textAlign: centered ? 'center' : 'start', maxWidth: centered ? '48rem' : undefined }}>
      {eyebrow && <Badge variant="info">{eyebrow}</Badge>}
      <Heading level={1} size="2xl" style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)' }}>{title}</Heading>
      {description && <Text size="lg" tone="subtle">{description}</Text>}
      {actions.length > 0 && (
        <HStack gap={3} wrap justify={centered ? 'center' : 'start'}>
          {actions.map((a, i) => (
            <ActionButton key={i} action={a} size="lg" {...(linkAs ? { linkAs } : {})} fallbackVariant={i === 0 ? 'primary' : 'outline'} />
          ))}
        </HStack>
      )}
    </Stack>
  );
  return (
    <Container as="section" size="xl" style={{ paddingBlock: 'var(--vhyx-space-24)' }}>
      {centered ? (
        <Stack gap={12} align="center">
          {copy}
          {media}
        </Stack>
      ) : (
        <Stack direction="row" gap={12} align="center" collapseBelow="md">
          <div style={{ flex: 1 }}>{copy}</div>
          {media && <div style={{ flex: 1, minWidth: 0 }}>{media}</div>}
        </Stack>
      )}
    </Container>
  );
}
