import type { ComponentContract } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract for the Drawer component.
 *
 * Expresses that a Drawer slides in a panel from a screen edge. Navigation type
 * because drawers typically expose navigation or contextual content, not confirmations.
 */
export const drawerContract: Readonly<Partial<ComponentContract>> = Object.freeze({
  type: 'navigation',
  intent: 'open-drawer',
  description: 'Opens a slide-in panel from a screen edge for navigation or contextual content',
  requires: [],
  requiredPermissions: [],
  consequence: 'Renders a side panel overlay — underlying page remains accessible',
  affects: ['view'],
  reversible: true,
  safetyLevel: 'low',
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '0.0.1',
});
