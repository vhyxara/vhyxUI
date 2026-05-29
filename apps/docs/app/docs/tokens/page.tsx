import React from 'react';
import type { Metadata } from 'next';
import { OnThisPage, type PageHeading } from '../../../components/OnThisPage';
import { PageNav } from '../../../components/PageNav';
import { CodeBlock } from '../../../components/CodeBlock';

export const metadata: Metadata = {
  title: 'Token Reference',
  description: 'Complete reference for all VhyxUI CSS custom properties — color, spacing, typography, motion, sizing, and z-index tokens.',
};

// ─── On This Page ──────────────────────────────────────────────────────────

const HEADINGS: ReadonlyArray<PageHeading> = [
  { id: 'color-tokens',      text: 'Color Tokens',      level: 2 },
  { id: 'spacing-tokens',    text: 'Spacing Tokens',    level: 2 },
  { id: 'typography-tokens', text: 'Typography Tokens', level: 2 },
  { id: 'motion-tokens',     text: 'Motion Tokens',     level: 2 },
  { id: 'size-tokens',       text: 'Component Sizes',   level: 2 },
  { id: 'zindex-tokens',     text: 'Z-Index Scale',     level: 2 },
] as const;

// ─── Color token data ──────────────────────────────────────────────────────

interface ColorToken {
  name: string;
  light: string;
  dark: string;
  usage: string;
}

const COLOR_BG: ColorToken[] = [
  { name: '--vhyx-color-bg',          light: '#f8fafc',  dark: '#020617',  usage: 'Page background' },
  { name: '--vhyx-color-bg-subtle',   light: '#f1f5f9',  dark: '#0f172a',  usage: 'Subtle section backgrounds' },
  { name: '--vhyx-color-bg-muted',    light: '#e2e8f0',  dark: '#1e293b',  usage: 'Muted backgrounds, skeleton' },
  { name: '--vhyx-color-bg-inverse',  light: '#0f172a',  dark: '#f8fafc',  usage: 'Inverse backgrounds' },
];

const COLOR_SURFACE: ColorToken[] = [
  { name: '--vhyx-color-surface',         light: '#ffffff',  dark: '#0f172a',  usage: 'Card, Panel surfaces' },
  { name: '--vhyx-color-surface-raised',  light: '#ffffff',  dark: '#1e293b',  usage: 'Elevated surfaces, popovers' },
  { name: '--vhyx-color-surface-overlay', light: '#ffffff',  dark: '#1e293b',  usage: 'Dialog, Drawer backgrounds' },
];

const COLOR_BORDER: ColorToken[] = [
  { name: '--vhyx-color-border',        light: '#e2e8f0',  dark: '#1e293b',  usage: 'Default borders' },
  { name: '--vhyx-color-border-strong', light: '#cbd5e1',  dark: '#334155',  usage: 'Emphasis borders' },
  { name: '--vhyx-color-border-focus',  light: '#6366f1',  dark: '#818cf8',  usage: 'Focus ring color' },
];

const COLOR_TEXT: ColorToken[] = [
  { name: '--vhyx-color-text',          light: '#0f172a',  dark: '#f8fafc',  usage: 'Primary text' },
  { name: '--vhyx-color-text-subtle',   light: '#64748b',  dark: '#94a3b8',  usage: 'Secondary labels, hints' },
  { name: '--vhyx-color-text-muted',    light: '#94a3b8',  dark: '#64748b',  usage: 'Placeholder, disabled labels' },
  { name: '--vhyx-color-text-disabled', light: '#cbd5e1',  dark: '#475569',  usage: 'Disabled state text' },
  { name: '--vhyx-color-text-inverse',  light: '#f8fafc',  dark: '#0f172a',  usage: 'Text on dark backgrounds' },
  { name: '--vhyx-color-text-on-accent',light: '#ffffff',  dark: '#ffffff',  usage: 'Text on accent-colored elements' },
];

const COLOR_ACCENT: ColorToken[] = [
  { name: '--vhyx-color-accent',        light: '#6366f1',  dark: '#6366f1',  usage: 'Primary interactive color' },
  { name: '--vhyx-color-accent-hover',  light: '#4f46e5',  dark: '#4f46e5',  usage: 'Accent hover state' },
  { name: '--vhyx-color-accent-active', light: '#4338ca',  dark: '#4338ca',  usage: 'Accent pressed state' },
  { name: '--vhyx-color-accent-subtle', light: '#eef2ff',  dark: '#1e1b4b',  usage: 'Accent tint backgrounds' },
  { name: '--vhyx-color-accent-muted',  light: '#e0e7ff',  dark: '#312e81',  usage: 'Accent muted backgrounds' },
];

const COLOR_SEMANTIC: ColorToken[] = [
  { name: '--vhyx-color-success',       light: '#22c55e',  dark: '#22c55e',  usage: 'Success state' },
  { name: '--vhyx-color-success-hover', light: '#16a34a',  dark: '#16a34a',  usage: 'Success hover' },
  { name: '--vhyx-color-success-subtle',light: '#f0fdf4',  dark: '#052e16',  usage: 'Success tint background' },
  { name: '--vhyx-color-success-text',  light: '#15803d',  dark: '#15803d',  usage: 'Success text on subtle bg' },
  { name: '--vhyx-color-danger',        light: '#ef4444',  dark: '#ef4444',  usage: 'Danger / destructive state' },
  { name: '--vhyx-color-danger-hover',  light: '#dc2626',  dark: '#dc2626',  usage: 'Danger hover' },
  { name: '--vhyx-color-danger-subtle', light: '#fef2f2',  dark: '#450a0a',  usage: 'Danger tint background' },
  { name: '--vhyx-color-danger-text',   light: '#b91c1c',  dark: '#b91c1c',  usage: 'Danger text on subtle bg' },
  { name: '--vhyx-color-warning',       light: '#f59e0b',  dark: '#f59e0b',  usage: 'Warning state' },
  { name: '--vhyx-color-warning-hover', light: '#d97706',  dark: '#d97706',  usage: 'Warning hover' },
  { name: '--vhyx-color-warning-subtle',light: '#fffbeb',  dark: '#431407',  usage: 'Warning tint background' },
  { name: '--vhyx-color-warning-text',  light: '#d97706',  dark: '#d97706',  usage: 'Warning text on subtle bg' },
  { name: '--vhyx-color-info',          light: '#3b82f6',  dark: '#3b82f6',  usage: 'Info state' },
  { name: '--vhyx-color-info-hover',    light: '#2563eb',  dark: '#2563eb',  usage: 'Info hover' },
  { name: '--vhyx-color-info-subtle',   light: '#eff6ff',  dark: '#0c1a45',  usage: 'Info tint background' },
  { name: '--vhyx-color-info-text',     light: '#2563eb',  dark: '#2563eb',  usage: 'Info text on subtle bg' },
];

// ─── Spacing token data ───────────────────────────────────────────────────

interface SimpleToken {
  name: string;
  value: string;
  note?: string;
}

const SPACING_TOKENS: SimpleToken[] = [
  { name: '--vhyx-space-px',   value: '1px' },
  { name: '--vhyx-space-0',    value: '0' },
  { name: '--vhyx-space-0-5',  value: '0.125rem — 2px' },
  { name: '--vhyx-space-1',    value: '0.25rem — 4px' },
  { name: '--vhyx-space-1-5',  value: '0.375rem — 6px' },
  { name: '--vhyx-space-2',    value: '0.5rem — 8px' },
  { name: '--vhyx-space-2-5',  value: '0.625rem — 10px' },
  { name: '--vhyx-space-3',    value: '0.75rem — 12px' },
  { name: '--vhyx-space-3-5',  value: '0.875rem — 14px' },
  { name: '--vhyx-space-4',    value: '1rem — 16px' },
  { name: '--vhyx-space-5',    value: '1.25rem — 20px' },
  { name: '--vhyx-space-6',    value: '1.5rem — 24px' },
  { name: '--vhyx-space-7',    value: '1.75rem — 28px' },
  { name: '--vhyx-space-8',    value: '2rem — 32px' },
  { name: '--vhyx-space-10',   value: '2.5rem — 40px' },
  { name: '--vhyx-space-12',   value: '3rem — 48px' },
  { name: '--vhyx-space-16',   value: '4rem — 64px' },
  { name: '--vhyx-space-20',   value: '5rem — 80px' },
  { name: '--vhyx-space-24',   value: '6rem — 96px' },
  { name: '--vhyx-space-32',   value: '8rem — 128px' },
];

// ─── Typography token data ─────────────────────────────────────────────────

const FONT_SIZE_TOKENS: SimpleToken[] = [
  { name: '--vhyx-text-2xs', value: '0.625rem — 10px' },
  { name: '--vhyx-text-xs',  value: '0.75rem — 12px' },
  { name: '--vhyx-text-sm',  value: '0.875rem — 14px' },
  { name: '--vhyx-text-md',  value: '1rem — 16px',     note: 'body default' },
  { name: '--vhyx-text-lg',  value: '1.125rem — 18px' },
  { name: '--vhyx-text-xl',  value: '1.25rem — 20px' },
  { name: '--vhyx-text-2xl', value: '1.5rem — 24px' },
  { name: '--vhyx-text-3xl', value: '1.875rem — 30px' },
  { name: '--vhyx-text-4xl', value: '2.25rem — 36px' },
];

const FONT_WEIGHT_TOKENS: SimpleToken[] = [
  { name: '--vhyx-weight-light',     value: '300' },
  { name: '--vhyx-weight-normal',    value: '400', note: 'default' },
  { name: '--vhyx-weight-medium',    value: '500' },
  { name: '--vhyx-weight-semibold',  value: '600' },
  { name: '--vhyx-weight-bold',      value: '700' },
  { name: '--vhyx-weight-extrabold', value: '800' },
];

const LINE_HEIGHT_TOKENS: SimpleToken[] = [
  { name: '--vhyx-leading-none',    value: '1' },
  { name: '--vhyx-leading-tight',   value: '1.25' },
  { name: '--vhyx-leading-snug',    value: '1.375' },
  { name: '--vhyx-leading-normal',  value: '1.5', note: 'default' },
  { name: '--vhyx-leading-relaxed', value: '1.625' },
  { name: '--vhyx-leading-loose',   value: '2' },
];

const LETTER_SPACING_TOKENS: SimpleToken[] = [
  { name: '--vhyx-tracking-tight',   value: '-0.025em' },
  { name: '--vhyx-tracking-normal',  value: '0em' },
  { name: '--vhyx-tracking-wide',    value: '0.025em' },
  { name: '--vhyx-tracking-wider',   value: '0.05em' },
  { name: '--vhyx-tracking-widest',  value: '0.1em' },
];

// ─── Motion token data ────────────────────────────────────────────────────

const DURATION_TOKENS: SimpleToken[] = [
  { name: '--vhyx-duration-instant', value: '50ms',  note: 'micro-feedback, active states' },
  { name: '--vhyx-duration-fast',    value: '100ms', note: 'tooltips, simple show/hide' },
  { name: '--vhyx-duration-normal',  value: '200ms', note: 'most transitions' },
  { name: '--vhyx-duration-slow',    value: '350ms', note: 'dialog, drawer entry' },
  { name: '--vhyx-duration-glacial', value: '500ms', note: 'large layout shifts' },
];

const EASING_TOKENS: SimpleToken[] = [
  { name: '--vhyx-easing-linear',     value: 'linear' },
  { name: '--vhyx-easing-standard',   value: 'cubic-bezier(0.4, 0, 0.2, 1)',   note: 'general purpose' },
  { name: '--vhyx-easing-decelerate', value: 'cubic-bezier(0, 0, 0.2, 1)',     note: 'elements entering the screen' },
  { name: '--vhyx-easing-accelerate', value: 'cubic-bezier(0.4, 0, 1, 1)',     note: 'elements leaving the screen' },
  { name: '--vhyx-easing-spring',     value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', note: 'switch, popover, toast' },
  { name: '--vhyx-easing-bounce',     value: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', note: 'playful overshoot' },
  { name: '--vhyx-easing-smooth',     value: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', note: 'smooth deceleration' },
];

// ─── Component size token data ────────────────────────────────────────────

const SIZE_TOKENS: SimpleToken[] = [
  { name: '--vhyx-size-xs', value: '1.5rem — 24px',  note: 'xs components' },
  { name: '--vhyx-size-sm', value: '2rem — 32px',    note: 'sm components' },
  { name: '--vhyx-size-md', value: '2.5rem — 40px',  note: 'md components (default)' },
  { name: '--vhyx-size-lg', value: '3rem — 48px',    note: 'lg components' },
  { name: '--vhyx-size-xl', value: '3.5rem — 56px',  note: 'xl components' },
];

const RADIUS_TOKENS: SimpleToken[] = [
  { name: '--vhyx-radius-none', value: '0' },
  { name: '--vhyx-radius-xs',   value: '2px' },
  { name: '--vhyx-radius-sm',   value: '4px',   note: 'small inputs, badges' },
  { name: '--vhyx-radius-md',   value: '6px',   note: 'buttons, inputs (default)' },
  { name: '--vhyx-radius-lg',   value: '8px',   note: 'cards' },
  { name: '--vhyx-radius-xl',   value: '12px',  note: 'dialogs, drawers' },
  { name: '--vhyx-radius-2xl',  value: '16px' },
  { name: '--vhyx-radius-3xl',  value: '24px' },
  { name: '--vhyx-radius-full', value: '9999px', note: 'pills, switches' },
];

// ─── Z-index token data ───────────────────────────────────────────────────

const ZINDEX_TOKENS: SimpleToken[] = [
  { name: '--vhyx-z-hide',     value: '-1',   note: 'visually hidden but in flow' },
  { name: '--vhyx-z-base',     value: '0',    note: 'default stacking context' },
  { name: '--vhyx-z-raised',   value: '10',   note: 'elevated cards' },
  { name: '--vhyx-z-dropdown', value: '100',  note: 'Select, Dropdown menus' },
  { name: '--vhyx-z-sticky',   value: '200',  note: 'sticky headers, sidebars' },
  { name: '--vhyx-z-banner',   value: '250',  note: 'announcement banners' },
  { name: '--vhyx-z-overlay',  value: '300',  note: 'Dialog and Drawer overlays' },
  { name: '--vhyx-z-modal',    value: '400',  note: 'Dialog and Drawer content' },
  { name: '--vhyx-z-popover',  value: '450',  note: 'Popover, Tooltip' },
  { name: '--vhyx-z-toast',    value: '500',  note: 'Toast notifications' },
  { name: '--vhyx-z-tooltip',  value: '550',  note: 'Tooltips (above everything)' },
  { name: '--vhyx-z-top',      value: '999',  note: 'Emergency override' },
];

// ─── Sub-components ────────────────────────────────────────────────────────

function ColorSwatch({ hex }: { hex: string }): React.ReactElement {
  const isWhite = hex === '#ffffff' || hex === '#fff';
  return (
    <span
      className="tk-swatch"
      style={{
        backgroundColor: hex,
        border: isWhite ? '1px solid var(--vhyx-color-border)' : 'none',
      }}
      aria-hidden="true"
    />
  );
}

interface ColorTableProps {
  title: string;
  tokens: ColorToken[];
}

function ColorTable({ title, tokens }: ColorTableProps): React.ReactElement {
  return (
    <div className="tk-color-group">
      <h3 className="gs-subsection-title">{title}</h3>
      <div className="tk-table-wrap">
        <table className="tk-table">
          <thead>
            <tr>
              <th>Token</th>
              <th>Light</th>
              <th>Dark</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((t) => (
              <tr key={t.name}>
                <td><code className="tk-token-name">{t.name}</code></td>
                <td>
                  <span className="tk-color-cell">
                    <ColorSwatch hex={t.light} />
                    <code className="tk-hex">{t.light}</code>
                  </span>
                </td>
                <td>
                  <span className="tk-color-cell">
                    <ColorSwatch hex={t.dark} />
                    <code className="tk-hex">{t.dark}</code>
                  </span>
                </td>
                <td className="tk-usage">{t.usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface SimpleTableProps {
  tokens: SimpleToken[];
}

function SimpleTable({ tokens }: SimpleTableProps): React.ReactElement {
  return (
    <div className="tk-table-wrap">
      <table className="tk-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Value</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t) => (
            <tr key={t.name}>
              <td><code className="tk-token-name">{t.name}</code></td>
              <td><code className="tk-value">{t.value}</code></td>
              <td className="tk-usage">{t.note ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Code sample ──────────────────────────────────────────────────────────

const CODE_OVERRIDE = `:root {
  /* Override accent to your brand blue */
  --vhyx-color-accent:       #2563eb;
  --vhyx-color-accent-hover: #1d4ed8;

  /* Tighter radius everywhere */
  --vhyx-radius-sm: 2px;
  --vhyx-radius-md: 4px;
  --vhyx-radius-lg: 6px;
}`;

// ─── Page ─────────────────────────────────────────────────────────────────

export default function TokensPage(): React.ReactElement {
  return (
    <div className="gs-layout">

      <main className="gs-content">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <h1 className="gs-page-title">Token Reference</h1>
        <p className="gs-page-sub">
          Every visual decision in VhyxUI is a CSS custom property.
          Override any token in <code>:root</code> to retheme the entire library.
          No JavaScript. No configuration object. Just CSS.
        </p>

        <CodeBlock code={CODE_OVERRIDE} language="css" filename="your-theme.css" />

        {/* ── Section 1: Color Tokens ──────────────────────────────────── */}
        <section id="color-tokens" className="gs-section">
          <h2 className="gs-section-title">Color Tokens</h2>
          <p className="gs-body">
            Semantic color tokens are what components use. They reference
            primitive values internally. Overriding a semantic token
            updates every component that uses it — you never touch the
            component itself.
          </p>
          <p className="gs-body">
            Dark mode is handled by redefining the same semantic tokens
            under <code>[data-theme=&quot;dark&quot;]</code>. You only override
            the semantic layer — primitive values stay constant.
          </p>

          <ColorTable title="Background" tokens={COLOR_BG} />
          <ColorTable title="Surface" tokens={COLOR_SURFACE} />
          <ColorTable title="Border" tokens={COLOR_BORDER} />
          <ColorTable title="Text" tokens={COLOR_TEXT} />
          <ColorTable title="Accent" tokens={COLOR_ACCENT} />
          <ColorTable title="Semantic — Success · Danger · Warning · Info" tokens={COLOR_SEMANTIC} />
        </section>

        {/* ── Section 2: Spacing Tokens ────────────────────────────────── */}
        <section id="spacing-tokens" className="gs-section">
          <h2 className="gs-section-title">Spacing Tokens</h2>
          <p className="gs-body">
            All spacing values follow a 4px base grid. Every token is a
            multiple of 4px, keeping your layout consistent without
            manual arithmetic.
          </p>
          <SimpleTable tokens={SPACING_TOKENS} />
        </section>

        {/* ── Section 3: Typography Tokens ─────────────────────────────── */}
        <section id="typography-tokens" className="gs-section">
          <h2 className="gs-section-title">Typography Tokens</h2>
          <p className="gs-body">
            Font families, sizes, weights, line heights, and letter spacing
            are all token-driven. Override <code>--vhyx-font-sans</code> once
            and every component picks up your custom typeface.
          </p>

          <h3 className="gs-subsection-title">Font sizes</h3>
          <SimpleTable tokens={FONT_SIZE_TOKENS} />

          <h3 className="gs-subsection-title">Font weights</h3>
          <SimpleTable tokens={FONT_WEIGHT_TOKENS} />

          <h3 className="gs-subsection-title">Line height</h3>
          <SimpleTable tokens={LINE_HEIGHT_TOKENS} />

          <h3 className="gs-subsection-title">Letter spacing</h3>
          <SimpleTable tokens={LETTER_SPACING_TOKENS} />
        </section>

        {/* ── Section 4: Motion Tokens ─────────────────────────────────── */}
        <section id="motion-tokens" className="gs-section">
          <h2 className="gs-section-title">Motion Tokens</h2>
          <p className="gs-body">
            All animations and transitions are driven by duration and easing
            tokens. When a user has <code>prefers-reduced-motion: reduce</code>{' '}
            set, all duration tokens automatically collapse to <code>0ms</code>{' '}
            — zero JavaScript required.
          </p>

          <h3 className="gs-subsection-title">Durations</h3>
          <SimpleTable tokens={DURATION_TOKENS} />

          <h3 className="gs-subsection-title">Easing curves</h3>
          <SimpleTable tokens={EASING_TOKENS} />
        </section>

        {/* ── Section 5: Component Sizes ───────────────────────────────── */}
        <section id="size-tokens" className="gs-section">
          <h2 className="gs-section-title">Component Sizes</h2>
          <p className="gs-body">
            Interactive element heights are locked to the size scale.
            Every component that accepts a <code>size</code> prop maps
            to one of these tokens, keeping your UI visually consistent
            across Button, Input, Select, and every other form control.
          </p>

          <h3 className="gs-subsection-title">Height scale</h3>
          <SimpleTable tokens={SIZE_TOKENS} />

          <h3 className="gs-subsection-title">Border radius</h3>
          <SimpleTable tokens={RADIUS_TOKENS} />
        </section>

        {/* ── Section 6: Z-Index ───────────────────────────────────────── */}
        <section id="zindex-tokens" className="gs-section">
          <h2 className="gs-section-title">Z-Index Scale</h2>
          <p className="gs-body">
            Every layering decision uses a named token. Nothing in VhyxUI
            uses a magic number like <code>z-index: 9999</code>. If you need
            a custom layer, use the nearest token and build relative to it.
          </p>
          <SimpleTable tokens={ZINDEX_TOKENS} />
        </section>

        <PageNav
          prev={{ title: 'Agent Contracts', href: '/agent-contracts' }}
          next={{ title: 'Changelog', href: '/docs/changelog' }}
        />

      </main>

      <OnThisPage headings={HEADINGS} />

    </div>
  );
}
