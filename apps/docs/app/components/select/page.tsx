'use client';

import React, { useState } from 'react';
import { Select, Separator } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlockSimple';
import { PropsTable } from '../../../components/PropsTable';
import { KeyboardTable } from '../../../components/KeyboardTable';
import type { PropDef } from '../../../components/PropsTable';
import type { KeyboardRow } from '../../../components/KeyboardTable';

const PROPS: PropDef[] = [
  { name: 'value', type: 'string', description: 'Controlled selected value.' },
  { name: 'defaultValue', type: 'string', description: 'Default value (uncontrolled).' },
  { name: 'onValueChange', type: '(value: string) => void', description: 'Called when a new value is selected.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the select.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the trigger.' },
  { name: 'placeholder', type: 'string', description: 'Placeholder text when no value is selected.' },
];

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Enter', 'Space'], action: 'Open the dropdown.' },
  { keys: ['Arrow Down', 'Arrow Up'], action: 'Navigate between options.' },
  { keys: ['Home'], action: 'Jump to first option.' },
  { keys: ['End'], action: 'Jump to last option.' },
  { keys: ['Enter'], action: 'Select the focused option.' },
  { keys: ['Escape'], action: 'Close the dropdown.' },
];

export default function SelectPage(): React.ReactElement {
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [size, setSize] = useState('md');

  return (
    <>
      <PageHeader name="Select" description="Compound dropdown with full keyboard navigation, type-ahead, and groups. Always-rendered content keeps labels in the registry for controlled mode." tags={['Form element', 'Interactive', 'VhyxSeal']} />

      <Section title="Interactive example">
        <ComponentExample label="Country selector" code={`<Select value={country} onValueChange={setCountry} placeholder="Select country">\n  <Select.Trigger />\n  <Select.Content>\n    <Select.Item value="us">United States</Select.Item>\n  </Select.Content>\n</Select>`}>
          <Select value={country} onValueChange={setCountry} placeholder="Select country" style={{ width: '14rem' }}>
            <Select.Trigger />
            <Select.Content>
              <Select.Group>
                <Select.Label>Americas</Select.Label>
                <Select.Item value="us">United States</Select.Item>
                <Select.Item value="ca">Canada</Select.Item>
                <Select.Item value="mx">Mexico</Select.Item>
              </Select.Group>
              <Select.Separator />
              <Select.Group>
                <Select.Label>Europe</Select.Label>
                <Select.Item value="gb">United Kingdom</Select.Item>
                <Select.Item value="de">Germany</Select.Item>
                <Select.Item value="fr">France</Select.Item>
              </Select.Group>
            </Select.Content>
          </Select>
          {country && <span style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Selected: {country}</span>}
        </ComponentExample>
      </Section>

      <Section title="Import">
        <CodeBlock code={`import { Select } from '@vhyxui/react'

// Sub-components
Select.Trigger
Select.Content
Select.Item
Select.Group
Select.Label
Select.Separator`} />
      </Section>

      <Section title="Variants">
        <ComponentExample label="Simple list" code={`<Select placeholder="Pick a size">\n  <Select.Trigger />\n  <Select.Content>\n    <Select.Item value="sm">Small</Select.Item>\n    <Select.Item value="md">Medium</Select.Item>\n  </Select.Content>\n</Select>`}>
          <Select value={size} onValueChange={setSize} style={{ width: '12rem' }}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="xs">Extra small</Select.Item>
              <Select.Item value="sm">Small</Select.Item>
              <Select.Item value="md">Medium</Select.Item>
              <Select.Item value="lg">Large</Select.Item>
            </Select.Content>
          </Select>
        </ComponentExample>
        <ComponentExample label="Disabled items">
          <Select placeholder="Pick an option" style={{ width: '14rem' }}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="a">Available option</Select.Item>
              <Select.Item value="b" disabled>Disabled option</Select.Item>
              <Select.Item value="c">Another option</Select.Item>
            </Select.Content>
          </Select>
        </ComponentExample>
        <ComponentExample label="Disabled select">
          <Select placeholder="Disabled" disabled style={{ width: '12rem' }}>
            <Select.Trigger />
            <Select.Content>
              <Select.Item value="a">Option</Select.Item>
            </Select.Content>
          </Select>
        </ComponentExample>
      </Section>

      <Section title="Sizes">
        <ComponentExample label="sm, md, lg">
          {['sm', 'md', 'lg'].map((s) => (
            <Select key={s} size={s as 'sm' | 'md' | 'lg'} placeholder={`${s.toUpperCase()} size`} style={{ width: '11rem' }}>
              <Select.Trigger />
              <Select.Content><Select.Item value="a">Option A</Select.Item></Select.Content>
            </Select>
          ))}
        </ComponentExample>
      </Section>

      <Section title="Props"><PropsTable props={PROPS} /></Section>

      <Section title="Accessibility">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Trigger has <code>role="combobox"</code>, <code>aria-haspopup="listbox"</code>, <code>aria-expanded</code>.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Dropdown has <code>role="listbox"</code>. Items have <code>role="option"</code>.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Type-ahead: typing characters jumps to matching options.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Disabled items have <code>aria-disabled="true"</code>.</li>
        </ul>
      </Section>

      <Section title="Keyboard navigation"><KeyboardTable rows={KEYBOARD} /></Section>

      <Section title="Agent contract">
        <div className="docs-contract">
          {[{ key: 'type', value: '"input"' }, { key: 'intent', value: '"select-option"' }, { key: 'safetyLevel', value: '"low"' }].map((r) => (
            <div key={r.key} className="docs-contract-row"><span className="docs-contract-key">{r.key}</span><span className="docs-contract-value">{r.value}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Theming">
        <div className="docs-tokens-grid">
          {[{ name: '--vhyx-z-dropdown', desc: 'Dropdown z-index' }, { name: '--vhyx-shadow-lg', desc: 'Dropdown shadow' }, { name: '--vhyx-radius-md', desc: 'Dropdown border radius' }, { name: '--vhyx-color-accent-subtle', desc: 'Selected item background' }].map((t) => (
            <div key={t.name} className="docs-token-item"><span className="docs-token-name">{t.name}</span><span className="docs-token-desc">{t.desc}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Examples">
        <ComponentExample label="Font size selector" code={`<Select defaultValue="16px" style={{ width: '10rem' }}>...</Select>`}>
          <Select defaultValue="16" style={{ width: '10rem' }}>
            <Select.Trigger />
            <Select.Content>
              {['12', '14', '16', '18', '20', '24'].map((s) => (
                <Select.Item key={s} value={s}>{s}px</Select.Item>
              ))}
            </Select.Content>
          </Select>
        </ComponentExample>
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <a href="/components/form" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>← Form & Field</a>
        <a href="/components/dialog" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>Dialog →</a>
      </div>
    </>
  );
}
