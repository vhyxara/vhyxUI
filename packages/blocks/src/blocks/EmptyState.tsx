import React from 'react';
import { Center, Heading, HStack, Stack, Text } from '@vhyxui/react';
import { ActionButton } from './ActionButton';
import type { Action, LinkComponent } from './shared';

/** Props for EmptyState. */
export interface EmptyStateProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: Action[];
  linkAs?: LinkComponent;
  /** Draw a dashed border around the area. @default true */
  bordered?: boolean;
}

/**
 * EmptyState — what users see before there is data.
 * @example
 * <EmptyState icon={<InboxIcon />} title="No invoices yet" description="Create your first invoice to get paid."
 *   actions={[{ label: 'New invoice', onClick: create }]} />
 */
export function EmptyState({ title, description, icon, actions = [], linkAs, bordered = true }: EmptyStateProps): React.ReactElement {
  return (
    <Center
      style={{
        padding: 'var(--vhyx-space-12) var(--vhyx-space-6)',
        border: bordered ? 'var(--vhyx-border-width-2) dashed var(--vhyx-color-border)' : undefined,
        borderRadius: 'var(--vhyx-radius-xl)',
      }}
    >
      <Stack gap={3} align="center" style={{ maxWidth: '28rem', textAlign: 'center' }}>
        {icon && (
          <Center
            aria-hidden="true"
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--vhyx-radius-full)',
              background: 'var(--vhyx-color-accent-subtle)',
              color: 'var(--vhyx-color-accent)',
            }}
          >
            {icon}
          </Center>
        )}
        <Heading level={3} size="sm">{title}</Heading>
        {description && <Text tone="subtle" size="sm">{description}</Text>}
        {actions.length > 0 && (
          <HStack gap={2} wrap justify="center" style={{ marginTop: 'var(--vhyx-space-2)' }}>
            {actions.map((a, i) => (
              <ActionButton key={i} action={a} {...(linkAs ? { linkAs } : {})} fallbackVariant={i === 0 ? 'primary' : 'outline'} />
            ))}
          </HStack>
        )}
      </Stack>
    </Center>
  );
}
