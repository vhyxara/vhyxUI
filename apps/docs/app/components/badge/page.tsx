'use client';

import React from 'react';
import { Badge, Separator } from '@vhyxui/react';
import { PageHeader } from '../../../components/PageHeader';
import { Section } from '../../../components/Section';
import { ComponentExample } from '../../../components/ComponentExample';
import { CodeBlock } from '../../../components/CodeBlock';
import { PropsTable } from '../../../components/PropsTable';
import type { PropDef } from '../../../components/PropsTable';

const PROPS: PropDef[] = [
  { name: 'variant', type: "'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline'", default: "'default'", description: 'Visual variant.' },
  { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the badge.' },
  { name: 'dot', type: 'boolean', default: 'false', description: 'Renders as a small circular dot indicator with no text.' },
  { name: 'count', type: 'number', description: 'Numeric count. Truncated at max.' },
  { name: 'max', type: 'number', default: '99', description: 'Maximum count before displaying max+.' },
];

export default function BadgePage(): React.ReactElement {
  return (
    <>
      <PageHeader name="Badge" description="Small status label, count indicator, or categorical marker. Six variants, dot mode, and count truncation built in." tags={['Display', 'No contract']} />

      <Section title="Interactive example">
        <ComponentExample label="Badges in context" code={`<Badge variant="success">Active</Badge>`}>
          <Badge variant="success">Active</Badge>
          <Badge variant="warning">Pending</Badge>
          <Badge variant="danger">Error</Badge>
          <Badge variant="info">Update</Badge>
          <Badge count={42} />
        </ComponentExample>
      </Section>

      <Section title="Import"><CodeBlock code={`import { Badge } from '@vhyxui/react'`} /></Section>

      <Section title="Variants">
        <ComponentExample label="All 6 variants" code={`<Badge variant="default">Default</Badge>\n<Badge variant="success">Success</Badge>\n<Badge variant="warning">Warning</Badge>\n<Badge variant="danger">Danger</Badge>\n<Badge variant="info">Info</Badge>\n<Badge variant="outline">Outline</Badge>`}>
          <Badge variant="default">Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="outline">Outline</Badge>
        </ComponentExample>
      </Section>

      <Section title="Sizes">
        <ComponentExample label="sm, md, lg">
          <Badge size="sm">Small</Badge>
          <Badge size="md">Medium</Badge>
          <Badge size="lg">Large</Badge>
        </ComponentExample>
      </Section>

      <Section title="States">
        <ComponentExample label="Dot mode — notification indicators" code={`<Badge dot variant="danger" />`}>
          <Badge dot />
          <Badge dot variant="success" />
          <Badge dot variant="danger" />
          <Badge dot variant="warning" />
          <Badge dot variant="info" />
        </ComponentExample>
        <ComponentExample label="Count with truncation" code={`<Badge count={7} />\n<Badge count={42} />\n<Badge count={120} max={99} />`}>
          <Badge count={7} />
          <Badge count={42} />
          <Badge count={120} max={99} />
          <Badge count={9999} max={999} />
        </ComponentExample>
      </Section>

      <Section title="Props"><PropsTable props={PROPS} /></Section>

      <Section title="Accessibility">
        <ul className="docs-a11y-list">
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Dot badges are <code>aria-hidden</code> — purely decorative.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Text badges are readable by screen readers directly.</li>
          <li className="docs-a11y-item"><span className="docs-a11y-icon">✓</span> Count badges — add context via adjacent text or <code>aria-label</code> on parent.</li>
        </ul>
      </Section>

      <Section title="Agent contract">
        <p className="docs-section-text">Badge has no VhyxSeal contract — it is purely informational display with no agent-actionable behavior.</p>
      </Section>

      <Section title="Theming">
        <div className="docs-tokens-grid">
          {[{ name: '--vhyx-color-success', desc: 'Success background' }, { name: '--vhyx-color-danger', desc: 'Danger background' }, { name: '--vhyx-radius-full', desc: 'Pill shape' }, { name: '--vhyx-text-xs', desc: 'Font size' }].map((t) => (
            <div key={t.name} className="docs-token-item"><span className="docs-token-name">{t.name}</span><span className="docs-token-desc">{t.desc}</span></div>
          ))}
        </div>
      </Section>

      <Section title="Examples">
        <ComponentExample label="Status in a list" code={`<Badge variant="success">Published</Badge>`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-2)', width: '20rem' }}>
            {[
              { name: 'Homepage redesign', status: 'Published', variant: 'success' as const },
              { name: 'Mobile nav', status: 'Draft', variant: 'default' as const },
              { name: 'Dark mode', status: 'Review', variant: 'warning' as const },
            ].map((item) => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--vhyx-text-sm)' }}>
                <span>{item.name}</span>
                <Badge variant={item.variant} size="sm">{item.status}</Badge>
              </div>
            ))}
          </div>
        </ComponentExample>
      </Section>

      <Separator decorative style={{ margin: 'var(--vhyx-space-8) 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
        <a href="/components/select" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>← Select</a>
        <a href="/components/progress" style={{ color: 'var(--vhyx-color-accent)', textDecoration: 'none' }}>Progress →</a>
      </div>
    </>
  );
}
