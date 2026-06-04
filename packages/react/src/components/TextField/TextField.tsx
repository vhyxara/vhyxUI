'use client';

import React from 'react';
import { Field } from '../Form/Field';
import { Input } from '../Input/Input';
import type { FieldProps } from '../Form/Field';
import type { InputProps } from '../Input/Input';

/** Field-owned props — pulled from FieldProps without the HTML div base to avoid event-handler conflicts. */
type FieldOwnProps = Pick<FieldProps, 'name' | 'label' | 'hint' | 'error' | 'required' | 'optional' | 'layout'>;

/**
 * Combined props for TextField.
 * `error` is a string (error message) from FieldProps.
 * `id` is omitted — Field generates and manages it internally.
 */
export type TextFieldProps = FieldOwnProps & Omit<InputProps, 'id' | 'error'>;

/**
 * TextField — convenience compound of Field + Input.
 *
 * Renders a labelled text input with hint, error, and required indicator
 * fully wired. Prefer this over manually composing Field + Input for
 * single-line text inputs.
 *
 * @example
 * <TextField name="email" label="Email" type="email" placeholder="you@example.com" required />
 */
export function TextField({
  name,
  label,
  hint,
  error,
  required,
  optional,
  layout,
  ...inputProps
}: TextFieldProps): React.ReactElement {
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
      <Input name={name} error={!!error} {...inputProps} />
    </Field>
  );
}

TextField.displayName = 'VhyxTextField';
