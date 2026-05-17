import type { ComponentContract } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract for the Form component.
 *
 * Expresses that a Form collects and submits user data. Submission is not
 * reversible — the agent must be certain fields are correct before triggering.
 * safetyLevel medium because form submission typically writes to external systems.
 */
export const formContract: Readonly<Partial<ComponentContract>> = Object.freeze({
  type: 'action',
  intent: 'submit-form',
  description: 'Collects field values and submits them to the server or handler',
  requires: [],
  requiredPermissions: [],
  consequence: 'Sends form data to the configured handler — may create or update records',
  affects: ['form'],
  reversible: false,
  safetyLevel: 'medium',
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '0.0.1',
});
