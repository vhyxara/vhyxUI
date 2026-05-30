import { defineContractTemplate } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract template for the Switch component.
 *
 * Expresses that a Switch toggles a binary on/off state. The toggle is
 * reversible — the user can switch back at any time.
 * Instance id is injected at render time: { ...switchContract, id: instanceId }
 */
export const switchContract = defineContractTemplate({
  type: 'input',
  intent: 'toggle-state',
  description: 'Toggles a binary on/off state immediately upon interaction',
  requires: [],
  requiredPermissions: [],
  consequence: 'Changes the boolean state of the controlled feature',
  affects: [],
  reversible: true,
  safetyLevel: 'low',
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '0.0.1',
});
