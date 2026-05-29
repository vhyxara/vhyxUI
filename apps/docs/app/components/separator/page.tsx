'use client';

import React from 'react';
import { Separator } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlockSimple';
import { PropsTable } from '../../../components/PropsTable';
import type { PropDef } from '../../../components/PropsTable';

const PROPS: PropDef[] = [
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Direction of the separator.' },
  { name: 'decorative', type: 'boolean', default: 'true', description: 'When true, aria-hidden (decorative). When false, role="separator".' },
  { name: 'label', type: 'string', description: 'Centered text label on horizontal separators.' },
];

export default function SeparatorPage(): React.ReactElement {
  return (
    <>
      <PageHeader name="Separator" description="Visual divider between sections. Decorative by default (aria-hidden). Semantic mode uses role='separator'." tags={['Display', 'Layout']} />

      <Section title="Interactive example">
        <ComponentExample label="Horizontal separator" code={`<Separator />`}>
          <div style={{ width: '100%' }}>
            <p style={{ fontSize: 'var(--vhyx-text-sm)', marginBottom: 'var(--vhyx-space-4)' }}>Content above the separator.</p>
            <Separator />
            <p style={{ fontSize: 'var(--vhyx-text-sm)', marginTop: 'var(--vhyx-space-4)' }}>Content below the separator.</p>
          </div>
        </ComponentExample>
      </Section>

      <Section title="Import"><CodeBlock code={`import { Separator } from '@vhyxui/react'`} /></Section>

      <Section title="Variants">
        <ComponentExample label="With centered label" code={`<Separator label="or" />`}>
          <div style={{ width: '20rem' }}>
            <Separator label="or" />
          </div>
        </ComponentExample>
        <ComponentExample label="Vertical orientation" code={`<Separator orientation="vertical" style={{ height: '3rem' }} />`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--vhyx-space-3)', height: '3rem' }}>
            <span style={{ fontSize: 'var(--vhyx-text-sm)' }}>Edit</span>
            <Separator orientation="vertical" style={{ height: '100%' }} />
            <span style={{ fontSize: 'var(--vhyx-text-sm)' }}>Delete</span>
            <Separator orientation="vertical" style={{ height: '100%' }} />
            <span style={{ fontSize: 'var(--vhyx-text-sm)' }}>Share</span>
          </div>
        </ComponentExample>
        <ComponentExample label="Semantic (not decorative)" code={`<Separator decorative={false} aria-label="Section divider" />`}>
          <div style={{ width: '100%' }}>
            <Separator decorative={false} aria-label="Section break" />
          </div>
        </ComponentExample>
      </Section>

      <Section title="Props"><PropsTable props={PROPS} /></Section>

      <Section title="Accessibility">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>decorative=true</code> (default) adds <code>aria-hidden</code> — screen readers skip it.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>decorative=false</code> uses <code>role="separator"</code> for meaningful divisions.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Label text on horizontal separators is visible and screen-reader readable.</li>
        </ul>
      </Section>

      <Section title="Agent contract">
        <p className="docs-section-text">Separator has no VhyxSeal contract — purely layout/visual with no agent-actionable behavior.</p>
      </Section>

      <Section title="Theming">
        <div className="docs-tokens-grid">
          {[{ name: '--vhyx-color-border', desc: 'Line color' }, { name: '--vhyx-text-xs', desc: 'Label font size' }, { name: '--vhyx-color-text-muted', desc: 'Label text color' }].map((t) => (
            <div key={t.name} className="docs-token-item"><span className="docs-token-name">{t.name}</span><span className="docs-token-desc">{t.desc}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Examples">
        <ComponentExample label="Login divider" code={`<Separator label="or continue with" />`}>
          <div style={{ width: '20rem' }}>
            <Separator label="or continue with" />
          </div>
        </ComponentExample>
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <a href="/components/spinner" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>← Spinner</a>
        <a href="/components/card" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>Card →</a>
      </div>
    </>
  );
}
