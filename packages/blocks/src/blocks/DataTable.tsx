import React, { useMemo, useState } from 'react';
import { HStack, Input, Pagination, Stack, Table, Text, type TableColumn } from '@vhyxui/react';

/** Props for DataTable. */
export interface DataTableProps<Row extends Record<string, unknown>> {
  columns: TableColumn<Row>[];
  data: Row[];
  /** Rows per page. @default 10 */
  pageSize?: number;
  /** Show a search box that filters across these keys. */
  searchKeys?: Array<keyof Row & string>;
  searchPlaceholder?: string;
  /** Keys that can be sorted by clicking the header. */
  sortableKeys?: Array<keyof Row & string>;
  caption?: React.ReactNode;
  emptyState?: React.ReactNode;
  /** Slot rendered next to the search box (filters, export button…). */
  toolbar?: React.ReactNode;
}

type SortState = { key: string; dir: 'asc' | 'desc' } | null;

function compare(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a ?? '').localeCompare(String(b ?? ''), undefined, { numeric: true, sensitivity: 'base' });
}

/**
 * DataTable — Table + search + sorting + pagination, client-side, zero config.
 * @example
 * <DataTable columns={columns} data={customers} searchKeys={['name', 'email']} sortableKeys={['name', 'mrr']} />
 */
export function DataTable<Row extends Record<string, unknown>>({
  columns,
  data,
  pageSize = 10,
  searchKeys = [],
  searchPlaceholder = 'Search…',
  sortableKeys = [],
  caption,
  emptyState,
  toolbar,
}: DataTableProps<Row>): React.ReactElement {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortState>(null);
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = q ? data.filter((row) => searchKeys.some((k) => String(row[k] ?? '').toLowerCase().includes(q))) : data;
    if (sort) {
      out = [...out].sort((a, b) => compare(a[sort.key], b[sort.key]) * (sort.dir === 'asc' ? 1 : -1));
    }
    return out;
  }, [data, query, searchKeys, sort]);

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, pageCount);
  const visible = rows.slice((current - 1) * pageSize, current * pageSize);

  const sortable = new Set<string>(sortableKeys);
  const headerFor = (col: TableColumn<Row>): React.ReactNode => {
    if (!sortable.has(col.key)) return col.header;
    const active = sort?.key === col.key ? sort.dir : null;
    const next: SortState = active === 'asc' ? { key: col.key, dir: 'desc' } : active === 'desc' ? null : { key: col.key, dir: 'asc' };
    return (
      <button
        type="button"
        onClick={() => setSort(next)}
        aria-label={`Sort by ${typeof col.header === 'string' ? col.header : col.key}`}
        aria-sort={active === 'asc' ? 'ascending' : active === 'desc' ? 'descending' : 'none'}
        style={{ all: 'unset', cursor: 'pointer', display: 'inline-flex', gap: 4 }}
      >
        {col.header}
        <span aria-hidden="true">{active === 'asc' ? '▲' : active === 'desc' ? '▼' : '↕'}</span>
      </button>
    );
  };

  // Table's shorthand is typed for generic records; Row is a specialisation of it.
  const tableColumns = columns.map((c) => ({ ...c, header: headerFor(c) })) as unknown as TableColumn<Record<string, unknown>>[];

  return (
    <Stack gap={3}>
      {(searchKeys.length > 0 || toolbar) && (
        <HStack justify="between" gap={3} wrap>
          {searchKeys.length > 0 && (
            <div style={{ flex: '1 1 16rem', maxWidth: '20rem' }}>
              <Input
                type="search"
                aria-label="Search table"
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          )}
          {toolbar}
        </HStack>
      )}
      <Table
        columns={tableColumns}
        data={visible}
        caption={caption}
        emptyState={emptyState ?? (query ? `No results for “${query}”` : 'No data')}
      />
      {rows.length > pageSize && (
        <HStack justify="between" wrap gap={3}>
          <Text size="sm" tone="subtle">
            {(current - 1) * pageSize + 1}–{Math.min(current * pageSize, rows.length)} of {rows.length}
          </Text>
          <Pagination page={current} pageCount={pageCount} onPageChange={setPage} size="sm" />
        </HStack>
      )}
    </Stack>
  );
}
