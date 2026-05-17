import {
  addToast,
  dismissToast,
  dismissAllToasts,
  type ToastOptions,
  type ToastItem,
  type ToastVariant,
} from './toast-store';

/** Default duration before a toast auto-dismisses. */
const DEFAULT_DURATION = 5000;

/** Build an addToast payload — conditionally omits undefined optional fields. */
function buildPayload(
  message: string,
  variant: ToastVariant,
  options?: ToastOptions,
): Omit<ToastItem, 'id'> {
  const payload: Omit<ToastItem, 'id'> = {
    message,
    variant,
    duration: options?.duration ?? DEFAULT_DURATION,
    dismissible: options?.dismissible ?? true,
  };
  if (options?.description !== undefined) {
    payload.description = options.description;
  }
  if (options?.action !== undefined) {
    payload.action = options.action;
  }
  return payload;
}

/**
 * Shows a toast notification.
 *
 * @returns The id of the created toast (use with toast.dismiss(id) to remove early).
 *
 * @example
 * toast('File saved')
 * toast.success('Upload complete')
 * toast.danger('Connection lost')
 * toast.warning('Storage nearly full')
 * toast.info('Update available', { action: { label: 'Install', onClick: install } })
 */
function toastFn(message: string, options?: ToastOptions): string {
  return addToast(buildPayload(message, 'default', options));
}

/** Shows a success toast. */
toastFn.success = function success(message: string, options?: ToastOptions): string {
  return addToast(buildPayload(message, 'success', options));
};

/** Shows a danger (error) toast. */
toastFn.danger = function danger(message: string, options?: ToastOptions): string {
  return addToast(buildPayload(message, 'danger', options));
};

/** Shows a warning toast. */
toastFn.warning = function warning(message: string, options?: ToastOptions): string {
  return addToast(buildPayload(message, 'warning', options));
};

/** Shows an info toast. */
toastFn.info = function info(message: string, options?: ToastOptions): string {
  return addToast(buildPayload(message, 'info', options));
};

/**
 * Dismisses a specific toast by id.
 * When called with no argument, dismisses all toasts.
 */
toastFn.dismiss = function dismiss(id?: string): void {
  if (id !== undefined) {
    dismissToast(id);
  } else {
    dismissAllToasts();
  }
};

/** The VhyxUI imperative toast API. */
export const toast = toastFn;
