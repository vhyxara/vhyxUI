'use client';

import React from 'react';
import { Switch, Input, Select } from '@vhyxui/react';
import type { PropControl } from './component-defs';

interface PropControlsProps {
  controls: PropControl[];
  props: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

export function PropControls({ controls, props, onChange }: PropControlsProps): React.ReactElement {
  if (controls.length === 0) {
    return (
      <div className="pg-controls">
        <p className="pg-controls-title">Props</p>
        <p style={{ fontSize: 'var(--vhyx-text-xs)', color: 'var(--vhyx-color-text-muted)' }}>
          This component is interactive — open it in the preview to explore.
        </p>
      </div>
    );
  }

  return (
    <div className="pg-controls">
      <p className="pg-controls-title">Props</p>
      <div className="pg-controls-grid">
        {controls.map((control) => {
          const value = props[control.key];
          return (
            <div key={control.key} className="pg-control-item">
              <span className="pg-control-label">{control.label}</span>

              {control.type === 'select' && (
                <Select
                  value={String(value ?? '')}
                  onValueChange={(v) => { onChange(control.key, v); }}
                  size="sm"
                  style={{ minWidth: '9rem' }}
                >
                  <Select.Trigger />
                  <Select.Content>
                    {(control.options ?? []).map((opt) => (
                      <Select.Item key={opt} value={opt}>{opt}</Select.Item>
                    ))}
                  </Select.Content>
                </Select>
              )}

              {control.type === 'switch' && (
                <div className="pg-control-toggle">
                  <Switch
                    size="sm"
                    checked={Boolean(value)}
                    onCheckedChange={(v) => { onChange(control.key, v); }}
                    aria-label={control.label}
                  />
                  <span style={{ fontSize: 'var(--vhyx-text-xs)', color: 'var(--vhyx-color-text-muted)' }}>
                    {Boolean(value) ? 'true' : 'false'}
                  </span>
                </div>
              )}

              {control.type === 'input' && (
                <Input
                  size="sm"
                  value={String(value ?? '')}
                  onChange={(e) => { onChange(control.key, e.target.value); }}
                  placeholder={control.label}
                  style={{ minWidth: '9rem' }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
