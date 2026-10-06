import { defineContract, generateManifest } from '@vhyxseal/core';

// Serves /__agent__/manifest.json (a folder starting with %5F becomes a URL segment starting with "_").
// Static: the docs site is exported, so the manifest is written as a file at build time.
export const dynamic = 'force-static';

const common = { requires: [], requiredPermissions: [], affects: [], reversible: true, requiresConfirmation: false, destructive: false, contractVersion: '1.0.0' } as const;

// What an AI agent can do on the VhyxUI docs. Nothing here changes data, so every action is low risk.
const CONTRACTS = [
  defineContract({ ...common, id: 'search-docs', type: 'input', intent: 'search', description: 'Search the VhyxUI documentation', consequence: 'Shows matching pages', safetyLevel: 'low' }),
  defineContract({ ...common, id: 'open-page', type: 'navigation', intent: 'navigate', description: 'Open a docs page: a component, block, layout, icon set, theming, tokens or agent contracts', consequence: 'Navigates within the docs', safetyLevel: 'low' }),
  defineContract({ ...common, id: 'example-tabs', type: 'navigation', intent: 'navigate', description: 'Switch a live example between Preview, Code and Agent contract', consequence: 'Changes the visible tab', safetyLevel: 'low' }),
  defineContract({ ...common, id: 'copy-code', type: 'action', intent: 'copy-text', description: 'Copy a code example or the install command', consequence: 'Clipboard changes', safetyLevel: 'low' }),
  defineContract({ ...common, id: 'toggle-theme', type: 'action', intent: 'apply-filter', description: 'Switch between the dark and light theme', consequence: 'Changes colours on this device only', safetyLevel: 'low' }),
  defineContract({ ...common, id: 'open-playground', type: 'navigation', intent: 'navigate', description: 'Open the VhyxUI playground to try components live', consequence: 'Navigates to play.vhyxui.com', safetyLevel: 'low' }),
  defineContract({ ...common, id: 'family-switch', type: 'navigation', intent: 'navigate', description: 'Switch to the VhyxSeal or VhyxChart documentation', consequence: 'Navigates to another docs site', safetyLevel: 'low' }),
];

export function GET(): Response {
  const manifest = generateManifest(CONTRACTS, {
    domain: 'docs.vhyxui.com',
    domainVerified: false,
    verificationToken: '',
    agentPolicy: { allowedAgents: ['*'], allowedActions: ['*'] },
  });
  return Response.json(manifest, { headers: { 'Cache-Control': 'public, max-age=3600', 'X-VhyxSeal-Version': manifest.vhyxseal } });
}
