'use client';

import React, { useState } from 'react';
import { RadioGroup, RadioItem, Separator } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlockSimple';
import { PropsTable } from '../../../components/PropsTable';
import { KeyboardTable } from '../../../components/KeyboardTable';
import type { PropDef } from '../../../components/PropsTable';
import type { KeyboardRow } from '../../../components/KeyboardTable';

const GROUP_PROPS: PropDef[] = [
  { name: 'value', type: 'string', description: 'Controlled selected value.' },
  { name: 'defaultValue', type: 'string', description: 'Default value (uncontrolled).' },
  { name: 'onValueChange', type: '(value: string) => void', description: 'Called when selected value changes.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all items in the group.' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'vertical'", description: 'Layout direction.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of all radio items.' },
];

const ITEM_PROPS: PropDef[] = [
  { name: 'value', type: 'string', required: true, description: 'The value this item represents.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables this specific item.' },
];

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Arrow Down', 'Arrow Right'], action: 'Move to next option.' },
  { keys: ['Arrow Up', 'Arrow Left'], action: 'Move to previous option.' },
  { keys: ['Space'], action: 'Select the focused option.' },
  { keys: ['Tab'], action: 'Move focus out of the group.' },
];

export default function RadioPage(): React.ReactElement {
  const [plan, setPlan] = useState('starter');
  const [size, setSize] = useState('md');

  return (
    <>
      <PageHeader name="Radio" description="A group of mutually exclusive options. Arrow keys navigate between items — correct keyboard behavior per ARIA spec." tags={['Form element', 'Interactive']} />

      <Section title="Interactive example">
        <ComponentExample label="Plan selection" code={`<RadioGroup value={plan} onValueChange={setPlan}>\n  <RadioItem value="starter">Starter</RadioItem>\n  <RadioItem value="pro">Pro</RadioItem>\n  <RadioItem value="enterprise">Enterprise</RadioItem>\n</RadioGroup>`}>
          <RadioGroup value={plan} onValueChange={setPlan} aria-label="Pricing plan">
            <RadioItem value="starter">Starter — Free</RadioItem>
            <RadioItem value="pro">Pro — $12/mo</RadioItem>
            <RadioItem value="enterprise">Enterprise — Contact us</RadioItem>
          </RadioGroup>
          <span style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Selected: {plan}</span>
        </ComponentExample>
      </Section>

      <Section title="Import">
        <CodeBlock code={`import { RadioGroup, RadioItem } from '@vhyxui/react'`} />
      </Section>

      <Section title="Orientation">
        <ComponentExample label="Horizontal" code={`<RadioGroup orientation="horizontal">\n  <RadioItem value="yes">Yes</RadioItem>\n  <RadioItem value="no">No</RadioItem>\n</RadioGroup>`}>
          <RadioGroup orientation="horizontal" defaultValue="yes" aria-label="Confirmation">
            <RadioItem value="yes">Yes</RadioItem>
            <RadioItem value="no">No</RadioItem>
            <RadioItem value="maybe">Maybe</RadioItem>
          </RadioGroup>
        </ComponentExample>
        <ComponentExample label="With disabled item">
          <RadioGroup defaultValue="a" aria-label="Options">
            <RadioItem value="a">Option A</RadioItem>
            <RadioItem value="b">Option B</RadioItem>
            <RadioItem value="c" disabled>Option C (disabled)</RadioItem>
          </RadioGroup>
        </ComponentExample>
      </Section>

      <Section title="Sizes">
        <ComponentExample label="sm, md, lg">
          <RadioGroup size="sm" defaultValue="s" aria-label="Small">
            <RadioItem value="s">Small size</RadioItem>
          </RadioGroup>
          <RadioGroup size="md" defaultValue="m" aria-label="Medium">
            <RadioItem value="m">Medium size</RadioItem>
          </RadioGroup>
          <RadioGroup size="lg" defaultValue="l" aria-label="Large">
            <RadioItem value="l">Large size</RadioItem>
          </RadioGroup>
        </ComponentExample>
      </Section>

      <Section title="RadioGroup props"><PropsTable props={GROUP_PROPS} /></Section>
      <Section title="RadioItem props"><PropsTable props={ITEM_PROPS} /></Section>

      <Section title="Accessibility">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Arrow keys navigate between items — Tab moves focus out of the group entirely.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> First item in group gets <code>tabIndex=0</code> when nothing is selected.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Always provide <code>aria-label</code> on <code>RadioGroup</code> to identify the group.</li>
        </ul>
      </Section>

      <Section title="Keyboard navigation"><KeyboardTable rows={KEYBOARD} /></Section>

      <Section title="Agent contract">
        <div className="docs-contract">
          {[{ key: 'type', value: '"input"' }, { key: 'intent', value: '"select-exclusive-option"' }, { key: 'safetyLevel', value: '"low"' }].map((r) => (
            <div key={r.key} className="docs-contract-row"><span className="docs-contract-key">{r.key}</span><span className="docs-contract-value">{r.value}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Theming">
        <div className="docs-tokens-grid">
          {[{ name: '--vhyx-color-accent', desc: 'Selected indicator' }, { name: '--vhyx-radius-full', desc: 'Circular shape' }, { name: '--vhyx-duration-fast', desc: 'Selection animation' }].map((t) => (
            <div key={t.name} className="docs-token-item"><span className="docs-token-name">{t.name}</span><span className="docs-token-desc">{t.desc}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Examples">
        <ComponentExample label="Size selection" code={`<RadioGroup value={size} onValueChange={setSize} orientation="horizontal">\n  <RadioItem value="sm">S</RadioItem>\n  <RadioItem value="md">M</RadioItem>\n  <RadioItem value="lg">L</RadioItem>\n  <RadioItem value="xl">XL</RadioItem>\n</RadioGroup>`}>
          <RadioGroup value={size} onValueChange={setSize} orientation="horizontal" aria-label="T-shirt size">
            <RadioItem value="sm">S</RadioItem>
            <RadioItem value="md">M</RadioItem>
            <RadioItem value="lg">L</RadioItem>
            <RadioItem value="xl">XL</RadioItem>
          </RadioGroup>
          <span style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Selected: {size.toUpperCase()}</span>
        </ComponentExample>
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <a href="/components/checkbox" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>← Checkbox</a>
        <a href="/components/switch" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>Switch →</a>
      </div>
    </>
  );
}
