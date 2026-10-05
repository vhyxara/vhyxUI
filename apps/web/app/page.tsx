'use client';

import { AccessibilityIcon, ArrowRightIcon, BotIcon, LayoutDashboardIcon, PaletteIcon, WavesIcon, WindIcon } from '@vhyxui/icons';
import React, { useEffect, useState } from 'react';
import { VhyxChart } from '@vhyxchart/react';
import {
  Accordion,
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  HStack,
  Stack,
  Switch,
  Tabs,
  Text,
  TextField,
  VhyxUIProvider,
  toast,
} from '@vhyxui/react';
import { AGENT_STORY } from '../components/diagram';
import { AgentLens } from '../components/landing/AgentLens';
import { SiteHeader } from '../components/landing/SiteHeader';
import { CountUp, Reveal } from '../components/landing/motion';
import { BLOCKS, COMPONENTS, DOCS, GET_STARTED, GITHUB, ICONS, NPM, PLAYGROUND, VHYXCHART, VHYXSEAL, VHYXARA } from '../components/links';

const INSTALL = 'npm install @vhyxui/react @vhyxui/tokens';

const CONTRACT_EXAMPLE = `{
  "id": "delete-project",
  "type": "action",
  "intent": "delete-item",
  "safetyLevel": "high",
  "requiresConfirmation": true,
  "destructive": true,
  "consequence": "Permanently deletes the project"
}`;

const MARK = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 2.8 20 7.2v9.6l-8 4.4-8-4.4V7.2Z" />
    <path d="M4 7.2l8 4.4 8-4.4" />
    <path d="M12 11.6v9.6" />
    <path d="M8 5l8 4.4" />
  </svg>
);

function copyInstall(): void {
  void navigator.clipboard?.writeText(INSTALL).then(
    () => toast.success('Install command copied'),
    () => toast.danger('Could not copy — select the command instead'),
  );
}

/** A value that flips on a timer, for self-playing demos (still under reduced motion). */
function useAutoFlip(ms: number): [boolean, (v: boolean) => void] {
  const [on, setOn] = useState(true);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || held) return undefined;
    const id = window.setInterval(() => setOn((v) => !v), ms);
    return () => window.clearInterval(id);
  }, [ms, held]);
  return [on, (v) => { setHeld(true); setOn(v); }];
}

function Bento(): React.ReactElement {
  const [motionOn, setMotionOn] = useAutoFlip(1600);
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return undefined;
    const id = window.setInterval(() => setDark((d) => !d), 2800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="lp-bento">
      <Reveal className="lp-tile">
        <span className="lp-tile-icon"><AccessibilityIcon size={18} /></span>
        <h3>Accessible by default</h3>
        <p>Keyboard, focus management, ARIA and reduced motion are built in and tested with axe on every component.</p>
        <div className="lp-tile-visual">
          <div className="kbd-row" aria-hidden="true"><span>Cancel</span><span>Preview</span><span>Publish</span></div>
          <div className="kbd-keys" aria-hidden="true"><kbd>Tab</kbd><kbd>⇧ Tab</kbd><kbd>Enter</kbd></div>
        </div>
      </Reveal>
      <Reveal className="lp-tile" delay={80}>
        <span className="lp-tile-icon"><WavesIcon size={18} /></span>
        <h3>Motion that feels right</h3>
        <p>Switches glide, checkmarks draw in, tab indicators slide — every state change animates both ways.</p>
        <div className="lp-tile-visual">
          <div className="motion-stack">
            <Switch checked={motionOn} onCheckedChange={setMotionOn} aria-label="Demo switch" size="lg" />
            <HStack gap={4} align="center">
              <Checkbox checked={motionOn} onCheckedChange={(v) => setMotionOn(v === true)} aria-label="Demo checkbox" />
              <Text size="sm" tone="muted">{motionOn ? 'On' : 'Off'}</Text>
            </HStack>
          </div>
        </div>
      </Reveal>
      <Reveal className="lp-tile lp-tile--4">
        <span className="lp-tile-icon"><BotIcon size={18} /></span>
        <h3>A contract on every control</h3>
        <p>Each interactive component tells AI agents what it does, how risky it is, and when a person must confirm — with zero extra code.</p>
        <div className="lp-tile-visual">
          <pre className="json-lines" aria-label="Contract for a delete button">
            <span>{'{ '}<span className="k" style={{ display: 'inline', animation: 'none' }}>&quot;intent&quot;</span>: &quot;delete-item&quot;,</span>
            <span>{'  '}&quot;safetyLevel&quot;: &quot;high&quot;,</span>
            <span>{'  '}&quot;requiresConfirmation&quot;: true,</span>
            <span>{'  '}&quot;destructive&quot;: true,</span>
            <span>{'  '}&quot;consequence&quot;: &quot;Permanently deletes the project&quot;</span>
            <span>{'}'}</span>
          </pre>
        </div>
      </Reveal>
      <Reveal className="lp-tile lp-tile--2" delay={80}>
        <span className="lp-tile-icon"><PaletteIcon size={18} /></span>
        <h3>Themes in tokens</h3>
        <p>Light, dark, or your own brand — every component follows.</p>
        <div className="lp-tile-visual">
          <div className="theme-flip" data-theme={dark ? 'dark' : 'light'} aria-hidden="true">
            <i /><i /><i style={{ width: '75%' }} /><b>Continue</b>
          </div>
        </div>
      </Reveal>
      <Reveal className="lp-tile">
        <span className="lp-tile-icon"><WindIcon size={18} /></span>
        <h3>Plays well with Tailwind</h3>
        <p>Use plain CSS, Tailwind v3 or v4. Styles live in cascade layers, so your utilities win without <code>!important</code>.</p>
        <div className="lp-tile-visual">
          <pre className="code-card">{'@import "tailwindcss";\n@import "@vhyxui/tailwind/theme.css";\n\n'}<span className="c">{'<Button className="w-full md:w-auto">'}</span>{'\n  Save\n'}<span className="c">{'</Button>'}</span></pre>
        </div>
      </Reveal>
      <Reveal className="lp-tile" delay={80}>
        <span className="lp-tile-icon"><LayoutDashboardIcon size={18} /></span>
        <h3>Blocks and layouts</h3>
        <p>Dashboards, auth, pricing, settings and docs layouts in <code>@vhyxui/blocks</code> — start from a page, not a blank file.</p>
        <div className="lp-tile-visual">
          <div className="mini-dash" aria-hidden="true">
            <aside><i /><i /><i /><i /></aside>
            <section><div className="card" /><div className="card" /><div className="card" /><div className="bars"><b /><b /><b /><b /><b /><b /><b /><b /></div></section>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function Showcase(): React.ReactElement {
  const [notify, setNotify] = useState(true);
  return (
    <div className="lp-showcase">
      <Reveal>
        <Card variant="outline" padding="lg">
          <Stack gap={3}>
            <Text weight="semibold">Buttons</Text>
            <HStack gap={2} wrap>
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Delete</Button>
              <Button loading>Saving</Button>
            </HStack>
          </Stack>
        </Card>
      </Reveal>
      <Reveal delay={60}>
        <Card variant="outline" padding="lg">
          <Stack gap={3}>
            <Text weight="semibold">Forms</Text>
            <TextField name="email" label="Email" type="email" placeholder="you@company.com" hint="We never share it." />
            <HStack gap={3} align="center">
              <Switch checked={notify} onCheckedChange={setNotify} aria-label="Email notifications" />
              <Text size="sm">Email notifications {notify ? 'on' : 'off'}</Text>
            </HStack>
          </Stack>
        </Card>
      </Reveal>
      <Reveal delay={120}>
        <Card variant="outline" padding="lg">
          <Stack gap={3}>
            <Text weight="semibold">Feedback</Text>
            <Alert variant="success" title="Changes saved">Your settings are live.</Alert>
            <HStack gap={2} wrap align="center">
              <Badge>Default</Badge>
              <Badge variant="success">Active</Badge>
              <Badge variant="warning">Pending</Badge>
              <Badge count={12} variant="danger" />
            </HStack>
            <Button size="sm" variant="outline" onClick={() => toast.info('Toasts are accessible live regions')}>
              Show a toast
            </Button>
          </Stack>
        </Card>
      </Reveal>
      <Reveal delay={180}>
        <Card variant="outline" padding="lg">
          <Stack gap={3}>
            <Text weight="semibold">Disclosure</Text>
            <Tabs defaultValue="overview" variant="pills" size="sm">
              <Tabs.List>
                <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                <Tabs.Trigger value="usage">Usage</Tabs.Trigger>
                <Tabs.Trigger value="api">API</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="overview"><Text size="sm" tone="muted">Arrow keys move between tabs.</Text></Tabs.Content>
              <Tabs.Content value="usage"><Text size="sm" tone="muted">Compound and shorthand APIs.</Text></Tabs.Content>
              <Tabs.Content value="api"><Text size="sm" tone="muted">Fully typed props.</Text></Tabs.Content>
            </Tabs>
            <Accordion
              items={[
                { value: 'a11y', title: 'Is it accessible?', content: 'Keyboard, focus and ARIA are built in and tested with axe.' },
                { value: 'rsc', title: 'Server Components?', content: 'Yes. Components ship with the use client directive.' },
              ]}
            />
          </Stack>
        </Card>
      </Reveal>
    </div>
  );
}

function AgentSection(): React.ReactElement {
  return (
    <div className="lp-split">
      <Reveal>
        <Stack gap={4}>
          <span className="lp-eyebrow">Agent contracts · powered by VhyxSeal</span>
          <h2 className="lp-h2">Your UI, readable by AI agents</h2>
          <p className="lp-sub">
            Every interactive VhyxUI component carries a contract: what it does, how risky it is, and whether a person must
            confirm. Agents read them from your page and its signed manifest, so a destructive action is never performed
            silently.
          </p>
          <pre className="lp-code" aria-label="Contract an agent sees for a delete button">{CONTRACT_EXAMPLE}</pre>
        </Stack>
      </Reveal>
      <Reveal delay={100}>
        {/* The player's header tabs switch between the two scenarios (a person, an agent). */}
        <VhyxChart
          source={AGENT_STORY}
          scenario={1}
          autoplay
          loop
          title="Delete a project"
          aria-label="How a person and an AI agent reach the same confirmation dialog"
        />
      </Reveal>
    </div>
  );
}

const FAMILY = [
  { lib: 'ui', name: 'VhyxUI', role: 'Components', text: 'Accessible React components with agent contracts built in.', href: '/', current: true },
  { lib: 'seal', name: 'VhyxSeal', role: 'Agent contracts', text: 'The contract layer that tells AI agents what your UI does — and when to ask a person.', href: VHYXSEAL, current: false },
  { lib: 'chart', name: 'VhyxChart', role: 'Diagrams', text: 'Text-defined diagrams that animate — in docs, READMEs, VS Code and React.', href: VHYXCHART, current: false },
] as const;

export default function Home() {
  return (
    <VhyxUIProvider>
      <SiteHeader
        brand="VhyxUI"
        mark={MARK}
        current="ui"
        family={{ ui: '/', seal: VHYXSEAL, chart: VHYXCHART }}
        nav={[
          { label: 'Features', href: '#features' },
          { label: 'Components', href: '#components' },
          { label: 'Agents', href: '#agents' },
          { label: 'Docs', href: DOCS },
          { label: 'Playground', href: PLAYGROUND },
        ]}
        github={GITHUB}
        getStarted={GET_STARTED}
      />

      <main id="vhyx-main">
        <section className="lp-hero">
          <div className="lp-aurora" aria-hidden="true"><span /><span /><span /></div>
          <div className="lp-inner lp-hero-grid">
            <div className="lp-hero-copy">
              <a className="lp-pill" href={PLAYGROUND}><b>New</b> Live playground with an agent console <ArrowRightIcon size={14} /></a>
              <h1 className="lp-title">
                Accessible React components that AI agents <span className="lp-gradient-text">understand</span>.
              </h1>
              <p className="lp-lead">
                Beautiful, keyboard-friendly components with motion built in — and a machine-readable contract on every
                interactive element, so AI agents know what is safe to click.
              </p>
              <div className="lp-actions">
                <Button size="lg" asChild><a href={GET_STARTED}>Get started</a></Button>
                <Button size="lg" variant="outline" asChild><a href={PLAYGROUND}>Open playground</a></Button>
              </div>
              <div className="lp-install">
                <span aria-hidden="true">$</span>
                <code>{INSTALL}</code>
                <button type="button" onClick={copyInstall}>Copy</button>
              </div>
            </div>
            <Reveal delay={150}>
              <AgentLens />
            </Reveal>
          </div>
        </section>

        <div className="lp-inner">
          <Reveal className="lp-stats">
            <div className="lp-stat"><strong><CountUp to={37} /></strong><span>components</span></div>
            <div className="lp-stat"><strong><CountUp to={500} /></strong><span>original icons</span></div>
            <div className="lp-stat"><strong><CountUp to={22} /></strong><span>blocks and layouts</span></div>
            <div className="lp-stat"><strong><CountUp to={0} /></strong><span>lines to add agent contracts</span></div>
          </Reveal>
        </div>

        <section id="features" className="lp-section">
          <div className="lp-inner">
            <Reveal className="lp-head">
              <span className="lp-eyebrow">Four layers, one install</span>
              <h2 className="lp-h2">Most libraries stop at visuals. VhyxUI ships all four.</h2>
              <p className="lp-sub">Visuals, accessibility, motion and agent contracts — designed together, so you don&apos;t bolt them on later.</p>
            </Reveal>
            <Bento />
          </div>
        </section>

        <section id="components" className="lp-section">
          <div className="lp-inner">
            <Reveal className="lp-head">
              <span className="lp-eyebrow">Live components</span>
              <h2 className="lp-h2">Real components, right here</h2>
              <p className="lp-sub">Everything below is live VhyxUI. Tab through it, toggle it, use a screen reader.</p>
            </Reveal>
            <Showcase />
            <Reveal className="lp-actions" delay={100}>
              <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Button variant="outline" asChild><a href={COMPONENTS}>Browse all components</a></Button>
                <Button variant="ghost" asChild><a href={ICONS}>See the 500 icons</a></Button>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="agents" className="lp-section">
          <div className="lp-inner">
            <AgentSection />
          </div>
        </section>

        <section className="lp-section">
          <div className="lp-inner">
            <Reveal className="lp-head lp-head--center">
              <div className="lp-mark" aria-hidden="true" />
              <h2 className="lp-h2">Part of the Vhyxara family</h2>
              <p className="lp-sub">Three libraries built to work together: components, the contracts agents read, and the diagrams that explain them.</p>
            </Reveal>
            <div className="lp-family-grid">
              {FAMILY.map((f, i) => (
                <Reveal key={f.lib} delay={i * 90}>
                  <a className="lp-fam" data-lib={f.lib} href={f.href} aria-current={f.current ? 'page' : undefined}>
                    <span className="lp-fam-name">{f.name}<small>{f.role}</small></span>
                    <p>{f.text}</p>
                    <span className="go">{f.current ? 'You are here' : `Visit ${f.name} →`}</span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="lp-section">
          <div className="lp-inner">
            <Reveal className="lp-cta">
              <h2 className="lp-h2">Build interfaces people and agents can trust</h2>
              <p className="lp-sub">Install VhyxUI and ship accessible components with agent contracts from day one.</p>
              <div className="lp-actions" style={{ justifyContent: 'center' }}>
                <Button size="lg" asChild><a href={GET_STARTED}>Read the docs</a></Button>
                <Button size="lg" variant="outline" asChild><a href={PLAYGROUND}>Open playground</a></Button>
                <Button size="lg" variant="ghost" asChild><a href={GITHUB}>Star on GitHub</a></Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <div className="lp-inner">
        <footer className="lp-footer">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 320 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontWeight: 700, color: 'var(--vhyx-color-text)', fontSize: 16 }}>
              <span style={{ color: 'var(--lp-brand)', display: 'inline-flex' }}>{MARK}</span>VhyxUI
            </span>
            <span>Accessible React components that AI agents understand. MIT licensed, by <a href={VHYXARA}>Vhyxara</a>.</span>
            <div className="lp-mark" aria-hidden="true" style={{ width: 120 }} />
          </div>
          <nav aria-label="Footer">
            <div><strong>Product</strong><a href={DOCS}>Documentation</a><a href={COMPONENTS}>Components</a><a href={BLOCKS}>Blocks &amp; layouts</a><a href={ICONS}>Icons</a><a href={PLAYGROUND}>Playground</a></div>
            <div><strong>Family</strong><a href={VHYXSEAL}>VhyxSeal</a><a href={VHYXCHART}>VhyxChart</a><a href={VHYXARA}>Vhyxara</a></div>
            <div><strong>Project</strong><a href={NPM}>npm</a><a href={GITHUB}>GitHub</a></div>
          </nav>
        </footer>
      </div>
    </VhyxUIProvider>
  );
}
