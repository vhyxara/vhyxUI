'use client';

import React from 'react';
import { Badge } from '@vhyxui/react';
import { badgeContract } from '@vhyxui/core';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlockSimple';
import { PropsTable } from '../../../components/PropsTable';
import { OnThisPage, type PageHeading } from '../../../components/OnThisPage';
import { PageNav } from '../../../components/PageNav';
import type { PropDef } from '../../../components/PropsTable';

// ─── On This Page ──────────────────────────────────────────────────────────

const HEADINGS: ReadonlyArray<PageHeading> = [
  { id: 'interactive-example', text: 'Interactive Example', level: 2 },
  { id: 'import',             text: 'Import',              level: 2 },
  { id: 'variants',           text: 'Variants',            level: 2 },
  { id: 'sizes',              text: 'Sizes',               level: 2 },
  { id: 'states',             text: 'States',              level: 2 },
  { id: 'props',              text: 'Props',               level: 2 },
  { id: 'accessibility',      text: 'Accessibility',       level: 2 },
  { id: 'agent-contract',     text: 'Agent Contract',      level: 2 },
  { id: 'theming',            text: 'Theming',             level: 2 },
  { id: 'examples',           text: 'Examples',            level: 2 },
] as const;

// ─── Props ─────────────────────────────────────────────────────────────────

const PROPS: PropDef[] = [
  { name: 'variant', type: "'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline'", default: "'default'", description: 'Visual semantic variant.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the badge.' },
  { name: 'dot', type: 'boolean', default: 'false', description: 'Renders as a small circular dot indicator with no text.' },
  { name: 'count', type: 'number', description: 'Numeric count displayed inside the badge.' },
  { name: 'max', type: 'number', default: '99', description: 'Maximum count before displaying max+ (e.g. 99+).' },
  { name: 'className', type: 'string', description: 'Additional CSS classes.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function BadgePage(): React.ReactElement {
  return (
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Badge"
          description="Small inline label for status, category, or count. Six semantic variants, dot mode for indicators, and automatic count truncation at configurable max."
          tags={['Display', 'VhyxSeal']}
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="Status badges and count indicator"
            code={`<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Error</Badge>
<Badge variant="info">Update</Badge>
<Badge count={42} />`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
              <Badge variant="success">Active</Badge>
              <Badge variant="warning">Pending</Badge>
              <Badge variant="danger">Error</Badge>
              <Badge variant="info">Update</Badge>
              <Badge count={42} />
            </div>
          </ComponentExample>
        </Section>

        <Section id="import" title="Import">
          <CodeBlock code={`import { Badge } from '@vhyxui/react'`} language="tsx" />
        </Section>

        <Section id="variants" title="Variants">
          <ComponentExample
            label="All 6 variants"
            code={`<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="outline">Outline</Badge>`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-3)', flexWrap: 'wrap' }}>
              <Badge variant="default">Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="danger">Danger</Badge>
              <Badge variant="info">Info</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </ComponentExample>
        </Section>

        <Section id="sizes" title="Sizes">
          <ComponentExample
            label="sm, md, lg"
            code={`<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>
<Badge size="lg">Large</Badge>`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-4)', alignItems: 'center' }}>
              <Badge size="sm" variant="success">Small</Badge>
              <Badge size="md" variant="success">Medium</Badge>
              <Badge size="lg" variant="success">Large</Badge>
            </div>
          </ComponentExample>
        </Section>

        <Section id="states" title="States">
          <ComponentExample
            label="Dot mode — notification indicators"
            code={`<Badge dot />
<Badge dot variant="success" />
<Badge dot variant="danger" />
<Badge dot variant="warning" />
<Badge dot variant="info" />`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-4)', alignItems: 'center' }}>
              <Badge dot />
              <Badge dot variant="success" />
              <Badge dot variant="danger" />
              <Badge dot variant="warning" />
              <Badge dot variant="info" />
            </div>
          </ComponentExample>
          <ComponentExample
            label="Count with truncation"
            code={`<Badge count={7} />
<Badge count={42} />
<Badge count={120} max={99} />
<Badge count={9999} max={999} />`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-4)', alignItems: 'center' }}>
              <Badge count={7} />
              <Badge count={42} />
              <Badge count={120} max={99} />
              <Badge count={9999} max={999} />
            </div>
          </ComponentExample>
        </Section>

        <Section id="props" title="Props">
          <PropsTable props={PROPS} />
          <p className="docs-section-text">Also accepts all standard <code>HTMLSpanElement</code> attributes.</p>
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Text badges are read directly by screen readers — content is the accessible name.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Dot badges are decorative — add <code>aria-label</code> to the parent element for context.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Count badges — supplement with context text or <code>aria-label</code> on a parent container.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Badge has no interactive behavior — it is purely informational display.</li>
          </ul>
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every Badge.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(badgeContract, null, 2)}
          />
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme Badge.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-color-success',       desc: 'Success background' },
              { name: '--vhyx-color-success-subtle', desc: 'Success subtle background' },
              { name: '--vhyx-color-danger',         desc: 'Danger background' },
              { name: '--vhyx-color-warning-subtle', desc: 'Warning background' },
              { name: '--vhyx-color-info-subtle',    desc: 'Info background' },
              { name: '--vhyx-radius-full',          desc: 'Pill border radius' },
              { name: '--vhyx-text-xs',              desc: 'Font size' },
              { name: '--vhyx-weight-medium',        desc: 'Font weight' },
            ].map((t) => (
              <div key={t.name} className="docs-token-item">
                <span className="docs-token-name">{t.name}</span>
                <span className="docs-token-desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="examples" title="Examples">
          <h3 className="docs-subsection-heading">Status list</h3>
          <ComponentExample
            label="Content status badges in a list"
            code={`{items.map(item => (
  <div key={item.name}>
    <span>{item.name}</span>
    <Badge variant={item.variant} size="sm">{item.status}</Badge>
  </div>
))}`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-2)', width: '22rem' }}>
              {[
                { name: 'Homepage redesign', status: 'Published', variant: 'success' as const },
                { name: 'Mobile navigation', status: 'Draft',     variant: 'default' as const },
                { name: 'Dark mode support', status: 'Review',    variant: 'warning' as const },
                { name: 'Payment gateway',   status: 'Error',     variant: 'danger' as const },
              ].map((item) => (
                <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--vhyx-text-sm)' }}>
                  <span>{item.name}</span>
                  <Badge variant={item.variant} size="sm">{item.status}</Badge>
                </div>
              ))}
            </div>
          </ComponentExample>

          <h3 className="docs-subsection-heading">Notification count on nav item</h3>
          <ComponentExample
            label="Count badge inline with nav link"
            code={`<span>Inbox <Badge count={unreadCount} variant="danger" size="sm" /></span>`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-6)', fontSize: 'var(--vhyx-text-sm)' }}>
              <span style={{ display: 'flex', gap: 'var(--vhyx-space-2)', alignItems: 'center' }}>
                Inbox <Badge count={12} variant="danger" size="sm" />
              </span>
              <span style={{ display: 'flex', gap: 'var(--vhyx-space-2)', alignItems: 'center' }}>
                Notifications <Badge count={3} size="sm" />
              </span>
            </div>
          </ComponentExample>
        </Section>

        <PageNav
          prev={{ title: 'Alert', href: '/components/alert' }}
          next={{ title: 'Progress', href: '/components/progress' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
