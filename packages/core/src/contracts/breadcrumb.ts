import type { ComponentContract } from '@vhyxseal/core';

/**
 * Default VhyxSeal contract for the Breadcrumb component.
 *
 * Expresses that a Breadcrumb shows the current page location within a hierarchy
 * and provides navigation links to ancestor pages.
 */
export const breadcrumbContract: Readonly<Partial<ComponentContract>> = Object.freeze({
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
