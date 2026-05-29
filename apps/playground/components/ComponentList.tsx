'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Input } from '@vhyxui/react';
import { COMPONENT_GROUPS, COMPONENT_DEFS } from './component-defs';

interface ComponentListProps {
  selected: string;
}

export function ComponentList({ selected }: ComponentListProps): React.ReactElement {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const filtered = query.trim().toLowerCase();

  return (
    <aside className="pg-sidebar" aria-label="Component list">
      {/* Search */}
      <div className="pg-sidebar-search">
        <Input
          placeholder="Filter components…"
          size="sm"
          value={query}
          onChange={(e) => { setQuery(e.target.value); }}
          aria-label="Filter component list"
        />
      </div>

      {/* Groups */}
      {COMPONENT_GROUPS.map((group) => {
        const items = group.ids.filter((id) => {
          if (!filtered) return true;
          return id.includes(filtered) || (COMPONENT_DEFS[id]?.name.toLowerCase().includes(filtered) ?? false);
        });
        if (items.length === 0) return null;
        return (
          <div key={group.label} className="pg-sidebar-group">
            <p className="pg-sidebar-group-label">{group.label}</p>
            {items.map((id) => {
              const def = COMPONENT_DEFS[id];
              if (!def) return null;
              return (
                <button
                  key={id}
                  type="button"
                  className="pg-sidebar-item"
                  data-active={selected === id ? 'true' : 'false'}
                  onClick={() => { router.push(`/${id}`); }}
                  aria-current={selected === id ? 'page' : undefined}
                >
                  <span>{def.name}</span>
                  <Badge variant="success" size="sm">Stable</Badge>
                </button>
              );
            })}
          </div>
        );
      })}
    </aside>
  );
}
