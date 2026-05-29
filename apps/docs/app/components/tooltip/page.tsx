'use client';

import React from 'react';
import { Tooltip, Button, Badge } from '@vhyxui/react';
import { tooltipContract } from '@vhyxui/core';
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
  { id: 'states',             text: 'States',              level: 2 },
  { id: 'props',              text: 'Props',               level: 2 },
  { id: 'accessibility',      text: 'Accessibility',       level: 2 },
  { id: 'keyboard',           text: 'Keyboard',            level: 2 },
  { id: 'agent-contract',     text: 'Agent Contract',      level: 2 },
  { id: 'theming',            text: 'Theming',             level: 2 },
  { id: 'examples',           text: 'Examples',            level: 2 },
] as const;

// ─── Props ─────────────────────────────────────────────────────────────────

const PROPS: PropDef[] = [
  { name: 'content', type: 'React.ReactNode', required: true, description: 'The tooltip content.' },
  { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", default: "'top'", description: 'Which side the tooltip appears on.' },
  { name: 'align', type: "'start' | 'center' | 'end'", default: "'center'", description: 'Alignment along the side axis.' },
  { name: 'delayDuration', type: 'number', default: '400', description: 'Milliseconds before showing on hover.' },
  { name: 'skipDelayDuration', type: 'number', default: '300', description: 'Milliseconds grace period before re-showing after cursor leaves.' },
  { name: 'children', type: 'React.ReactElement', required: true, description: 'The trigger element. Tooltip attaches via cloneElement.' },
];

// ─── Keyboard ──────────────────────────────────────────────────────────────

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Focus'],  action: 'Show tooltip immediately (no delay on keyboard focus).' },
  { keys: ['Blur'],   action: 'Hide tooltip.' },
  { keys: ['Escape'], action: 'Hide tooltip while trigger is focused.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function TooltipPage(): React.ReactElement {
  return (
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Tooltip"
          description="Shows additional context on hover (with configurable delay) and on keyboard focus (no delay). Wraps the trigger via cloneElement — no Trigger sub-component needed."
          tags={['Overlay', 'VhyxSeal']}
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="Hover or focus the button to see the tooltip"
            center
            code={`<Tooltip content="Save your current changes to the database">
  <Button variant="primary">Save changes</Button>
</Tooltip>`}
          >
            <Tooltip content="Save your current changes to the database">
              <Button variant="primary">Save changes</Button>
            </Tooltip>
          </ComponentExample>
        </Section>

        <Section id="import" title="Import">
          <CodeBlock code={`import { Tooltip } from '@vhyxui/react'`} language="tsx" />
        </Section>

        <Section id="sides" title="Sides">
          <ComponentExample
            label="top, right, bottom, left"
            center
            code={`<Tooltip content="Appears on the top" side="top"><Button>Top</Button></Tooltip>
<Tooltip content="Appears on the right" side="right"><Button>Right</Button></Tooltip>
<Tooltip content="Appears on the bottom" side="bottom"><Button>Bottom</Button></Tooltip>
<Tooltip content="Appears on the left" side="left"><Button>Left</Button></Tooltip>`}
          >
            {(['top', 'right', 'bottom', 'left'] as const).map((s) => (
              <Tooltip key={s} content={`Appears on the ${s}`} side={s}>
                <Button variant="outline" size="sm">{s}</Button>
              </Tooltip>
            ))}
          </ComponentExample>
        </Section>

        <Section id="states" title="States">
          <ComponentExample
            label="Icon-only button — tooltip provides the accessible name"
            center
            code={`<Tooltip content="Delete this item permanently">
  <Button iconOnly icon={<span>✕</span>} aria-label="Delete item" variant="ghost" />
</Tooltip>`}
          >
            <Tooltip content="Delete this item permanently">
              <Button iconOnly icon={<span aria-hidden="true">✕</span>} aria-label="Delete item" variant="ghost" />
            </Tooltip>
            <Tooltip content="Add to favourites">
              <Button iconOnly icon={<span aria-hidden="true">★</span>} aria-label="Favourite" variant="ghost" />
            </Tooltip>
          </ComponentExample>
          <ComponentExample
            label="Tooltip on Badge"
            center
            code={`<Tooltip content="99 unread messages in inbox">
  <Badge count={99} variant="danger" />
</Tooltip>`}
          >
            <Tooltip content="99 unread messages in inbox">
              <Badge count={99} variant="danger" />
            </Tooltip>
          </ComponentExample>
        </Section>

        <Section id="props" title="Props">
          <PropsTable props={PROPS} />
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>role="tooltip"</code> on the tooltip element.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Trigger receives <code>aria-describedby</code> pointing to the tooltip when visible.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Shows on keyboard focus without delay — keyboard users are not penalized.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Rendered in a portal — not clipped by overflow containers.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Use <code>aria-label</code> on the trigger for interactive meaning; tooltip provides supplemental description only.</li>
          </ul>
        </Section>

        <Section id="keyboard" title="Keyboard navigation">
          <KeyboardTable rows={KEYBOARD} />
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every Tooltip.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(tooltipContract, null, 2)}
          />
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme Tooltip.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-z-tooltip',         desc: 'Z-index (550)' },
              { name: '--vhyx-color-bg-inverse',   desc: 'Tooltip background' },
              { name: '--vhyx-color-text-inverse',  desc: 'Tooltip text color' },
              { name: '--vhyx-radius-sm',          desc: 'Border radius' },
              { name: '--vhyx-duration-fast',      desc: 'Fade-in duration' },
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
          <h3 className="docs-subsection-heading">Keyboard shortcut hint</h3>
          <ComponentExample
            label="Shortcut shown in tooltip"
            center
            code={`<Tooltip content="⌘K — Open command palette">
  <Button variant="outline">Search</Button>
</Tooltip>`}
          >
            <Tooltip content="⌘K — Open command palette">
              <Button variant="outline">Search</Button>
            </Tooltip>
          </ComponentExample>

          <h3 className="docs-subsection-heading">Custom delay</h3>
          <ComponentExample
            label="Instant tooltip on hover (no delay)"
            center
            code={`<Tooltip content="No delay — shows instantly" delayDuration={0}>
  <Button variant="ghost" size="sm">Instant</Button>
</Tooltip>`}
          >
            <Tooltip content="No delay — shows instantly" delayDuration={0}>
              <Button variant="ghost" size="sm">Instant tooltip</Button>
            </Tooltip>
          </ComponentExample>
        </Section>

        <PageNav
          prev={{ title: 'Drawer', href: '/components/drawer' }}
          next={{ title: 'Popover', href: '/components/popover' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
