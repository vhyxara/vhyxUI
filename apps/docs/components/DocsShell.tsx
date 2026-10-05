'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DocsShellProps {
  children: React.ReactNode;
}

export function DocsShell({ children }: DocsShellProps): React.ReactElement {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const path = usePathname() ?? '/';
  const fullWidth = path === '/' || path === '/index' || path === '/index.html';

  function handleSidebarToggle(): void {
    setSidebarOpen((prev) => !prev);
  }

  function handleSidebarClose(): void {
    setSidebarOpen(false);
  }

  if (fullWidth) {
    return (
      <>
        <Header sidebarOpen={sidebarOpen} onSidebarToggle={handleSidebarToggle} />
        {sidebarOpen && (
          <div className="docs-shell docs-shell--overlay">
            <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />
            <div className="docs-sidebar-overlay" onClick={handleSidebarClose} aria-hidden="true" />
          </div>
        )}
        <main id="vhyx-main" className="docs-main-content docs-main-content--full">{children}</main>
      </>
    );
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
        <main id="vhyx-main" className="docs-main-content atmo-page-glow">
          {children}
        </main>
      </div>
    </>
  );
}
