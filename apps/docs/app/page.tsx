import React from "react";
import Link from "next/link";
import { Button, Card, CardBody } from "../components/ui";
import { CodeBlock } from "../components/CodeBlock";

// ─── Icons ────────────────────────────────────────────────────────────────────

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

// ─── Data ─────────────────────────────────────────────────────────────────────

interface LayerItem {
  icon: React.ReactElement;
  color: "accent" | "success" | "info" | "warning";
  title: string;
  body: string;
}

const LAYERS: LayerItem[] = [
  {
    icon: <EyeIcon />,
    color: "accent",
    title: "Zero Lock-In Styling",
    body: "Beautiful defaults driven entirely by CSS custom properties. Override any token and the entire library updates instantly. Zero runtime cost. Zero bundler lock-in.",
  },
  {
    icon: <ShieldCheckIcon />,
    color: "success",
    title: "Accessibility By Default",
    body: "WCAG 2.1 AA as the floor, not the ceiling. Keyboard navigation, focus management, and ARIA semantics are built into every component. Cannot be accidentally skipped.",
  },
  {
    icon: <ZapIcon />,
    color: "info",
    title: "Motion As First Class",
    body: "Every enter, exit, and state change is defined with token-driven durations and easings. prefers-reduced-motion is handled automatically — always, with zero extra code.",
  },
  {
    icon: <CpuIcon />,
    color: "warning",
    title: "AI Agent Ready",
    body: "Every component ships with a VhyxSeal contract describing intent, safety level, and consequences. AI agents can read and reason about your UI right out of the box.",
  },
];

// ─── Step sub-component (async server component per step) ─────────────────────

interface StepProps {
  num: number;
  title: string;
  code: string;
  language: string;
}

async function InstallStep({
  num,
  title,
  code,
  language,
}: StepProps): Promise<React.ReactElement> {
  return (
    <div className="lp-step">
      <div className="lp-step-num" aria-hidden="true">
        {num}
      </div>
      <div className="lp-step-body">
        <p className="lp-step-title">{title}</p>
        <CodeBlock code={code} language={language} />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage(): Promise<React.ReactElement> {
  return (
    <>
      {/* ── Section 1: Hero ───────────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-content">
          <h1 className="lp-headline">
            The UI library built for
            <br />
            humans and AI agents.
          </h1>
          <p className="lp-sub">
            22 production-ready React components with accessibility, motion, and
            AI agent contracts built in. Override one token — everything
            updates. Zero runtime overhead.
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
            href="https://play.vhyxui.com"
            target="_blank"
            rel="noopener noreferrer"
            className="lp-playground-link"
          >
            Open Playground →
          </a>
          <div className="lp-hero-install">
            <CodeBlock
              code="npm install @vhyxui/react @vhyxui/tokens"
              language="bash"
            />
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
                <CardBody>
                  <div className="lp-card-icon" data-color={layer.color}>
                    {layer.icon}
                  </div>
                  <h3 className="lp-card-title">{layer.title}</h3>
                  <p className="lp-card-body">{layer.body}</p>
                </CardBody>
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
            <InstallStep
              num={1}
              title="Install the packages"
              language="bash"
              code="npm install @vhyxui/react @vhyxui/tokens"
            />
            <InstallStep
              num={2}
              title="Import the tokens"
              language="css"
              code="@import '@vhyxui/tokens/index.css';"
            />
            <InstallStep
              num={3}
              title="Wrap your app with VhyxUIProvider"
              language="tsx"
              code={`import { VhyxUIProvider } from '@vhyxui/react'

export default function Layout({ children }) {
  return (
    <VhyxUIProvider>
      {children}
    </VhyxUIProvider>
  )
}`}
            />
            <InstallStep
              num={4}
              title="Use any component"
              language="tsx"
              code={`import { Button } from '@vhyxui/react'

function MyButton() {
  return (
    <Button variant="primary" size="md">
      Click me
    </Button>
  )
}`}
            />
          </div>
          <p className="lp-install-note">
            No configuration. No theme object. No token mapping.
          </p>
        </div>
      </section>

      <footer className="lp-footer">
        <p>
          VhyxUI by <a href="https://vhyxara.com">Vhyxara</a> · MIT License ·{" "}
          Build with freedom. Ship with confidence.
        </p>
      </footer>
    </>
  );
}
