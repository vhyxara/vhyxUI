import React from 'react';
import { Card, HStack, Stack, Text, Skeleton } from '@vhyxui/react';

/** Props for StatCard. */
export interface StatCardProps {
  label: React.ReactNode;
  value: React.ReactNode;
  /** Change vs previous period, e.g. `"+12.5%"`. */
  change?: React.ReactNode;
  /** Colours the change: up = success, down = danger. Set `invertTrend` when down is good (churn, latency). */
  trend?: 'up' | 'down' | 'flat';
  invertTrend?: boolean;
  /** Supporting text under the value. */
  hint?: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
}

/**
 * StatCard — one KPI with trend.
 * @example
 * <StatCard label="Revenue" value="$48,210" change="+12.5%" trend="up" hint="vs last month" />
 */
export function StatCard({ label, value, change, trend = 'flat', invertTrend = false, hint, icon, loading = false }: StatCardProps): React.ReactElement {
  const good = trend === 'flat' ? undefined : (trend === 'up') !== invertTrend;
  const arrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  return (
    <Card padding="md" aria-busy={loading || undefined}>
      <Stack gap={2}>
        <HStack justify="between">
          <Text size="sm" tone="subtle" weight="medium">{label}</Text>
          {icon && <span aria-hidden="true" style={{ color: 'var(--vhyx-color-text-muted)' }}>{icon}</span>}
        </HStack>
        {loading ? (
          <Skeleton height={32} width="60%" />
        ) : (
          <Text as="div" size="xl" weight="bold" style={{ fontSize: 'var(--vhyx-text-3xl)', fontVariantNumeric: 'tabular-nums' }}>
            {value}
          </Text>
        )}
        {(change || hint) && (
          <HStack gap={2}>
            {change && (
              <Text as="span" size="sm" weight="medium" tone={good === undefined ? 'subtle' : good ? 'success' : 'danger'}>
                <span aria-hidden="true">{arrow} </span>
                {change}
              </Text>
            )}
            {hint && <Text as="span" size="sm" tone="muted">{hint}</Text>}
          </HStack>
        )}
      </Stack>
    </Card>
  );
}
