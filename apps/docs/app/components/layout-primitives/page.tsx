'use client';

import React from 'react';
import { Badge, Button, Card, Center, Container, Grid, HStack, Stack, Text, VStack } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlockSimple';
import { PropsTable, type PropDef } from '../../../components/PropsTable';
import { OnThisPage, type PageHeading } from '../../../components/OnThisPage';
import { PageNav } from '../../../components/PageNav';

const HEADINGS: ReadonlyArray<PageHeading> = [
  { id: 'why', text: 'Why primitives', level: 2 },
  { id: 'stack', text: 'Stack / HStack / VStack', level: 2 },
  { id: 'grid', text: 'Grid', level: 2 },
  { id: 'container', text: 'Container & Center', level: 2 },
  { id: 'props', text: 'Props', level: 2 },
];

const STACK_PROPS: PropDef[] = [
  { name: 'direction', type: "'row' | 'column'", default: "'column'", description: 'Main axis. HStack/VStack preset it.' },
  { name: 'gap', type: 'Space (0 … 32)', default: '3', description: 'Gap in token steps (--vhyx-space-*).' },
  { name: 'align', type: "'start' | 'center' | 'end' | 'stretch' | 'baseline'", description: 'Cross-axis alignment.' },
  { name: 'justify', type: "'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'", description: 'Main-axis distribution.' },
  { name: 'wrap', type: 'boolean', default: 'false', description: 'Allow wrapping.' },
  { name: 'collapseBelow', type: "'sm' | 'md' | 'lg'", description: 'Turn a row into a column below a breakpoint.' },
  { name: 'padding', type: 'Space', description: 'Padding on all sides.' },
  { name: 'as', type: 'ElementType', default: "'div'", description: 'Render as any element (section, ul, nav…).' },
];

const GRID_PROPS: PropDef[] = [
  { name: 'columns', type: 'number', default: '1', description: 'Equal columns.' },
  { name: 'minChildWidth', type: 'string | number', description: 'Responsive auto-fit — as many columns as fit, each at least this wide.' },
  { name: 'gap', type: 'Space', default: '4', description: 'Gap in token steps.' },
  { name: 'collapseBelow', type: "'sm' | 'md' | 'lg'", description: 'Single column below a breakpoint (fixed columns only).' },
];

function Tile({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <Center style={{ padding: 'var(--vhyx-space-4)', background: 'var(--vhyx-color-accent-subtle)', color: 'var(--vhyx-color-accent)', borderRadius: 'var(--vhyx-radius-md)', fontWeight: 600, minWidth: '3rem' }}>
      {children}
    </Center>
  );
}

export default function LayoutPrimitivesPage(): React.ReactElement {
  return (
    <div className="gs-layout">
      <main className="gs-content">
        <PageHeader stable={false}
          name="Layout primitives"
          description="Stack, Grid, Container and Center replace hand-written flexbox and grid CSS. Token-based spacing, responsive props, and they accept className — so Tailwind utilities work too."
          tags={['Layout', 'New']}
        />

        <Section id="why" title="Why primitives">
          <Text tone="subtle">
            Most UI code is layout. Instead of repeating <code>display: flex; gap: …</code> everywhere, compose
            layout from four primitives. Every spacing value is a design token, so layouts stay consistent and
            re-theme automatically.
          </Text>
          <CodeBlock code={`import { Stack, HStack, Grid, Container } from '@vhyxui/react';`} language="tsx" />
        </Section>

        <Section id="stack" title="Stack / HStack / VStack">
          <ComponentExample
            label="Header row that stacks on mobile"
            code={`<Stack direction="row" justify="between" align="center" collapseBelow="md" gap={4}>
  <VStack gap={1}>
    <Text weight="semibold">Invoices</Text>
    <Text size="sm" tone="subtle">12 open · 3 overdue</Text>
  </VStack>
  <HStack gap={2}>
    <Button variant="outline">Export</Button>
    <Button>New invoice</Button>
  </HStack>
</Stack>`}
          >
            <Stack direction="row" justify="between" align="center" collapseBelow="md" gap={4} style={{ width: '100%' }}>
              <VStack gap={1}>
                <Text weight="semibold">Invoices</Text>
                <Text size="sm" tone="subtle">12 open · 3 overdue</Text>
              </VStack>
              <HStack gap={2}>
                <Button variant="outline">Export</Button>
                <Button>New invoice</Button>
              </HStack>
            </Stack>
          </ComponentExample>
        </Section>

        <Section id="grid" title="Grid">
          <ComponentExample
            label="Responsive cards with one prop"
            code={`<Grid minChildWidth="12rem" gap={4}>
  {plans.map((p) => <Card key={p}>…</Card>)}
</Grid>`}
          >
            <Grid minChildWidth="12rem" gap={4} style={{ width: '100%' }}>
              {['Starter', 'Team', 'Business', 'Enterprise'].map((p, i) => (
                <Card key={p} variant="outline" padding="md">
                  <Stack gap={2}>
                    <HStack justify="between"><Text weight="semibold">{p}</Text>{i === 1 && <Badge variant="info">Popular</Badge>}</HStack>
                    <Text size="sm" tone="subtle">Everything in {i === 0 ? 'Free' : ['Starter', 'Team', 'Business'][i - 1]}, plus more.</Text>
                  </Stack>
                </Card>
              ))}
            </Grid>
          </ComponentExample>
          <ComponentExample label="Fixed columns that collapse below md" code={`<Grid columns={3} collapseBelow="md">…</Grid>`}>
            <Grid columns={3} collapseBelow="md" gap={3} style={{ width: '100%' }}>
              <Tile>1</Tile><Tile>2</Tile><Tile>3</Tile>
            </Grid>
          </ComponentExample>
        </Section>

        <Section id="container" title="Container & Center">
          <ComponentExample label="Readable width + centered content" code={`<Container size="sm">
  <Center style={{ minHeight: 120 }}>…</Center>
</Container>`}>
            <Container size="sm" style={{ border: '1px dashed var(--vhyx-color-border)', borderRadius: 'var(--vhyx-radius-md)' }}>
              <Center style={{ minHeight: 120 }}><Text tone="subtle">640px max width, centered</Text></Center>
            </Container>
          </ComponentExample>
          <Text size="sm" tone="subtle">
            Sizes: <code>sm</code> 640 · <code>md</code> 768 · <code>lg</code> 1024 (default) · <code>xl</code> 1280 · <code>full</code>.
            <code> Center fullHeight</code> fills the viewport — ideal for auth and empty screens.
          </Text>
        </Section>

        <Section id="props" title="Props">
          <h3 className="docs-subsection-heading">Stack</h3>
          <PropsTable props={STACK_PROPS} />
          <h3 className="docs-subsection-heading">Grid</h3>
          <PropsTable props={GRID_PROPS} />
        </Section>

        <PageNav prev={{ title: 'Separator', href: '/components/separator' }} next={{ title: 'Typography', href: '/components/typography' }} />
      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
