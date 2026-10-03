'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { ComponentDef } from './component-defs';
import { effectiveContract } from './contract';

export type ConsoleTone = 'muted' | 'ok' | 'warn' | 'stop';

export interface ConsoleLine {
  id: number;
  time: string;
  text: string;
  tone: ConsoleTone;
}

let nextId = 0;
const stamp = (): string => new Date().toLocaleTimeString('en-GB', { hour12: false });
export const consoleLine = (text: string, tone: ConsoleTone): ConsoleLine => ({ id: ++nextId, time: stamp(), text, tone });

/** What an agent decides when it activates a component with this contract. */
export function verdict(contract: Record<string, string>): { text: string; tone: ConsoleTone } {
  if (contract['requiresConfirmation'] === 'true') return { text: 'confirmation required → the agent asks the user', tone: 'stop' };
  if (contract['safetyLevel'] === 'medium') return { text: 'allowed · logged for review', tone: 'warn' };
  return { text: 'allowed', tone: 'ok' };
}

interface AgentConsoleProps {
  def: ComponentDef;
  props: Record<string, unknown>;
  lines: ConsoleLine[];
  onLines: (update: (current: ConsoleLine[]) => ConsoleLine[]) => void;
}

/** Live log of what an agent reads as the component and its props change. */
export function AgentConsole({ def, props, lines, onLines }: AgentConsoleProps): React.ReactElement {
  const { contract, upgraded } = effectiveContract(def, props);
  const summary = `intent=${contract['intent'] ?? '—'} safety=${contract['safetyLevel'] ?? 'none'}`;
  const listRef = useRef<HTMLOListElement>(null);
  const [first, setFirst] = useState(true);

  // Re-read the contract whenever it changes; the first read is the page load.
  useEffect(() => {
    const empty = Object.keys(contract).length === 0;
    onLines((current) => [
      ...current,
      consoleLine(empty ? `read  ${def.id}  no contract (layout only, agents skip it)` : `read  ${def.id}  ${summary}`, 'muted'),
      ...(!first && upgraded.length > 0 ? [consoleLine(`upgrade  ${upgraded.join(', ')} changed by variant`, 'warn')] : []),
    ].slice(-40));
    setFirst(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [def.id, summary, upgraded.join()]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  return (
    <section className="pg-console" aria-labelledby="pg-console-title">
      <div className="pg-console-head">
        <strong id="pg-console-title">Agent console</strong>
        <span className="pg-console-live">● live</span>
        <span className="pg-console-hint">what an agent sees as you interact with the preview</span>
        <button type="button" className="pg-console-clear" onClick={() => { onLines(() => []); }}>Clear</button>
      </div>
      <ol className="pg-console-lines" ref={listRef} aria-live="polite">
        {lines.map((l) => (
          <li key={l.id} className={`pg-console-line pg-console-line--${l.tone}`}>
            <span className="pg-console-time">{l.time}</span> › {l.text}
          </li>
        ))}
      </ol>
    </section>
  );
}
