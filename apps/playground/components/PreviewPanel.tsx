'use client';

import React from 'react';
import { LivePreview } from './LivePreview';

type PreviewWidth = '375px' | '768px' | '100%';

interface PreviewPanelProps {
  componentId: string;
  props: Record<string, unknown>;
  isDark: boolean;
  onToggleDark: () => void;
  width: PreviewWidth;
  onWidthChange: (w: PreviewWidth) => void;
  themeOverrides: Record<string, string>;
}

const WIDTH_PRESETS: Array<{ label: string; value: PreviewWidth }> = [
  { label: 'Mobile', value: '375px' },
  { label: 'Tablet', value: '768px' },
  { label: 'Desktop', value: '100%' },
];

function SunIcon(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function PreviewPanel({
  componentId,
  props,
  isDark,
  onToggleDark,
  width,
  onWidthChange,
  themeOverrides,
}: PreviewPanelProps): React.ReactElement {
  return (
    <div className="pg-preview-panel">
      {/* Toolbar */}
      <div className="pg-preview-toolbar">
        {/* Width presets */}
        <div className="pg-preview-widths">
          {WIDTH_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              className="pg-preview-width-btn"
              data-active={width === preset.value ? 'true' : 'false'}
              onClick={() => { onWidthChange(preset.value); }}
              aria-pressed={width === preset.value}
            >
              {preset.label}
            </button>
          ))}
        </div>
        {/* Light / Dark toggle */}
        <button
          type="button"
          className="pg-preview-theme-btn"
          aria-label={`Preview in ${isDark ? 'light' : 'dark'} mode`}
          onClick={onToggleDark}
          aria-pressed={isDark}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
          <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </div>

      {/* Preview area */}
      <div className="pg-preview-stage">
        <div
          className="pg-preview-viewport"
          data-theme={isDark ? 'dark' : 'light'}
          style={{
            width,
            ...Object.fromEntries(Object.entries(themeOverrides).map(([k, v]) => [k, v])),
          } as React.CSSProperties}
        >
          <LivePreview componentId={componentId} props={props} />
        </div>
      </div>
    </div>
  );
}
