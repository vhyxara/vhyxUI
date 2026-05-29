'use client';

import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DocsShellProps {
  children: React.ReactNode;
}

export function DocsShell({ children }: DocsShellProps): React.ReactElement {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  function handleSidebarToggle(): void {
    setSidebarOpen((prev) => !prev);
  }

  function handleSidebarClose(): void {
    setSidebarOpen(false);
  }

  return (
    <>
      <Header sidebarOpen={sidebarOpen} onSidebarToggle={handleSidebarToggle} />
      <div className="docs-shell">
        <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
        {sidebarOpen && (
          <div
            className="docs-sidebar-overlay"
            onClick={handleSidebarClose}
            aria-hidden="true"
          />
        )}
        <main id="vhyx-main" className="docs-main-content">
          {children}
        </main>
      </div>
    </>
  );
}
