'use client';

import React from 'react';
import { Badge, Separator } from '@vhyxui/react';

interface PageHeaderProps {
  name: string;
  description: string;
  /** e.g. ['22 components', 'MIT'] */
  tags?: string[];
}

/** Component page header — name, description, tag badges. */
export function PageHeader({ name, description, tags = [] }: PageHeaderProps): React.ReactElement {
  return (
    <div>
      <h1 className="docs-page-title">{name}</h1>
      <p className="docs-page-description">{description}</p>
      {tags.length > 0 && (
        <div className="docs-page-badges">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
          ))}
        </div>
      )}
      <Separator decorative style={{ marginBottom: 'var(--vhyx-space-8)' }} />
    </div>
  );
}
