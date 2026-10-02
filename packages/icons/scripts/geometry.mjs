// Keyline and optical checks for icon drawings. Pure geometry, no dependencies.
//
// Rules (24px grid, 2px stroke):
//   safe-zone  every point of the geometry lies within [SAFE, 24 - SAFE], so the stroke never touches the edge
//   crisp      straight horizontal/vertical edges sit on whole pixels; a 2px stroke centred on a whole
//              pixel covers exactly two pixel rows at 24px, on a .5 coordinate it blurs across three
//   size       the drawing's larger side is at least MIN_EXTENT, so no icon looks small next to the others
//   balance    the drawing's bounding box is centred within BALANCE of the grid centre
//
// An icon can waive a rule for a deliberate reason via icons.json, e.g. "waive": { "balance": "play triangle is shifted right on purpose" }.

export const SAFE = 2;
export const MIN_EXTENT = 10;
export const BALANCE = 1;
const EPS = 1e-6;
const CURVE_STEPS = 24;

/** Splits a path `d` into absolute segments: { type: 'line' | 'curve', points: [[x,y], ...] }. */
export function pathSegments(d) {
  const tokens = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) ?? [];
  const segs = [];
  let i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0, lastCtrl = null, lastCmd = '';
  const num = () => Number(tokens[i++]);
  const flag = () => {
    // Arc flags may be packed without separators ("a2 2 0 011 1"): take one character.
    const t = tokens[i];
    if (t.length > 1 && /^[01]/.test(t)) { tokens[i] = t.slice(1); return Number(t[0]); }
    i++; return Number(t);
  };
  while (i < tokens.length) {
    if (/[a-zA-Z]/.test(tokens[i])) cmd = tokens[i++];
    const rel = cmd === cmd.toLowerCase();
    const C = cmd.toUpperCase();
    const ox = rel ? x : 0, oy = rel ? y : 0;
    if (C === 'Z') { segs.push({ type: 'line', points: [[x, y], [sx, sy]] }); x = sx; y = sy; lastCtrl = null; lastCmd = 'Z'; continue; }
    if (C === 'M') { x = ox + num(); y = oy + num(); sx = x; sy = y; cmd = rel ? 'l' : 'L'; lastCtrl = null; lastCmd = 'M'; continue; }
    if (C === 'L' || C === 'H' || C === 'V') {
      const nx = C === 'V' ? x : (C === 'H' ? (rel ? x : 0) + num() : ox + num());
      const ny = C === 'H' ? y : (C === 'V' ? (rel ? y : 0) + num() : oy + num());
      segs.push({ type: 'line', points: [[x, y], [nx, ny]] }); x = nx; y = ny; lastCtrl = null; lastCmd = C; continue;
    }
    if (C === 'C' || C === 'S' || C === 'Q' || C === 'T') {
      let c1, c2, end;
      if (C === 'C') { c1 = [ox + num(), oy + num()]; c2 = [ox + num(), oy + num()]; end = [ox + num(), oy + num()]; }
      else if (C === 'S') { c1 = lastCtrl && 'CS'.includes(lastCmd) ? [2 * x - lastCtrl[0], 2 * y - lastCtrl[1]] : [x, y]; c2 = [ox + num(), oy + num()]; end = [ox + num(), oy + num()]; }
      else if (C === 'Q') { c1 = [ox + num(), oy + num()]; end = [ox + num(), oy + num()]; }
      else { c1 = lastCtrl && 'QT'.includes(lastCmd) ? [2 * x - lastCtrl[0], 2 * y - lastCtrl[1]] : [x, y]; end = [ox + num(), oy + num()]; }
      const pts = [];
      for (let k = 0; k <= CURVE_STEPS; k++) {
        const t = k / CURVE_STEPS, u = 1 - t;
        pts.push(c2
          ? [u ** 3 * x + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t ** 3 * end[0], u ** 3 * y + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t ** 3 * end[1]]
          : [u * u * x + 2 * u * t * c1[0] + t * t * end[0], u * u * y + 2 * u * t * c1[1] + t * t * end[1]]);
      }
      segs.push({ type: 'curve', points: pts });
      lastCtrl = c2 ?? c1; lastCmd = C; x = end[0]; y = end[1]; continue;
    }
    if (C === 'A') {
      const rx0 = Math.abs(num()), ry0 = Math.abs(num()), rot = (num() * Math.PI) / 180, large = flag(), sweep = flag();
      const ex = ox + num(), ey = oy + num();
      segs.push({ type: 'curve', points: arcPoints(x, y, rx0, ry0, rot, large, sweep, ex, ey) });
      x = ex; y = ey; lastCtrl = null; lastCmd = 'A'; continue;
    }
    throw new Error(`unsupported path command "${cmd}"`);
  }
  return segs;
}

/** Samples an SVG elliptical arc (endpoint parameterisation, SVG spec F.6.5). */
function arcPoints(x1, y1, rx, ry, phi, fa, fs, x2, y2) {
  if (!rx || !ry) return [[x1, y1], [x2, y2]];
  const cos = Math.cos(phi), sin = Math.sin(phi);
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
  const x1p = cos * dx + sin * dy, y1p = -sin * dx + cos * dy;
  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) { rx *= Math.sqrt(lambda); ry *= Math.sqrt(lambda); }
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const coef = (fa === fs ? -1 : 1) * Math.sqrt(Math.max(0, num / (rx * rx * y1p * y1p + ry * ry * x1p * x1p)));
  const cxp = (coef * rx * y1p) / ry, cyp = (-coef * ry * x1p) / rx;
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2, cy = sin * cxp + cos * cyp + (y1 + y2) / 2;
  const ang = (ux, uy, vx, vy) => Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
  const t1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let dt = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!fs && dt > 0) dt -= 2 * Math.PI;
  if (fs && dt < 0) dt += 2 * Math.PI;
  const pts = [];
  const steps = Math.max(8, Math.ceil((Math.abs(dt) / Math.PI) * CURVE_STEPS));
  for (let k = 0; k <= steps; k++) {
    const t = t1 + (dt * k) / steps;
    pts.push([cx + rx * Math.cos(t) * cos - ry * Math.sin(t) * sin, cy + rx * Math.cos(t) * sin + ry * Math.sin(t) * cos]);
  }
  return pts;
}

/** Converts one parsed shape into segments. */
export function shapeSegments([tag, a]) {
  const n = (k) => Number(a[k] ?? 0);
  if (tag === 'path') return pathSegments(a.d);
  if (tag === 'line') return [{ type: 'line', points: [[n('x1'), n('y1')], [n('x2'), n('y2')]] }];
  if (tag === 'polyline' || tag === 'polygon') {
    const v = a.points.trim().split(/[\s,]+/).map(Number);
    const pts = []; for (let k = 0; k < v.length; k += 2) pts.push([v[k], v[k + 1]]);
    if (tag === 'polygon') pts.push(pts[0]);
    return pts.slice(1).map((p, k) => ({ type: 'line', points: [pts[k], p] }));
  }
  if (tag === 'rect') {
    const x = n('x'), y = n('y'), w = n('width'), h = n('height');
    const r = Math.min(Number(a.rx ?? a.ry ?? 0), w / 2, h / 2);
    return [
      { type: 'line', points: [[x + r, y], [x + w - r, y]] }, { type: 'line', points: [[x + w, y + r], [x + w, y + h - r]] },
      { type: 'line', points: [[x + w - r, y + h], [x + r, y + h]] }, { type: 'line', points: [[x, y + h - r], [x, y + r]] },
      ...(r ? [{ type: 'curve', points: [[x, y + r], [x + r, y]] }] : []),
    ];
  }
  if (tag === 'circle' || tag === 'ellipse') {
    const cx = n('cx'), cy = n('cy'), rx = tag === 'circle' ? n('r') : n('rx'), ry = tag === 'circle' ? n('r') : n('ry');
    return [{ type: 'curve', points: [[cx - rx, cy], [cx + rx, cy], [cx, cy - ry], [cx, cy + ry]] }];
  }
  return [];
}

/** Bounding box of all geometry (stroke centre lines). */
export function bounds(nodes) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const node of nodes) for (const s of shapeSegments(node)) for (const [x, y] of s.points) {
    x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
  }
  return { x0, y0, x1, y1, width: x1 - x0, height: y1 - y0 };
}

const off = (v) => Math.abs(v - Math.round(v)) > EPS;
const fmt = (v) => +v.toFixed(2);

/**
 * Checks one 24px drawing against the keyline rules. Returns a list of problems (empty = passes).
 * `waive` is the icon's waiver map from icons.json.
 */
export function checkKeylines(nodes, waive = {}) {
  const problems = [];
  const b = bounds(nodes);
  // Filled detail shapes (dots) have no stroke to centre, so they are exempt from the crisp rule.
  const stroked = nodes.filter(([, a]) => a.fill !== 'currentColor');
  if (!waive['safe-zone'] && (b.x0 < SAFE - EPS || b.y0 < SAFE - EPS || b.x1 > 24 - SAFE + EPS || b.y1 > 24 - SAFE + EPS))
    problems.push(`safe-zone: geometry spans ${fmt(b.x0)},${fmt(b.y0)} to ${fmt(b.x1)},${fmt(b.y1)} (must stay within ${SAFE}..${24 - SAFE})`);
  if (!waive.size && Math.max(b.width, b.height) < MIN_EXTENT - EPS)
    problems.push(`size: largest side is ${fmt(Math.max(b.width, b.height))}px (minimum ${MIN_EXTENT})`);
  const cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
  if (!waive.balance && (Math.abs(cx - 12) > BALANCE + EPS || Math.abs(cy - 12) > BALANCE + EPS))
    problems.push(`balance: bounding box centre is ${fmt(cx)},${fmt(cy)} (must be within ${BALANCE}px of 12,12)`);
  if (!waive.crisp) {
    const blurry = new Set();
    for (const node of stroked) for (const s of shapeSegments(node)) {
      if (s.type !== 'line') continue;
      const [[ax, ay], [bx, by]] = s.points;
      const len = Math.hypot(bx - ax, by - ay);
      if (len < 1 - EPS) continue; // tiny joins and caps are not visible edges
      if (Math.abs(ax - bx) < EPS && off(ax)) blurry.add(`x=${fmt(ax)}`);
      if (Math.abs(ay - by) < EPS && off(ay)) blurry.add(`y=${fmt(ay)}`);
    }
    if (blurry.size) problems.push(`crisp: straight edges off the pixel grid at ${[...blurry].join(', ')}`);
  }
  return problems;
}
