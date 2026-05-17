import type { ComponentContract } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract for the Input component.
 *
 * Expresses that an Input accepts user text. The field value is reversible —
 * the user can clear or modify the input before the parent form is submitted.
 */
export const inputContract: Readonly<Partial<ComponentContract>> = Object.freeze({
  type: 'input',
  intent: 'enter-text',
  description: 'Accepts a text value entered by the user',
  requires: [],
  requiredPermissions: [],
  consequence: 'Updates the field value in the parent form context',
  affects: ['form'],
  reversible: true,
  safetyLevel: 'low',
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '0.0.1',
});
