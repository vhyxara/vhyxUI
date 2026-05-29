'use client';

import React, { useState, useEffect } from 'react';
import { Progress, Button } from '@vhyxui/react';
import { progressContract } from '@vhyxui/core';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlockSimple';
import { PropsTable } from '../../../components/PropsTable';
import { OnThisPage, type PageHeading } from '../../../components/OnThisPage';
import { PageNav } from '../../../components/PageNav';
import type { PropDef } from '../../../components/PropsTable';

// ─── On This Page ──────────────────────────────────────────────────────────

const HEADINGS: ReadonlyArray<PageHeading> = [
  { id: 'interactive-example', text: 'Interactive Example', level: 2 },
  { id: 'import',             text: 'Import',              level: 2 },
  { id: 'variants',           text: 'Variants',            level: 2 },
  { id: 'sizes',              text: 'Sizes',               level: 2 },
  { id: 'states',             text: 'States',              level: 2 },
  { id: 'props',              text: 'Props',               level: 2 },
  { id: 'accessibility',      text: 'Accessibility',       level: 2 },
  { id: 'agent-contract',     text: 'Agent Contract',      level: 2 },
  { id: 'theming',            text: 'Theming',             level: 2 },
  { id: 'examples',           text: 'Examples',            level: 2 },
] as const;

// ─── Props ─────────────────────────────────────────────────────────────────

const PROPS: PropDef[] = [
  { name: 'value', type: 'number', description: 'Current progress value (0–max). Omit or leave undefined for indeterminate.' },
  { name: 'max', type: 'number', default: '100', description: 'Maximum value. Used to calculate percentage.' },
  { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Shows the indeterminate animation.' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Height of the progress track.' },
  { name: 'variant', type: "'default' | 'success' | 'warning' | 'danger'", default: "'default'", description: 'Semantic color variant.' },
  { name: 'showLabel', type: 'boolean', default: 'false', description: 'Displays the percentage or custom label text.' },
  { name: 'label', type: 'string', description: 'Custom label text. Overrides the auto-calculated percentage.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

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
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Progress"
          description="Shows task completion as a filled track. Supports determinate (percentage-based) and indeterminate (animated) modes, four semantic variants, and four sizes."
          tags={['Display', 'VhyxSeal']}
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="Simulated upload — click Start to begin"
            code={`<Progress value={value} showLabel variant={value === 100 ? 'success' : 'default'} />`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-4)', width: '28rem' }}>
              <Progress value={value} showLabel variant={value === 100 ? 'success' : 'default'} />
              <div style={{ display: 'flex', gap: 'var(--vhyx-space-2)' }}>
                <Button size="sm" onClick={() => { setValue(0); setRunning(true); }}>Start upload</Button>
                <Button size="sm" variant="outline" onClick={() => { setValue(0); setRunning(false); }}>Reset</Button>
              </div>
            </div>
          </ComponentExample>
        </Section>

        <Section id="import" title="Import">
          <CodeBlock code={`import { Progress } from '@vhyxui/react'`} language="tsx" />
        </Section>

        <Section id="variants" title="Variants">
          <ComponentExample
            label="All semantic variants"
            code={`<Progress value={75} variant="default" showLabel label="Uploading…" />
<Progress value={100} variant="success" showLabel label="Complete" />
<Progress value={60} variant="warning" showLabel label="Low storage" />
<Progress value={20} variant="danger" showLabel label="Critical" />`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-3)', width: '28rem' }}>
              <Progress value={75} variant="default" showLabel label="Uploading…" />
              <Progress value={100} variant="success" showLabel label="Complete" />
              <Progress value={60} variant="warning" showLabel label="Low storage" />
              <Progress value={20} variant="danger" showLabel label="Critical" />
            </div>
          </ComponentExample>
        </Section>

        <Section id="sizes" title="Sizes">
          <ComponentExample
            label="xs, sm, md, lg"
            code={`<Progress value={60} size="xs" />
<Progress value={60} size="sm" />
<Progress value={60} size="md" />
<Progress value={60} size="lg" />`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-3)', width: '28rem' }}>
              <Progress value={60} size="xs" />
              <Progress value={60} size="sm" />
              <Progress value={60} size="md" />
              <Progress value={60} size="lg" />
            </div>
          </ComponentExample>
        </Section>

        <Section id="states" title="States">
          <ComponentExample
            label="Indeterminate — for unknown duration operations"
            code={`<Progress indeterminate />`}
          >
            <Progress indeterminate style={{ width: '28rem' }} />
          </ComponentExample>
        </Section>

        <Section id="props" title="Props">
          <PropsTable props={PROPS} />
          <p className="docs-section-text">Also accepts all standard <code>HTMLDivElement</code> attributes.</p>
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>role="progressbar"</code> with <code>aria-valuenow</code>, <code>aria-valuemin="0"</code>, <code>aria-valuemax</code> always set.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Indeterminate mode omits <code>aria-valuenow</code> per ARIA spec for indeterminate progress.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Provide <code>aria-label</code> or <code>aria-labelledby</code> so screen readers announce what is loading.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> The <code>label</code> prop text is also set as <code>aria-valuetext</code> for richer announcements.</li>
          </ul>
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every Progress.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(progressContract, null, 2)}
          />
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme Progress.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-color-accent',      desc: 'Default fill color' },
              { name: '--vhyx-color-success',     desc: 'Success fill color' },
              { name: '--vhyx-color-warning',     desc: 'Warning fill color' },
              { name: '--vhyx-color-danger',      desc: 'Danger fill color' },
              { name: '--vhyx-color-bg-muted',    desc: 'Track background' },
              { name: '--vhyx-radius-full',       desc: 'Track and fill border radius' },
              { name: '--vhyx-duration-slow',     desc: 'Fill transition duration' },
              { name: '--vhyx-easing-standard',   desc: 'Fill transition easing' },
            ].map((t) => (
              <div key={t.name} className="docs-token-item">
                <span className="docs-token-name">{t.name}</span>
                <span className="docs-token-desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="examples" title="Examples">
          <h3 className="docs-subsection-heading">Multi-step wizard</h3>
          <ComponentExample
            label="Step progress with custom label"
            code={`<Progress value={2} max={4} showLabel label="Step 2 of 4" />`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-2)', width: '28rem' }}>
              <Progress value={2} max={4} showLabel label="Step 2 of 4" />
            </div>
          </ComponentExample>

          <h3 className="docs-subsection-heading">Storage usage</h3>
          <ComponentExample
            label="Storage indicator with dynamic variant"
            code={`<Progress
  value={usedGB}
  max={totalGB}
  variant={usedGB / totalGB > 0.9 ? 'danger' : usedGB / totalGB > 0.75 ? 'warning' : 'default'}
  showLabel
  label={\`\${usedGB}GB of \${totalGB}GB used\`}
  aria-label="Storage usage"
/>`}
          >
            <div style={{ width: '28rem' }}>
              <Progress value={8.2} max={10} variant="warning" showLabel label="8.2GB of 10GB used" aria-label="Storage usage" />
            </div>
          </ComponentExample>
        </Section>

        <PageNav
          prev={{ title: 'Badge', href: '/components/badge' }}
          next={{ title: 'Spinner', href: '/components/spinner' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
