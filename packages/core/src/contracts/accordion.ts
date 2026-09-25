import { defineContractTemplate } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract template for the Accordion component.
 *
 * Expanding or collapsing a section only changes what is visible — agents can
 * toggle freely to read hidden content. Instance id is injected at render time.
 */
export const accordionContract = defineContractTemplate({
  type: 'navigation',
  intent: 'toggle-section',
  description: 'Expands or collapses a section of content to reveal or hide it',
  requires: [],
  requiredPermissions: [],
  consequence: 'Shows or hides the section content. No data changes.',
  affects: [],
  reversible: true,
  safetyLevel: 'low',
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '0.0.1',
});
