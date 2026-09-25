'use client';

import React from 'react';
import { Button, Heading, HStack, Kbd, Stack, Text, VisuallyHidden } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { PropsTable, type PropDef } from '../../../components/PropsTable';
import { OnThisPage, type PageHeading } from '../../../components/OnThisPage';
import { PageNav } from '../../../components/PageNav';

const HEADINGS: ReadonlyArray<PageHeading> = [
  { id: 'heading', text: 'Heading', level: 2 },
  { id: 'text', text: 'Text', level: 2 },
  { id: 'kbd', text: 'Kbd', level: 2 },
  { id: 'visually-hidden', text: 'VisuallyHidden', level: 2 },
  { id: 'props', text: 'Props', level: 2 },
];

const TEXT_PROPS: PropDef[] = [
  { name: 'as', type: 'ElementType', default: "'p'", description: 'Element to render.' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Font size token.' },
  { name: 'tone', type: "'default' | 'subtle' | 'muted' | 'accent' | 'success' | 'warning' | 'danger' | 'inherit'", default: "'default'", description: 'Semantic colour.' },
  { name: 'weight', type: "'normal' | 'medium' | 'semibold' | 'bold'", description: 'Font weight token.' },
  { name: 'truncate', type: 'boolean', description: 'One line with ellipsis.' },
  { name: 'lines', type: 'number', description: 'Clamp to N lines.' },
  { name: 'mono', type: 'boolean', description: 'Monospace font.' },
];

export default function TypographyPage(): React.ReactElement {
  return (
    <div className="gs-layout">
      <main className="gs-content">
        <PageHeader stable={false} name="Typography" description="Heading and Text map to the type scale, keep semantics separate from looks, and handle truncation and clamping for you." tags={['Typography', 'New']} />

        <Section id="heading" title="Heading">
          <ComponentExample label="Semantic level vs visual size" code={`<Heading level={1}>Dashboard</Heading>
<Heading level={2} size="sm">Recent activity</Heading>`}>
            <Stack gap={2}>
              <Heading level={1}>Dashboard</Heading>
              <Heading level={2} size="sm">Recent activity — an h2 styled small</Heading>
            </Stack>
          </ComponentExample>
        </Section>

        <Section id="text" title="Text">
          <ComponentExample label="Tones, sizes and clamping" code={`<Text tone="subtle" size="sm">Updated 2 min ago</Text>
<Text tone="danger" weight="medium">Payment failed</Text>
<Text lines={2}>{longText}</Text>`}>
            <Stack gap={2} style={{ maxWidth: '28rem' }}>
              <Text tone="subtle" size="sm">Updated 2 min ago</Text>
              <Text tone="success" weight="medium">Deployed to production</Text>
              <Text tone="danger" weight="medium">Payment failed</Text>
              <Text lines={2}>
                VhyxUI components are accessible by default, animate with motion tokens, carry machine-readable
                VhyxSeal contracts for AI agents, and style with plain CSS variables or Tailwind utilities.
              </Text>
            </Stack>
          </ComponentExample>
        </Section>

        <Section id="kbd" title="Kbd">
          <ComponentExample label="Shortcut hints" code={`<Kbd keys={['⌘', 'K']} />`}>
            <HStack gap={3}><Text as="span" size="sm">Search</Text><Kbd keys={['⌘', 'K']} /><Text as="span" size="sm">Close</Text><Kbd>Esc</Kbd></HStack>
          </ComponentExample>
        </Section>

        <Section id="visually-hidden" title="VisuallyHidden">
          <ComponentExample label="Icon button with a screen-reader label" code={`<Button variant="ghost" iconOnly aria-label="Close" icon={<XIcon />} />
<button><XIcon /><VisuallyHidden>Close</VisuallyHidden></button>`}>
            <button type="button" style={{ all: 'unset', cursor: 'pointer', fontSize: 20 }}>✕<VisuallyHidden>Close dialog</VisuallyHidden></button>
            <Button variant="ghost" iconOnly aria-label="Close" icon={<span aria-hidden="true">✕</span>} />
          </ComponentExample>
        </Section>

        <Section id="props" title="Props">
          <h3 className="docs-subsection-heading">Text</h3>
          <PropsTable props={TEXT_PROPS} />
          <h3 className="docs-subsection-heading">Heading</h3>
          <PropsTable props={[
            { name: 'level', type: '1 | 2 | 3 | 4 | 5 | 6', default: '2', description: 'Renders <h1>…<h6>.' },
            { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'", description: 'Visual size (defaults from level).' },
          ]} />
        </Section>

        <PageNav prev={{ title: 'Layout primitives', href: '/components/layout-primitives' }} next={{ title: 'Data display', href: '/components/data-display' }} />
      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
