'use client';

import React from 'react';
import { Card, Badge, Button, Separator } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlock';
import { PropsTable } from '../../../components/PropsTable';
import type { PropDef } from '../../../components/PropsTable';

const PROPS: PropDef[] = [
  { name: 'variant', type: "'default' | 'outline' | 'ghost' | 'elevated'", default: "'default'", description: 'Visual style of the card.' },
  { name: 'padding', type: "'none' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Internal padding.' },
  { name: 'interactive', type: 'boolean', default: 'false', description: 'Adds hover shadow and active scale for clickable cards.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override.' },
];

export default function CardPage(): React.ReactElement {
  return (
    <>
      <PageHeader name="Card" description="Content container with four variants and optional interactive hover/active states. Sub-components: Card.Header, Card.Body, Card.Footer, Card.Image." tags={['Display', 'Compound', 'VhyxSeal']} />

      <Section title="Interactive example">
        <ComponentExample label="Product card" code={`<Card variant="outline" padding="lg">\n  <Card.Header><Badge>New</Badge></Card.Header>\n  <Card.Body><h3>Product name</h3></Card.Body>\n  <Card.Footer><Button>Buy now</Button></Card.Footer>\n</Card>`}>
          <Card variant="outline" padding="lg" style={{ width: '18rem' }}>
            <Card.Header>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'var(--vhyx-weight-semibold)', fontSize: 'var(--vhyx-text-md)' }}>Pro plan</span>
                <Badge variant="success" size="sm">Popular</Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <p style={{ fontSize: 'var(--vhyx-text-3xl)', fontWeight: 'var(--vhyx-weight-bold)', marginBottom: 'var(--vhyx-space-2)' }}>$12<span style={{ fontSize: 'var(--vhyx-text-sm)', fontWeight: 'var(--vhyx-weight-normal)', color: 'var(--vhyx-color-text-muted)' }}>/mo</span></p>
              <p style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)', lineHeight: 'var(--vhyx-leading-relaxed)' }}>Everything in Starter, plus advanced features and priority support.</p>
            </Card.Body>
            <Card.Footer>
              <Button variant="primary" style={{ width: '100%' }}>Get started</Button>
            </Card.Footer>
          </Card>
        </ComponentExample>
      </Section>

      <Section title="Import">
        <CodeBlock code={`import { Card } from '@vhyxui/react'

Card.Header, Card.Body, Card.Footer, Card.Image`} />
      </Section>

      <Section title="Variants">
        <ComponentExample label="All 4 variants" code={`<Card variant="default">…</Card>\n<Card variant="outline">…</Card>\n<Card variant="ghost">…</Card>\n<Card variant="elevated">…</Card>`}>
          {(['default', 'outline', 'ghost', 'elevated'] as const).map((v) => (
            <Card key={v} variant={v} padding="md" style={{ width: '10rem' }}>
              <Card.Body>
                <p style={{ fontSize: 'var(--vhyx-text-sm)', fontWeight: 'var(--vhyx-weight-medium)', textAlign: 'center' }}>{v}</p>
              </Card.Body>
            </Card>
          ))}
        </ComponentExample>
        <ComponentExample label="Interactive card (hover for effect)" code={`<Card interactive>…</Card>`}>
          <Card interactive variant="outline" padding="md" style={{ width: '14rem', cursor: 'pointer' }}>
            <Card.Body>
              <p style={{ fontWeight: 'var(--vhyx-weight-semibold)', marginBottom: 'var(--vhyx-space-1)' }}>Clickable card</p>
              <p style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Hover for shadow. Click for scale.</p>
            </Card.Body>
          </Card>
        </ComponentExample>
      </Section>

      <Section title="Padding">
        <ComponentExample label="none, sm, md, lg">
          {(['none', 'sm', 'md', 'lg'] as const).map((p) => (
            <Card key={p} variant="outline" padding={p} style={{ minWidth: '7rem' }}>
              <Card.Body><p style={{ fontSize: 'var(--vhyx-text-sm)', textAlign: 'center' }}>padding="{p}"</p></Card.Body>
            </Card>
          ))}
        </ComponentExample>
      </Section>

      <Section title="Props"><PropsTable props={PROPS} /></Section>

      <Section title="Accessibility">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Card is a <code>&lt;div&gt;</code> — not interactive by default.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> For clickable cards, use a wrapping <code>&lt;a&gt;</code> or <code>&lt;button&gt;</code> as the root.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Card.Image automatically sets <code>alt=""</code> placeholder — provide meaningful alt text.</li>
        </ul>
      </Section>

      <Section title="Agent contract">
        <div className="docs-contract">
          {[{ key: 'type', value: '"display"' }, { key: 'intent', value: '"display-content"' }, { key: 'safetyLevel', value: '"low"' }].map((r) => (
            <div key={r.key} className="docs-contract-row"><span className="docs-contract-key">{r.key}</span><span className="docs-contract-value">{r.value}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Theming">
        <div className="docs-tokens-grid">
          {[{ name: '--vhyx-color-surface', desc: 'Card background' }, { name: '--vhyx-radius-lg', desc: 'Border radius' }, { name: '--vhyx-shadow-sm', desc: 'Elevated shadow' }, { name: '--vhyx-shadow-md', desc: 'Interactive hover shadow' }].map((t) => (
            <div key={t.name} className="docs-token-item"><span className="docs-token-name">{t.name}</span><span className="docs-token-desc">{t.desc}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Examples">
        <ComponentExample label="Feature grid" code={`<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>\n  <Card variant="outline">…</Card>\n</div>`}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--vhyx-space-4)', width: '100%' }}>
            {[
              { icon: '🚀', title: 'Fast', desc: 'Zero runtime overhead.' },
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
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <a href="/components/tooltip" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>← Tooltip</a>
        <a href="/components/breadcrumb" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>Breadcrumb →</a>
      </div>
    </>
  );
}
