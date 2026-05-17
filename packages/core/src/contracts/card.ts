import type { ComponentContract } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract for the Card component.
 *
 * Expresses that a Card is a content container — display only by default.
 * When interactive=true, the developer should override intent to 'trigger-action'
 * or 'navigate' as appropriate for the card's clickable behaviour.
 */
export const cardContract: Readonly<Partial<ComponentContract>> = Object.freeze({
  type: 'display',
  intent: 'display-content',
  description: 'Displays grouped content in a visually distinct container',
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
