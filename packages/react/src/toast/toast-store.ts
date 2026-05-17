/**
 * Toast store — zero React dependency.
 *
 * Singleton subscribe/notify pattern. The ToastProvider subscribes and
 * re-renders when toasts change. toast() calls push items to this store.
 */

/** Semantic variants available on a toast. */
export type ToastVariant = 'default' | 'success' | 'danger' | 'warning' | 'info';

/** Options accepted by toast() calls. */
export interface ToastOptions {
  /** Supplementary description rendered below the message. */
  description?: string;
  /**
   * Duration in milliseconds before the toast auto-dismisses.
   * Pass Infinity to prevent auto-dismiss.
   */
  duration?: number;
  /** Optional action button rendered inside the toast. */
  action?: { label: string; onClick: () => void };
  /** When true, renders a Dismiss button. @default true */
  dismissible?: boolean;
}

/** A single toast item held in the store. */
export interface ToastItem extends ToastOptions {
  /** Unique identifier auto-generated on creation. */
  id: string;
  /** Primary message text. */
  message: string;
  /** Semantic variant controlling colour and icon. */
  variant: ToastVariant;
}

type Listener = () => void;

/** Internal store state. */
let toasts: readonly ToastItem[] = [];
let maxToasts = 5;
const listeners = new Set<Listener>();

let counter = 0;

function notify(): void {
  for (const listener of listeners) {
    listener();
  }
}

/** @internal Configure maxToasts from the ToastProvider. */
export function configureStore(options: { maxToasts?: number }): void {
  if (options.maxToasts !== undefined) {
    maxToasts = options.maxToasts;
  }
}

/** Returns the current list of toasts. */
export function getToasts(): readonly ToastItem[] {
  return toasts;
}

/**
 * Adds a toast to the store.
 * When the maxToasts limit is reached, the oldest toast is removed first.
 */
export function addToast(item: Omit<ToastItem, 'id'>): string {
  counter += 1;
  const id = `vhyx-toast-${counter}`;
  const newItem: ToastItem = { ...item, id };

  const current = [...toasts];
  if (current.length >= maxToasts) {
    current.shift(); // remove oldest
  }
  toasts = [...current, newItem];
  notify();
  return id;
}

/** Removes a toast by id. */
export function dismissToast(id: string): void {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

/** Removes all toasts. */
export function dismissAllToasts(): void {
  toasts = [];
  notify();
}

/**
 * Subscribes to store changes.
 * @returns An unsubscribe function.
 */
export function subscribeToToasts(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
