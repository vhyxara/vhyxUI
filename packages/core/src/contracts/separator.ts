import { defineContractTemplate } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract template for the Separator component.
 *
 * Expresses that a Separator is a visual or semantic divider — display only.
 * When decorative=true, it carries no semantic meaning. When decorative=false,
 * agents can use it to understand structural grouping of adjacent content.
 * Instance id is injected at render time: { ...separatorContract, id: instanceId }
 */
export const separatorContract = defineContractTemplate({
  type: 'display',
  intent: 'separate-content',
  description: 'Visually or semantically separates adjacent content sections',
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
