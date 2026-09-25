'use client';

import React, { useState } from 'react';
import { Accordion, Avatar, AvatarGroup, Badge, Button, HStack, Skeleton, Stack, Table, Text } from '@vhyxui/react';
import { tableContract, accordionContract } from '@vhyxui/core';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlockSimple';
import { OnThisPage, type PageHeading } from '../../../components/OnThisPage';
import { PageNav } from '../../../components/PageNav';

const HEADINGS: ReadonlyArray<PageHeading> = [
  { id: 'table', text: 'Table', level: 2 },
  { id: 'accordion', text: 'Accordion', level: 2 },
  { id: 'avatar', text: 'Avatar', level: 2 },
  { id: 'skeleton', text: 'Skeleton', level: 2 },
  { id: 'contracts', text: 'Agent contracts', level: 2 },
];

const customers = [
  { id: 1, name: 'Acme Corp', plan: 'Business', mrr: '$4,200', status: 'active' },
  { id: 2, name: 'Globex', plan: 'Team', mrr: '$890', status: 'trial' },
  { id: 3, name: 'Initech', plan: 'Starter', mrr: '$49', status: 'past due' },
];

export default function DataDisplayPage(): React.ReactElement {
  const [loading, setLoading] = useState(true);
  return (
    <div className="gs-layout">
      <main className="gs-content">
        <PageHeader stable={false} name="Data display" description="Table, Accordion, Avatar and Skeleton — each has a one-line shorthand API and a compound API when you need full control." tags={['Display', 'New', 'VhyxSeal']} />

        <Section id="table" title="Table">
          <ComponentExample label="columns + data shorthand" code={`<Table
  caption="Customers"
  columns={[
    { key: 'name', header: 'Customer' },
    { key: 'plan', header: 'Plan' },
    { key: 'mrr', header: 'MRR', align: 'end' },
    { key: 'status', header: 'Status', cell: (row) => <Badge>{row.status}</Badge> },
  ]}
  data={customers}
/>`}>
            <div style={{ width: '100%' }}>
              <Table
                caption="Customers"
                columns={[
                  { key: 'name', header: 'Customer' },
                  { key: 'plan', header: 'Plan' },
                  { key: 'mrr', header: 'MRR', align: 'end' },
                  {
                    key: 'status',
                    header: 'Status',
                    cell: (row) => (
                      <Badge variant={row['status'] === 'active' ? 'success' : row['status'] === 'trial' ? 'info' : 'danger'}>{String(row['status'])}</Badge>
                    ),
                  },
                ]}
                data={customers}
              />
            </div>
          </ComponentExample>
          <Text size="sm" tone="subtle">Need search, sorting and pagination? Use <code>DataTable</code> from <a href="/blocks">@vhyxui/blocks</a>.</Text>
        </Section>

        <Section id="accordion" title="Accordion">
          <ComponentExample label="Built on native details/summary — accessible before hydration" code={`<Accordion items={[
  { value: 'ship', title: 'Do you ship worldwide?', content: 'Yes, to 120+ countries.' },
  { value: 'return', title: 'What is the return policy?', content: '30 days, no questions.' },
]} />`}>
            <div style={{ width: '100%', maxWidth: '32rem' }}>
              <Accordion
                defaultValue={['ship']}
                items={[
                  { value: 'ship', title: 'Do you ship worldwide?', content: 'Yes — to more than 120 countries, with tracking.' },
                  { value: 'return', title: 'What is the return policy?', content: '30 days, no questions asked.' },
                  { value: 'agents', title: 'Can AI agents use this?', content: 'Yes. Every Accordion carries a VhyxSeal contract (intent: toggle-section, safety: low).' },
                ]}
              />
            </div>
          </ComponentExample>
        </Section>

        <Section id="avatar" title="Avatar">
          <ComponentExample label="Image, initials fallback, presence and groups" code={`<Avatar name="Ada Lovelace" status="online" />
<AvatarGroup max={3}>{people.map((p) => <Avatar key={p} name={p} />)}</AvatarGroup>`}>
            <HStack gap={6} wrap>
              <HStack gap={2}>
                <Avatar name="Ada Lovelace" size="sm" />
                <Avatar name="Grace Hopper" status="online" />
                <Avatar name="Alan Turing" size="lg" status="busy" shape="square" />
              </HStack>
              <AvatarGroup max={3}>
                {['Ada Lovelace', 'Grace Hopper', 'Alan Turing', 'Linus Torvalds', 'Margaret Hamilton'].map((n) => <Avatar key={n} name={n} />)}
              </AvatarGroup>
            </HStack>
          </ComponentExample>
        </Section>

        <Section id="skeleton" title="Skeleton">
          <ComponentExample label="Loading placeholders (respects reduced motion)" code={`<Skeleton variant="circle" width={40} height={40} />
<Skeleton variant="text" lines={3} />`}>
            <Stack gap={3} style={{ width: '100%', maxWidth: '24rem' }} aria-busy={loading}>
              {loading ? (
                <HStack gap={3} align="start">
                  <Skeleton variant="circle" width={40} height={40} />
                  <div style={{ flex: 1 }}><Skeleton variant="text" lines={3} /></div>
                </HStack>
              ) : (
                <HStack gap={3} align="start"><Avatar name="Grace Hopper" /><Text size="sm">It&apos;s easier to ask forgiveness than it is to get permission.</Text></HStack>
              )}
              <Button size="sm" variant="outline" onClick={() => setLoading((l) => !l)}>{loading ? 'Finish loading' : 'Show skeleton'}</Button>
            </Stack>
          </ComponentExample>
        </Section>

        <Section id="contracts" title="Agent contracts" description="Contracts shipped with Table and Accordion.">
          <CodeBlock language="json" filename="tableContract" code={JSON.stringify(tableContract, null, 2)} />
          <CodeBlock language="json" filename="accordionContract" code={JSON.stringify(accordionContract, null, 2)} />
        </Section>

        <PageNav prev={{ title: 'Typography', href: '/components/typography' }} next={{ title: 'Blocks', href: '/blocks' }} />
      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
