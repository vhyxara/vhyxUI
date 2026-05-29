'use client';

import React, { useState } from 'react';
import { Input } from '@vhyxui/react';
import { inputContract } from '@vhyxui/core';
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
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the input — maps to --vhyx-size-* height tokens.' },
  { name: 'icon', type: 'React.ReactNode', description: 'Icon rendered inside the input field.' },
  { name: 'iconPosition', type: "'left' | 'right'", default: "'left'", description: 'Side the icon appears on.' },
  { name: 'prefix', type: 'React.ReactNode', description: 'Content rendered before the input (inside the wrapper).' },
  { name: 'suffix', type: 'React.ReactNode', description: 'Content rendered after the input (inside the wrapper).' },
  { name: 'clearable', type: 'boolean', default: 'false', description: 'Shows a clear button when the input has a value.' },
  { name: 'onClear', type: '() => void', description: 'Called when the clear button is clicked.' },
  { name: 'error', type: 'boolean', default: 'false', description: 'Applies error styling and sets aria-invalid.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override.' },
  { name: 'className', type: 'string', description: 'Additional CSS classes appended to the input wrapper.' },
];

// ─── Keyboard ──────────────────────────────────────────────────────────────

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Tab'],        action: 'Move focus into / out of the input.' },
  { keys: ['Shift + Tab'], action: 'Move focus to the previous focusable element.' },
  { keys: ['Escape'],     action: 'When clearable and focused, clears the value.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function InputPage(): React.ReactElement {
  const [value, setValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Input"
          description="Text input with icon, prefix, suffix, clear button, and password show/hide toggle. Error state triggers the shake animation."
          tags={['Form element', 'Interactive', 'VhyxSeal']}
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="Controlled input"
            code={`<Input value={value} onChange={e => setValue(e.target.value)} placeholder="Type something…" />`}
          >
            <Input
              value={value}
              onChange={(e) => { setValue(e.target.value); }}
              placeholder="Type something…"
              style={{ width: '20rem' }}
            />
          </ComponentExample>
        </Section>

        <Section id="import" title="Import">
          <CodeBlock code={`import { Input } from '@vhyxui/react'`} language="tsx" />
        </Section>

        <Section id="variants" title="Variants" description="Different input configurations.">
          <ComponentExample label="Default" code={`<Input placeholder="Default input" />`}>
            <Input placeholder="Default input" style={{ width: '18rem' }} />
          </ComponentExample>
          <ComponentExample
            label="With icon"
            code={`<Input icon={<SearchIcon />} placeholder="Search…" />
<Input icon={<MailIcon />} iconPosition="right" placeholder="Email" />`}
          >
            <Input icon={<span aria-hidden="true">🔍</span>} placeholder="Search…" style={{ width: '18rem' }} />
            <Input icon={<span aria-hidden="true">✉</span>} iconPosition="right" placeholder="Email" style={{ width: '18rem' }} />
          </ComponentExample>
          <ComponentExample
            label="With prefix and suffix"
            code={`<Input prefix="$" suffix=".00" placeholder="0" />
<Input prefix="https://" placeholder="example.com" />`}
          >
            <Input prefix={<span>$</span>} suffix={<span>.00</span>} placeholder="0" style={{ width: '12rem' }} />
            <Input prefix={<span>https://</span>} placeholder="example.com" style={{ width: '18rem' }} />
          </ComponentExample>
          <ComponentExample
            label="Search with clear button"
            code={`<Input type="search" value={v} onChange={e => setV(e.target.value)} clearable onClear={() => setV('')} />`}
          >
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
          <ComponentExample
            label="Password with show/hide toggle"
            code={`<Input type="password" placeholder="Enter password" />`}
          >
            <Input type="password" placeholder="Enter password" style={{ width: '18rem' }} />
          </ComponentExample>
          <ComponentExample label="Error state" code={`<Input error placeholder="Invalid email" />`}>
            <Input error placeholder="Invalid email" style={{ width: '18rem' }} />
          </ComponentExample>
        </Section>

        <Section id="sizes" title="Sizes">
          <ComponentExample
            label="sm, md, lg"
            code={`<Input size="sm" placeholder="Small" />
<Input size="md" placeholder="Medium" />
<Input size="lg" placeholder="Large" />`}
          >
            <Input size="sm" placeholder="Small" style={{ width: '14rem' }} />
            <Input size="md" placeholder="Medium" style={{ width: '14rem' }} />
            <Input size="lg" placeholder="Large" style={{ width: '14rem' }} />
          </ComponentExample>
        </Section>

        <Section id="states" title="States">
          <ComponentExample label="Disabled" code={`<Input disabled placeholder="Disabled" />`}>
            <Input disabled placeholder="Disabled input" style={{ width: '18rem' }} />
          </ComponentExample>
          <ComponentExample label="Read-only" code={`<Input readOnly value="Read-only value" />`}>
            <Input readOnly value="Read-only value" style={{ width: '18rem' }} />
          </ComponentExample>
        </Section>

        <Section id="props" title="Props">
          <PropsTable props={PROPS} />
          <p className="docs-section-text">
            Also accepts all standard <code>HTMLInputElement</code> attributes. The native <code>size</code> attribute is replaced by the <code>size</code> prop above.
          </p>
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>aria-invalid</code> set automatically when <code>error=true</code>.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Password toggle button has <code>aria-label</code> that updates with state ("Show password" / "Hide password").</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Clear button has <code>aria-label="Clear"</code>.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Icons are <code>aria-hidden</code> — decorative only.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Use with <code>Field</code> to automatically connect label, hint, and error via <code>aria-describedby</code>.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Focus ring via <code>:focus-visible</code> — visible on keyboard, hidden on mouse click.</li>
          </ul>
        </Section>

        <Section id="keyboard" title="Keyboard navigation">
          <KeyboardTable rows={KEYBOARD} />
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every Input.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(inputContract, null, 2)}
          />
          <p className="docs-section-text">
            Override via the <code>contract</code> prop — fields are merged with the default.
          </p>
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme Input without touching component code.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-size-sm/md/lg',     desc: 'Input height per size' },
              { name: '--vhyx-color-border',       desc: 'Default border color' },
              { name: '--vhyx-color-border-focus', desc: 'Focus border and ring color' },
              { name: '--vhyx-color-danger',       desc: 'Error border color' },
              { name: '--vhyx-color-surface',      desc: 'Input background' },
              { name: '--vhyx-radius-md',          desc: 'Border radius' },
              { name: '--vhyx-shadow-focus',       desc: 'Focus ring' },
              { name: '--vhyx-shadow-focus-danger', desc: 'Error focus ring' },
              { name: '--vhyx-duration-slow',      desc: 'Shake animation duration (error state)' },
            ].map((t) => (
              <div key={t.name} className="docs-token-item">
                <span className="docs-token-name">{t.name}</span>
                <span className="docs-token-desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="examples" title="Examples">
          <h3 className="docs-subsection-heading">Email field with icon</h3>
          <ComponentExample
            label="Email with left icon"
            code={`<Input type="email" icon={<MailIcon />} placeholder="you@example.com" />`}
          >
            <Input type="email" icon={<span aria-hidden="true">✉</span>} placeholder="you@example.com" style={{ width: '20rem' }} />
          </ComponentExample>

          <h3 className="docs-subsection-heading">Inside a Field for full label + error wiring</h3>
          <CodeBlock
            language="tsx"
            code={`<Field name="email" label="Email address" required>
  <Input
    {...form.register('email')}
    type="email"
    placeholder="you@example.com"
    error={!!form.formState.errors.email}
  />
</Field>`}
          />
        </Section>

        <PageNav
          prev={{ title: 'Button', href: '/components/button' }}
          next={{ title: 'Textarea', href: '/components/textarea' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
