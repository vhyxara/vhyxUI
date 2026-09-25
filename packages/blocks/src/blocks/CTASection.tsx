import React from 'react';
import { Container, Heading, HStack, Stack, Text } from '@vhyxui/react';
import { ActionButton } from './ActionButton';
import type { Action, LinkComponent } from './shared';

/** Props for CTASection. */
export interface CTASectionProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions: Action[];
  linkAs?: LinkComponent;
}

/**
 * CTASection — closing call-to-action band.
 * @example
 * <CTASection title="Ready to build?" actions={[{ label: 'Start free', href: '/signup' }]} />
 */
export function CTASection({ title, description, actions, linkAs }: CTASectionProps): React.ReactElement {
  return (
    <Container as="section" size="xl" style={{ paddingBlock: 'var(--vhyx-space-16)' }}>
      <Stack
        gap={5}
        align="center"
        style={{
          textAlign: 'center',
          padding: 'var(--vhyx-space-12) var(--vhyx-space-6)',
          borderRadius: 'var(--vhyx-radius-2xl)',
          background: 'linear-gradient(135deg, var(--vhyx-color-accent-subtle), var(--vhyx-color-bg-subtle))',
          border: 'var(--vhyx-border-width) solid var(--vhyx-color-border)',
        }}
      >
        <Heading level={2} size="xl">{title}</Heading>
        {description && <Text tone="subtle" size="lg" style={{ maxWidth: '36rem' }}>{description}</Text>}
        <HStack gap={3} wrap justify="center">
          {actions.map((a, i) => (
            <ActionButton key={i} action={a} size="lg" {...(linkAs ? { linkAs } : {})} fallbackVariant={i === 0 ? 'primary' : 'outline'} />
          ))}
        </HStack>
      </Stack>
    </Container>
  );
}
