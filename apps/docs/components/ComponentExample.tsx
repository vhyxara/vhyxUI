'use client';

import React, { useId, useState } from 'react';
import { CodeBlock } from './CodeBlockSimple';

interface ComponentExampleProps {
  label?: string;
  code?: string;
  center?: boolean;
  children: React.ReactNode;
}

/** Live component example: a dotted stage with Preview / Code tabs. */
export function ComponentExample({
  label,
  code,
  center = false,
  children,
}: ComponentExampleProps): React.ReactElement {
  const [tab, setTab] = useState<'preview' | 'code'>('preview');
  const id = useId();
  const showTabs = Boolean(code);

  return (
    <div className="docs-example-container">
      {(showTabs || label) && (
        <div className="docs-example-toolbar">
          {showTabs ? (
            <div className="docs-example-tabs" role="tablist" aria-label={label ? `${label} example` : 'Example'}>
              <button type="button" role="tab" id={`${id}-preview-tab`} aria-controls={`${id}-preview`} aria-selected={tab === 'preview'} className="docs-example-tab" onClick={() => { setTab('preview'); }}>Preview</button>
              <button type="button" role="tab" id={`${id}-code-tab`} aria-controls={`${id}-code`} aria-selected={tab === 'code'} className="docs-example-tab" onClick={() => { setTab('code'); }}>Code</button>
            </div>
          ) : <span />}
          {label && <span className="docs-example-caption">{label}</span>}
        </div>
      )}
      {tab === 'preview' || !code ? (
        <div
          id={`${id}-preview`}
          role={showTabs ? 'tabpanel' : undefined}
          aria-labelledby={showTabs ? `${id}-preview-tab` : undefined}
          className={['docs-example-preview', center ? 'docs-example-preview--center' : ''].filter(Boolean).join(' ')}
        >
          {children}
        </div>
      ) : (
        <div id={`${id}-code`} role="tabpanel" aria-labelledby={`${id}-code-tab`}>
          <CodeBlock code={code} />
        </div>
      )}
    </div>
  );
}
