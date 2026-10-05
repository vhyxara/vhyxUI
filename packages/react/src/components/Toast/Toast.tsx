'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CircleCheckIcon, CircleXIcon, InfoIcon, TriangleAlertIcon, XIcon } from '@vhyxui/icons';
import type { ComponentContract } from '@vhyxui/core';
import { toastContract } from '@vhyxui/core';
import { withAgentContract } from '@vhyxseal/react';
import type { ToastItem, ToastVariant } from '../../toast/toast-store';
import {
  configureStore,
  dismissToast,
  getToasts,
  subscribeToToasts,
} from '../../toast/toast-store';
import { usePresence } from '../shared/usePresence';
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
  // Toasts removed from the store stay rendered (`leaving`) until their exit animation has played.
  const [items, setItems] = useState<readonly RenderedToast[]>(() =>
    getToasts().map((item) => ({ item, leaving: false })),
  );

  useEffect(() => {
    configureStore({ maxToasts });
  }, [maxToasts]);

  useEffect(() => {
    const unsubscribe = subscribeToToasts(() => {
      setItems((prev) => mergeToasts(prev, getToasts()));
    });
    return unsubscribe;
  }, []);

  const handleExited = useCallback((id: string) => {
    setItems((prev) => prev.filter((r) => !(r.leaving && r.item.id === id)));
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
        {items.map(({ item, leaving }) => (
          <ToastItemComponent
            key={item.id}
            item={item}
            leaving={leaving}
            defaultDuration={defaultDuration}
            onExited={handleExited}
          />
        ))}
      </div>
    </>
  );
}

/** A toast as rendered: still in the store, or removed and playing its exit animation. */
interface RenderedToast {
  item: ToastItem;
  leaving: boolean;
}

/** Keeps rendered order stable: removed toasts stay in place marked `leaving`; new ones are appended. */
function mergeToasts(prev: readonly RenderedToast[], next: readonly ToastItem[]): RenderedToast[] {
  const byId = new Map(next.map((t) => [t.id, t]));
  const out: RenderedToast[] = prev.map((r) => {
    const current = byId.get(r.item.id);
    return current ? { item: current, leaving: false } : { item: r.item, leaving: true };
  });
  const seen = new Set(prev.map((r) => r.item.id));
  for (const t of next) if (!seen.has(t.id)) out.push({ item: t, leaving: false });
  return out;
}

// ─── ToastItem component ──────────────────────────────────────────────────────

function ToastItemComponent({
  item,
  leaving,
  defaultDuration,
  onExited,
}: {
  item: ToastItem;
  leaving: boolean;
  defaultDuration: number;
  onExited: (id: string) => void;
}): React.ReactElement | null {
  const dismiss = useCallback(() => dismissToast(item.id), [item.id]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exited = useCallback(() => onExited(item.id), [onExited, item.id]);
  const presence = usePresence(!leaving, exited);

  const duration = item.duration ?? defaultDuration;

  // Auto-dismiss after duration
  useEffect(() => {
    if (leaving || !isFinite(duration) || duration <= 0) return;
    timerRef.current = setTimeout(dismiss, duration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [dismiss, duration, leaving]);

  if (!presence.present) return null;

  return (
    // The slot animates its own row height so the rest of the stack slides instead of jumping.
    <div ref={presence.ref} className={styles['toast-slot']} data-state={presence.state}>
      <div className={styles['toast-clip']}>
        <div
          role="status"
          aria-live="polite"
          className={styles['toast']}
          data-variant={item.variant}
          data-state={presence.state}
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
                <XIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Returns the icon for a given toast variant. */
function variantIcon(variant: ToastVariant): React.ReactNode {
  switch (variant) {
    case 'success': return <CircleCheckIcon />;
    case 'danger': return <CircleXIcon />;
    case 'warning': return <TriangleAlertIcon />;
    default: return <InfoIcon />;
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
// Library-level contract for SealContext registration.
const toastSealContract = { ...toastContract, id: 'vhyxui-toast' } as Readonly<ComponentContract>;

export const Toast = Object.assign(
  withAgentContract(ToastProvider, toastSealContract),
  { displayName: 'VhyxToast' },
);
