'use client';

import React, { useState } from 'react';
import { Button, Badge, Separator } from '@vhyxui/react';
import { buttonContract } from '@vhyxui/core';
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
  { id: 'sizes',              text: 'Sizes',               level: 2 },
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
  { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'", default: "'primary'", description: 'Visual style of the button.' },
  { name: 'size', type: "'xs' | 'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the button, maps to --vhyx-size-* height tokens.' },
  { name: 'loading', type: 'boolean', default: 'false', description: 'When true, shows a spinner and disables interaction.' },
  { name: 'icon', type: 'React.ReactNode', description: 'Optional icon element rendered alongside button text.' },
  { name: 'iconPosition', type: "'left' | 'right'", default: "'left'", description: 'Side the icon appears on.' },
  { name: 'iconOnly', type: 'boolean', default: 'false', description: 'Renders icon only. Requires aria-label.' },
  { name: 'asChild', type: 'boolean', default: 'false', description: 'Renders as the child element via Slot. Use for navigation links.' },
  { name: 'contract', type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override — merged with the default.' },
  { name: 'disabled', type: 'boolean', description: 'Disables the button (from HTMLButtonElement).' },
  { name: 'onClick', type: 'React.MouseEventHandler<HTMLButtonElement>', description: 'Click handler (from HTMLButtonElement).' },
  { name: 'className', type: 'string', description: 'Additional CSS classes appended to the button.' },
];

// ─── Keyboard ──────────────────────────────────────────────────────────────

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Enter', 'Space'], action: 'Activates the button (triggers onClick).' },
  { keys: ['Tab'],            action: 'Moves focus to the next focusable element.' },
  { keys: ['Shift + Tab'],    action: 'Moves focus to the previous focusable element.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function ButtonPage(): React.ReactElement {
  const [loading, setLoading] = useState(false);

  function handleLoadingDemo(): void {
    setLoading(true);
    setTimeout(() => { setLoading(false); }, 2000);
  }

  return (
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Button"
          description="Triggers actions or submits forms. Six variants, four sizes, loading state, icon support, and asChild for link rendering — all built in."
          tags={['Interactive', 'Form element', 'VhyxSeal']}
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="Click to trigger loading state"
            code={`<Button variant="primary" size="md" loading={loading} onClick={handleLoading}>
  Save changes
</Button>`}
          >
            <Button variant="primary" size="md" loading={loading} onClick={handleLoadingDemo}>
              Save changes
            </Button>
          </ComponentExample>
        </Section>

        <Section id="import" title="Import">
          <CodeBlock code={`import { Button } from '@vhyxui/react'`} language="tsx" />
        </Section>

        <Section id="variants" title="Variants" description="Six semantic variants covering every use case.">
          <ComponentExample
            label="All 6 variants"
            code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>`}
          >
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </ComponentExample>
        </Section>

        <Section id="sizes" title="Sizes" description="Four sizes mapping to --vhyx-size-* height tokens.">
          <ComponentExample
            label="xs, sm, md, lg"
            code={`<Button size="xs">Extra small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
          >
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </ComponentExample>
        </Section>

        <Section id="states" title="States">
          <ComponentExample label="Loading" code={`<Button loading>Loading</Button>`}>
            <Button loading>Loading</Button>
            <Button loading variant="secondary">Saving</Button>
            <Button loading variant="outline">Processing</Button>
          </ComponentExample>
          <ComponentExample label="Disabled" code={`<Button disabled>Disabled</Button>`}>
            <Button disabled>Disabled</Button>
            <Button disabled variant="secondary">Disabled</Button>
            <Button disabled variant="outline">Disabled</Button>
          </ComponentExample>
          <ComponentExample
            label="Icon + text"
            code={`<Button icon={<StarIcon />}>With icon</Button>
<Button icon={<StarIcon />} iconPosition="right">Icon right</Button>`}
          >
            <Button icon={<span aria-hidden="true">★</span>}>With icon</Button>
            <Button icon={<span aria-hidden="true">★</span>} iconPosition="right">Icon right</Button>
          </ComponentExample>
          <ComponentExample label="Icon only — requires aria-label" code={`<Button iconOnly icon={<StarIcon />} aria-label="Favourite" />`}>
            <Button iconOnly icon={<span aria-hidden="true">★</span>} aria-label="Favourite" />
            <Button iconOnly icon={<span aria-hidden="true">✕</span>} aria-label="Close" variant="ghost" />
          </ComponentExample>
          <ComponentExample
            label="asChild — renders as anchor"
            code={`<Button asChild variant="outline">
  <a href="/docs">Documentation</a>
</Button>`}
          >
            <Button asChild variant="outline" size="sm">
              <a href="/getting-started">Get Started</a>
            </Button>
          </ComponentExample>
        </Section>

        <Section id="props" title="Props">
          <PropsTable props={PROPS} />
          <p className="docs-section-text">
            Button also accepts all standard <code>HTMLButtonElement</code> attributes.
          </p>
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Renders as native <code>&lt;button&gt;</code> — no role override needed.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>aria-busy</code> set automatically when <code>loading=true</code>.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Focus ring via <code>:focus-visible</code> — visible on keyboard, hidden on mouse.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>iconOnly</code> warns in development if <code>aria-label</code> is missing.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>asChild</code> prevents nested interactive elements — correct DOM structure.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>disabled</code> attribute propagated — no separate <code>aria-disabled</code> needed.</li>
          </ul>
        </Section>

        <Section id="keyboard" title="Keyboard navigation">
          <KeyboardTable rows={KEYBOARD} />
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every Button. The destructive variant auto-upgrades safetyLevel, destructive, and requiresConfirmation.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(buttonContract, null, 2)}
          />
          <p className="docs-section-text">
            Override fields via the <code>contract</code> prop — merged with the default:
          </p>
          <CodeBlock
            language="tsx"
            code={`<Button contract={{ intent: 'submit-order', requiresConfirmation: true }}>
  Place Order
</Button>`}
          />
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme the Button without touching component code.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-color-accent',        desc: 'Primary variant background' },
              { name: '--vhyx-color-accent-hover',  desc: 'Primary hover state' },
              { name: '--vhyx-color-accent-active', desc: 'Primary active state' },
              { name: '--vhyx-color-danger',        desc: 'Destructive variant background' },
              { name: '--vhyx-color-danger-hover',  desc: 'Destructive hover state' },
              { name: '--vhyx-size-xs/sm/md/lg',    desc: 'Button height per size' },
              { name: '--vhyx-radius-md',           desc: 'Border radius' },
              { name: '--vhyx-shadow-focus',        desc: 'Focus ring' },
              { name: '--vhyx-duration-instant',    desc: 'Active press scale transition' },
              { name: '--vhyx-weight-medium',       desc: 'Font weight' },
            ].map((t) => (
              <div key={t.name} className="docs-token-item">
                <span className="docs-token-name">{t.name}</span>
                <span className="docs-token-desc">{t.desc}</span>
              </div>
            ))}
          </div>
          <CodeBlock
            language="css"
            code={`:root {
  --vhyx-color-accent: #7c3aed;        /* purple primary buttons */
  --vhyx-color-accent-hover: #6d28d9;
  --vhyx-radius-md: 9999px;            /* pill-shaped buttons */
}`}
          />
        </Section>

        <Section id="examples" title="Examples">
          <h3 className="docs-subsection-heading">Form submit with loading state</h3>
          <ComponentExample
            label="Controlled loading — typical form submission pattern"
            code={`const [isSubmitting, setIsSubmitting] = useState(false)

async function handleSubmit() {
  setIsSubmitting(true)
  await saveData()
  setIsSubmitting(false)
}

<Button variant="primary" loading={isSubmitting} onClick={handleSubmit}>
  Save changes
</Button>`}
          >
            <Button variant="primary" loading={loading} onClick={handleLoadingDemo}>
              Save changes
            </Button>
          </ComponentExample>

          <h3 className="docs-subsection-heading">Confirm / Cancel action group</h3>
          <ComponentExample
            label="Paired primary + outline"
            code={`<div style={{ display: 'flex', gap: '0.5rem' }}>
  <Button variant="primary">Confirm</Button>
  <Button variant="outline">Cancel</Button>
</div>`}
          >
            <div style={{ display: 'flex', gap: 'var(--vhyx-space-2)' }}>
              <Button variant="primary">Confirm</Button>
              <Button variant="outline">Cancel</Button>
            </div>
          </ComponentExample>

          <h3 className="docs-subsection-heading">Destructive action</h3>
          <ComponentExample
            label="Delete pattern — contract auto-upgrades to safetyLevel: high"
            code={`<Button variant="destructive">Delete account</Button>`}
          >
            <Button variant="destructive">Delete account</Button>
          </ComponentExample>
        </Section>

        <PageNav
          next={{ title: 'Input', href: '/components/input' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
