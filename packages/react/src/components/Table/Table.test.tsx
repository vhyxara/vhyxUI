import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { Table } from './Table';

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'mrr', header: 'MRR', align: 'end' as const },
  { key: 'status', header: 'Status', cell: (row: Record<string, unknown>) => <strong>{String(row['status'])}</strong> },
];
const data = [
  { id: 1, name: 'Acme', mrr: 4200, status: 'active' },
  { id: 2, name: 'Globex', mrr: null, status: 'trial' },
];

describe('Table', () => {
  it('renders headers and rows from columns + data', () => {
    render(<Table columns={columns} data={data} caption="Customers" />);
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual(['Name', 'MRR', 'Status']);
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getByText('4200').dataset['align']).toBe('end');
    expect(screen.getByText('—')).toBeInTheDocument();
    expect(screen.getByText('active').tagName).toBe('STRONG');
    expect(screen.getByText('Customers').tagName).toBe('CAPTION');
  });

  it('shows the empty state', () => {
    render(<Table columns={columns} data={[]} emptyState="Nothing yet" />);
    expect(screen.getByText('Nothing yet')).toHaveAttribute('colspan', '3');
  });

  it('supports compound children', () => {
    render(
      <Table striped density="compact">
        <Table.Head><Table.Row><Table.Header>Name</Table.Header></Table.Row></Table.Head>
        <Table.Body><Table.Row><Table.Cell>Acme</Table.Cell></Table.Row></Table.Body>
      </Table>,
    );
    const table = screen.getByRole('table');
    expect(table.dataset['striped']).toBe('true');
    expect(table.dataset['density']).toBe('compact');
    expect(within(table).getByRole('columnheader')).toHaveAttribute('scope', 'col');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Table columns={columns} data={data} caption="Customers" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
