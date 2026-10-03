'use client';

import React from 'react';
import { Badge, Separator } from '@vhyxui/react';
import { ContractGlance, type ContractLike } from './ContractView';

interface PageHeaderProps {
  name: string;
  description: string;
  /** e.g. ['Interactive', 'Form element'] */
  tags?: string[];
  stable?: boolean;
  /** Default VhyxSeal contract, summarised under the description. */
  contract?: ContractLike;
}

/** Component page header — name, description, tag badges. */
export function PageHeader({ name, description, tags = [], stable = true, contract }: PageHeaderProps): React.ReactElement {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--vhyx-space-3)', marginBottom: 'var(--vhyx-space-2)' }}>
        <h1 className="docs-page-title" style={{ marginBottom: 0 }}>{name}</h1>
        {stable && <Badge variant="success" size="sm">Stable</Badge>}
      </div>
      <p className="docs-page-description">{description}</p>
      {tags.length > 0 && (
        <div className="docs-page-badges">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" size="sm">{tag}</Badge>
          ))}
        </div>
      )}
      {contract && <ContractGlance contract={contract} />}
      <Separator decorative style={{ marginBottom: 'var(--vhyx-space-8)' }} />
    </div>
  );
}
