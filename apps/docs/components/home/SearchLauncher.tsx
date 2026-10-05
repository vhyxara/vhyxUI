'use client';

import React from 'react';
import { SearchIcon } from '@vhyxui/icons';

/** Large search field on the docs home; opens the header search (which listens for ⌘K / Ctrl+K). */
export function SearchLauncher(): React.ReactElement {
  const open = (): void => {
    const mac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: mac, ctrlKey: !mac }));
  };
  return (
    <button type="button" className="home-search" onClick={open}>
      <SearchIcon size={18} aria-hidden="true" />
      <span>Search the docs</span>
      <kbd>⌘K</kbd>
    </button>
  );
}
