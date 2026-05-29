'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Card } from '@vhyxui/react';

// ─── Icons ────────────────────────────────────────────────────────────────────

function ClipboardIcon(): React.ReactElement {
  return (
    <svg
      width="16"
      height="16"
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
      width="16"
      height="16"
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

function EyeIcon(): React.ReactElement {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ShieldCheckIcon(): React.ReactElement {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function ZapIcon(): React.ReactElement {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function CpuIcon(): React.ReactElement {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  );
}

// ─── CopyButton ───────────────────────────────────────────────────────────────

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

// ─── CodeBlock ────────────────────────────────────────────────────────────────

interface CodeBlockProps {
  code: string;
}

function CodeBlock({ code }: CodeBlockProps): React.ReactElement {
  return (
    <div className="lp-step-code">
      <pre><code>{code}</code></pre>
      <CopyButton text={code} />
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

interface LayerItem {
  icon: React.ReactElement;
  color: 'accent' | 'success' | 'info' | 'warning';
  title: string;
  body: string;
}

const LAYERS: LayerItem[] = [
  {
    icon: <EyeIcon />,
    color: 'accent',
    title: 'Zero Lock-In Styling',
    body: 'Beautiful defaults driven entirely by CSS custom properties. Override any token and the entire library updates instantly. Zero runtime cost. Zero bundler lock-in.',
  },
  {
    icon: <ShieldCheckIcon />,
    color: 'success',
    title: 'Accessibility By Default',
    body: 'WCAG 2.1 AA as the floor, not the ceiling. Keyboard navigation, focus management, and ARIA semantics are built into every component. Cannot be accidentally skipped.',
  },
  {
    icon: <ZapIcon />,
    color: 'info',
    title: 'Motion As First Class',
    body: 'Every enter, exit, and state change is defined with token-driven durations and easings. prefers-reduced-motion is handled automatically — always, with zero extra code.',
  },
  {
    icon: <CpuIcon />,
    color: 'warning',
    title: 'AI Agent Ready',
    body: 'Every component ships with a VhyxSeal contract describing intent, safety level, and consequences. AI agents can read and reason about your UI right out of the box.',
  },
];

interface InstallStep {
  title: string;
  code: string;
}

const INSTALL_STEPS: InstallStep[] = [
  {
    title: 'Install the packages',
    code: 'npm install @vhyxui/react @vhyxui/tokens',
  },
  {
    title: 'Import the tokens',
    code: "@import '@vhyxui/tokens/index.css';",
  },
  {
    title: 'Wrap your app with VhyxUIProvider',
    code: `import { VhyxUIProvider } from '@vhyxui/react'

export default function Layout({ children }) {
  return (
    <VhyxUIProvider>
      {children}
    </VhyxUIProvider>
  )
}`,
  },
  {
    title: 'Use any component',
    code: `import { Button } from '@vhyxui/react'

function MyButton() {
  return (
    <Button variant="primary" size="md">
      Click me
    </Button>
  )
}`,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage(): React.ReactElement {
  return (
    <>
      {/* ── Section 1: Hero ───────────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-content">
          <h1 className="lp-headline">
            The UI library built for<br />humans and AI agents.
          </h1>
          <p className="lp-sub">
            22 production-ready React components with accessibility, motion, and AI agent
            contracts built in. Override one token — everything updates. Zero runtime overhead.
          </p>
          <div className="lp-hero-actions">
            <Button variant="primary" size="lg" asChild>
              <Link href="/getting-started">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/components/button">View Components</Link>
            </Button>
          </div>
          <a
            href="https://play.vhyxui.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="lp-playground-link"
          >
            Open Playground →
          </a>
          <div className="lp-install-cmd">
            <pre><code>npm install @vhyxui/react @vhyxui/tokens</code></pre>
            <CopyButton text="npm install @vhyxui/react @vhyxui/tokens" />
          </div>
        </div>
      </section>

      {/* ── Section 2: Four Layers ────────────────────────────────────────── */}
      <section className="lp-layers">
        <div className="lp-layers-inner">
          <p className="lp-section-label">Why VhyxUI</p>
          <h2 className="lp-section-title">Four layers. One library.</h2>
          <p className="lp-section-sub">
            Every existing UI library makes a bet developers cannot escape.
            VhyxUI makes one bet: CSS wins.
          </p>
          <div className="lp-layers-grid">
            {LAYERS.map((layer) => (
              <Card key={layer.title} variant="outline" padding="lg">
                <Card.Body>
                  <div className="lp-card-icon" data-color={layer.color}>
                    {layer.icon}
                  </div>
                  <h3 className="lp-card-title">{layer.title}</h3>
                  <p className="lp-card-body">{layer.body}</p>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Quick Install ──────────────────────────────────────── */}
      <section className="lp-install">
        <div className="lp-install-inner">
          <p className="lp-section-label">Quick Start</p>
          <h2 className="lp-section-title">Get started in minutes</h2>
          <div className="lp-steps">
            {INSTALL_STEPS.map((step, index) => (
              <div key={step.title} className="lp-step">
                <div className="lp-step-num" aria-hidden="true">
                  {index + 1}
                </div>
                <div className="lp-step-body">
                  <p className="lp-step-title">{step.title}</p>
                  <CodeBlock code={step.code} />
                </div>
              </div>
            ))}
          </div>
          <p className="lp-install-note">
            No configuration. No theme object. No token mapping.
          </p>
        </div>
      </section>

      <footer className="lp-footer">
        <p>
          VhyxUI by{' '}
          <a href="https://vhyxara.com">Vhyxara</a>
          {' '}·{' '}MIT License{' '}·{' '}Build with freedom. Ship with confidence.
        </p>
      </footer>
    </>
  );
}
