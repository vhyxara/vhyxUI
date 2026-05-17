'use client';

import React from 'react';
import type { ComponentDef } from './component-defs';

interface ContractViewerProps {
  def: ComponentDef;
  props: Record<string, unknown>;
}

/** Compute the effective contract, accounting for runtime upgrades (e.g. Button destructive). */
function resolveContract(def: ComponentDef, props: Record<string, unknown>): Record<string, string> {
  const base = { ...def.contract };

  // Button: destructive variant auto-upgrades
  if (def.id === 'button' && props['variant'] === 'destructive') {
    base['safetyLevel'] = 'high';
    base['destructive'] = 'true';
    base['requiresConfirmation'] = 'true';
  }

  return base;
}

const SAFETY_COLORS: Record<string, string> = {
  low: 'var(--vhyx-color-success-text)',
  medium: 'var(--vhyx-color-warning-text)',
  high: 'var(--vhyx-color-danger-text)',
};

const SAFETY_BG: Record<string, string> = {
  low: 'var(--vhyx-color-success-subtle)',
  medium: 'var(--vhyx-color-warning-subtle)',
  high: 'var(--vhyx-color-danger-subtle)',
};

export function ContractViewer({ def, props }: ContractViewerProps): React.ReactElement {
  const contract = resolveContract(def, props);
  const entries = Object.entries(contract);

  if (entries.length === 0) {
    return (
      <div>
        <p className="pg-section-label">VhyxSeal Contract</p>
        <p className="pg-panel-description">
          This component has no agent contract — it is purely informational with no actionable behavior.
        </p>
      </div>
    );
  }

  const safetyLevel = contract['safetyLevel'] ?? 'low';
  const isDestructiveUpgrade = def.id === 'button' && props['variant'] === 'destructive';

  return (
    <div>
      <p className="pg-section-label">VhyxSeal Contract</p>

      {isDestructiveUpgrade && (
        <div style={{
          padding: 'var(--vhyx-space-2) var(--vhyx-space-3)',
          background: 'var(--vhyx-color-danger-subtle)',
          borderRadius: 'var(--vhyx-radius-sm)',
          fontSize: 'var(--vhyx-text-xs)',
          color: 'var(--vhyx-color-danger-text)',
          marginBottom: 'var(--vhyx-space-3)',
          border: 'var(--vhyx-border-width) solid var(--vhyx-color-danger)',
        }}>
          ⚠ Destructive variant — contract auto-upgraded to safetyLevel: high
        </div>
      )}

      <div style={{ border: 'var(--vhyx-border-width) solid var(--vhyx-color-border)', borderRadius: 'var(--vhyx-radius-md)', overflow: 'hidden' }}>
        {entries.map(([key, value]) => (
          <div key={key} className="pg-contract-row">
            <span className="pg-contract-key">{key}</span>
            <span className="pg-contract-value">
              {key === 'safetyLevel' ? (
                <span
                  className="pg-contract-badge"
                  style={{
                    color: SAFETY_COLORS[value] ?? 'var(--vhyx-color-text)',
                    backgroundColor: SAFETY_BG[value] ?? 'var(--vhyx-color-bg-subtle)',
                  }}
                >
                  {value}
                </span>
              ) : value === 'true' ? (
                <span style={{ color: 'var(--vhyx-color-success-text)' }}>{value}</span>
              ) : value === 'false' ? (
                <span style={{ color: 'var(--vhyx-color-text-muted)' }}>{value}</span>
              ) : (
                <span>&quot;{value}&quot;</span>
              )}
            </span>
          </div>
        ))}
      </div>

      <p className="pg-panel-description" style={{ marginTop: 'var(--vhyx-space-3)' }}>
        This contract is embedded in every rendered {def.name} via{' '}
        <code style={{ fontFamily: 'var(--vhyx-font-mono)', fontSize: 'var(--vhyx-text-2xs)' }}>data-vhyx-contract</code>.
        AI agents can read it to understand component intent and safety.
      </p>
    </div>
  );
}
