'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button, Switch, TextField } from '@vhyxui/react';

interface LensStep {
  key: 'name' | 'public' | 'save' | 'delete';
  contract: string;
  verdict: string;
  tone: string;
}

const STEPS: LensStep[] = [
  { key: 'name', contract: 'project-name · input', verdict: 'low · allowed', tone: '#34d399' },
  { key: 'public', contract: 'public-link · toggle', verdict: 'medium · logged', tone: '#fcd34d' },
  { key: 'save', contract: 'save-changes · update', verdict: 'medium · allowed', tone: '#34d399' },
  { key: 'delete', contract: 'delete-project · destructive', verdict: 'critical · asks a person', tone: '#f87171' },
];

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * Hero visual: a real VhyxUI settings screen with an "agent lens" that moves across its controls and shows the
 * contract an AI agent reads for each one. Pauses on hover or interaction; static under reduced motion.
 */
export function AgentLens(): React.ReactElement {
  const box = useRef<HTMLDivElement | null>(null);
  const targets = useRef<Partial<Record<LensStep['key'], HTMLElement | null>>>({});
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [name, setName] = useState('Atlas dashboard');
  const [isPublic, setPublic] = useState(true);
  const [pos, setPos] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const step = STEPS[index] ?? STEPS[0]!;

  const measure = useCallback((): void => {
    const root = box.current;
    const holder = targets.current[step.key];
    // For the text field, ring the bordered input box rather than the label + field wrapper.
    const el = step.key === 'name' ? (holder?.querySelector('input')?.parentElement ?? holder) : holder;
    if (!root || !el) return;
    const r = root.getBoundingClientRect();
    const t = el.getBoundingClientRect();
    const x = t.left - r.left - 6;
    const y = t.top - r.top - 6;
    setPos({ x, y, w: t.width + 12, h: t.height + 12 });
  }, [step.key]);

  useIsoLayoutEffect(() => {
    measure();
  }, [measure]);

  // Re-measure whenever layout can shift under the lens: resizes, web fonts arriving, the reveal animation
  // finishing, and on the frame after each step change.
  useEffect(() => {
    const root = box.current;
    const raf = requestAnimationFrame(measure);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => measure()) : null;
    if (root && ro) ro.observe(root);
    void document.fonts?.ready.then(() => measure());
    const late = window.setTimeout(measure, 900);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      window.clearTimeout(late);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (paused || reduce) return undefined;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % STEPS.length), 2400);
    return () => window.clearInterval(id);
  }, [paused]);

  const hold = (key: LensStep['key']) => () => {
    setIndex(STEPS.findIndex((s) => s.key === key));
  };
  const set = (key: LensStep['key']) => (el: HTMLElement | null) => {
    targets.current[key] = el;
  };

  return (
    <div className="lp-frame">
      <div className="lp-frame-inner">
        <div className="lp-frame-bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>atlas.app/settings</span>
        </div>
        <div
          ref={box}
          className="lens"
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <h3>Project settings</h3>
          <div ref={set('name')} onPointerEnter={hold('name')}>
            <TextField name="project-name" label="Project name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="lens-row">
            <span id="lens-public">Public link</span>
            <span ref={set('public')} onPointerEnter={hold('public')} style={{ display: 'inline-flex' }}>
              <Switch aria-labelledby="lens-public" checked={isPublic} onCheckedChange={setPublic} />
            </span>
          </div>
          <div className="lens-actions">
            <span ref={set('save')} onPointerEnter={hold('save')} style={{ display: 'inline-flex' }}>
              <Button>Save changes</Button>
            </span>
            <span ref={set('delete')} onPointerEnter={hold('delete')} style={{ display: 'inline-flex' }}>
              <Button variant="outline">Delete project</Button>
            </span>
          </div>
          <span
            className="lens-ring"
            aria-hidden="true"
            style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, width: pos.w, height: pos.h, '--lens-tone': step.tone } as React.CSSProperties}
          />
          <span className="lens-chip" aria-hidden="true" style={{ left: 'auto', right: 20, top: 18, '--lens-tone': step.tone } as React.CSSProperties}>
            {step.contract} <b>{step.verdict}</b>
          </span>
        </div>
        <div className="lens-foot">
          <span className="lens-dot" aria-hidden="true" />
          <span>
            Agent reads <strong>{step.contract.split(' · ')[0]}</strong>: {step.verdict}
          </span>
        </div>
      </div>
    </div>
  );
}
