'use client';

import React from 'react';
import { Popover, Button } from '@vhyxui/react';
import { popoverContract } from '@vhyxui/core';
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
  { name: 'open', type: 'boolean', description: 'Controlled open state.' },
  { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Default open state for uncontrolled usage.' },
  { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the open state changes.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override.' },
];

// ─── Keyboard ──────────────────────────────────────────────────────────────

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Enter', 'Space'], action: 'Toggle the popover open/close.' },
  { keys: ['Escape'],         action: 'Close the popover and return focus to the trigger.' },
  { keys: ['Tab'],            action: 'Move focus through popover content (focus NOT trapped).' },
  { keys: ['Shift + Tab'],    action: 'Move focus backwards through popover content.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function PopoverPage(): React.ReactElement {
  return (
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Popover"
          description="Non-modal overlay for rich contextual content. Focus is NOT trapped — unlike Dialog. Escape and click-outside close it. Use for forms, menus, and content panels anchored to a trigger."
          tags={['Overlay', 'Compound', 'VhyxSeal']}
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="Filter options popover"
            center
            code={`<Popover>
  <Popover.Trigger asChild>
    <Button variant="outline">Filter options</Button>
  </Popover.Trigger>
  <Popover.Content style={{ width: '16rem' }}>
    <p>Filter by status</p>
    <Popover.Close asChild>
      <Button variant="outline" size="sm">Apply filters</Button>
    </Popover.Close>
  </Popover.Content>
</Popover>`}
          >
            <Popover>
              <Popover.Trigger asChild>
                <Button variant="outline">Filter options</Button>
              </Popover.Trigger>
              <Popover.Content style={{ width: '16rem' }}>
                <p style={{ fontWeight: 'var(--vhyx-weight-semibold)', marginBottom: 'var(--vhyx-space-2)', fontSize: 'var(--vhyx-text-sm)' }}>Filter by status</p>
                <p style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)', marginBottom: 'var(--vhyx-space-3)' }}>
                  Choose which items to show in the list.
                </p>
                <Popover.Close asChild>
                  <Button variant="outline" size="sm" style={{ width: '100%' }}>Apply filters</Button>
                </Popover.Close>
              </Popover.Content>
            </Popover>
          </ComponentExample>
        </Section>

        <Section id="import" title="Import">
          <CodeBlock
            language="tsx"
            code={`import { Popover } from '@vhyxui/react'

// Sub-components
// Popover.Trigger — the element that toggles the popover
// Popover.Content — the floating panel
// Popover.Arrow   — decorative arrow pointing to trigger
// Popover.Close   — button to close`}
          />
        </Section>

        <Section id="variants" title="Variants">
          <ComponentExample
            label="With decorative arrow"
            center
            code={`<Popover>
  <Popover.Trigger asChild>
    <Button variant="secondary" size="sm">With arrow</Button>
  </Popover.Trigger>
  <Popover.Content>
    <Popover.Arrow />
    <p>Popover with decorative arrow.</p>
  </Popover.Content>
</Popover>`}
          >
            <Popover>
              <Popover.Trigger asChild>
                <Button variant="secondary" size="sm">With arrow</Button>
              </Popover.Trigger>
              <Popover.Content>
                <Popover.Arrow />
                <p style={{ fontSize: 'var(--vhyx-text-sm)' }}>Popover with decorative arrow.</p>
              </Popover.Content>
            </Popover>
          </ComponentExample>
        </Section>

        <Section id="props" title="Props">
          <PropsTable props={PROPS} />
          <p className="docs-section-text">
            <code>Popover.Trigger</code> accepts <code>asChild</code>. <code>Popover.Content</code> accepts standard <code>HTMLDivElement</code> attributes.
          </p>
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Content has <code>role="dialog"</code>, <code>aria-modal="false"</code> — non-modal per ARIA spec.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Trigger has <code>aria-haspopup="dialog"</code>, <code>aria-expanded</code>, <code>aria-controls</code>.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Focus is NOT trapped — use Dialog for scenarios requiring a focus trap.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Escape closes and returns focus to trigger. Click outside closes.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Rendered in a portal — not clipped by overflow containers.</li>
          </ul>
        </Section>

        <Section id="keyboard" title="Keyboard navigation">
          <KeyboardTable rows={KEYBOARD} />
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every Popover.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(popoverContract, null, 2)}
          />
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme Popover.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-z-popover',          desc: 'Z-index (450)' },
              { name: '--vhyx-color-surface-raised', desc: 'Panel background' },
              { name: '--vhyx-shadow-lg',           desc: 'Panel shadow' },
              { name: '--vhyx-radius-lg',           desc: 'Panel border radius' },
              { name: '--vhyx-duration-normal',     desc: 'Scale-in animation duration' },
              { name: '--vhyx-easing-spring',       desc: 'Entry easing' },
            ].map((t) => (
              <div key={t.name} className="docs-token-item">
                <span className="docs-token-name">{t.name}</span>
                <span className="docs-token-desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="examples" title="Examples">
          <h3 className="docs-subsection-heading">Color picker</h3>
          <ComponentExample
            label="Color swatch grid in a popover"
            center
            code={`<Popover>
  <Popover.Trigger asChild>
    <Button variant="outline">Pick color</Button>
  </Popover.Trigger>
  <Popover.Content>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
      {colors.map(c => <div key={c} style={{ width: '2rem', height: '2rem', background: c }} />)}
    </div>
  </Popover.Content>
</Popover>`}
          >
            <Popover>
              <Popover.Trigger asChild>
                <Button variant="outline">Pick color</Button>
              </Popover.Trigger>
              <Popover.Content>
                <p style={{ fontSize: 'var(--vhyx-text-xs)', fontWeight: 'var(--vhyx-weight-semibold)', marginBottom: 'var(--vhyx-space-2)' }}>Theme color</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--vhyx-space-2)' }}>
                  {['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#64748b'].map((c) => (
                    <div key={c} style={{ width: '2rem', height: '2rem', borderRadius: 'var(--vhyx-radius-sm)', backgroundColor: c, cursor: 'pointer' }} />
                  ))}
                </div>
              </Popover.Content>
            </Popover>
          </ComponentExample>

          <h3 className="docs-subsection-heading">Controlled popover</h3>
          <CodeBlock
            language="tsx"
            code={`const [open, setOpen] = useState(false)

<Popover open={open} onOpenChange={setOpen}>
  <Popover.Trigger asChild>
    <Button>Open</Button>
  </Popover.Trigger>
  <Popover.Content>
    Content here
    <Popover.Close asChild>
      <Button size="sm">Close</Button>
    </Popover.Close>
  </Popover.Content>
</Popover>`}
          />
        </Section>

        <PageNav
          prev={{ title: 'Tooltip', href: '/components/tooltip' }}
          next={{ title: 'Card', href: '/components/card' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
