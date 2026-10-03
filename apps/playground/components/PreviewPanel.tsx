'use client';

import { MoonIcon, SunIcon } from '@vhyxui/icons';
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
          {isDark ? <SunIcon size={14} /> : <MoonIcon size={14} />}
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
