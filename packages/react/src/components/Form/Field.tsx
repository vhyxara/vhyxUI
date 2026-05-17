'use client';

import React from 'react';
import { useId } from '../shared/useId';
import { useFormContext } from './Form';
import styles from './Form.module.css';

/** Props for the Field component — the label/input/hint/error assembly layer. */
export interface FieldProps {
  /**
   * Field name — used to read validation errors from the parent Form context
   * when react-hook-form is wired up.
   */
  name: string;
  /** Label rendered above (or beside) the input. */
  label?: React.ReactNode;
  /** Helper text rendered below the input. Connected via aria-describedby. */
  hint?: React.ReactNode;
  /**
   * Error message. When set, the child input receives aria-invalid and
   * data-error attributes and the error text is announced as a live region.
   * If absent, Field reads the error from the parent Form context automatically.
   */
  error?: string;
  /** When true, renders a required indicator (*) next to the label. */
  required?: boolean;
  /** When true, renders an optional indicator next to the label. */
  optional?: boolean;
  /** Field layout. Overrides the parent Form layout when set. @default 'vertical' */
  layout?: 'vertical' | 'horizontal';
  /** The single interactive child element (Input, Textarea, Select, etc.). */
  children: React.ReactNode;
}

/**
 * Field — the missing layer. Label + input + hint + error in one first-class component.
 *
 * Automatically:
 * - Generates unique IDs and connects label htmlFor → input id
 * - Wires aria-describedby from input → hint and/or error text
 * - Propagates aria-invalid and data-error to the child when an error is set
 * - Reads validation errors from the parent Form context (react-hook-form)
 *
 * Developers rebuild Field on every project. VhyxUI ships it first class.
 *
 * @example
 * <Field name="email" label="Email" hint="We'll never share it" required>
 *   <Input type="email" />
 * </Field>
 */
export function Field({
  name,
  label,
  hint,
  error,
  required = false,
  optional = false,
  layout,
  children,
}: FieldProps): React.ReactElement {
  const fieldId = useId('field');
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;

  // Read error from Form context (react-hook-form) if not passed directly.
  const formCtx = useFormContext();
  const contextError = formCtx?.getFieldState?.(name)?.error?.message;
  const errorMessage = error ?? (typeof contextError === 'string' ? contextError : undefined);

  const hasError = !!errorMessage;
  const hasHint = !!hint;

  // Build aria-describedby — points to hint and error elements when they exist.
  const describedByParts: string[] = [];
  if (hasHint) describedByParts.push(hintId);
  if (hasError) describedByParts.push(errorId);
  const describedBy = describedByParts.length > 0 ? describedByParts.join(' ') : undefined;

  // Determine the layout to use — explicit prop overrides context.
  const effectiveLayout = layout ?? formCtx?.layout ?? 'vertical';

  // Inject accessibility props onto the child input via React.cloneElement.
  // The cast through unknown is necessary because children is typed as ReactNode
  // and we need to merge unknown props onto a generic element — the spread is safe
  // because we only add well-defined ARIA and data attributes.
  const child = React.isValidElement(children)
    ? React.cloneElement(
        children as React.ReactElement<Record<string, unknown>>,
        {
          id: fieldId,
          ...(describedBy !== undefined ? { 'aria-describedby': describedBy } : {}),
          ...(hasError ? { 'aria-invalid': true as const, 'data-error': true as const } : {}),
        },
      )
    : children;

  const wrapperClass = [
    styles['field'],
    effectiveLayout === 'horizontal' ? styles['field--horizontal'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClass} data-layout={effectiveLayout}>
      {label !== undefined && (
        <label htmlFor={fieldId} className={styles['label']}>
          {label}
          {required && (
            <span className={styles['required']} aria-hidden="true">
              {' '}*
            </span>
          )}
          {optional && (
            <span className={styles['optional']} aria-hidden="true">
              {' '}(optional)
            </span>
          )}
        </label>
      )}

      <div className={styles['control']}>{child}</div>

      {hasHint && (
        <span id={hintId} className={styles['hint']}>
          {hint}
        </span>
      )}

      {hasError && (
        <span
          id={errorId}
          className={styles['error']}
          role="alert"
          aria-live="assertive"
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
}

Field.displayName = 'VhyxField';
