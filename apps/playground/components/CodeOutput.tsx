'use client';

import React, { useState } from 'react';
import type { ComponentDef } from './component-defs';

interface CodeOutputProps {
  def: ComponentDef;
  props: Record<string, unknown>;
}

/** Generates a JSX string from component name + props. */
function generateCode(def: ComponentDef, props: Record<string, unknown>): string {
  const lines: string[] = [];

  // Collect non-default, non-children props
  const attrs: string[] = [];
  for (const [key, value] of Object.entries(props)) {
    if (key === 'children') continue;
    const defaultValue = def.defaultProps[key];
    if (value === defaultValue) continue; // omit default values
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

  return lines.join('\n');
}

export function CodeOutput({ def, props }: CodeOutputProps): React.ReactElement {
  const [copied, setCopied] = useState(false);
  const code = generateCode(def, props);

  function handleCopy(): void {
    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => { setCopied(false); }, 2000);
    });
  }

  return (
    <div>
      <p className="pg-section-label">Generated JSX</p>
      <div className="pg-code-block">
        <div className="pg-code-header">
          <span className="pg-code-lang">tsx</span>
          <button type="button" className="pg-code-copy" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="pg-code-pre"><code>{code}</code></pre>
      </div>

      <p className="pg-section-label" style={{ marginTop: 'var(--vhyx-space-4)' }}>Import</p>
      <div className="pg-code-block">
        <pre className="pg-code-pre"><code>{`import { ${def.name} } from '@vhyxui/react'`}</code></pre>
      </div>
    </div>
  );
}
