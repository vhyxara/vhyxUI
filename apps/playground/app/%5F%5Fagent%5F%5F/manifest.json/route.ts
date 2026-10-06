import { defineContract, generateManifest } from '@vhyxseal/core';

// Serves /__agent__/manifest.json (a folder starting with %5F becomes a URL segment starting with "_").
export const dynamic = 'force-static';

const common = { requires: [], requiredPermissions: [], affects: [], reversible: true, requiresConfirmation: false, destructive: false, contractVersion: '1.0.0' } as const;

// What an AI agent can do in the VhyxUI playground. Everything happens in the browser and changes no data.
const CONTRACTS = [
  defineContract({ ...common, id: 'pick-component', type: 'navigation', intent: 'navigate', description: 'Open a component in the playground', consequence: 'Shows that component in the preview', safetyLevel: 'low' }),
  defineContract({ ...common, id: 'edit-props', type: 'input', intent: 'apply-filter', description: 'Change a prop of the previewed component (text, variant, size, state)', consequence: 'Re-renders the preview', safetyLevel: 'low' }),
  defineContract({ ...common, id: 'preview-width', type: 'input', intent: 'apply-filter', description: 'Preview at mobile, tablet or desktop width', consequence: 'Resizes the preview', safetyLevel: 'low' }),
  defineContract({ ...common, id: 'preview-theme', type: 'action', intent: 'apply-filter', description: 'Preview the component in the dark or light theme', consequence: 'Changes the preview theme', safetyLevel: 'low' }),
  defineContract({ ...common, id: 'inspector-tabs', type: 'navigation', intent: 'navigate', description: 'Switch the inspector between Props, Contract, Code, Tokens and Theme', consequence: 'Changes the visible panel', safetyLevel: 'low' }),
  defineContract({ ...common, id: 'reset-props', type: 'action', intent: 'reset-props', description: 'Reset every prop of the previewed component to its default', consequence: 'Discards the prop edits in this browser tab', reversible: false, safetyLevel: 'low' }),
  defineContract({ ...common, id: 'clear-console', type: 'action', intent: 'clear-log', description: 'Clear the agent console under the preview', consequence: 'Empties the console log in this tab', reversible: false, safetyLevel: 'low' }),
];

export function GET(): Response {
  const manifest = generateManifest(CONTRACTS, {
    domain: 'play.vhyxui.com',
    domainVerified: false,
    verificationToken: '',
    agentPolicy: { allowedAgents: ['*'], allowedActions: ['*'] },
  });
  return Response.json(manifest, { headers: { 'Cache-Control': 'public, max-age=3600', 'X-VhyxSeal-Version': manifest.vhyxseal } });
}
