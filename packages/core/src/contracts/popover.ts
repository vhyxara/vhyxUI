import { defineContractTemplate } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract template for the Popover component.
 *
 * Expresses that a Popover opens a non-modal floating panel anchored to a trigger.
 * Unlike Dialog, a Popover does not block the rest of the page.
 * Instance id is injected at render time: { ...popoverContract, id: instanceId }
 */
export const popoverContract = defineContractTemplate({
  type: 'display',
  intent: 'open-popover',
  description: 'Opens a non-modal floating panel anchored to a trigger element',
  requires: [],
  requiredPermissions: [],
  consequence: 'Renders a floating panel — underlying page remains fully interactive',
  affects: ['view'],
  reversible: true,
  safetyLevel: 'low',
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '0.0.1',
});
