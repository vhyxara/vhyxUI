import type { ComponentContract } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract for the Toast component.
 *
 * Expresses that a Toast is a transient notification — display only,
 * no data mutation. Agents read toast content to confirm prior actions succeeded.
 */
export const toastContract: Readonly<Partial<ComponentContract>> = Object.freeze({
  type: 'display',
  intent: 'notify',
  description: 'Displays a transient notification message to the user',
  requires: [],
  requiredPermissions: [],
  consequence: 'None — display only. Disappears after the configured duration.',
  affects: [],
  reversible: false,
  safetyLevel: 'low',
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '0.0.1',
});
