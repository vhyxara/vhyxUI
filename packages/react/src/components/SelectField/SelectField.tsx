'use client';

import React from 'react';
import { Field } from '../Form/Field';
import { Select } from '../Select/Select';
import type { FieldProps } from '../Form/Field';

/** Field-owned props — picked from FieldProps without the HTML div base. */
type FieldOwnProps = Pick<FieldProps, 'name' | 'label' | 'hint' | 'error' | 'required' | 'optional' | 'layout'>;

/** A single option rendered inside SelectField. */
export interface SelectFieldOption {
  label: string;
  value: string;
}

/**
 * Props for SelectField.
 * `error` is a string (error message) from FieldProps.
 * `placeholder` is passed to the root Select (not to Select.Trigger).
 */
export interface SelectFieldProps extends FieldOwnProps {
  /** The currently selected value (controlled). */
  value: string;
  /** Called when a new option is selected. */
  onValueChange: (value: string) => void;
  /** Options to render inside the dropdown. */
  options: SelectFieldOption[];
  /** Placeholder shown in the trigger when no value is selected. */
  placeholder?: string;
  /** When true, the trigger is disabled. */
  disabled?: boolean;
  /** Size applied to the Select and its sub-components. @default 'md' */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * SelectField — convenience compound of Field + Select.
 *
 * Renders a labelled dropdown with hint, error, and required indicator
 * fully wired. Prefer this over manually composing Field + Select for
 * single-selection dropdowns driven by a flat options array.
 *
 * @example
 * <SelectField
 *   name="country"
 *   label="Country"
 *   value={value}
 *   onValueChange={setValue}
 *   options={[{ label: 'United States', value: 'us' }]}
 *   placeholder="Select a country"
 * />
 */
export function SelectField({
  name,
  label,
  hint,
  error,
  required,
  optional,
  layout,
  options,
  placeholder,
  value,
  onValueChange,
  disabled,
  size,
}: SelectFieldProps): React.ReactElement {
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
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        size={size}
        placeholder={placeholder}
      >
        {/* aria-label on the trigger so axe sees a discernible name on the combobox button */}
        <Select.Trigger aria-label={typeof label === 'string' ? label : undefined} />
        <Select.Content>
          {options.map((opt) => (
            <Select.Item key={opt.value} value={opt.value}>
              {opt.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </Field>
  );
}

SelectField.displayName = 'VhyxSelectField';
