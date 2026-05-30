import { defineContractTemplate } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract template for the Spinner component.
 *
 * Expresses that a Spinner signals an in-progress loading state — display only.
 * Agents check for a Spinner's presence to detect when the application is busy.
 * Instance id is injected at render time: { ...spinnerContract, id: instanceId }
 */
export const spinnerContract = defineContractTemplate({
  type: 'display',
  intent: 'display-loading',
  description: 'Indicates that an asynchronous operation is in progress',
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
