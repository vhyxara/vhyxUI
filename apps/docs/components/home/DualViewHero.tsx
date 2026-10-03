'use client';

import React, { useState } from 'react';
import { Button, Switch, TextField } from '@vhyxui/react';

type Safety = 'low' | 'medium' | 'critical';
type Tone = 'muted' | 'ok' | 'stop';

interface LogLine {
  id: number;
  text: string;
  tone: Tone;
}

interface ContractRow {
  id: string;
  kind: string;
  safety: Safety;
}

const CONTRACTS: ContractRow[] = [
  { id: 'display-name', kind: 'input', safety: 'low' },
  { id: 'weekly-summary', kind: 'toggle', safety: 'low' },
  { id: 'save-changes', kind: 'update-profile', safety: 'medium' },
  { id: 'delete-account', kind: 'destructive', safety: 'critical' },
];

let lineId = 0;
const line = (text: string, tone: Tone): LogLine => ({ id: ++lineId, text, tone });

const START: LogLine[] = [
  line('› fetch /__agent__/manifest.json', 'muted'),
  line('✓ signature valid · 4 contracts', 'ok'),
];

/**
 * The docs hero: one settings screen seen three ways — the form a person uses (real VhyxUI components),
 * the agent's log, and the contracts the agent reads. Interacting with the form updates the other two.
 */
export function DualViewHero(): React.ReactElement {
  const [name, setName] = useState('Ada Lovelace');
  const [summary, setSummary] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const [log, setLog] = useState<LogLine[]>(START);
  const [waiting, setWaiting] = useState(false);

  function record(id: string, lines: LogLine[]): void {
    setActive(id);
    setLog((current) => [...current, ...lines].slice(-6));
  }

  return (
    <div className="hv">
      <section className="hv-pane hv-human" aria-labelledby="hv-human-title">
        <span className="hv-eyebrow">01 · What the person sees</span>
        <div className="hv-card">
          <h3 id="hv-human-title" className="hv-card-title">Account settings</h3>
          <TextField
            name="display-name"
            label="Display name"
            value={name}
            onChange={(e) => { setName(e.target.value); }}
            onBlur={() => { record('display-name', [line('› display-name · input', 'muted'), line('✓ low · allowed', 'ok')]); }}
          />
          <div className="hv-row">
            <span id="hv-summary-label">Weekly summary</span>
            <Switch
              aria-labelledby="hv-summary-label"
              checked={summary}
              onCheckedChange={(on) => {
                setSummary(on);
                record('weekly-summary', [line(`› weekly-summary → ${on ? 'on' : 'off'}`, 'muted'), line('✓ low · allowed', 'ok')]);
              }}
            />
          </div>
          <div className="hv-actions">
            <Button
              onClick={() => {
                setWaiting(false);
                record('save-changes', [line('› save-changes · update-profile', 'muted'), line('✓ medium · allowed', 'ok')]);
              }}
            >
              Save changes
            </Button>
            <Button
              variant="outline"
              className="hv-danger"
              onClick={() => {
                setWaiting(true);
                record('delete-account', [line('› delete-account · destructive', 'muted'), line('■ critical · needs a person', 'stop')]);
              }}
            >
              Delete account
            </Button>
          </div>
        </div>
        <span className="hv-hint">Try it: edit, toggle, save or delete.</span>
      </section>

      <section className="hv-pane hv-log" aria-labelledby="hv-log-title">
        <span id="hv-log-title" className="hv-eyebrow">02 · Agent log</span>
        <ol className="hv-lines" aria-live="polite">
          {log.map((l) => (
            <li key={l.id} className={`hv-line hv-line--${l.tone}`}>{l.text}</li>
          ))}
        </ol>
        <p className="hv-note" data-waiting={waiting ? 'true' : 'false'}>
          {waiting ? 'The agent pauses and asks the user to confirm.' : 'Agents act on low and medium actions, and stop for critical ones.'}
        </p>
      </section>

      <section className="hv-pane hv-agent" aria-labelledby="hv-agent-title">
        <span id="hv-agent-title" className="hv-eyebrow">03 · What the agent reads</span>
        <ul className="hv-contracts">
          {CONTRACTS.map((c) => (
            <li key={c.id} className="hv-contract" data-safety={c.safety} data-active={active === c.id ? 'true' : 'false'}>
              <span>{c.id} · {c.kind}</span>
              <span className="hv-safety">{c.safety}</span>
            </li>
          ))}
        </ul>
        <span className="hv-sign">hmac-sha256 · signed · domain-bound</span>
      </section>
    </div>
  );
}
