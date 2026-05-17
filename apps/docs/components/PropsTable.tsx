'use client';

import React from 'react';

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

interface PropsTableProps {
  props: PropDef[];
}

/** Renders a props documentation table. */
export function PropsTable({ props }: PropsTableProps): React.ReactElement {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="docs-props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <td>
                <code>{prop.name}</code>
                {prop.required && <span className="docs-props-required"> *</span>}
              </td>
              <td><code>{prop.type}</code></td>
              <td>{prop.default ? <code>{prop.default}</code> : <span style={{ color: 'var(--vhyx-color-text-muted)' }}>—</span>}</td>
              <td style={{ color: 'var(--vhyx-color-text-subtle)' }}>{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
