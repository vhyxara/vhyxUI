'use client';

import React, { useState, useEffect } from 'react';
import { Progress, Button, Separator } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlock';
import { PropsTable } from '../../../components/PropsTable';
import type { PropDef } from '../../../components/PropsTable';

const PROPS: PropDef[] = [
  { name: 'value', type: 'number', description: 'Current progress value. Omit for indeterminate.' },
  { name: 'max', type: 'number', default: '100', description: 'Maximum value.' },
  { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Shows an indeterminate animation.' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Height of the progress bar.' },
  { name: 'variant', type: "'default' | 'success' | 'warning' | 'danger'", default: "'default'", description: 'Color variant.' },
  { name: 'showLabel', type: 'boolean', default: 'false', description: 'Shows the percentage label.' },
  { name: 'label', type: 'string', description: 'Custom label text (overrides percentage).' },
];

export default function ProgressPage(): React.ReactElement {
  const [value, setValue] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setValue((v) => {
        if (v >= 100) { setRunning(false); return 100; }
        return v + 5;
      });
    }, 150);
    return () => { clearInterval(id); };
  }, [running]);

  return (
    <>
      <PageHeader name="Progress" description="Displays task completion. Supports determinate and indeterminate states, four semantic variants, and four sizes." tags={['Display', 'VhyxSeal']} />

      <Section title="Interactive example">
        <ComponentExample label="Click to simulate upload" code={`<Progress value={value} showLabel />`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-4)', width: '28rem' }}>
            <Progress value={value} showLabel variant={value === 100 ? 'success' : 'default'} />
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-2)' }}>
              <Button size="sm" onClick={() => { setValue(0); setRunning(true); }}>Start upload</Button>
              <Button size="sm" variant="outline" onClick={() => { setValue(0); setRunning(false); }}>Reset</Button>
            </div>
          </div>
        </ComponentExample>
      </Section>

      <Section title="Import"><CodeBlock code={`import { Progress } from '@vhyxui/react'`} /></Section>

      <Section title="Variants">
        <ComponentExample label="All semantic variants" code={`<Progress value={75} variant="default" showLabel />`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-3)', width: '28rem' }}>
            <Progress value={75} variant="default" showLabel label="Uploading…" />
            <Progress value={100} variant="success" showLabel label="Complete" />
            <Progress value={60} variant="warning" showLabel label="Low storage" />
            <Progress value={20} variant="danger" showLabel label="Critical" />
          </div>
        </ComponentExample>
        <ComponentExample label="Indeterminate" code={`<Progress indeterminate />`}>
          <Progress indeterminate style={{ width: '28rem' }} />
        </ComponentExample>
      </Section>

      <Section title="Sizes">
        <ComponentExample label="xs, sm, md, lg">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-3)', width: '28rem' }}>
            <Progress value={60} size="xs" />
            <Progress value={60} size="sm" />
            <Progress value={60} size="md" />
            <Progress value={60} size="lg" />
          </div>
        </ComponentExample>
      </Section>

      <Section title="Props"><PropsTable props={PROPS} /></Section>

      <Section title="Accessibility">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>role="progressbar"</code> with <code>aria-valuenow</code>, <code>aria-valuemin</code>, <code>aria-valuemax</code>.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Indeterminate mode omits <code>aria-valuenow</code> per ARIA spec.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Provide <code>aria-label</code> or <code>aria-labelledby</code> for context.</li>
        </ul>
      </Section>

      <Section title="Agent contract">
        <div className="docs-contract">
          {[{ key: 'type', value: '"display"' }, { key: 'intent', value: '"show-progress"' }, { key: 'safetyLevel', value: '"low"' }].map((r) => (
            <div key={r.key} className="docs-contract-row"><span className="docs-contract-key">{r.key}</span><span className="docs-contract-value">{r.value}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Theming">
        <div className="docs-tokens-grid">
          {[{ name: '--vhyx-color-accent', desc: 'Default fill' }, { name: '--vhyx-radius-full', desc: 'Track radius' }, { name: '--vhyx-duration-slow', desc: 'Fill transition' }].map((t) => (
            <div key={t.name} className="docs-token-item"><span className="docs-token-name">{t.name}</span><span className="docs-token-desc">{t.desc}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Examples">
        <ComponentExample label="Multi-step upload" code={`<Progress value={value} max={3} showLabel label={\`Step \${value} of 3\`} />`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-2)', width: '28rem' }}>
            <Progress value={2} max={4} showLabel label="Step 2 of 4" />
          </div>
        </ComponentExample>
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <a href="/components/badge" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>← Badge</a>
        <a href="/components/spinner" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>Spinner →</a>
      </div>
    </>
  );
}
