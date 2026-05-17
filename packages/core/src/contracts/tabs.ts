import type { ComponentContract } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract for the Tabs component.
 *
 * Expresses that a Tabs component navigates between content panels.
 * Activating a tab changes the visible panel — no data is submitted or deleted.
 */
export const tabsContract: Readonly<Partial<ComponentContract>> = Object.freeze({
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
