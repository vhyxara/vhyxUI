import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import React from 'react';
import { Pagination } from './Pagination';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BasicPagination({
  page = 3,
  pageCount = 10,
  onPageChange = vi.fn(),
  siblingCount = 1,
  showFirstLast = false,
  showPrevNext = true,
}: {
  page?: number;
  pageCount?: number;
  onPageChange?: (p: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
}) {
  return (
    <Pagination
      page={page}
      pageCount={pageCount}
      onPageChange={onPageChange}
      siblingCount={siblingCount}
      showFirstLast={showFirstLast}
      showPrevNext={showPrevNext}
    />
  );
}

// ─── 1. Renders ───────────────────────────────────────────────────────────────

describe('Pagination — render', () => {
  it('renders without crashing', () => {
    render(<BasicPagination />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('renders page buttons', () => {
    render(<BasicPagination page={3} pageCount={5} siblingCount={1} />);
    // All 5 pages visible (no ellipsis needed)
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 5' })).toBeInTheDocument();
  });
});

// ─── 2. Navigation landmark ───────────────────────────────────────────────────

describe('Pagination — aria-label', () => {
  it('nav has aria-label="Pagination"', () => {
    render(<BasicPagination />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Pagination');
  });
});

// ─── 3. Current page ─────────────────────────────────────────────────────────

describe('Pagination — current page', () => {
  it('current page button has aria-current="page"', () => {
    render(<BasicPagination page={3} pageCount={5} />);
    const currentBtn = screen.getByRole('button', { name: '3' });
    expect(currentBtn).toHaveAttribute('aria-current', 'page');
  });

  it('non-current page buttons do not have aria-current', () => {
    render(<BasicPagination page={3} pageCount={5} />);
    const btn1 = screen.getByRole('button', { name: 'Page 1' });
    expect(btn1).not.toHaveAttribute('aria-current');
  });

  it('current page has data-state="active"', () => {
    render(<BasicPagination page={3} pageCount={5} />);
    expect(screen.getByRole('button', { name: '3' })).toHaveAttribute('data-state', 'active');
  });
});

// ─── 4. Prev/Next buttons ────────────────────────────────────────────────────

describe('Pagination — prev/next', () => {
  it('previous button has aria-label="Previous page"', () => {
    render(<BasicPagination />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument();
  });

  it('next button has aria-label="Next page"', () => {
    render(<BasicPagination />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument();
  });

  it('previous button is disabled on first page', () => {
    render(<BasicPagination page={1} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });

  it('next button is disabled on last page', () => {
    render(<BasicPagination page={10} pageCount={10} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  it('calls onPageChange(page-1) when previous clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<BasicPagination page={5} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange(page+1) when next clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<BasicPagination page={5} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(6);
  });
});

// ─── 5. First/Last buttons ───────────────────────────────────────────────────

describe('Pagination — first/last', () => {
  it('first button has aria-label="First page"', () => {
    render(<BasicPagination showFirstLast />);
    expect(screen.getByRole('button', { name: 'First page' })).toBeInTheDocument();
  });

  it('last button has aria-label="Last page"', () => {
    render(<BasicPagination showFirstLast />);
    expect(screen.getByRole('button', { name: 'Last page' })).toBeInTheDocument();
  });

  it('first button is disabled on first page', () => {
    render(<BasicPagination page={1} showFirstLast />);
    expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
  });

  it('last button is disabled on last page', () => {
    render(<BasicPagination page={10} pageCount={10} showFirstLast />);
    expect(screen.getByRole('button', { name: 'Last page' })).toBeDisabled();
  });

  it('first and last buttons not rendered when showFirstLast=false', () => {
    render(<BasicPagination />);
    expect(screen.queryByRole('button', { name: 'First page' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Last page' })).toBeNull();
  });
});

// ─── 6. Page selection ────────────────────────────────────────────────────────

describe('Pagination — page selection', () => {
  it('calls onPageChange with the clicked page number', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<BasicPagination page={3} pageCount={5} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: 'Page 1' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('does not call onPageChange when current page is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<BasicPagination page={3} pageCount={5} onPageChange={onPageChange} />);
    await user.click(screen.getByRole('button', { name: '3' }));
    expect(onPageChange).not.toHaveBeenCalled();
  });
});

// ─── 7. siblingCount controls visible pages ───────────────────────────────────

describe('Pagination — siblingCount', () => {
  it('siblingCount=0 shows only current page and boundaries', () => {
    render(<BasicPagination page={5} pageCount={10} siblingCount={0} />);
    // Page 5 (current), page 1 and 10 (boundaries) — with ellipsis
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 10' })).toBeInTheDocument();
  });

  it('siblingCount=2 shows wider range', () => {
    render(<BasicPagination page={5} pageCount={10} siblingCount={2} />);
    // Should show 3,4,5,6,7 as siblings of 5 + boundaries
    expect(screen.getByRole('button', { name: 'Page 3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 7' })).toBeInTheDocument();
  });
});

// ─── 8. Sizes ────────────────────────────────────────────────────────────────

describe('Pagination — sizes', () => {
  const sizes = ['sm', 'md', 'lg'] as const;

  for (const size of sizes) {
    it(`renders ${size} size with data-size on nav`, () => {
      const { container } = render(
        <Pagination page={1} pageCount={5} onPageChange={vi.fn()} size={size} />,
      );
      expect(container.querySelector('nav')).toHaveAttribute('data-size', size);
    });
  }
});

// ─── 9. forwardRef ────────────────────────────────────────────────────────────

describe('Pagination — forwardRef', () => {
  it('forwards ref to the nav element', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Pagination ref={ref} page={1} pageCount={5} onPageChange={vi.fn()} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

// ─── 10. Accessibility (axe) ─────────────────────────────────────────────────

describe('Pagination — accessibility (axe)', () => {
  it('default pagination has no axe violations', async () => {
    const { container } = render(
      <Pagination page={3} pageCount={10} onPageChange={vi.fn()} />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('with first/last buttons has no axe violations', async () => {
    const { container } = render(
      <Pagination page={5} pageCount={10} onPageChange={vi.fn()} showFirstLast />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('first page state has no axe violations', async () => {
    const { container } = render(
      <Pagination page={1} pageCount={10} onPageChange={vi.fn()} showFirstLast showPrevNext />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
