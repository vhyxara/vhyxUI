'use client';

import React, { useState } from 'react';
import { Tabs, Button, Separator } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlockSimple';
import { PropsTable } from '../../../components/PropsTable';
import { KeyboardTable } from '../../../components/KeyboardTable';
import type { PropDef } from '../../../components/PropsTable';
import type { KeyboardRow } from '../../../components/KeyboardTable';

const PROPS: PropDef[] = [
  { name: 'value', type: 'string', description: 'Controlled active tab value.' },
  { name: 'defaultValue', type: 'string', description: 'Default active tab (uncontrolled).' },
  { name: 'onValueChange', type: '(value: string) => void', description: 'Called when active tab changes.' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout direction.' },
  { name: 'variant', type: "'default' | 'pills' | 'underline' | 'enclosed'", default: "'default'", description: 'Visual style of the tabs.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the tab triggers.' },
];

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Arrow Right', 'Arrow Down'], action: 'Move to next tab (cycles).' },
  { keys: ['Arrow Left', 'Arrow Up'], action: 'Move to previous tab (cycles).' },
  { keys: ['Home'], action: 'Jump to first tab.' },
  { keys: ['End'], action: 'Jump to last tab.' },
];

export default function TabsPage(): React.ReactElement {
  const [tab, setTab] = useState('overview');

  return (
    <>
      <PageHeader name="Tabs" description="Four visual variants. Sliding indicator via CSS transform (no layout recalculation). Full ARIA tab pattern with arrow key navigation." tags={['Navigation', 'Compound', 'VhyxSeal']} />

      <Section title="Interactive example">
        <ComponentExample label="Content tabs" code={`<Tabs value={tab} onValueChange={setTab}>\n  <Tabs.List>\n    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>\n    <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>\n  </Tabs.List>\n  <Tabs.Content value="overview">...</Tabs.Content>\n</Tabs>`}>
          <Tabs value={tab} onValueChange={setTab} style={{ width: '28rem' }}>
            <Tabs.List>
              <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
              <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
              <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
              <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="overview">
              <div style={{ padding: 'var(--vhyx-space-4)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Overview content — project summary and key metrics.</div>
            </Tabs.Content>
            <Tabs.Content value="analytics">
              <div style={{ padding: 'var(--vhyx-space-4)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Analytics content — charts and trends.</div>
            </Tabs.Content>
            <Tabs.Content value="reports">
              <div style={{ padding: 'var(--vhyx-space-4)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Reports content — exported data.</div>
            </Tabs.Content>
            <Tabs.Content value="settings">
              <div style={{ padding: 'var(--vhyx-space-4)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Settings content — project configuration.</div>
            </Tabs.Content>
          </Tabs>
        </ComponentExample>
      </Section>

      <Section title="Import">
        <CodeBlock code={`import { Tabs } from '@vhyxui/react'

Tabs.List, Tabs.Trigger, Tabs.Content`} />
      </Section>

      <Section title="Variants">
        {(['default', 'pills', 'underline', 'enclosed'] as const).map((variant) => (
          <ComponentExample key={variant} label={`variant="${variant}"`} code={`<Tabs variant="${variant}">...</Tabs>`}>
            <Tabs defaultValue="one" variant={variant} style={{ width: '22rem' }}>
              <Tabs.List>
                <Tabs.Trigger value="one">First</Tabs.Trigger>
                <Tabs.Trigger value="two">Second</Tabs.Trigger>
                <Tabs.Trigger value="three">Third</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="one"><div style={{ padding: 'var(--vhyx-space-3)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Content for First tab</div></Tabs.Content>
              <Tabs.Content value="two"><div style={{ padding: 'var(--vhyx-space-3)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Content for Second tab</div></Tabs.Content>
              <Tabs.Content value="three"><div style={{ padding: 'var(--vhyx-space-3)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Content for Third tab</div></Tabs.Content>
            </Tabs>
          </ComponentExample>
        ))}
      </Section>

      <Section title="Sizes">
        <ComponentExample label="sm, md, lg">
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <Tabs key={s} defaultValue="a" size={s} style={{ width: '14rem' }}>
              <Tabs.List>
                <Tabs.Trigger value="a">Tab A</Tabs.Trigger>
                <Tabs.Trigger value="b">Tab B</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="a"><div style={{ padding: 'var(--vhyx-space-2)', fontSize: 'var(--vhyx-text-xs)' }}>Content A</div></Tabs.Content>
              <Tabs.Content value="b"><div style={{ padding: 'var(--vhyx-space-2)', fontSize: 'var(--vhyx-text-xs)' }}>Content B</div></Tabs.Content>
            </Tabs>
          ))}
        </ComponentExample>
      </Section>

      <Section title="Props"><PropsTable props={PROPS} /></Section>

      <Section title="Accessibility">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>role="tablist"</code> on List, <code>role="tab"</code> on Trigger, <code>role="tabpanel"</code> on Content.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>aria-selected</code> on active tab, <code>aria-controls</code> linking trigger to panel.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Arrow key navigation between tabs — Tab key moves focus out.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Sliding indicator via CSS <code>transform</code> — zero layout recalculation.</li>
        </ul>
      </Section>

      <Section title="Keyboard navigation"><KeyboardTable rows={KEYBOARD} /></Section>

      <Section title="Agent contract">
        <div className="docs-contract">
          {[{ key: 'type', value: '"navigation"' }, { key: 'intent', value: '"switch-content-panel"' }, { key: 'safetyLevel', value: '"low"' }].map((r) => (
            <div key={r.key} className="docs-contract-row"><span className="docs-contract-key">{r.key}</span><span className="docs-contract-value">{r.value}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Theming">
        <div className="docs-tokens-grid">
          {[{ name: '--vhyx-color-accent', desc: 'Active indicator' }, { name: '--vhyx-duration-normal', desc: 'Indicator transition' }, { name: '--vhyx-easing-spring', desc: 'Indicator easing' }, { name: '--vhyx-radius-md', desc: 'Pills border radius' }].map((t) => (
            <div key={t.name} className="docs-token-item"><span className="docs-token-name">{t.name}</span><span className="docs-token-desc">{t.desc}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Examples">
        <ComponentExample label="Code editor tabs (enclosed)" code={`<Tabs variant="enclosed" defaultValue="tsx">...</Tabs>`}>
          <Tabs defaultValue="tsx" variant="enclosed" style={{ width: '24rem' }}>
            <Tabs.List>
              <Tabs.Trigger value="tsx">Button.tsx</Tabs.Trigger>
              <Tabs.Trigger value="css">Button.module.css</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="tsx"><div style={{ padding: 'var(--vhyx-space-3)', fontFamily: 'var(--vhyx-font-mono)', fontSize: 'var(--vhyx-text-xs)', color: 'var(--vhyx-color-text-subtle)' }}>{'<Button variant="primary">…</Button>'}</div></Tabs.Content>
            <Tabs.Content value="css"><div style={{ padding: 'var(--vhyx-space-3)', fontFamily: 'var(--vhyx-font-mono)', fontSize: 'var(--vhyx-text-xs)', color: 'var(--vhyx-color-text-subtle)' }}>{'.button { … }'}</div></Tabs.Content>
          </Tabs>
        </ComponentExample>
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <a href="/components/drawer" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>← Drawer</a>
        <a href="/components/popover" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>Popover →</a>
      </div>
    </>
  );
}
