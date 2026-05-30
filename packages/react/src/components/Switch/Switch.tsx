'use client';

import React, { useCallback, useState } from 'react';
import type { ComponentContract } from '@vhyxui/core';
import { switchContract } from '@vhyxui/core';
import { withAgentContract } from '@vhyxseal/react';
import { Slot } from '../shared/Slot';
import { useId } from '../shared/useId';
import styles from './Switch.module.css';

/** Size tokens available on the Switch component. */
export type SwitchSize = 'sm' | 'md' | 'lg';

/** Props for the Switch component. */
export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Controlled checked state. */
  checked?: boolean;
  /** Default checked state for uncontrolled mode. @default false */
  defaultChecked?: boolean;
  /** Called when the switch is toggled. */
  onCheckedChange?: (checked: boolean) => void;
  /** Size of the switch. @default 'md' */
  size?: SwitchSize;
  /**
   * When true, renders as the child element instead of <button role="switch">.
   * ARIA attributes and handlers are merged onto the child via Slot.
   */
  asChild?: boolean;
  /** VhyxSeal contract override. */
  contract?: Partial<ComponentContract>;
}

/**
 * Switch — toggles a binary on/off state immediately upon interaction.
 *
 * Renders as `<button role="switch">`. Space or Enter toggles.
 * The thumb translates via CSS transition at duration-normal / easing-spring
 * — this spring animation is what makes the Switch feel premium.
 *
 * @example
 * <Switch checked={enabled} onCheckedChange={setEnabled} />
 */
const SwitchBase = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      size = 'md',
      asChild = false,
      contract,
      className,
      id,
      disabled,
      onClick,
      onKeyDown,
      children,
      ...rest
    },
    ref,
  ) => {
    const internalId = useId('vhyx-switch');
    const switchId = id ?? internalId;

    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(defaultChecked);
    const currentChecked = isControlled ? (checked as boolean) : internalChecked;

    const toggle = useCallback(() => {
      if (disabled) return;
      const next = !currentChecked;
      if (!isControlled) setInternalChecked(next);
      onCheckedChange?.(next);
    }, [disabled, currentChecked, isControlled, onCheckedChange]);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        toggle();
      },
      [onClick, toggle],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(e);
        // Space is handled natively by button; Enter needs explicit handling
        if (e.key === 'Enter') {
          e.preventDefault();
          toggle();
        }
      },
      [onKeyDown, toggle],
    );

    const effectiveContract: Partial<ComponentContract> = {
      ...switchContract,
      id: switchId,
      ...contract,
    };

    const buttonClass = [styles['switch'], className].filter(Boolean).join(' ');

    const sharedProps = {
      id: switchId,
      role: 'switch' as const,
      'aria-checked': currentChecked,
      disabled,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      className: buttonClass,
      'data-state': currentChecked ? 'checked' : 'unchecked',
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
        <span className={styles['thumb']} />
      </button>
    );
  },
);

SwitchBase.displayName = 'VhyxSwitch';

// Library-level contract for SealContext registration; per-instance ids set via DOM attribute.
const switchSealContract = { ...switchContract, id: 'vhyxui-switch' } as Readonly<ComponentContract>;

export const Switch = withAgentContract(SwitchBase, switchSealContract) as React.ForwardRefExoticComponent<
  React.PropsWithoutRef<SwitchProps> & React.RefAttributes<HTMLButtonElement>
>;
Switch.displayName = 'VhyxSwitch';
