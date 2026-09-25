import React, { useState } from 'react';
import { Alert, Button, Checkbox, HStack, SelectField, Stack, Text, TextareaField, TextField } from '@vhyxui/react';

/** Field kinds SimpleForm can render. */
export type SimpleFieldType = 'text' | 'email' | 'password' | 'number' | 'url' | 'tel' | 'textarea' | 'select' | 'checkbox';

/** A field definition. */
export interface SimpleField {
  name: string;
  label: string;
  type?: SimpleFieldType;
  placeholder?: string;
  hint?: React.ReactNode;
  required?: boolean;
  /** For `select`. */
  options?: Array<{ label: string; value: string }>;
  defaultValue?: string | boolean;
  /** Return an error message, or undefined when valid. */
  validate?: (value: string | boolean, values: SimpleFormValues) => string | undefined;
}

/** Submitted values, keyed by field name. */
export type SimpleFormValues = Record<string, string | boolean>;

/** Props for SimpleForm. */
export interface SimpleFormProps {
  fields: SimpleField[];
  onSubmit: (values: SimpleFormValues) => void | Promise<void>;
  /** @default 'Submit' */
  submitLabel?: React.ReactNode;
  /** Extra buttons next to submit (e.g. Cancel). */
  secondaryAction?: React.ReactNode;
  /** Message shown after a successful submit. */
  successMessage?: React.ReactNode;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function initialValues(fields: SimpleField[]): SimpleFormValues {
  const out: SimpleFormValues = {};
  for (const f of fields) out[f.name] = f.defaultValue ?? (f.type === 'checkbox' ? false : '');
  return out;
}

/**
 * SimpleForm — a validated form from a field list. No form library required.
 * Uses TextField / TextareaField / SelectField / Checkbox under the hood, so
 * labels, errors and VhyxSeal contracts come for free.
 *
 * @example
 * <SimpleForm
 *   fields={[
 *     { name: 'email', label: 'Email', type: 'email', required: true },
 *     { name: 'plan', label: 'Plan', type: 'select', options: [{ label: 'Pro', value: 'pro' }] },
 *     { name: 'terms', label: 'I agree to the terms', type: 'checkbox', required: true },
 *   ]}
 *   onSubmit={save}
 * />
 */
export function SimpleForm({ fields, onSubmit, submitLabel = 'Submit', secondaryAction, successMessage }: SimpleFormProps): React.ReactElement {
  const [values, setValues] = useState<SimpleFormValues>(() => initialValues(fields));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  const setValue = (name: string, value: string | boolean): void => {
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => {
      if (!(name in e)) return e;
      const { [name]: _removed, ...rest } = e;
      return rest;
    });
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    for (const f of fields) {
      const v = values[f.name] ?? '';
      if (f.required && (v === '' || v === false)) next[f.name] = f.type === 'checkbox' ? 'Required' : `${f.label} is required`;
      else if (f.type === 'email' && typeof v === 'string' && v && !EMAIL.test(v)) next[f.name] = 'Enter a valid email address';
      else {
        const custom = f.validate?.(v, values);
        if (custom) next[f.name] = custom;
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setStatus('submitting');
    try {
      await onSubmit(values);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setFormError(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  return (
    <form noValidate onSubmit={(e) => void submit(e)}>
      <Stack gap={4}>
        {formError && <Alert variant="danger">{formError}</Alert>}
        {status === 'success' && successMessage && <Alert variant="success">{successMessage}</Alert>}
        {fields.map((f) => {
          const error = errors[f.name];
          const common = { name: f.name, label: f.label, required: f.required ?? false, ...(f.hint ? { hint: f.hint } : {}), ...(error ? { error } : {}) };
          const v = values[f.name];
          switch (f.type) {
            case 'textarea':
              return (
                <TextareaField key={f.name} {...common} placeholder={f.placeholder} value={String(v ?? '')} onChange={(e) => setValue(f.name, e.target.value)} />
              );
            case 'select':
              return (
                <SelectField
                  key={f.name}
                  {...common}
                  options={f.options ?? []}
                  {...(f.placeholder ? { placeholder: f.placeholder } : {})}
                  value={String(v ?? '')}
                  onValueChange={(next) => setValue(f.name, next)}
                />
              );
            case 'checkbox':
              return (
                <Stack key={f.name} gap={1}>
                  <HStack as="label" gap={2} style={{ cursor: 'pointer' }}>
                    <Checkbox name={f.name} checked={v === true} onCheckedChange={(c) => setValue(f.name, c === true)} aria-invalid={error ? true : undefined} />
                    <Text as="span" size="sm">{f.label}</Text>
                  </HStack>
                  {error && <Text size="sm" tone="danger" role="alert">{error}</Text>}
                </Stack>
              );
            default:
              return (
                <TextField
                  key={f.name}
                  {...common}
                  type={f.type ?? 'text'}
                  placeholder={f.placeholder}
                  value={String(v ?? '')}
                  onChange={(e) => setValue(f.name, e.target.value)}
                />
              );
          }
        })}
        <HStack gap={2} justify="end">
          {secondaryAction}
          <Button type="submit" loading={status === 'submitting'}>{submitLabel}</Button>
        </HStack>
      </Stack>
    </form>
  );
}
