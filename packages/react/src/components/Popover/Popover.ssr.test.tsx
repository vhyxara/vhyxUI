// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { Popover } from './Popover';

// Runs in the `node` vitest environment (no jsdom) specifically so `document`
// is genuinely undefined, the same condition Next.js App Router's SSR pass
// hits for a 'use client' component's first render on the server. Reproduces
// finding #10: PopoverContent previously called
// `ReactDOM.createPortal(content, document.body)` unconditionally whenever
// `ctx.open` was true, with no client-only guard — a `ReferenceError:
// document is not defined` crash for any `<Popover defaultOpen>` (or
// initially-open controlled Popover) server-rendered.
describe('Popover — SSR (no document global)', () => {
  it('does not crash rendering server-side when open on first render', () => {
    expect(() =>
      renderToString(
        <Popover defaultOpen>
          <Popover.Trigger>Open</Popover.Trigger>
          <Popover.Content>
            <p>Body</p>
          </Popover.Content>
        </Popover>,
      ),
    ).not.toThrow();
  });

  it('defers Popover.Content to client mount — no content markup in the SSR output', () => {
    const html = renderToString(
      <Popover defaultOpen>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>
          <p>Content should not appear in server-rendered markup</p>
        </Popover.Content>
      </Popover>,
    );
    expect(html).not.toContain('Content should not appear in server-rendered markup');
  });

  it('still server-renders the trigger normally', () => {
    const html = renderToString(
      <Popover defaultOpen>
        <Popover.Trigger>Open trigger</Popover.Trigger>
        <Popover.Content>
          <p>Body</p>
        </Popover.Content>
      </Popover>,
    );
    expect(html).toContain('Open trigger');
  });
});
