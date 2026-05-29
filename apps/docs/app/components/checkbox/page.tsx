'use client';

import React, { useState } from 'react';
import { Checkbox } from '@vhyxui/react';
import { checkboxContract } from '@vhyxui/core';
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
  { id: 'states',             text: 'States',              level: 2 },
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
  { name: 'checked', type: "boolean | 'indeterminate'", description: 'Controlled checked state.' },
  { name: 'defaultChecked', type: "boolean | 'indeterminate'", default: 'false', description: 'Default state for uncontrolled usage.' },
  { name: 'onCheckedChange', type: "(checked: boolean | 'indeterminate') => void", description: 'Called when the checked state changes.' },
  { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Forces the indeterminate (dash) state.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the checkbox.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction (from HTMLButtonElement).' },
  { name: 'asChild', type: 'boolean', default: 'false', description: 'Renders as the child element via Slot.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override.' },
  { name: 'className', type: 'string', description: 'Additional CSS classes appended to the checkbox.' },
];

// ─── Keyboard ──────────────────────────────────────────────────────────────

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Space'],    action: 'Toggle checked ↔ unchecked. Indeterminate → checked.' },
  { keys: ['Tab'],      action: 'Move focus to the next focusable element.' },
  { keys: ['Shift + Tab'], action: 'Move focus to the previous focusable element.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function CheckboxPage(): React.ReactElement {
  const [checked, setChecked] = useState<boolean | 'indeterminate'>(false);
  const [all, setAll]         = useState<boolean | 'indeterminate'>('indeterminate');

  return (
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Checkbox"
          description="Toggles a boolean or indeterminate selection. Checkmark animates in with spring easing. First-class indeterminate support for select-all table patterns."
          tags={['Form element', 'Interactive', 'VhyxSeal']}
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="Click to toggle"
            code={`<Checkbox checked={checked} onCheckedChange={setChecked} aria-label="Accept terms" />`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-3)', alignItems: 'center' }}>
              <Checkbox checked={checked} onCheckedChange={setChecked} aria-label="Accept terms" />
              <span style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>
                {checked === true ? 'Checked' : checked === 'indeterminate' ? 'Indeterminate' : 'Unchecked'}
              </span>
            </div>
          </ComponentExample>
        </Section>

        <Section id="import" title="Import">
          <CodeBlock code={`import { Checkbox } from '@vhyxui/react'`} language="tsx" />
        </Section>

        <Section id="states" title="States">
          <ComponentExample
            label="All three states"
            code={`<Checkbox checked={false} aria-label="Unchecked" />
<Checkbox checked={true} aria-label="Checked" />
<Checkbox indeterminate aria-label="Indeterminate" />
<Checkbox checked={false} disabled aria-label="Disabled" />`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-6)', alignItems: 'center' }}>
              {[
                { label: 'Unchecked', node: <Checkbox checked={false} aria-label="Unchecked" /> },
                { label: 'Checked',   node: <Checkbox checked={true}  aria-label="Checked" /> },
                { label: 'Indeterm.', node: <Checkbox indeterminate   aria-label="Indeterminate" /> },
                { label: 'Disabled',  node: <Checkbox checked={false} disabled aria-label="Disabled" /> },
              ].map(({ label, node }) => (
                <span key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--vhyx-space-2)', fontSize: 'var(--vhyx-text-xs)', color: 'var(--vhyx-color-text-muted)' }}>
                  {node}{label}
                </span>
              ))}
            </div>
          </ComponentExample>
          <ComponentExample
            label="Select-all pattern with indeterminate"
            code={`<Checkbox checked={all} onCheckedChange={setAll} aria-label="Select all rows" />`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-3)' }}>
              <div style={{ display: 'flex', gap: 'var(--vhyx-space-2)', alignItems: 'center' }}>
                <Checkbox checked={all} onCheckedChange={setAll} aria-label="Select all rows" />
                <span style={{ fontSize: 'var(--vhyx-text-sm)', fontWeight: 'var(--vhyx-weight-medium)' }}>Select all</span>
              </div>
              <p className="docs-section-text" style={{ margin: 0 }}>
                State: {all === true ? 'All selected' : all === 'indeterminate' ? 'Some selected' : 'None selected'}
              </p>
            </div>
          </ComponentExample>
        </Section>

        <Section id="sizes" title="Sizes">
          <ComponentExample
            label="sm, md, lg"
            code={`<Checkbox size="sm" checked={true} aria-label="Small" />
<Checkbox size="md" checked={true} aria-label="Medium" />
<Checkbox size="lg" checked={true} aria-label="Large" />`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-6)', alignItems: 'center' }}>
              <Checkbox size="sm" checked={true} aria-label="Small" />
              <Checkbox size="md" checked={true} aria-label="Medium" />
              <Checkbox size="lg" checked={true} aria-label="Large" />
            </div>
          </ComponentExample>
        </Section>

        <Section id="props" title="Props">
          <PropsTable props={PROPS} />
          <p className="docs-section-text">
            Also accepts all standard <code>HTMLButtonElement</code> attributes.
          </p>
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Renders as <code>&lt;button role="checkbox"&gt;</code> for full CSS styling control.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>aria-checked="mixed"</code> set automatically for the indeterminate state.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Focus ring via <code>:focus-visible</code> — visible on keyboard, hidden on mouse click.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Always provide <code>aria-label</code> or use with <code>Field</code> for label association.</li>
          </ul>
        </Section>

        <Section id="keyboard" title="Keyboard navigation">
          <KeyboardTable rows={KEYBOARD} />
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every Checkbox.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(checkboxContract, null, 2)}
          />
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme Checkbox.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-color-accent',       desc: 'Checked background color' },
              { name: '--vhyx-color-accent-hover',  desc: 'Checked hover background' },
              { name: '--vhyx-color-border-strong', desc: 'Unchecked border color' },
              { name: '--vhyx-color-surface',       desc: 'Unchecked background' },
              { name: '--vhyx-radius-sm',           desc: 'Border radius' },
              { name: '--vhyx-duration-fast',       desc: 'Checkmark animation duration' },
              { name: '--vhyx-easing-spring',       desc: 'Checkmark animation easing' },
              { name: '--vhyx-shadow-focus',        desc: 'Focus ring' },
            ].map((t) => (
              <div key={t.name} className="docs-token-item">
                <span className="docs-token-name">{t.name}</span>
                <span className="docs-token-desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="examples" title="Examples">
          <h3 className="docs-subsection-heading">Terms acceptance</h3>
          <ComponentExample
            label="Checkbox with inline label"
            code={`<div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
  <Checkbox checked={accepted} onCheckedChange={setAccepted} aria-label="Accept terms" />
  <label>I accept the terms and conditions</label>
</div>`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-2)', alignItems: 'center' }}>
              <Checkbox checked={checked === true} onCheckedChange={(v) => { setChecked(v); }} aria-label="Accept terms" />
              <span style={{ fontSize: 'var(--vhyx-text-sm)' }}>I accept the terms and conditions</span>
            </div>
          </ComponentExample>

          <h3 className="docs-subsection-heading">Inside a Field</h3>
          <CodeBlock
            language="tsx"
            code={`<Field name="terms" label="Terms">
  <Checkbox
    {...form.register('terms')}
    checked={form.watch('terms')}
    onCheckedChange={v => form.setValue('terms', v === true)}
    aria-label="Accept terms and conditions"
  />
</Field>`}
          />
        </Section>

        <PageNav
          prev={{ title: 'Select', href: '/components/select' }}
          next={{ title: 'Radio', href: '/components/radio' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
