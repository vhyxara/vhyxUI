'use client';

import React, { useState } from 'react';
import type { ComponentContract } from '@vhyxui/core';
import { alertContract } from '@vhyxui/core';
import styles from './Alert.module.css';

/** Visual variant of the Alert. */
export type AlertVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

/** Props for the Alert component. */
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Semantic variant. @default 'default' */
  variant?: AlertVariant;
  /** Optional title rendered in bold above the message. */
  title?: string;
  /** Icon override. Defaults to a variant-appropriate symbol when omitted. */
  icon?: React.ReactNode;
  /** When true, renders a Dismiss button. @default false */
  dismissible?: boolean;
  /** Callback fired when the Dismiss button is clicked. */
  onDismiss?: () => void;
  /** VhyxSeal contract override. Merged on top of the default alertContract. */
  contract?: Partial<ComponentContract>;
}

/**
 * Alert — persistent in-page notification.
 *
 * Alerts are persistent (no auto-dismiss). Use Toast for ephemeral messages.
 * fade-in on mount only — no exit animation (Alert persists until explicitly dismissed).
 *
 * ARIA:
 * - `role="alert"` for danger variant (assertive live region)
 * - `role="status"` for all other variants (polite live region)
 *
 * @example
 * <Alert variant="success" title="Saved">Your changes have been saved.</Alert>
 * <Alert variant="danger" dismissible onDismiss={handleDismiss}>An error occurred.</Alert>
 */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = 'default',
      title,
      icon,
      dismissible = false,
      onDismiss,
      contract,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const [dismissed, setDismissed] = useState(false);

    if (dismissed) return null;

    const effectiveContract: Readonly<Partial<ComponentContract>> = {
      ...alertContract,
      ...contract,
    };

    const role = variant === 'danger' ? 'alert' : 'status';
    const ariaLive = variant === 'danger' ? 'assertive' : 'polite';

    const resolvedIcon = icon ?? defaultIcon(variant);

    function handleDismiss(): void {
      setDismissed(true);
      onDismiss?.();
    }

    return (
      <div
        ref={ref}
        role={role}
        aria-live={ariaLive}
        className={[styles['alert'], className].filter(Boolean).join(' ')}
        data-variant={variant}
        data-vhyx-contract={JSON.stringify(effectiveContract)}
        {...rest}
      >
        <span className={styles['alert-icon']} aria-hidden="true">
          {resolvedIcon}
        </span>
        <div className={styles['alert-body']}>
          {title && <span className={styles['alert-title']}>{title}</span>}
          {children && <span className={styles['alert-message']}>{children}</span>}
        </div>
        {dismissible && (
          <button
            type="button"
            className={styles['alert-dismiss']}
            onClick={handleDismiss}
            aria-label="Dismiss"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
            >
              <line x1="2" y1="2" x2="10" y2="10" />
              <line x1="10" y1="2" x2="2" y2="10" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);

Alert.displayName = 'VhyxAlert';

/** Returns the default icon string for a given variant. */
function defaultIcon(variant: AlertVariant): string {
  switch (variant) {
    case 'success': return '✓';
    case 'danger':  return '✕';
    case 'warning': return '⚠';
    case 'info':    return 'ℹ';
    default:        return '●';
  }
}
