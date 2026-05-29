'use client';

import React from 'react';
import { Breadcrumb } from '@vhyxui/react';
import { breadcrumbContract } from '@vhyxui/core';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlockSimple';
import { PropsTable } from '../../../components/PropsTable';
import { KeyboardTable } from '../../../components/KeyboardTable';
import { OnThisPage, type PageHeading } from '../../../components/OnThisPage';
import { PageNav } from '../../../components/PageNav';
import type { PropDef } from '../../../components/PropsTable';
import type { KeyboardRow } from '../../../components/KeyboardTable';

// ─── On This Page ──────────────────────────────────────────────────────────

const HEADINGS: ReadonlyArray<PageHeading> = [
  { id: 'interactive-example', text: 'Interactive Example', level: 2 },
  { id: 'import',             text: 'Import',              level: 2 },
  { id: 'variants',           text: 'Variants',            level: 2 },
  { id: 'props',              text: 'Props',               level: 2 },
  { id: 'accessibility',      text: 'Accessibility',       level: 2 },
  { id: 'keyboard',           text: 'Keyboard',            level: 2 },
  { id: 'agent-contract',     text: 'Agent Contract',      level: 2 },
  { id: 'theming',            text: 'Theming',             level: 2 },
  { id: 'examples',           text: 'Examples',            level: 2 },
] as const;

// ─── Props ─────────────────────────────────────────────────────────────────

const PROPS: PropDef[] = [
  { name: 'separator', type: 'React.ReactNode', default: '"/"', description: 'Separator element rendered between items. Automatically aria-hidden.' },
  { name: 'maxItems', type: 'number', description: 'Maximum items to show. Middle items collapse with Breadcrumb.Ellipsis.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override.' },
];

// ─── Keyboard ──────────────────────────────────────────────────────────────

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Tab'],   action: 'Move focus through breadcrumb links in order.' },
  { keys: ['Enter'], action: 'Activate the focused link.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function BreadcrumbPage(): React.ReactElement {
  return (
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Breadcrumb"
          description="Navigation landmark showing the current page location in the site hierarchy. Breadcrumb.Page receives aria-current='page' and renders as a span — not a link. Separators are aria-hidden."
          tags={['Navigation', 'Compound', 'VhyxSeal']}
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="3-level hierarchy breadcrumb"
            code={`<Breadcrumb>
  <Breadcrumb.Item>
    <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item>
    <Breadcrumb.Link href="/components">Components</Breadcrumb.Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item>
    <Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
  </Breadcrumb.Item>
</Breadcrumb>`}
          >
            <Breadcrumb>
              <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
              <Breadcrumb.Item><Breadcrumb.Link href="/components/button">Components</Breadcrumb.Link></Breadcrumb.Item>
              <Breadcrumb.Item><Breadcrumb.Page>Breadcrumb</Breadcrumb.Page></Breadcrumb.Item>
            </Breadcrumb>
          </ComponentExample>
        </Section>

        <Section id="import" title="Import">
          <CodeBlock
            language="tsx"
            code={`import { Breadcrumb } from '@vhyxui/react'

// Sub-components
// Breadcrumb.Item      — list item wrapper
// Breadcrumb.Link      — navigable ancestor link
// Breadcrumb.Page      — current page (not a link, aria-current="page")
// Breadcrumb.Ellipsis  — collapsed middle items indicator`}
          />
        </Section>

        <Section id="variants" title="Variants">
          <ComponentExample
            label="Custom separator"
            code={`<Breadcrumb separator=">">
  <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
  <Breadcrumb.Item><Breadcrumb.Link href="#">Docs</Breadcrumb.Link></Breadcrumb.Item>
  <Breadcrumb.Item><Breadcrumb.Page>Button</Breadcrumb.Page></Breadcrumb.Item>
</Breadcrumb>`}
          >
            <Breadcrumb separator=">">
              <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
              <Breadcrumb.Item><Breadcrumb.Link href="#">Docs</Breadcrumb.Link></Breadcrumb.Item>
              <Breadcrumb.Item><Breadcrumb.Page>Button</Breadcrumb.Page></Breadcrumb.Item>
            </Breadcrumb>
          </ComponentExample>
          <ComponentExample
            label="With ellipsis for deep paths"
            code={`<Breadcrumb>
  <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
  <Breadcrumb.Item><Breadcrumb.Ellipsis /></Breadcrumb.Item>
  <Breadcrumb.Item><Breadcrumb.Link href="#">Components</Breadcrumb.Link></Breadcrumb.Item>
  <Breadcrumb.Item><Breadcrumb.Page>Breadcrumb</Breadcrumb.Page></Breadcrumb.Item>
</Breadcrumb>`}
          >
            <Breadcrumb>
              <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
              <Breadcrumb.Item><Breadcrumb.Ellipsis /></Breadcrumb.Item>
              <Breadcrumb.Item><Breadcrumb.Link href="#">Components</Breadcrumb.Link></Breadcrumb.Item>
              <Breadcrumb.Item><Breadcrumb.Page>Breadcrumb</Breadcrumb.Page></Breadcrumb.Item>
            </Breadcrumb>
          </ComponentExample>
        </Section>

        <Section id="props" title="Props">
          <PropsTable props={PROPS} />
          <p className="docs-section-text">
            <code>Breadcrumb.Link</code> accepts <code>href: string</code> and standard anchor attributes.
            <code>Breadcrumb.Page</code> renders as a <code>&lt;span&gt;</code> — it is not a link.
          </p>
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Renders as <code>&lt;nav aria-label="Breadcrumb"&gt;</code> — a landmark navigable by screen readers.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>Breadcrumb.Page</code> renders as <code>&lt;span aria-current="page"&gt;</code> — correct per ARIA spec (not a link).</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Separators are <code>aria-hidden="true"</code> — screen readers skip them.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Ellipsis is <code>aria-hidden="true"</code> — decorative indicator only.</li>
          </ul>
        </Section>

        <Section id="keyboard" title="Keyboard navigation">
          <KeyboardTable rows={KEYBOARD} />
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every Breadcrumb.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(breadcrumbContract, null, 2)}
          />
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme Breadcrumb.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-text-sm',            desc: 'Font size' },
              { name: '--vhyx-color-text-subtle',   desc: 'Link color' },
              { name: '--vhyx-color-accent',         desc: 'Link hover color' },
              { name: '--vhyx-color-text-muted',     desc: 'Separator color' },
              { name: '--vhyx-color-text',           desc: 'Current page text color' },
            ].map((t) => (
              <div key={t.name} className="docs-token-item">
                <span className="docs-token-name">{t.name}</span>
                <span className="docs-token-desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="examples" title="Examples">
          <h3 className="docs-subsection-heading">Documentation site breadcrumb</h3>
          <ComponentExample
            label="Docs navigation with section and page"
            code={`<Breadcrumb>
  <Breadcrumb.Item><Breadcrumb.Link href="/">VhyxUI Docs</Breadcrumb.Link></Breadcrumb.Item>
  <Breadcrumb.Item><Breadcrumb.Link href="/components/button">Components</Breadcrumb.Link></Breadcrumb.Item>
  <Breadcrumb.Item><Breadcrumb.Page>Breadcrumb</Breadcrumb.Page></Breadcrumb.Item>
</Breadcrumb>`}
          >
            <Breadcrumb>
              <Breadcrumb.Item><Breadcrumb.Link href="/">VhyxUI Docs</Breadcrumb.Link></Breadcrumb.Item>
              <Breadcrumb.Item><Breadcrumb.Link href="/components/button">Components</Breadcrumb.Link></Breadcrumb.Item>
              <Breadcrumb.Item><Breadcrumb.Page>Breadcrumb</Breadcrumb.Page></Breadcrumb.Item>
            </Breadcrumb>
          </ComponentExample>

          <h3 className="docs-subsection-heading">E-commerce deep path</h3>
          <ComponentExample
            label="Collapsed middle path with ellipsis"
            code={`<Breadcrumb>
  <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
  <Breadcrumb.Item><Breadcrumb.Ellipsis /></Breadcrumb.Item>
  <Breadcrumb.Item><Breadcrumb.Link href="#">Shoes</Breadcrumb.Link></Breadcrumb.Item>
  <Breadcrumb.Item><Breadcrumb.Page>Running shoes</Breadcrumb.Page></Breadcrumb.Item>
</Breadcrumb>`}
          >
            <Breadcrumb>
              <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
              <Breadcrumb.Item><Breadcrumb.Ellipsis /></Breadcrumb.Item>
              <Breadcrumb.Item><Breadcrumb.Link href="#">Shoes</Breadcrumb.Link></Breadcrumb.Item>
              <Breadcrumb.Item><Breadcrumb.Page>Running shoes</Breadcrumb.Page></Breadcrumb.Item>
            </Breadcrumb>
          </ComponentExample>
        </Section>

        <PageNav
          prev={{ title: 'Tabs', href: '/components/tabs' }}
          next={{ title: 'Pagination', href: '/components/pagination' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
