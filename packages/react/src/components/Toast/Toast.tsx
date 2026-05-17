'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ToastItem, ToastVariant } from '../../toast/toast-store';
import {
  configureStore,
  dismissToast,
  getToasts,
  subscribeToToasts,
} from '../../toast/toast-store';
import styles from './Toast.module.css';

// ─── ToastProvider ────────────────────────────────────────────────────────────

/** Position of the toast region on screen. */
export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/** Props for the ToastProvider. */
export interface ToastProviderProps {
  /** Position of the toast region. @default 'bottom-right' */
  position?: ToastPosition;
  /** Maximum number of simultaneous toasts. @default 5 */
  maxToasts?: number;
  /** Default auto-dismiss duration in ms. @default 5000 */
  defaultDuration?: number;
  /** Application children. */
  children?: React.ReactNode;
}

/**
 * ToastProvider — subscribes to the global toast store and renders active toasts.
 * Place inside VhyxUIProvider. Developers do not need to add this directly.
 */
export function ToastProvider({
  position = 'bottom-right',
  maxToasts = 5,
  defaultDuration = 5000,
  children,
}: ToastProviderProps): React.ReactElement {
  const [items, setItems] = useState<readonly ToastItem[]>(() => getToasts());

  useEffect(() => {
    configureStore({ maxToasts });
  }, [maxToasts]);

  useEffect(() => {
    const unsubscribe = subscribeToToasts(() => {
      setItems(getToasts());
    });
    return unsubscribe;
  }, []);

  return (
    <>
      {children}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="false"
        aria-label="Notifications"
        className={styles['region']}
        data-position={position}
      >
        {items.map((item) => (
          <ToastItemComponent
            key={item.id}
            item={item}
            defaultDuration={defaultDuration}
          />
        ))}
      </div>
    </>
  );
}

// ─── ToastItem component ──────────────────────────────────────────────────────

function ToastItemComponent({
  item,
  defaultDuration,
}: {
  item: ToastItem;
  defaultDuration: number;
}): React.ReactElement {
  const dismiss = useCallback(() => dismissToast(item.id), [item.id]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const duration = item.duration ?? defaultDuration;

  // Auto-dismiss after duration
  useEffect(() => {
    if (!isFinite(duration) || duration <= 0) return;
    timerRef.current = setTimeout(dismiss, duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dismiss, duration]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={styles['toast']}
      data-variant={item.variant}
      data-state="open"
    >
      <div className={styles['toast-content']}>
        <span className={styles['toast-icon']} aria-hidden="true">
          {variantIcon(item.variant)}
        </span>
        <div className={styles['toast-body']}>
          <span className={styles['toast-message']}>{item.message}</span>
          {item.description && (
            <span className={styles['toast-description']}>{item.description}</span>
          )}
        </div>
        {item.action && (
          <button
            type="button"
            className={styles['toast-action']}
            onClick={() => {
              item.action?.onClick();
              dismiss();
            }}
          >
            {item.action.label}
          </button>
        )}
        {item.dismissible !== false && (
          <button
            type="button"
            className={styles['toast-dismiss']}
            onClick={dismiss}
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
    </div>
  );
}

/** Returns the icon character for a given toast variant. */
function variantIcon(variant: ToastVariant): string {
  switch (variant) {
    case 'success': return '✓';
    case 'danger': return '✕';
    case 'warning': return '⚠';
    case 'info': return 'ℹ';
    default: return '●';
  }
}

// ─── Toast export object ──────────────────────────────────────────────────────

/**
 * Toast — the visual toast component.
 *
 * Developers interact with toasts via the `toast()` imperative API,
 * not this component directly. ToastProvider (rendered inside VhyxUIProvider)
 * manages the toast list automatically.
 */
export const Toast = Object.assign(ToastProvider, {
  displayName: 'VhyxToast',
});
