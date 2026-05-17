'use client';

import React from 'react';
import { COMPONENT_GROUPS, COMPONENT_DEFS } from './component-defs';

interface ComponentPickerProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function ComponentPicker({ selected, onSelect }: ComponentPickerProps): React.ReactElement {
  return (
    <nav className="pg-sidebar" aria-label="Component picker">
      {COMPONENT_GROUPS.map((group) => (
        <div key={group.label} className="pg-sidebar-group">
          <p className="pg-sidebar-group-label">{group.label}</p>
          {group.ids.map((id) => {
            const def = COMPONENT_DEFS[id];
            if (!def) return null;
            return (
              <button
                key={id}
                type="button"
                className="pg-sidebar-item"
                data-active={selected === id ? 'true' : 'false'}
                onClick={() => { onSelect(id); }}
              >
                {def.name}
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
