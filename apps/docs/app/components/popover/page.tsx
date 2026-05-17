'use client';

import React from 'react';
import { Popover, Button, Separator } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlock';
import { PropsTable } from '../../../components/PropsTable';
import { KeyboardTable } from '../../../components/KeyboardTable';
import type { PropDef } from '../../../components/PropsTable';
import type { KeyboardRow } from '../../../components/KeyboardTable';

const PROPS: PropDef[] = [
  { name: 'open', type: 'boolean', description: 'Controlled open state.' },
  { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Default open state (uncontrolled).' },
  { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when open state changes.' },
];

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Enter', 'Space'], action: 'Toggle popover open/close.' },
  { keys: ['Escape'], action: 'Close the popover.' },
  { keys: ['Tab'], action: 'Move focus through popover content (focus NOT trapped).' },
];

export default function PopoverPage(): React.ReactElement {
  return (
    <>
      <PageHeader name="Popover" description="Non-modal overlay for rich content. Focus is NOT trapped (unlike Dialog). Escape and click-outside close it. Scale-in animation." tags={['Overlay', 'Compound', 'VhyxSeal']} />

      <Section title="Interactive example">
        <ComponentExample label="Info popover" center code={`<Popover>\n  <Popover.Trigger asChild><Button>Filter</Button></Popover.Trigger>\n  <Popover.Content>\n    Content here\n    <Popover.Close>Close</Popover.Close>\n  </Popover.Content>\n</Popover>`}>
          <Popover>
            <Popover.Trigger asChild>
              <Button variant="outline">Filter options</Button>
            </Popover.Trigger>
            <Popover.Content style={{ width: '16rem' }}>
              <p style={{ fontWeight: 'var(--vhyx-weight-semibold)', marginBottom: 'var(--vhyx-space-2)', fontSize: 'var(--vhyx-text-sm)' }}>Filter by status</p>
              <p style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)', marginBottom: 'var(--vhyx-space-3)' }}>
                Choose which items to show in the list below.
              </p>
              <Popover.Close asChild>
                <Button variant="outline" size="sm" style={{ width: '100%' }}>Apply filters</Button>
              </Popover.Close>
            </Popover.Content>
          </Popover>
        </ComponentExample>
      </Section>

      <Section title="Import">
        <CodeBlock code={`import { Popover } from '@vhyxui/react'

Popover.Trigger, Popover.Content, Popover.Arrow, Popover.Close`} />
      </Section>

      <Section title="Variants">
        <ComponentExample label="With arrow" center code={`<Popover>\n  <Popover.Trigger>...</Popover.Trigger>\n  <Popover.Content>\n    <Popover.Arrow />\n    Content\n  </Popover.Content>\n</Popover>`}>
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

      <Section title="Props"><PropsTable props={PROPS} /></Section>

      <Section title="Accessibility">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Content has <code>role="dialog"</code>, <code>aria-modal="false"</code> — non-modal per spec.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Trigger has <code>aria-haspopup="dialog"</code>, <code>aria-expanded</code>, <code>aria-controls</code>.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Focus is NOT trapped — use Dialog for modal scenarios requiring focus trap.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Escape closes. Click outside closes.</li>
        </ul>
      </Section>

      <Section title="Keyboard navigation"><KeyboardTable rows={KEYBOARD} /></Section>

      <Section title="Agent contract">
        <div className="docs-contract">
          {[{ key: 'type', value: '"overlay"' }, { key: 'intent', value: '"show-contextual-overlay"' }, { key: 'safetyLevel', value: '"low"' }].map((r) => (
            <div key={r.key} className="docs-contract-row"><span className="docs-contract-key">{r.key}</span><span className="docs-contract-value">{r.value}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Theming">
        <div className="docs-tokens-grid">
          {[{ name: '--vhyx-z-popover', desc: 'Z-index (450)' }, { name: '--vhyx-shadow-lg', desc: 'Content shadow' }, { name: '--vhyx-duration-normal', desc: 'Scale-in animation' }, { name: '--vhyx-easing-spring', desc: 'Entry easing' }].map((t) => (
            <div key={t.name} className="docs-token-item"><span className="docs-token-name">{t.name}</span><span className="docs-token-desc">{t.desc}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Examples">
        <ComponentExample label="Color picker" center code={`<Popover>\n  <Popover.Trigger asChild><Button>Pick color</Button></Popover.Trigger>\n  <Popover.Content>Color swatches here</Popover.Content>\n</Popover>`}>
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
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <a href="/components/tabs" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>← Tabs</a>
        <a href="/components/tooltip" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>Tooltip →</a>
      </div>
    </>
  );
}
