'use client';

import React, { useState } from 'react';
import { Select, Button } from '@vhyxui/react';

interface ThemePanelProps {
  overrides: Record<string, string>;
  onChange: (overrides: Record<string, string>) => void;
}

const FONT_OPTIONS = [
  { label: 'System', value: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' },
  { label: 'Inter', value: '"Inter", system-ui, sans-serif' },
  { label: 'Plus Jakarta Sans', value: '"Plus Jakarta Sans", system-ui, sans-serif' },
  { label: 'Geist', value: '"Geist", system-ui, sans-serif' },
];

const RADIUS_PRESETS = [
  { label: 'Sharp', value: '0' },
  { label: 'Default', value: null },
  { label: 'Round', value: '12px' },
];

export function ThemePanel({ overrides, onChange }: ThemePanelProps): React.ReactElement {
  const [copied, setCopied] = useState(false);

  const accentColor = overrides['--vhyx-color-accent'] ?? '#6366f1';
  const selectedFont = FONT_OPTIONS.find((f) => overrides['--vhyx-font-sans'] === f.value)?.value ?? FONT_OPTIONS[0]!.value;

  function setAccent(hex: string): void {
    onChange({
      ...overrides,
      '--vhyx-color-accent': hex,
      '--vhyx-color-accent-hover': hex,
    });
  }

  function setFont(value: string): void {
    const next = { ...overrides };
    if (value === FONT_OPTIONS[0]!.value) {
      delete next['--vhyx-font-sans'];
    } else {
      next['--vhyx-font-sans'] = value;
    }
    onChange(next);
  }

  function setRadius(value: string | null): void {
    const next = { ...overrides };
    if (value === null) {
      delete next['--vhyx-radius-sm'];
      delete next['--vhyx-radius-md'];
      delete next['--vhyx-radius-lg'];
      delete next['--vhyx-radius-xl'];
    } else {
      const sm = value === '0' ? '0' : '4px';
      const md = value === '0' ? '0' : value;
      const lg = value === '0' ? '0' : '16px';
      const xl = value === '0' ? '0' : '20px';
      next['--vhyx-radius-sm'] = sm;
      next['--vhyx-radius-md'] = md;
      next['--vhyx-radius-lg'] = lg;
      next['--vhyx-radius-xl'] = xl;
    }
    onChange(next);
  }

  const cssOutput = Object.keys(overrides).length === 0
    ? '/* No overrides — all defaults */'
    : `:root {\n${Object.entries(overrides).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}`;

  function handleCopyCss(): void {
    void navigator.clipboard.writeText(cssOutput).then(() => {
      setCopied(true);
      setTimeout(() => { setCopied(false); }, 2000);
    });
  }

  function handleReset(): void {
    onChange({});
  }

  return (
    <div className="pg-theme-panel">
      {/* Accent color */}
      <div className="pg-theme-row">
        <label className="pg-theme-label" htmlFor="accent-color-picker">Accent color</label>
        <div className="pg-theme-color-row">
          <input
            id="accent-color-picker"
            type="color"
            className="pg-theme-color-input"
            value={accentColor}
            onChange={(e) => { setAccent(e.target.value); }}
            aria-label="Accent color"
          />
          <input
            type="text"
            className="pg-theme-hex-input"
            value={accentColor}
            onChange={(e) => {
              const v = e.target.value;
              if (/^#[0-9a-fA-F]{0,6}$/.test(v)) setAccent(v);
            }}
            maxLength={7}
            aria-label="Accent color hex value"
          />
        </div>
      </div>

      {/* Border radius */}
      <div className="pg-theme-row">
        <label className="pg-theme-label">Border radius</label>
        <div className="pg-theme-radius-row">
          {RADIUS_PRESETS.map((preset) => {
            const isActive = preset.value === null
              ? !overrides['--vhyx-radius-md']
              : overrides['--vhyx-radius-md'] === preset.value;
            return (
              <button
                key={preset.label}
                type="button"
                className="pg-theme-radius-btn"
                data-active={isActive ? 'true' : 'false'}
                onClick={() => { setRadius(preset.value); }}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Font */}
      <div className="pg-theme-row">
        <label className="pg-theme-label">Font family</label>
        <Select value={selectedFont} onValueChange={setFont} size="sm" style={{ width: '100%' }}>
          <Select.Trigger />
          <Select.Content>
            {FONT_OPTIONS.map((f) => (
              <Select.Item key={f.label} value={f.value}>{f.label}</Select.Item>
            ))}
          </Select.Content>
        </Select>
      </div>

      {/* CSS output */}
      <div className="pg-theme-row">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--vhyx-space-2)' }}>
          <label className="pg-theme-label" style={{ marginBottom: 0 }}>CSS output</label>
          <button type="button" className="pg-theme-copy-btn" onClick={handleCopyCss}>
            {copied ? 'Copied!' : 'Copy CSS'}
          </button>
        </div>
        <pre className="pg-theme-css-output"><code>{cssOutput}</code></pre>
      </div>

      <Button variant="outline" size="sm" onClick={handleReset} style={{ width: '100%' }}>
        Reset theme
      </Button>
    </div>
  );
}
