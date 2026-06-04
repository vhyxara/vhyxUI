'use client';

import React from 'react';
import { Field } from '../Form/Field';
import { Textarea } from '../Textarea/Textarea';
import type { FieldProps } from '../Form/Field';
import type { TextareaProps } from '../Textarea/Textarea';

/** Field-owned props — pulled from FieldProps without the HTML div base to avoid event-handler conflicts. */
type FieldOwnProps = Pick<FieldProps, 'name' | 'label' | 'hint' | 'error' | 'required' | 'optional' | 'layout'>;

/**
 * Combined props for TextareaField.
 * `error` is a string (error message) from FieldProps.
 * `id` is omitted — Field generates and manages it internally.
 */
export type TextareaFieldProps = FieldOwnProps & Omit<TextareaProps, 'id' | 'error'>;

/**
 * TextareaField — convenience compound of Field + Textarea.
 *
 * Renders a labelled multi-line textarea with hint, error, and required
 * indicator fully wired. Prefer this over manually composing Field + Textarea.
 *
 * @example
 * <TextareaField name="bio" label="Bio" minRows={4} placeholder="Tell us about yourself" />
 */
export function TextareaField({
  name,
  label,
  hint,
  error,
  required,
  optional,
  layout,
  ...textareaProps
}: TextareaFieldProps): React.ReactElement {
  return (
    <Field
      name={name}
      label={label}
      hint={hint}
      error={error}
      required={required}
      optional={optional}
      layout={layout}
    >
      <Textarea name={name} error={!!error} {...textareaProps} />
    </Field>
  );
}

TextareaField.displayName = 'VhyxTextareaField';
