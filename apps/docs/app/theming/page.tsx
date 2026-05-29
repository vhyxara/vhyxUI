'use client';

import React, { useState } from 'react';
import { Alert, Badge, Button, Input } from '@vhyxui/react';

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
  { id: 'how-tokens-work', label: 'How Tokens Work'   },
  { id: 'override-tokens', label: 'Override Tokens'   },
  { id: 'dark-mode',       label: 'Dark Mode'         },
  { id: 'complete-theme',  label: 'Complete Theme'    },
] as const;

// ─── Code Strings ──────────────────────────────────────────────────────────

const CODE_DIAGRAM = `/* Primitive — raw color values */
--vhyx-primitive-indigo-500: #6366f1;

/* Semantic — what components use */
--vhyx-color-accent: var(--vhyx-primitive-indigo-500);

/* Component uses semantic token — override here to theme */
background: var(--vhyx-color-accent);`;

const CODE_BRAND_COLOR = `:root {
  --vhyx-color-accent:        #e11d48;
  --vhyx-color-accent-hover:  #be123c;
  --vhyx-color-accent-active: #9f1239;
  --vhyx-color-accent-subtle: #fff1f2;
  --vhyx-color-accent-muted:  #ffe4e6;
}`;

const CODE_SHARP_CORNERS = `:root {
  --vhyx-radius-xs:   0;
  --vhyx-radius-sm:   0;
  --vhyx-radius-md:   0;
  --vhyx-radius-lg:   0;
  --vhyx-radius-xl:   0;
  --vhyx-radius-2xl:  0;
  --vhyx-radius-3xl:  0;
  --vhyx-radius-full: 9999px; /* keep pill shapes */
}`;

const CODE_CUSTOM_FONT = `:root {
  --vhyx-font-sans: 'Inter', system-ui, sans-serif;
  --vhyx-font-mono: 'Fira Code', ui-monospace, monospace;
}`;

const CODE_DARK_HTML = `<!-- Set on the html element -->
<html data-theme="dark">

<!-- Or toggle via JavaScript -->
document.documentElement.setAttribute('data-theme', 'dark');
document.documentElement.setAttribute('data-theme', 'light');`;

const CODE_NEXT_THEMES_INSTALL = `npm install next-themes`;

const CODE_THEME_PROVIDER = `import { ThemeProvider } from 'next-themes';
import { VhyxUIProvider } from '@vhyxui/react';

export function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
    >
      <VhyxUIProvider>
        {children}
      </VhyxUIProvider>
    </ThemeProvider>
  );
}`;

const CODE_COMPLETE_THEME = `:root {
  /* Accent — rose */
  --vhyx-color-accent:         #e11d48;
  --vhyx-color-accent-hover:   #be123c;
  --vhyx-color-accent-active:  #9f1239;
  --vhyx-color-accent-subtle:  #fff1f2;
  --vhyx-color-accent-muted:   #ffe4e6;

  /* Border radii — softer */
  --vhyx-radius-sm:  6px;
  --vhyx-radius-md:  10px;
  --vhyx-radius-lg:  14px;
  --vhyx-radius-xl:  18px;

  /* Typography */
  --vhyx-font-sans: 'Inter', system-ui, sans-serif;

  /* Surfaces — warm white */
  --vhyx-color-surface:        #fffbf9;
  --vhyx-color-surface-raised: #ffffff;
  --vhyx-color-bg:             #fdf8f6;
  --vhyx-color-bg-subtle:      #faf0ec;
  --vhyx-color-border:         #f2d8d0;
}`;

// ─── Page ──────────────────────────────────────────────────────────────────

export default function ThemingPage(): React.ReactElement {
  return (
    <div className="gs-layout">

      <main className="gs-content">

        {/* ── Section 1: How Tokens Work ──────────────────────────────── */}
        <section id="how-tokens-work">
          <h1 className="gs-page-title">Theming</h1>
          <p className="gs-page-sub">
            Override one CSS variable. The entire library responds.
          </p>
          <h2 className="gs-section-title gs-section-title--borderless">
            How Tokens Work
          </h2>
          <p className="gs-body">
            VhyxUI uses a two-layer token system. The primitive layer holds
            raw values — exact hex colors, pixel counts. The semantic layer
            defines what those values <em>mean</em>: background, accent,
            border, text. Components always reference semantic tokens, never
            primitives directly.
          </p>
          <p className="gs-body">
            This separation is what makes theming instantaneous. When you
            override <code>--vhyx-color-accent</code>, every component that
            uses accent — buttons, focus rings, badges, active states —
            updates with no rebuild, no config change, no JavaScript.
          </p>
          <CodeBlock code={CODE_DIAGRAM} />
          <Alert variant="info" title="The rule">
            Override semantic tokens to theme. Never touch primitives.
          </Alert>
        </section>

        {/* ── Section 2: Override Tokens ──────────────────────────────── */}
        <section id="override-tokens" className="gs-section">
          <h2 className="gs-section-title">Override Tokens</h2>

          <h3 className="gs-subsection-title">Example 1 — Brand color</h3>
          <p className="gs-body">
            Replace the default indigo accent with a rose palette. Five
            tokens cover the full accent family — default, hover, active,
            and the two subtle fills used in badges and backgrounds.
          </p>
          <CodeBlock code={CODE_BRAND_COLOR} />

          <h3 className="gs-subsection-title">Example 2 — Sharp corners</h3>
          <p className="gs-body">
            Collapse every radius token to zero for a strict, editorial
            aesthetic. Keep <code>--vhyx-radius-full</code> intact so
            pill shapes like badge dots remain circular.
          </p>
          <CodeBlock code={CODE_SHARP_CORNERS} />

          <h3 className="gs-subsection-title">Example 3 — Custom font</h3>
          <p className="gs-body">
            Point the sans and mono font stacks at your typefaces. Ensure
            the fonts are loaded before applying — add them via{' '}
            <code>next/font</code> or a stylesheet import.
          </p>
          <CodeBlock code={CODE_CUSTOM_FONT} />

          <div className="th-demo">
            <p className="th-demo-label">Live demo — rose theme applied</p>
            <div
              className="th-demo-content"
              style={{
                '--vhyx-color-accent':        '#e11d48',
                '--vhyx-color-accent-hover':  '#be123c',
                '--vhyx-color-accent-active': '#9f1239',
                '--vhyx-color-accent-subtle': '#fff1f2',
              } as React.CSSProperties}
            >
              <Button variant="primary">Themed Button</Button>
              <Badge variant="success">Live</Badge>
              <Input
                type="text"
                placeholder="Focus ring is rose"
                size="md"
                aria-label="Demo input"
              />
            </div>
          </div>
        </section>

        {/* ── Section 3: Dark Mode ─────────────────────────────────────── */}
        <section id="dark-mode" className="gs-section">
          <h2 className="gs-section-title">Dark Mode</h2>
          <p className="gs-body">
            VhyxUI ships a complete dark theme. It activates when the{' '}
            <code>data-theme="dark"</code> attribute is set on any ancestor
            element — typically the <code>html</code> element.
          </p>

          <h3 className="gs-subsection-title">HTML attribute approach</h3>
          <CodeBlock code={CODE_DARK_HTML} />

          <h3 className="gs-subsection-title">With next-themes (recommended)</h3>
          <CodeBlock code={CODE_NEXT_THEMES_INSTALL} filename="terminal" />
          <CodeBlock code={CODE_THEME_PROVIDER} filename="app/providers.tsx" />

          <Alert variant="default" title="Already working">
            VhyxUI docs and playground use next-themes with the{' '}
            <code>data-theme</code> attribute. You can see it working right
            now with the toggle in the header.
          </Alert>
        </section>

        {/* ── Section 4: Complete Brand Theme ─────────────────────────── */}
        <section id="complete-theme" className="gs-section">
          <h2 className="gs-section-title">A complete custom theme</h2>
          <p className="gs-body">
            These 15 token overrides completely transform VhyxUI. Override
            them in your <code>globals.css</code> inside <code>:root</code>.
          </p>
          <CodeBlock code={CODE_COMPLETE_THEME} />
          <Alert variant="success" title="That's it">
            No build step. No configuration file. Just CSS.
          </Alert>
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
