import type { ComponentContract } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract for the Popover component.
 *
 * Expresses that a Popover opens a non-modal floating panel anchored to a trigger.
 * Unlike Dialog, a Popover does not block the rest of the page.
 */
export const popoverContract: Readonly<Partial<ComponentContract>> = Object.freeze({
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
