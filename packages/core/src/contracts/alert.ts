import type { ComponentContract } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract for the Alert component.
 *
 * Expresses that an Alert is a persistent in-page notification — display only.
 * Unlike Toast, Alert persists until explicitly dismissed by the user or application.
 */
export const alertContract: Readonly<Partial<ComponentContract>> = Object.freeze({
  type: 'display',
  intent: 'display-alert',
  description: 'Displays a persistent contextual alert message to the user',
  requires: [],
  requiredPermissions: [],
  consequence: 'None — display only. Persists until dismissed.',
  affects: [],
  reversible: false,
  safetyLevel: 'low',
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '0.0.1',
});
