'use client';

import React, { useState } from 'react';
import { Select } from '@vhyxui/react';
import { selectContract } from '@vhyxui/core';
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
  { id: 'props',              text: 'Props',               level: 2 },
  { id: 'accessibility',      text: 'Accessibility',       level: 2 },
  { id: 'keyboard',           text: 'Keyboard',            level: 2 },
  { id: 'agent-contract',     text: 'Agent Contract',      level: 2 },
  { id: 'theming',            text: 'Theming',             level: 2 },
  { id: 'examples',           text: 'Examples',            level: 2 },
] as const;

// ─── Props ─────────────────────────────────────────────────────────────────

const PROPS: PropDef[] = [
  { name: 'value', type: 'string', description: 'Controlled selected value.' },
  { name: 'defaultValue', type: 'string', description: 'Default value for uncontrolled usage.' },
  { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the user selects a new option.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the entire select.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the trigger — maps to --vhyx-size-* tokens.' },
  { name: 'placeholder', type: 'string', description: 'Placeholder text shown when no value is selected.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override.' },
];

// ─── Keyboard ──────────────────────────────────────────────────────────────

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Enter', 'Space'],          action: 'Open the dropdown.' },
  { keys: ['Arrow Down', 'Arrow Up'],  action: 'Navigate between options.' },
  { keys: ['Home'],                    action: 'Jump to the first option.' },
  { keys: ['End'],                     action: 'Jump to the last option.' },
  { keys: ['Enter'],                   action: 'Select the focused option and close.' },
  { keys: ['Escape'],                  action: 'Close the dropdown without selecting.' },
  { keys: ['A–Z'],                     action: 'Type-ahead: jump to the first matching option.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function SelectPage(): React.ReactElement {
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [size, setSize] = useState('md');

  return (
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Select"
          description="Compound dropdown with full keyboard navigation, type-ahead, groups, and separators. Controlled and uncontrolled modes both supported."
          tags={['Form element', 'Interactive', 'VhyxSeal']}
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="Country selector with groups"
            code={`<Select value={country} onValueChange={setCountry} placeholder="Select country">
  <Select.Trigger />
  <Select.Content>
    <Select.Group>
      <Select.Label>Americas</Select.Label>
      <Select.Item value="us">United States</Select.Item>
      <Select.Item value="ca">Canada</Select.Item>
    </Select.Group>
    <Select.Separator />
    <Select.Group>
      <Select.Label>Europe</Select.Label>
      <Select.Item value="gb">United Kingdom</Select.Item>
      <Select.Item value="de">Germany</Select.Item>
    </Select.Group>
  </Select.Content>
</Select>`}
          >
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
            {country !== undefined && (
              <span style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>
                Selected: {country}
              </span>
            )}
          </ComponentExample>
        </Section>

        <Section id="import" title="Import">
          <CodeBlock
            language="tsx"
            code={`import { Select } from '@vhyxui/react'

// Compound sub-components
// Select.Trigger  — the visible button that opens the dropdown
// Select.Content  — the dropdown panel
// Select.Item     — a selectable option
// Select.Group    — groups related items
// Select.Label    — label for a group
// Select.Separator — visual divider between groups`}
          />
        </Section>

        <Section id="variants" title="Variants">
          <ComponentExample
            label="Simple flat list"
            code={`<Select placeholder="Pick a size">
  <Select.Trigger />
  <Select.Content>
    <Select.Item value="sm">Small</Select.Item>
    <Select.Item value="md">Medium</Select.Item>
    <Select.Item value="lg">Large</Select.Item>
  </Select.Content>
</Select>`}
          >
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
          <ComponentExample label="With disabled items">
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

        <Section id="sizes" title="Sizes">
          <ComponentExample
            label="sm, md, lg"
            code={`<Select size="sm" placeholder="Small"><Select.Trigger /><Select.Content>…</Select.Content></Select>
<Select size="md" placeholder="Medium"><Select.Trigger /><Select.Content>…</Select.Content></Select>
<Select size="lg" placeholder="Large"><Select.Trigger /><Select.Content>…</Select.Content></Select>`}
          >
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <Select key={s} size={s} placeholder={`${s.toUpperCase()} size`} style={{ width: '11rem' }}>
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value="a">Option A</Select.Item>
                </Select.Content>
              </Select>
            ))}
          </ComponentExample>
        </Section>

        <Section id="props" title="Props">
          <PropsTable props={PROPS} />
          <p className="docs-section-text">
            <code>Select.Item</code> accepts <code>value: string</code> (required) and <code>disabled?: boolean</code>.
            <code>Select.Group</code> is a semantic grouping wrapper.
            <code>Select.Label</code> renders a group heading.
          </p>
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Trigger has <code>role="combobox"</code>, <code>aria-haspopup="listbox"</code>, <code>aria-expanded</code>.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Dropdown has <code>role="listbox"</code>. Items have <code>role="option"</code>.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Type-ahead: typing characters immediately jumps to the first matching option.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Disabled items have <code>aria-disabled="true"</code> and cannot be selected.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Focus ring via <code>:focus-visible</code>.</li>
          </ul>
        </Section>

        <Section id="keyboard" title="Keyboard navigation">
          <KeyboardTable rows={KEYBOARD} />
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every Select.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(selectContract, null, 2)}
          />
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme Select.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-size-sm/md/lg',      desc: 'Trigger height per size' },
              { name: '--vhyx-color-border',        desc: 'Trigger border color' },
              { name: '--vhyx-color-border-focus',  desc: 'Trigger focus border' },
              { name: '--vhyx-color-surface-overlay', desc: 'Dropdown background' },
              { name: '--vhyx-color-accent-subtle', desc: 'Selected item background' },
              { name: '--vhyx-shadow-lg',           desc: 'Dropdown shadow' },
              { name: '--vhyx-radius-md',           desc: 'Trigger and dropdown radius' },
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
          <h3 className="docs-subsection-heading">Font size selector</h3>
          <ComponentExample
            label="Compact numeric selector"
            code={`<Select defaultValue="16" style={{ width: '10rem' }}>
  <Select.Trigger />
  <Select.Content>
    {['12','14','16','18','20','24'].map(s => (
      <Select.Item key={s} value={s}>{s}px</Select.Item>
    ))}
  </Select.Content>
</Select>`}
          >
            <Select defaultValue="16" style={{ width: '10rem' }}>
              <Select.Trigger />
              <Select.Content>
                {['12', '14', '16', '18', '20', '24'].map((s) => (
                  <Select.Item key={s} value={s}>{s}px</Select.Item>
                ))}
              </Select.Content>
            </Select>
          </ComponentExample>

          <h3 className="docs-subsection-heading">Inside a Field</h3>
          <CodeBlock
            language="tsx"
            code={`<Field name="country" label="Country" required>
  <Select {...form.register('country')} placeholder="Select country">
    <Select.Trigger />
    <Select.Content>
      <Select.Item value="us">United States</Select.Item>
      <Select.Item value="gb">United Kingdom</Select.Item>
    </Select.Content>
  </Select>
</Field>`}
          />
        </Section>

        <PageNav
          prev={{ title: 'Textarea', href: '/components/textarea' }}
          next={{ title: 'Checkbox', href: '/components/checkbox' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
