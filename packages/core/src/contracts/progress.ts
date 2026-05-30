import { defineContractTemplate } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract template for the Progress component.
 *
 * Expresses that a Progress bar is a visual indicator of completion — display only.
 * Agents read value and max to determine how far along an operation is.
 * Instance id is injected at render time: { ...progressContract, id: instanceId }
 */
export const progressContract = defineContractTemplate({
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
