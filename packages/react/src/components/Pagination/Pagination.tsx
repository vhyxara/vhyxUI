'use client';

import React, { useMemo } from 'react';
import type { ComponentContract } from '@vhyxui/core';
import { paginationContract } from '@vhyxui/core';
import { useId } from '../shared/useId';
import styles from './Pagination.module.css';

/** Size tokens for Pagination. */
export type PaginationSize = 'sm' | 'md' | 'lg';

/** Props for the Pagination component. */
export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** Current page (1-indexed). */
  page: number;
  /** Total number of pages. */
  pageCount: number;
  /** Called when the user activates a page button. */
  onPageChange: (page: number) => void;
  /**
   * Number of sibling pages shown on each side of the current page.
   * @default 1
   */
  siblingCount?: number;
  /** When true, renders First and Last buttons. @default false */
  showFirstLast?: boolean;
  /** When true, renders Previous and Next buttons. @default true */
  showPrevNext?: boolean;
  /** Size of the pagination buttons. @default 'md' */
  size?: PaginationSize;
  /** VhyxSeal contract override. */
  contract?: Partial<ComponentContract>;
}

/** Sentinel value for rendered ellipsis gaps. */
const ELLIPSIS = 'ellipsis';

/**
 * Builds the page range to display.
 * Returns an array of page numbers and 'ellipsis' sentinels.
 */
function buildRange(
  page: number,
  pageCount: number,
  siblingCount: number,
): (number | typeof ELLIPSIS)[] {
  const totalSlots = siblingCount * 2 + 5; // siblings + current + 2 ends + 2 ellipsis slots

  if (pageCount <= totalSlots) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(page - siblingCount, 2);
  const rightSibling = Math.min(page + siblingCount, pageCount - 1);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < pageCount - 1;

  const range: (number | typeof ELLIPSIS)[] = [1];

  if (showLeftEllipsis) range.push(ELLIPSIS);

  for (let i = leftSibling; i <= rightSibling; i++) {
    range.push(i);
  }

  if (showRightEllipsis) range.push(ELLIPSIS);
  range.push(pageCount);

  return range;
}

/**
 * Pagination — navigation component for paginated data sets.
 *
 * Always renders as a `<nav aria-label="Pagination">`.
 * Current page button has `aria-current="page"`.
 * Previous/Next/First/Last have descriptive aria-labels.
 * Disabled at boundaries (first/last page).
 *
 * @example
 * <Pagination
 *   page={3}
 *   pageCount={10}
 *   onPageChange={setPage}
 *   siblingCount={1}
 *   showFirstLast
 * />
 */
export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      page,
      pageCount,
      onPageChange,
      siblingCount = 1,
      showFirstLast = false,
      showPrevNext = true,
      size = 'md',
      contract,
      className,
      ...rest
    },
    ref,
  ) => {
    const paginationId = useId('vhyx-pagination');

    const effectiveContract: Partial<ComponentContract> = useMemo(
      () => ({ ...paginationContract, id: paginationId, ...contract }),
      [paginationId, contract],
    );

    const range = useMemo(
      () => buildRange(page, pageCount, siblingCount),
      [page, pageCount, siblingCount],
    );

    const isFirst = page <= 1;
    const isLast = page >= pageCount;

    const navClass = [styles['nav'], className].filter(Boolean).join(' ');

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={navClass}
        data-size={size}
        data-vhyx-contract={JSON.stringify(effectiveContract)}
        {...rest}
      >
        <ul className={styles['list']}>
          {showFirstLast && (
            <li>
              <button
                type="button"
                className={styles['button']}
                onClick={() => onPageChange(1)}
                disabled={isFirst}
                aria-label="First page"
                data-size={size}
              >
                «
              </button>
            </li>
          )}

          {showPrevNext && (
            <li>
              <button
                type="button"
                className={styles['button']}
                onClick={() => onPageChange(page - 1)}
                disabled={isFirst}
                aria-label="Previous page"
                data-size={size}
              >
                ‹
              </button>
            </li>
          )}

          {range.map((item, idx) => {
            if (item === ELLIPSIS) {
              return (
                <li key={`ellipsis-${idx}`}>
                  <span className={styles['ellipsis']} aria-hidden="true">
                    …
                  </span>
                </li>
              );
            }

            const pageNum = item as number;
            const isCurrent = pageNum === page;

            return (
              <li key={pageNum}>
                <button
                  type="button"
                  className={styles['button']}
                  onClick={() => !isCurrent && onPageChange(pageNum)}
                  aria-current={isCurrent ? 'page' : undefined}
                  aria-label={isCurrent ? undefined : `Page ${pageNum}`}
                  data-state={isCurrent ? 'active' : 'inactive'}
                  data-size={size}
                >
                  {pageNum}
                </button>
              </li>
            );
          })}

          {showPrevNext && (
            <li>
              <button
                type="button"
                className={styles['button']}
                onClick={() => onPageChange(page + 1)}
                disabled={isLast}
                aria-label="Next page"
                data-size={size}
              >
                ›
              </button>
            </li>
          )}

          {showFirstLast && (
            <li>
              <button
                type="button"
                className={styles['button']}
                onClick={() => onPageChange(pageCount)}
                disabled={isLast}
                aria-label="Last page"
                data-size={size}
              >
                »
              </button>
            </li>
          )}
        </ul>
      </nav>
    );
  },
);

Pagination.displayName = 'VhyxPagination';
