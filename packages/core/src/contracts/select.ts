import type { ComponentContract } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract for the Select component.
 *
 * Expresses that a Select allows the user to choose one option from a list.
 * The selection is reversible — another option can be chosen before form submission.
 */
export const selectContract: Readonly<Partial<ComponentContract>> = Object.freeze({
  type: 'input',
  intent: 'select-option',
  description: 'Allows the user to choose one option from a dropdown list',
  requires: [],
  requiredPermissions: [],
  consequence: 'Updates the selected option value in the parent form context',
  affects: ['form'],
  reversible: true,
  safetyLevel: 'low',
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '0.0.1',
});
