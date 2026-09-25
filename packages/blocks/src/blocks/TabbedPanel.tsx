import React from 'react';
import { Tabs } from '@vhyxui/react';

/** One tab in TabbedPanel. */
export interface TabItem {
  value: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

/** Props for TabbedPanel. */
export interface TabbedPanelProps {
  items: TabItem[];
  /** Initially selected tab. Defaults to the first item. */
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'enclosed';
}

/**
 * TabbedPanel — Tabs from an array. No compound components to wire up.
 * @example
 * <TabbedPanel items={[{ value: 'code', label: 'Code', content: <Code/> }, { value: 'preview', label: 'Preview', content: <Preview/> }]} />
 */
export function TabbedPanel({ items, defaultValue, value, onValueChange, variant }: TabbedPanelProps): React.ReactElement {
  const initial = defaultValue ?? items[0]?.value ?? '';
  return (
    <Tabs
      {...(value !== undefined ? { value } : { defaultValue: initial })}
      {...(onValueChange ? { onValueChange } : {})}
      {...(variant ? { variant } : {})}
    >
      <Tabs.List>
        {items.map((item) => (
          <Tabs.Trigger key={item.value} value={item.value} disabled={item.disabled ?? false}>
            {item.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {items.map((item) => (
        <Tabs.Content key={item.value} value={item.value}>
          {item.content}
        </Tabs.Content>
      ))}
    </Tabs>
  );
}
