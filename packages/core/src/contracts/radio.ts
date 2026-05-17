import type { ComponentContract } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract for the RadioGroup component.
 *
 * Expresses that a RadioGroup captures a mutually exclusive selection.
 * The selection is reversible — a different option can be chosen before form submission.
 */
export const radioContract: Readonly<Partial<ComponentContract>> = Object.freeze({
  type: 'input',
  intent: 'select-option',
  description: 'Captures a single mutually exclusive selection from a set of radio options',
  requires: [],
  requiredPermissions: [],
  consequence: 'Updates the selected radio value in the parent form context',
  affects: ['form'],
  reversible: true,
  safetyLevel: 'low',
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '0.0.1',
});
