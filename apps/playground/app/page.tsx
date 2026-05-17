'use client';

import React, { useState, useCallback } from 'react';
import { Switch, Badge, Separator } from '@vhyxui/react';
import { ComponentPicker } from '../components/ComponentPicker';
import { PropControls } from '../components/PropControls';
import { LivePreview } from '../components/LivePreview';
import { CodeOutput } from '../components/CodeOutput';
import { ContractViewer } from '../components/ContractViewer';
import { TokenViewer } from '../components/TokenViewer';
import { COMPONENT_DEFS } from '../components/component-defs';

type PanelTab = 'code' | 'contract' | 'tokens';

export default function PlaygroundPage(): React.ReactElement {
  // Selected component
  const [selectedId, setSelectedId] = useState('button');
  const def = COMPONENT_DEFS[selectedId] ?? COMPONENT_DEFS['button']!;

  // Props for selected component — reset to defaults when component changes
  const [props, setProps] = useState<Record<string, unknown>>(def.defaultProps);

  // Active right panel tab
  const [activePanel, setActivePanel] = useState<PanelTab>('code');

  // Dark mode state
  const [isDark, setIsDark] = useState(false);

  // Handle component selection
  const handleSelectComponent = useCallback((id: string) => {
    setSelectedId(id);
    const newDef = COMPONENT_DEFS[id];
    if (newDef) setProps(newDef.defaultProps);
  }, []);

  // Handle prop change
  const handlePropChange = useCallback((key: string, value: unknown) => {
    setProps((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Dark mode toggle
  function toggleDark(): void {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
  }

  const PANEL_TABS: Array<{ id: PanelTab; label: string }> = [
    { id: 'code', label: 'Code' },
    { id: 'contract', label: 'Contract' },
    { id: 'tokens', label: 'Tokens' },
  ];

  return (
    <div className="pg-root">
      {/* Header */}
      <header className="pg-header">
        <div className="pg-header-brand">
          <a href="/" style={{ textDecoration: 'none' }}>
            <div>
              <span className="pg-header-title">VhyxUI</span>
              {' '}
              <span className="pg-header-subtitle">Playground</span>
            </div>
          </a>
          <Separator orientation="vertical" style={{ height: '1.25rem' }} />
          <Badge variant="info" size="sm">Four layers. One library.</Badge>
        </div>

        <div className="pg-header-actions">
          <a
            href="http://localhost:3000/components/button"
            style={{ fontSize: 'var(--vhyx-text-xs)', color: 'var(--vhyx-color-text-subtle)', textDecoration: 'none' }}
          >
            Docs ↗
          </a>
          <div className="pg-dark-toggle">
            <span>Dark</span>
            <Switch
              size="sm"
              checked={isDark}
              onCheckedChange={toggleDark}
              aria-label="Toggle dark mode"
            />
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="pg-body">
        {/* Left: Component picker */}
        <ComponentPicker selected={selectedId} onSelect={handleSelectComponent} />

        {/* Center: Preview + Controls */}
        <div className="pg-canvas">
          {/* Preview header */}
          <div className="pg-preview-area">
            <div className="pg-preview-header">
              <div>
                <span className="pg-component-name">{def.name}</span>
                <span style={{ marginLeft: 'var(--vhyx-space-3)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
                  {def.description}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--vhyx-space-2)' }}>
                <Badge variant="outline" size="sm">{def.group}</Badge>
                {Object.keys(def.contract).length > 0 && (
                  <Badge variant="info" size="sm">VhyxSeal</Badge>
                )}
              </div>
            </div>

            {/* Live component preview */}
            <LivePreview componentId={selectedId} props={props} />
          </div>

          {/* Prop controls */}
          <PropControls
            controls={def.controls}
            props={props}
            onChange={handlePropChange}
          />
        </div>

        {/* Right: Code / Contract / Tokens panel */}
        <div className="pg-panel">
          <div className="pg-panel-tabs">
            {PANEL_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className="pg-panel-tab"
                data-active={activePanel === tab.id ? 'true' : 'false'}
                onClick={() => { setActivePanel(tab.id); }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="pg-panel-content">
            {activePanel === 'code' && (
              <CodeOutput def={def} props={props} />
            )}
            {activePanel === 'contract' && (
              <ContractViewer def={def} props={props} />
            )}
            {activePanel === 'tokens' && (
              <TokenViewer def={def} />
            )}
          </div>

          {/* Four-layer legend */}
          <div style={{
            padding: 'var(--vhyx-space-3) var(--vhyx-space-4)',
            borderTop: 'var(--vhyx-border-width) solid var(--vhyx-color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--vhyx-space-1-5)',
          }}>
            <p style={{ fontSize: 'var(--vhyx-text-2xs)', fontWeight: 'var(--vhyx-weight-semibold)', color: 'var(--vhyx-color-text-muted)', textTransform: 'uppercase', letterSpacing: 'var(--vhyx-tracking-wider)' }}>
              Four layers
            </p>
            {[
              { label: '01 Visual', desc: 'CSS tokens — override to theme' },
              { label: '02 Accessible', desc: 'WCAG 2.1 AA built in' },
              { label: '03 Motion', desc: 'Token-driven, reduced-motion aware' },
              { label: '04 Agent Contract', desc: 'VhyxSeal — AI readable' },
            ].map((layer) => (
              <div key={layer.label} style={{ display: 'flex', gap: 'var(--vhyx-space-2)', alignItems: 'baseline' }}>
                <span style={{ fontSize: 'var(--vhyx-text-2xs)', fontFamily: 'var(--vhyx-font-mono)', color: 'var(--vhyx-color-accent)', flexShrink: 0 }}>{layer.label}</span>
                <span style={{ fontSize: 'var(--vhyx-text-2xs)', color: 'var(--vhyx-color-text-muted)' }}>{layer.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
