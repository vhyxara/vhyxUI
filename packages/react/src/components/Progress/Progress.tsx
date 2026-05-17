'use client';

import React, { useMemo } from 'react';
import type { ComponentContract } from '@vhyxui/core';
import { progressContract } from '@vhyxui/core';
import { useId } from '../shared/useId';
import styles from './Progress.module.css';

/** Size tokens available on the Progress component. */
export type ProgressSize = 'xs' | 'sm' | 'md' | 'lg';

/** Color variant of the progress bar fill. */
export type ProgressVariant = 'default' | 'success' | 'warning' | 'danger';

/** Props for the Progress component. */
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Current progress value (0 to max). */
  value?: number;
  /** Maximum value. @default 100 */
  max?: number;
  /**
   * When true, shows an indeterminate animation — use when progress is unknown.
   * Omits aria-valuenow when set.
   */
  indeterminate?: boolean;
  /** Size (height) of the progress bar. @default 'md' */
  size?: ProgressSize;
  /** Color variant of the progress bar fill. @default 'default' */
  variant?: ProgressVariant;
  /** When true, renders a percentage label above the bar. */
  showLabel?: boolean;
  /** Custom label text. Overrides the computed percentage when provided. */
  label?: string;
  /** VhyxSeal contract override. */
  contract?: Partial<ComponentContract>;
}

/**
 * Progress — communicates the completion status of an operation.
 *
 * Always has role="progressbar" with full ARIA value attributes.
 * indeterminate=true uses the vhyx-indeterminate animation when value is unknown.
 * Width transition at duration-slow / easing-standard.
 *
 * @example
 * <Progress value={60} max={100} variant="success" showLabel />
 */
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value,
      max = 100,
      indeterminate = false,
      size = 'md',
      variant = 'default',
      showLabel = false,
      label,
      contract,
      className,
      id,
      ...rest
    },
    ref,
  ) => {
    const internalId = useId('vhyx-progress');
    const progressId = id ?? internalId;

    const percentage = useMemo(() => {
      if (value === undefined || indeterminate) return 0;
      const clamped = Math.max(0, Math.min(value, max));
      return Math.round((clamped / max) * 100);
    }, [value, max, indeterminate]);

    const displayLabel = label ?? `${percentage}%`;

    const effectiveContract: Partial<ComponentContract> = {
      ...progressContract,
      id: progressId,
      ...contract,
    };

    const wrapperClass = [styles['wrapper'], className].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        id={progressId}
        className={wrapperClass}
        data-size={size}
        data-variant={variant}
        data-vhyx-contract={JSON.stringify(effectiveContract)}
        {...rest}
      >
        {showLabel && (
          <span className={styles['label']} aria-hidden="true">
            {displayLabel}
          </span>
        )}
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={indeterminate ? undefined : (value ?? 0)}
          aria-label={displayLabel}
          className={styles['track']}
        >
          <div
            className={styles['fill']}
            data-indeterminate={indeterminate ? true : undefined}
            style={indeterminate ? undefined : { width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  },
);

Progress.displayName = 'VhyxProgress';
