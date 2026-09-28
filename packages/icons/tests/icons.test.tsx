import { describe, expect, it } from 'vitest';
import { createRef } from 'react';
import { render } from '@testing-library/react';
import * as Icons from '../src/index.js';
import { CheckIcon, TriangleAlertIcon } from '../src/index.js';

describe('@vhyxui/icons', () => {
  it('renders a decorative 24×24 stroke icon by default', () => {
    const { container } = render(<CheckIcon />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('viewBox')).toBe('0 0 24 24');
    expect(svg.getAttribute('stroke')).toBe('currentColor');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('width')).toBe('1em');
    expect(svg.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('becomes an accessible image when given a title', () => {
    const { getByRole } = render(<TriangleAlertIcon title="Warning" size={20} />);
    const svg = getByRole('img', { name: 'Warning' });
    expect(svg.getAttribute('width')).toBe('20');
    expect(svg.hasAttribute('aria-hidden')).toBe(false);
  });

  it('forwards refs and extra props', () => {
    const ref = createRef<SVGSVGElement>();
    const { container } = render(<CheckIcon ref={ref} className="c" strokeWidth={1.5} data-x="1" />);
    expect(ref.current).toBe(container.querySelector('svg'));
    expect(ref.current?.getAttribute('class')).toBe('vhyx-icon c');
    expect(ref.current?.getAttribute('stroke-width')).toBe('1.5');
  });

  it('exports every icon with a display name', () => {
    const names = Object.keys(Icons).filter((k) => /^[A-Z]\w*Icon$/.test(k));
    expect(names.length).toBeGreaterThanOrEqual(50);
    for (const n of names) expect((Icons as Record<string, { displayName?: string }>)[n]?.displayName).toBe(n);
  });
});
