import type { ComponentContract } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract for the Switch component.
 *
 * Expresses that a Switch toggles a binary on/off state. The toggle is
 * reversible — the user can switch back at any time.
 */
export const switchContract: Readonly<Partial<ComponentContract>> = Object.freeze({
  type: 'input',
  intent: 'toggle-state',
  description: 'Toggles a binary on/off state immediately upon interaction',
  requires: [],
  requiredPermissions: [],
  consequence: 'Changes the boolean state of the controlled feature',
  affects: [],
  reversible: true,
  safetyLevel: 'low',
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '0.0.1',
});
