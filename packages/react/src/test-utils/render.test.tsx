import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithVhyxUI } from './render';
import { Button } from '../components/Button';

describe('renderWithVhyxUI', () => {
  it('renders component without crashing', () => {
    renderWithVhyxUI(<Button>test</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('wraps with VhyxUIProvider — SealContext available', () => {
    const warnSpy = vi.spyOn(console, 'warn');
    renderWithVhyxUI(<Button>test</Button>);
    expect(warnSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('SealProvider'),
    );
    warnSpy.mockRestore();
  });

  it('accepts render options', () => {
    const { container } = renderWithVhyxUI(<Button>test</Button>, {
      baseElement: document.body,
    });
    expect(container).toBeDefined();
  });
});
