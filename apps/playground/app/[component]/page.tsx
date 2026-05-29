'use client';

import React, { useState, useCallback, use } from 'react';
import { PlaygroundHeader } from '../../components/PlaygroundHeader';
import { ComponentList } from '../../components/ComponentList';
import { PreviewPanel } from '../../components/PreviewPanel';
import { CodeOutput } from '../../components/CodeOutput';
import { ControlPanel } from '../../components/ControlPanel';
import { COMPONENT_DEFS } from '../../components/component-defs';

interface PageProps {
  params: Promise<{ component: string }>;
}

export default function ComponentPage({ params }: PageProps): React.ReactElement {
  const { component } = use(params);
  const componentId = component.toLowerCase();
  const def = COMPONENT_DEFS[componentId] ?? COMPONENT_DEFS['button']!;

  const [props, setProps] = useState<Record<string, unknown>>(def.defaultProps);
  const [previewDark, setPreviewDark] = useState(false);
  const [previewWidth, setPreviewWidth] = useState<'375px' | '768px' | '100%'>('100%');
  const [themeOverrides, setThemeOverrides] = useState<Record<string, string>>({});

  const handlePropChange = useCallback((key: string, value: unknown) => {
    setProps((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetProps = useCallback(() => {
    setProps(def.defaultProps);
  }, [def.defaultProps]);

  return (
    <div className="pg-root">
      <PlaygroundHeader />
      <div className="pg-body">
        {/* Left: Component list */}
        <ComponentList selected={componentId} />

        {/* Center: Preview + Code */}
        <div className="pg-center">
          <PreviewPanel
            componentId={componentId}
            props={props}
            isDark={previewDark}
            onToggleDark={() => { setPreviewDark((d) => !d); }}
            width={previewWidth}
            onWidthChange={setPreviewWidth}
            themeOverrides={themeOverrides}
          />
          <CodeOutput def={def} props={props} />
        </div>

        {/* Right: Control panel */}
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
