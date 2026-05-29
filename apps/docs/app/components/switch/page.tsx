'use client';

import React, { useState } from 'react';
import { Switch } from '@vhyxui/react';
import { switchContract } from '@vhyxui/core';
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
  { id: 'states',             text: 'States',              level: 2 },
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
  { name: 'checked', type: 'boolean', description: 'Controlled on/off state.' },
  { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Default state for uncontrolled usage.' },
  { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Called when the switch is toggled.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the switch.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables interaction (from HTMLButtonElement).' },
  { name: 'asChild', type: 'boolean', default: 'false', description: 'Renders as the child element via Slot.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override.' },
  { name: 'className', type: 'string', description: 'Additional CSS classes appended to the switch.' },
];

// ─── Keyboard ──────────────────────────────────────────────────────────────

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Space', 'Enter'], action: 'Toggle the switch on or off.' },
  { keys: ['Tab'],            action: 'Move focus to the next focusable element.' },
  { keys: ['Shift + Tab'],    action: 'Move focus to the previous focusable element.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function SwitchPage(): React.ReactElement {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [marketing, setMarketing] = useState(false);

  return (
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Switch"
          description="Toggles a binary on/off state with immediate effect. The thumb translates with spring easing for a premium feel. Use when the change applies instantly — use Checkbox for form submissions."
          tags={['Form element', 'Interactive', 'VhyxSeal']}
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="Toggle notifications"
            code={`<Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Enable notifications" />`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-3)', alignItems: 'center' }}>
              <Switch checked={notifications} onCheckedChange={setNotifications} aria-label="Enable notifications" />
              <span style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>
                Notifications {notifications ? 'enabled' : 'disabled'}
              </span>
            </div>
          </ComponentExample>
        </Section>

        <Section id="import" title="Import">
          <CodeBlock code={`import { Switch } from '@vhyxui/react'`} language="tsx" />
        </Section>

        <Section id="states" title="States">
          <ComponentExample
            label="Off, On, Disabled off, Disabled on"
            code={`<Switch checked={false} aria-label="Off" />
<Switch checked={true} aria-label="On" />
<Switch checked={false} disabled aria-label="Disabled off" />
<Switch checked={true} disabled aria-label="Disabled on" />`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-6)', alignItems: 'center' }}>
              {[
                { label: 'Off',          node: <Switch checked={false} aria-label="Off" /> },
                { label: 'On',           node: <Switch checked={true}  aria-label="On" /> },
                { label: 'Disabled off', node: <Switch checked={false} disabled aria-label="Disabled off" /> },
                { label: 'Disabled on',  node: <Switch checked={true}  disabled aria-label="Disabled on" /> },
              ].map(({ label, node }) => (
                <span key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--vhyx-space-2)', fontSize: 'var(--vhyx-text-xs)', color: 'var(--vhyx-color-text-muted)' }}>
                  {node}{label}
                </span>
              ))}
            </div>
          </ComponentExample>
        </Section>

        <Section id="sizes" title="Sizes">
          <ComponentExample
            label="sm, md, lg"
            code={`<Switch size="sm" aria-label="Small" />
<Switch size="md" aria-label="Medium" />
<Switch size="lg" aria-label="Large" />`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-6)', alignItems: 'center' }}>
              <Switch size="sm" defaultChecked aria-label="Small" />
              <Switch size="md" defaultChecked aria-label="Medium" />
              <Switch size="lg" defaultChecked aria-label="Large" />
            </div>
          </ComponentExample>
        </Section>

        <Section id="props" title="Props">
          <PropsTable props={PROPS} />
          <p className="docs-section-text">
            Also accepts all standard <code>HTMLButtonElement</code> attributes.
          </p>
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Renders as <code>&lt;button role="switch"&gt;</code> — correct semantics for a toggle.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>aria-checked</code> reflects the current on/off state automatically.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Always provide <code>aria-label</code> or pair with a visible <code>&lt;label&gt;</code> using <code>htmlFor</code>.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Focus ring via <code>:focus-visible</code> — visible on keyboard, hidden on mouse click.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Use Switch for immediate-effect settings. Use Checkbox for form values submitted on save.</li>
          </ul>
        </Section>

        <Section id="keyboard" title="Keyboard navigation">
          <KeyboardTable rows={KEYBOARD} />
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every Switch.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(switchContract, null, 2)}
          />
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme Switch.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-color-accent',    desc: 'Track color when on' },
              { name: '--vhyx-color-accent-hover', desc: 'Track hover color when on' },
              { name: '--vhyx-color-bg-muted',  desc: 'Track color when off' },
              { name: '--vhyx-color-surface',   desc: 'Thumb color' },
              { name: '--vhyx-radius-full',     desc: 'Track and thumb border radius' },
              { name: '--vhyx-duration-normal', desc: 'Thumb slide duration' },
              { name: '--vhyx-easing-spring',   desc: 'Thumb slide easing' },
              { name: '--vhyx-shadow-focus',    desc: 'Focus ring' },
            ].map((t) => (
              <div key={t.name} className="docs-token-item">
                <span className="docs-token-name">{t.name}</span>
                <span className="docs-token-desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="examples" title="Examples">
          <h3 className="docs-subsection-heading">Settings panel</h3>
          <ComponentExample
            label="Multiple toggles in a settings list"
            code={`<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '20rem' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span>Notifications</span>
    <Switch checked={notifications} onCheckedChange={setNotifications} aria-label="Notifications" />
  </div>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <span>Dark mode</span>
    <Switch checked={darkMode} onCheckedChange={setDarkMode} aria-label="Dark mode" />
  </div>
</div>`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-4)', width: '22rem' }}>
              {[
                { label: 'Push notifications', value: notifications, set: setNotifications },
                { label: 'Dark mode',           value: darkMode,       set: setDarkMode },
                { label: 'Marketing emails',    value: marketing,      set: setMarketing },
              ].map(({ label, value, set }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 'var(--vhyx-text-sm)' }}>{label}</span>
                  <Switch checked={value} onCheckedChange={set} aria-label={label} />
                </div>
              ))}
            </div>
          </ComponentExample>

          <h3 className="docs-subsection-heading">Inside a Field</h3>
          <CodeBlock
            language="tsx"
            code={`<Field name="notifications" label="Push notifications" hint="Receive alerts for important activity">
  <Switch
    checked={form.watch('notifications')}
    onCheckedChange={v => form.setValue('notifications', v)}
    aria-label="Enable push notifications"
  />
</Field>`}
          />
        </Section>

        <PageNav
          prev={{ title: 'Radio', href: '/components/radio' }}
          next={{ title: 'Form', href: '/components/form' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
