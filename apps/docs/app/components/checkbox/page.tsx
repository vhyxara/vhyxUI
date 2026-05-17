'use client';

import React, { useState } from 'react';
import { Checkbox, Separator } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlock';
import { PropsTable } from '../../../components/PropsTable';
import { KeyboardTable } from '../../../components/KeyboardTable';
import type { PropDef } from '../../../components/PropsTable';
import type { KeyboardRow } from '../../../components/KeyboardTable';

const PROPS: PropDef[] = [
  { name: 'checked', type: "boolean | 'indeterminate'", description: 'Controlled checked state.' },
  { name: 'defaultChecked', type: "boolean | 'indeterminate'", default: 'false', description: 'Default checked state (uncontrolled).' },
  { name: 'onCheckedChange', type: "(checked: boolean | 'indeterminate') => void", description: 'Called when checked state changes.' },
  { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Renders the indeterminate state (dash mark).' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the checkbox.' },
  { name: 'asChild', type: 'boolean', default: 'false', description: 'Renders as the child element via Slot.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override.' },
];

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Space'], action: 'Toggle checked/unchecked/indeterminate.' },
  { keys: ['Tab'], action: 'Move focus in/out.' },
];

export default function CheckboxPage(): React.ReactElement {
  const [checked, setChecked] = useState<boolean | 'indeterminate'>(false);
  const [all, setAll] = useState<boolean | 'indeterminate'>('indeterminate');

  return (
    <>
      <PageHeader name="Checkbox" description="Toggles a boolean or indeterminate selection. Checkmark animates in with spring easing. First-class indeterminate support for select-all patterns." tags={['Form element', 'Interactive']} />

      <Section title="Interactive example">
        <ComponentExample label="Toggle me" code={`<Checkbox checked={checked} onCheckedChange={setChecked} aria-label="Accept terms" />`}>
          <Checkbox checked={checked} onCheckedChange={setChecked} aria-label="Accept terms" />
          <span style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>
            {checked === true ? 'Checked' : checked === 'indeterminate' ? 'Indeterminate' : 'Unchecked'}
          </span>
        </ComponentExample>
      </Section>

      <Section title="Import">
        <CodeBlock code={`import { Checkbox } from '@vhyxui/react'`} />
      </Section>

      <Section title="States">
        <ComponentExample label="All three states" code={`<Checkbox checked={false} aria-label="Unchecked" />\n<Checkbox checked={true} aria-label="Checked" />\n<Checkbox indeterminate aria-label="Indeterminate" />`}>
          <div style={{ display: 'flex', gap: 'var(--vhyx-space-6)', alignItems: 'center' }}>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--vhyx-space-2)', fontSize: 'var(--vhyx-text-xs)', color: 'var(--vhyx-color-text-muted)' }}>
              <Checkbox checked={false} aria-label="Unchecked" />Unchecked
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--vhyx-space-2)', fontSize: 'var(--vhyx-text-xs)', color: 'var(--vhyx-color-text-muted)' }}>
              <Checkbox checked={true} aria-label="Checked" />Checked
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--vhyx-space-2)', fontSize: 'var(--vhyx-text-xs)', color: 'var(--vhyx-color-text-muted)' }}>
              <Checkbox indeterminate aria-label="Indeterminate" />Indeterminate
            </span>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--vhyx-space-2)', fontSize: 'var(--vhyx-text-xs)', color: 'var(--vhyx-color-text-muted)' }}>
              <Checkbox checked={false} disabled aria-label="Disabled" />Disabled
            </span>
          </div>
        </ComponentExample>
        <ComponentExample label="Select-all pattern" code={`<Checkbox checked={all} onCheckedChange={setAll} aria-label="Select all" />`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-3)' }}>
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-2)', alignItems: 'center' }}>
              <Checkbox checked={all} onCheckedChange={setAll} aria-label="Select all rows" />
              <span style={{ fontSize: 'var(--vhyx-text-sm)' }}>Select all</span>
            </div>
          </div>
        </ComponentExample>
      </Section>

      <Section title="Sizes">
        <ComponentExample label="sm, md, lg">
          <Checkbox size="sm" checked={true} aria-label="Small" />
          <Checkbox size="md" checked={true} aria-label="Medium" />
          <Checkbox size="lg" checked={true} aria-label="Large" />
        </ComponentExample>
      </Section>

      <Section title="Props"><PropsTable props={PROPS} /></Section>

      <Section title="Accessibility">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Renders as <code>&lt;button role="checkbox"&gt;</code> — full CSS styling control.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>aria-checked="mixed"</code> set automatically for indeterminate state.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Always provide <code>aria-label</code> or use with <code>Field</code> for label association.</li>
        </ul>
      </Section>

      <Section title="Keyboard navigation"><KeyboardTable rows={KEYBOARD} /></Section>

      <Section title="Agent contract">
        <div className="docs-contract">
          {[{ key: 'type', value: '"input"' }, { key: 'intent', value: '"toggle-selection"' }, { key: 'safetyLevel', value: '"low"' }].map((r) => (
            <div key={r.key} className="docs-contract-row"><span className="docs-contract-key">{r.key}</span><span className="docs-contract-value">{r.value}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Theming">
        <div className="docs-tokens-grid">
          {[{ name: '--vhyx-size-sm/md/lg', desc: 'Checkbox dimensions' }, { name: '--vhyx-color-accent', desc: 'Checked background' }, { name: '--vhyx-radius-sm', desc: 'Border radius' }, { name: '--vhyx-duration-fast', desc: 'Checkmark animation' }].map((t) => (
            <div key={t.name} className="docs-token-item"><span className="docs-token-name">{t.name}</span><span className="docs-token-desc">{t.desc}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Examples">
        <ComponentExample label="Terms acceptance" code={`<div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>\n  <Checkbox checked={accepted} onCheckedChange={setAccepted} aria-label="Accept terms" />\n  <label>I accept the terms and conditions</label>\n</div>`}>
          <div style={{ display: 'flex', gap: 'var(--vhyx-space-2)', alignItems: 'center' }}>
            <Checkbox checked={checked === true} onCheckedChange={(v) => { setChecked(v); }} aria-label="Accept terms" />
            <span style={{ fontSize: 'var(--vhyx-text-sm)' }}>I accept the terms and conditions</span>
          </div>
        </ComponentExample>
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <a href="/components/textarea" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>← Textarea</a>
        <a href="/components/radio" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>Radio →</a>
      </div>
    </>
  );
}
