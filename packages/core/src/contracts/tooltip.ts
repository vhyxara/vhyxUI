import { defineContractTemplate } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract template for the Tooltip component.
 *
 * Expresses that a Tooltip displays supplementary information on hover or focus.
 * Display only — no user action, no data mutation.
 * Instance id is injected at render time: { ...tooltipContract, id: instanceId }
 */
export const tooltipContract = defineContractTemplate({
  type: 'display',
  intent: 'display-tooltip',
  description: 'Shows supplementary information about a trigger element on hover or focus',
  requires: [],
  requiredPermissions: [],
  consequence: 'None — display only. Hides on mouse leave, blur, or Escape.',
  affects: [],
  reversible: false,
  safetyLevel: 'low',
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '0.0.1',
});
