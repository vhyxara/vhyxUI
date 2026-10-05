import {
  ArrowRightIcon,
  BlocksIcon,
  BotIcon,
  BrushIcon,
  ComponentIcon,
  LayersIcon,
  LayoutDashboardIcon,
  PaletteIcon,
  ShapesIcon,
  WindIcon,
} from '@vhyxui/icons';
import React from 'react';
import Link from 'next/link';
import { Button } from '@vhyxui/react';
import { CopyButton } from '../components/CopyButton';
import { SearchLauncher } from '../components/home/SearchLauncher';
import { PLAYGROUND, SITE, VHYXARA, VHYXCHART, VHYXSEAL } from '../components/links';

const INSTALL = 'pnpm add @vhyxui/react @vhyxui/tokens';

const STEPS = [
  { n: '01', title: 'Install', text: 'Add the components and the design tokens, then import the styles once.', href: '/getting-started' },
  { n: '02', title: 'Theme it', text: 'Light, dark or your own brand: every component reads the same tokens.', href: '/theming' },
  { n: '03', title: 'Ship agent-ready UI', text: 'Each control already carries a contract. See what agents read and how to tune it.', href: '/agent-contracts' },
];

const SECTIONS = [
  { icon: <ComponentIcon />, title: 'Components', text: '37 accessible components with motion, keyboard support and contracts.', href: '/components/button' },
  { icon: <BlocksIcon />, title: 'Blocks', text: 'Data tables, stat cards, pricing, auth forms — ready-made sections.', href: '/blocks' },
  { icon: <LayoutDashboardIcon />, title: 'Layouts', text: 'App shells, dashboards and docs layouts to start a page from.', href: '/layouts' },
  { icon: <ShapesIcon />, title: 'Icons', text: '500 original icons on one grid, with animated variants.', href: '/icons' },
  { icon: <PaletteIcon />, title: 'Theming', text: 'Switch themes, set your accent, and scope themes to a section.', href: '/theming' },
  { icon: <BrushIcon />, title: 'Design tokens', text: 'Colour, spacing, radius, type and motion — all CSS variables.', href: '/docs/tokens' },
  { icon: <WindIcon />, title: 'Tailwind', text: 'Use VhyxUI with Tailwind v3 or v4; your utilities still win.', href: '/tailwind' },
  { icon: <BotIcon />, title: 'Agent contracts', text: 'Intent, safety level and confirmation for every interactive control.', href: '/agent-contracts' },
  { icon: <LayersIcon />, title: 'Architecture', text: 'How the four layers fit: visuals, accessibility, motion, contracts.', href: '/architecture' },
];

const POPULAR = ['button', 'dialog', 'toast', 'select', 'tabs', 'form', 'input', 'switch', 'tooltip', 'drawer'];

export default function HomePage(): React.ReactElement {
  return (
    <div className="home">
      <section className="home-hero atmo-hero">
        <div className="atmo-aurora" aria-hidden="true"><span /><span /><span /></div>
        <div className="home-inner home-hero-inner">
          <Link href="/docs/changelog" className="home-pill"><b>New</b> Smoother overlays in 0.4.11 <ArrowRightIcon size="1em" /></Link>
          <span className="atmo-eyebrow">Documentation</span>
          <h1 className="home-title">Learn VhyxUI, <span className="atmo-gradient-text">step by step</span>.</h1>
          <p className="home-lead">
            Install the library, browse every component, theme it with tokens, and see the contract each control gives AI agents.
          </p>
          <div className="home-actions">
            <SearchLauncher />
            <span className="home-install">
              <span className="home-install-prompt" aria-hidden="true">$</span>
              <code>{INSTALL}</code>
              <CopyButton code={INSTALL} />
            </span>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-inner">
          <h2 className="home-h2">Start here</h2>
          <div className="home-steps">
            {STEPS.map((s) => (
              <Link key={s.n} href={s.href} className="atmo-card home-step">
                <span className="home-step-n">{s.n}</span>
                <strong>{s.title}</strong>
                <p>{s.text}</p>
                <span className="atmo-card-more">Read <ArrowRightIcon size="1em" /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-inner">
          <h2 className="home-h2">Explore the docs</h2>
          <div className="home-grid">
            {SECTIONS.map((s) => (
              <Link key={s.title} href={s.href} className="atmo-card">
                <span className="atmo-card-icon" aria-hidden="true">{s.icon}</span>
                <strong>{s.title}</strong>
                <p>{s.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-inner">
          <div className="home-heading-row">
            <h2 className="home-h2">Popular components</h2>
            <Link href="/components/button" className="home-link">All components <ArrowRightIcon size="1em" /></Link>
          </div>
          <div className="home-chips">
            {POPULAR.map((c) => (
              <Link key={c} href={`/components/${c}`} className="home-chip">{c[0]!.toUpperCase() + c.slice(1)}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-inner">
          <div className="atmo-card home-banner">
            <div>
              <strong>Try every component live</strong>
              <p>The playground has props, contract, code and token panels, and an agent console that shows what an AI agent reads as you click.</p>
            </div>
            <div className="home-banner-actions">
              <Button asChild size="lg"><a href={PLAYGROUND}>Open playground</a></Button>
              <Button asChild size="lg" variant="ghost"><a href={SITE}>About VhyxUI</a></Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <span className="atmo-family-bar" aria-hidden="true" />
        <div className="home-footer-row">
          <span>A <a href={VHYXARA} className="brand-link">Vhyxara</a> library · MIT licensed</span>
          <span className="home-footer-links">
            <a href={VHYXSEAL}>VhyxSeal</a>
            <a href={VHYXCHART}>VhyxChart</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
