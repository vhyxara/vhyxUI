'use client';

import React, { useState } from 'react';
import { RadioGroup, RadioItem } from '@vhyxui/react';
import { radioContract } from '@vhyxui/core';
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
  { id: 'orientation',        text: 'Orientation',         level: 2 },
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

const GROUP_PROPS: PropDef[] = [
  { name: 'value', type: 'string', description: 'Controlled selected value.' },
  { name: 'defaultValue', type: 'string', description: 'Default value for uncontrolled usage.' },
  { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the selected value changes.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all items in the group.' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'vertical'", description: 'Layout direction of the radio group.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of all radio items.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override.' },
];

const ITEM_PROPS: PropDef[] = [
  { name: 'value', type: 'string', required: true, description: 'The value this item represents.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables this specific item independently of the group.' },
  { name: 'children', type: 'React.ReactNode', description: 'Label content for this option.' },
];

// ─── Keyboard ──────────────────────────────────────────────────────────────

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Arrow Down', 'Arrow Right'], action: 'Move focus to the next radio item (wraps around).' },
  { keys: ['Arrow Up', 'Arrow Left'],    action: 'Move focus to the previous radio item (wraps around).' },
  { keys: ['Space'],                     action: 'Select the currently focused item.' },
  { keys: ['Tab'],                       action: 'Move focus out of the radio group entirely.' },
  { keys: ['Shift + Tab'],               action: 'Move focus to the previous focusable element.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function RadioPage(): React.ReactElement {
  const [plan, setPlan] = useState('starter');
  const [size, setSize] = useState('md');
  const [theme, setTheme] = useState('system');

  return (
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Radio"
          description="Mutually exclusive option selection. Arrow keys navigate between items — correct ARIA roving tabindex behavior. Supports vertical and horizontal layouts."
          tags={['Form element', 'Interactive', 'VhyxSeal']}
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="Plan selection"
            code={`<RadioGroup value={plan} onValueChange={setPlan} aria-label="Pricing plan">
  <RadioItem value="starter">Starter — Free</RadioItem>
  <RadioItem value="pro">Pro — $12/mo</RadioItem>
  <RadioItem value="enterprise">Enterprise — Contact us</RadioItem>
</RadioGroup>`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-4)' }}>
              <RadioGroup value={plan} onValueChange={setPlan} aria-label="Pricing plan">
                <RadioItem value="starter">Starter — Free</RadioItem>
                <RadioItem value="pro">Pro — $12/mo</RadioItem>
                <RadioItem value="enterprise">Enterprise — Contact us</RadioItem>
              </RadioGroup>
              <span style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>
                Selected: {plan}
              </span>
            </div>
          </ComponentExample>
        </Section>

        <Section id="import" title="Import">
          <CodeBlock code={`import { RadioGroup, RadioItem } from '@vhyxui/react'`} language="tsx" />
        </Section>

        <Section id="orientation" title="Orientation">
          <ComponentExample
            label="Vertical (default)"
            code={`<RadioGroup defaultValue="yes" aria-label="Confirmation">
  <RadioItem value="yes">Yes</RadioItem>
  <RadioItem value="no">No</RadioItem>
  <RadioItem value="maybe">Maybe</RadioItem>
</RadioGroup>`}
          >
            <RadioGroup defaultValue="yes" aria-label="Confirmation">
              <RadioItem value="yes">Yes</RadioItem>
              <RadioItem value="no">No</RadioItem>
              <RadioItem value="maybe">Maybe</RadioItem>
            </RadioGroup>
          </ComponentExample>
          <ComponentExample
            label="Horizontal"
            code={`<RadioGroup orientation="horizontal" defaultValue="yes" aria-label="Confirmation">
  <RadioItem value="yes">Yes</RadioItem>
  <RadioItem value="no">No</RadioItem>
  <RadioItem value="maybe">Maybe</RadioItem>
</RadioGroup>`}
          >
            <RadioGroup orientation="horizontal" defaultValue="yes" aria-label="Quick answer">
              <RadioItem value="yes">Yes</RadioItem>
              <RadioItem value="no">No</RadioItem>
              <RadioItem value="maybe">Maybe</RadioItem>
            </RadioGroup>
          </ComponentExample>
        </Section>

        <Section id="sizes" title="Sizes">
          <ComponentExample
            label="sm, md, lg"
            code={`<RadioGroup size="sm" defaultValue="s" aria-label="Small">
  <RadioItem value="s">Small</RadioItem>
</RadioGroup>
<RadioGroup size="md" defaultValue="m" aria-label="Medium">
  <RadioItem value="m">Medium</RadioItem>
</RadioGroup>
<RadioGroup size="lg" defaultValue="l" aria-label="Large">
  <RadioItem value="l">Large</RadioItem>
</RadioGroup>`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-5)' }}>
              <RadioGroup size="sm" defaultValue="s" aria-label="Small">
                <RadioItem value="s">Small radio</RadioItem>
              </RadioGroup>
              <RadioGroup size="md" defaultValue="m" aria-label="Medium">
                <RadioItem value="m">Medium radio</RadioItem>
              </RadioGroup>
              <RadioGroup size="lg" defaultValue="l" aria-label="Large">
                <RadioItem value="l">Large radio</RadioItem>
              </RadioGroup>
            </div>
          </ComponentExample>
        </Section>

        <Section id="states" title="States">
          <ComponentExample label="With disabled item">
            <RadioGroup defaultValue="a" aria-label="Options with disabled">
              <RadioItem value="a">Option A (available)</RadioItem>
              <RadioItem value="b">Option B (available)</RadioItem>
              <RadioItem value="c" disabled>Option C (disabled)</RadioItem>
            </RadioGroup>
          </ComponentExample>
          <ComponentExample label="Entire group disabled">
            <RadioGroup defaultValue="a" disabled aria-label="Disabled group">
              <RadioItem value="a">Option A</RadioItem>
              <RadioItem value="b">Option B</RadioItem>
            </RadioGroup>
          </ComponentExample>
        </Section>

        <Section id="props" title="Props">
          <h3 className="docs-subsection-heading">RadioGroup</h3>
          <PropsTable props={GROUP_PROPS} />
          <h3 className="docs-subsection-heading">RadioItem</h3>
          <PropsTable props={ITEM_PROPS} />
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Uses roving <code>tabIndex</code> — only the selected (or first) item is in the tab order.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>role="radiogroup"</code> on the group. <code>role="radio"</code> and <code>aria-checked</code> on each item.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Arrow keys navigate between options without leaving the group — Tab exits entirely.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Disabled items have <code>aria-disabled="true"</code> and are skipped during arrow key navigation.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Always provide <code>aria-label</code> on <code>RadioGroup</code> to name the group for screen readers.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Focus ring via <code>:focus-visible</code> — visible on keyboard, hidden on mouse click.</li>
          </ul>
        </Section>

        <Section id="keyboard" title="Keyboard navigation">
          <KeyboardTable rows={KEYBOARD} />
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every RadioGroup.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(radioContract, null, 2)}
          />
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme RadioGroup.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-color-accent',       desc: 'Selected indicator fill color' },
              { name: '--vhyx-color-accent-hover',  desc: 'Indicator hover color' },
              { name: '--vhyx-color-border-strong', desc: 'Unselected border color' },
              { name: '--vhyx-color-surface',       desc: 'Unselected background' },
              { name: '--vhyx-radius-full',         desc: 'Circular shape of the radio button' },
              { name: '--vhyx-duration-fast',       desc: 'Selection animation duration' },
              { name: '--vhyx-easing-spring',       desc: 'Selection animation easing' },
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
          <h3 className="docs-subsection-heading">T-shirt size selector</h3>
          <ComponentExample
            label="Horizontal size picker"
            code={`<RadioGroup value={size} onValueChange={setSize} orientation="horizontal" aria-label="T-shirt size">
  <RadioItem value="xs">XS</RadioItem>
  <RadioItem value="sm">S</RadioItem>
  <RadioItem value="md">M</RadioItem>
  <RadioItem value="lg">L</RadioItem>
  <RadioItem value="xl">XL</RadioItem>
</RadioGroup>`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-3)' }}>
              <RadioGroup value={size} onValueChange={setSize} orientation="horizontal" aria-label="T-shirt size">
                <RadioItem value="xs">XS</RadioItem>
                <RadioItem value="sm">S</RadioItem>
                <RadioItem value="md">M</RadioItem>
                <RadioItem value="lg">L</RadioItem>
                <RadioItem value="xl">XL</RadioItem>
              </RadioGroup>
              <span style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>
                Selected: {size.toUpperCase()}
              </span>
            </div>
          </ComponentExample>

          <h3 className="docs-subsection-heading">Inside a Field</h3>
          <CodeBlock
            language="tsx"
            code={`<Field name="theme" label="Appearance">
  <RadioGroup
    value={theme}
    onValueChange={setTheme}
    aria-label="Appearance theme"
  >
    <RadioItem value="light">Light</RadioItem>
    <RadioItem value="dark">Dark</RadioItem>
    <RadioItem value="system">System</RadioItem>
  </RadioGroup>
</Field>`}
          />

          <h3 className="docs-subsection-heading">Theme picker (live)</h3>
          <ComponentExample
            label="Appearance setting"
            code={`<RadioGroup value={theme} onValueChange={setTheme} aria-label="Appearance theme">
  <RadioItem value="light">Light</RadioItem>
  <RadioItem value="dark">Dark</RadioItem>
  <RadioItem value="system">System default</RadioItem>
</RadioGroup>`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-3)' }}>
              <RadioGroup value={theme} onValueChange={setTheme} aria-label="Appearance theme">
                <RadioItem value="light">Light</RadioItem>
                <RadioItem value="dark">Dark</RadioItem>
                <RadioItem value="system">System default</RadioItem>
              </RadioGroup>
              <span style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>
                Active: {theme}
              </span>
            </div>
          </ComponentExample>
        </Section>

        <PageNav
          prev={{ title: 'Checkbox', href: '/components/checkbox' }}
          next={{ title: 'Switch', href: '/components/switch' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
