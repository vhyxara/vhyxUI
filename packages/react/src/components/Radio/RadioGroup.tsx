'use client';

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ComponentContract } from '@vhyxui/core';
import { radioContract } from '@vhyxui/core';
import { useId } from '../shared/useId';
import styles from './Radio.module.css';

// ─── Context ──────────────────────────────────────────────────────────────────

interface RadioGroupContextValue {
  value: string | undefined;
  onValueChange: (value: string) => void;
  disabled: boolean;
  size: 'sm' | 'md' | 'lg';
  groupId: string;
  /** Refs of all registered radio item buttons, in DOM order. */
  registerItem: (itemValue: string, el: HTMLButtonElement | null) => void;
  /** Navigate to sibling radio item by direction. */
  navigateItem: (currentValue: string, direction: 'next' | 'prev') => void;
  /** Value of the first registered item — used for tab-order when nothing is selected. */
  firstValue: string | undefined;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/** @internal */
export function useRadioGroupContext(): RadioGroupContextValue {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) {
    throw new Error(
      '[VhyxUI] <RadioItem> must be used within <RadioGroup>. ' +
        'Wrap your RadioItem components with <RadioGroup>.',
    );
  }
  return ctx;
}

// ─── RadioGroup ───────────────────────────────────────────────────────────────

/** Size tokens available on the RadioGroup. */
export type RadioGroupSize = 'sm' | 'md' | 'lg';

/** Props for the RadioGroup component. */
export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled selected value. */
  value?: string;
  /** Default selected value for uncontrolled mode. */
  defaultValue?: string;
  /** Called when the selected value changes. */
  onValueChange?: (value: string) => void;
  /** When true, all items in the group are disabled. */
  disabled?: boolean;
  /** Layout direction of the radio items. @default 'vertical' */
  orientation?: 'horizontal' | 'vertical';
  /** Size applied to all radio items. @default 'md' */
  size?: RadioGroupSize;
  /** VhyxSeal contract override. */
  contract?: Partial<ComponentContract>;
}

/**
 * RadioGroup — context provider for a set of mutually exclusive RadioItems.
 *
 * Arrow keys navigate between items. Tab exits the group entirely.
 * Only the selected (or first) item is in the natural tab sequence.
 *
 * @example
 * <RadioGroup value={plan} onValueChange={setPlan}>
 *   <RadioItem value="free">Free</RadioItem>
 *   <RadioItem value="pro">Pro</RadioItem>
 * </RadioGroup>
 */
export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      disabled = false,
      orientation = 'vertical',
      size = 'md',
      contract,
      className,
      id,
      children,
      ...rest
    },
    ref,
  ) => {
    const internalId = useId('vhyx-radiogroup');
    const groupId = id ?? internalId;

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
    const currentValue = isControlled ? value : internalValue;

    // Registry of radio item elements keyed by their value, in insertion order
    const itemsRef = useRef<Map<string, HTMLButtonElement>>(new Map());
    const itemOrderRef = useRef<string[]>([]);
    // State so that when the first item registers, context consumers re-render
    // and can compute the correct tabIndex for the "or first" case.
    const [firstValue, setFirstValue] = useState<string | undefined>(undefined);

    const registerItem = useCallback(
      (itemValue: string, el: HTMLButtonElement | null) => {
        if (el) {
          const isNew = !itemsRef.current.has(itemValue);
          if (isNew) {
            itemOrderRef.current.push(itemValue);
            if (itemOrderRef.current.length === 1) {
              setFirstValue(itemValue);
            }
          }
          itemsRef.current.set(itemValue, el);
        } else {
          itemsRef.current.delete(itemValue);
          itemOrderRef.current = itemOrderRef.current.filter((v) => v !== itemValue);
          setFirstValue(itemOrderRef.current[0]);
        }
      },
      [],
    );

    const navigateItem = useCallback(
      (currentItemValue: string, direction: 'next' | 'prev') => {
        const order = itemOrderRef.current;
        const idx = order.indexOf(currentItemValue);
        if (idx === -1) return;

        const next =
          direction === 'next'
            ? (idx + 1) % order.length
            : (idx - 1 + order.length) % order.length;

        const nextValue = order[next];
        if (nextValue === undefined) return;

        const nextEl = itemsRef.current.get(nextValue);
        if (!nextEl || nextEl.disabled) return;

        nextEl.focus();
        if (!isControlled) setInternalValue(nextValue);
        onValueChange?.(nextValue);
      },
      [isControlled, onValueChange],
    );

    const handleValueChange = useCallback(
      (newValue: string) => {
        if (!isControlled) setInternalValue(newValue);
        onValueChange?.(newValue);
      },
      [isControlled, onValueChange],
    );

    const effectiveContract: Partial<ComponentContract> = useMemo(
      () => ({ ...radioContract, id: groupId, ...contract }),
      [groupId, contract],
    );

    const ctx = useMemo<RadioGroupContextValue>(
      () => ({
        value: currentValue,
        onValueChange: handleValueChange,
        disabled,
        size,
        groupId,
        registerItem,
        navigateItem,
        firstValue,
      }),
      [currentValue, handleValueChange, disabled, size, groupId, registerItem, navigateItem, firstValue],
    );

    const groupClass = [styles['group'], className].filter(Boolean).join(' ');

    return (
      <RadioGroupContext.Provider value={ctx}>
        <div
          ref={ref}
          id={groupId}
          role="radiogroup"
          aria-orientation={orientation}
          className={groupClass}
          data-orientation={orientation}
          data-size={size}
          data-vhyx-contract={JSON.stringify(effectiveContract)}
          {...rest}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  },
);

RadioGroup.displayName = 'VhyxRadioGroup';
