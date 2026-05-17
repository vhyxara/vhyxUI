'use client';

import React, { useState } from 'react';
import { Textarea, Separator } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlock';
import { PropsTable } from '../../../components/PropsTable';
import { KeyboardTable } from '../../../components/KeyboardTable';
import type { PropDef } from '../../../components/PropsTable';
import type { KeyboardRow } from '../../../components/KeyboardTable';

const PROPS: PropDef[] = [
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the textarea.' },
  { name: 'resize', type: "'none' | 'vertical' | 'horizontal' | 'both' | 'auto'", default: "'vertical'", description: 'Resize behavior. auto grows with content.' },
  { name: 'minRows', type: 'number', default: '3', description: 'Minimum number of visible rows.' },
  { name: 'maxRows', type: 'number', description: 'Maximum rows before scrolling activates (only when resize="auto").' },
  { name: 'showCount', type: 'boolean', default: 'false', description: 'Shows character count. Use with maxLength.' },
  { name: 'error', type: 'boolean', default: 'false', description: 'Applies error styling and sets aria-invalid.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override.' },
];

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Tab'], action: 'Move focus in/out of the textarea.' },
  { keys: ['Shift + Enter'], action: 'New line (standard browser behavior).' },
];

export default function TextareaPage(): React.ReactElement {
  const [value, setValue] = useState('');

  return (
    <>
      <PageHeader name="Textarea" description="Multi-line text input with auto-resize, character count, and error state." tags={['Form element', 'Interactive']} />

      <Section title="Interactive example">
        <ComponentExample label="Auto-resize textarea" code={`<Textarea resize="auto" placeholder="Write something…" />`}>
          <Textarea resize="auto" value={value} onChange={(e) => { setValue(e.target.value); }} placeholder="Write something…" showCount maxLength={200} style={{ width: '28rem' }} />
        </ComponentExample>
      </Section>

      <Section title="Import">
        <CodeBlock code={`import { Textarea } from '@vhyxui/react'`} />
      </Section>

      <Section title="Variants">
        <ComponentExample label="Default" code={`<Textarea placeholder="Default textarea" />`}>
          <Textarea placeholder="Default textarea" style={{ width: '22rem' }} />
        </ComponentExample>
        <ComponentExample label="With character count" code={`<Textarea showCount maxLength={280} placeholder="Tweet something…" />`}>
          <Textarea showCount maxLength={280} placeholder="Tweet something…" style={{ width: '22rem' }} />
        </ComponentExample>
        <ComponentExample label="Error state" code={`<Textarea error placeholder="Required field" />`}>
          <Textarea error placeholder="This field is required" style={{ width: '22rem' }} />
        </ComponentExample>
        <ComponentExample label="Non-resizable" code={`<Textarea resize="none" />`}>
          <Textarea resize="none" placeholder="Fixed size" style={{ width: '22rem' }} />
        </ComponentExample>
      </Section>

      <Section title="Sizes">
        <ComponentExample label="sm, md, lg">
          <Textarea size="sm" placeholder="Small" style={{ width: '18rem' }} minRows={2} />
          <Textarea size="md" placeholder="Medium" style={{ width: '18rem' }} minRows={2} />
          <Textarea size="lg" placeholder="Large" style={{ width: '18rem' }} minRows={2} />
        </ComponentExample>
      </Section>

      <Section title="States">
        <ComponentExample label="Disabled">
          <Textarea disabled placeholder="Disabled textarea" style={{ width: '22rem' }} />
        </ComponentExample>
      </Section>

      <Section title="Props"><PropsTable props={PROPS} /></Section>

      <Section title="Accessibility">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>aria-invalid</code> set when <code>error=true</code>.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Character count is live — announced by screen readers when <code>showCount=true</code>.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Pair with <code>Field</code> for automatic label and error associations.</li>
        </ul>
      </Section>

      <Section title="Keyboard navigation"><KeyboardTable rows={KEYBOARD} /></Section>

      <Section title="Agent contract">
        <div className="docs-contract">
          {[{ key: 'type', value: '"input"' }, { key: 'intent', value: '"collect-text-input"' }, { key: 'safetyLevel', value: '"low"' }].map((r) => (
            <div key={r.key} className="docs-contract-row"><span className="docs-contract-key">{r.key}</span><span className="docs-contract-value">{r.value}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Theming">
        <div className="docs-tokens-grid">
          {[{ name: '--vhyx-size-sm/md/lg', desc: 'Min height' }, { name: '--vhyx-radius-md', desc: 'Border radius' }, { name: '--vhyx-color-border', desc: 'Default border' }].map((t) => (
            <div key={t.name} className="docs-token-item"><span className="docs-token-name">{t.name}</span><span className="docs-token-desc">{t.desc}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Examples">
        <ComponentExample label="Bio field with counter" code={`<Textarea showCount maxLength={160} placeholder="Tell us about yourself…" resize="none" />`}>
          <Textarea showCount maxLength={160} placeholder="Tell us about yourself…" resize="none" style={{ width: '28rem' }} />
        </ComponentExample>
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <a href="/components/input" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>← Input</a>
        <a href="/components/checkbox" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>Checkbox →</a>
      </div>
    </>
  );
}
