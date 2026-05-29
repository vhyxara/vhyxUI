'use client';

import React, { useState } from 'react';
import { Form, Field, Input, Textarea, Button, Checkbox } from '@vhyxui/react';
import { formContract } from '@vhyxui/core';
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
  { id: 'import',              text: 'Import',              level: 2 },
  { id: 'field',               text: 'Field',               level: 2 },
  { id: 'layouts',             text: 'Layouts',             level: 2 },
  { id: 'props',               text: 'Props',               level: 2 },
  { id: 'accessibility',       text: 'Accessibility',       level: 2 },
  { id: 'keyboard',            text: 'Keyboard',            level: 2 },
  { id: 'agent-contract',      text: 'Agent Contract',      level: 2 },
  { id: 'theming',             text: 'Theming',             level: 2 },
  { id: 'examples',            text: 'Examples',            level: 2 },
] as const;

// ─── Props ─────────────────────────────────────────────────────────────────

const FORM_PROPS: PropDef[] = [
  { name: 'form', type: 'UseFormReturn<FieldValues>', description: 'react-hook-form return value. When provided, errors propagate automatically from form state.' },
  { name: 'layout', type: "'vertical' | 'horizontal' | 'inline'", default: "'vertical'", description: 'Field layout direction within this form.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size propagated to all form controls.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all form controls at once.' },
  { name: 'onSubmit', type: '(data: FieldValues) => void | Promise<void>', description: 'Called with validated form data on submission.' },
];

const FIELD_PROPS: PropDef[] = [
  { name: 'name', type: 'string', required: true, description: 'Field name — used to read errors from react-hook-form context.' },
  { name: 'label', type: 'React.ReactNode', description: 'Visible label rendered above the input.' },
  { name: 'hint', type: 'React.ReactNode', description: 'Helper text rendered below the input.' },
  { name: 'error', type: 'string', description: 'Error message. Overrides any error from react-hook-form context.' },
  { name: 'required', type: 'boolean', description: 'Shows required indicator (*) and sets aria-required on the child.' },
  { name: 'optional', type: 'boolean', description: 'Shows an optional indicator next to the label.' },
  { name: 'layout', type: "'vertical' | 'horizontal'", description: 'Overrides the Form layout for this specific field only.' },
  { name: 'children', type: 'React.ReactNode', description: 'The input component to render.' },
];

// ─── Keyboard ──────────────────────────────────────────────────────────────

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Tab'],        action: 'Move focus to the next field or focusable element.' },
  { keys: ['Shift + Tab'], action: 'Move focus to the previous field or focusable element.' },
  { keys: ['Enter'],      action: 'Submit the form when focus is on a submit button.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function FormPage(): React.ReactElement {
  const [name, setName]     = useState('');
  const [email, setEmail]   = useState('');
  const [message, setMessage] = useState('');
  const [agree, setAgree]   = useState<boolean | 'indeterminate'>(false);

  return (
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Form & Field"
          description="Form provides layout and react-hook-form context. Field is the missing layer every project rebuilds: label + input + hint + error, automatically wired together with correct ARIA associations."
          tags={['Form element', 'Context provider', 'react-hook-form']}
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="Contact form with Field"
            code={`<Form layout="vertical">
  <Field name="name" label="Full name" required>
    <Input placeholder="Jane Smith" />
  </Field>
  <Field name="email" label="Email" hint="Never shared." required>
    <Input type="email" placeholder="jane@example.com" />
  </Field>
  <Field name="message" label="Message" optional>
    <Textarea placeholder="How can we help?" />
  </Field>
  <Button type="submit">Send message</Button>
</Form>`}
          >
            <Form style={{ width: '24rem' }}>
              <Field name="name" label="Full name" required>
                <Input value={name} onChange={(e) => { setName(e.target.value); }} placeholder="Jane Smith" />
              </Field>
              <Field name="email" label="Email address" hint="We'll never share your email." required style={{ marginTop: 'var(--vhyx-space-4)' }}>
                <Input type="email" value={email} onChange={(e) => { setEmail(e.target.value); }} placeholder="jane@example.com" />
              </Field>
              <Field name="message" label="Message" optional style={{ marginTop: 'var(--vhyx-space-4)' }}>
                <Textarea value={message} onChange={(e) => { setMessage(e.target.value); }} placeholder="How can we help?" />
              </Field>
              <div style={{ marginTop: 'var(--vhyx-space-4)', display: 'flex', gap: 'var(--vhyx-space-2)', alignItems: 'center' }}>
                <Checkbox checked={agree === true} onCheckedChange={setAgree} aria-label="Agree to terms" />
                <span style={{ fontSize: 'var(--vhyx-text-sm)' }}>I agree to the terms</span>
              </div>
              <Button type="submit" style={{ marginTop: 'var(--vhyx-space-6)', width: '100%' }}>Send message</Button>
            </Form>
          </ComponentExample>
        </Section>

        <Section id="import" title="Import">
          <CodeBlock code={`import { Form, Field } from '@vhyxui/react'`} language="tsx" />
        </Section>

        <Section id="field" title="Field" description="Field is the differentiator. Developers rebuild this on every project. VhyxUI makes it first class.">
          <ComponentExample
            label="Field with error"
            code={`<Field name="email" label="Email" error="Please enter a valid email address.">
  <Input error type="email" placeholder="invalid-email" />
</Field>`}
          >
            <div style={{ width: '24rem' }}>
              <Field name="email" label="Email address" error="Please enter a valid email address.">
                <Input error type="email" placeholder="invalid-email" />
              </Field>
            </div>
          </ComponentExample>
          <ComponentExample
            label="Field with hint"
            code={`<Field name="password" label="Password" hint="At least 8 characters, including a number.">
  <Input type="password" placeholder="Create password" />
</Field>`}
          >
            <div style={{ width: '24rem' }}>
              <Field name="password" label="Password" hint="At least 8 characters, including a number.">
                <Input type="password" placeholder="Create password" />
              </Field>
            </div>
          </ComponentExample>
          <ComponentExample
            label="Required and optional indicators"
            code={`<Field name="email" label="Email" required>
  <Input type="email" />
</Field>
<Field name="nickname" label="Nickname" optional>
  <Input />
</Field>`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-4)', width: '24rem' }}>
              <Field name="email-req" label="Email" required>
                <Input type="email" placeholder="Required field" />
              </Field>
              <Field name="nickname" label="Nickname" optional>
                <Input placeholder="Optional field" />
              </Field>
            </div>
          </ComponentExample>
        </Section>

        <Section id="layouts" title="Layouts">
          <ComponentExample
            label="Vertical (default)"
            code={`<Form layout="vertical">
  <Field name="n" label="Name"><Input placeholder="Name" /></Field>
</Form>`}
          >
            <Form style={{ width: '20rem' }}>
              <Field name="n" label="Name"><Input placeholder="Name" /></Field>
            </Form>
          </ComponentExample>
          <ComponentExample
            label="Disabled form"
            code={`<Form disabled>
  <Field name="n" label="Name"><Input placeholder="Disabled" /></Field>
  <Button type="submit">Submit</Button>
</Form>`}
          >
            <Form disabled style={{ width: '20rem' }}>
              <Field name="n" label="Name"><Input placeholder="Disabled input" /></Field>
              <Button type="submit" style={{ marginTop: 'var(--vhyx-space-3)' }}>Submit</Button>
            </Form>
          </ComponentExample>
        </Section>

        <Section id="props" title="Props">
          <h3 className="docs-subsection-heading">Form</h3>
          <PropsTable props={FORM_PROPS} />
          <p className="docs-section-text">Also accepts all standard <code>HTMLFormElement</code> attributes.</p>
          <h3 className="docs-subsection-heading">Field</h3>
          <PropsTable props={FIELD_PROPS} />
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Field generates unique IDs and connects <code>label[for]</code> → input automatically.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Hint and error text are connected via <code>aria-describedby</code> — announced by screen readers.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Error text has <code>role="alert"</code> — announced immediately when it appears.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>aria-invalid</code> propagated to child input when an error is present.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Required indicator (*) is decorative — screen readers hear "required" from <code>aria-required</code>.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Disabled Form sets <code>disabled</code> on all child inputs and <code>aria-disabled</code> where needed.</li>
          </ul>
        </Section>

        <Section id="keyboard" title="Keyboard navigation">
          <KeyboardTable rows={KEYBOARD} />
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every Form.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(formContract, null, 2)}
          />
          <p className="docs-section-text">
            Individual field inputs carry their own contracts. The Form contract represents the submission action.
          </p>
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme Form and Field.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-text-sm',           desc: 'Label font size' },
              { name: '--vhyx-weight-medium',      desc: 'Label font weight' },
              { name: '--vhyx-color-danger',       desc: 'Error text color' },
              { name: '--vhyx-color-danger-text',  desc: 'Error message color' },
              { name: '--vhyx-color-text-muted',   desc: 'Hint text color' },
              { name: '--vhyx-color-text-subtle',  desc: 'Optional indicator color' },
              { name: '--vhyx-space-1-5',          desc: 'Label bottom gap' },
              { name: '--vhyx-space-4',            desc: 'Field gap (between label and input)' },
            ].map((t) => (
              <div key={t.name} className="docs-token-item">
                <span className="docs-token-name">{t.name}</span>
                <span className="docs-token-desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="examples" title="Examples">
          <h3 className="docs-subsection-heading">react-hook-form + zod</h3>
          <CodeBlock
            language="tsx"
            code={`import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, Field, Input, Button } from '@vhyxui/react'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'At least 8 characters required'),
})

function LoginForm() {
  const form = useForm({ resolver: zodResolver(schema) })

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
      <Field name="email" label="Email" required>
        <Input
          {...form.register('email')}
          type="email"
          placeholder="you@example.com"
          error={!!form.formState.errors.email}
        />
      </Field>
      <Field name="password" label="Password" hint="At least 8 characters" required>
        <Input
          {...form.register('password')}
          type="password"
          error={!!form.formState.errors.password}
        />
      </Field>
      <Button type="submit" loading={form.formState.isSubmitting}>
        Log in
      </Button>
    </Form>
  )
}`}
          />

          <h3 className="docs-subsection-heading">Manual error control</h3>
          <CodeBlock
            language="tsx"
            code={`<Form>
  <Field name="username" label="Username" error={serverError}>
    <Input value={username} onChange={e => setUsername(e.target.value)} />
  </Field>
</Form>`}
          />
        </Section>

        <PageNav
          prev={{ title: 'Switch', href: '/components/switch' }}
          next={{ title: 'Toast', href: '/components/toast' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
