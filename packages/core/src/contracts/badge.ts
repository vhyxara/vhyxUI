import { defineContractTemplate } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract template for the Badge component.
 *
 * Expresses that a Badge is a small status indicator — display only.
 * Agents read badge content to understand counts, states, or labels.
 * Instance id is injected at render time: { ...badgeContract, id: instanceId }
 */
export const badgeContract = defineContractTemplate({
  type: 'display',
  intent: 'display-status',
  description: 'Displays a small status label, count, or categorical indicator',
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
