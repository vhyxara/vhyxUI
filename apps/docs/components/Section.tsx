'use client';

import React from 'react';

interface SectionProps {
  title: string;
  children: React.ReactNode;
  description?: string;
  id?: string;
}

/** A named section within a component documentation page. */
export function Section({ title, children, description, id }: SectionProps): React.ReactElement {
  return (
    <div className="docs-section" id={id}>
      <h2 className="docs-section-heading">{title}</h2>
      {description && <p className="docs-section-text">{description}</p>}
      {children}
    </div>
  );
}
