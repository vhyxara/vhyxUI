'use client';

import React from 'react';
import styles from './Badge.module.css';

/** Visual variant of the Badge. */
export type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline';

/** Size of the Badge. */
export type BadgeSize = 'sm' | 'md' | 'lg';

/** Props for the Badge component. */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Visual variant. @default 'default' */
  variant?: BadgeVariant;
  /** Size of the badge. @default 'md' */
  size?: BadgeSize;
  /**
   * When true, renders a small circular dot indicator with no text.
   * Useful for notification indicators.
   */
  dot?: boolean;
  /**
   * Numeric count to display. When count exceeds max, displays "{max}+".
   * Ignored when dot=true.
   */
  count?: number;
  /** Maximum count before truncation. @default 99 */
  max?: number;
}

/**
 * Badge — small status label, count indicator, or categorical marker.
 *
 * Supports 6 semantic variants and 3 sizes.
 * dot=true renders a notification dot with no text.
 * count + max renders a capped numeric display ("99+").
 *
 * No VhyxSeal contract — Badge is purely informational, no agent action.
 *
 * @example
 * <Badge variant="success">Active</Badge>
 * <Badge count={120} max={99} />
 * <Badge dot variant="danger" />
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'default',
      size = 'md',
      dot = false,
      count,
      max = 99,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const badgeClass = [styles['badge'], className].filter(Boolean).join(' ');

    const content = (): React.ReactNode => {
      if (dot) return null;
      if (count !== undefined) {
        return count > max ? `${max}+` : String(count);
      }
      return children;
    };

    return (
      <span
        ref={ref}
        className={badgeClass}
        data-variant={variant}
        data-size={size}
        data-dot={dot ? true : undefined}
        {...rest}
      >
        {content()}
      </span>
    );
  },
);

Badge.displayName = 'VhyxBadge';
