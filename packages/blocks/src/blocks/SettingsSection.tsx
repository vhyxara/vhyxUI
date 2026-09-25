import React from 'react';
import { Card, Heading, HStack, Stack, Text } from '@vhyxui/react';

/** Props for SettingsSection. */
export interface SettingsSectionProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  /** Buttons shown in the card footer (e.g. Save). */
  footer?: React.ReactNode;
  /** `danger` outlines the card in red for destructive settings. */
  tone?: 'default' | 'danger';
}

/**
 * SettingsSection — the two-column "label left, form right" settings pattern.
 * Collapses to one column on small screens.
 * @example
 * <SettingsSection title="Profile" description="Shown on your public page" footer={<Button>Save</Button>}>
 *   <TextField name="name" label="Name" />
 * </SettingsSection>
 */
export function SettingsSection({ title, description, children, footer, tone = 'default' }: SettingsSectionProps): React.ReactElement {
  return (
    <Stack as="section" direction="row" gap={8} collapseBelow="md" align="start">
      <Stack gap={1} style={{ flex: '0 0 16rem', maxWidth: '100%' }}>
        <Heading level={2} size="xs" style={tone === 'danger' ? { color: 'var(--vhyx-color-danger-text)' } : undefined}>
          {title}
        </Heading>
        {description && <Text size="sm" tone="subtle">{description}</Text>}
      </Stack>
      <Card
        variant="outline"
        padding="none"
        style={{ flex: 1, width: '100%', ...(tone === 'danger' ? { borderColor: 'var(--vhyx-color-danger)' } : {}) }}
      >
        <Stack gap={4} padding={6}>{children}</Stack>
        {footer && (
          <HStack
            justify="end"
            gap={2}
            style={{ padding: 'var(--vhyx-space-3) var(--vhyx-space-6)', borderTop: 'var(--vhyx-border-width) solid var(--vhyx-color-border)', background: 'var(--vhyx-color-bg-subtle)' }}
          >
            {footer}
          </HStack>
        )}
      </Card>
    </Stack>
  );
}
