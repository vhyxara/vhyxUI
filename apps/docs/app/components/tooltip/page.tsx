'use client';

import React from 'react';
import { Tooltip, Button, Badge, Separator } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlock';
import { PropsTable } from '../../../components/PropsTable';
import { KeyboardTable } from '../../../components/KeyboardTable';
import type { PropDef } from '../../../components/PropsTable';
import type { KeyboardRow } from '../../../components/KeyboardTable';

const PROPS: PropDef[] = [
  { name: 'content', type: 'React.ReactNode', required: true, description: 'The tooltip content.' },
  { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'top'", description: 'Which side the tooltip appears on.' },
  { name: 'align', type: "'start' | 'center' | 'end'", default: "'center'", description: 'Alignment along the side axis.' },
  { name: 'delayDuration', type: 'number', default: '400', description: 'Milliseconds before showing on hover.' },
  { name: 'skipDelayDuration', type: 'number', default: '300', description: 'Milliseconds before hiding on mouse leave.' },
  { name: 'children', type: 'React.ReactElement', required: true, description: 'The trigger element. Tooltip wraps this via cloneElement.' },
];

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Focus'], action: 'Show tooltip immediately (no delay).' },
  { keys: ['Blur'], action: 'Hide tooltip.' },
  { keys: ['Escape'], action: 'Hide tooltip.' },
];

export default function TooltipPage(): React.ReactElement {
  return (
    <>
      <PageHeader name="Tooltip" description="Shows on hover (with delay) and focus (no delay). Wraps trigger via cloneElement — no Trigger sub-component needed. Fade-in animation." tags={['Overlay', 'VhyxSeal']} />

      <Section title="Interactive example">
        <ComponentExample label="Hover or focus to see tooltip" center code={`<Tooltip content="Save your changes">\n  <Button>Save</Button>\n</Tooltip>`}>
          <Tooltip content="Save your current changes to the database">
            <Button variant="primary">Save changes</Button>
          </Tooltip>
        </ComponentExample>
      </Section>

      <Section title="Import"><CodeBlock code={`import { Tooltip } from '@vhyxui/react'`} /></Section>

      <Section title="Sides">
        <ComponentExample label="top, right, bottom, left" center code={`<Tooltip content="Top" side="top"><Button>Top</Button></Tooltip>`}>
          {(['top', 'right', 'bottom', 'left'] as const).map((s) => (
            <Tooltip key={s} content={`Appears on the ${s}`} side={s}>
              <Button variant="outline" size="sm">{s}</Button>
            </Tooltip>
          ))}
        </ComponentExample>
      </Section>

      <Section title="States">
        <ComponentExample label="Icon-only button (tooltip provides accessible name)" center code={`<Tooltip content="Delete item">\n  <Button iconOnly icon={<span>✕</span>} aria-label="Delete item" />\n</Tooltip>`}>
          <Tooltip content="Delete this item permanently">
            <Button iconOnly icon={<span aria-hidden="true">✕</span>} aria-label="Delete item" variant="ghost" />
          </Tooltip>
          <Tooltip content="Favourite this page">
            <Button iconOnly icon={<span aria-hidden="true">★</span>} aria-label="Favourite" variant="ghost" />
          </Tooltip>
        </ComponentExample>
        <ComponentExample label="Tooltip on Badge" center code={`<Tooltip content="99 unread messages">\n  <Badge count={99} />\n</Tooltip>`}>
          <Tooltip content="99 unread messages in inbox">
            <Badge count={99} variant="danger" />
          </Tooltip>
        </ComponentExample>
      </Section>

      <Section title="Props"><PropsTable props={PROPS} /></Section>

      <Section title="Accessibility">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>role="tooltip"</code> on the tooltip element.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Trigger receives <code>aria-describedby</code> pointing to tooltip when visible.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Shows on focus without delay — keyboard users are not penalized.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Portal rendered — not clipped by overflow containers.</li>
        </ul>
      </Section>

      <Section title="Keyboard navigation"><KeyboardTable rows={KEYBOARD} /></Section>

      <Section title="Agent contract">
        <div className="docs-contract">
          {[{ key: 'type', value: '"display"' }, { key: 'intent', value: '"show-tooltip"' }, { key: 'safetyLevel', value: '"low"' }].map((r) => (
            <div key={r.key} className="docs-contract-row"><span className="docs-contract-key">{r.key}</span><span className="docs-contract-value">{r.value}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Theming">
        <div className="docs-tokens-grid">
          {[{ name: '--vhyx-z-tooltip', desc: 'Z-index (550)' }, { name: '--vhyx-color-bg-inverse', desc: 'Tooltip background' }, { name: '--vhyx-duration-fast', desc: 'Fade-in duration' }, { name: '--vhyx-easing-decelerate', desc: 'Entry easing' }].map((t) => (
            <div key={t.name} className="docs-token-item"><span className="docs-token-name">{t.name}</span><span className="docs-token-desc">{t.desc}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Examples">
        <ComponentExample label="Keyboard shortcut tooltip" center code={`<Tooltip content="⌘K — Open command palette">\n  <Button variant="outline">Search</Button>\n</Tooltip>`}>
          <Tooltip content="⌘K — Open command palette">
            <Button variant="outline">Search</Button>
          </Tooltip>
        </ComponentExample>
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <a href="/components/popover" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>← Popover</a>
        <a href="/components/card" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>Card →</a>
      </div>
    </>
  );
}
