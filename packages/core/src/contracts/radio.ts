import { defineContractTemplate } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract template for the RadioGroup component.
 *
 * Expresses that a RadioGroup captures a mutually exclusive selection.
 * The selection is reversible — a different option can be chosen before form submission.
 * Instance id is injected at render time: { ...radioContract, id: instanceId }
 */
export const radioContract = defineContractTemplate({
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
