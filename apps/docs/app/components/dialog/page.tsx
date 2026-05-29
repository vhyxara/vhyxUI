'use client';

import React, { useState } from 'react';
import { Dialog, Button, Input, Field, Separator } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlockSimple';
import { PropsTable } from '../../../components/PropsTable';
import { KeyboardTable } from '../../../components/KeyboardTable';
import type { PropDef } from '../../../components/PropsTable';
import type { KeyboardRow } from '../../../components/KeyboardTable';

const PROPS: PropDef[] = [
  { name: 'open', type: 'boolean', description: 'Controlled open state.' },
  { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Default open state (uncontrolled).' },
  { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when open state changes.' },
  { name: 'modal', type: 'boolean', default: 'true', description: 'When true, traps focus and shows overlay.' },
];

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Escape'], action: 'Close the dialog.' },
  { keys: ['Tab'], action: 'Cycle through focusable elements inside the dialog.' },
  { keys: ['Shift + Tab'], action: 'Reverse focus cycle.' },
];

export default function DialogPage(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <PageHeader name="Dialog" description="Modal overlay with focus trap, focus restoration, and Escape-to-close. Dialog.Title is required for accessibility." tags={['Overlay', 'Compound', 'Focus trap', 'VhyxSeal']} />

      <Section title="Interactive example">
        <ComponentExample label="Open a dialog" code={`<Dialog>\n  <Dialog.Trigger asChild><Button>Open dialog</Button></Dialog.Trigger>\n  <Dialog.Portal>\n    <Dialog.Overlay />\n    <Dialog.Content>\n      <Dialog.Title>Edit profile</Dialog.Title>\n      <Dialog.Close />\n    </Dialog.Content>\n  </Dialog.Portal>\n</Dialog>`}>
          <Dialog open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <Button variant="primary">Open dialog</Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay />
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Edit profile</Dialog.Title>
                  <Dialog.Description>Update your display name and email address.</Dialog.Description>
                </Dialog.Header>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-4)', padding: 'var(--vhyx-space-4) 0' }}>
                  <Field name="name" label="Display name">
                    <Input placeholder="Jane Smith" />
                  </Field>
                  <Field name="email" label="Email">
                    <Input type="email" placeholder="jane@example.com" />
                  </Field>
                </div>
                <Dialog.Footer>
                  <Dialog.Close asChild>
                    <Button variant="outline">Cancel</Button>
                  </Dialog.Close>
                  <Button variant="primary" onClick={() => { setOpen(false); }}>Save changes</Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog>
        </ComponentExample>
      </Section>

      <Section title="Import">
        <CodeBlock code={`import { Dialog } from '@vhyxui/react'

// Sub-components
Dialog.Trigger, Dialog.Portal, Dialog.Overlay
Dialog.Content, Dialog.Header, Dialog.Footer
Dialog.Title, Dialog.Description, Dialog.Close`} />
      </Section>

      <Section title="Variants">
        <ComponentExample label="Confirmation dialog" code={`<Dialog>\n  <Dialog.Trigger asChild><Button variant="destructive">Delete</Button></Dialog.Trigger>\n  <Dialog.Portal>...</Dialog.Portal>\n</Dialog>`}>
          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <Dialog.Trigger asChild>
              <Button variant="destructive">Delete account</Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay />
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>Are you sure?</Dialog.Title>
                  <Dialog.Description>This action cannot be undone. Your account and all data will be permanently deleted.</Dialog.Description>
                </Dialog.Header>
                <Dialog.Footer>
                  <Dialog.Close asChild>
                    <Button variant="outline">Cancel</Button>
                  </Dialog.Close>
                  <Button variant="destructive" onClick={() => { setConfirmOpen(false); }}>Yes, delete account</Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog>
        </ComponentExample>
      </Section>

      <Section title="Props"><PropsTable props={PROPS} /></Section>

      <Section title="Accessibility">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>role="dialog"</code>, <code>aria-modal="true"</code>, <code>aria-labelledby</code> pointing to Dialog.Title.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <strong>Dialog.Title is required</strong> — a warning is logged in development if absent.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Focus is trapped inside the dialog while open. Tab cycles within.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> On close, focus returns to the exact trigger element that opened the dialog.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Escape always closes the dialog.</li>
        </ul>
      </Section>

      <Section title="Keyboard navigation"><KeyboardTable rows={KEYBOARD} /></Section>

      <Section title="Agent contract">
        <div className="docs-contract">
          {[{ key: 'type', value: '"overlay"' }, { key: 'intent', value: '"show-modal"' }, { key: 'safetyLevel', value: '"low"' }].map((r) => (
            <div key={r.key} className="docs-contract-row"><span className="docs-contract-key">{r.key}</span><span className="docs-contract-value">{r.value}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Theming">
        <div className="docs-tokens-grid">
          {[{ name: '--vhyx-z-modal', desc: 'Modal z-index (400)' }, { name: '--vhyx-shadow-2xl', desc: 'Content shadow' }, { name: '--vhyx-duration-slow', desc: 'Entry animation' }, { name: '--vhyx-easing-spring', desc: 'Content easing' }].map((t) => (
            <div key={t.name} className="docs-token-item"><span className="docs-token-name">{t.name}</span><span className="docs-token-desc">{t.desc}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Examples">
        <ComponentExample label="Edit form dialog" code={`<Dialog>\n  <Dialog.Trigger asChild><Button>Edit profile</Button></Dialog.Trigger>\n  ...\n</Dialog>`}>
          <Button variant="outline" onClick={() => { setOpen(true); }}>Edit profile</Button>
        </ComponentExample>
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <a href="/components/select" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>← Select</a>
        <a href="/components/drawer" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>Drawer →</a>
      </div>
    </>
  );
}
