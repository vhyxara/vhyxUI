'use client';

import React, { useState } from 'react';
import { Button, Badge, Separator } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlock';
import { PropsTable } from '../../../components/PropsTable';
import { KeyboardTable } from '../../../components/KeyboardTable';
import type { PropDef } from '../../../components/PropsTable';
import type { KeyboardRow } from '../../../components/KeyboardTable';

// ─── Props data ───────────────────────────────────────────────────────────────

const PROPS: PropDef[] = [
  { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'", default: "'primary'", description: 'Visual style of the button.' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the button, maps to --vhyx-size-* height tokens.' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'When true, shows a spinner and disables interaction.' },
  { name: 'icon', type: 'React.ReactNode', description: 'Optional icon element rendered alongside button text.' },
  { name: 'iconPosition', type: "'left' | 'right'", default: "'left'", description: 'Side the icon appears on.' },
  { name: 'iconOnly', type: 'boolean', default: 'false', description: 'When true, renders icon only. Requires aria-label.' },
  { name: 'asChild', type: 'boolean', default: 'false', description: 'Renders as the child element via Slot. Use for navigation links.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override — merged with the default button contract.' },
  { name: 'disabled', type: 'boolean', description: 'From HTMLButtonElement — disables the button.' },
  { name: 'onClick', type: '(e: MouseEvent) => void', description: 'From HTMLButtonElement — click handler.' },
  { name: 'className', type: 'string', description: 'Additional CSS classes appended to the button.' },
];

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Enter', 'Space'], action: 'Activates the button (triggers the click handler).' },
  { keys: ['Tab'], action: 'Moves focus to the next focusable element.' },
  { keys: ['Shift + Tab'], action: 'Moves focus to the previous focusable element.' },
];

const CONTRACT_ROWS = [
  { key: 'type', value: '"action"' },
  { key: 'intent', value: '"trigger-action"' },
  { key: 'safetyLevel', value: '"low" (→ "high" for destructive variant)' },
  { key: 'destructive', value: 'false (→ true for destructive variant)' },
  { key: 'requiresConfirmation', value: 'false (→ true for destructive variant)' },
  { key: 'contractVersion', value: '"0.0.1"' },
];

const TOKENS = [
  { name: '--vhyx-size-xs/sm/md/lg', desc: 'Button height per size' },
  { name: '--vhyx-space-3 / --vhyx-space-5', desc: 'Horizontal padding (sm/md)' },
  { name: '--vhyx-color-accent', desc: 'Primary variant background' },
  { name: '--vhyx-color-accent-hover', desc: 'Primary hover state' },
  { name: '--vhyx-color-danger', desc: 'Destructive variant background' },
  { name: '--vhyx-radius-md', desc: 'Border radius' },
  { name: '--vhyx-duration-instant', desc: 'Active press scale transition' },
  { name: '--vhyx-shadow-focus', desc: 'Focus ring' },
  { name: '--vhyx-weight-medium', desc: 'Font weight' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ButtonPage(): React.ReactElement {
  const [loading, setLoading] = useState(false);

  function handleLoadingDemo(): void {
    setLoading(true);
    setTimeout(() => { setLoading(false); }, 2000);
  }

  return (
    <>
      {/* 1. Name + description */}
      <PageHeader
        name="Button"
        description="Triggers actions or submits forms. Six variants, four sizes, loading state, icon support, and asChild for link rendering — all built in."
        tags={['Interactive', 'Form element', 'VhyxSeal']}
      />

      {/* 2. Live interactive example */}
      <Section title="Interactive example">
        <ComponentExample
          label="Button — click to see loading state"
          code={`<Button variant="primary" size="md" loading={loading} onClick={handleLoading}>
  Save changes
</Button>`}
        >
          <Button variant="primary" size="md" loading={loading} onClick={handleLoadingDemo}>
            Save changes
          </Button>
        </ComponentExample>
      </Section>

      {/* 3. Import statement */}
      <Section title="Import">
        <CodeBlock code={`import { Button } from '@vhyxui/react'`} />
      </Section>

      {/* 4. Variants */}
      <Section title="Variants" description="Six semantic variants covering every use case.">
        <ComponentExample label="All 6 variants" code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>`}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </ComponentExample>
      </Section>

      {/* 5. Sizes */}
      <Section title="Sizes" description="Four sizes mapping to --vhyx-size-* height tokens.">
        <ComponentExample label="xs, sm, md, lg" code={`<Button size="xs">Extra small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}>
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </ComponentExample>
      </Section>

      {/* 6. States */}
      <Section title="States">
        <ComponentExample label="Loading state — click to trigger" code={`<Button loading>Loading</Button>`}>
          <Button loading>Loading</Button>
          <Button loading variant="secondary">Saving</Button>
          <Button loading variant="outline">Processing</Button>
        </ComponentExample>
        <ComponentExample label="Disabled state" code={`<Button disabled>Disabled</Button>`}>
          <Button disabled>Disabled</Button>
          <Button disabled variant="secondary">Disabled</Button>
          <Button disabled variant="outline">Disabled</Button>
        </ComponentExample>
        <ComponentExample label="Icon + text" code={`<Button icon={<span>★</span>}>With icon</Button>
<Button icon={<span>★</span>} iconPosition="right">Icon right</Button>`}>
          <Button icon={<span aria-hidden="true">★</span>}>With icon</Button>
          <Button icon={<span aria-hidden="true">★</span>} iconPosition="right">Icon right</Button>
        </ComponentExample>
        <ComponentExample label="Icon only — requires aria-label" code={`<Button iconOnly icon={<span>★</span>} aria-label="Favourite" />`}>
          <Button iconOnly icon={<span aria-hidden="true">★</span>} aria-label="Favourite" />
          <Button iconOnly icon={<span aria-hidden="true">✕</span>} aria-label="Close" variant="ghost" />
        </ComponentExample>
        <ComponentExample label="asChild — renders as anchor" code={`<Button asChild variant="link">
  <a href="/docs">Documentation</a>
</Button>`}>
          <Button asChild variant="link">
            <a href="/components/button">Documentation</a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a href="/">Home</a>
          </Button>
        </ComponentExample>
      </Section>

      {/* 7. Props table */}
      <Section title="Props">
        <PropsTable props={PROPS} />
        <p className="docs-section-text">
          Button also accepts all standard <code>HTMLButtonElement</code> attributes.
        </p>
      </Section>

      {/* 8. Accessibility */}
      <Section title="Accessibility" description="What VhyxUI handles automatically.">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Renders as native <code>&lt;button&gt;</code> — no role override needed.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>disabled</code> attribute propagated — no separate <code>aria-disabled</code> needed.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>aria-busy</code> set automatically when <code>loading=true</code>.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Focus ring via <code>:focus-visible</code> — visible on keyboard, hidden on mouse click.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>iconOnly</code> warns in development if <code>aria-label</code> is missing.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>asChild</code> prevents nested interactive elements — correct DOM structure.</li>
        </ul>
      </Section>

      {/* 9. Keyboard navigation */}
      <Section title="Keyboard navigation">
        <KeyboardTable rows={KEYBOARD} />
      </Section>

      {/* 10. Agent contract */}
      <Section title="Agent contract" description="Default VhyxSeal contract shipped with every Button. The destructive variant auto-upgrades safetyLevel, destructive, and requiresConfirmation.">
        <div className="docs-contract">
          {CONTRACT_ROWS.map((row) => (
            <div key={row.key} className="docs-contract-row">
              <span className="docs-contract-key">{row.key}</span>
              <span className="docs-contract-value">{row.value}</span>
            </div>
          ))}
        </div>
        <CodeBlock code={`// Override the contract
<Button contract={{ safetyLevel: 'medium', requiresConfirmation: true }}>
  Submit
</Button>`} />
      </Section>

      {/* 11. Theming */}
      <Section title="Theming" description="Override these CSS tokens to theme the Button without touching component code.">
        <div className="docs-tokens-grid">
          {TOKENS.map((t) => (
            <div key={t.name} className="docs-token-item">
              <span className="docs-token-name">{t.name}</span>
              <span className="docs-token-desc">{t.desc}</span>
            </div>
          ))}
        </div>
        <CodeBlock code={`:root {
  --vhyx-color-accent: #7c3aed;        /* purple primary buttons */
  --vhyx-color-accent-hover: #6d28d9;  /* purple hover */
  --vhyx-radius-md: 9999px;            /* pill-shaped buttons */
}`} language="css" />
      </Section>

      {/* 12. Examples */}
      <Section title="Examples">
        <h3 style={{ fontSize: 'var(--vhyx-text-md)', fontWeight: 'var(--vhyx-weight-semibold)', marginBottom: 'var(--vhyx-space-3)', color: 'var(--vhyx-color-text)' }}>
          Form submit with loading state
        </h3>
        <ComponentExample
          label="Controlled loading — typical form submission pattern"
          code={`const [isSubmitting, setIsSubmitting] = useState(false)

async function handleSubmit() {
  setIsSubmitting(true)
  await saveData()
  setIsSubmitting(false)
}

<Button
  variant="primary"
  loading={isSubmitting}
  onClick={handleSubmit}
>
  Save changes
</Button>`}
        >
          <Button variant="primary" loading={loading} onClick={handleLoadingDemo}>
            Save changes
          </Button>
        </ComponentExample>

        <h3 style={{ fontSize: 'var(--vhyx-text-md)', fontWeight: 'var(--vhyx-weight-semibold)', marginBottom: 'var(--vhyx-space-3)', marginTop: 'var(--vhyx-space-6)', color: 'var(--vhyx-color-text)' }}>
          Action group
        </h3>
        <ComponentExample
          label="Confirm / Cancel pattern"
          code={`<div style={{ display: 'flex', gap: '0.5rem' }}>
  <Button variant="primary">Confirm</Button>
  <Button variant="outline">Cancel</Button>
</div>`}
        >
          <div style={{ display: 'flex', gap: 'var(--vhyx-space-2)' }}>
            <Button variant="primary">Confirm</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </ComponentExample>

        <h3 style={{ fontSize: 'var(--vhyx-text-md)', fontWeight: 'var(--vhyx-weight-semibold)', marginBottom: 'var(--vhyx-space-3)', marginTop: 'var(--vhyx-space-6)', color: 'var(--vhyx-color-text)' }}>
          Destructive action
        </h3>
        <ComponentExample
          label="Delete pattern — VhyxSeal contract auto-upgrades to safetyLevel: high"
          code={`<Button variant="destructive">Delete account</Button>`}
        >
          <Button variant="destructive">Delete account</Button>
        </ComponentExample>
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <span />
        <a href="/components/input" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>
          Input →
        </a>
      </div>
    </>
  );
}
