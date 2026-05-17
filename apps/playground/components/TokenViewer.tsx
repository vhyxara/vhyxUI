'use client';

import React from 'react';
import type { ComponentDef } from './component-defs';

interface TokenViewerProps {
  def: ComponentDef;
}

export function TokenViewer({ def }: TokenViewerProps): React.ReactElement {
  if (def.tokens.length === 0) {
    return (
      <div>
        <p className="pg-section-label">CSS Tokens</p>
        <p className="pg-panel-description">No specific tokens documented for this component.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="pg-section-label">CSS Tokens</p>
      <p className="pg-panel-description">
        Override these tokens to theme {def.name} without touching component code.
      </p>

      <div style={{ border: 'var(--vhyx-border-width) solid var(--vhyx-color-border)', borderRadius: 'var(--vhyx-radius-md)', overflow: 'hidden' }}>
        {def.tokens.map((token) => (
          <div key={token.name} className="pg-token-item" style={{ padding: 'var(--vhyx-space-2) var(--vhyx-space-3)', borderBottom: 'var(--vhyx-border-width) solid var(--vhyx-color-border)' }}>
            <span className="pg-token-name">{token.name}</span>
            <span className="pg-token-desc">{token.desc}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 'var(--vhyx-space-4)' }}>
        <p className="pg-section-label">Example override</p>
        <div className="pg-code-block">
          <pre className="pg-code-pre"><code>{`:root {
  /* Override in your CSS */
  --vhyx-color-accent: #7c3aed;
  --vhyx-radius-md: 9999px;
}`}</code></pre>
        </div>
      </div>
    </div>
  );
}
