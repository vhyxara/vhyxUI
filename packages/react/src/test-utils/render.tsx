import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { VhyxUIProvider } from '../provider/VhyxUIProvider';

/**
 * Renders a component wrapped in VhyxUIProvider.
 * Use this in all VhyxUI component tests to ensure
 * SealProvider and ToastProvider are in the tree.
 *
 * @example
 * import { renderWithVhyxUI } from '@vhyxui/react/test-utils'
 *
 * const { getByRole } = renderWithVhyxUI(<Button>Click</Button>)
 */
export function renderWithVhyxUI(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <VhyxUIProvider>{children}</VhyxUIProvider>
    ),
    ...options,
  });
}
