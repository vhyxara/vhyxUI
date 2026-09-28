import { NextResponse } from 'next/server';
import { defineContract, generateManifest } from '@vhyxseal/core';

const common = {
  requires: [],
  requiredPermissions: [],
  affects: [],
  reversible: true,
  requiresConfirmation: false,
  destructive: false,
  contractVersion: '1.0.0',
} as const;

// What an AI agent can do on the VhyxUI landing page. Nothing here changes
// data, so every action is low risk and needs no human confirmation.
const CONTRACTS = [
  defineContract({ ...common, id: 'get-started', type: 'navigation', intent: 'navigate', description: 'Open the VhyxUI documentation', consequence: 'Navigates to the docs site', safetyLevel: 'low' }),
  defineContract({ ...common, id: 'copy-install', type: 'action', intent: 'copy-text', description: 'Copy the npm install command', consequence: 'Clipboard changes', safetyLevel: 'low' }),
  defineContract({ ...common, id: 'view-source', type: 'navigation', intent: 'navigate', description: 'Open the VhyxUI repository on GitHub', consequence: 'Navigates to github.com', safetyLevel: 'low' }),
  defineContract({ ...common, id: 'agent-story', type: 'input', intent: 'apply-filter', description: 'Switch the diagram between the person and agent scenarios', consequence: 'Replays the diagram', safetyLevel: 'low' }),
];

export function GET(request: Request): NextResponse {
  const domain = new URL(request.url).hostname || 'localhost';
  const manifest = generateManifest(CONTRACTS, {
    domain,
    domainVerified: false,
    verificationToken: '',
    agentPolicy: { allowedAgents: ['*'], allowedActions: ['*'] },
  });
  return NextResponse.json(manifest, {
    headers: { 'Cache-Control': 'public, max-age=3600', 'X-VhyxSeal-Version': manifest.vhyxseal },
  });
}
