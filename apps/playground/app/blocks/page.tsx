'use client';

import React, { useState } from 'react';
import { Avatar, Button, Grid, HStack, Input, Stack, Text, toast } from '@vhyxui/react';
import {
  AuthForm,
  AuthLayout,
  CTASection,
  DashboardLayout,
  DataTable,
  EmptyState,
  FeatureGrid,
  Hero,
  MarketingLayout,
  PricingTable,
  SettingsSection,
  SimpleForm,
  StatCard,
} from '@vhyxui/blocks';
import { TabbedPanel } from '@vhyxui/blocks';
import { PlaygroundHeader } from '../../components/PlaygroundHeader';

type Template = 'dashboard' | 'auth' | 'marketing' | 'settings' | 'empty';

const nav = [
  { label: 'Workspace', items: [
    { label: 'Overview', href: '#', active: true, icon: '◧' },
    { label: 'Customers', href: '#customers', icon: '☺', badge: 12 },
    { label: 'Reports', href: '#reports', icon: '▤' },
  ] },
  { label: 'Account', items: [{ label: 'Settings', href: '#settings', icon: '⚙' }] },
];

const customers = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  name: ['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Stark'][i % 6] + ` ${i + 1}`,
  plan: ['Starter', 'Team', 'Business'][i % 3] ?? 'Team',
  mrr: ((i * 173) % 5000) + 49,
}));

function Dashboard(): React.ReactElement {
  return (
    <DashboardLayout
      brand={<b>Acme</b>}
      nav={nav}
      header={<div style={{ flex: 1, maxWidth: 320 }}><Input placeholder="Search customers…" aria-label="Search" size="sm" /></div>}
      sidebarFooter={<HStack gap={2}><Avatar name="Ada Lovelace" size="sm" status="online" /><Text size="sm">Ada</Text></HStack>}
      title="Overview"
      description="Revenue and customers, last 30 days"
      actions={[{ label: 'Export', variant: 'outline' }, { label: 'New customer', onClick: () => toast.success('Customer created') }]}
    >
      <Grid minChildWidth="13rem">
        <StatCard label="MRR" value="$48,210" change="+12.5%" trend="up" hint="vs last month" />
        <StatCard label="Customers" value="1,284" change="+38" trend="up" />
        <StatCard label="Churn" value="1.8%" change="-0.4%" trend="down" invertTrend />
        <StatCard label="NPS" value="62" change="0" trend="flat" />
      </Grid>
      <DataTable
        columns={[{ key: 'name', header: 'Customer' }, { key: 'plan', header: 'Plan' }, { key: 'mrr', header: 'MRR ($)', align: 'end' }]}
        data={customers}
        searchKeys={['name', 'plan']}
        sortableKeys={['name', 'mrr']}
        pageSize={6}
      />
    </DashboardLayout>
  );
}

function Settings(): React.ReactElement {
  return (
    <DashboardLayout brand={<b>Acme</b>} nav={nav} title="Settings">
      <Stack gap={10}>
        <SettingsSection title="Profile" description="Shown to your team" footer={<Button size="sm">Save</Button>}>
          <SimpleForm fields={[{ name: 'name', label: 'Name', defaultValue: 'Ada Lovelace' }, { name: 'email', label: 'Email', type: 'email', defaultValue: 'ada@acme.dev' }]} onSubmit={() => { toast.success('Saved'); }} submitLabel="Update" />
        </SettingsSection>
        <SettingsSection title="Notifications" description="Where we reach you">
          <TabbedPanel items={[{ value: 'email', label: 'Email', content: <Text tone="subtle">Weekly digest</Text> }, { value: 'slack', label: 'Slack', content: <Text tone="subtle">Real-time alerts</Text> }]} />
        </SettingsSection>
        <SettingsSection title="Danger zone" tone="danger" description="Irreversible" footer={<Button variant="destructive" size="sm">Delete workspace</Button>}>
          <Text size="sm">This permanently deletes all data.</Text>
        </SettingsSection>
      </Stack>
    </DashboardLayout>
  );
}

function Marketing(): React.ReactElement {
  return (
    <MarketingLayout
      navbar={{ brand: <b>Acme</b>, links: [{ label: 'Product', href: '#', active: true }, { label: 'Pricing', href: '#pricing' }, { label: 'Docs', href: '#docs' }], actions: <Button size="sm">Sign up</Button> }}
      footer={{ brand: 'Acme', tagline: 'Ship faster.', columns: [{ title: 'Product', links: [{ label: 'Pricing', href: '#pricing' }] }, { title: 'Company', links: [{ label: 'About', href: '#about' }] }], legal: '© 2026 Acme Inc.' }}
    >
      <Hero eyebrow="New · Agent-ready UI" title="The fastest way from idea to product" description="Blocks and layouts built on accessible components." actions={[{ label: 'Start free' }, { label: 'Book a demo', variant: 'outline' }]} />
      <FeatureGrid title="Everything included" features={[{ icon: '⚡', title: 'Fast', description: 'Tree-shakeable, no runtime CSS-in-JS.' }, { icon: '♿', title: 'Accessible', description: 'axe-tested components.' }, { icon: '🤖', title: 'Agent-ready', description: 'VhyxSeal contracts built in.' }]} />
      <div id="pricing" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        <PricingTable plans={[{ name: 'Hobby', price: '$0', period: '/mo', features: ['1 project'], action: { label: 'Start' } }, { name: 'Pro', price: '$19', period: '/mo', features: ['Unlimited projects', 'Blocks'], action: { label: 'Upgrade' }, highlighted: true }, { name: 'Team', price: '$49', period: '/mo', features: ['SSO', 'Audit log'], action: { label: 'Contact' } }]} />
      </div>
      <CTASection title="Ready when you are" actions={[{ label: 'Create account' }]} />
    </MarketingLayout>
  );
}

const TEMPLATES: Record<Template, { label: string; render: () => React.ReactElement }> = {
  dashboard: { label: 'Dashboard', render: () => <Dashboard /> },
  settings: { label: 'Settings', render: () => <Settings /> },
  marketing: { label: 'Marketing', render: () => <Marketing /> },
  auth: { label: 'Auth', render: () => <AuthLayout variant="split" brand={<b>Acme</b>} aside={<Text size="lg" style={{ color: 'inherit' }}>“Shipped in a weekend.”</Text>}><AuthForm mode="sign-up" onSubmit={() => { toast.success('Account created'); }} /></AuthLayout> },
  empty: { label: 'Empty state', render: () => <div style={{ padding: 48 }}><EmptyState icon="📭" title="No projects yet" description="Create a project to get started." actions={[{ label: 'New project' }]} /></div> },
};

export default function BlocksPlayground(): React.ReactElement {
  const [template, setTemplate] = useState<Template>('dashboard');
  const [width, setWidth] = useState<'100%' | '768px' | '390px'>('100%');
  return (
    <div className="pg-root">
      <PlaygroundHeader />
      <Stack gap={4} padding={4}>
        <HStack justify="between" wrap gap={3}>
          <HStack gap={2} wrap role="tablist" aria-label="Template">
            {(Object.keys(TEMPLATES) as Template[]).map((t) => (
              <Button key={t} size="sm" variant={t === template ? 'primary' : 'ghost'} role="tab" aria-selected={t === template} onClick={() => setTemplate(t)}>
                {TEMPLATES[t].label}
              </Button>
            ))}
          </HStack>
          <HStack gap={1} role="group" aria-label="Viewport width">
            {(['100%', '768px', '390px'] as const).map((w) => (
              <Button key={w} size="xs" variant={w === width ? 'secondary' : 'ghost'} onClick={() => setWidth(w)}>{w === '100%' ? 'Desktop' : w === '768px' ? 'Tablet' : 'Mobile'}</Button>
            ))}
          </HStack>
        </HStack>
        <div style={{ width, maxWidth: '100%', margin: '0 auto', border: '1px solid var(--vhyx-color-border)', borderRadius: 'var(--vhyx-radius-lg)', overflow: 'hidden', height: '78vh', overflowY: 'auto', transition: 'width .25s ease' }}>
          {TEMPLATES[template].render()}
        </div>
      </Stack>
    </div>
  );
}
