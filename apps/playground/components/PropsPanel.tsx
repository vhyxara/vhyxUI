'use client';

import React from 'react';
import { Switch, Select, Input, Button } from '@vhyxui/react';
import type { ComponentDef } from './component-defs';

interface PropsPanelProps {
  def: ComponentDef;
  props: Record<string, unknown>;
  onPropChange: (key: string, value: unknown) => void;
  onReset: () => void;
}

export function PropsPanel({ def, props, onPropChange, onReset }: PropsPanelProps): React.ReactElement {
  if (def.controls.length === 0) {
    return (
      <div className="pg-panel-empty">
        <p>This component has no configurable props in the playground.</p>
      </div>
    );
  }

  return (
    <div className="pg-props-panel">
      {def.controls.map((control) => {
        const value = props[control.key];
        const isDefault = value === def.defaultProps[control.key];

        return (
          <div key={control.key} className="pg-prop-row">
            <div className="pg-prop-meta">
              <span className="pg-prop-name">{control.key}</span>
              {!isDefault && <span className="pg-prop-changed" aria-label="Modified">•</span>}
            </div>
            {control.type === 'switch' && (
              <div className="pg-prop-control-row">
                <Switch
                  size="sm"
                  checked={Boolean(value)}
                  onCheckedChange={(v) => { onPropChange(control.key, v); }}
                  aria-label={control.label}
                />
                <span className="pg-prop-value">{String(value)}</span>
              </div>
            )}
            {control.type === 'select' && control.options && (
              <Select
                value={String(value)}
                onValueChange={(v) => { onPropChange(control.key, v); }}
                size="sm"
                style={{ width: '100%' }}
              >
                <Select.Trigger />
                <Select.Content>
                  {control.options.map((opt) => (
                    <Select.Item key={opt} value={opt}>{opt}</Select.Item>
                  ))}
                </Select.Content>
              </Select>
            )}
            {control.type === 'input' && (
              <Input
                size="sm"
                value={String(value ?? '')}
                onChange={(e) => { onPropChange(control.key, e.target.value); }}
                aria-label={control.label}
                style={{ width: '100%' }}
              />
            )}
            {control.type === 'number' && (
              <input
                type="number"
                className="pg-prop-number-input"
                value={String(value ?? 0)}
                onChange={(e) => { onPropChange(control.key, Number(e.target.value)); }}
                aria-label={control.label}
              />
            )}
          </div>
        );
      })}
      <div className="pg-props-footer">
        <Button variant="outline" size="sm" onClick={onReset}>Reset all</Button>
      </div>
    </div>
  );
}
