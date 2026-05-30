"use client";

import React from "react";
import type { ComponentDef } from "./component-defs";

// What each contract field means
const FIELD_DESCRIPTIONS: Record<string, string> = {
  type: "The semantic type of this component (action, input, display, navigation, overlay).",
  intent:
    "What the component does when activated — used by agents to understand purpose.",
  safetyLevel:
    "low = safe, medium = review recommended, high = requires confirmation.",
  destructive: "true if this action deletes or permanently modifies data.",
  requiresConfirmation:
    "true if an additional user confirmation is needed before executing.",
  reversible: "true if the action can be undone after it is performed.",
  contractVersion: "The version of the VhyxSeal contract schema.",
};

interface ContractPanelProps {
  def: ComponentDef;
  props: Record<string, unknown>;
}

export function ContractPanel({
  def,
  props,
}: ContractPanelProps): React.ReactElement {
  // Merge base contract with destructive button upgrade
  const contract = { ...def.contract };
  if (def.id === "button" && props["variant"] === "destructive") {
    contract["safetyLevel"] = "high";
    contract["destructive"] = "true";
    contract["requiresConfirmation"] = "true";
  }

  const isHighlighted = (key: string): boolean => {
    if (def.id === "button" && props["variant"] === "destructive") {
      return (
        key === "safetyLevel" ||
        key === "destructive" ||
        key === "requiresConfirmation"
      );
    }
    return false;
  };

  if (Object.keys(contract).length === 0) {
    return (
      <div className="pg-panel-empty">
        <p>This component ships with an empty contract by default.</p>
        <p style={{ marginTop: "var(--vhyx-space-2)" }}>
          Pass a <code>contract</code> prop to add VhyxSeal metadata.
        </p>
      </div>
    );
  }

  return (
    <div className="pg-contract-panel">
      <p className="pg-panel-hint">
        Default VhyxSeal contract — merged with your <code>contract</code> prop
        at runtime.
      </p>
      {def.id === "button" && props["variant"] === "destructive" && (
        <div className="pg-contract-upgrade-notice">
          <span className="pg-contract-upgrade-dot" />
          <span>
            Destructive variant auto-upgrades contract safetyLevel, destructive,
            and requiresConfirmation.
          </span>
        </div>
      )}
      <div className="pg-contract-table">
        {Object.entries(contract).map(([key, value]) => {
          const highlighted = isHighlighted(key);
          const desc = FIELD_DESCRIPTIONS[key];
          return (
            <div
              key={key}
              className="pg-contract-row"
              data-highlighted={highlighted ? "true" : "false"}
              title={desc}
            >
              <span className="pg-contract-key">{key}</span>
              <span className="pg-contract-value">{String(value)}</span>
            </div>
          );
        })}
      </div>
      <a
        href="https://docs.vhyxui.com/agent-contracts"
        className="pg-contract-learn-more"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more about agent contracts →
      </a>
    </div>
  );
}
