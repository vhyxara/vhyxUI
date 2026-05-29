'use client';

import React, { useState } from 'react';
import { Drawer, Button } from '@vhyxui/react';
import { drawerContract } from '@vhyxui/core';
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
  { id: 'sides',              text: 'Sides',               level: 2 },
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
  { name: 'open', type: 'boolean', description: 'Controlled open state.' },
  { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the open state changes.' },
  { name: 'side', type: "'left' | 'right' | 'top' | 'bottom'", default: "'right'", description: 'Which edge the drawer slides in from.' },
  { name: 'size', type: "'sm' | 'md' | 'lg' | 'full'", default: "'md'", description: 'Width (left/right) or height (top/bottom) of the panel.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override.' },
];

// ─── Keyboard ──────────────────────────────────────────────────────────────

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Escape'],         action: 'Close the drawer and return focus to the trigger.' },
  { keys: ['Tab'],            action: 'Cycle through focusable elements inside the drawer.' },
  { keys: ['Shift + Tab'],    action: 'Reverse focus cycle within the drawer.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function DrawerPage(): React.ReactElement {
  const [side, setSide] = useState<'left' | 'right' | 'top' | 'bottom'>('right');
  const [open, setOpen] = useState(false);

  return (
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Drawer"
          description="Side panel overlay that slides in from any edge. Uses the same compound API as Dialog. Animation direction follows the side prop. Focus trap and restoration built in."
          tags={['Overlay', 'Compound', 'Focus trap', 'VhyxSeal']}
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="Click a side button to open that drawer"
            code={`<Drawer side="right" open={open} onOpenChange={setOpen}>
  <Drawer.Portal>
    <Drawer.Overlay />
    <Drawer.Content>
      <Drawer.Header>
        <Drawer.Title>Settings panel</Drawer.Title>
      </Drawer.Header>
      <Drawer.Footer>
        <Drawer.Close asChild>
          <Button variant="outline">Close</Button>
        </Drawer.Close>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Portal>
</Drawer>`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-2)', flexWrap: 'wrap' }}>
              {(['right', 'left', 'top', 'bottom'] as const).map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  size="sm"
                  onClick={() => { setSide(s); setOpen(true); }}
                >
                  Open {s}
                </Button>
              ))}
            </div>
            <Drawer open={open} onOpenChange={setOpen} side={side}>
              <Drawer.Portal>
                <Drawer.Overlay />
                <Drawer.Content>
                  <Drawer.Header>
                    <Drawer.Title>Settings panel</Drawer.Title>
                    <Drawer.Description>Adjust your preferences below.</Drawer.Description>
                  </Drawer.Header>
                  <div style={{ padding: 'var(--vhyx-space-6)', flex: 1 }}>
                    <p style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>
                      Drawer content goes here. This panel slides from the {side}.
                    </p>
                  </div>
                  <Drawer.Footer>
                    <Drawer.Close asChild>
                      <Button variant="outline" style={{ width: '100%' }}>Close</Button>
                    </Drawer.Close>
                  </Drawer.Footer>
                </Drawer.Content>
              </Drawer.Portal>
            </Drawer>
          </ComponentExample>
        </Section>

        <Section id="import" title="Import">
          <CodeBlock
            language="tsx"
            code={`import { Drawer } from '@vhyxui/react'

// Same sub-components as Dialog
// Drawer.Trigger, Drawer.Portal, Drawer.Overlay
// Drawer.Content, Drawer.Header, Drawer.Footer
// Drawer.Title, Drawer.Description, Drawer.Close`}
          />
        </Section>

        <Section id="sides" title="Sides">
          <ComponentExample
            label="All four sides"
            code={`<Drawer side="right">…</Drawer>
<Drawer side="left">…</Drawer>
<Drawer side="top">…</Drawer>
<Drawer side="bottom">…</Drawer>`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-2)', flexWrap: 'wrap' }}>
              {(['right', 'left', 'top', 'bottom'] as const).map((s) => (
                <Button key={s} variant="secondary" size="sm" onClick={() => { setSide(s); setOpen(true); }}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>
          </ComponentExample>
        </Section>

        <Section id="sizes" title="Sizes">
          <ComponentExample
            label="sm, md, lg, full — width for side drawers, height for top/bottom"
            code={`<Drawer size="sm">…</Drawer>  {/* 20rem */}
<Drawer size="md">…</Drawer>  {/* 25rem */}
<Drawer size="lg">…</Drawer>  {/* 32rem */}
<Drawer size="full">…</Drawer> {/* 100% */}`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-2)', flexWrap: 'wrap' }}>
              {(['sm', 'md', 'lg'] as const).map((s) => (
                <Button key={s} variant="outline" size="sm" onClick={() => { setOpen(true); setSide('right'); }}>
                  {s.toUpperCase()}
                </Button>
              ))}
            </div>
          </ComponentExample>
        </Section>

        <Section id="props" title="Props">
          <PropsTable props={PROPS} />
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>role="dialog"</code>, <code>aria-modal="true"</code>, <code>aria-labelledby</code> pointing to Drawer.Title.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <strong>Drawer.Title is required</strong> — a development warning is logged if absent.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Focus trap and Escape-to-close — identical behavior to Dialog.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Focus returns to the exact trigger element on close.</li>
          </ul>
        </Section>

        <Section id="keyboard" title="Keyboard navigation">
          <KeyboardTable rows={KEYBOARD} />
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every Drawer.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(drawerContract, null, 2)}
          />
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme Drawer.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-z-modal',           desc: 'Z-index (400)' },
              { name: '--vhyx-color-surface',      desc: 'Panel background' },
              { name: '--vhyx-shadow-2xl',         desc: 'Panel shadow' },
              { name: '--vhyx-duration-slow',      desc: 'Slide animation duration' },
              { name: '--vhyx-easing-decelerate',  desc: 'Entry easing' },
            ].map((t) => (
              <div key={t.name} className="docs-token-item">
                <span className="docs-token-name">{t.name}</span>
                <span className="docs-token-desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="examples" title="Examples">
          <h3 className="docs-subsection-heading">Navigation drawer (left)</h3>
          <ComponentExample
            label="Slide-in nav menu"
            code={`<Drawer side="left" size="sm">
  <Drawer.Trigger asChild>
    <Button variant="outline">Menu</Button>
  </Drawer.Trigger>
  <Drawer.Portal>
    <Drawer.Overlay />
    <Drawer.Content>
      <Drawer.Title>Navigation</Drawer.Title>
      <nav>…links…</nav>
    </Drawer.Content>
  </Drawer.Portal>
</Drawer>`}
          >
            <Button variant="outline" onClick={() => { setSide('left'); setOpen(true); }}>Open navigation</Button>
          </ComponentExample>

          <h3 className="docs-subsection-heading">Mobile filter panel (bottom)</h3>
          <CodeBlock
            language="tsx"
            code={`<Drawer side="bottom" size="lg">
  <Drawer.Trigger asChild>
    <Button>Filters</Button>
  </Drawer.Trigger>
  <Drawer.Portal>
    <Drawer.Overlay />
    <Drawer.Content>
      <Drawer.Header>
        <Drawer.Title>Filter results</Drawer.Title>
      </Drawer.Header>
      {/* filter controls */}
      <Drawer.Footer>
        <Button style={{ width: '100%' }}>Apply filters</Button>
      </Drawer.Footer>
    </Drawer.Content>
  </Drawer.Portal>
</Drawer>`}
          />
        </Section>

        <PageNav
          prev={{ title: 'Dialog', href: '/components/dialog' }}
          next={{ title: 'Tooltip', href: '/components/tooltip' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
