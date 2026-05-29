'use client';

import React, { useState } from 'react';
import { Alert, Button, Separator } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlockSimple';
import { PropsTable } from '../../../components/PropsTable';
import type { PropDef } from '../../../components/PropsTable';

const PROPS: PropDef[] = [
  { name: 'variant', type: "'default' | 'success' | 'warning' | 'danger' | 'info'", default: "'default'", description: 'Semantic variant.' },
  { name: 'title', type: 'string', description: 'Optional bold title above the message.' },
  { name: 'icon', type: 'React.ReactNode', description: 'Icon override. Defaults to variant-appropriate symbol.' },
  { name: 'dismissible', type: 'boolean', default: 'false', description: 'Renders a Dismiss button.' },
  { name: 'onDismiss', type: '() => void', description: 'Called when the Dismiss button is clicked.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override.' },
];

export default function AlertPage(): React.ReactElement {
  const [show, setShow] = useState(true);

  return (
    <>
      <PageHeader
        name="Alert"
        description="Persistent in-page notification. Alert persists until dismissed — unlike Toast which is ephemeral. danger variant uses role='alert' (assertive) for immediate announcement."
        tags={['Feedback', 'Persistent', 'VhyxSeal']}
      />

      <Section title="Interactive example">
        <ComponentExample label="Dismissible alert — click × to dismiss" code={`<Alert variant="info" title="Beta feature" dismissible onDismiss={handleDismiss}>\n  This feature is in beta.\n</Alert>`}>
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

      <Section title="Import"><CodeBlock code={`import { Alert } from '@vhyxui/react'`} /></Section>

      <Section title="Variants" description="Five semantic variants. danger uses role='alert' (assertive announcement). All others use role='status' (polite).">
        <ComponentExample label="All 5 variants" code={`<Alert variant="default">Default</Alert>\n<Alert variant="success" title="Success">Done!</Alert>\n<Alert variant="warning">Watch out.</Alert>\n<Alert variant="danger">Error!</Alert>\n<Alert variant="info">Update available.</Alert>`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-3)', width: '100%' }}>
            <Alert variant="default">A default informational alert.</Alert>
            <Alert variant="success" title="Changes saved">Your profile has been updated successfully.</Alert>
            <Alert variant="warning" title="Storage low">You are using 90% of your storage quota.</Alert>
            <Alert variant="danger" title="Payment failed">We could not process your payment. Please update your billing details.</Alert>
            <Alert variant="info" title="New version available">v1.2.0 is now available with performance improvements.</Alert>
          </div>
        </ComponentExample>
      </Section>

      <Section title="States">
        <ComponentExample label="Dismissible variants" code={`<Alert dismissible onDismiss={fn}>Dismissible alert</Alert>`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-3)', width: '100%' }}>
            <Alert variant="warning" dismissible onDismiss={() => {}}>Warning — this can be dismissed.</Alert>
            <Alert variant="success" title="Done" dismissible onDismiss={() => {}}>Task completed. You can dismiss this.</Alert>
          </div>
        </ComponentExample>
        <ComponentExample label="Custom icon" code={`<Alert icon={<span>🚀</span>}>Deploying…</Alert>`}>
          <Alert icon={<span role="img" aria-label="rocket">🚀</span>} variant="info">Deployment in progress. ETA: 2 minutes.</Alert>
        </ComponentExample>
      </Section>

      <Section title="Props"><PropsTable props={PROPS} /></Section>

      <Section title="Accessibility">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>danger</code> → <code>role="alert"</code>, <code>aria-live="assertive"</code> — announced immediately.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> All other variants → <code>role="status"</code>, <code>aria-live="polite"</code> — announced at next opportunity.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Fade-in on mount only — no exit animation (persists until explicitly dismissed).</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Dismiss button has <code>aria-label="Dismiss"</code>.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Unlike Toast, Alert is persistent — appropriate for important information that should not auto-dismiss.</li>
        </ul>
      </Section>

      <Section title="Agent contract">
        <div className="docs-contract">
          {[{ key: 'type', value: '"display"' }, { key: 'intent', value: '"display-alert"' }, { key: 'safetyLevel', value: '"low"' }, { key: 'consequence', value: '"Persists until dismissed."' }].map((r) => (
            <div key={r.key} className="docs-contract-row"><span className="docs-contract-key">{r.key}</span><span className="docs-contract-value">{r.value}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Theming">
        <div className="docs-tokens-grid">
          {[{ name: '--vhyx-color-*-subtle', desc: 'Variant backgrounds' }, { name: '--vhyx-color-*', desc: 'Variant border colors' }, { name: '--vhyx-duration-normal', desc: 'Fade-in animation' }, { name: '--vhyx-radius-md', desc: 'Border radius' }].map((t) => (
            <div key={t.name} className="docs-token-item"><span className="docs-token-name">{t.name}</span><span className="docs-token-desc">{t.desc}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Examples">
        <ComponentExample label="Form validation summary" code={`<Alert variant="danger" title="Please fix the following errors">\n  <ul><li>Email is required</li><li>Password too short</li></ul>\n</Alert>`}>
          <Alert variant="danger" title="Please fix the following errors" style={{ width: '100%' }}>
            <ul style={{ paddingLeft: 'var(--vhyx-space-4)', marginTop: 'var(--vhyx-space-2)', fontSize: 'var(--vhyx-text-sm)', display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-1)' }}>
              <li>Email address is required.</li>
              <li>Password must be at least 8 characters.</li>
            </ul>
          </Alert>
        </ComponentExample>
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <a href="/components/toast" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>← Toast</a>
        <a href="/components/button" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>Back to Button ↑</a>
      </div>
    </>
  );
}
