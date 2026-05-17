import type { ComponentContract } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract for the Progress component.
 *
 * Expresses that a Progress bar is a visual indicator of completion — display only.
 * Agents read value and max to determine how far along an operation is.
 */
export const progressContract: Readonly<Partial<ComponentContract>> = Object.freeze({
  type: 'display',
  intent: 'display-progress',
  description: 'Displays the completion percentage of an ongoing operation',
  requires: [],
  requiredPermissions: [],
  consequence: 'None — display only.',
  affects: [],
  reversible: false,
  safetyLevel: 'low',
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '0.0.1',
});
