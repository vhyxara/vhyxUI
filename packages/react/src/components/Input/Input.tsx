'use client';

import React, { useState, useCallback } from 'react';
import type { ComponentContract } from '@vhyxui/core';
import { inputContract } from '@vhyxui/core';
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

/** Eye icon for password show/hide toggle. */
function EyeIcon({ crossed }: { crossed?: boolean }): React.ReactElement {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: '1em', height: '1em' }}
    >
      {crossed ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
          <line x1="1" y1="1" x2="23" y2="23" />
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx={12} cy={12} r={3} />
        </>
      )}
    </svg>
  );
}

/** Clear / X icon for clearable inputs. */
function ClearIcon(): React.ReactElement {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      style={{ width: '0.75em', height: '0.75em' }}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
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
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
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
            <EyeIcon crossed={showPassword} />
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

Input.displayName = 'VhyxInput';
