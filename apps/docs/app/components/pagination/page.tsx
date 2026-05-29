'use client';

import React, { useState } from 'react';
import { Pagination } from '@vhyxui/react';
import { paginationContract } from '@vhyxui/core';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlockSimple';
import { PropsTable } from '../../../components/PropsTable';
import { KeyboardTable } from '../../../components/KeyboardTable';
import { OnThisPage, type PageHeading } from '../../../components/OnThisPage';
import { PageNav } from '../../../components/PageNav';
import type { PropDef } from '../../../components/PropsTable';
import type { KeyboardRow } from '../../../components/KeyboardTable';

// ─── On This Page ──────────────────────────────────────────────────────────

const HEADINGS: ReadonlyArray<PageHeading> = [
  { id: 'interactive-example', text: 'Interactive Example', level: 2 },
  { id: 'import',             text: 'Import',              level: 2 },
  { id: 'variants',           text: 'Variants',            level: 2 },
  { id: 'sizes',              text: 'Sizes',               level: 2 },
  { id: 'props',              text: 'Props',               level: 2 },
  { id: 'accessibility',      text: 'Accessibility',       level: 2 },
  { id: 'keyboard',           text: 'Keyboard',            level: 2 },
  { id: 'agent-contract',     text: 'Agent Contract',      level: 2 },
  { id: 'theming',            text: 'Theming',             level: 2 },
  { id: 'examples',           text: 'Examples',            level: 2 },
] as const;

// ─── Props ─────────────────────────────────────────────────────────────────

const PROPS: PropDef[] = [
  { name: 'page',          type: 'number',                    description: 'Current active page (1-based). Required.' },
  { name: 'pageCount',     type: 'number',                    description: 'Total number of pages. Required.' },
  { name: 'onPageChange',  type: '(page: number) => void',    description: 'Called when the user navigates to a new page. Required.' },
  { name: 'siblingCount',  type: 'number',       default: '1', description: 'Number of sibling pages shown on each side of the current page.' },
  { name: 'showFirstLast', type: 'boolean',      default: 'false', description: 'Show first and last page buttons.' },
  { name: 'showPrevNext',  type: 'boolean',      default: 'true',  description: 'Show previous and next page buttons.' },
  { name: 'size',          type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the pagination buttons.' },
  { name: 'contract',      type: 'Partial<ComponentContract>', description: 'VhyxSeal contract override.' },
];

// ─── Keyboard ──────────────────────────────────────────────────────────────

const KEYBOARD: KeyboardRow[] = [
  { keys: ['Tab'],            action: 'Move focus through pagination buttons in order.' },
  { keys: ['Shift + Tab'],    action: 'Move focus backwards through pagination buttons.' },
  { keys: ['Enter', 'Space'], action: 'Activate the focused page button.' },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function PaginationPage(): React.ReactElement {
  const [page, setPage] = useState(4);
  const [pageLarge, setPageLarge] = useState(12);
  const [pageFirst, setPageFirst] = useState(3);
  const [pageNoNav, setPageNoNav] = useState(2);

  return (
    <div className="gs-layout">
      <main className="gs-content">

        <PageHeader
          name="Pagination"
          description="Page navigation control with configurable sibling count, optional first/last buttons, and full ARIA landmark pattern. Current page receives aria-current='page'. Previous/Next/First/Last buttons have descriptive aria-labels."
          tags={['Navigation', 'VhyxSeal']}
          stable
        />

        <Section id="interactive-example" title="Interactive example">
          <ComponentExample
            label="10-page result set — click to navigate"
            code={`const [page, setPage] = useState(4);

<Pagination
  page={page}
  pageCount={10}
  onPageChange={setPage}
/>`}
          >
            <Pagination page={page} pageCount={10} onPageChange={setPage} />
          </ComponentExample>
        </Section>

        <Section id="import" title="Import">
          <CodeBlock
            language="tsx"
            code={`import { Pagination } from '@vhyxui/react'`}
          />
        </Section>

        <Section id="variants" title="Variants">
          <ComponentExample
            label="With first and last page buttons"
            code={`<Pagination
  page={page}
  pageCount={20}
  onPageChange={setPage}
  showFirstLast
/>`}
          >
            <Pagination
              page={pageFirst}
              pageCount={20}
              onPageChange={setPageFirst}
              showFirstLast
            />
          </ComponentExample>

          <ComponentExample
            label="siblingCount={2} — wider page window"
            code={`<Pagination
  page={page}
  pageCount={50}
  onPageChange={setPage}
  siblingCount={2}
/>`}
          >
            <Pagination
              page={pageLarge}
              pageCount={50}
              onPageChange={setPageLarge}
              siblingCount={2}
            />
          </ComponentExample>

          <ComponentExample
            label="Without previous and next buttons"
            code={`<Pagination
  page={page}
  pageCount={8}
  onPageChange={setPage}
  showPrevNext={false}
/>`}
          >
            <Pagination
              page={pageNoNav}
              pageCount={8}
              onPageChange={setPageNoNav}
              showPrevNext={false}
            />
          </ComponentExample>
        </Section>

        <Section id="sizes" title="Sizes">
          <ComponentExample
            label="sm, md, lg"
            code={`<Pagination page={3} pageCount={10} onPageChange={setPage} size="sm" />
<Pagination page={3} pageCount={10} onPageChange={setPage} size="md" />
<Pagination page={3} pageCount={10} onPageChange={setPage} size="lg" />`}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-4)' }}>
              {(['sm', 'md', 'lg'] as const).map((s) => (
                <Pagination key={s} page={3} pageCount={10} onPageChange={() => {}} size={s} />
              ))}
            </div>
          </ComponentExample>
        </Section>

        <Section id="props" title="Props">
          <PropsTable props={PROPS} />
        </Section>

        <Section id="accessibility" title="Accessibility">
          <ul className="docs-a11y-list">
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Renders as <code>&lt;nav aria-label="Pagination"&gt;</code> — a navigable landmark.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Current page button gets <code>aria-current="page"</code> per ARIA spec.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Previous/Next buttons have <code>aria-label="Previous page"</code> / <code>aria-label="Next page"</code>.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> First/Last buttons have <code>aria-label="First page"</code> / <code>aria-label="Last page"</code>.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Disabled buttons (e.g. Previous on page 1) have <code>aria-disabled="true"</code>.</li>
            <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Ellipsis indicators are <code>aria-hidden="true"</code> — decorative only.</li>
          </ul>
        </Section>

        <Section id="keyboard" title="Keyboard navigation">
          <KeyboardTable rows={KEYBOARD} />
        </Section>

        <Section id="agent-contract" title="Agent contract" description="Default VhyxSeal contract shipped with every Pagination.">
          <CodeBlock
            language="json"
            filename="Default contract"
            code={JSON.stringify(paginationContract, null, 2)}
          />
        </Section>

        <Section id="theming" title="Theming" description="Override these CSS tokens to theme Pagination.">
          <div className="docs-tokens-grid">
            {[
              { name: '--vhyx-color-surface',       desc: 'Button background' },
              { name: '--vhyx-color-accent',         desc: 'Active page background' },
              { name: '--vhyx-color-text-on-accent', desc: 'Active page text color' },
              { name: '--vhyx-color-border',         desc: 'Button border' },
              { name: '--vhyx-radius-md',            desc: 'Button border radius' },
              { name: '--vhyx-size-sm / md / lg',    desc: 'Button height per size' },
              { name: '--vhyx-duration-fast',        desc: 'Hover transition duration' },
            ].map((t) => (
              <div key={t.name} className="docs-token-item">
                <span className="docs-token-name">{t.name}</span>
                <span className="docs-token-desc">{t.desc}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="examples" title="Examples">
          <h3 className="docs-subsection-heading">Search results — large dataset</h3>
          <ComponentExample
            label="247 pages with first/last buttons"
            code={`const [page, setPage] = useState(1);

<div>
  <p>Showing results {(page - 1) * 10 + 1}–{Math.min(page * 10, 2470)} of 2,470</p>
  <Pagination
    page={page}
    pageCount={247}
    onPageChange={setPage}
    showFirstLast
    siblingCount={1}
  />
</div>`}
          >
            <SearchResultsPagination />
          </ComponentExample>

          <h3 className="docs-subsection-heading">Controlled pagination</h3>
          <CodeBlock
            language="tsx"
            code={`const [page, setPage] = useState(1);

// Fetch data when page changes
useEffect(() => {
  fetchData({ page, perPage: 20 });
}, [page]);

<Pagination
  page={page}
  pageCount={Math.ceil(totalItems / 20)}
  onPageChange={setPage}
  showFirstLast
/>`}
          />
        </Section>

        <PageNav
          prev={{ title: 'Breadcrumb', href: '/components/breadcrumb' }}
        />

      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}

function SearchResultsPagination(): React.ReactElement {
  const [page, setPage] = useState(1);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-4)', width: '100%' }}>
      <p style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>
        Showing results {(page - 1) * 10 + 1}–{Math.min(page * 10, 2470)} of 2,470
      </p>
      <Pagination
        page={page}
        pageCount={247}
        onPageChange={setPage}
        showFirstLast
        siblingCount={1}
      />
    </div>
  );
}
