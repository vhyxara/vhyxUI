import React from 'react';
import type { Metadata } from 'next';
import { Badge } from '../../../components/ui';
import { OnThisPage, type PageHeading } from '../../../components/OnThisPage';
import { PageNav } from '../../../components/PageNav';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'Release history for VhyxUI — every version, every change.',
};

// ─── On This Page ──────────────────────────────────────────────────────────

const HEADINGS: ReadonlyArray<PageHeading> = [
  { id: 'v0-1-0-alpha-1', text: 'v0.1.0-alpha.1', level: 2 },
] as const;

// ─── Component list ────────────────────────────────────────────────────────

interface ComponentEntry {
  name: string;
  category: string;
}

const COMPONENTS: ComponentEntry[] = [
  { name: 'Button',      category: 'Inputs & Forms' },
  { name: 'Input',       category: 'Inputs & Forms' },
  { name: 'Textarea',    category: 'Inputs & Forms' },
  { name: 'Select',      category: 'Inputs & Forms' },
  { name: 'Checkbox',    category: 'Inputs & Forms' },
  { name: 'Radio',       category: 'Inputs & Forms' },
  { name: 'Switch',      category: 'Inputs & Forms' },
  { name: 'Form & Field',category: 'Inputs & Forms' },
  { name: 'Toast',       category: 'Feedback' },
  { name: 'Alert',       category: 'Feedback' },
  { name: 'Badge',       category: 'Feedback' },
  { name: 'Progress',    category: 'Feedback' },
  { name: 'Spinner',     category: 'Feedback' },
  { name: 'Dialog',      category: 'Overlay' },
  { name: 'Drawer',      category: 'Overlay' },
  { name: 'Tooltip',     category: 'Overlay' },
  { name: 'Popover',     category: 'Overlay' },
  { name: 'Card',        category: 'Layout' },
  { name: 'Separator',   category: 'Layout' },
  { name: 'Tabs',        category: 'Navigation' },
  { name: 'Breadcrumb',  category: 'Navigation' },
  { name: 'Pagination',  category: 'Navigation' },
];

const CATEGORIES = ['Inputs & Forms', 'Feedback', 'Overlay', 'Layout', 'Navigation'] as const;

// ─── Known limitations ────────────────────────────────────────────────────

const LIMITATIONS: string[] = [
  'No React Native support — web only in alpha.',
  'Form component requires react-hook-form; standalone usage with native form state is not yet documented.',
  'VhyxSeal contracts ship as data attributes but the full manifest generation CLI is not yet published.',
  'SSR-safe animation is handled via CSS only; JavaScript-driven exit animations on unmount are not supported.',
  'No Storybook integration yet — the Playground (play.vhyxui.dev) serves as the interactive reference.',
  'Dark mode requires data-theme="dark" on a parent element — automatic system-preference detection requires opt-in via ThemeProvider.',
  'Accordion and Combobox are Tier 2 components and are not yet included.',
];

// ─── Page ─────────────────────────────────────────────────────────────────

export default function ChangelogPage(): React.ReactElement {
  return (
    <div className="gs-layout">

      <main className="gs-content">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <h1 className="gs-page-title">Changelog</h1>
        <p className="gs-page-sub">
          All notable changes to VhyxUI are documented here. This project
          follows <a href="https://semver.org" target="_blank" rel="noopener noreferrer" className="gs-link">Semantic Versioning</a>.
        </p>

        {/* ── v0.1.0-alpha.1 ───────────────────────────────────────────── */}
        <section id="v0-1-0-alpha-1" className="gs-section">
          <div className="cl-release-header">
            <h2 className="cl-release-version">v0.1.0-alpha.1</h2>
            <div className="cl-release-meta">
              <time dateTime="2026-05-29" className="cl-release-date">May 29, 2026</time>
              <Badge variant="warning" size="sm">Alpha</Badge>
            </div>
          </div>

          <p className="gs-body">
            First public alpha release of VhyxUI. All 22 Tier 1 components
            are implemented, tested, and documented. The token system,
            accessibility layer, motion system, and VhyxSeal agent contracts
            all ship together.
          </p>

          {/* What's included */}
          <h3 className="gs-subsection-title">What&apos;s included</h3>
          <ul className="cl-feature-list">
            <li>
              <strong>@vhyxui/tokens</strong> — Full CSS custom property system.
              Primitives, semantic layer, dark mode, reset, and motion keyframes.
              Zero JavaScript. No build step.
            </li>
            <li>
              <strong>@vhyxui/core</strong> — Shared TypeScript types, VhyxSeal
              default contracts for all 22 components, Slot implementation for the
              asChild pattern, and VhyxUIError error class.
            </li>
            <li>
              <strong>@vhyxui/react</strong> — All 22 Tier 1 components with
              full prop APIs, accessibility (WCAG 2.1 AA), motion, and VhyxSeal
              contracts. Dual CJS / ESM build. Tree-shakeable per-component imports.
            </li>
            <li>
              <strong>VhyxUIProvider</strong> — Root provider with skip-link,
              Toast region, and theme context.
            </li>
            <li>
              <strong>toast() imperative API</strong> — Call <code>toast()</code>,{' '}
              <code>toast.success()</code>, <code>toast.danger()</code> from
              anywhere without props or context wiring.
            </li>
            <li>
              <strong>Form + Field architecture</strong> — First-class Field
              component auto-wires label, hint, and error to the child input.
              Native react-hook-form + Zod integration.
            </li>
            <li>
              <strong>Agent contracts</strong> — Every component ships with a
              default VhyxSeal contract readable via <code>data-vhyx-contract</code>.
              Destructive Button variant auto-upgrades to <code>safetyLevel: critical</code>.
            </li>
            <li>
              <strong>Dark mode</strong> — Full semantic token set for{' '}
              <code>[data-theme=&quot;dark&quot;]</code>. No extra CSS to write.
            </li>
            <li>
              <strong>prefers-reduced-motion</strong> — All duration tokens
              collapse to 0ms automatically. Zero JavaScript required.
            </li>
          </ul>

          {/* Component list */}
          <h3 className="gs-subsection-title">All 22 components</h3>
          <div className="cl-component-grid">
            {CATEGORIES.map((cat) => (
              <div key={cat} className="cl-component-category">
                <p className="cl-category-label">{cat}</p>
                <ul className="cl-component-list">
                  {COMPONENTS.filter((c) => c.category === cat).map((c) => (
                    <li key={c.name} className="cl-component-item">
                      <span className="cl-check" aria-hidden="true">✓</span>
                      {c.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Known limitations */}
          <h3 className="gs-subsection-title">Known limitations</h3>
          <ul className="cl-limitation-list">
            {LIMITATIONS.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>

          {/* Migration note */}
          <div className="cl-alpha-notice">
            <strong>Alpha notice.</strong>{' '}
            This is a pre-release. APIs are stable but not semver-frozen until v0.1.0.
            Minor breaking changes may occur between alpha versions.
            Pin your version and check this changelog before upgrading.
          </div>
        </section>

        <PageNav
          prev={{ title: 'Token Reference', href: '/docs/tokens' }}
        />

      </main>

      <OnThisPage headings={HEADINGS} />

    </div>
  );
}
