'use client';

import React, { useState } from 'react';
import { Tabs } from '@vhyxui/react';
import { tabsContract } from '@vhyxui/core';
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
  { id: 'sizes',              text: 'Sizes',               level: 2 },
  { id: 'props',              text: 'Props',               level: 2 },
  { id: 'accessibility',      text: 'Accessibility',       level: 2 },
  { id: 'keyboard',           text: 'Keyboard',            level: 2 },
  { id: 'agent-contract',     text: 'Agent Contract',      level: 2 },
  { id: 'theming',            text: 'Theming',             level: 2 },
  { id: 'examples',           text: 'Examples',            level: 2 },
] as const;

// ─── Props ─────────────────────────────────────────────────────────────────

const PROPS: PropDef[] = [
  { name: 'value', type: 'string', description: 'Controlled active tab value.' },
  { name: 'defaultValue', type: 'string', description: 'Default active tab for uncontrolled usage.' },
  { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the active tab changes.' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction of the tab list.' },
  { name: 'variant', type: "'default' | 'pills' | 'underline' | 'enclosed'", default: "'default'", description: 'Visual style of the tab triggers.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the tab trigger buttons.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override.' },
];

// ─── Keyboard ──────────────────────────────────────────────────────────────

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Arrow Right', 'Arrow Down'], action: 'Move to the next tab trigger (wraps around).' },
  { keys: ['Arrow Left', 'Arrow Up'],    action: 'Move to the previous tab trigger (wraps around).' },
  { keys: ['Home'],                      action: 'Jump to the first tab.' },
  { keys: ['End'],                       action: 'Jump to the last tab.' },
  { keys: ['Tab'],                       action: 'Move focus out of the tab list into the panel content.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function TabsPage(): React.ReactElement {
  const [tab, setTab] = useState('overview');

  return (
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Tabs"
          description="Four visual variants with a sliding active indicator via CSS transform — zero layout recalculation. Full ARIA tablist pattern with arrow key navigation between triggers."
          tags={['Navigation', 'Compound', 'VhyxSeal']}
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="Dashboard tabs"
            code={`<Tabs value={tab} onValueChange={setTab}>
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
    <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="overview">Overview content</Tabs.Content>
  <Tabs.Content value="analytics">Analytics content</Tabs.Content>
  <Tabs.Content value="reports">Reports content</Tabs.Content>
  <Tabs.Content value="settings">Settings content</Tabs.Content>
</Tabs>`}
          >
            <Tabs value={tab} onValueChange={setTab} style={{ width: '28rem' }}>
              <Tabs.List>
                <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
                <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
                <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="overview">
                <div style={{ padding: 'var(--vhyx-space-4)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Overview — project summary and key metrics.</div>
              </Tabs.Content>
              <Tabs.Content value="analytics">
                <div style={{ padding: 'var(--vhyx-space-4)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Analytics — charts and trends.</div>
              </Tabs.Content>
              <Tabs.Content value="reports">
                <div style={{ padding: 'var(--vhyx-space-4)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Reports — exported data and logs.</div>
              </Tabs.Content>
              <Tabs.Content value="settings">
                <div style={{ padding: 'var(--vhyx-space-4)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Settings — project configuration.</div>
              </Tabs.Content>
            </Tabs>
          </ComponentExample>
        </Section>

        <Section id="import" title="Import">
          <CodeBlock
            language="tsx"
            code={`import { Tabs } from '@vhyxui/react'

// Sub-components
// Tabs.List    — contains the tab triggers
// Tabs.Trigger — individual tab button
// Tabs.Content — panel shown when its tab is active`}
          />
        </Section>

        <Section id="variants" title="Variants">
          {(['default', 'pills', 'underline', 'enclosed'] as const).map((variant) => (
            <ComponentExample key={variant} label={`variant="${variant}"`} code={`<Tabs variant="${variant}">…</Tabs>`}>
              <Tabs defaultValue="one" variant={variant} style={{ width: '22rem' }}>
                <Tabs.List>
                  <Tabs.Trigger value="one">First</Tabs.Trigger>
                  <Tabs.Trigger value="two">Second</Tabs.Trigger>
                  <Tabs.Trigger value="three">Third</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="one"><div style={{ padding: 'var(--vhyx-space-3)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Content for First tab</div></Tabs.Content>
                <Tabs.Content value="two"><div style={{ padding: 'var(--vhyx-space-3)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Content for Second tab</div></Tabs.Content>
                <Tabs.Content value="three"><div style={{ padding: 'var(--vhyx-space-3)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Content for Third tab</div></Tabs.Content>
              </Tabs>
            </ComponentExample>
          ))}
        </Section>

        <Section id="sizes" title="Sizes">
          <ComponentExample
            label="sm, md, lg"
            code={`<Tabs size="sm" defaultValue="a">…</Tabs>
<Tabs size="md" defaultValue="a">…</Tabs>
<Tabs size="lg" defaultValue="a">…</Tabs>`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-4)' }}>
              {(['sm', 'md', 'lg'] as const).map((s) => (
                <Tabs key={s} defaultValue="a" size={s} style={{ width: '16rem' }}>
                  <Tabs.List>
                    <Tabs.Trigger value="a">Tab A</Tabs.Trigger>
                    <Tabs.Trigger value="b">Tab B</Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content value="a"><div style={{ padding: 'var(--vhyx-space-2)', fontSize: 'var(--vhyx-text-xs)' }}>Content A</div></Tabs.Content>
                  <Tabs.Content value="b"><div style={{ padding: 'var(--vhyx-space-2)', fontSize: 'var(--vhyx-text-xs)' }}>Content B</div></Tabs.Content>
                </Tabs>
              ))}
            </div>
          </ComponentExample>
        </Section>

        <Section id="props" title="Props">
          <PropsTable props={PROPS} />
          <p className="docs-section-text">
            <code>Tabs.Trigger</code> accepts <code>value: string</code> (required) and <code>disabled?: boolean</code>.
            <code>Tabs.Content</code> accepts <code>value: string</code> (required).
          </p>
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>role="tablist"</code> on List, <code>role="tab"</code> on Trigger, <code>role="tabpanel"</code> on Content.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>aria-selected</code> on the active trigger. <code>aria-controls</code> links each trigger to its panel.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Arrow keys navigate between triggers. Tab moves focus into the panel content.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Sliding indicator uses CSS <code>transform</code> — no layout recalculation or reflow.</li>
          </ul>
        </Section>

        <Section id="keyboard" title="Keyboard navigation">
          <KeyboardTable rows={KEYBOARD} />
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every Tabs.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(tabsContract, null, 2)}
          />
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme Tabs.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-color-accent',       desc: 'Active indicator / active trigger color' },
              { name: '--vhyx-color-accent-subtle', desc: 'Pills active background' },
              { name: '--vhyx-color-border',        desc: 'Default variant bottom border' },
              { name: '--vhyx-radius-md',           desc: 'Pills and enclosed border radius' },
              { name: '--vhyx-duration-normal',     desc: 'Indicator slide duration' },
              { name: '--vhyx-easing-spring',       desc: 'Indicator slide easing' },
            ].map((t) => (
              <div key={t.name} className="docs-token-item">
                <span className="docs-token-name">{t.name}</span>
                <span className="docs-token-desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="examples" title="Examples">
          <h3 className="docs-subsection-heading">Code editor tabs (enclosed)</h3>
          <ComponentExample
            label="File tabs with enclosed variant"
            code={`<Tabs defaultValue="tsx" variant="enclosed">
  <Tabs.List>
    <Tabs.Trigger value="tsx">Button.tsx</Tabs.Trigger>
    <Tabs.Trigger value="css">Button.module.css</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tsx">…</Tabs.Content>
  <Tabs.Content value="css">…</Tabs.Content>
</Tabs>`}
          >
            <Tabs defaultValue="tsx" variant="enclosed" style={{ width: '26rem' }}>
              <Tabs.List>
                <Tabs.Trigger value="tsx">Button.tsx</Tabs.Trigger>
                <Tabs.Trigger value="css">Button.module.css</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="tsx">
                <div style={{ padding: 'var(--vhyx-space-3)', fontFamily: 'var(--vhyx-font-mono)', fontSize: 'var(--vhyx-text-xs)', color: 'var(--vhyx-color-text-subtle)' }}>
                  {'<Button variant="primary">…</Button>'}
                </div>
              </Tabs.Content>
              <Tabs.Content value="css">
                <div style={{ padding: 'var(--vhyx-space-3)', fontFamily: 'var(--vhyx-font-mono)', fontSize: 'var(--vhyx-text-xs)', color: 'var(--vhyx-color-text-subtle)' }}>
                  {'.button { display: flex; align-items: center; … }'}
                </div>
              </Tabs.Content>
            </Tabs>
          </ComponentExample>

          <h3 className="docs-subsection-heading">Profile page navigation (underline)</h3>
          <ComponentExample
            label="Content sections as tabs"
            code={`<Tabs defaultValue="posts" variant="underline">
  <Tabs.List>
    <Tabs.Trigger value="posts">Posts</Tabs.Trigger>
    <Tabs.Trigger value="replies">Replies</Tabs.Trigger>
    <Tabs.Trigger value="likes">Likes</Tabs.Trigger>
  </Tabs.List>
  …
</Tabs>`}
          >
            <Tabs defaultValue="posts" variant="underline" style={{ width: '22rem' }}>
              <Tabs.List>
                <Tabs.Trigger value="posts">Posts</Tabs.Trigger>
                <Tabs.Trigger value="replies">Replies</Tabs.Trigger>
                <Tabs.Trigger value="likes">Likes</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="posts"><div style={{ padding: 'var(--vhyx-space-4)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>24 posts</div></Tabs.Content>
              <Tabs.Content value="replies"><div style={{ padding: 'var(--vhyx-space-4)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>142 replies</div></Tabs.Content>
              <Tabs.Content value="likes"><div style={{ padding: 'var(--vhyx-space-4)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>891 likes</div></Tabs.Content>
            </Tabs>
          </ComponentExample>
        </Section>

        <PageNav
          prev={{ title: 'Separator', href: '/components/separator' }}
          next={{ title: 'Breadcrumb', href: '/components/breadcrumb' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
