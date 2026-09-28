import React from 'react';
import { PageHeader } from '../../components/PageHeader';
import { Section } from '../../components/Section';
import { CodeBlock } from '../../components/CodeBlockSimple';
import { OnThisPage, type PageHeading } from '../../components/OnThisPage';
import { PageNav } from '../../components/PageNav';
import { IconGallery } from '../../components/IconGallery';

export const metadata = { title: 'Icons' };

const HEADINGS: ReadonlyArray<PageHeading> = [
  { id: 'install', text: 'Install', level: 2 },
  { id: 'react', text: 'React', level: 2 },
  { id: 'motion', text: 'Motion', level: 2 },
  { id: 'anywhere', text: 'Without React', level: 2 },
  { id: 'gallery', text: 'Gallery', level: 2 },
];

export default function IconsPage(): React.ReactElement {
  return (
    <div className="gs-layout">
      <main className="gs-content">
        <PageHeader
          stable={false}
          name="Icons"
          description="One icon set in every format: React components, framework-free SVG strings, a <vhyx-icon> web component and a sprite sheet. Sizes and stroke follow design tokens, motion is built in, and there are no runtime dependencies."
          tags={['@vhyxui/icons', 'New']}
        />
        <Section id="install" title="Install">
          <CodeBlock language="bash" code="pnpm add @vhyxui/icons" />
        </Section>
        <Section id="react" title="React">
          <CodeBlock language="tsx" code={`import { CheckIcon, TriangleAlertIcon } from '@vhyxui/icons';

<CheckIcon />                                   // 1em, follows the text colour
<TriangleAlertIcon size="sm" title="Warning" />  // token size, announced to screen readers
<CheckIcon size={20} strokeWidth={1.5} />`} />
          <p className="docs-section-text">
            Sizes <code>xs</code> to <code>xl</code> map to the <code>--vhyx-icon-size-*</code> tokens; stroke width follows
            <code> --vhyx-icon-stroke</code>. Icons are decorative unless you give them a <code>title</code> or <code>aria-label</code>.
            Each icon is a separate export, so only the icons you import are bundled.
          </p>
        </Section>
        <Section id="motion" title="Motion">
          <CodeBlock language="tsx" code={`import '@vhyxui/icons/style.css';

<CheckIcon animate="draw" />       // strokes draw in
<LoaderCircleIcon animate="spin" />`} />
          <p className="docs-section-text">Animations use the motion tokens and stop automatically under reduced motion.</p>
        </Section>
        <Section id="anywhere" title="Without React">
          <CodeBlock language="ts" code={`import { toSvg, checkNode } from '@vhyxui/icons/svg';
element.innerHTML = toSvg(checkNode, { size: 'sm', title: 'Done' });

import { defineIconElement } from '@vhyxui/icons/element';
defineIconElement();   // <vhyx-icon name="check" size="sm" label="Saved"></vhyx-icon>`} />
          <p className="docs-section-text">
            Also available: <code>@vhyxui/icons/sprite.svg</code> (every icon as a <code>&lt;symbol&gt;</code>) and each source drawing at
            <code> @vhyxui/icons/icons/&lt;name&gt;.svg</code>.
          </p>
        </Section>
        <Section id="gallery" title="Gallery">
          <p className="docs-section-text">Search by name or keyword. Click an icon to copy its import.</p>
          <IconGallery />
        </Section>
        <PageNav prev={{ title: 'Tokens', href: '/docs/tokens' }} next={{ title: 'Agent Contracts', href: '/agent-contracts' }} />
      </main>
      <OnThisPage headings={HEADINGS} />
    </div>
  );
}
