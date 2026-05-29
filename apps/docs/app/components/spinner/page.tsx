'use client';

import React from 'react';
import { Spinner, Button } from '@vhyxui/react';
import { spinnerContract } from '@vhyxui/core';
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
  { id: 'props',              text: 'Props',               level: 2 },
  { id: 'accessibility',      text: 'Accessibility',       level: 2 },
  { id: 'agent-contract',     text: 'Agent Contract',      level: 2 },
  { id: 'theming',            text: 'Theming',             level: 2 },
  { id: 'examples',           text: 'Examples',            level: 2 },
] as const;

// ─── Props ─────────────────────────────────────────────────────────────────

const PROPS: PropDef[] = [
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Size of the spinner.' },
  { name: 'variant', type: "'default' | 'accent' | 'white'", default: "'default'", description: 'Color variant. Use white on dark backgrounds.' },
  { name: 'label', type: 'string', default: '"Loading"', description: 'Screen-reader accessible label. Always rendered as sr-only text.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function SpinnerPage(): React.ReactElement {
  return (
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Spinner"
          description="SVG loading indicator with consistent rendering at all sizes. Screen-reader label always present by default — accessible without extra configuration."
          tags={['Display', 'VhyxSeal']}
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="Default and accent spinners"
            code={`<Spinner />
<Spinner variant="accent" />`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-6)', alignItems: 'center' }}>
              <Spinner />
              <Spinner variant="accent" />
            </div>
          </ComponentExample>
        </Section>

        <Section id="import" title="Import">
          <CodeBlock code={`import { Spinner } from '@vhyxui/react'`} language="tsx" />
        </Section>

        <Section id="variants" title="Variants">
          <ComponentExample
            label="default, accent, white (shown on dark background)"
            code={`<Spinner variant="default" />
<Spinner variant="accent" />
<Spinner variant="white" />  {/* on dark bg */}`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-6)', alignItems: 'center' }}>
              <Spinner variant="default" />
              <Spinner variant="accent" />
              <div style={{ background: 'var(--vhyx-color-bg-inverse)', padding: 'var(--vhyx-space-3)', borderRadius: 'var(--vhyx-radius-md)' }}>
                <Spinner variant="white" />
              </div>
            </div>
          </ComponentExample>
        </Section>

        <Section id="sizes" title="Sizes">
          <ComponentExample
            label="xs, sm, md, lg, xl"
            code={`<Spinner size="xs" />
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-6)', alignItems: 'center' }}>
              <Spinner size="xs" />
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
              <Spinner size="xl" />
            </div>
          </ComponentExample>
        </Section>

        <Section id="props" title="Props">
          <PropsTable props={PROPS} />
          <p className="docs-section-text">Also accepts all standard <code>SVGElement</code> attributes.</p>
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>role="status"</code> on the SVG — state is communicated to assistive technology.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Visually hidden <code>label</code> always rendered — defaults to "Loading". Never invisible to screen readers.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> SVG spinner — better rendering quality than the CSS border-trick at all sizes and resolutions.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Animation collapses to zero duration with <code>prefers-reduced-motion: reduce</code>.</li>
          </ul>
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every Spinner.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(spinnerContract, null, 2)}
          />
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme Spinner.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-color-text-muted', desc: 'Default spinner track color' },
              { name: '--vhyx-color-accent',     desc: 'Accent variant color' },
              { name: '--vhyx-duration-glacial',  desc: 'Rotation speed (500ms per revolution)' },
            ].map((t) => (
              <div key={t.name} className="docs-token-item">
                <span className="docs-token-name">{t.name}</span>
                <span className="docs-token-desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="examples" title="Examples">
          <h3 className="docs-subsection-heading">Full-page loading state</h3>
          <ComponentExample
            label="Centered spinner with custom label"
            code={`<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '12rem' }}>
  <Spinner size="lg" label="Loading page content" />
</div>`}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '8rem', width: '100%', background: 'var(--vhyx-color-bg-subtle)', borderRadius: 'var(--vhyx-radius-md)' }}>
              <Spinner size="lg" label="Loading page content" />
            </div>
          </ComponentExample>

          <h3 className="docs-subsection-heading">Inside a Button while loading</h3>
          <ComponentExample
            label="Button with inline spinner"
            code={`<Button disabled>
  <Spinner size="xs" variant="white" />
  Saving…
</Button>`}
          >
            <Button disabled style={{ display: 'flex', gap: 'var(--vhyx-space-2)', alignItems: 'center' }}>
              <Spinner size="xs" label="Saving" />
              Saving…
            </Button>
          </ComponentExample>
        </Section>

        <PageNav
          prev={{ title: 'Progress', href: '/components/progress' }}
          next={{ title: 'Dialog', href: '/components/dialog' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
