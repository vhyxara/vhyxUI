import type { ComponentContract } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract for the Checkbox component.
 *
 * Expresses that a Checkbox toggles a boolean or indeterminate selection state.
 * The toggle is reversible — the user can uncheck before form submission.
 */
export const checkboxContract: Readonly<Partial<ComponentContract>> = Object.freeze({
  type: 'input',
  intent: 'toggle-selection',
  description: 'Toggles a boolean selection — checked, unchecked, or indeterminate',
  requires: [],
  requiredPermissions: [],
  consequence: 'Updates the checked state in the parent form context',
  affects: ['form'],
  reversible: true,
  safetyLevel: 'low',
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '0.0.1',
});
