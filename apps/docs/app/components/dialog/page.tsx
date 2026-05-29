'use client';

import React, { useState } from 'react';
import { Dialog, Button, Input, Field } from '@vhyxui/react';
import { dialogContract } from '@vhyxui/core';
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
  { id: 'props',              text: 'Props',               level: 2 },
  { id: 'accessibility',      text: 'Accessibility',       level: 2 },
  { id: 'keyboard',           text: 'Keyboard',            level: 2 },
  { id: 'agent-contract',     text: 'Agent Contract',      level: 2 },
  { id: 'theming',            text: 'Theming',             level: 2 },
  { id: 'examples',           text: 'Examples',            level: 2 },
] as const;

// ─── Props ─────────────────────────────────────────────────────────────────

const PROPS: PropDef[] = [
  { name: 'open', type: 'boolean', description: 'Controlled open state.' },
  { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Default open state for uncontrolled usage.' },
  { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the open state changes.' },
  { name: 'modal', type: 'boolean', default: 'true', description: 'When true, traps focus and renders the overlay.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override.' },
];

// ─── Keyboard ──────────────────────────────────────────────────────────────

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Escape'],         action: 'Close the dialog and return focus to the trigger.' },
  { keys: ['Tab'],            action: 'Cycle through focusable elements inside the dialog.' },
  { keys: ['Shift + Tab'],    action: 'Reverse focus cycle within the dialog.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function DialogPage(): React.ReactElement {
  const [open, setOpen]           = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Dialog"
          description="Modal overlay with focus trap, Escape-to-close, and automatic focus restoration to the trigger element. Dialog.Title is required for screen reader accessibility."
          tags={['Overlay', 'Compound', 'Focus trap', 'VhyxSeal']}
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="Edit profile dialog"
            code={`<Dialog>
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
      <Dialog.Footer>
        <Dialog.Close asChild>
          <Button variant="outline">Cancel</Button>
        </Dialog.Close>
        <Button variant="primary">Save changes</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog>`}
          >
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

        <Section id="import" title="Import">
          <CodeBlock
            language="tsx"
            code={`import { Dialog } from '@vhyxui/react'

// Sub-components
// Dialog.Trigger     — the element that opens the dialog
// Dialog.Portal      — renders content outside DOM hierarchy
// Dialog.Overlay     — the backdrop
// Dialog.Content     — the dialog panel
// Dialog.Header      — header slot
// Dialog.Footer      — footer slot for actions
// Dialog.Title       — required accessible title
// Dialog.Description — optional description
// Dialog.Close       — button to close`}
          />
        </Section>

        <Section id="variants" title="Variants">
          <ComponentExample
            label="Confirmation dialog (destructive)"
            code={`<Dialog>
  <Dialog.Trigger asChild>
    <Button variant="destructive">Delete account</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>Are you sure?</Dialog.Title>
        <Dialog.Description>This action cannot be undone.</Dialog.Description>
      </Dialog.Header>
      <Dialog.Footer>
        <Dialog.Close asChild>
          <Button variant="outline">Cancel</Button>
        </Dialog.Close>
        <Button variant="destructive">Yes, delete account</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog>`}
          >
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

        <Section id="props" title="Props">
          <PropsTable props={PROPS} />
          <p className="docs-section-text">
            Sub-components: <code>Dialog.Trigger</code> accepts <code>asChild</code>. <code>Dialog.Content</code> accepts standard <code>HTMLDivElement</code> attributes.
          </p>
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>role="dialog"</code>, <code>aria-modal="true"</code>, <code>aria-labelledby</code> pointing to Dialog.Title.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <strong>Dialog.Title is required</strong> — a development warning is logged if absent.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Focus is trapped inside the dialog while open. Tab cycles only within.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> On close, focus returns to the exact trigger element that opened the dialog.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Escape always closes the dialog and restores focus.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Overlay click closes the dialog by default.</li>
          </ul>
        </Section>

        <Section id="keyboard" title="Keyboard navigation">
          <KeyboardTable rows={KEYBOARD} />
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every Dialog.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(dialogContract, null, 2)}
          />
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme Dialog.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-z-modal',       desc: 'Z-index (400)' },
              { name: '--vhyx-z-overlay',     desc: 'Overlay z-index (300)' },
              { name: '--vhyx-shadow-2xl',    desc: 'Content shadow' },
              { name: '--vhyx-radius-xl',     desc: 'Content border radius' },
              { name: '--vhyx-duration-slow', desc: 'Entry animation duration' },
              { name: '--vhyx-easing-spring', desc: 'Content slide-up easing' },
            ].map((t) => (
              <div key={t.name} className="docs-token-item">
                <span className="docs-token-name">{t.name}</span>
                <span className="docs-token-desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="examples" title="Examples">
          <h3 className="docs-subsection-heading">Controlled dialog</h3>
          <CodeBlock
            language="tsx"
            code={`const [open, setOpen] = useState(false)

<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Trigger asChild>
    <Button>Edit settings</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title>Settings</Dialog.Title>
      {/* content */}
      <Dialog.Footer>
        <Button onClick={() => setOpen(false)}>Done</Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog>`}
          />

          <h3 className="docs-subsection-heading">Open dialog programmatically</h3>
          <ComponentExample
            label="Open without a Trigger sub-component"
            code={`<Button onClick={() => setOpen(true)}>Edit profile</Button>
<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Portal>...</Dialog.Portal>
</Dialog>`}
          >
            <Button variant="outline" onClick={() => { setOpen(true); }}>Edit profile</Button>
          </ComponentExample>
        </Section>

        <PageNav
          prev={{ title: 'Spinner', href: '/components/spinner' }}
          next={{ title: 'Drawer', href: '/components/drawer' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
