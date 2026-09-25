'use client';

import React from 'react';
import { Button, Grid, Text, toast } from '@vhyxui/react';
import {
  AuthForm,
  ConfirmDialog,
  CTASection,
  DataTable,
  EmptyState,
  FAQ,
  FeatureGrid,
  Hero,
  PageHeader as BlockPageHeader,
  PricingTable,
  SettingsSection,
  SimpleForm,
  StatCard,
  TabbedPanel,
} from '@vhyxui/blocks';
import { PageHeader } from '../../components/PageHeader';
import { Section } from '../../components/Section';
import { ComponentExample } from '../../components/ComponentExample';
import { CodeBlock } from '../../components/CodeBlockSimple';
import { OnThisPage, type PageHeading } from '../../components/OnThisPage';
import { PageNav } from '../../components/PageNav';

const HEADINGS: ReadonlyArray<PageHeading> = [
  { id: 'install', text: 'Install', level: 2 },
  { id: 'app', text: 'App blocks', level: 2 },
  { id: 'forms', text: 'Forms', level: 2 },
  { id: 'data', text: 'Data', level: 2 },
  { id: 'marketing', text: 'Marketing', level: 2 },
];

const people = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: ['Ada', 'Grace', 'Alan', 'Linus', 'Margaret', 'Dennis', 'Barbara', 'Ken'][i % 8] + ` #${i + 1}`,
  role: ['Admin', 'Editor', 'Viewer'][i % 3] ?? 'Viewer',
  seats: (i * 7) % 40,
}));

export default function BlocksPage(): React.ReactElement {
  return (
    <div className="gs-layout">
      <main className="gs-content">
        <PageHeader stable={false}
          name="Blocks"
          description="Bigger components built only from @vhyxui/react primitives. Drop in a pricing table, an auth form, or a searchable data table in one line — every piece stays accessible and agent-readable."
          tags={['@vhyxui/blocks', 'New']}
        />

        <Section id="install" title="Install">
          <CodeBlock language="bash" code={`pnpm add @vhyxui/blocks @vhyxui/react @vhyxui/tokens`} />
          <CodeBlock language="tsx" code={`import '@vhyxui/tokens/index.css';
import '@vhyxui/react/style.css';
import '@vhyxui/blocks/style.css';

import { PricingTable, AuthForm, DataTable } from '@vhyxui/blocks';`} />
          <Text size="sm" tone="subtle">
            Links inside blocks default to <code>&lt;a&gt;</code>. Pass <code>linkAs={'{Link}'}</code> (Next.js, React Router) for client-side navigation.
          </Text>
        </Section>

        <Section id="app" title="App blocks">
          <ComponentExample label="PageHeader + StatCard" code={`<PageHeader title="Overview" description="Last 30 days"
  actions={[{ label: 'Export', variant: 'outline' }, { label: 'New report' }]} />
<Grid minChildWidth="12rem">
  <StatCard label="Revenue" value="$48,210" change="+12.5%" trend="up" hint="vs last month" />
  <StatCard label="Churn" value="1.8%" change="-0.4%" trend="down" invertTrend />
</Grid>`}>
            <div style={{ width: '100%', display: 'grid', gap: 'var(--vhyx-space-6)' }}>
              <BlockPageHeader title="Overview" description="Last 30 days" actions={[{ label: 'Export', variant: 'outline' }, { label: 'New report', onClick: () => toast.success('Report queued') }]} />
              <Grid minChildWidth="12rem">
                <StatCard label="Revenue" value="$48,210" change="+12.5%" trend="up" hint="vs last month" />
                <StatCard label="Active users" value="2,841" change="+4.1%" trend="up" />
                <StatCard label="Churn" value="1.8%" change="-0.4%" trend="down" invertTrend hint="lower is better" />
              </Grid>
            </div>
          </ComponentExample>
          <ComponentExample label="EmptyState" code={`<EmptyState icon="📭" title="No invoices yet" description="Create your first invoice to get paid faster."
  actions={[{ label: 'New invoice' }, { label: 'Import', variant: 'outline' }]} />`}>
            <div style={{ width: '100%' }}>
              <EmptyState icon="📭" title="No invoices yet" description="Create your first invoice to get paid faster." actions={[{ label: 'New invoice' }, { label: 'Import', variant: 'outline' }]} />
            </div>
          </ComponentExample>
          <ComponentExample label="ConfirmDialog — the 'are you sure?' pattern" code={`<ConfirmDialog destructive title="Delete project?" description="This cannot be undone."
  confirmLabel="Delete" trigger={<Button variant="destructive">Delete project</Button>}
  onConfirm={async () => { await api.delete(); }} />`}>
            <ConfirmDialog
              destructive
              title="Delete project?"
              description="All deployments and data will be permanently removed. This cannot be undone."
              confirmLabel="Delete"
              trigger={<Button variant="destructive">Delete project</Button>}
              onConfirm={() => new Promise<void>((r) => setTimeout(() => { toast.success('Project deleted'); r(); }, 700))}
            />
          </ComponentExample>
          <ComponentExample label="TabbedPanel — tabs from an array" code={`<TabbedPanel items={[{ value: 'a', label: 'Overview', content: … }, …]} />`}>
            <div style={{ width: '100%' }}>
              <TabbedPanel items={[
                { value: 'overview', label: 'Overview', content: <Text tone="subtle">Everything at a glance.</Text> },
                { value: 'activity', label: 'Activity', content: <Text tone="subtle">Recent events stream here.</Text> },
                { value: 'settings', label: 'Settings', content: <Text tone="subtle">Configure the workspace.</Text> },
              ]} />
            </div>
          </ComponentExample>
        </Section>

        <Section id="forms" title="Forms">
          <ComponentExample label="AuthForm — validation, loading and errors included" code={`<AuthForm mode="sign-in" onSubmit={({ email, password }) => signIn(email, password)}
  providers={[{ id: 'github', label: 'Continue with GitHub', onClick: gh }]}
  forgotPassword={<a href="/reset">Forgot password?</a>} />`}>
            <AuthForm
              onSubmit={() => new Promise((_, reject) => setTimeout(() => reject(new Error('Demo: wrong password')), 600))}
              providers={[{ id: 'github', label: 'Continue with GitHub', onClick: () => toast.info('GitHub OAuth (demo)') }]}
              forgotPassword={<a href="#reset">Forgot password?</a>}
              footer={<>No account? <a href="#signup">Sign up</a></>}
            />
          </ComponentExample>
          <ComponentExample label="SimpleForm — a validated form from a field list" code={`<SimpleForm
  fields={[
    { name: 'email', label: 'Work email', type: 'email', required: true },
    { name: 'team', label: 'Team size', type: 'select', options: [...] },
    { name: 'message', label: 'Message', type: 'textarea' },
    { name: 'terms', label: 'I agree to the terms', type: 'checkbox', required: true },
  ]}
  onSubmit={save} successMessage="Thanks! We'll be in touch." />`}>
            <div style={{ width: '100%', maxWidth: '28rem' }}>
              <SimpleForm
                fields={[
                  { name: 'email', label: 'Work email', type: 'email', required: true },
                  { name: 'team', label: 'Team size', type: 'select', placeholder: 'Choose…', options: [{ label: '1–10', value: 's' }, { label: '11–50', value: 'm' }, { label: '50+', value: 'l' }] },
                  { name: 'message', label: 'Message', type: 'textarea' },
                  { name: 'terms', label: 'I agree to the terms', type: 'checkbox', required: true },
                ]}
                onSubmit={() => new Promise((r) => setTimeout(r, 500))}
                successMessage="Thanks! We'll be in touch."
              />
            </div>
          </ComponentExample>
          <ComponentExample label="SettingsSection" code={`<SettingsSection title="Profile" description="Shown on your public page" footer={<Button>Save</Button>}>…</SettingsSection>`}>
            <div style={{ width: '100%' }}>
              <SettingsSection title="Danger zone" description="Irreversible actions" tone="danger" footer={<Button variant="destructive" size="sm">Delete workspace</Button>}>
                <Text size="sm">Deleting the workspace removes all projects, members and billing history.</Text>
              </SettingsSection>
            </div>
          </ComponentExample>
        </Section>

        <Section id="data" title="Data">
          <ComponentExample label="DataTable — search, sort, paginate (client-side)" code={`<DataTable columns={columns} data={people} searchKeys={['name', 'role']} sortableKeys={['name', 'seats']} pageSize={5} />`}>
            <div style={{ width: '100%' }}>
              <DataTable
                columns={[{ key: 'name', header: 'Name' }, { key: 'role', header: 'Role' }, { key: 'seats', header: 'Seats', align: 'end' }]}
                data={people}
                searchKeys={['name', 'role']}
                sortableKeys={['name', 'seats']}
                pageSize={5}
                toolbar={<Button size="sm" variant="outline">Export CSV</Button>}
              />
            </div>
          </ComponentExample>
        </Section>

        <Section id="marketing" title="Marketing">
          <ComponentExample label="Hero" code={`<Hero eyebrow="v0.4 is out" title="Build UIs humans and AI agents both understand"
  description="…" actions={[{ label: 'Get started', href: '/getting-started' }, { label: 'GitHub', href: '…', variant: 'outline' }]} />`}>
            <div style={{ width: '100%' }}>
              <Hero eyebrow="v0.4 is out" title="Build UIs humans and AI agents both understand" description="Accessible components, Tailwind-friendly styling, and machine-readable contracts in one library." actions={[{ label: 'Get started', href: '/getting-started' }, { label: 'Blocks', href: '/blocks', variant: 'outline' }]} />
            </div>
          </ComponentExample>
          <ComponentExample label="FeatureGrid" code={`<FeatureGrid title="Why VhyxUI" features={[{ icon: '⚡', title: 'Fast', description: '…' }]} />`}>
            <div style={{ width: '100%' }}>
              <FeatureGrid title="Why VhyxUI" features={[
                { icon: '♿', title: 'Accessible', description: 'Keyboard, focus and screen-reader support are built in and tested with axe.' },
                { icon: '🎨', title: 'Your styles', description: 'CSS variables, cascade layers and a Tailwind preset — override anything.' },
                { icon: '🤖', title: 'Agent-ready', description: 'Every component publishes a VhyxSeal contract describing what it does.' },
              ]} />
            </div>
          </ComponentExample>
          <ComponentExample label="PricingTable" code={`<PricingTable plans={[…]} />`}>
            <div style={{ width: '100%' }}>
              <PricingTable plans={[
                { name: 'Free', price: '$0', period: '/mo', description: 'For side projects', features: ['All components', 'Community support'], action: { label: 'Start free' } },
                { name: 'Pro', price: '$19', period: '/mo', description: 'For teams shipping fast', features: ['Everything in Free', 'All blocks & layouts', 'Priority support'], action: { label: 'Start trial' }, highlighted: true },
                { name: 'Enterprise', price: 'Custom', description: 'Security & compliance', features: ['SSO', 'Audit logs', 'Dedicated support'], action: { label: 'Contact sales' } },
              ]} />
            </div>
          </ComponentExample>
          <ComponentExample label="FAQ and CTASection" code={`<FAQ items={[{ question: '…', answer: '…' }]} />
<CTASection title="Ready to build?" actions={[{ label: 'Get started', href: '/getting-started' }]} />`}>
            <Grid columns={1} style={{ width: '100%' }}>
              <FAQ items={[{ question: 'Is VhyxUI free?', answer: 'Yes, MIT licensed.' }, { question: 'Does it work with Tailwind?', answer: 'Yes — see the Tailwind guide.' }]} />
              <CTASection title="Ready to build?" description="Install in a minute, ship today." actions={[{ label: 'Get started', href: '/getting-started' }]} />
            </Grid>
          </ComponentExample>
        </Section>

        <PageNav prev={{ title: 'Data display', href: '/components/data-display' }} next={{ title: 'Layouts', href: '/layouts' }} />
      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
