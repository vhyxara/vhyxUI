'use client';

import React from 'react';
import type { ComponentContract } from '@vhyxui/core';
import { separatorContract } from '@vhyxui/core';
import { withAgentContract } from '@vhyxseal/react';
import styles from './Separator.module.css';

/** Props for the Separator component. */
export interface SeparatorProps extends React.HTMLAttributes<HTMLElement> {
  /** Layout direction of the separator line. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /**
   * When true (default), the separator is purely visual — rendered as aria-hidden.
   * When false, renders with role="separator" so screen readers announce it.
   */
  decorative?: boolean;
  /**
   * Optional text label centered on a horizontal separator.
   * Not supported on vertical separators.
   */
  label?: string;
}

/**
 * Separator — a visual or semantic divider between content sections.
 *
 * decorative=true (default): aria-hidden — screen readers skip it.
 * decorative=false: role="separator" with aria-orientation — screen readers announce it.
 * label: renders centered text, commonly used for "OR" dividers.
 *
 * @example
 * <Separator orientation="horizontal" />
 * <Separator label="OR" decorative={false} />
 */
const SeparatorBase = React.forwardRef<HTMLElement, SeparatorProps>(
  (
    {
      orientation = 'horizontal',
      decorative = true,
      label,
      className,
      ...rest
    },
    ref,
  ) => {
    const separatorClass = [styles['separator'], className].filter(Boolean).join(' ');

    const sharedProps = {
      className: separatorClass,
      'data-orientation': orientation,
      ...(decorative
        ? { 'aria-hidden': true as const }
        : { role: 'separator' as const, 'aria-orientation': orientation }),
      ...rest,
    };

    if (label && orientation === 'horizontal') {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          className={[styles['separator--labeled'], className].filter(Boolean).join(' ')}
          data-orientation={orientation}
          {...(decorative ? { 'aria-hidden': true } : { role: 'separator', 'aria-orientation': orientation })}
          {...rest}
        >
          <span className={styles['line']} />
          <span className={styles['label-text']}>{label}</span>
          <span className={styles['line']} />
        </div>
      );
    }

    return (
      <hr
        ref={ref as React.Ref<HTMLHRElement>}
        {...sharedProps}
      />
    );
  },
);

SeparatorBase.displayName = 'VhyxSeparator';

// Library-level contract for SealContext registration.
const separatorSealContract = { ...separatorContract, id: 'vhyxui-separator' } as Readonly<ComponentContract>;

export const Separator = withAgentContract(SeparatorBase, separatorSealContract) as React.ForwardRefExoticComponent<
  React.PropsWithoutRef<SeparatorProps> & React.RefAttributes<HTMLElement>
>;
Separator.displayName = 'VhyxSeparator';
