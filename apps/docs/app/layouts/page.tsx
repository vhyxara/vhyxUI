'use client';

import React from 'react';
import { Avatar, Badge, Grid, Input, Text } from '@vhyxui/react';
import { AppShell, AuthForm, AuthLayout, DashboardLayout, DocsLayout, Hero, MarketingLayout, StatCard } from '@vhyxui/blocks';
import { PageHeader } from '../../components/PageHeader';
import { Section } from '../../components/Section';
import { CodeBlock } from '../../components/CodeBlockSimple';
import { OnThisPage, type PageHeading } from '../../components/OnThisPage';
import { PageNav } from '../../components/PageNav';

const HEADINGS: ReadonlyArray<PageHeading> = [
  { id: 'dashboard', text: 'DashboardLayout', level: 2 },
  { id: 'appshell', text: 'AppShell', level: 2 },
  { id: 'auth', text: 'AuthLayout', level: 2 },
  { id: 'marketing', text: 'MarketingLayout', level: 2 },
  { id: 'docs', text: 'DocsLayout', level: 2 },
];

const nav = [
  { label: 'Workspace', items: [
    { label: 'Overview', href: '#', active: true, icon: '◧' },
    { label: 'Projects', href: '#projects', icon: '▤', badge: 4 },
    { label: 'Team', href: '#team', icon: '☺' },
  ] },
  { label: 'Settings', items: [{ label: 'Billing', href: '#billing', icon: '$' }] },
];

/** Renders a full-page layout inside a scaled frame so it fits in the docs column. */
function Frame({ children, height = 460 }: { children: React.ReactNode; height?: number }): React.ReactElement {
  return (
    <div style={{ border: '1px solid var(--vhyx-color-border)', borderRadius: 'var(--vhyx-radius-lg)', overflow: 'hidden', height }}>
      <div style={{ transform: 'scale(0.66)', transformOrigin: 'top left', width: '151.5%', height: `${height / 0.66}px`, overflow: 'hidden', pointerEvents: 'auto' }}>
        {children}
      </div>
    </div>
  );
}

export default function LayoutsPage(): React.ReactElement {
  return (
    <div className="gs-layout">
      <main className="gs-content">
        <PageHeader stable={false} name="Layouts" description="Prebuilt, responsive page frames. Pick one, pass your navigation, and put your content inside — sidebars collapse into drawers on mobile automatically." tags={['@vhyxui/blocks/layouts', 'New']} />

        <Section id="dashboard" title="DashboardLayout" description="AppShell + PageHeader + consistent spacing.">
          <Frame>
            <DashboardLayout brand={<b>Acme</b>} nav={nav} header={<div style={{ maxWidth: 280, flex: 1 }}><Input placeholder="Search…" aria-label="Search" size="sm" /></div>} title="Overview" description="Last 30 days" actions={[{ label: 'New report' }]} sidebarFooter={<Avatar name="Ada Lovelace" size="sm" />}>
              <Grid minChildWidth="11rem">
                <StatCard label="Revenue" value="$48k" change="+12%" trend="up" />
                <StatCard label="Users" value="2,841" change="+4%" trend="up" />
                <StatCard label="Churn" value="1.8%" change="-0.4%" trend="down" invertTrend />
              </Grid>
            </DashboardLayout>
          </Frame>
          <CodeBlock language="tsx" code={`import { DashboardLayout } from '@vhyxui/blocks/layouts';

<DashboardLayout brand="Acme" nav={nav} linkAs={Link} title="Overview" actions={[{ label: 'New report' }]}>
  <Grid minChildWidth="11rem">{stats}</Grid>
</DashboardLayout>`} />
        </Section>

        <Section id="appshell" title="AppShell" description="Sticky sidebar + header + scrollable main. Icon-only with collapsed.">
          <Frame height={320}>
            <AppShell brand={<b>A</b>} nav={nav} collapsed header={<Badge variant="info">collapsed</Badge>}>
              <Text>Your page content.</Text>
            </AppShell>
          </Frame>
        </Section>

        <Section id="auth" title="AuthLayout">
          <Frame>
            <AuthLayout variant="split" brand={<b>Acme</b>} aside={<Text size="lg" style={{ color: 'inherit' }}>“We shipped our dashboard in a weekend.”</Text>} footer="By continuing you agree to the Terms.">
              <AuthForm onSubmit={() => undefined} />
            </AuthLayout>
          </Frame>
        </Section>

        <Section id="marketing" title="MarketingLayout">
          <Frame>
            <MarketingLayout navbar={{ brand: <b>Acme</b>, links: [{ label: 'Product', href: '#', active: true }, { label: 'Pricing', href: '#p' }] }} footer={{ brand: 'Acme', columns: [{ title: 'Company', links: [{ label: 'About', href: '#a' }] }], legal: '© 2026 Acme' }}>
              <Hero title="Launch pages in minutes" description="Navbar, sections and footer — already responsive." actions={[{ label: 'Start' }]} />
            </MarketingLayout>
          </Frame>
        </Section>

        <Section id="docs" title="DocsLayout">
          <Frame>
            <DocsLayout navbar={{ brand: <b>Docs</b> }} nav={[{ label: 'Guide', items: [{ label: 'Introduction', href: '#', active: true }, { label: 'Install', href: '#i' }] }]} toc={[{ id: 'a', label: 'Overview' }, { id: 'b', label: 'Details', level: 3 }]}>
              <Text>Three columns: navigation, content, table of contents.</Text>
            </DocsLayout>
          </Frame>
        </Section>

        <PageNav prev={{ title: 'Blocks', href: '/blocks' }} next={{ title: 'Tailwind CSS', href: '/tailwind' }} />
      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
