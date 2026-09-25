import React from 'react';
import { Center, Container, Grid, Heading, Stack, Text } from '@vhyxui/react';

/** One feature tile. */
export interface Feature {
  title: React.ReactNode;
  description: React.ReactNode;
  icon?: React.ReactNode;
}

/** Props for FeatureGrid. */
export interface FeatureGridProps {
  features: Feature[];
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Minimum tile width before wrapping. @default '16rem' */
  minItemWidth?: string;
}

/**
 * FeatureGrid — responsive grid of icon + title + description.
 * @example
 * <FeatureGrid title="Why teams switch" features={[{ icon: '⚡', title: 'Fast', description: '…' }]} />
 */
export function FeatureGrid({ features, title, description, minItemWidth = '16rem' }: FeatureGridProps): React.ReactElement {
  return (
    <Container as="section" size="xl" style={{ paddingBlock: 'var(--vhyx-space-16)' }}>
      <Stack gap={10}>
        {(title || description) && (
          <Stack gap={3} align="center" style={{ textAlign: 'center' }}>
            {title && <Heading level={2} size="xl">{title}</Heading>}
            {description && <Text tone="subtle" size="lg" style={{ maxWidth: '40rem' }}>{description}</Text>}
          </Stack>
        )}
        <Grid as="ul" minChildWidth={minItemWidth} gap={8} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {features.map((f, i) => (
            <Stack as="li" key={i} gap={3}>
              {f.icon && (
                <Center
                  aria-hidden="true"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--vhyx-radius-lg)',
                    background: 'var(--vhyx-color-accent-subtle)',
                    color: 'var(--vhyx-color-accent)',
                  }}
                >
                  {f.icon}
                </Center>
              )}
              <Heading level={3} size="xs">{f.title}</Heading>
              <Text tone="subtle" size="sm">{f.description}</Text>
            </Stack>
          ))}
        </Grid>
      </Stack>
    </Container>
  );
}
