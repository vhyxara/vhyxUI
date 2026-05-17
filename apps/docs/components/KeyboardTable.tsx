'use client';

import React from 'react';

export interface KeyboardRow {
  keys: string[];
  action: string;
}

interface KeyboardTableProps {
  rows: KeyboardRow[];
}

/** Renders a keyboard navigation reference table. */
export function KeyboardTable({ rows }: KeyboardTableProps): React.ReactElement {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="docs-kbd-table">
        <thead>
          <tr>
            <th>Key</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>
                <span className="docs-kbd">
                  {row.keys.map((key, j) => (
                    <React.Fragment key={j}>
                      {j > 0 && <span style={{ color: 'var(--vhyx-color-text-muted)', fontSize: 'var(--vhyx-text-xs)' }}>or</span>}
                      <kbd>{key}</kbd>
                    </React.Fragment>
                  ))}
                </span>
              </td>
              <td style={{ color: 'var(--vhyx-color-text-subtle)' }}>{row.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
