'use client';

import React from 'react';
import type { ComponentContract } from '@vhyxui/core';
import { tableContract } from '@vhyxui/core';
import { withAgentContract } from '@vhyxseal/react';
import { cx } from '../../utils/cx';
import styles from './Table.module.css';

/** Column definition for the data-driven shorthand. */
export interface TableColumn<Row> {
  /** Unique key; also the default accessor into the row. */
  key: string;
  /** Header content. */
  header: React.ReactNode;
  /** Custom cell renderer. Defaults to `String(row[key])`. */
  cell?: (row: Row, index: number) => React.ReactNode;
  /** Text alignment — use `end` for numbers. */
  align?: 'start' | 'center' | 'end';
  /** CSS width, e.g. `'8rem'`. */
  width?: string;
}

/** Props for Table. */
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** Zebra rows. */
  striped?: boolean;
  /** Highlight row under the pointer. @default true */
  hoverable?: boolean;
  /** @default 'comfortable' */
  density?: 'comfortable' | 'compact';
  /** Accessible caption (rendered below the table). */
  caption?: React.ReactNode;
  /** Shorthand: column definitions. Use with `data`. */
  columns?: TableColumn<Record<string, unknown>>[];
  /** Shorthand: rows. Use with `columns`. */
  data?: Record<string, unknown>[];
  /** Row key accessor for the shorthand. Defaults to `row.id` or the index. */
  rowKey?: (row: Record<string, unknown>, index: number) => string;
  /** Shown when `data` is empty. */
  emptyState?: React.ReactNode;
  /** VhyxSeal contract override. */
  contract?: Partial<ComponentContract>;
}

function defaultCell(row: Record<string, unknown>, key: string): React.ReactNode {
  const value = row[key];
  if (value === null || value === undefined) return '—';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
  return React.isValidElement(value) ? value : JSON.stringify(value);
}

/**
 * Table — accessible native table with the shorthand `columns` + `data` API.
 *
 * @example
 * <Table
 *   columns={[{ key: 'name', header: 'Name' }, { key: 'mrr', header: 'MRR', align: 'end' }]}
 *   data={[{ id: 1, name: 'Acme', mrr: '$4,200' }]}
 * />
 *
 * @example
 * <Table>
 *   <Table.Head><Table.Row><Table.Header>Name</Table.Header></Table.Row></Table.Head>
 *   <Table.Body><Table.Row><Table.Cell>Acme</Table.Cell></Table.Row></Table.Body>
 * </Table>
 */
const TableRoot = React.forwardRef<HTMLTableElement, TableProps>(
  (
    { striped = false, hoverable = true, density = 'comfortable', caption, columns, data, rowKey, emptyState, contract, className, children, ...rest },
    ref,
  ) => (
    <div className={styles['wrapper']}>
      <table
        ref={ref}
        className={cx(styles['table'], className)}
        data-striped={striped ? 'true' : undefined}
        data-hover={hoverable ? 'true' : undefined}
        data-density={density}
        data-vhyx-contract={contract ? JSON.stringify({ ...tableContract, ...contract }) : undefined}
        {...rest}
      >
        {caption && <caption className={styles['caption']}>{caption}</caption>}
        {columns ? (
          <>
            <TableHead>
              <TableRow>
                {columns.map((c) => (
                  <TableHeader key={c.key} align={c.align ?? 'start'} style={c.width ? { width: c.width } : undefined}>
                    {c.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(data ?? []).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    {emptyState ?? 'No data'}
                  </TableCell>
                </TableRow>
              ) : (
                (data ?? []).map((row, i) => (
                  <TableRow key={rowKey ? rowKey(row, i) : String(row['id'] ?? i)}>
                    {columns.map((c) => (
                      <TableCell key={c.key} align={c.align ?? 'start'}>
                        {c.cell ? c.cell(row, i) : defaultCell(row, c.key)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </>
        ) : (
          children
        )}
      </table>
    </div>
  ),
);
TableRoot.displayName = 'VhyxTable';

const TableHead = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...rest }, ref) => <thead ref={ref} className={cx(styles['head'], className)} {...rest} />,
);
TableHead.displayName = 'VhyxTableHead';

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...rest }, ref) => <tbody ref={ref} className={cx(styles['body'], className)} {...rest} />,
);
TableBody.displayName = 'VhyxTableBody';

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...rest }, ref) => <tr ref={ref} className={cx(styles['row'], className)} {...rest} />,
);
TableRow.displayName = 'VhyxTableRow';

/** Props for header/data cells. */
export interface TableCellProps extends Omit<React.TdHTMLAttributes<HTMLTableCellElement>, 'align'> {
  align?: 'start' | 'center' | 'end';
}

const TableHeader = React.forwardRef<HTMLTableCellElement, TableCellProps>(({ align, className, ...rest }, ref) => (
  <th ref={ref} scope="col" className={cx(styles['th'], className)} data-align={align} {...rest} />
));
TableHeader.displayName = 'VhyxTableHeader';

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(({ align, className, ...rest }, ref) => (
  <td ref={ref} className={cx(styles['td'], className)} data-align={align} {...rest} />
));
TableCell.displayName = 'VhyxTableCell';

const tableSealContract = { ...tableContract, id: 'vhyxui-table' } as Readonly<ComponentContract>;

type TableComponent = React.ForwardRefExoticComponent<TableProps & React.RefAttributes<HTMLTableElement>> & {
  Head: typeof TableHead;
  Body: typeof TableBody;
  Row: typeof TableRow;
  Header: typeof TableHeader;
  Cell: typeof TableCell;
};

// withAgentContract preserves props and forwards refs; statics are attached below.
export const Table = Object.assign(withAgentContract(TableRoot, tableSealContract), {
  Head: TableHead,
  Body: TableBody,
  Row: TableRow,
  Header: TableHeader,
  Cell: TableCell,
}) as TableComponent;
