'use client';

import React, { useState } from 'react';
import { CodeBlock } from './CodeBlockSimple';

interface ComponentExampleProps {
  label?: string;
  code?: string;
  center?: boolean;
  children: React.ReactNode;
}

/** Live component example with optional code toggle. */
export function ComponentExample({
  label,
  code,
  center = false,
  children,
}: ComponentExampleProps): React.ReactElement {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="docs-example-container">
      <div
        className={['docs-example-preview', center ? 'docs-example-preview--center' : ''].filter(Boolean).join(' ')}
      >
        {children}
      </div>
      {label && (
        <div
          className="docs-example-label"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <span>{label}</span>
          {code && (
            <button
              type="button"
              onClick={() => { setShowCode((v) => !v); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--vhyx-color-text-muted)',
                cursor: 'pointer',
                fontSize: 'var(--vhyx-text-xs)',
                fontFamily: 'var(--vhyx-font-mono)',
                padding: 'var(--vhyx-space-1) var(--vhyx-space-2)',
              }}
            >
              {showCode ? 'Hide code' : 'Show code'}
            </button>
          )}
        </div>
      )}
      {showCode && code && <CodeBlock code={code} />}
    </div>
  );
}
