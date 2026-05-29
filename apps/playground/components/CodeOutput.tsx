'use client';

import React, { useState, useEffect } from 'react';
import { codeToHtml } from 'shiki';
import type { ComponentDef } from './component-defs';

interface CodeOutputProps {
  def: ComponentDef;
  props: Record<string, unknown>;
}

function generateCode(def: ComponentDef, props: Record<string, unknown>): string {
  const lines: string[] = [];
  const importLine = `import { ${def.name} } from '@vhyxui/react'`;

  // Collect non-default, non-children props
  const attrs: string[] = [];
  for (const [key, value] of Object.entries(props)) {
    if (key === 'children') continue;
    const defaultValue = def.defaultProps[key];
    if (value === defaultValue) continue;
    if (typeof value === 'boolean') {
      if (value) attrs.push(key);
      else attrs.push(`${key}={false}`);
    } else if (typeof value === 'number') {
      attrs.push(`${key}={${value}}`);
    } else {
      attrs.push(`${key}="${String(value)}"`);
    }
  }

  const children = props['children'] !== undefined ? String(props['children']) : undefined;
  const hasChildren = !!children;

  if (attrs.length === 0) {
    if (hasChildren) {
      lines.push(`<${def.name}>`);
      lines.push(`  ${children}`);
      lines.push(`</${def.name}>`);
    } else {
      lines.push(`<${def.name} />`);
    }
  } else if (attrs.length <= 2 && !hasChildren) {
    lines.push(`<${def.name} ${attrs.join(' ')} />`);
  } else {
    lines.push(`<${def.name}`);
    for (const attr of attrs) {
      lines.push(`  ${attr}`);
    }
    if (hasChildren) {
      lines.push(`>`);
      lines.push(`  ${children}`);
      lines.push(`</${def.name}>`);
    } else {
      lines.push(`/>`);
    }
  }

  return `${importLine}\n\n${lines.join('\n')}`;
}

export function CodeOutput({ def, props }: CodeOutputProps): React.ReactElement {
  const [copied, setCopied] = useState(false);
  const code = generateCode(def, props);
  const [html, setHtml] = useState<string>('');

  useEffect(() => {
    let cancelled = false;
    void codeToHtml(code, {
      lang: 'tsx',
      themes: { light: 'github-light', dark: 'dark-plus' },
      defaultColor: false,
    }).then((result) => {
      if (!cancelled) setHtml(result);
    }).catch(() => {
      if (!cancelled) setHtml('');
    });
    return () => { cancelled = true; };
  }, [code]);

  function handleCopy(): void {
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => { setCopied(false); }, 2000);
    });
  }

  return (
    <div className="pg-code-output">
      <div className="pg-code-output-header">
        <span className="pg-code-output-filename">example.tsx</span>
        <button type="button" className="pg-code-output-copy" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      {html ? (
        <div
          className="pg-code-output-body"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="pg-code-output-fallback"><code>{code}</code></pre>
      )}
    </div>
  );
}
