'use client';

import React, { useCallback, useState } from 'react';
import type { ComponentContract } from '@vhyxui/core';
import { checkboxContract } from '@vhyxui/core';
import { Slot } from '../shared/Slot';
import { useId } from '../shared/useId';
import styles from './Checkbox.module.css';

/** Checkbox checked value — boolean or 'indeterminate'. */
export type CheckedState = boolean | 'indeterminate';

/** Size tokens available on the Checkbox component. */
export type CheckboxSize = 'sm' | 'md' | 'lg';

/** Props for the Checkbox component. */
export interface CheckboxProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'defaultChecked'> {
  /** Controlled checked state. */
  checked?: CheckedState;
  /** Uncontrolled default checked state. @default false */
  defaultChecked?: CheckedState;
  /** Called when the checked state changes. */
  onCheckedChange?: (checked: CheckedState) => void;
  /** When true, renders the indeterminate state (dash mark). */
  indeterminate?: boolean;
  /** Size of the checkbox. @default 'md' */
  size?: CheckboxSize;
  /**
   * When true, renders as the child element instead of <button role="checkbox">.
   * ARIA attributes and click handler are merged onto the child via Slot.
   */
  asChild?: boolean;
  /** VhyxSeal contract override — merged with the default checkbox contract. */
  contract?: Partial<ComponentContract>;
}

/** Check SVG mark */
function CheckMark(): React.ReactElement {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles['check-icon']}
    >
      <polyline points="2,6 5,9 10,3" />
    </svg>
  );
}

/** Indeterminate dash mark */
function IndeterminateMark(): React.ReactElement {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      className={styles['check-icon']}
    >
      <line x1="2" y1="6" x2="10" y2="6" />
    </svg>
  );
}

/**
 * Checkbox — toggles a boolean or indeterminate selection.
 *
 * Renders as `<button role="checkbox">` for full styling control.
 * Checkmark animates in with scale(0) → scale(1) at duration-fast / easing-spring.
 * Supports indeterminate state for select-all table patterns.
 *
 * @example
 * <Checkbox
 *   checked={isChecked}
 *   onCheckedChange={setIsChecked}
 * />
 */
export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      indeterminate = false,
      size = 'md',
      asChild = false,
      contract,
      className,
      id,
      disabled,
      onClick,
      children,
      ...rest
    },
    ref,
  ) => {
    const internalId = useId('vhyx-checkbox');
    const checkboxId = id ?? internalId;

    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState<CheckedState>(defaultChecked);

    const currentChecked: CheckedState = indeterminate
      ? 'indeterminate'
      : isControlled
      ? (checked as CheckedState)
      : internalChecked;

    // TypeScript 5.9 infers the ternary as 'string | boolean' instead of the narrower literal
    // union — explicit annotation preserves the specific aria-checked type for strict mode.
    const ariaChecked: boolean | 'false' | 'mixed' | 'true' =
      currentChecked === 'indeterminate' ? 'mixed' : (currentChecked as boolean);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (disabled) return;

        let next: CheckedState;
        if (currentChecked === 'indeterminate') {
          next = true;
        } else {
          next = !currentChecked;
        }

        if (!isControlled) {
          setInternalChecked(next);
        }
        onCheckedChange?.(next);
      },
      [onClick, disabled, currentChecked, isControlled, onCheckedChange],
    );

    const effectiveContract: Partial<ComponentContract> = {
      ...checkboxContract,
      id: checkboxId,
      ...contract,
    };

    const buttonClass = [styles['checkbox'], className].filter(Boolean).join(' ');

    const dataState =
      currentChecked === 'indeterminate' ? 'indeterminate' : currentChecked ? 'checked' : 'unchecked';

    const sharedProps = {
      id: checkboxId,
      role: 'checkbox' as const,
      'aria-checked': ariaChecked,
      disabled,
      onClick: handleClick,
      className: buttonClass,
      'data-state': dataState,
      'data-size': size,
      'data-vhyx-contract': JSON.stringify(effectiveContract),
      ...rest,
    };

    if (asChild) {
      return (
        <Slot ref={ref} {...sharedProps}>
          {children}
        </Slot>
      );
    }

    return (
      <button ref={ref} type="button" {...sharedProps}>
        <span className={styles['indicator']}>
          {currentChecked === 'indeterminate' && <IndeterminateMark />}
          {currentChecked === true && <CheckMark />}
        </span>
      </button>
    );
  },
);

Checkbox.displayName = 'VhyxCheckbox';
