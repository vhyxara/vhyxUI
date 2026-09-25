import React from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Section } from '../../components/Section';
import { CodeBlock } from '../../components/CodeBlockSimple';
import { OnThisPage, type PageHeading } from '../../components/OnThisPage';
import { PageNav } from '../../components/PageNav';

export const metadata = { title: 'Tailwind CSS' };

const HEADINGS: ReadonlyArray<PageHeading> = [
  { id: 'how', text: 'How it works', level: 2 },
  { id: 'v4', text: 'Tailwind v4', level: 2 },
  { id: 'v3', text: 'Tailwind v3', level: 2 },
  { id: 'override', text: 'Overriding components', level: 2 },
  { id: 'utilities', text: 'Token utilities', level: 2 },
];

export default function TailwindPage(): React.ReactElement {
  return (
    <div className="gs-layout">
      <main className="gs-content">
        <PageHeader stable={false} name="Tailwind CSS" description="Use VhyxUI with Tailwind v3 or v4. Utilities override component styles without !important, and your utilities can use VhyxUI tokens: bg-accent, text-foreground-subtle, rounded-md, shadow-lg." tags={['Styling', 'New']} />

        <Section id="how" title="How it works">
          <p className="docs-section-text">
            VhyxUI component styles live in the CSS cascade layer <code>components</code>, and the token reset lives in <code>base</code>.
            Tailwind utilities live in <code>utilities</code>, which always wins — so <code>className=&quot;px-8 rounded-full&quot;</code> on a
            Button just works. Dark mode follows <code>data-theme=&quot;dark&quot;</code>, the <code>.dark</code> class, or the OS with <code>data-theme=&quot;system&quot;</code>.
          </p>
        </Section>

        <Section id="v4" title="Tailwind v4">
          <CodeBlock language="bash" code="pnpm add @vhyxui/react @vhyxui/tokens @vhyxui/tailwind" />
          <CodeBlock language="css" filename="app.css" code={`@import "tailwindcss";
@import "@vhyxui/tailwind/theme.css";   /* bg-accent, text-foreground, rounded-md … */
@import "@vhyxui/tokens/tokens.css";    /* variables only — Tailwind's preflight is your reset */
@import "@vhyxui/react/style.css";      /* components, in @layer components */`} />
        </Section>

        <Section id="v3" title="Tailwind v3">
          <CodeBlock language="js" filename="tailwind.config.js" code={`module.exports = {
  presets: [require('@vhyxui/tailwind')],
  content: ['./src/**/*.{ts,tsx}'],
};`} />
          <CodeBlock language="css" filename="globals.css" code={`@import "@vhyxui/tokens/index.css";   /* tokens + layered reset */
@import "@vhyxui/react/style.css";
@tailwind components;
@tailwind utilities;`} />
          <p className="docs-section-text">
            The preset disables Tailwind v3&apos;s preflight: v3 emits it unlayered, which would override component styles. VhyxUI&apos;s reset replaces it.
          </p>
        </Section>

        <Section id="override" title="Overriding components">
          <CodeBlock language="tsx" code={`import { Button, Card, cx } from '@vhyxui/react';

<Button className="rounded-full px-8 shadow-lg">Launch</Button>
<Card className={cx('p-8', isActive && 'ring-2 ring-accent')}>…</Card>`} />
        </Section>

        <Section id="utilities" title="Token utilities">
          <CodeBlock language="html" code={`<div class="bg-surface text-foreground border border-border rounded-lg shadow-md p-6">
  <p class="text-foreground-subtle">Follows the active theme automatically</p>
  <span class="bg-success-subtle text-success-foreground">Healthy</span>
</div>`} />
        </Section>

        <PageNav prev={{ title: 'Layouts', href: '/layouts' }} next={{ title: 'Architecture', href: '/architecture' }} />
      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
