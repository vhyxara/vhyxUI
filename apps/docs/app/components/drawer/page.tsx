'use client';

import React, { useState } from 'react';
import { Drawer, Button, Separator } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlockSimple';
import { PropsTable } from '../../../components/PropsTable';
import { KeyboardTable } from '../../../components/KeyboardTable';
import type { PropDef } from '../../../components/PropsTable';
import type { KeyboardRow } from '../../../components/KeyboardTable';

const PROPS: PropDef[] = [
  { name: 'open', type: 'boolean', description: 'Controlled open state.' },
  { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when open state changes.' },
  { name: 'side', type: "'left' | 'right' | 'top' | 'bottom'", default: "'right'", description: 'Which edge the drawer slides from.' },
  { name: 'size', type: "'sm' | 'md' | 'lg' | 'full'", default: "'md'", description: 'Width/height of the drawer panel.' },
];

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Escape'], action: 'Close the drawer.' },
  { keys: ['Tab', 'Shift + Tab'], action: 'Cycle through focusable elements inside.' },
];

export default function DrawerPage(): React.ReactElement {
  const [side, setSide] = useState<'left' | 'right' | 'top' | 'bottom'>('right');
  const [open, setOpen] = useState(false);

  return (
    <>
      <PageHeader name="Drawer" description="Side panel overlay. Same compound API as Dialog with slide-in animation direction matching the side prop. Focus trap and restoration built in." tags={['Overlay', 'Compound', 'Focus trap', 'VhyxSeal']} />

      <Section title="Interactive example">
        <ComponentExample label="Click a side to open" code={`<Drawer side="right">\n  <Drawer.Trigger asChild><Button>Open drawer</Button></Drawer.Trigger>\n  ...\n</Drawer>`}>
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

      <Section title="Import">
        <CodeBlock code={`import { Drawer } from '@vhyxui/react'

// Same sub-components as Dialog
Drawer.Trigger, Drawer.Portal, Drawer.Overlay
Drawer.Content, Drawer.Header, Drawer.Footer
Drawer.Title, Drawer.Description, Drawer.Close`} />
      </Section>

      <Section title="Sizes">
        <ComponentExample label="sm (20rem), md (25rem), lg (32rem), full (100%)" code={`<Drawer size="sm">...</Drawer>`}>
          <div style={{ display: 'flex', gap: 'var(--vhyx-space-2)', flexWrap: 'wrap' }}>
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <Button key={s} variant="outline" size="sm" onClick={() => { setOpen(true); setSide('right'); }}>
                {s.toUpperCase()}
              </Button>
            ))}
          </div>
        </ComponentExample>
      </Section>

      <Section title="Props"><PropsTable props={PROPS} /></Section>

      <Section title="Accessibility">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>role="dialog"</code>, <code>aria-modal="true"</code>, <code>aria-labelledby</code> on Drawer.Title.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Focus trap and Escape-to-close — identical behavior to Dialog.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Focus returns to trigger element on close.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Drawer.Title is required — development warning if absent.</li>
        </ul>
      </Section>

      <Section title="Keyboard navigation"><KeyboardTable rows={KEYBOARD} /></Section>

      <Section title="Agent contract">
        <div className="docs-contract">
          {[{ key: 'type', value: '"overlay"' }, { key: 'intent', value: '"show-side-panel"' }, { key: 'safetyLevel', value: '"low"' }].map((r) => (
            <div key={r.key} className="docs-contract-row"><span className="docs-contract-key">{r.key}</span><span className="docs-contract-value">{r.value}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Theming">
        <div className="docs-tokens-grid">
          {[{ name: '--vhyx-drawer-sm/md/lg', desc: 'Panel dimensions' }, { name: '--vhyx-z-modal', desc: 'Z-index (400)' }, { name: '--vhyx-duration-slow', desc: 'Slide animation' }, { name: '--vhyx-easing-decelerate', desc: 'Slide easing' }].map((t) => (
            <div key={t.name} className="docs-token-item"><span className="docs-token-name">{t.name}</span><span className="docs-token-desc">{t.desc}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Examples">
        <ComponentExample label="Navigation drawer" code={`<Drawer side="left" size="sm">\n  <Drawer.Trigger asChild><Button>Menu</Button></Drawer.Trigger>\n  ...\n</Drawer>`}>
          <Button variant="outline" onClick={() => { setSide('left'); setOpen(true); }}>Open navigation</Button>
        </ComponentExample>
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <a href="/components/dialog" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>← Dialog</a>
        <a href="/components/tabs" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>Tabs →</a>
      </div>
    </>
  );
}
