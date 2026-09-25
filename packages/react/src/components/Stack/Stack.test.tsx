import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import React, { createRef } from 'react';
import { Stack, HStack, VStack } from './Stack';
import { Grid } from '../Grid';
import { Container } from '../Container';
import { Center } from '../Center';

describe('Stack', () => {
  it('renders a column with a token gap by default', () => {
    const { container } = render(<Stack><span>a</span></Stack>);
    const el = container.firstChild as HTMLElement;
    expect(el.dataset['direction']).toBe('column');
    expect(el.style.gap).toBe('var(--vhyx-space-3)');
  });

  it('maps align, justify, padding, wrap and collapse', () => {
    const { container } = render(
      <Stack direction="row" gap={2.5} align="center" justify="between" padding={4} wrap collapseBelow="md" />,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.gap).toBe('var(--vhyx-space-2-5)');
    expect(el.style.alignItems).toBe('center');
    expect(el.style.justifyContent).toBe('space-between');
    expect(el.style.padding).toBe('var(--vhyx-space-4)');
    expect(el.dataset['wrap']).toBe('true');
    expect(el.dataset['collapse']).toBe('md');
  });

  it('supports `as`, className merge, style override and refs', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(<Stack ref={ref} as="section" className="p-4" style={{ gap: '1px' }} />);
    const el = container.firstChild as HTMLElement;
    expect(el.tagName).toBe('SECTION');
    expect(el.className).toContain('p-4');
    expect(el.style.gap).toBe('1px');
    expect(ref.current).toBe(el);
  });

  it('HStack is a centered row; VStack is a column', () => {
    const { container } = render(<><HStack /><VStack /></>);
    const [h, v] = Array.from(container.children) as HTMLElement[];
    expect(h?.dataset['direction']).toBe('row');
    expect(h?.style.alignItems).toBe('center');
    expect(v?.dataset['direction']).toBe('column');
  });
});

describe('Grid', () => {
  it('builds equal columns', () => {
    const { container } = render(<Grid columns={3} />);
    expect((container.firstChild as HTMLElement).style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))');
  });

  it('builds responsive auto-fit columns from minChildWidth', () => {
    const { container } = render(<Grid minChildWidth={240} collapseBelow="md" />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.gridTemplateColumns).toBe('repeat(auto-fit, minmax(min(240px, 100%), 1fr))');
    expect(el.dataset['collapse']).toBeUndefined();
  });

  it('guards against invalid column counts', () => {
    const { container } = render(<Grid columns={0} />);
    expect((container.firstChild as HTMLElement).style.gridTemplateColumns).toBe('repeat(1, minmax(0, 1fr))');
  });
});

describe('Container and Center', () => {
  it('Container exposes size and flush', () => {
    const { container } = render(<Container size="md" flush as="main" />);
    const el = container.firstChild as HTMLElement;
    expect(el.tagName).toBe('MAIN');
    expect(el.dataset['size']).toBe('md');
    expect(el.dataset['flush']).toBe('true');
  });

  it('Center centers on both axes and can fill the viewport', () => {
    const { container } = render(<Center fullHeight inline />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.display).toBe('inline-flex');
    expect(el.style.justifyContent).toBe('center');
    expect(el.style.minHeight).toBe('100dvh');
  });
});
