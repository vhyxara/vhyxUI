'use client';

import React, { useState } from 'react';
import { Alert, Button } from '@vhyxui/react';
import { alertContract } from '@vhyxui/core';
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
  { name: 'variant', type: "'default' | 'success' | 'warning' | 'danger' | 'info'", default: "'default'", description: 'Semantic variant controlling color and icon.' },
  { name: 'title', type: 'string', description: 'Optional bold title rendered above the message.' },
  { name: 'icon', type: 'React.ReactNode', description: 'Icon override. Each variant has a default icon.' },
  { name: 'dismissible', type: 'boolean', default: 'false', description: 'Shows a dismiss (×) button.' },
  { name: 'onDismiss', type: '() => void', description: 'Called when the dismiss button is clicked.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override.' },
  { name: 'className', type: 'string', description: 'Additional CSS classes.' },
];

// ─── Keyboard ──────────────────────────────────────────────────────────────

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Tab'],     action: 'Move focus to the dismiss button (when dismissible=true).' },
  { keys: ['Enter', 'Space'], action: 'Activate the dismiss button.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function AlertPage(): React.ReactElement {
  const [show, setShow] = useState(true);

  return (
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Alert"
          description="Persistent in-page notification banner. Alert stays visible until dismissed — unlike Toast which auto-dismisses. The danger variant uses role='alert' for immediate screen reader announcement."
          tags={['Feedback', 'Persistent', 'VhyxSeal']}
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="Dismissible alert — click × to dismiss"
            code={`<Alert variant="info" title="Beta feature" dismissible onDismiss={() => setShow(false)}>
  This feature is currently in beta. Please report any issues you encounter.
</Alert>`}
          >
            {show ? (
              <Alert variant="info" title="Beta feature" dismissible onDismiss={() => { setShow(false); }} style={{ width: '100%' }}>
                This feature is currently in beta. Please report any issues you encounter.
              </Alert>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--vhyx-space-3)' }}>
                <span style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>Alert dismissed.</span>
                <Button size="sm" variant="outline" onClick={() => { setShow(true); }}>Restore</Button>
              </div>
            )}
          </ComponentExample>
        </Section>

        <Section id="import" title="Import">
          <CodeBlock code={`import { Alert } from '@vhyxui/react'`} language="tsx" />
        </Section>

        <Section id="variants" title="Variants" description="Five semantic variants. danger uses role='alert' (assertive). All others use role='status' (polite).">
          <ComponentExample
            label="All 5 variants"
            code={`<Alert variant="default">A default informational alert.</Alert>
<Alert variant="success" title="Changes saved">Your profile has been updated.</Alert>
<Alert variant="warning" title="Storage low">You are using 90% of your storage quota.</Alert>
<Alert variant="danger" title="Payment failed">We could not process your payment.</Alert>
<Alert variant="info" title="New version available">v1.2.0 is now available.</Alert>`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-3)', width: '100%' }}>
              <Alert variant="default">A default informational alert.</Alert>
              <Alert variant="success" title="Changes saved">Your profile has been updated successfully.</Alert>
              <Alert variant="warning" title="Storage low">You are using 90% of your storage quota.</Alert>
              <Alert variant="danger" title="Payment failed">We could not process your payment. Please update your billing details.</Alert>
              <Alert variant="info" title="New version available">v1.2.0 is now available with performance improvements.</Alert>
            </div>
          </ComponentExample>
        </Section>

        <Section id="states" title="States">
          <ComponentExample
            label="Dismissible"
            code={`<Alert variant="warning" dismissible onDismiss={handleDismiss}>
  Warning — this can be dismissed.
</Alert>`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-3)', width: '100%' }}>
              <Alert variant="warning" dismissible onDismiss={() => {}}>Warning — this can be dismissed.</Alert>
              <Alert variant="success" title="Done" dismissible onDismiss={() => {}}>Task completed. You can dismiss this.</Alert>
            </div>
          </ComponentExample>
          <ComponentExample
            label="Custom icon"
            code={`<Alert icon={<span role="img" aria-label="rocket">🚀</span>} variant="info">
  Deployment in progress. ETA: 2 minutes.
</Alert>`}
          >
            <Alert icon={<span role="img" aria-label="rocket">🚀</span>} variant="info">
              Deployment in progress. ETA: 2 minutes.
            </Alert>
          </ComponentExample>
        </Section>

        <Section id="props" title="Props">
          <PropsTable props={PROPS} />
          <p className="docs-section-text">Also accepts all standard <code>HTMLDivElement</code> attributes.</p>
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>danger</code> variant uses <code>role="alert"</code>, <code>aria-live="assertive"</code> — announced immediately.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> All other variants use <code>role="status"</code>, <code>aria-live="polite"</code> — announced at next opportunity.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Fade-in on mount only — no exit animation (Alert persists until explicitly dismissed).</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Dismiss button has <code>aria-label="Dismiss"</code>.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Unlike Toast, Alert is persistent — suitable for important information that must not auto-dismiss.</li>
          </ul>
        </Section>

        <Section id="keyboard" title="Keyboard navigation">
          <KeyboardTable rows={KEYBOARD} />
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every Alert.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(alertContract, null, 2)}
          />
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme Alert.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-color-*-subtle',    desc: 'Variant background colors' },
              { name: '--vhyx-color-*',            desc: 'Variant border/icon colors' },
              { name: '--vhyx-color-*-text',       desc: 'Variant text colors' },
              { name: '--vhyx-radius-md',          desc: 'Border radius' },
              { name: '--vhyx-duration-normal',    desc: 'Fade-in animation duration' },
              { name: '--vhyx-easing-decelerate',  desc: 'Entry easing' },
            ].map((t) => (
              <div key={t.name} className="docs-token-item">
                <span className="docs-token-name">{t.name}</span>
                <span className="docs-token-desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="examples" title="Examples">
          <h3 className="docs-subsection-heading">Form validation summary</h3>
          <ComponentExample
            label="Danger alert with error list"
            code={`<Alert variant="danger" title="Please fix the following errors">
  <ul>
    <li>Email address is required.</li>
    <li>Password must be at least 8 characters.</li>
  </ul>
</Alert>`}
          >
            <Alert variant="danger" title="Please fix the following errors" style={{ width: '100%' }}>
              <ul style={{ paddingLeft: 'var(--vhyx-space-4)', marginTop: 'var(--vhyx-space-2)', fontSize: 'var(--vhyx-text-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-1)' }}>
                <li>Email address is required.</li>
                <li>Password must be at least 8 characters.</li>
              </ul>
            </Alert>
          </ComponentExample>

          <h3 className="docs-subsection-heading">Conditional alert after action</h3>
          <CodeBlock
            language="tsx"
            code={`{saveError && (
  <Alert
    variant="danger"
    title="Save failed"
    dismissible
    onDismiss={() => setSaveError(null)}
  >
    {saveError.message}
  </Alert>
)}`}
          />
        </Section>

        <PageNav
          prev={{ title: 'Toast', href: '/components/toast' }}
          next={{ title: 'Badge', href: '/components/badge' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
