'use client';

import React from 'react';
import { Separator } from '@vhyxui/react';
import { separatorContract } from '@vhyxui/core';
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
  { id: 'props',              text: 'Props',               level: 2 },
  { id: 'accessibility',      text: 'Accessibility',       level: 2 },
  { id: 'agent-contract',     text: 'Agent Contract',      level: 2 },
  { id: 'theming',            text: 'Theming',             level: 2 },
  { id: 'examples',           text: 'Examples',            level: 2 },
] as const;

// ─── Props ─────────────────────────────────────────────────────────────────

const PROPS: PropDef[] = [
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Direction of the separator line.' },
  { name: 'decorative', type: 'boolean', default: 'true', description: 'When true, aria-hidden (decorative). When false, renders role="separator".' },
  { name: 'label', type: 'string', description: 'Centered text label rendered on horizontal separators.' },
  { name: 'className', type: 'string', description: 'Additional CSS classes.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function SeparatorPage(): React.ReactElement {
  return (
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Separator"
          description="Visual divider between content sections. Decorative by default (aria-hidden). Semantic mode uses role='separator' for structural meaning. Supports horizontal and vertical orientations with an optional centered label."
          tags={['Display', 'Layout', 'VhyxSeal']}
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="Horizontal separator between content blocks"
            code={`<p>Content above the separator.</p>
<Separator />
<p>Content below the separator.</p>`}
          >
            <div style={{ width: '100%' }}>
              <p style={{ fontSize: 'var(--vhyx-text-sm)', marginBottom: 'var(--vhyx-space-4)' }}>Content above the separator.</p>
              <Separator />
              <p style={{ fontSize: 'var(--vhyx-text-sm)', marginTop: 'var(--vhyx-space-4)' }}>Content below the separator.</p>
            </div>
          </ComponentExample>
        </Section>

        <Section id="import" title="Import">
          <CodeBlock code={`import { Separator } from '@vhyxui/react'`} language="tsx" />
        </Section>

        <Section id="variants" title="Variants">
          <ComponentExample
            label="With centered label"
            code={`<Separator label="or" />`}
          >
            <div style={{ width: '22rem' }}>
              <Separator label="or" />
            </div>
          </ComponentExample>
          <ComponentExample
            label="Vertical orientation"
            code={`<div style={{ display: 'flex', alignItems: 'center', height: '3rem' }}>
  <span>Edit</span>
  <Separator orientation="vertical" style={{ height: '100%' }} />
  <span>Delete</span>
</div>`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--vhyx-space-3)', height: '3rem' }}>
              <span style={{ fontSize: 'var(--vhyx-text-sm)' }}>Edit</span>
              <Separator orientation="vertical" style={{ height: '100%' }} />
              <span style={{ fontSize: 'var(--vhyx-text-sm)' }}>Delete</span>
              <Separator orientation="vertical" style={{ height: '100%' }} />
              <span style={{ fontSize: 'var(--vhyx-text-sm)' }}>Share</span>
            </div>
          </ComponentExample>
          <ComponentExample
            label="Semantic (non-decorative)"
            code={`<Separator decorative={false} aria-label="Section break" />`}
          >
            <div style={{ width: '100%' }}>
              <Separator decorative={false} aria-label="Section break" />
            </div>
          </ComponentExample>
        </Section>

        <Section id="props" title="Props">
          <PropsTable props={PROPS} />
          <p className="docs-section-text">Also accepts all standard <code>HTMLElement</code> attributes.</p>
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>decorative=true</code> (default) sets <code>aria-hidden="true"</code> — screen readers skip it entirely.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>decorative=false</code> renders <code>role="separator"</code> with <code>aria-orientation</code> for structural divisions.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Label text on horizontal separators is visible text and read by screen readers.</li>
          </ul>
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every Separator.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(separatorContract, null, 2)}
          />
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme Separator.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-color-border',     desc: 'Line color' },
              { name: '--vhyx-border-width',      desc: 'Line thickness' },
              { name: '--vhyx-text-xs',           desc: 'Label font size' },
              { name: '--vhyx-color-text-muted',  desc: 'Label text color' },
              { name: '--vhyx-color-bg',          desc: 'Label background (isolates from line)' },
            ].map((t) => (
              <div key={t.name} className="docs-token-item">
                <span className="docs-token-name">{t.name}</span>
                <span className="docs-token-desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="examples" title="Examples">
          <h3 className="docs-subsection-heading">Auth form divider</h3>
          <ComponentExample
            label="'or continue with' between login options"
            code={`<Button variant="outline" style={{ width: '100%' }}>Log in with email</Button>
<Separator label="or continue with" />
<Button variant="outline" style={{ width: '100%' }}>Log in with Google</Button>`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-4)', width: '22rem' }}>
              <button type="button" style={{ width: '100%', padding: 'var(--vhyx-space-2)', border: '1px solid var(--vhyx-color-border)', borderRadius: 'var(--vhyx-radius-md)', background: 'var(--vhyx-color-surface)', cursor: 'pointer', fontSize: 'var(--vhyx-text-sm)' }}>
                Log in with email
              </button>
              <Separator label="or continue with" />
              <button type="button" style={{ width: '100%', padding: 'var(--vhyx-space-2)', border: '1px solid var(--vhyx-color-border)', borderRadius: 'var(--vhyx-radius-md)', background: 'var(--vhyx-color-surface)', cursor: 'pointer', fontSize: 'var(--vhyx-text-sm)' }}>
                Log in with Google
              </button>
            </div>
          </ComponentExample>

          <h3 className="docs-subsection-heading">Toolbar divider</h3>
          <ComponentExample
            label="Vertical separator between toolbar actions"
            code={`<div style={{ display: 'flex', alignItems: 'center' }}>
  <button>Bold</button>
  <button>Italic</button>
  <Separator orientation="vertical" style={{ height: '1.5rem' }} />
  <button>Align left</button>
  <button>Align center</button>
</div>`}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--vhyx-space-1)', padding: 'var(--vhyx-space-1)', background: 'var(--vhyx-color-bg-subtle)', borderRadius: 'var(--vhyx-radius-md)', border: '1px solid var(--vhyx-color-border)' }}>
              {['B', 'I', 'U'].map((t) => (
                <button key={t} type="button" style={{ width: '2rem', height: '2rem', border: 'none', background: 'transparent', borderRadius: 'var(--vhyx-radius-sm)', cursor: 'pointer', fontWeight: 'var(--vhyx-weight-bold)', fontSize: 'var(--vhyx-text-sm)' }}>{t}</button>
              ))}
              <Separator orientation="vertical" style={{ height: '1.5rem' }} />
              {['←', '≡', '→'].map((t) => (
                <button key={t} type="button" style={{ width: '2rem', height: '2rem', border: 'none', background: 'transparent', borderRadius: 'var(--vhyx-radius-sm)', cursor: 'pointer', fontSize: 'var(--vhyx-text-sm)' }}>{t}</button>
              ))}
            </div>
          </ComponentExample>
        </Section>

        <PageNav
          prev={{ title: 'Card', href: '/components/card' }}
          next={{ title: 'Tabs', href: '/components/tabs' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
