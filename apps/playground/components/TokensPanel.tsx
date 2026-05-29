'use client';

import React, { useState } from 'react';
import type { ComponentDef } from './component-defs';

interface TokensPanelProps {
  def: ComponentDef;
}

function categoryOf(name: string): string {
  if (name.includes('-color-')) return 'Color';
  if (name.includes('-space-') || name.includes('-size-') || name.includes('-radius-')) return 'Spacing';
  if (name.includes('-text-') || name.includes('-font-') || name.includes('-weight-') || name.includes('-leading-')) return 'Typography';
  if (name.includes('-duration-') || name.includes('-easing-')) return 'Motion';
  return 'Other';
}

const CATEGORY_ORDER = ['Color', 'Spacing', 'Typography', 'Motion', 'Other'];

export function TokensPanel({ def }: TokensPanelProps): React.ReactElement {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  function handleCopy(name: string): void {
    void navigator.clipboard.writeText(`var(${name})`).then(() => {
      setCopiedToken(name);
      setTimeout(() => { setCopiedToken(null); }, 1500);
    });
  }

  if (def.tokens.length === 0) {
    return (
      <div className="pg-panel-empty">
        <p>No token reference for this component.</p>
      </div>
    );
  }

  // Group tokens by category
  const grouped: Record<string, typeof def.tokens> = {};
  for (const token of def.tokens) {
    const cat = categoryOf(token.name);
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat]!.push(token);
  }

  return (
    <div className="pg-tokens-panel">
      <p className="pg-panel-hint">
        Override in your <code>:root {'{}'}</code> to theme this component.
      </p>
      {CATEGORY_ORDER.filter((cat) => grouped[cat]?.length).map((cat) => (
        <div key={cat} className="pg-tokens-group">
          <p className="pg-tokens-group-label">{cat}</p>
          {grouped[cat]!.map((token) => (
            <div key={token.name} className="pg-token-row">
              <div className="pg-token-name-wrap">
                <code className="pg-token-name">{token.name}</code>
                <button
                  type="button"
                  className="pg-token-copy"
                  aria-label={`Copy ${token.name}`}
                  onClick={() => { handleCopy(token.name); }}
                >
                  {copiedToken === token.name ? '✓' : '⧉'}
                </button>
              </div>
              <span className="pg-token-desc">{token.desc}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
