'use client';

import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

/** Styled code block with copy button. */
export function CodeBlock({ code, language = 'tsx' }: CodeBlockProps): React.ReactElement {
  const [copied, setCopied] = useState(false);

  function handleCopy(): void {
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => { setCopied(false); }, 2000);
    });
  }

  return (
    <div className="docs-code-block">
      <div className="docs-code-header">
        <span>{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--vhyx-color-text-muted)',
            cursor: 'pointer',
            fontFamily: 'var(--vhyx-font-mono)',
            fontSize: 'var(--vhyx-text-xs)',
            padding: 'var(--vhyx-space-1) var(--vhyx-space-2)',
            borderRadius: 'var(--vhyx-radius-sm)',
          }}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
}
