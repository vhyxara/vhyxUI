import React from 'react';
import { Badge, Card, Grid, Heading, HStack, Stack, Text } from '@vhyxui/react';
import { ActionButton } from './ActionButton';
import type { Action, LinkComponent } from './shared';

/** A pricing plan. */
export interface PricingPlan {
  name: string;
  price: React.ReactNode;
  /** e.g. "/month". */
  period?: React.ReactNode;
  description?: React.ReactNode;
  features: React.ReactNode[];
  action: Action;
  /** Emphasise this plan ("Most popular"). */
  highlighted?: boolean;
  badge?: React.ReactNode;
}

/** Props for PricingTable. */
export interface PricingTableProps {
  plans: PricingPlan[];
  linkAs?: LinkComponent;
}

/**
 * PricingTable — responsive plan comparison with a highlighted tier.
 * @example
 * <PricingTable plans={[{ name: 'Pro', price: '$29', period: '/mo', features: ['Unlimited seats'],
 *   action: { label: 'Start trial', href: '/signup' }, highlighted: true }]} />
 */
export function PricingTable({ plans, linkAs }: PricingTableProps): React.ReactElement {
  return (
    <Grid as="ul" minChildWidth="17rem" gap={6} style={{ listStyle: 'none', padding: 0, margin: 0, alignItems: 'stretch' }}>
      {plans.map((plan) => (
        <li key={plan.name} style={{ display: 'flex' }}>
          <Card
            variant={plan.highlighted ? 'elevated' : 'outline'}
            padding="lg"
            style={{
              flex: 1,
              ...(plan.highlighted ? { borderColor: 'var(--vhyx-color-accent)', boxShadow: '0 0 0 1px var(--vhyx-color-accent), var(--vhyx-shadow-lg)' } : {}),
            }}
          >
            <Stack gap={5} style={{ height: '100%' }}>
              <Stack gap={2}>
                <HStack justify="between">
                  <Heading level={3} size="sm">{plan.name}</Heading>
                  {(plan.badge ?? (plan.highlighted ? 'Most popular' : null)) && (
                    <Badge variant="info">{plan.badge ?? 'Most popular'}</Badge>
                  )}
                </HStack>
                {plan.description && <Text size="sm" tone="subtle">{plan.description}</Text>}
              </Stack>
              <HStack gap={1} align="baseline">
                <Text as="span" weight="bold" style={{ fontSize: 'var(--vhyx-text-4xl)' }}>{plan.price}</Text>
                {plan.period && <Text as="span" tone="subtle">{plan.period}</Text>}
              </HStack>
              <Stack as="ul" gap={2} style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
                {plan.features.map((f, i) => (
                  <HStack as="li" key={i} gap={2} align="start">
                    <span aria-hidden="true" style={{ color: 'var(--vhyx-color-success)' }}>✓</span>
                    <Text as="span" size="sm">{f}</Text>
                  </HStack>
                ))}
              </Stack>
              <ActionButton
                action={plan.action}
                {...(linkAs ? { linkAs } : {})}
                fallbackVariant={plan.highlighted ? 'primary' : 'outline'}
              />
            </Stack>
          </Card>
        </li>
      ))}
    </Grid>
  );
}
