'use client';

import React from 'react';
import { Button, toast } from '@vhyxui/react';
import { toastContract } from '@vhyxui/core';
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
  { id: 'api-methods',        text: 'API Methods',         level: 2 },
  { id: 'states',             text: 'States',              level: 2 },
  { id: 'props',              text: 'Props',               level: 2 },
  { id: 'accessibility',      text: 'Accessibility',       level: 2 },
  { id: 'keyboard',           text: 'Keyboard',            level: 2 },
  { id: 'agent-contract',     text: 'Agent Contract',      level: 2 },
  { id: 'theming',            text: 'Theming',             level: 2 },
  { id: 'examples',           text: 'Examples',            level: 2 },
] as const;

// ─── Props ─────────────────────────────────────────────────────────────────

const FN_PROPS: PropDef[] = [
  { name: 'message', type: 'string', required: true, description: 'Primary message text.' },
  { name: 'description', type: 'string', description: 'Supplementary text rendered below the message.' },
  { name: 'duration', type: 'number', default: '5000', description: 'Auto-dismiss delay in ms. Pass Infinity to prevent auto-dismiss.' },
  { name: 'action', type: '{ label: string; onClick: () => void }', description: 'Optional action button rendered inside the toast.' },
  { name: 'dismissible', type: 'boolean', default: 'true', description: 'Shows a dismiss button.' },
];

const PROVIDER_PROPS: PropDef[] = [
  { name: 'position', type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'", default: "'bottom-right'", description: 'Position of the toast region on screen.' },
  { name: 'maxToasts', type: 'number', default: '5', description: 'Maximum simultaneous toasts visible.' },
  { name: 'defaultDuration', type: 'number', default: '5000', description: 'Default auto-dismiss duration for all toasts.' },
];

// ─── Keyboard ──────────────────────────────────────────────────────────────

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Tab'],        action: 'Move focus into the toast region.' },
  { keys: ['Escape'],     action: 'Dismiss the focused toast.' },
  { keys: ['Enter'],      action: 'Activate the action button if present.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function ToastPage(): React.ReactElement {
  return (
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Toast"
          description="Ephemeral notifications via imperative API. toast() can be called from anywhere — event handlers, async functions, outside React tree. ToastProvider is included in VhyxUIProvider."
          tags={['Feedback', 'Imperative API', 'VhyxSeal']}
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="Click to trigger different toast variants"
            code={`import { toast } from '@vhyxui/react'

toast('File saved')
toast.success('Upload complete')
toast.danger('Connection lost')
toast.warning('Storage nearly full')
toast.info('Update available')`}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--vhyx-space-2)' }}>
              <Button variant="outline" size="sm" onClick={() => { toast('Default notification'); }}>Default</Button>
              <Button variant="outline" size="sm" onClick={() => { toast.success('Upload complete!'); }}>Success</Button>
              <Button variant="outline" size="sm" onClick={() => { toast.danger('Connection failed.'); }}>Danger</Button>
              <Button variant="outline" size="sm" onClick={() => { toast.warning('Storage nearly full.'); }}>Warning</Button>
              <Button variant="outline" size="sm" onClick={() => { toast.info('Update available.', { action: { label: 'Install', onClick: () => { toast.success('Installing…'); } } }); }}>Info + action</Button>
              <Button variant="outline" size="sm" onClick={() => { toast('Custom notification', { description: 'With a description below the message.', duration: 8000 }); }}>With description</Button>
            </div>
          </ComponentExample>
        </Section>

        <Section id="import" title="Import">
          <CodeBlock
            language="tsx"
            code={`// Imperative API — import anywhere in your app
import { toast } from '@vhyxui/react'

// ToastProvider is already included in VhyxUIProvider
// Place VhyxUIProvider once at your app root
import { VhyxUIProvider } from '@vhyxui/react'`}
          />
        </Section>

        <Section id="api-methods" title="API methods">
          <ComponentExample label="All toast() variants">
            <CodeBlock
              language="tsx"
              code={`toast('Message')                      // default variant
toast.success('Upload complete')      // success (green)
toast.danger('Something failed')      // danger (red)
toast.warning('Low disk space')       // warning (amber)
toast.info('Update available')        // info (blue)

// With options
toast.success('Done', {
  description: 'All 42 files uploaded.',
  duration: 8000,
  action: { label: 'View', onClick: openPanel },
})

// Dismiss
const id = toast('Loading…', { duration: Infinity })
toast.dismiss(id)    // dismiss specific toast
toast.dismiss()      // dismiss all toasts`}
            />
          </ComponentExample>
        </Section>

        <Section id="states" title="States">
          <ComponentExample
            label="With action button"
            code={`toast.info('v1.2.0 available', {
  action: { label: 'Install now', onClick: () => install() }
})`}
          >
            <Button size="sm" variant="outline" onClick={() => {
              toast.info('v1.2.0 available', { action: { label: 'Install now', onClick: () => { toast.success('Installed!'); } } });
            }}>
              Show update toast
            </Button>
          </ComponentExample>
          <ComponentExample
            label="Persistent toast (Infinity duration)"
            code={`const id = toast('Processing…', { duration: Infinity, dismissible: true })
// Later:
toast.dismiss(id)`}
          >
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

        <Section id="props" title="Props">
          <h3 className="docs-subsection-heading">toast() options</h3>
          <PropsTable props={FN_PROPS} />
          <h3 className="docs-subsection-heading">ToastProvider props</h3>
          <PropsTable props={PROVIDER_PROPS} />
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Toast region has <code>role="status"</code>, <code>aria-live="polite"</code> — toasts are announced at next opportunity.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>aria-atomic="false"</code> — each toast announced individually, not as a group.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Dismiss button has <code>aria-label="Dismiss"</code>.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> For critical messages use <code>toast.danger()</code> which upgrades to <code>aria-live="assertive"</code>.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Consider <code>duration: Infinity</code> for users who need more time to read notifications.</li>
          </ul>
        </Section>

        <Section id="keyboard" title="Keyboard navigation">
          <KeyboardTable rows={KEYBOARD} />
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every Toast.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(toastContract, null, 2)}
          />
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme Toast.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-z-toast',          desc: 'Z-index (500)' },
              { name: '--vhyx-shadow-lg',         desc: 'Toast shadow' },
              { name: '--vhyx-color-surface-raised', desc: 'Toast background' },
              { name: '--vhyx-radius-lg',         desc: 'Toast border radius' },
              { name: '--vhyx-duration-normal',   desc: 'Slide-in animation duration' },
              { name: '--vhyx-easing-spring',     desc: 'Entry easing' },
            ].map((t) => (
              <div key={t.name} className="docs-token-item">
                <span className="docs-token-name">{t.name}</span>
                <span className="docs-token-desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="examples" title="Examples">
          <h3 className="docs-subsection-heading">Async form submission with feedback</h3>
          <ComponentExample
            label="Show loading then success or error"
            code={`async function handleSubmit() {
  const id = toast('Saving…', { duration: Infinity })
  try {
    await save(data)
    toast.dismiss(id)
    toast.success('Saved successfully!')
  } catch {
    toast.dismiss(id)
    toast.danger('Save failed. Please try again.')
  }
}`}
          >
            <Button variant="primary" size="sm" onClick={async () => {
              const id = toast('Saving…', { duration: Infinity });
              await new Promise((r) => { setTimeout(r, 1500); });
              toast.dismiss(id);
              toast.success('Saved successfully!');
            }}>
              Simulate save
            </Button>
          </ComponentExample>

          <h3 className="docs-subsection-heading">Custom provider position</h3>
          <CodeBlock
            language="tsx"
            code={`// In your app root — VhyxUIProvider accepts ToastProvider props
<VhyxUIProvider toastPosition="top-center" toastMaxToasts={3}>
  {children}
</VhyxUIProvider>`}
          />
        </Section>

        <PageNav
          prev={{ title: 'Form', href: '/components/form' }}
          next={{ title: 'Alert', href: '/components/alert' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
