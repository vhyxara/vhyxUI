'use client';

import React, { createContext, useCallback, useContext, useMemo } from 'react';
import type {
  FieldValues,
  FormState,
  UseFormRegister,
  UseFormReturn,
} from 'react-hook-form';
import styles from './Form.module.css';

/** Minimal field validation state used by Field to read error messages. */
type FieldValidationState = {
  error?: { message?: string };
  invalid: boolean;
  isDirty: boolean;
  isTouched: boolean;
  isValidating: boolean;
};

// ─── Form Context ──────────────────────────────────────────────────────────────

/** Value provided by the Form context to all descendant Fields. */
export interface FormContextValue {
  /** react-hook-form form state, available when a form prop is provided. */
  formState?: FormState<FieldValues>;
  /** react-hook-form register function, available when a form prop is provided. */
  register?: UseFormRegister<FieldValues>;
  /** Per-field state accessor from react-hook-form, available when a form prop is provided. */
  getFieldState?: (name: string) => FieldValidationState;
  /** When true, all form controls in this form are disabled. */
  disabled: boolean;
  /** Size applied to all controls in this form. */
  size: 'sm' | 'md' | 'lg';
  /** Layout direction of fields in this form. */
  layout: 'vertical' | 'horizontal' | 'inline';
}

const FormContext = createContext<FormContextValue | null>(null);

/**
 * Returns the current Form context value.
 * Returns null when used outside a Form — Field and other consumers handle this gracefully.
 */
export function useFormContext(): FormContextValue | null {
  return useContext(FormContext);
}

// ─── Form Props ────────────────────────────────────────────────────────────────

/** Props for the Form component. */
export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  /**
   * react-hook-form return value from useForm().
   * When provided, Field components automatically read validation errors,
   * and form submission is handled via form.handleSubmit(onSubmit).
   */
  form?: UseFormReturn<FieldValues>;
  /** Field layout within this form. @default 'vertical' */
  layout?: 'vertical' | 'horizontal' | 'inline';
  /** Size applied to all controls in this form. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
  /**
   * When true, all form controls are disabled.
   * Propagated to Field children via context.
   */
  disabled?: boolean;
  /**
   * Called with validated form data on submission.
   * When form prop is provided, this is called by react-hook-form after validation.
   * When form prop is absent, called on native form submit with empty FieldValues.
   */
  onSubmit?: (data: FieldValues) => void | Promise<void>;
}

/**
 * Form — context provider for VhyxUI form architecture.
 *
 * Wrap fields with Form to propagate layout, size, disabled state,
 * and react-hook-form validation errors to all descendant Field components.
 *
 * @example
 * // With react-hook-form
 * const form = useForm({ resolver: zodResolver(schema) });
 * <Form form={form} onSubmit={saveData} layout="vertical">
 *   <Field name="email" label="Email"><Input type="email" /></Field>
 *   <Button type="submit">Save</Button>
 * </Form>
 *
 * @example
 * // Without react-hook-form (native / uncontrolled)
 * <Form layout="vertical">
 *   <Field name="email" label="Email"><Input type="email" /></Field>
 * </Form>
 */
export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  (
    {
      form,
      layout = 'vertical',
      size = 'md',
      disabled = false,
      onSubmit,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    // Extract react-hook-form integration when provided.
    const formState = form?.formState;
    const register = form?.register;
    // Wrap getFieldState to accept a plain string and return our minimal FieldValidationState.
    // react-hook-form's getFieldState takes a typed field name — we cast to satisfy that.
    const getFieldState = form
      ? (name: string): FieldValidationState =>
          form.getFieldState(name as Parameters<typeof form.getFieldState>[0])
      : undefined;

    const handleSubmit = useCallback(
      (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (form && onSubmit) {
          void form.handleSubmit((data) => {
            void onSubmit(data);
          })(e);
        } else if (onSubmit) {
          void onSubmit({} as FieldValues);
        }
      },
      [form, onSubmit],
    );

    const ctx = useMemo<FormContextValue>(
      () => {
        const value: FormContextValue = { disabled, size, layout };
        if (formState !== undefined) value.formState = formState;
        if (register !== undefined) value.register = register;
        if (getFieldState !== undefined) value.getFieldState = getFieldState;
        return value;
      },
      [formState, register, getFieldState, disabled, size, layout],
    );

    const formClass = [styles['form'], className].filter(Boolean).join(' ');

    return (
      <FormContext.Provider value={ctx}>
        <form
          ref={ref}
          className={formClass}
          data-layout={layout}
          data-size={size}
          onSubmit={handleSubmit}
          {...rest}
        >
          {children}
        </form>
      </FormContext.Provider>
    );
  },
);

Form.displayName = 'VhyxForm';
