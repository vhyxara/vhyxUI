import { defineContractTemplate } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract template for the Pagination component.
 *
 * Expresses that Pagination navigates between pages of a data set.
 * Page changes update the visible content slice — no data is mutated.
 * Instance id is injected at render time: { ...paginationContract, id: instanceId }
 */
export const paginationContract = defineContractTemplate({
  type: 'navigation',
  intent: 'navigate-page',
  description: 'Navigates between pages of a paginated data set',
  requires: [],
  requiredPermissions: [],
  consequence: 'Changes the visible page of the data set — no data mutation',
  affects: ['view'],
  reversible: true,
  safetyLevel: 'low',
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '0.0.1',
});
