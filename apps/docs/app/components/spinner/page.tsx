'use client';

import React from 'react';
import { Spinner, Separator } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlockSimple';
import { PropsTable } from '../../../components/PropsTable';
import type { PropDef } from '../../../components/PropsTable';

const PROPS: PropDef[] = [
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Size of the spinner.' },
  { name: 'variant', type: "'default' | 'accent' | 'white'", default: "'default'", description: 'Color variant.' },
  { name: 'label', type: 'string', default: '"Loading"', description: 'Screen-reader accessible label. Always present.' },
];

export default function SpinnerPage(): React.ReactElement {
  return (
    <>
      <PageHeader name="Spinner" description="SVG loading indicator. Better visual quality than CSS border tricks. Screen-reader label always included — accessible by default." tags={['Display', 'VhyxSeal']} />

      <Section title="Interactive example">
        <ComponentExample label="Loading states" code={`<Spinner />`}>
          <Spinner />
          <Spinner variant="accent" />
        </ComponentExample>
      </Section>

      <Section title="Import"><CodeBlock code={`import { Spinner } from '@vhyxui/react'`} /></Section>

      <Section title="Variants">
        <ComponentExample label="default, accent, white (on dark bg)" code={`<Spinner variant="default" />\n<Spinner variant="accent" />\n<Spinner variant="white" />`}>
          <Spinner variant="default" />
          <Spinner variant="accent" />
          <div style={{ background: 'var(--vhyx-color-bg-inverse)', padding: 'var(--vhyx-space-3)', borderRadius: 'var(--vhyx-radius-md)' }}>
            <Spinner variant="white" />
          </div>
        </ComponentExample>
      </Section>

      <Section title="Sizes">
        <ComponentExample label="xs, sm, md, lg, xl">
          <Spinner size="xs" />
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Spinner size="xl" />
        </ComponentExample>
      </Section>

      <Section title="Props"><PropsTable props={PROPS} /></Section>

      <Section title="Accessibility">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>role="status"</code> on the SVG element.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Visually hidden <code>label</code> always present — defaults to "Loading".</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> SVG spinner — better rendering quality than CSS border hack at all sizes.</li>
        </ul>
      </Section>

      <Section title="Agent contract">
        <div className="docs-contract">
          {[{ key: 'type', value: '"display"' }, { key: 'intent', value: '"show-loading-state"' }, { key: 'safetyLevel', value: '"low"' }].map((r) => (
            <div key={r.key} className="docs-contract-row"><span className="docs-contract-key">{r.key}</span><span className="docs-contract-value">{r.value}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Theming">
        <div className="docs-tokens-grid">
          {[{ name: '--vhyx-color-text-muted', desc: 'Default spinner color' }, { name: '--vhyx-color-accent', desc: 'Accent variant color' }].map((t) => (
            <div key={t.name} className="docs-token-item"><span className="docs-token-name">{t.name}</span><span className="docs-token-desc">{t.desc}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Examples">
        <ComponentExample label="Full-page loading" code={`<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '12rem' }}>\n  <Spinner size="lg" label="Loading page content" />\n</div>`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '8rem', width: '100%', background: 'var(--vhyx-color-bg-subtle)', borderRadius: 'var(--vhyx-radius-md)' }}>
            <Spinner size="lg" label="Loading page content" />
          </div>
        </ComponentExample>
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <a href="/components/progress" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>← Progress</a>
        <a href="/components/separator" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>Separator →</a>
      </div>
    </>
  );
}
