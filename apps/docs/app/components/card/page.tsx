'use client';

import React from 'react';
import { Card, Badge, Button } from '@vhyxui/react';
import { cardContract } from '@vhyxui/core';
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
  { id: 'padding',            text: 'Padding',             level: 2 },
  { id: 'props',              text: 'Props',               level: 2 },
  { id: 'accessibility',      text: 'Accessibility',       level: 2 },
  { id: 'agent-contract',     text: 'Agent Contract',      level: 2 },
  { id: 'theming',            text: 'Theming',             level: 2 },
  { id: 'examples',           text: 'Examples',            level: 2 },
] as const;

// ─── Props ─────────────────────────────────────────────────────────────────

const PROPS: PropDef[] = [
  { name: 'variant', type: "'default' | 'outline' | 'ghost' | 'elevated'", default: "'default'", description: 'Visual style of the card.' },
  { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Internal padding of the card.' },
  { name: 'interactive', type: 'boolean', default: 'false', description: 'Adds hover shadow and active scale for clickable cards.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override.' },
  { name: 'className', type: 'string', description: 'Additional CSS classes.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function CardPage(): React.ReactElement {
  return (
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Card"
          description="Content container with four variants, configurable padding, and optional interactive states. Sub-components Card.Header, Card.Body, Card.Footer, and Card.Image provide semantic layout slots."
          tags={['Display', 'Compound', 'VhyxSeal']}
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="Pricing card with header, body, and footer"
            code={`<Card variant="outline" padding="lg" style={{ width: '18rem' }}>
  <Card.Header>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span>Pro plan</span>
      <Badge variant="success" size="sm">Popular</Badge>
    </div>
  </Card.Header>
  <Card.Body>
    <p>$12<span>/mo</span></p>
    <p>Everything in Starter, plus advanced features.</p>
  </Card.Body>
  <Card.Footer>
    <Button variant="primary" style={{ width: '100%' }}>Get started</Button>
  </Card.Footer>
</Card>`}
          >
            <Card variant="outline" padding="lg" style={{ width: '18rem' }}>
              <Card.Header>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'var(--vhyx-weight-semibold)', fontSize: 'var(--vhyx-text-md)' }}>Pro plan</span>
                  <Badge variant="success" size="sm">Popular</Badge>
                </div>
              </Card.Header>
              <Card.Body>
                <p style={{ fontSize: 'var(--vhyx-text-3xl)', fontWeight: 'var(--vhyx-weight-bold)', marginBottom: 'var(--vhyx-space-2)' }}>
                  $12<span style={{ fontSize: 'var(--vhyx-text-sm)', fontWeight: 'var(--vhyx-weight-normal)', color: 'var(--vhyx-color-text-muted)' }}>/mo</span>
                </p>
                <p style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)', lineHeight: 'var(--vhyx-leading-relaxed)' }}>
                  Everything in Starter, plus advanced features and priority support.
                </p>
              </Card.Body>
              <Card.Footer>
                <Button variant="primary" style={{ width: '100%' }}>Get started</Button>
              </Card.Footer>
            </Card>
          </ComponentExample>
        </Section>

        <Section id="import" title="Import">
          <CodeBlock
            language="tsx"
            code={`import { Card } from '@vhyxui/react'

// Sub-components
// Card.Header — top slot (title, badge, actions)
// Card.Body   — main content area
// Card.Footer — bottom slot (buttons, metadata)
// Card.Image  — full-width image at top or bottom`}
          />
        </Section>

        <Section id="variants" title="Variants">
          <ComponentExample
            label="All 4 variants"
            code={`<Card variant="default">…</Card>
<Card variant="outline">…</Card>
<Card variant="ghost">…</Card>
<Card variant="elevated">…</Card>`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-4)', flexWrap: 'wrap' }}>
              {(['default', 'outline', 'ghost', 'elevated'] as const).map((v) => (
                <Card key={v} variant={v} padding="md" style={{ width: '9rem' }}>
                  <Card.Body>
                    <p style={{ fontSize: 'var(--vhyx-text-sm)', fontWeight: 'var(--vhyx-weight-medium)', textAlign: 'center' }}>{v}</p>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </ComponentExample>
          <ComponentExample
            label="Interactive card — hover for shadow, click for scale"
            code={`<Card interactive variant="outline" padding="md">
  <Card.Body>
    <p>Clickable card</p>
    <p>Hover for shadow. Click for scale.</p>
  </Card.Body>
</Card>`}
          >
            <Card interactive variant="outline" padding="md" style={{ width: '16rem', cursor: 'pointer' }}>
              <Card.Body>
                <p style={{ fontWeight: 'var(--vhyx-weight-semibold)', marginBottom: 'var(--vhyx-space-1)' }}>Clickable card</p>
                <p style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Hover for shadow. Click for scale.</p>
              </Card.Body>
            </Card>
          </ComponentExample>
        </Section>

        <Section id="padding" title="Padding">
          <ComponentExample
            label="none, sm, md, lg"
            code={`<Card variant="outline" padding="none">…</Card>
<Card variant="outline" padding="sm">…</Card>
<Card variant="outline" padding="md">…</Card>
<Card variant="outline" padding="lg">…</Card>`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-4)', flexWrap: 'wrap' }}>
              {(['none', 'sm', 'md', 'lg'] as const).map((p) => (
                <Card key={p} variant="outline" padding={p} style={{ minWidth: '7rem' }}>
                  <Card.Body><p style={{ fontSize: 'var(--vhyx-text-xs)', textAlign: 'center', color: 'var(--vhyx-color-text-subtle)' }}>padding="{p}"</p></Card.Body>
                </Card>
              ))}
            </div>
          </ComponentExample>
        </Section>

        <Section id="props" title="Props">
          <PropsTable props={PROPS} />
          <p className="docs-section-text">Also accepts all standard <code>HTMLDivElement</code> attributes.</p>
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Card renders as a <code>&lt;div&gt;</code> — not interactive by default, no implicit ARIA role.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> For clickable cards, wrap with <code>&lt;a&gt;</code> or <code>&lt;button&gt;</code> as the root element.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Card.Image should always have a meaningful <code>alt</code> attribute.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Group related cards in a <code>&lt;ul&gt;</code> list when they represent a collection.</li>
          </ul>
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every Card.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(cardContract, null, 2)}
          />
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme Card.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-color-surface',       desc: 'Card background' },
              { name: '--vhyx-color-border',         desc: 'Outline variant border' },
              { name: '--vhyx-radius-lg',            desc: 'Card border radius' },
              { name: '--vhyx-shadow-xs',            desc: 'Default variant shadow' },
              { name: '--vhyx-shadow-sm',            desc: 'Elevated variant shadow' },
              { name: '--vhyx-shadow-md',            desc: 'Interactive hover shadow' },
              { name: '--vhyx-duration-fast',        desc: 'Interactive transition duration' },
            ].map((t) => (
              <div key={t.name} className="docs-token-item">
                <span className="docs-token-name">{t.name}</span>
                <span className="docs-token-desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="examples" title="Examples">
          <h3 className="docs-subsection-heading">Feature grid</h3>
          <ComponentExample
            label="3-column feature cards"
            code={`<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
  {features.map(f => (
    <Card key={f.title} variant="outline" padding="md">
      <Card.Body>
        <div>{f.icon}</div>
        <p>{f.title}</p>
        <p>{f.desc}</p>
      </Card.Body>
    </Card>
  ))}
</div>`}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--vhyx-space-4)', width: '100%' }}>
              {[
                { icon: '⚡', title: 'Fast', desc: 'Zero runtime overhead.' },
                { icon: '♿', title: 'Accessible', desc: 'WCAG 2.1 AA by default.' },
                { icon: '🎨', title: 'Themeable', desc: 'CSS tokens throughout.' },
              ].map((f) => (
                <Card key={f.title} variant="outline" padding="md">
                  <Card.Body>
                    <div style={{ fontSize: 'var(--vhyx-text-xl)', marginBottom: 'var(--vhyx-space-2)' }}>{f.icon}</div>
                    <p style={{ fontWeight: 'var(--vhyx-weight-semibold)', marginBottom: 'var(--vhyx-space-1)', fontSize: 'var(--vhyx-text-sm)' }}>{f.title}</p>
                    <p style={{ fontSize: 'var(--vhyx-text-xs)', color: 'var(--vhyx-color-text-subtle)' }}>{f.desc}</p>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </ComponentExample>

          <h3 className="docs-subsection-heading">User profile card</h3>
          <ComponentExample
            label="Card with header and footer actions"
            code={`<Card variant="outline" padding="none" style={{ width: '18rem' }}>
  <Card.Header>
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--vhyx-color-accent-subtle)' }} />
      <div>
        <p>Jane Smith</p>
        <p>@janesmith</p>
      </div>
    </div>
  </Card.Header>
  <Card.Footer>
    <Button variant="outline" size="sm">Follow</Button>
    <Button variant="primary" size="sm">Message</Button>
  </Card.Footer>
</Card>`}
          >
            <Card variant="outline" padding="none" style={{ width: '18rem' }}>
              <Card.Header>
                <div style={{ display: 'flex', gap: 'var(--vhyx-space-3)', alignItems: 'center', padding: 'var(--vhyx-space-4)' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--vhyx-color-accent-subtle)', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontWeight: 'var(--vhyx-weight-semibold)', fontSize: 'var(--vhyx-text-sm)' }}>Jane Smith</p>
                    <p style={{ fontSize: 'var(--vhyx-text-xs)', color: 'var(--vhyx-color-text-muted)' }}>@janesmith</p>
                  </div>
                </div>
              </Card.Header>
              <Card.Footer>
                <div style={{ display: 'flex', gap: 'var(--vhyx-space-2)', padding: 'var(--vhyx-space-4)' }}>
                  <Button variant="outline" size="sm">Follow</Button>
                  <Button variant="primary" size="sm">Message</Button>
                </div>
              </Card.Footer>
            </Card>
          </ComponentExample>
        </Section>

        <PageNav
          prev={{ title: 'Popover', href: '/components/popover' }}
          next={{ title: 'Separator', href: '/components/separator' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
