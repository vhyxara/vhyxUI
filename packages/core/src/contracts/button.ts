import type { ComponentContract } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract for the Button component.
 *
 * Expresses that a Button triggers a low-safety action. The destructive variant
 * merges safetyLevel: 'high' and destructive: true at runtime in the React component
 * (DECISION-014). This base contract covers all non-destructive variants.
 */
export const buttonContract: Readonly<Partial<ComponentContract>> = Object.freeze({
  type: 'action',
  intent: 'trigger-action',
  description: 'Triggers an action or submits a form when activated by the user',
  requires: [],
  requiredPermissions: [],
  consequence: 'Triggers the associated action',
  affects: [],
  reversible: false,
  safetyLevel: 'low',
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '0.0.1',
});
