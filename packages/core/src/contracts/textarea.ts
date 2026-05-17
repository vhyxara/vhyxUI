import type { ComponentContract } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract for the Textarea component.
 *
 * Expresses that a Textarea accepts multi-line text input. Reversible because
 * the user can edit or clear the content before form submission.
 */
export const textareaContract: Readonly<Partial<ComponentContract>> = Object.freeze({
  type: 'input',
  intent: 'enter-text',
  description: 'Accepts multi-line text content entered by the user',
  requires: [],
  requiredPermissions: [],
  consequence: 'Updates the multi-line field value in the parent form context',
  affects: ['form'],
  reversible: true,
  safetyLevel: 'low',
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '0.0.1',
});
