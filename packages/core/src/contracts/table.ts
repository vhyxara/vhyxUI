import { defineContractTemplate } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract template for the Table component.
 *
 * Tables are read-only structured data — the most valuable thing for an agent
 * to read reliably. Instance id is injected at render time.
 */
export const tableContract = defineContractTemplate({
  type: 'display',
  intent: 'display-data',
  description: 'Displays structured rows and columns of data',
  requires: [],
  requiredPermissions: [],
  consequence: 'None — display only.',
  affects: [],
  reversible: true,
  safetyLevel: 'low',
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '0.0.1',
});
