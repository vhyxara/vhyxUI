'use client';

import React, { useMemo } from 'react';
import type { ComponentContract } from '@vhyxui/core';
import { buttonContract } from '@vhyxui/core';
import { withAgentContract } from '@vhyxseal/react';
import { Slot } from '../shared/Slot';
import { Spinner } from '../Spinner';
import { useId } from '../shared/useId';
import styles from './Button.module.css';

/** All variants available on the Button component. */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';

/** Size tokens available on the Button component. */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

/** Props for the Button component. */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button. @default 'primary' */
  variant?: ButtonVariant;
  /** Size of the button, maps to --vhyx-size-* height tokens. @default 'md' */
  size?: ButtonSize;
  /** When true, shows a spinner and disables interaction. */
  loading?: boolean;
  /** Optional icon element rendered alongside button text. */
  icon?: React.ReactNode;
  /** Side the icon appears on. @default 'left' */
  iconPosition?: 'left' | 'right';
  /** When true, renders icon only with no text. Requires aria-label for accessibility. */
  iconOnly?: boolean;
  /**
   * When true, renders as the child element instead of a <button>.
   * All Button props are merged onto the child via Slot.
   * Use for navigation links or custom trigger elements.
   */
  asChild?: boolean;
  /** VhyxSeal contract override — merged with the default button contract. */
  contract?: Partial<ComponentContract>;
}

/**
 * Button — triggers actions or submits forms.
 *
 * All 6 variants and 4 sizes. Loading state built in.
 * Icon support with left/right positioning.
 * Destructive variant auto-upgrades the VhyxSeal contract safety level.
 * asChild=true renders the child element with Button styling merged in.
 *
 * @example
 * <Button variant="primary" size="md" onClick={handleSubmit}>Submit</Button>
 *
 * @example
 * <Button variant="ghost" size="sm" asChild>
 *   <a href="/home">Home</a>
 * </Button>
 */
const ButtonBase = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      iconOnly = false,
      asChild = false,
      contract,
      className,
      children,
      disabled,
      id,
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) => {
    const internalId = useId('vhyx-button');
    const buttonId = id ?? internalId;

    if (process.env['NODE_ENV'] !== 'production' && iconOnly && !ariaLabel) {
      console.warn(
        '[VhyxUI] <Button iconOnly> requires an aria-label for accessibility. ' +
          'Screen reader users will not be able to identify this button.',
      );
    }

    const effectiveContract = useMemo((): Partial<ComponentContract> => {
      const destructiveUpgrade =
        variant === 'destructive'
          ? ({ safetyLevel: 'high', destructive: true, requiresConfirmation: true } as const)
          : {};
      return { ...buttonContract, id: buttonId, ...destructiveUpgrade, ...contract };
    }, [variant, buttonId, contract]);

    const isDisabled = disabled ?? loading;
    const buttonClass = [styles['button'], className].filter(Boolean).join(' ');

    const sharedProps = {
      id: buttonId,
      className: buttonClass,
      'aria-busy': loading ? (true as const) : undefined,
      'aria-label': ariaLabel,
      'data-variant': variant,
      'data-size': size,
      'data-loading': loading ? (true as const) : undefined,
      'data-icon-only': iconOnly ? (true as const) : undefined,
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
      <button ref={ref} disabled={isDisabled} {...sharedProps}>
        {loading && (
          <Spinner size="sm" variant="white" aria-hidden="true" label="" className={styles['spinner']} />
        )}
        {icon && iconPosition === 'left' && !iconOnly && (
          <span className={styles['icon']} aria-hidden="true">
            {icon}
          </span>
        )}
        {iconOnly && icon ? (
          <span className={styles['icon']} aria-hidden="true">
            {icon}
          </span>
        ) : (
          !iconOnly && (
            <span className={styles['content']}>{children}</span>
          )
        )}
        {icon && iconPosition === 'right' && !iconOnly && (
          <span className={styles['icon']} aria-hidden="true">
            {icon}
          </span>
        )}
      </button>
    );
  },
);

ButtonBase.displayName = 'VhyxButton';

// Library-level contract for SealContext registration. The template has no id by design;
// a stable library-level id is used here. Per-instance ids are set via the DOM attribute above.
const buttonSealContract = { ...buttonContract, id: 'vhyxui-button' } as Readonly<ComponentContract>;

export const Button = withAgentContract(ButtonBase, buttonSealContract) as React.ForwardRefExoticComponent<
  React.PropsWithoutRef<ButtonProps> & React.RefAttributes<HTMLButtonElement>
>;
Button.displayName = 'VhyxButton';
