'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { useRadioGroupContext } from './RadioGroup';
import styles from './Radio.module.css';

/** Props for the RadioItem component. */
export interface RadioItemProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** The value this item represents in the RadioGroup. */
  value: string;
  /** When true, this item cannot be selected. */
  disabled?: boolean;
  /** Label content rendered alongside the radio indicator. */
  children?: React.ReactNode;
}

/**
 * RadioItem — a single option within a RadioGroup.
 *
 * Renders as `<button role="radio">`. Arrow keys navigate between items.
 * Tab exits the group entirely. Only the selected or first item is tabbable.
 *
 * Must be used inside a RadioGroup.
 */
export const RadioItem = React.forwardRef<HTMLButtonElement, RadioItemProps>(
  ({ value, disabled, children, className, onClick, onKeyDown, ...rest }, ref) => {
    const ctx = useRadioGroupContext();

    const isSelected = ctx.value === value;
    const isDisabled = disabled ?? ctx.disabled;

    const internalRef = useRef<HTMLButtonElement>(null);

    // Merge external ref with internal ref
    const setRef = useCallback(
      (node: HTMLButtonElement | null) => {
        (internalRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }
      },
      [ref],
    );

    // Register/unregister this item in the group's item registry
    useEffect(() => {
      ctx.registerItem(value, internalRef.current);
      return () => {
        ctx.registerItem(value, null);
      };
    }, [ctx, value]);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (!isDisabled) {
          ctx.onValueChange(value);
        }
      },
      [onClick, isDisabled, ctx, value],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(e);

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          ctx.navigateItem(value, 'next');
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          ctx.navigateItem(value, 'prev');
        }
        // Space and Enter select the item — handled via onClick (native button behaviour)
      },
      [onKeyDown, ctx, value],
    );

    // Only the selected item (or the first if no selection) is in the natural tab sequence.
    // This ensures the group is reachable via Tab even when nothing is pre-selected.
    const isFirstInGroup = !ctx.value && ctx.firstValue === value;
    const tabIndex = isSelected || isFirstInGroup ? 0 : -1;

    const itemClass = [styles['item'], className].filter(Boolean).join(' ');

    return (
      <button
        ref={setRef}
        type="button"
        role="radio"
        aria-checked={isSelected}
        disabled={isDisabled}
        tabIndex={tabIndex}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={itemClass}
        data-state={isSelected ? 'checked' : 'unchecked'}
        data-size={ctx.size}
        data-disabled={isDisabled ? true : undefined}
        {...rest}
      >
        <span className={styles['radio-indicator']}>
          {isSelected && <span className={styles['radio-dot']} />}
        </span>
        {children && (
          <span className={styles['radio-label']}>{children}</span>
        )}
      </button>
    );
  },
);

RadioItem.displayName = 'VhyxRadioItem';
