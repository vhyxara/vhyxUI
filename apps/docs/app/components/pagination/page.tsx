'use client';

import React, { useState } from 'react';
import { Pagination, Separator } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlock';
import { PropsTable } from '../../../components/PropsTable';
import { KeyboardTable } from '../../../components/KeyboardTable';
import type { PropDef } from '../../../components/PropsTable';
import type { KeyboardRow } from '../../../components/KeyboardTable';

const PROPS: PropDef[] = [
  { name: 'page', type: 'number', required: true, description: 'Current page number (1-indexed).' },
  { name: 'pageCount', type: 'number', required: true, description: 'Total number of pages.' },
  { name: 'onPageChange', type: '(page: number) => void', required: true, description: 'Called when user navigates to a new page.' },
  { name: 'siblingCount', type: 'number', default: '1', description: 'Number of page buttons visible around the current page.' },
  { name: 'showFirstLast', type: 'boolean', default: 'false', description: 'Shows First and Last page buttons.' },
  { name: 'showPrevNext', type: 'boolean', default: 'true', description: 'Shows Previous and Next buttons.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the pagination buttons.' },
];

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Tab'], action: 'Move focus between page buttons.' },
  { keys: ['Enter', 'Space'], action: 'Navigate to the focused page.' },
];

export default function PaginationPage(): React.ReactElement {
  const [page, setPage] = useState(1);
  const [page2, setPage2] = useState(5);

  return (
    <>
      <PageHeader name="Pagination" description="Page navigation with ellipsis sentinels, configurable siblings, and first/last/prev/next buttons. Current page receives aria-current." tags={['Navigation', 'VhyxSeal']} />

      <Section title="Interactive example">
        <ComponentExample label="Click to navigate" center code={`<Pagination page={page} pageCount={20} onPageChange={setPage} />`}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--vhyx-space-2)' }}>
            <Pagination page={page} pageCount={20} onPageChange={setPage} showFirstLast />
            <p style={{ fontSize: 'var(--vhyx-text-xs)', color: 'var(--vhyx-color-text-muted)' }}>Page {page} of 20</p>
          </div>
        </ComponentExample>
      </Section>

      <Section title="Import"><CodeBlock code={`import { Pagination } from '@vhyxui/react'`} /></Section>

      <Section title="Variants">
        <ComponentExample label="With more siblings" center code={`<Pagination page={5} pageCount={20} siblingCount={2} />`}>
          <Pagination page={page2} pageCount={20} onPageChange={setPage2} siblingCount={2} />
        </ComponentExample>
        <ComponentExample label="With first/last buttons" center code={`<Pagination page={1} pageCount={10} showFirstLast />`}>
          <Pagination page={page} pageCount={10} onPageChange={setPage} showFirstLast />
        </ComponentExample>
        <ComponentExample label="Without prev/next" center code={`<Pagination page={1} pageCount={8} showPrevNext={false} />`}>
          <Pagination page={page} pageCount={8} onPageChange={setPage} showPrevNext={false} />
        </ComponentExample>
      </Section>

      <Section title="Sizes">
        <ComponentExample label="sm, md, lg" center>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-3)', alignItems: 'center' }}>
            <Pagination page={3} pageCount={10} onPageChange={() => {}} size="sm" />
            <Pagination page={3} pageCount={10} onPageChange={() => {}} size="md" />
            <Pagination page={3} pageCount={10} onPageChange={() => {}} size="lg" />
          </div>
        </ComponentExample>
      </Section>

      <Section title="Props"><PropsTable props={PROPS} /></Section>

      <Section title="Accessibility">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> <code>&lt;nav aria-label="Pagination"&gt;</code> — landmark for screen readers.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Current page button has <code>aria-current="page"</code>.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Prev/Next/First/Last have descriptive <code>aria-label</code>.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Boundary buttons (prev at page 1, next at last page) are <code>disabled</code>.</li>
        </ul>
      </Section>

      <Section title="Keyboard navigation"><KeyboardTable rows={KEYBOARD} /></Section>

      <Section title="Agent contract">
        <div className="docs-contract">
          {[{ key: 'type', value: '"navigation"' }, { key: 'intent', value: '"paginate-content"' }, { key: 'safetyLevel', value: '"low"' }].map((r) => (
            <div key={r.key} className="docs-contract-row"><span className="docs-contract-key">{r.key}</span><span className="docs-contract-value">{r.value}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Theming">
        <div className="docs-tokens-grid">
          {[{ name: '--vhyx-color-accent-subtle', desc: 'Current page background' }, { name: '--vhyx-size-sm/md/lg', desc: 'Button dimensions' }, { name: '--vhyx-radius-md', desc: 'Button radius' }].map((t) => (
            <div key={t.name} className="docs-token-item"><span className="docs-token-name">{t.name}</span><span className="docs-token-desc">{t.desc}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Examples">
        <ComponentExample label="Search results" center code={`<Pagination page={page} pageCount={247} onPageChange={setPage} showFirstLast />`}>
          <Pagination page={page} pageCount={247} onPageChange={setPage} showFirstLast />
        </ComponentExample>
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <a href="/components/breadcrumb" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>← Breadcrumb</a>
        <a href="/components/toast" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>Toast →</a>
      </div>
    </>
  );
}
