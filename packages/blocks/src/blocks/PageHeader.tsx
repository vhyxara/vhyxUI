import React from 'react';
import { Heading, HStack, Stack, Text } from '@vhyxui/react';
import { ActionButton } from './ActionButton';
import type { Action, LinkComponent } from './shared';

/** Props for PageHeader. */
export interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Small label above the title (breadcrumb, section name). */
  eyebrow?: React.ReactNode;
  /** Buttons on the right. Accepts Action objects or your own nodes. */
  actions?: Array<Action | React.ReactElement>;
  linkAs?: LinkComponent;
  className?: string;
}

/**
 * PageHeader — title, description and actions for the top of a page.
 * @example
 * <PageHeader title="Customers" description="Everyone who bought in the last 30 days"
 *   actions={[{ label: 'Export', variant: 'outline' }, { label: 'Add customer', onClick: open }]} />
 */
export function PageHeader({ title, description, eyebrow, actions = [], linkAs, className }: PageHeaderProps): React.ReactElement {
  return (
    <Stack as="header" direction="row" justify="between" align="end" gap={4} wrap collapseBelow="sm" className={className}>
      <Stack gap={1}>
        {eyebrow && <Text size="sm" tone="accent" weight="medium">{eyebrow}</Text>}
        <Heading level={1} size="lg">{title}</Heading>
        {description && <Text tone="subtle">{description}</Text>}
      </Stack>
      {actions.length > 0 && (
        <HStack gap={2} wrap>
          {actions.map((a, i) =>
            React.isValidElement(a) ? (
              <React.Fragment key={i}>{a}</React.Fragment>
            ) : (
              <ActionButton key={i} action={a as Action} {...(linkAs ? { linkAs } : {})} fallbackVariant={i === actions.length - 1 ? 'primary' : 'outline'} />
            ),
          )}
        </HStack>
      )}
    </Stack>
  );
}
