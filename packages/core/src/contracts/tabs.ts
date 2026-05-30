import { defineContractTemplate } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract template for the Tabs component.
 *
 * Expresses that a Tabs component navigates between content panels.
 * Activating a tab changes the visible panel — no data is submitted or deleted.
 * Instance id is injected at render time: { ...tabsContract, id: instanceId }
 */
export const tabsContract = defineContractTemplate({
  type: 'navigation',
  intent: 'navigate-tabs',
  description: 'Switches between content panels by activating a tab trigger',
  requires: [],
  requiredPermissions: [],
  consequence: 'Changes the active content panel — no data mutation',
  affects: ['view'],
  reversible: true,
  safetyLevel: 'low',
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '0.0.1',
});
