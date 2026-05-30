import { defineContractTemplate } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract template for the Breadcrumb component.
 *
 * Expresses that a Breadcrumb shows the current page location within a hierarchy
 * and provides navigation links to ancestor pages.
 * Instance id is injected at render time: { ...breadcrumbContract, id: instanceId }
 */
export const breadcrumbContract = defineContractTemplate({
  type: 'navigation',
  intent: 'navigate-breadcrumb',
  description: 'Displays the current page location in the site hierarchy with ancestor navigation links',
  requires: [],
  requiredPermissions: [],
  consequence: 'Navigates to an ancestor page when a breadcrumb link is activated',
  affects: ['view'],
  reversible: true,
  safetyLevel: 'low',
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '0.0.1',
});
