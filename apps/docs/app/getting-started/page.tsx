'use client';

import React, { useState } from 'react';
import { Badge, Alert, Button } from '@vhyxui/react';

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
  { id: 'requirements',   label: 'Requirements'    },
  { id: 'installation',   label: 'Installation'    },
  { id: 'provider-setup', label: 'Provider Setup'  },
  { id: 'first-component',label: 'First Component' },
  { id: 'complete-example',label: 'Complete Example'},
] as const;

// ─── Code Strings ──────────────────────────────────────────────────────────

const CODE_INSTALL = 'npm install @vhyxui/react @vhyxui/tokens';

const CODE_APP_ROUTER = `import '@vhyxui/tokens/index.css';
import { VhyxUIProvider } from '@vhyxui/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <VhyxUIProvider>
          {children}
        </VhyxUIProvider>
      </body>
    </html>
  );
}`;

const CODE_PAGES_ROUTER = `import '@vhyxui/tokens/index.css';
import type { AppProps } from 'next/app';
import { VhyxUIProvider } from '@vhyxui/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <VhyxUIProvider>
      <Component {...pageProps} />
    </VhyxUIProvider>
  );
}`;

const CODE_BUTTON_IMPORT = `import { Button } from '@vhyxui/react';

function MyComponent() {
  return (
    <div>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  );
}`;

const CODE_LOGIN_FORM = `import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Form, Field } from '@vhyxui/react';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof schema>;

export function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: LoginFormData) {
    // Replace with your auth logic — e.g. signIn from next-auth
    await signIn(data);
  }

  return (
    <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
      <Field name="email" label="Email address" required>
        <Input
          {...form.register('email')}
          type="email"
          placeholder="you@example.com"
          error={!!form.formState.errors.email}
        />
      </Field>
      <Field name="password" label="Password" required>
        <Input
          {...form.register('password')}
          type="password"
          placeholder="••••••••"
          error={!!form.formState.errors.password}
        />
      </Field>
      <Button
        type="submit"
        variant="primary"
        size="md"
        loading={form.formState.isSubmitting}
      >
        Sign in
      </Button>
    </Form>
  );
}`;

// ─── Page ──────────────────────────────────────────────────────────────────

export default function GettingStartedPage(): React.ReactElement {
  return (
    <div className="gs-layout">

      <main className="gs-content">

        {/* ── Section 1: Requirements ──────────────────────────────────── */}
        <section id="requirements">
          <h1 className="gs-page-title">Getting Started</h1>
          <p className="gs-page-sub">
            VhyxUI works with any React 18 project. No configuration
            required. Import tokens, wrap with provider, use components.
          </p>
          <h2 className="gs-section-title">Requirements</h2>
          <div className="gs-requirements">
            <div className="gs-requirement-row">
              <span className="gs-requirement-name">Node.js</span>
              <Badge variant="default" size="sm">≥ 18</Badge>
            </div>
            <div className="gs-requirement-row">
              <span className="gs-requirement-name">React</span>
              <Badge variant="default" size="sm">≥ 18</Badge>
            </div>
            <div className="gs-requirement-row">
              <span className="gs-requirement-name">react-dom</span>
              <Badge variant="default" size="sm">≥ 18</Badge>
            </div>
          </div>
        </section>

        {/* ── Section 2: Installation ───────────────────────────────────── */}
        <section id="installation" className="gs-section">
          <h2 className="gs-section-title">Installation</h2>
          <p className="gs-body">
            Install both packages. Tokens are required — they define every
            visual decision the components make.
          </p>
          <CodeBlock code={CODE_INSTALL} />
          <div className="gs-packages">
            <div className="gs-package">
              <code className="gs-package-name">@vhyxui/react</code>
              <p className="gs-package-desc">
                All 22 components, VhyxUIProvider, and the toast() API.
              </p>
            </div>
            <div className="gs-package">
              <code className="gs-package-name">@vhyxui/tokens</code>
              <p className="gs-package-desc">
                Pure CSS. Zero JavaScript. Every visual decision as a
                CSS custom property. Import once — override anything.
              </p>
            </div>
          </div>
          <Alert variant="info" title="Peer dependencies">
            This example uses react-hook-form and zod. Install them
            separately:{' '}
            <code>npm install react-hook-form @hookform/resolvers zod</code>
          </Alert>
        </section>

        {/* ── Section 3: Provider Setup ────────────────────────────────── */}
        <section id="provider-setup" className="gs-section">
          <h2 className="gs-section-title">Provider Setup</h2>
          <p className="gs-body">
            Wrap your app with <code>VhyxUIProvider</code> and import
            the token CSS. Do this once at the root of your application.
          </p>
          <div className="gs-split">
            <div className="gs-split-item">
              <p className="gs-split-label">App Router</p>
              <CodeBlock code={CODE_APP_ROUTER} filename="app/layout.tsx" />
            </div>
            <div className="gs-split-item">
              <p className="gs-split-label">Pages Router</p>
              <CodeBlock code={CODE_PAGES_ROUTER} filename="pages/_app.tsx" />
            </div>
          </div>
        </section>

        {/* ── Section 4: First Component ───────────────────────────────── */}
        <section id="first-component" className="gs-section">
          <h2 className="gs-section-title">First Component</h2>
          <p className="gs-body">
            Import any component from <code>@vhyxui/react</code>.
            Every component is tree-shakeable — only what you import ships.
          </p>
          <CodeBlock code={CODE_BUTTON_IMPORT} />
          <div className="gs-button-preview">
            <Button variant="primary" size="md">Primary</Button>
            <Button variant="secondary" size="md">Secondary</Button>
            <Button variant="outline" size="md">Outline</Button>
            <Button variant="ghost" size="md">Ghost</Button>
            <Button variant="destructive" size="md">Destructive</Button>
          </div>
        </section>

        {/* ── Section 5: Complete Example ──────────────────────────────── */}
        <section id="complete-example" className="gs-section">
          <h2 className="gs-section-title">Complete Example</h2>
          <p className="gs-body">
            A login form using react-hook-form and zod for validation.
            Field handles label association, error display, and
            accessibility automatically.
          </p>
          <CodeBlock code={CODE_LOGIN_FORM} />
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
