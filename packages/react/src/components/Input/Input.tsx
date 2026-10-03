'use client';

import React, { useState, useCallback } from 'react';
import type { ComponentContract } from '@vhyxui/core';
import { inputContract } from '@vhyxui/core';
import { withAgentContract } from '@vhyxseal/react';
import { EyeIcon, EyeOffIcon, XIcon } from '@vhyxui/icons';
import { useId } from '../shared/useId';
import styles from './Input.module.css';

/** Size tokens available on the Input component. */
export type InputSize = 'sm' | 'md' | 'lg';

/** Props for the Input component. */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Size of the input, maps to --vhyx-size-* height tokens. @default 'md' */
  size?: InputSize;
  /** Optional icon element rendered inside the input. */
  icon?: React.ReactNode;
  /** Side the icon appears on. @default 'left' */
  iconPosition?: 'left' | 'right';
  /** Content rendered after the input (inside the wrapper, to the right). */
  suffix?: React.ReactNode;
  /** Content rendered before the input (inside the wrapper, to the left). */
  prefix?: React.ReactNode;
  /** When true, always shows a clear button regardless of type. */
  clearable?: boolean;
  /** Called when the clear button is clicked. */
  onClear?: () => void;
  /** When true, applies the error visual state and sets aria-invalid. */
  error?: boolean;
  /** VhyxSeal contract override — merged with the default input contract. */
  contract?: Partial<ComponentContract>;
}

/** Eye icon for the password show/hide toggle: crossed while the password is visible. */
function PasswordToggleIcon({ crossed }: { crossed?: boolean }): React.ReactElement {
  return crossed ? <EyeOffIcon /> : <EyeIcon />;
}

/** Clear icon for clearable inputs (slightly heavier stroke at its small size). */
function ClearIcon(): React.ReactElement {
  return <XIcon size="0.875em" strokeWidth={2.5} />;
}

/**
 * Input — a text input with icon, prefix, suffix, clear, and password toggle support.
 *
 * Error state triggers the vhyx-shake animation and applies danger styling.
 * type="password" includes a built-in show/hide toggle.
 * type="search" includes a built-in clear button when a value is present.
 *
 * @example
 * <Input placeholder="Email" type="email" size="md" />
 */
const InputBase = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      icon,
      iconPosition = 'left',
      suffix,
      prefix,
      clearable = false,
      onClear,
      error = false,
      contract,
      className,
      id,
      type,
      value,
      onChange,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      ...rest
    },
    ref,
  ) => {
    const internalId = useId('vhyx-input');
    const inputId = id ?? internalId;

    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = useCallback(() => {
      setShowPassword((prev) => !prev);
    }, []);

    const isPassword = type === 'password';
    const isSearch = type === 'search';
    const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const hasValue = value !== undefined ? String(value).length > 0 : false;
    const showClearButton = clearable || (isSearch && hasValue);

    const handleClear = useCallback(() => {
      onClear?.();
    }, [onClear]);

    const hasIcon = !!icon;
    const hasPrefix = !!prefix;
    const hasSuffix = !!suffix || isPassword || showClearButton;

    const effectiveContract: Partial<ComponentContract> = {
      ...inputContract,
      id: inputId,
      ...contract,
    };

    const wrapperClass = [
      styles['wrapper'],
      error ? styles['wrapper--error'] : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div
        className={wrapperClass}
        data-size={size}
        data-error={error ? true : undefined}
        data-has-icon={hasIcon ? true : undefined}
        data-icon-position={hasIcon ? iconPosition : undefined}
      >
        {hasPrefix && (
          <span className={styles['prefix']} aria-hidden="true">
            {prefix}
          </span>
        )}
        {hasIcon && iconPosition === 'left' && (
          <span className={styles['icon']} aria-hidden="true">
            {icon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={effectiveType}
          value={value}
          onChange={onChange}
          aria-invalid={error ? true : undefined}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          className={styles['input']}
          data-vhyx-contract={JSON.stringify(effectiveContract)}
          {...rest}
        />

        {hasIcon && iconPosition === 'right' && (
          <span className={styles['icon']} aria-hidden="true">
            {icon}
          </span>
        )}

        {showClearButton && (
          <button
            type="button"
            className={styles['clear-button']}
            onClick={handleClear}
            aria-label="Clear"
            tabIndex={0}
          >
            <ClearIcon />
          </button>
        )}

        {isPassword && (
          <button
            type="button"
            className={styles['toggle-button']}
            onClick={togglePassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={0}
          >
            <PasswordToggleIcon crossed={showPassword} />
          </button>
        )}

        {hasSuffix && suffix && (
          <span className={styles['suffix']} aria-hidden="true">
            {suffix}
          </span>
        )}
      </div>
    );
  },
);

InputBase.displayName = 'VhyxInput';

// Library-level contract for SealContext registration; per-instance ids set via DOM attribute.
const inputSealContract = { ...inputContract, id: 'vhyxui-input' } as Readonly<ComponentContract>;

export const Input = withAgentContract(InputBase, inputSealContract) as React.ForwardRefExoticComponent<
  React.PropsWithoutRef<InputProps> & React.RefAttributes<HTMLInputElement>
>;
Input.displayName = 'VhyxInput';
