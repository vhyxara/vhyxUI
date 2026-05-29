import React from 'react';
import { codeToHtml } from 'shiki';
import { CopyButton } from './CopyButton';

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export async function CodeBlock({
  code,
  language,
  filename,
  showLineNumbers = false,
}: CodeBlockProps): Promise<React.ReactElement> {
  const trimmed = code.trim();
  const label = filename ?? `${language} code`;

  let rawHtml: string;
  try {
    rawHtml = await codeToHtml(trimmed, {
      lang: language,
      themes: {
        light: 'github-light',
        dark: 'dark-plus',
      },
      defaultColor: false,
    });
  } catch {
    const escaped = trimmed
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    rawHtml = `<pre><code>${escaped}</code></pre>`;
  }

  // Inject accessibility attributes onto the shiki-generated <pre>
  const html = rawHtml.replace(
    '<pre ',
    `<pre role="region" aria-label="${label}" `,
  );

  return (
    <div
      className="cb-wrap"
      data-line-numbers={showLineNumbers ? 'true' : undefined}
    >
      <div className="cb-header">
        {filename !== undefined
          ? <span className="cb-filename">{filename}</span>
          : <span />
        }
        <CopyButton code={trimmed} />
      </div>
      <div
        className="cb-body"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
