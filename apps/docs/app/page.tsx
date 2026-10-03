import { ArrowRightIcon, TriangleAlertIcon } from '@vhyxui/icons';
import React from 'react';
import Link from 'next/link';
import { Alert, Button, TextField } from '@vhyxui/react';
import { CopyButton } from '../components/CopyButton';
import { DualViewHero } from '../components/home/DualViewHero';
import { CapabilityMap } from '../components/home/CapabilityMap';
import { PLAYGROUND, VHYXARA, VHYXCHART, VHYXSEAL } from '../components/links';

const INSTALL = 'pnpm add @vhyxui/react @vhyxui/tokens';

const CATEGORIES = [
  { title: 'Inputs & Forms', text: 'Button, Input, Select, Checkbox, Switch, Form fields', href: '/components/button' },
  { title: 'Feedback', text: 'Toast, Alert, Badge, Progress, Spinner', href: '/components/toast' },
  { title: 'Overlays', text: 'Dialog, Drawer, Tooltip, Popover', href: '/components/dialog' },
  { title: 'Blocks & Layouts', text: 'DataTable, StatCard, Pricing, AppShell and more', href: '/blocks' },
];

export default function HomePage(): React.ReactElement {
  return (
    <div className="home">
      <section className="home-hero docs-grid-bg">
        <div className="home-inner home-hero-inner">
          <span className="home-eyebrow">React · 37 components · 500 icons · agent contracts</span>
          <h1 className="home-title">Build the screen once. Humans click it, agents read it.</h1>
          <p className="home-lead">
            Accessible React components with motion and design tokens. Every control publishes a signed
            contract, so AI agents know what it does before they press it.
          </p>
          <div className="home-actions">
            <Button asChild size="lg"><Link href="/getting-started">Get started</Link></Button>
            <Button asChild size="lg" variant="outline"><a href={PLAYGROUND}>Open playground</a></Button>
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
          <p className="home-caption">One settings screen, seen two ways.</p>
          <DualViewHero />
        </div>
      </section>

      <section className="home-section">
        <div className="home-inner">
          <div className="home-heading-row">
            <h2 className="home-h2">Designed to feel good</h2>
            <Link href="/components/button" className="home-link">Browse all components <ArrowRightIcon size="1em" /></Link>
          </div>
          <div className="home-stages">
            <div className="home-stage" data-tint="accent">
              <span className="home-stage-label">Buttons</span>
              <div className="home-stage-body home-stage-buttons">
                <Button>Publish</Button>
                <Button variant="outline">Preview</Button>
                <Button variant="ghost">Cancel</Button>
              </div>
            </div>
            <div className="home-stage" data-tint="success">
              <span className="home-stage-label">Forms</span>
              <div className="home-stage-body">
                <TextField name="work-email" label="Work email" defaultValue="ada@company.dev" hint="We'll send a sign-in link." />
              </div>
            </div>
            <div className="home-stage" data-tint="warning">
              <span className="home-stage-label">Feedback</span>
              <div className="home-stage-body">
                <Alert variant="warning" icon={<TriangleAlertIcon />} title="Storage almost full">92% of 10 GB used.</Alert>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-inner home-split">
          <div className="home-panel">
            <span className="home-panel-eyebrow">Capability map · rendered by VhyxChart</span>
            <CapabilityMap />
            <p className="home-panel-text">
              Every manifest can be drawn as an animated flow, so you can review what agents may do before you ship.
            </p>
          </div>
          <div className="home-panel home-stats">
            <div><strong>37</strong><span>components</span></div>
            <div><strong>22</strong><span>blocks and layouts</span></div>
            <div><strong>500</strong><span>original icons</span></div>
            <div><strong>0</strong><span>lines to add contracts</span></div>
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-inner">
          <h2 className="home-h2">Browse the library</h2>
          <div className="home-cards">
            {CATEGORIES.map((c) => (
              <Link key={c.title} href={c.href} className="home-card">
                <strong>{c.title}</strong>
                <span>{c.text}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <span>A <a href={VHYXARA} className="brand-link">Vhyxara</a> library · MIT licensed</span>
        <span className="home-footer-links">
          <a href={VHYXSEAL}>VhyxSeal</a>
          <a href={VHYXCHART}>VhyxChart</a>
        </span>
      </footer>
    </div>
  );
}
