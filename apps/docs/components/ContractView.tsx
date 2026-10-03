'use client';

import React from 'react';
import { CodeBlock } from './CodeBlockSimple';

/** The fields of a VhyxSeal contract template the docs display. */
export interface ContractLike {
  type: string;
  intent: string;
  description?: string;
  consequence?: string;
  safetyLevel: string;
  requiresConfirmation: boolean;
  reversible: boolean;
  destructive: boolean;
}

function flag(on: boolean, yes: string, no: string): string {
  return on ? yes : no;
}

/** One-line summary under the page title: what an agent learns before touching the component. */
export function ContractGlance({ contract }: { contract: ContractLike }): React.ReactElement {
  return (
    <dl className="contract-glance" aria-label="Agent contract at a glance">
      <div><dt>Type</dt><dd>{contract.type}</dd></div>
      <div><dt>Intent</dt><dd>{contract.intent}</dd></div>
      <div><dt>Safety</dt><dd data-safety={contract.safetyLevel}>{contract.safetyLevel}</dd></div>
      <div><dt>Confirm</dt><dd>{flag(contract.requiresConfirmation, 'required', 'not needed')}</dd></div>
      <div><dt>Undo</dt><dd>{flag(contract.reversible, 'reversible', 'one-way')}</dd></div>
    </dl>
  );
}

/** The "Agent contract" example tab: readable summary plus the raw JSON an agent receives. */
export function ContractPanel({ contract }: { contract: ContractLike }): React.ReactElement {
  return (
    <div className="contract-panel">
      <div className="contract-panel-summary">
        <span className="contract-panel-eyebrow">What an agent reads</span>
        {contract.description && <p className="contract-panel-text">{contract.description}</p>}
        <ul className="contract-panel-facts">
          <li data-safety={contract.safetyLevel}><span>Safety</span>{contract.safetyLevel}</li>
          <li><span>Confirmation</span>{flag(contract.requiresConfirmation, 'a person confirms first', 'agent may act')}</li>
          <li><span>Destructive</span>{flag(contract.destructive, 'yes', 'no')}</li>
          <li><span>Reversible</span>{flag(contract.reversible, 'yes', 'no')}</li>
          {contract.consequence && <li><span>Consequence</span>{contract.consequence}</li>}
        </ul>
        <p className="contract-panel-note">
          Shipped by default. Override any field with the <code>contract</code> prop; VhyxSeal signs it into the page manifest.
        </p>
      </div>
      <CodeBlock language="json" code={JSON.stringify(contract, null, 2)} />
    </div>
  );
}
