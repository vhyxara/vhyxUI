'use client';

import React from 'react';
import { Breadcrumb, Separator } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlock';
import { PropsTable } from '../../../components/PropsTable';
import { KeyboardTable } from '../../../components/KeyboardTable';
import type { PropDef } from '../../../components/PropsTable';
import type { KeyboardRow } from '../../../components/KeyboardTable';

const PROPS: PropDef[] = [
  { name: 'separator', type: 'React.ReactNode', default: '"/"', description: 'Separator rendered between items.' },
  { name: 'maxItems', type: 'number', description: 'Reserved — collapses middle items with ellipsis. Not yet implemented.' },
];

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Tab'], action: 'Move focus through breadcrumb links.' },
  { keys: ['Enter'], action: 'Activate a link.' },
];

export default function BreadcrumbPage(): React.ReactElement {
  return (
    <>
      <PageHeader name="Breadcrumb" description="Navigation landmark showing the current page hierarchy. Page (current) receives aria-current. Not a link — correct per spec." tags={['Navigation', 'Compound', 'VhyxSeal']} />

      <Section title="Interactive example">
        <ComponentExample label="3-level breadcrumb" code={`<Breadcrumb>\n  <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>\n  <Breadcrumb.Item><Breadcrumb.Link href="/products">Products</Breadcrumb.Link></Breadcrumb.Item>\n  <Breadcrumb.Item><Breadcrumb.Page>Widget X</Breadcrumb.Page></Breadcrumb.Item>\n</Breadcrumb>`}>
          <Breadcrumb>
            <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
            <Breadcrumb.Item><Breadcrumb.Link href="/components/button">Components</Breadcrumb.Link></Breadcrumb.Item>
            <Breadcrumb.Item><Breadcrumb.Page>Breadcrumb</Breadcrumb.Page></Breadcrumb.Item>
          </Breadcrumb>
        </ComponentExample>
      </Section>

      <Section title="Import">
        <CodeBlock code={`import { Breadcrumb } from '@vhyxui/react'

Breadcrumb.Item, Breadcrumb.Link, Breadcrumb.Page, Breadcrumb.Ellipsis`} />
      </Section>

      <Section title="Variants">
        <ComponentExample label="Custom separator" code={`<Breadcrumb separator=">">`}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
            <Breadcrumb.Item><Breadcrumb.Link href="#">Docs</Breadcrumb.Link></Breadcrumb.Item>
            <Breadcrumb.Item><Breadcrumb.Page>Button</Breadcrumb.Page></Breadcrumb.Item>
          </Breadcrumb>
        </ComponentExample>
        <ComponentExample label="With ellipsis for deep paths" code={`<Breadcrumb.Ellipsis />`}>
          <Breadcrumb>
            <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
            <Breadcrumb.Item><Breadcrumb.Ellipsis /></Breadcrumb.Item>
            <Breadcrumb.Item><Breadcrumb.Link href="#">Components</Breadcrumb.Link></Breadcrumb.Item>
            <Breadcrumb.Item><Breadcrumb.Page>Breadcrumb</Breadcrumb.Page></Breadcrumb.Item>
          </Breadcrumb>
        </ComponentExample>
      </Section>

      <Section title="Props"><PropsTable props={PROPS} /></Section>

      <Section title="Accessibility">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>&lt;nav aria-label="Breadcrumb"&gt;</code> — landmark for screen readers.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>Breadcrumb.Page</code> receives <code>aria-current="page"</code> — it is a <code>&lt;span&gt;</code>, NOT a link.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Separators are <code>aria-hidden</code> — screen readers skip them.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Ellipsis is <code>aria-hidden</code> — decorative collapsed items indicator.</li>
        </ul>
      </Section>

      <Section title="Keyboard navigation"><KeyboardTable rows={KEYBOARD} /></Section>

      <Section title="Agent contract">
        <div className="docs-contract">
          {[{ key: 'type', value: '"navigation"' }, { key: 'intent', value: '"show-page-hierarchy"' }, { key: 'safetyLevel', value: '"low"' }].map((r) => (
            <div key={r.key} className="docs-contract-row"><span className="docs-contract-key">{r.key}</span><span className="docs-contract-value">{r.value}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Theming">
        <div className="docs-tokens-grid">
          {[{ name: '--vhyx-color-text-muted', desc: 'Separator color' }, { name: '--vhyx-color-text-subtle', desc: 'Link color' }, { name: '--vhyx-color-accent', desc: 'Link hover color' }, { name: '--vhyx-text-sm', desc: 'Font size' }].map((t) => (
            <div key={t.name} className="docs-token-item"><span className="docs-token-name">{t.name}</span><span className="docs-token-desc">{t.desc}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Examples">
        <ComponentExample label="Documentation breadcrumb" code={`<Breadcrumb separator="/">\n  <Breadcrumb.Item><Breadcrumb.Link href="/">Docs</Breadcrumb.Link></Breadcrumb.Item>\n  <Breadcrumb.Item><Breadcrumb.Link href="/components">Components</Breadcrumb.Link></Breadcrumb.Item>\n  <Breadcrumb.Item><Breadcrumb.Page>Breadcrumb</Breadcrumb.Page></Breadcrumb.Item>\n</Breadcrumb>`}>
          <Breadcrumb>
            <Breadcrumb.Item><Breadcrumb.Link href="/">VhyxUI Docs</Breadcrumb.Link></Breadcrumb.Item>
            <Breadcrumb.Item><Breadcrumb.Link href="/components/button">Components</Breadcrumb.Link></Breadcrumb.Item>
            <Breadcrumb.Item><Breadcrumb.Page>Breadcrumb</Breadcrumb.Page></Breadcrumb.Item>
          </Breadcrumb>
        </ComponentExample>
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <a href="/components/card" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>← Card</a>
        <a href="/components/pagination" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>Pagination →</a>
      </div>
    </>
  );
}
