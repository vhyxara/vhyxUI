'use client';

import React, { useState, useCallback, use } from 'react';
import { useTheme } from 'next-themes';
import { PlaygroundHeader } from '../../components/PlaygroundHeader';
import { ComponentList } from '../../components/ComponentList';
import { PreviewPanel } from '../../components/PreviewPanel';
import { ControlPanel } from '../../components/ControlPanel';
import { AgentConsole, consoleLine, verdict, type ConsoleLine } from '../../components/AgentConsole';
import { effectiveContract } from '../../components/contract';
import { COMPONENT_DEFS } from '../../components/component-defs';

interface PageProps {
  params: Promise<{ component: string }>;
}

export default function ComponentPage({ params }: PageProps): React.ReactElement {
  const { component } = use(params);
  const componentId = component.toLowerCase();
  const def = COMPONENT_DEFS[componentId] ?? COMPONENT_DEFS['button']!;

  const [props, setProps] = useState<Record<string, unknown>>(def.defaultProps);
  const { resolvedTheme } = useTheme();
  // The preview follows the site theme until its own toggle is used.
  const [previewOverride, setPreviewOverride] = useState<boolean | null>(null);
  const previewDark = previewOverride ?? resolvedTheme !== 'light';
  const [previewWidth, setPreviewWidth] = useState<'375px' | '768px' | '100%'>('100%');
  const [themeOverrides, setThemeOverrides] = useState<Record<string, string>>({});
  const [lines, setLines] = useState<ConsoleLine[]>([consoleLine('fetch /__agent__/manifest.json  signature valid', 'ok')]);

  const handlePropChange = useCallback((key: string, value: unknown) => {
    setProps((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetProps = useCallback(() => {
    setProps(def.defaultProps);
  }, [def.defaultProps]);

  const handleInteract = useCallback((label: string) => {
    const { contract } = effectiveContract(def, props);
    if (Object.keys(contract).length === 0) {
      setLines((current) => [...current, consoleLine(`click "${label}"  no contract, not an agent action`, 'muted')].slice(-40));
      return;
    }
    const v = verdict(contract);
    setLines((current) => [...current, consoleLine(`act   ${def.id} "${label}"  ${v.text}`, v.tone)].slice(-40));
  }, [def, props]);

  return (
    <div className="pg-root">
      <PlaygroundHeader />
      <div className="pg-body">
        <ComponentList selected={componentId} />

        <main className="pg-center" id="pg-main">
          <div className="pg-center-head">
            <div>
              <h1 className="pg-title">{def.name}</h1>
              <p className="pg-subtitle">{def.description}</p>
            </div>
          </div>
          <PreviewPanel
            componentId={componentId}
            props={props}
            isDark={previewDark}
            onToggleDark={() => { setPreviewOverride(!previewDark); }}
            width={previewWidth}
            onWidthChange={setPreviewWidth}
            themeOverrides={themeOverrides}
            onInteract={handleInteract}
          />
          <AgentConsole def={def} props={props} lines={lines} onLines={setLines} />
        </main>

        <ControlPanel
          def={def}
          props={props}
          onPropChange={handlePropChange}
          onReset={resetProps}
          themeOverrides={themeOverrides}
          onThemeOverridesChange={setThemeOverrides}
        />
      </div>
    </div>
  );
}
