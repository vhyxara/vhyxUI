'use client';

import { MoonIcon, SunIcon } from '@vhyxui/icons';
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export function ThemeToggle(): React.ReactElement {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="docs-theme-toggle"
        aria-label="Toggle theme"
        disabled
        style={{ opacity: 0, pointerEvents: 'none' }}
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      className="docs-theme-toggle"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => { setTheme(isDark ? 'light' : 'dark'); }}
    >
      {isDark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
    </button>
  );
}
