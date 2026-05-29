import React from 'react';

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <div className="docs-page">{children}</div>;
}
