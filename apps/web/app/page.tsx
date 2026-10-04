'use client';

import { AccessibilityIcon, BotIcon, PaletteIcon, WavesIcon } from '@vhyxui/icons';
import React, { useState } from 'react';
import { VhyxChart } from '@vhyxchart/react';
import {
  Accordion,
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Heading,
  HStack,
  Stack,
  Switch,
  Tabs,
  Text,
  TextField,
  VhyxUIProvider,
  toast,
} from '@vhyxui/react';
import { CTASection, FeatureGrid, Hero, MarketingLayout } from '@vhyxui/blocks';
import { AGENT_STORY } from '../components/diagram';
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

const TAILWIND_EXAMPLE = `@import "tailwindcss";
@import "@vhyxui/tailwind/theme.css";
@import "@vhyxui/tokens/tokens.css";
@import "@vhyxui/react/style.css";

<Button className="w-full md:w-auto">Save</Button>
<div className="bg-surface text-foreground border-border">…</div>`;

function copyInstall(): void {
  void navigator.clipboard?.writeText(INSTALL).then(
    () => toast.success('Install command copied'),
    () => toast.danger('Could not copy — select the command instead'),
  );
}

function Showcase(): React.ReactElement {
  const [notify, setNotify] = useState(true);
  return (
    <div className="showcase">
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

      <Card variant="outline" padding="lg">
        <Stack gap={3}>
          <Text weight="semibold">Disclosure</Text>
          <Tabs defaultValue="overview">
            <Tabs.List>
              <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
              <Tabs.Trigger value="usage">Usage</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="overview"><Text size="sm" tone="muted">Arrow keys move between tabs.</Text></Tabs.Content>
            <Tabs.Content value="usage"><Text size="sm" tone="muted">Compound and shorthand APIs.</Text></Tabs.Content>
          </Tabs>
          <Accordion
            items={[
              { value: 'a11y', title: 'Is it accessible?', content: 'Keyboard, focus and ARIA are built in and tested with axe.' },
              { value: 'rsc', title: 'Server Components?', content: 'Yes. Components ship with the use client directive.' },
            ]}
          />
        </Stack>
      </Card>
    </div>
  );
}

function AgentSection(): React.ReactElement {
  const [scenario, setScenario] = useState(1);
  return (
    <section id="agents" className="section section--tint">
      <Container size="xl">
        <div className="split">
          <Stack gap={4}>
            <div className="tag"><Badge variant="info">Built-in agent contracts</Badge></div>
            <Heading level={2}>Your UI, readable by AI agents</Heading>
            <Text tone="muted">
              Every interactive VhyxUI component carries a VhyxSeal contract: what it does, how risky it is, and whether a
              person must confirm. Agents read these contracts from your page and its manifest, so a destructive action
              can never be performed silently.
            </Text>
            <pre className="code" aria-label="Contract an agent sees for a delete button">{CONTRACT_EXAMPLE}</pre>
            <Text size="sm" tone="subtle">
              Powered by <a href={VHYXSEAL}>VhyxSeal</a> · diagram by <a href={VHYXCHART}>VhyxChart</a>
            </Text>
          </Stack>
          <Card variant="elevated" padding="lg">
            <Stack gap={3}>
              <HStack gap={2} wrap role="tablist" aria-label="Who performs the action">
                {['A person clicks', 'An agent tries the same action'].map((label, i) => (
                  <Button
                    key={label}
                    size="sm"
                    role="tab"
                    aria-selected={scenario === i}
                    variant={scenario === i ? 'primary' : 'ghost'}
                    onClick={() => setScenario(i)}
                    contract={{ id: 'agent-story', intent: 'apply-filter', description: 'Switch the diagram scenario' }}
                  >
                    {label}
                  </Button>
                ))}
              </HStack>
              <VhyxChart key={scenario} source={AGENT_STORY} scenario={scenario} autoplay loop controls aria-label="How a person and an AI agent reach the same confirmation dialog" />
            </Stack>
          </Card>
        </div>
      </Container>
    </section>
  );
}

export default function Home() {
  return (
    <VhyxUIProvider theme="system">
      <MarketingLayout
        navbar={{
          brand: <b>VhyxUI</b>,
          links: [
            { label: 'Components', href: '#components' },
            { label: 'Agents', href: '#agents' },
            { label: 'Tailwind', href: '#tailwind' },
            { label: 'Docs', href: DOCS, external: true },
            { label: 'Playground', href: PLAYGROUND, external: true },
            { label: 'GitHub', href: GITHUB, external: true },
          ],
          actions: (
            <Button size="sm" asChild contract={{ id: 'get-started', intent: 'navigate', description: 'Open the VhyxUI getting started guide' }}>
              <a href={GET_STARTED}>Get started</a>
            </Button>
          ),
        }}
        footer={{
          brand: 'VhyxUI',
          tagline: <>Accessible React components that AI agents understand. MIT licensed, by <a href={VHYXARA} className="brand-link">Vhyxara</a>.</>,
          columns: [
            { title: 'Product', links: [{ label: 'Documentation', href: DOCS }, { label: 'Components', href: COMPONENTS }, { label: 'Blocks & layouts', href: BLOCKS }, { label: 'Icons', href: ICONS }, { label: 'Playground', href: PLAYGROUND }] },
            { title: 'Project', links: [{ label: 'npm', href: NPM }, { label: 'GitHub', href: GITHUB }] },
            { title: 'Family', links: [{ label: 'VhyxSeal — agent contracts', href: VHYXSEAL }, { label: 'VhyxChart — animated diagrams', href: VHYXCHART }] },
          ],
          legal: <>© 2026 <a href={VHYXARA} className="brand-link">Vhyxara</a></>,
        }}
      >
        <Hero
          eyebrow="React 18 & 19 · Tailwind v3/v4 · MIT"
          title="Accessible React components that AI agents understand."
          description="Beautiful, keyboard-friendly components with motion built in — and a machine-readable contract on every interactive element, so AI agents know what is safe to click."
          actions={[
            { label: 'Get started', href: GET_STARTED },
            { label: 'Open playground', href: PLAYGROUND, variant: 'outline' },
          ]}
        />

        <Container size="md">
          <div className="install">
              <pre className="code">{INSTALL}</pre>
              <Button variant="outline" onClick={copyInstall} contract={{ id: 'copy-install', intent: 'copy-text', description: 'Copy the npm install command' }}>
                Copy
              </Button>
            </div>
        </Container>

        <section id="components" className="section">
          <Container size="xl">
            <div className="section-head">
              <Heading level={2}>Real components, right here</Heading>
              <Text tone="muted">Everything below is live VhyxUI. Tab through it, toggle it, use a screen reader.</Text>
            </div>
            <Showcase />
          </Container>
        </section>

        <FeatureGrid
          title="Four layers, one install"
          description="Most libraries stop at visuals. VhyxUI ships all four layers together."
          features={[
            { icon: <PaletteIcon />, title: 'Visual', description: 'CSS Modules on design tokens. Light and dark themes. Your CSS and Tailwind utilities always win.' },
            { icon: <AccessibilityIcon />, title: 'Accessible', description: 'Keyboard, focus management, ARIA and reduced motion — tested with axe on every component.' },
            { icon: <WavesIcon />, title: 'Motion', description: 'Duration and easing tokens give every state change the same calm, consistent feel.' },
            { icon: <BotIcon />, title: 'Agent contracts', description: 'Each interactive component declares its intent and risk, so AI agents act safely.' },
          ]}
        />

        <AgentSection />

        <section id="tailwind" className="section">
          <Container size="xl">
            <div className="split">
              <Stack gap={4}>
                <Heading level={2}>Plays well with Tailwind</Heading>
                <Text tone="muted">
                  Use VhyxUI with plain CSS, Tailwind v3 or Tailwind v4. The preset maps utilities like
                  <code> bg-accent</code> and <code>text-foreground</code> to VhyxUI tokens, and component styles live in
                  cascade layers — so your utilities override them without <code>!important</code>.
                </Text>
                <Text size="sm" tone="subtle">Plus ready-made blocks and layouts in <code>@vhyxui/blocks</code>: dashboards, auth, pricing, docs.</Text>
              </Stack>
              <pre className="code">{TAILWIND_EXAMPLE}</pre>
            </div>
          </Container>
        </section>

        <section className="section section--tint">
          <Container size="xl">
            <div className="section-head">
              <Heading level={2}>Part of the <a href={VHYXARA} className="brand-link">Vhyxara</a> family</Heading>
              <Text tone="muted">Three libraries built to work together.</Text>
            </div>
            <div className="family">
              {[
                { name: 'VhyxUI', role: 'Components', text: 'Accessible React components with agent contracts built in.', href: DOCS },
                { name: 'VhyxSeal', role: 'Agents', text: 'The contract layer that tells AI agents what your UI does.', href: VHYXSEAL },
                { name: 'VhyxChart', role: 'Diagrams', text: 'Text-defined diagrams that animate — in docs, GitHub and VS Code.', href: VHYXCHART },
              ].map((p) => (
                <Card key={p.name} variant="outline" padding="lg">
                  <Stack gap={2}>
                    <HStack gap={2} align="center"><Text weight="semibold">{p.name}</Text><Badge>{p.role}</Badge></HStack>
                    <Text size="sm" tone="muted">{p.text}</Text>
                    <Text size="sm"><a href={p.href}>Learn more →</a></Text>
                  </Stack>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        <Container size="xl" style={{ paddingBlock: 'var(--vhyx-space-16)' }}>
          <CTASection
            title="Build interfaces people and agents can trust"
            description="Install VhyxUI and ship accessible components with agent contracts from day one."
            actions={[
              { label: 'Read the docs', href: GET_STARTED },
              { label: 'Open playground', href: PLAYGROUND, variant: 'outline' },
              { label: 'Star on GitHub', href: GITHUB, variant: 'ghost' },
            ]}
          />
        </Container>
      </MarketingLayout>
    </VhyxUIProvider>
  );
}
