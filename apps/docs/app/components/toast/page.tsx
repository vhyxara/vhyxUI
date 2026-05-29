'use client';

import React from 'react';
import { Button, Badge, Separator, toast } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlockSimple';
import { PropsTable } from '../../../components/PropsTable';
import type { PropDef } from '../../../components/PropsTable';

const FN_PROPS: PropDef[] = [
  { name: 'message', type: 'string', required: true, description: 'Primary message text.' },
  { name: 'description', type: 'string', description: 'Supplementary text rendered below the message.' },
  { name: 'duration', type: 'number', default: '5000', description: 'Auto-dismiss delay in ms. Pass Infinity to prevent auto-dismiss.' },
  { name: 'action', type: '{ label: string; onClick: () => void }', description: 'Optional action button rendered inside the toast.' },
  { name: 'dismissible', type: 'boolean', default: 'true', description: 'Shows a dismiss button.' },
];

const PROVIDER_PROPS: PropDef[] = [
  { name: 'position', type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'", default: "'bottom-right'", description: 'Position of the toast region.' },
  { name: 'maxToasts', type: 'number', default: '5', description: 'Maximum simultaneous toasts.' },
  { name: 'defaultDuration', type: 'number', default: '5000', description: 'Default auto-dismiss duration.' },
];

export default function ToastPage(): React.ReactElement {
  return (
    <>
      <PageHeader
        name="Toast"
        description="Ephemeral notifications via imperative API. toast() can be called from anywhere — event handlers, async functions, outside React. ToastProvider is in VhyxUIProvider."
        tags={['Feedback', 'Imperative API', 'VhyxSeal']}
      />

      <Section title="Interactive example">
        <ComponentExample label="Click to trigger toasts" code={`import { toast } from '@vhyxui/react'\n\ntoast('File saved')\ntoast.success('Upload complete')\ntoast.danger('Connection lost')`}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--vhyx-space-2)' }}>
            <Button variant="outline" size="sm" onClick={() => { toast('Default notification'); }}>Default</Button>
            <Button variant="outline" size="sm" onClick={() => { toast.success('Upload complete!'); }}>Success</Button>
            <Button variant="outline" size="sm" onClick={() => { toast.danger('Connection failed.'); }}>Danger</Button>
            <Button variant="outline" size="sm" onClick={() => { toast.warning('Storage nearly full.'); }}>Warning</Button>
            <Button variant="outline" size="sm" onClick={() => { toast.info('Update available.', { action: { label: 'Install', onClick: () => { toast.success('Installing…'); } } }); }}>Info + action</Button>
            <Button variant="outline" size="sm" onClick={() => { toast('Custom', { description: 'With a description below the message.', duration: 8000 }); }}>With description</Button>
          </div>
        </ComponentExample>
      </Section>

      <Section title="Import">
        <CodeBlock code={`// Imperative API — import anywhere
import { toast } from '@vhyxui/react'

// Provider — already in VhyxUIProvider (no manual setup needed)
import { ToastProvider } from '@vhyxui/react'`} />
      </Section>

      <Section title="API methods">
        <ComponentExample label="All toast() methods">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-2)', width: '100%' }}>
            <CodeBlock code={`toast('Message')                     // default variant
toast.success('Upload complete')     // success (green)
toast.danger('Something failed')     // danger (red)
toast.warning('Low disk space')      // warning (amber)
toast.info('Update available')       // info (blue)

// With options
toast.success('Done', {
  description: 'All 42 files uploaded.',
  duration: 8000,
  action: { label: 'View', onClick: openPanel }
})

// Dismiss
const id = toast('Loading…', { duration: Infinity })
toast.dismiss(id)   // dismiss specific
toast.dismiss()     // dismiss all`} />
          </div>
        </ComponentExample>
      </Section>

      <Section title="States">
        <ComponentExample label="With action button" code={`toast.info('Update available', { action: { label: 'Install', onClick: install } })`}>
          <Button size="sm" variant="outline" onClick={() => { toast.info('v1.2.0 available', { action: { label: 'Install now', onClick: () => { toast.success('Installed!'); } } }); }}>
            Show update toast
          </Button>
        </ComponentExample>
        <ComponentExample label="Persistent toast (Infinity duration)" code={`toast('Processing…', { duration: Infinity, dismissible: true })`}>
          <Button size="sm" variant="outline" onClick={() => {
            const id = toast('Processing in background…', { duration: Infinity, dismissible: true });
            setTimeout(() => {
              toast.dismiss(id);
              toast.success('Processing complete!');
            }, 3000);
          }}>
            Start persistent toast
          </Button>
        </ComponentExample>
      </Section>

      <Section title="toast() options"><PropsTable props={FN_PROPS} /></Section>
      <Section title="ToastProvider props"><PropsTable props={PROVIDER_PROPS} /></Section>

      <Section title="Accessibility">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Toast region has <code>role="status"</code>, <code>aria-live="polite"</code> — toasts are announced.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Dismiss button has <code>aria-label="Dismiss"</code>.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>aria-atomic="false"</code> — each toast announced individually.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Toasts are persistent (duration=Infinity) recommended for screen reader users — give enough time to read.</li>
        </ul>
      </Section>

      <Section title="Agent contract">
        <div className="docs-contract">
          {[{ key: 'type', value: '"display"' }, { key: 'intent', value: '"notify-user"' }, { key: 'safetyLevel', value: '"low"' }].map((r) => (
            <div key={r.key} className="docs-contract-row"><span className="docs-contract-key">{r.key}</span><span className="docs-contract-value">{r.value}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Theming">
        <div className="docs-tokens-grid">
          {[{ name: '--vhyx-z-toast', desc: 'Z-index (500)' }, { name: '--vhyx-shadow-lg', desc: 'Toast shadow' }, { name: '--vhyx-duration-normal', desc: 'Slide-in animation' }, { name: '--vhyx-easing-spring', desc: 'Entry easing' }].map((t) => (
            <div key={t.name} className="docs-token-item"><span className="docs-token-name">{t.name}</span><span className="docs-token-desc">{t.desc}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Examples">
        <ComponentExample label="Form submission feedback" code={`async function handleSubmit() {\n  const id = toast('Saving…', { duration: Infinity })\n  try {\n    await save(data)\n    toast.dismiss(id)\n    toast.success('Saved successfully!')\n  } catch {\n    toast.dismiss(id)\n    toast.danger('Save failed. Please try again.')\n  }\n}`}>
          <Button variant="primary" size="sm" onClick={async () => {
            const id = toast('Saving…', { duration: Infinity });
            await new Promise((r) => { setTimeout(r, 1500); });
            toast.dismiss(id);
            toast.success('Saved successfully!');
          }}>
            Simulate save
          </Button>
        </ComponentExample>
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <a href="/components/pagination" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>← Pagination</a>
        <a href="/components/alert" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>Alert →</a>
      </div>
    </>
  );
}
