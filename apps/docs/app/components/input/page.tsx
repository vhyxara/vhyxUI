'use client';

import React, { useState } from 'react';
import { Input, Badge, Separator } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlockSimple';
import { PropsTable } from '../../../components/PropsTable';
import { KeyboardTable } from '../../../components/KeyboardTable';
import type { PropDef } from '../../../components/PropsTable';
import type { KeyboardRow } from '../../../components/KeyboardTable';

const PROPS: PropDef[] = [
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the input.' },
  { name: 'icon', type: 'React.ReactNode', description: 'Icon rendered inside the input.' },
  { name: 'iconPosition', type: "'left' | 'right'", default: "'left'", description: 'Side the icon appears on.' },
  { name: 'prefix', type: 'React.ReactNode', description: 'Content rendered before the input (inside the wrapper).' },
  { name: 'suffix', type: 'React.ReactNode', description: 'Content rendered after the input (inside the wrapper).' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Shows a clear button when input has value.' },
  { name: 'onClear', type: '() => void', description: 'Called when the clear button is clicked.' },
  { name: 'error', type: 'boolean', default: 'false', description: 'Applies error styling and sets aria-invalid.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override.' },
];

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Tab'], action: 'Move focus into / out of the input.' },
  { keys: ['Escape'], action: 'If clearable, can clear value. Standard browser behavior otherwise.' },
];

export default function InputPage(): React.ReactElement {
  const [value, setValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  return (
    <>
      <PageHeader
        name="Input"
        description="Text input with icon, prefix, suffix, clear button, and password toggle. Error state triggers the shake animation."
        tags={['Form element', 'Interactive', 'VhyxSeal']}
      />

      <Section title="Interactive example">
        <ComponentExample label="Controlled input" code={`<Input value={value} onChange={e => setValue(e.target.value)} placeholder="Type something…" />`}>
          <Input value={value} onChange={(e) => { setValue(e.target.value); }} placeholder="Type something…" style={{ width: '20rem' }} />
        </ComponentExample>
      </Section>

      <Section title="Import">
        <CodeBlock code={`import { Input } from '@vhyxui/react'`} />
      </Section>

      <Section title="Variants" description="Different input configurations.">
        <ComponentExample label="Default" code={`<Input placeholder="Default input" />`}>
          <Input placeholder="Default input" style={{ width: '18rem' }} />
        </ComponentExample>
        <ComponentExample label="With icon" code={`<Input icon={<span>🔍</span>} placeholder="Search…" />`}>
          <Input icon={<span aria-hidden="true">🔍</span>} placeholder="Search…" style={{ width: '18rem' }} />
          <Input icon={<span aria-hidden="true">✉</span>} iconPosition="right" placeholder="Email" style={{ width: '18rem' }} />
        </ComponentExample>
        <ComponentExample label="With prefix and suffix" code={`<Input prefix="$" suffix=".00" placeholder="0" />`}>
          <Input prefix={<span>$</span>} suffix={<span>.00</span>} placeholder="0" style={{ width: '12rem' }} />
          <Input prefix={<span>https://</span>} placeholder="example.com" style={{ width: '18rem' }} />
        </ComponentExample>
        <ComponentExample label="Search with clear" code={`<Input type="search" value={v} onChange={e => setV(e.target.value)} clearable />`}>
          <Input
            type="search"
            value={searchValue}
            onChange={(e) => { setSearchValue(e.target.value); }}
            onClear={() => { setSearchValue(''); }}
            clearable
            placeholder="Search…"
            style={{ width: '18rem' }}
          />
        </ComponentExample>
        <ComponentExample label="Password with show/hide toggle" code={`<Input type="password" placeholder="Password" />`}>
          <Input type="password" placeholder="Enter password" style={{ width: '18rem' }} />
        </ComponentExample>
        <ComponentExample label="Error state" code={`<Input error placeholder="Invalid input" />`}>
          <Input error placeholder="Invalid email" style={{ width: '18rem' }} />
        </ComponentExample>
      </Section>

      <Section title="Sizes">
        <ComponentExample label="sm, md, lg" code={`<Input size="sm" placeholder="Small" />\n<Input size="md" placeholder="Medium" />\n<Input size="lg" placeholder="Large" />`}>
          <Input size="sm" placeholder="Small" style={{ width: '14rem' }} />
          <Input size="md" placeholder="Medium" style={{ width: '14rem' }} />
          <Input size="lg" placeholder="Large" style={{ width: '14rem' }} />
        </ComponentExample>
      </Section>

      <Section title="Props">
        <PropsTable props={PROPS} />
        <p className="docs-section-text">Also accepts all standard <code>HTMLInputElement</code> attributes except <code>size</code> and <code>prefix</code> (overridden by VhyxUI).</p>
      </Section>

      <Section title="Accessibility">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>aria-invalid</code> set automatically when <code>error=true</code>.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Password toggle button has <code>aria-label</code> that updates with state.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Clear button has <code>aria-label="Clear"</code>.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Icons are <code>aria-hidden</code> — decorative only.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Use with <code>Field</code> to automatically connect label and error via <code>aria-describedby</code>.</li>
        </ul>
      </Section>

      <Section title="Keyboard navigation">
        <KeyboardTable rows={KEYBOARD} />
      </Section>

      <Section title="Agent contract">
        <div className="docs-contract">
          {[
            { key: 'type', value: '"input"' },
            { key: 'intent', value: '"collect-text-input"' },
            { key: 'safetyLevel', value: '"low"' },
          ].map((r) => (
            <div key={r.key} className="docs-contract-row">
              <span className="docs-contract-key">{r.key}</span>
              <span className="docs-contract-value">{r.value}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Theming">
        <div className="docs-tokens-grid">
          {[
            { name: '--vhyx-size-sm/md/lg', desc: 'Input height' },
            { name: '--vhyx-color-border', desc: 'Default border' },
            { name: '--vhyx-color-border-focus', desc: 'Focus border' },
            { name: '--vhyx-color-danger', desc: 'Error border' },
            { name: '--vhyx-radius-md', desc: 'Border radius' },
            { name: '--vhyx-shadow-focus', desc: 'Focus ring' },
          ].map((t) => (
            <div key={t.name} className="docs-token-item">
              <span className="docs-token-name">{t.name}</span>
              <span className="docs-token-desc">{t.desc}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Examples">
        <ComponentExample label="Email field" code={`<Input type="email" icon={<span>✉</span>} placeholder="you@example.com" />`}>
          <Input type="email" icon={<span aria-hidden="true">✉</span>} placeholder="you@example.com" style={{ width: '20rem' }} />
        </ComponentExample>
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <a href="/components/button" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>← Button</a>
        <a href="/components/textarea" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>Textarea →</a>
      </div>
    </>
  );
}
