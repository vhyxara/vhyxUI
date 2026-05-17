import type { ComponentContract } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract for the Dialog component.
 *
 * Expresses that a Dialog opens a modal overlay requiring user interaction.
 * type 'confirmation' signals to agents that the dialog interrupts flow and
 * must be resolved (confirmed or dismissed) before proceeding.
 * Safety of the dialog's contents is determined by its child contracts.
 */
export const dialogContract: Readonly<Partial<ComponentContract>> = Object.freeze({
  type: 'confirmation',
  intent: 'open-dialog',
  description: 'Opens a modal dialog overlay that interrupts the current workflow',
  requires: [],
  requiredPermissions: [],
  consequence: 'Renders a blocking overlay — underlying page is inaccessible until dismissed',
  affects: ['view'],
  reversible: true,
  safetyLevel: 'low',
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '0.0.1',
});
