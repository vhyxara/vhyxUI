'use client';

import React, { useState } from 'react';
import { Switch, Separator } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlockSimple';
import { PropsTable } from '../../../components/PropsTable';
import { KeyboardTable } from '../../../components/KeyboardTable';
import type { PropDef } from '../../../components/PropsTable';
import type { KeyboardRow } from '../../../components/KeyboardTable';

const PROPS: PropDef[] = [
  { name: 'checked', type: 'boolean', description: 'Controlled on/off state.' },
  { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Default state (uncontrolled).' },
  { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Called when the switch is toggled.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the switch.' },
  { name: 'asChild', type: 'boolean', default: 'false', description: 'Renders as the child element via Slot.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override.' },
];

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Space', 'Enter'], action: 'Toggle on/off.' },
  { keys: ['Tab'], action: 'Move focus in/out.' },
];

export default function SwitchPage(): React.ReactElement {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <>
      <PageHeader name="Switch" description="Toggles a binary on/off state immediately. The thumb translates with spring easing — what makes Switch feel premium." tags={['Form element', 'Interactive']} />

      <Section title="Interactive example">
        <ComponentExample label="Toggle notifications" code={`<Switch checked={enabled} onCheckedChange={setEnabled} />`}>
          <div style={{ display: 'flex', gap: 'var(--vhyx-space-3)', alignItems: 'center' }}>
            <Switch checked={notifications} onCheckedChange={setNotifications} aria-label="Enable notifications" />
            <span style={{ fontSize: 'var(--vhyx-text-sm)' }}>Notifications {notifications ? 'on' : 'off'}</span>
          </div>
        </ComponentExample>
      </Section>

      <Section title="Import">
        <CodeBlock code={`import { Switch } from '@vhyxui/react'`} />
      </Section>

      <Section title="States">
        <ComponentExample label="On and Off">
          <Switch checked={false} aria-label="Off" />
          <Switch checked={true} aria-label="On" />
          <Switch checked={false} disabled aria-label="Disabled off" />
          <Switch checked={true} disabled aria-label="Disabled on" />
        </ComponentExample>
      </Section>

      <Section title="Sizes">
        <ComponentExample label="sm, md, lg">
          <Switch size="sm" aria-label="Small" />
          <Switch size="md" aria-label="Medium" />
          <Switch size="lg" aria-label="Large" />
        </ComponentExample>
      </Section>

      <Section title="Props"><PropsTable props={PROPS} /></Section>

      <Section title="Accessibility">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Renders as <code>&lt;button role="switch"&gt;</code>.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>aria-checked</code> reflects current state automatically.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Always provide <code>aria-label</code> or pair with a visible label element using <code>id</code>/<code>aria-labelledby</code>.</li>
        </ul>
      </Section>

      <Section title="Keyboard navigation"><KeyboardTable rows={KEYBOARD} /></Section>

      <Section title="Agent contract">
        <div className="docs-contract">
          {[{ key: 'type', value: '"action"' }, { key: 'intent', value: '"toggle-state"' }, { key: 'safetyLevel', value: '"low"' }, { key: 'reversible', value: 'true' }].map((r) => (
            <div key={r.key} className="docs-contract-row"><span className="docs-contract-key">{r.key}</span><span className="docs-contract-value">{r.value}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Theming">
        <div className="docs-tokens-grid">
          {[{ name: '--vhyx-color-accent', desc: 'Track color when on' }, { name: '--vhyx-color-bg-muted', desc: 'Track color when off' }, { name: '--vhyx-duration-normal', desc: 'Thumb transition' }, { name: '--vhyx-easing-spring', desc: 'Thumb easing' }].map((t) => (
            <div key={t.name} className="docs-token-item"><span className="docs-token-name">{t.name}</span><span className="docs-token-desc">{t.desc}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Examples">
        <ComponentExample label="Settings toggles" code={`<Switch checked={darkMode} onCheckedChange={setDarkMode} aria-label="Dark mode" />`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-4)', width: '20rem' }}>
            {[
              { label: 'Notifications', value: notifications, set: setNotifications },
              { label: 'Dark mode', value: darkMode, set: setDarkMode },
            ].map(({ label, value, set }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--vhyx-text-sm)' }}>{label}</span>
                <Switch checked={value} onCheckedChange={set} aria-label={label} />
              </div>
            ))}
          </div>
        </ComponentExample>
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <a href="/components/radio" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>← Radio</a>
        <a href="/components/form" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>Form & Field →</a>
      </div>
    </>
  );
}
