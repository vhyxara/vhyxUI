'use client';

import React, { useState } from 'react';
import { Alert } from '@vhyxui/react';

// ─── Icons ─────────────────────────────────────────────────────────────────

function ClipboardIcon(): React.ReactElement {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="2" width="6" height="4" rx="1" />
      <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" />
    </svg>
  );
}

function CheckIcon(): React.ReactElement {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── CopyButton ────────────────────────────────────────────────────────────

interface CopyButtonProps {
  text: string;
}

function CopyButton({ text }: CopyButtonProps): React.ReactElement {
  const [copied, setCopied] = useState<boolean>(false);

  async function copy(): Promise<void> {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      className="lp-copy-btn"
      onClick={copy}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? <CheckIcon /> : <ClipboardIcon />}
    </button>
  );
}

// ─── CodeBlock ─────────────────────────────────────────────────────────────

interface CodeBlockProps {
  code: string;
  filename?: string;
}

function CodeBlock({ code, filename }: CodeBlockProps): React.ReactElement {
  return (
    <div className="gs-code-block">
      {filename !== undefined && (
        <div className="gs-code-filename">{filename}</div>
      )}
      <div className="gs-code-inner">
        <pre><code>{code}</code></pre>
        <CopyButton text={code} />
      </div>
    </div>
  );
}

// ─── On This Page ──────────────────────────────────────────────────────────

const ON_THIS_PAGE = [
  { id: 'what-is-the-agent-layer', label: 'What Is The Agent Layer' },
  { id: 'default-contracts',       label: 'Default Contracts'       },
  { id: 'override-a-contract',     label: 'Override A Contract'     },
  { id: 'the-manifest',            label: 'The Manifest'            },
] as const;

// ─── Contract field table data ─────────────────────────────────────────────

interface ContractField {
  field: string;
  type: string;
  description: string;
}

const CONTRACT_FIELDS: ContractField[] = [
  { field: 'type',                 type: 'string',  description: 'Category of component action' },
  { field: 'intent',               type: 'string',  description: 'Machine-readable action identifier' },
  { field: 'safetyLevel',          type: 'string',  description: 'How carefully an agent should proceed' },
  { field: 'requiresConfirmation', type: 'boolean', description: 'Must agent ask human before acting' },
  { field: 'destructive',          type: 'boolean', description: 'Permanently deletes or modifies data' },
  { field: 'reversible',           type: 'boolean', description: 'Whether the action can be undone' },
  { field: 'consequence',          type: 'string',  description: 'Plain language description of what happens' },
  { field: 'requires',             type: 'array',   description: 'Conditions that must be true before acting' },
];

// ─── Code Strings ──────────────────────────────────────────────────────────

const CODE_DEFAULT_CONTRACT = `{
  "type": "action",
  "intent": "trigger-action",
  "safetyLevel": "low",
  "requiresConfirmation": false,
  "destructive": false,
  "reversible": true,
  "consequence": "triggers the associated action",
  "requires": []
}`;

const CODE_OVERRIDE_BASIC = `<Button
  variant="primary"
  contract={{
    intent: 'save-draft',
    consequence: 'saves the current draft to the database',
  }}
>
  Save Draft
</Button>`;

const CODE_OVERRIDE_DESTRUCTIVE = `<Button
  variant="destructive"
  contract={{
    intent: 'delete-account',
    safetyLevel: 'critical',
    requiresConfirmation: true,
    destructive: true,
    reversible: false,
    consequence: 'permanently deletes the user account and all associated data',
    requires: [
      'user is authenticated',
      'confirmation dialog has been acknowledged',
    ],
  }}
>
  Delete Account
</Button>`;

const CODE_OVERRIDE_ORDER = `<Button
  type="submit"
  variant="primary"
  contract={{
    intent: 'submit-order',
    safetyLevel: 'high',
    requiresConfirmation: true,
    consequence: 'places the order and charges the payment method on file',
    requires: [
      'cart is not empty',
      'payment method is valid',
      'shipping address is set',
    ],
  }}
>
  Place Order
</Button>`;

const CODE_MANIFEST = `{
  "version": "1.0.0",
  "components": [
    {
      "id": "vhyx-button-1",
      "type": "action",
      "intent": "submit-order",
      "safetyLevel": "high",
      "requiresConfirmation": true,
      "consequence": "places order and charges payment method"
    }
  ]
}`;

// ─── Page ──────────────────────────────────────────────────────────────────

export default function AgentContractsPage(): React.ReactElement {
  return (
    <div className="gs-layout">

      <main className="gs-content">

        {/* ── Section 1: What Is The Agent Layer ──────────────────────── */}
        <section id="what-is-the-agent-layer">
          <h1 className="gs-page-title">Agent Contracts</h1>
          <p className="gs-page-sub">
            Every component ships with a machine-readable contract.
            AI agents read intent, safety level, and consequences
            directly from the DOM.
          </p>
          <h2 className="gs-section-title gs-section-title--borderless">
            What Is The Agent Layer
          </h2>
          <p className="gs-body">
            Every VhyxUI component ships with a machine-readable contract.
            This contract describes what the component does, its safety
            level, and what consequences follow from interaction. AI agents
            and testing tools read these contracts directly from the DOM —
            no additional API, no configuration, no schema to write.
          </p>
          <p className="gs-body">
            Contracts live in the <code>data-vhyx-contract</code> attribute
            on every component's root element. Any VhyxSeal-compatible tool
            can read a page, collect these attributes, and build a complete
            picture of available actions and their risk profile. This layer
            is built into every component by default — it cannot be removed,
            only overridden.
          </p>
        </section>

        {/* ── Section 2: Default Contracts ────────────────────────────── */}
        <section id="default-contracts" className="gs-section">
          <h2 className="gs-section-title">Default Contracts</h2>
          <p className="gs-body">
            Here is the default contract for the Button component.
          </p>
          <CodeBlock code={CODE_DEFAULT_CONTRACT} filename="Button default contract" />
          <div className="ag-table-wrap">
            <table className="ag-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Type</th>
                  <th>What it means</th>
                </tr>
              </thead>
              <tbody>
                {CONTRACT_FIELDS.map((row) => (
                  <tr key={row.field}>
                    <td><code>{row.field}</code></td>
                    <td className="ag-table-type">{row.type}</td>
                    <td>{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="gs-body">
            Every VhyxUI component ships with a default contract. You get
            this automatically — no configuration needed.
          </p>
        </section>

        {/* ── Section 3: Override A Contract ──────────────────────────── */}
        <section id="override-a-contract" className="gs-section">
          <h2 className="gs-section-title">Override A Contract</h2>
          <p className="gs-body">
            Pass a <code>contract</code> prop to any component to merge
            overrides on top of the default. Only the fields you specify
            change — the rest remain from the default contract.
          </p>

          <h3 className="gs-subsection-title">Basic — add intent and consequence</h3>
          <CodeBlock code={CODE_OVERRIDE_BASIC} />

          <h3 className="gs-subsection-title">Destructive — delete account</h3>
          <CodeBlock code={CODE_OVERRIDE_DESTRUCTIVE} />

          <Alert variant="warning" title="High-stakes actions">
            Actions like order placement or payment should always set{' '}
            <code>requiresConfirmation: true</code> and describe the
            consequence precisely. Agents will not proceed without
            this information.
          </Alert>

          <h3 className="gs-subsection-title">Form submission with requires array</h3>
          <CodeBlock code={CODE_OVERRIDE_ORDER} />
        </section>

        {/* ── Section 4: The Manifest ──────────────────────────────────── */}
        <section id="the-manifest" className="gs-section">
          <h2 className="gs-section-title">The Manifest</h2>
          <p className="gs-body">
            VhyxSeal-compatible tools can generate a manifest from any
            VhyxUI page — a single JSON document that describes every
            contract-bearing component on that page. The manifest is
            what an AI agent reads before deciding how to interact
            with your application.
          </p>
          <p className="gs-body">
            Below is a simplified manifest for a page with a single
            Button that places an order. The agent reads this, sees{' '}
            <code>safetyLevel: "high"</code> and{' '}
            <code>requiresConfirmation: true</code>, and knows to pause
            and ask the human before proceeding.
          </p>
          <CodeBlock code={CODE_MANIFEST} filename="page-manifest.json" />
          <p className="gs-body">
            For deeper reading on VhyxSeal contracts and the manifest
            format, see the{' '}
            {/* TODO: link to VhyxSeal docs when published */}
            <a href="#" className="gs-link">VhyxSeal Documentation →</a>
          </p>
        </section>

      </main>

      {/* ── On This Page ─────────────────────────────────────────────── */}
      <aside className="gs-toc">
        <p className="gs-toc-title">On This Page</p>
        <nav aria-label="Page sections">
          <ul className="gs-toc-list" role="list">
            {ON_THIS_PAGE.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="gs-toc-link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

    </div>
  );
}
