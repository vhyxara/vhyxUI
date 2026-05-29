'use client';

import React, { useState } from 'react';
import { Tabs } from '@vhyxui/react';
import { PropsPanel } from './PropsPanel';
import { ContractPanel } from './ContractPanel';
import { TokensPanel } from './TokensPanel';
import { ThemePanel } from './ThemePanel';
import type { ComponentDef } from './component-defs';

interface ControlPanelProps {
  def: ComponentDef;
  props: Record<string, unknown>;
  onPropChange: (key: string, value: unknown) => void;
  onReset: () => void;
  themeOverrides: Record<string, string>;
  onThemeOverridesChange: (overrides: Record<string, string>) => void;
}

export function ControlPanel({
  def,
  props,
  onPropChange,
  onReset,
  themeOverrides,
  onThemeOverridesChange,
}: ControlPanelProps): React.ReactElement {
  const [tab, setTab] = useState('props');

  return (
    <div className="pg-control-panel">
      <Tabs value={tab} onValueChange={setTab} variant="underline" size="sm">
        <Tabs.List>
          <Tabs.Trigger value="props">Props</Tabs.Trigger>
          <Tabs.Trigger value="contract">Contract</Tabs.Trigger>
          <Tabs.Trigger value="tokens">Tokens</Tabs.Trigger>
          <Tabs.Trigger value="theme">Theme</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="props">
          <PropsPanel def={def} props={props} onPropChange={onPropChange} onReset={onReset} />
        </Tabs.Content>
        <Tabs.Content value="contract">
          <ContractPanel def={def} props={props} />
        </Tabs.Content>
        <Tabs.Content value="tokens">
          <TokensPanel def={def} />
        </Tabs.Content>
        <Tabs.Content value="theme">
          <ThemePanel overrides={themeOverrides} onChange={onThemeOverridesChange} />
        </Tabs.Content>
      </Tabs>
    </div>
  );
}
