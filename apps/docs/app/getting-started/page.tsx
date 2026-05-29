import React from 'react';
import { Badge, Alert, Button, Input } from '../../components/ui';
import { CodeBlock } from '../../components/CodeBlock';
import { OnThisPage, type PageHeading } from '../../components/OnThisPage';
import { PageNav } from '../../components/PageNav';

// ─── On This Page ──────────────────────────────────────────────────────────

const HEADINGS: ReadonlyArray<PageHeading> = [
  { id: 'requirements',    text: 'Requirements',    level: 2 },
  { id: 'installation',    text: 'Installation',    level: 2 },
  { id: 'provider-setup',  text: 'Provider Setup',  level: 2 },
  { id: 'first-component', text: 'First Component', level: 2 },
  { id: 'complete-example',text: 'Complete Example',level: 2 },
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

export default async function GettingStartedPage(): Promise<React.ReactElement> {
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
          <h2 className="gs-section-title gs-section-title--borderless">
            Requirements
          </h2>
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
          <CodeBlock code={CODE_INSTALL} language="bash" />
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
              <CodeBlock code={CODE_APP_ROUTER} language="tsx" filename="app/layout.tsx" />
            </div>
            <div className="gs-split-item">
              <p className="gs-split-label">Pages Router</p>
              <CodeBlock code={CODE_PAGES_ROUTER} language="tsx" filename="pages/_app.tsx" />
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
          <CodeBlock code={CODE_BUTTON_IMPORT} language="tsx" />
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
          <CodeBlock code={CODE_LOGIN_FORM} language="tsx" />
        </section>

        <PageNav
          next={{ title: 'Theming', href: '/theming' }}
        />

      </main>

      <OnThisPage headings={HEADINGS} />

    </div>
  );
}
