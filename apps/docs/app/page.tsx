'use client';

import React from 'react';
import { Button, Badge, Card, Separator } from '@vhyxui/react';

// ─── Layer cards data ─────────────────────────────────────────────────────────

const layers = [
  {
    number: '01',
    title: 'Visual',
    description:
      'Beautiful defaults driven entirely by CSS custom properties. Override any token — the entire library updates. Zero runtime. Zero lock-in.',
    variant: 'default' as const,
  },
  {
    number: '02',
    title: 'Accessibility',
    description:
      'WCAG 2.1 AA as the floor. Keyboard navigation, focus management, and screen reader support built into every component. Cannot be accidentally skipped.',
    variant: 'success' as const,
  },
  {
    number: '03',
    title: 'Motion',
    description:
      'First class — not bolted on. Every interaction defined. prefers-reduced-motion handled automatically. Token-driven durations and easings throughout.',
    variant: 'info' as const,
  },
  {
    number: '04',
    title: 'Agent Contract',
    description:
      'Every component is AI-agent-readable via VhyxSeal. Default contracts ship with every component. Agents understand intent, safety, and consequences.',
    variant: 'warning' as const,
  },
];

// ─── Component catalogue ──────────────────────────────────────────────────────

const componentGroups = [
  {
    group: 'Inputs',
    items: ['Button', 'Input', 'Textarea', 'Select', 'Checkbox', 'Radio', 'Switch'],
  },
  {
    group: 'Form',
    items: ['Form', 'Field'],
  },
  {
    group: 'Feedback',
    items: ['Toast', 'Alert', 'Progress', 'Spinner'],
  },
  {
    group: 'Display',
    items: ['Badge', 'Card', 'Separator'],
  },
  {
    group: 'Overlay',
    items: ['Dialog', 'Drawer', 'Tooltip', 'Popover'],
  },
  {
    group: 'Navigation',
    items: ['Tabs', 'Breadcrumb', 'Pagination'],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage(): React.ReactElement {
  return (
    <>
      {/* Header */}
      <header className="docs-header">
        <a href="/" className="docs-nav-brand">
          VhyxUI
        </a>
        <nav style={{ display: 'flex', gap: 'var(--vhyx-space-3)', alignItems: 'center' }}>
          <Badge variant="info" size="sm">v0.0.1</Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open('https://github.com/vhyxara/vhyxui', '_blank')}
          >
            GitHub
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => { window.location.href = '/docs/getting-started'; }}
          >
            Get started
          </Button>
        </nav>
      </header>

      {/* Hero */}
      <section className="docs-hero">
        <Badge variant="outline" size="sm" style={{ marginBottom: 'var(--vhyx-space-6)' }}>
          22 Tier 1 components · MIT license
        </Badge>
        <h1 className="docs-hero-title">
          Build with freedom.<br />
          <span>Ship with confidence.</span>
        </h1>
        <p className="docs-hero-tagline">
          VhyxUI is a headless React component library built from first principles.
          Four layers no other library ships together: visual, accessibility,
          motion, and AI agent contracts.
        </p>
        <div className="docs-hero-actions">
          <Button
            variant="primary"
            size="lg"
            onClick={() => { window.location.href = '/docs/getting-started'; }}
          >
            Get started
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => { window.location.href = '/docs/components'; }}
          >
            View components
          </Button>
        </div>
        <Separator decorative />
      </section>

      {/* Four layers */}
      <section className="docs-layers">
        <div className="docs-layers-inner">
          <p className="docs-section-label">Why VhyxUI</p>
          <h2 className="docs-section-title">Four layers. One library.</h2>
          <p className="docs-section-subtitle">
            Every existing UI library makes a bet you cannot escape. VhyxUI makes one bet: CSS wins.
          </p>
          <div className="docs-layers-grid">
            {layers.map((layer) => (
              <Card key={layer.number} variant="outline" padding="lg">
                <Card.Header>
                  <Badge variant={layer.variant} size="sm">Layer {layer.number}</Badge>
                </Card.Header>
                <Card.Body>
                  <h3
                    style={{
                      fontSize: 'var(--vhyx-text-lg)',
                      fontWeight: 'var(--vhyx-weight-semibold)',
                      marginBottom: 'var(--vhyx-space-2)',
                      color: 'var(--vhyx-color-text)',
                    }}
                  >
                    {layer.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 'var(--vhyx-text-sm)',
                      color: 'var(--vhyx-color-text-subtle)',
                      lineHeight: 'var(--vhyx-leading-relaxed)',
                    }}
                  >
                    {layer.description}
                  </p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Component catalogue */}
      <section className="docs-components">
        <div className="docs-components-inner">
          <p className="docs-section-label">Components</p>
          <h2 className="docs-section-title">22 Tier 1 components</h2>
          <p className="docs-section-subtitle">
            Every component ships with accessibility, motion, and agent contracts built in.
            Tree-shakeable. CSS token driven. Agent ready.
          </p>
          <div className="docs-components-grid">
            {componentGroups.map((group) => (
              <Card key={group.group} variant="default" padding="md">
                <Card.Header>
                  <span
                    style={{
                      fontSize: 'var(--vhyx-text-xs)',
                      fontWeight: 'var(--vhyx-weight-semibold)',
                      textTransform: 'uppercase',
                      letterSpacing: 'var(--vhyx-tracking-wider)',
                      color: 'var(--vhyx-color-text-subtle)',
                    }}
                  >
                    {group.group}
                  </span>
                </Card.Header>
                <Card.Body>
                  <ul
                    style={{
                      listStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--vhyx-space-1)',
                    }}
                  >
                    {group.items.map((name) => (
                      <li key={name}>
                        <a
                          href={`/docs/components/${name.toLowerCase()}`}
                          style={{
                            fontSize: 'var(--vhyx-text-sm)',
                            color: 'var(--vhyx-color-text)',
                            textDecoration: 'none',
                            display: 'block',
                            padding: 'var(--vhyx-space-1) 0',
                          }}
                        >
                          {name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Install */}
      <section
        style={{
          padding: 'var(--vhyx-space-16) var(--vhyx-space-8)',
          textAlign: 'center',
          backgroundColor: 'var(--vhyx-color-bg-inverse)',
        }}
      >
        <div style={{ maxWidth: '36rem', margin: '0 auto' }}>
          <h2
            style={{
              fontSize: 'var(--vhyx-text-2xl)',
              fontWeight: 'var(--vhyx-weight-bold)',
              color: 'var(--vhyx-color-text-inverse)',
              marginBottom: 'var(--vhyx-space-4)',
            }}
          >
            Start building today
          </h2>
          <pre
            style={{
              backgroundColor: 'var(--vhyx-color-bg)',
              color: 'var(--vhyx-color-text)',
              padding: 'var(--vhyx-space-4) var(--vhyx-space-6)',
              borderRadius: 'var(--vhyx-radius-md)',
              fontFamily: 'var(--vhyx-font-mono)',
              fontSize: 'var(--vhyx-text-sm)',
              textAlign: 'left',
              marginBottom: 'var(--vhyx-space-6)',
              overflowX: 'auto',
            }}
          >
            <code>npm install @vhyxui/react @vhyxui/tokens</code>
          </pre>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => { window.location.href = '/docs/getting-started'; }}
          >
            Read the docs
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="docs-footer">
        <p>
          VhyxUI by{' '}
          <a
            href="https://vhyxara.com"
            style={{ color: 'var(--vhyx-color-accent)' }}
          >
            Vhyxara
          </a>
          {' '}· MIT License · Build with freedom. Ship with confidence.
        </p>
      </footer>
    </>
  );
}
