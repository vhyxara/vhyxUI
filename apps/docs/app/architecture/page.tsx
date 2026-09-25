'use client';

import React from 'react';
import { VhyxChart } from '@vhyxchart/react';
import { Text } from '@vhyxui/react';
import { PageHeader } from '../../components/PageHeader';
import { Section } from '../../components/Section';
import { CodeBlock } from '../../components/CodeBlockSimple';
import { PageNav } from '../../components/PageNav';

const PACKAGES = `---
title: VhyxUI package architecture
---
flowchart LR
  tokens[["@vhyxui/tokens<br/>CSS variables"]]:::muted
  tw["@vhyxui/tailwind<br/>preset + theme"]:::info
  core["@vhyxui/core<br/>contracts · Slot · errors"]
  seal[("@vhyxseal/react<br/>agent contracts")]:::accent
  react["@vhyxui/react<br/>components + primitives"]:::primary
  blocks["@vhyxui/blocks<br/>blocks + layouts"]:::success
  app([Your app])

  tokens --> react
  tokens -.-> tw
  seal --> core --> react --> blocks --> app
  react --> app
  tw -.-> app

scenario A component renders
  app -> blocks : <DashboardLayout>
  blocks -> react : Stack, Button, Table
  react is active
  core -> react : buttonContract
  seal -> core : defineContractTemplate
  react is done
  react -> app : accessible DOM + data-vhyx-contract
  app is done
  caption Humans get UI · agents get contracts
`;

const RENDER = `sequenceDiagram
  autonumber
  participant App
  participant P as VhyxUIProvider
  participant S as SealProvider
  participant B as Button
  App->>P: render
  P->>S: domain = window.location.hostname
  App->>+B: <Button intent>
  B->>S: registerContract()
  S-->>S: generateManifest()
  Note over S: /__agent__/manifest.json
  B-->>-App: <button data-vhyx-contract>
`;

export default function ArchitecturePage(): React.ReactElement {
  return (
    <div className="gs-layout">
      <main className="gs-content">
        <PageHeader stable={false} name="Architecture" description="How the VhyxUI packages fit together — drawn with VhyxChart, the animated diagram library from the same family. Press play, step, or scrub." tags={['Reference', 'VhyxChart']} />
        <Section id="packages" title="Packages">
          <VhyxChart source={PACKAGES} />
          <Text size="sm" tone="subtle">Small components live in @vhyxui/react; bigger compositions and page layouts live in @vhyxui/blocks and are built only from the public React API.</Text>
        </Section>
        <Section id="render" title="Render and agent contracts">
          <VhyxChart source={RENDER} />
          <CodeBlock language="md" filename="Write your own diagrams in Markdown" code={'```vhyx\n' + PACKAGES.split('\n').slice(3, 12).join('\n') + '\n```'} />
        </Section>
        <PageNav prev={{ title: 'Tailwind CSS', href: '/tailwind' }} next={{ title: 'Tokens', href: '/docs/tokens' }} />
      </main>
    </div>
  );
}
