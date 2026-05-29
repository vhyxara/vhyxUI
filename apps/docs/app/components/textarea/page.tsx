'use client';

import React, { useState } from 'react';
import { Textarea } from '@vhyxui/react';
import { textareaContract } from '@vhyxui/core';
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
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the textarea.' },
  { name: 'resize', type: "'none' | 'vertical' | 'horizontal' | 'both' | 'auto'", default: "'vertical'", description: 'Resize behavior. auto grows with content up to maxRows.' },
  { name: 'minRows', type: 'number', default: '3', description: 'Minimum number of visible rows.' },
  { name: 'maxRows', type: 'number', description: 'Maximum rows before scroll activates (only when resize="auto").' },
  { name: 'showCount', type: 'boolean', default: 'false', description: 'Shows live character count. Pair with maxLength.' },
  { name: 'error', type: 'boolean', default: 'false', description: 'Applies error styling and sets aria-invalid.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override.' },
  { name: 'className', type: 'string', description: 'Additional CSS classes appended to the textarea wrapper.' },
];

// ─── Keyboard ──────────────────────────────────────────────────────────────

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Tab'],           action: 'Move focus in/out of the textarea.' },
  { keys: ['Shift + Tab'],   action: 'Move focus to the previous focusable element.' },
  { keys: ['Enter'],         action: 'Insert a new line (standard browser behavior).' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function TextareaPage(): React.ReactElement {
  const [value, setValue] = useState('');

  return (
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Textarea"
          description="Multi-line text input with auto-resize, character count, and error state. Pairs with Field for full label and error wiring."
          tags={['Form element', 'Interactive', 'VhyxSeal']}
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="Auto-resize textarea with character counter"
            code={`<Textarea
  resize="auto"
  showCount
  maxLength={200}
  placeholder="Write something…"
/>`}
          >
            <Textarea
              resize="auto"
              value={value}
              onChange={(e) => { setValue(e.target.value); }}
              placeholder="Write something…"
              showCount
              maxLength={200}
              style={{ width: '28rem' }}
            />
          </ComponentExample>
        </Section>

        <Section id="import" title="Import">
          <CodeBlock code={`import { Textarea } from '@vhyxui/react'`} language="tsx" />
        </Section>

        <Section id="variants" title="Variants">
          <ComponentExample label="Default" code={`<Textarea placeholder="Default textarea" />`}>
            <Textarea placeholder="Default textarea" style={{ width: '22rem' }} />
          </ComponentExample>
          <ComponentExample
            label="Character count"
            code={`<Textarea showCount maxLength={280} placeholder="Tweet something…" />`}
          >
            <Textarea showCount maxLength={280} placeholder="Tweet something…" style={{ width: '22rem' }} />
          </ComponentExample>
          <ComponentExample label="Error state" code={`<Textarea error placeholder="Required field" />`}>
            <Textarea error placeholder="This field is required" style={{ width: '22rem' }} />
          </ComponentExample>
          <ComponentExample label="Non-resizable" code={`<Textarea resize="none" placeholder="Fixed size" />`}>
            <Textarea resize="none" placeholder="Fixed size" style={{ width: '22rem' }} />
          </ComponentExample>
        </Section>

        <Section id="sizes" title="Sizes">
          <ComponentExample
            label="sm, md, lg"
            code={`<Textarea size="sm" placeholder="Small" />
<Textarea size="md" placeholder="Medium" />
<Textarea size="lg" placeholder="Large" />`}
          >
            <Textarea size="sm" placeholder="Small" style={{ width: '18rem' }} minRows={2} />
            <Textarea size="md" placeholder="Medium" style={{ width: '18rem' }} minRows={2} />
            <Textarea size="lg" placeholder="Large" style={{ width: '18rem' }} minRows={2} />
          </ComponentExample>
        </Section>

        <Section id="states" title="States">
          <ComponentExample label="Disabled" code={`<Textarea disabled placeholder="Disabled textarea" />`}>
            <Textarea disabled placeholder="Disabled textarea" style={{ width: '22rem' }} />
          </ComponentExample>
          <ComponentExample label="Read-only" code={`<Textarea readOnly value="Read-only content" />`}>
            <Textarea readOnly value="Read-only content" style={{ width: '22rem' }} />
          </ComponentExample>
        </Section>

        <Section id="props" title="Props">
          <PropsTable props={PROPS} />
          <p className="docs-section-text">
            Also accepts all standard <code>HTMLTextAreaElement</code> attributes.
          </p>
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>aria-invalid</code> set automatically when <code>error=true</code>.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Character count is announced by screen readers via <code>aria-live</code> when <code>showCount=true</code>.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Pair with <code>Field</code> for automatic label, hint, and error <code>aria-describedby</code> associations.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Focus ring via <code>:focus-visible</code> — visible on keyboard, hidden on mouse click.</li>
          </ul>
        </Section>

        <Section id="keyboard" title="Keyboard navigation">
          <KeyboardTable rows={KEYBOARD} />
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every Textarea.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(textareaContract, null, 2)}
          />
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme Textarea.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-color-border',       desc: 'Default border color' },
              { name: '--vhyx-color-border-focus', desc: 'Focus border color' },
              { name: '--vhyx-color-danger',       desc: 'Error border color' },
              { name: '--vhyx-color-surface',      desc: 'Textarea background' },
              { name: '--vhyx-radius-md',          desc: 'Border radius' },
              { name: '--vhyx-shadow-focus',       desc: 'Focus ring' },
              { name: '--vhyx-duration-fast',      desc: 'Border transition duration' },
            ].map((t) => (
              <div key={t.name} className="docs-token-item">
                <span className="docs-token-name">{t.name}</span>
                <span className="docs-token-desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="examples" title="Examples">
          <h3 className="docs-subsection-heading">Bio field with counter</h3>
          <ComponentExample
            label="160 character bio input"
            code={`<Textarea
  showCount
  maxLength={160}
  placeholder="Tell us about yourself…"
  resize="none"
/>`}
          >
            <Textarea showCount maxLength={160} placeholder="Tell us about yourself…" resize="none" style={{ width: '28rem' }} />
          </ComponentExample>

          <h3 className="docs-subsection-heading">Inside a Field for full label + error wiring</h3>
          <CodeBlock
            language="tsx"
            code={`<Field name="bio" label="Bio" hint="Max 160 characters">
  <Textarea
    {...form.register('bio')}
    showCount
    maxLength={160}
    resize="auto"
    error={!!form.formState.errors.bio}
  />
</Field>`}
          />
        </Section>

        <PageNav
          prev={{ title: 'Input', href: '/components/input' }}
          next={{ title: 'Select', href: '/components/select' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
