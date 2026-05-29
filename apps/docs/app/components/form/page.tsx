'use client';

import React, { useState } from 'react';
import { Form, Field, Input, Textarea, Button, Checkbox, Separator } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlockSimple';
import { PropsTable } from '../../../components/PropsTable';
import type { PropDef } from '../../../components/PropsTable';

const FORM_PROPS: PropDef[] = [
  { name: 'form', type: 'UseFormReturn<FieldValues>', description: 'react-hook-form return value. When provided, errors propagate automatically.' },
  { name: 'layout', type: "'vertical' | 'horizontal' | 'inline'", default: "'vertical'", description: 'Field layout within this form.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size applied to all controls in this form.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables all form controls.' },
  { name: 'onSubmit', type: '(data: FieldValues) => void | Promise<void>', description: 'Called with validated form data on submission.' },
];

const FIELD_PROPS: PropDef[] = [
  { name: 'name', type: 'string', required: true, description: 'Field name — used to read errors from react-hook-form context.' },
  { name: 'label', type: 'React.ReactNode', description: 'Visible label rendered above the input.' },
  { name: 'hint', type: 'React.ReactNode', description: 'Helper text rendered below the input.' },
  { name: 'error', type: 'string', description: 'Error message. Overrides react-hook-form error.' },
  { name: 'required', type: 'boolean', description: 'Shows a required indicator (*).' },
  { name: 'optional', type: 'boolean', description: 'Shows an optional indicator.' },
  { name: 'layout', type: "'vertical' | 'horizontal'", description: 'Overrides the Form layout for this specific field.' },
];

export default function FormPage(): React.ReactElement {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [agree, setAgree] = useState<boolean | 'indeterminate'>(false);

  return (
    <>
      <PageHeader
        name="Form & Field"
        description="Form provides layout and context. Field is the missing layer: label + input + hint + error, automatically wired together. The DX win developers feel immediately."
        tags={['Form element', 'Context provider', 'react-hook-form']}
      />

      <Section title="Interactive example">
        <ComponentExample label="Contact form with Field" code={`<Form layout="vertical">\n  <Field name="email" label="Email" hint="Never shared" required>\n    <Input type="email" />\n  </Field>\n  <Button type="submit">Send</Button>\n</Form>`}>
          <Form style={{ width: '24rem' }}>
            <Field name="name" label="Full name" required>
              <Input value={name} onChange={(e) => { setName(e.target.value); }} placeholder="Jane Smith" />
            </Field>
            <Field name="email" label="Email" hint="We'll never share your email." required style={{ marginTop: 'var(--vhyx-space-4)' }}>
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

      <Section title="Import">
        <CodeBlock code={`import { Form, Field } from '@vhyxui/react'`} />
      </Section>

      <Section title="Field — what it does automatically" description="Field is the differentiator. Developers rebuild this on every project. VhyxUI makes it first class.">
        <ComponentExample label="Field with error state" code={`<Field name="email" label="Email" error="Please enter a valid email">\n  <Input error type="email" />\n</Field>`}>
          <div style={{ width: '24rem' }}>
            <Field name="email" label="Email address" error="Please enter a valid email address.">
              <Input error type="email" placeholder="invalid-email" />
            </Field>
          </div>
        </ComponentExample>
        <ComponentExample label="Field with hint" code={`<Field name="password" label="Password" hint="At least 8 characters">\n  <Input type="password" />\n</Field>`}>
          <div style={{ width: '24rem' }}>
            <Field name="password" label="Password" hint="At least 8 characters, including a number.">
              <Input type="password" placeholder="Create password" />
            </Field>
          </div>
        </ComponentExample>
      </Section>

      <Section title="Layouts">
        <ComponentExample label="Vertical (default)" code={`<Form layout="vertical">`}>
          <Form style={{ width: '20rem' }}>
            <Field name="n" label="Name"><Input placeholder="Name" /></Field>
          </Form>
        </ComponentExample>
        <ComponentExample label="Disabled form" code={`<Form disabled>`}>
          <Form disabled style={{ width: '20rem' }}>
            <Field name="n" label="Name"><Input placeholder="Disabled input" /></Field>
            <Button type="submit" style={{ marginTop: 'var(--vhyx-space-3)' }}>Submit</Button>
          </Form>
        </ComponentExample>
      </Section>

      <Section title="Form props"><PropsTable props={FORM_PROPS} /></Section>
      <Section title="Field props"><PropsTable props={FIELD_PROPS} /></Section>

      <Section title="Accessibility">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Field generates unique IDs and connects <code>label[for]</code> → input automatically.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Hint and error text connected via <code>aria-describedby</code>.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Error text rendered with <code>aria-live="assertive"</code> — announced immediately.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>aria-invalid</code> propagated to child input when error is present.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Required indicator (*) is decorative — screen readers hear "required" from <code>aria-required</code>.</li>
        </ul>
      </Section>

      <Section title="Agent contract">
        <p className="docs-section-text">Form and Field have no direct VhyxSeal contract — the child inputs carry their own contracts. The Form provides layout and DX, not agent-actionable behavior.</p>
      </Section>

      <Section title="Theming">
        <div className="docs-tokens-grid">
          {[{ name: '--vhyx-text-sm', desc: 'Label font size' }, { name: '--vhyx-color-danger', desc: 'Error text color' }, { name: '--vhyx-color-text-muted', desc: 'Hint text color' }, { name: '--vhyx-space-4', desc: 'Field gap' }].map((t) => (
            <div key={t.name} className="docs-token-item"><span className="docs-token-name">{t.name}</span><span className="docs-token-desc">{t.desc}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Examples">
        <ComponentExample label="react-hook-form integration" code={`const form = useForm({ resolver: zodResolver(schema) })\n\n<Form form={form} onSubmit={form.handleSubmit(onSubmit)}>\n  <Field name="email" label="Email">\n    <Input {...form.register('email')} type="email" />\n  </Field>\n  <Button type="submit" loading={form.formState.isSubmitting}>\n    Submit\n  </Button>\n</Form>`}>
          <div style={{ padding: 'var(--vhyx-space-4)', background: 'var(--vhyx-color-bg-subtle)', borderRadius: 'var(--vhyx-radius-md)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>
            See code example — connect react-hook-form via the <code>form</code> prop on <code>Form</code>.
          </div>
        </ComponentExample>
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <a href="/components/switch" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>← Switch</a>
        <a href="/components/select" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>Select →</a>
      </div>
    </>
  );
}
