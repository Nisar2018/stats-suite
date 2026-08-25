import {
  computeClassBoundaries,
  formatBoundary,
  getClassBoundaryAt,
} from './classBoundaries';
import { formatNum } from './formatNumber';

function getOrdinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

/** 1-based position with linear interpolation */
function getInterpolatedValue(sorted, position) {
  if (sorted.length === 0) return null;
  if (position <= 1) return sorted[0];
  if (position >= sorted.length) return sorted[sorted.length - 1];

  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower - 1];

  const fraction = position - lower;
  return sorted[lower - 1] + fraction * (sorted[upper - 1] - sorted[lower - 1]);
}

/** Decile / percentile ungrouped: round if fractional, mean if integer position */
function getOrderStatisticValue(sorted, position) {
  const n = sorted.length;
  if (n === 0) return null;

  if (Number.isInteger(position)) {
    const idx = position;
    if (idx >= n) return sorted[n - 1];
    if (idx < 1) return sorted[0];
    return (sorted[idx - 1] + sorted[idx]) / 2;
  }

  const rounded = Math.round(position);
  const idx = Math.max(1, Math.min(n, rounded));
  return sorted[idx - 1];
}

function locateGroupedClass(valid, cumulativeFreqs, target) {
  for (let i = 0; i < valid.length; i++) {
    if (cumulativeFreqs[i] >= target) return i;
  }
  return valid.length - 1;
}

function computeGroupedMeasureAtTarget(valid, target, measureLabel) {
  const n = valid.reduce((s, r) => s + r.frequency, 0);
  if (n === 0) return null;

  let cumulative = 0;
  const cumulativeFreqs = [];
  for (let i = 0; i < valid.length; i++) {
    cumulative += valid[i].frequency;
    cumulativeFreqs.push(cumulative);
  }

  const classIndex = locateGroupedClass(valid, cumulativeFreqs, target);
  const row = valid[classIndex];
  const boundary = getClassBoundaryAt(valid, classIndex);
  if (!boundary) return null;

  const l = boundary.lowerBoundary;
  const h = boundary.classWidth;
  const f = row.frequency;
  const c = classIndex > 0 ? cumulativeFreqs[classIndex - 1] : 0;
  const value = l + ((target - c) / f) * h;

  const hasGaps = computeClassBoundaries(valid).some(
    (b) => b.gapBefore > 0 || b.gapAfter > 0,
  );

  return {
    n,
    target,
    classIndex,
    classInterval: row.classInterval,
    l,
    h,
    f,
    c,
    value,
    cumulativeFreqs,
    hasGaps,
    boundary,
    measureLabel,
  };
}

function buildGroupedMeasureSteps(result, formulaLabel, targetLabel) {
  const {
    valid,
    n,
    target,
    classInterval,
    l,
    h,
    f,
    c,
    value,
    cumulativeFreqs,
    hasGaps,
    boundary,
    measureLabel,
  } = result;

  const cumLines = valid.map(
    (r, i) => `${r.classInterval}: Fᵢ = ${r.frequency}, Cumulative = ${cumulativeFreqs[i]}`,
  );

  const steps = [
    {
      step: 1,
      title: 'Compute cumulative frequencies',
      content: cumLines.join('\n'),
    },
    {
      step: 2,
      title: `Find ${targetLabel}`,
      content: `n = ${n}, ${targetLabel} = ${formatNum(target)}`,
    },
    {
      step: 3,
      title: `Locate the ${measureLabel} class`,
      content: `Class "${classInterval}" is the ${measureLabel} class (cumulative frequency ≥ ${targetLabel})`,
    },
  ];

  if (hasGaps) {
    steps.push({
      step: 4,
      title: 'Adjust class limits to true boundaries',
      content:
        `Class limits: ${boundary.lowerLimit}–${boundary.upperLimit}\n` +
        `Lower class boundary l = ${formatBoundary(l)}\n` +
        `Class width h = ${formatBoundary(h)}`,
    });
  }

  steps.push(
    {
      step: hasGaps ? 5 : 4,
      title: 'Extract formula values',
      content: `l = ${formatBoundary(l)}, h = ${formatBoundary(h)}, f = ${f}, c = ${c}`,
    },
    {
      step: hasGaps ? 6 : 5,
      title: 'Apply the formula',
      content: `${formulaLabel} = l + [(${formatNum(target)} − c) / f] × h = ${formatBoundary(l)} + [(${formatNum(target)} − ${c}) / ${f}] × ${formatBoundary(h)} = ${formatNum(value)}`,
    },
  );

  return steps;
}

export function computeUngroupedQuartiles(values) {
  if (values.length === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;

  const q1Pos = (1 * (n + 1)) / 4;
  const q3Pos = (3 * (n + 1)) / 4;

  const q1 = getInterpolatedValue(sorted, q1Pos);
  const q3 = getInterpolatedValue(sorted, q3Pos);
  const q2 = q3 - q1;

  const steps = [
    {
      step: 1,
      title: 'Arrange data in ascending order',
      content: `{ ${sorted.join(', ')} }`,
    },
    {
      step: 2,
      title: 'Count observations',
      content: `n = ${n}`,
    },
    {
      step: 3,
      title: 'Find Q₁ (first quartile)',
      content: `Q₁ position = k(n+1)/4 = 1×(${n}+1)/4 = ${formatNum(q1Pos)}${getOrdinalSuffix(Math.round(q1Pos))} value\nQ₁ = ${formatNum(q1)}`,
    },
    {
      step: 4,
      title: 'Find Q₃ (third quartile)',
      content: `Q₃ position = k(n+1)/4 = 3×(${n}+1)/4 = ${formatNum(q3Pos)}${getOrdinalSuffix(Math.round(q3Pos))} value\nQ₃ = ${formatNum(q3)}`,
    },
    {
      step: 5,
      title: 'Find Q₂ (second quartile)',
      content: `Q₂ = Q₃ − Q₁ = ${formatNum(q3)} − ${formatNum(q1)} = ${formatNum(q2)}`,
    },
  ];

  return { sorted, n, q1, q2, q3, q1Pos, q3Pos, steps };
}

export function computeGroupedQuartiles(rows) {
  const valid = rows.filter((r) => r.frequency > 0);
  if (valid.length === 0) return null;

  const n = valid.reduce((s, r) => s + r.frequency, 0);

  const q1Raw = computeGroupedMeasureAtTarget(valid, n / 4, 'Q₁');
  const q2Raw = computeGroupedMeasureAtTarget(valid, n / 2, 'Q₂');
  const q3Raw = computeGroupedMeasureAtTarget(valid, (3 * n) / 4, 'Q₃');

  if (!q1Raw || !q2Raw || !q3Raw) return null;

  q1Raw.valid = valid;
  q2Raw.valid = valid;
  q3Raw.valid = valid;

  const steps = [
    {
      step: 1,
      title: 'First quartile (Q₁)',
      content: buildGroupedMeasureSteps(q1Raw, 'Q₁', 'n/4')
        .slice(1)
        .map((s) => s.content)
        .join('\n\n'),
    },
    {
      step: 2,
      title: 'Second quartile (Q₂)',
      content: buildGroupedMeasureSteps(q2Raw, 'Q₂', 'n/2')
        .slice(1)
        .map((s) => s.content)
        .join('\n\n'),
    },
    {
      step: 3,
      title: 'Third quartile (Q₃)',
      content: buildGroupedMeasureSteps(q3Raw, 'Q₃', '3n/4')
        .slice(1)
        .map((s) => s.content)
        .join('\n\n'),
    },
  ];

  return {
    n,
    q1: q1Raw.value,
    q2: q2Raw.value,
    q3: q3Raw.value,
    q1Index: q1Raw.classIndex,
    q2Index: q2Raw.classIndex,
    q3Index: q3Raw.classIndex,
    steps,
  };
}

export function computeUngroupedDecile(values, m) {
  if (values.length === 0 || m < 1 || m > 9) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const position = (m * n) / 10;
  const isInteger = Number.isInteger(position);
  const decile = getOrderStatisticValue(sorted, position);

  const steps = [
    {
      step: 1,
      title: 'Arrange data in ascending order',
      content: `{ ${sorted.join(', ')} }`,
    },
    {
      step: 2,
      title: 'Count observations',
      content: `n = ${n}, m = ${m} (order of decile)`,
    },
    {
      step: 3,
      title: 'Find decile position',
      content: `Position = (m×n)/10 = (${m}×${n})/10 = ${formatNum(position)}`,
    },
    {
      step: 4,
      title: isInteger ? 'Average adjacent values (integer position)' : 'Round to nearest value (fractional position)',
      content: isInteger
        ? `D${m} = mean of ${position}${getOrdinalSuffix(position)} and ${position + 1}${getOrdinalSuffix(position + 1)} values = ${formatNum(decile)}`
        : `D${m} = ${Math.round(position)}${getOrdinalSuffix(Math.round(position))} value (rounded) = ${formatNum(decile)}`,
    },
  ];

  return { sorted, n, m, position, decile, steps };
}

export function computeGroupedDecile(rows, m) {
  if (m < 1 || m > 9) return null;

  const valid = rows.filter((r) => r.frequency > 0);
  if (valid.length === 0) return null;

  const n = valid.reduce((s, r) => s + r.frequency, 0);
  const target = (m * n) / 10;

  const raw = computeGroupedMeasureAtTarget(valid, target, `D${m}`);
  if (!raw) return null;

  raw.valid = valid;
  const steps = buildGroupedMeasureSteps(raw, `D${m}`, `(m×n)/10 = ${formatNum(target)}`);

  return {
    n,
    m,
    target,
    decile: raw.value,
    classIndex: raw.classIndex,
    l: raw.l,
    h: raw.h,
    f: raw.f,
    c: raw.c,
    steps,
  };
}

export function computeUngroupedPercentile(values, m) {
  if (values.length === 0 || m < 1 || m > 99) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const position = (m * n) / 100;
  const isInteger = Number.isInteger(position);
  const percentile = getOrderStatisticValue(sorted, position);

  const steps = [
    {
      step: 1,
      title: 'Arrange data in ascending order',
      content: `{ ${sorted.join(', ')} }`,
    },
    {
      step: 2,
      title: 'Count observations',
      content: `n = ${n}, m = ${m} (order of percentile)`,
    },
    {
      step: 3,
      title: 'Find percentile position',
      content: `Position = (m×n)/100 = (${m}×${n})/100 = ${formatNum(position)}`,
    },
    {
      step: 4,
      title: isInteger ? 'Average adjacent values (integer position)' : 'Round to nearest value (fractional position)',
      content: isInteger
        ? `P${m} = mean of ${position}${getOrdinalSuffix(position)} and ${position + 1}${getOrdinalSuffix(position + 1)} values = ${formatNum(percentile)}`
        : `P${m} = ${Math.round(position)}${getOrdinalSuffix(Math.round(position))} value (rounded) = ${formatNum(percentile)}`,
    },
  ];

  return { sorted, n, m, position, percentile, steps };
}

export function computeGroupedPercentile(rows, m) {
  if (m < 1 || m > 99) return null;

  const valid = rows.filter((r) => r.frequency > 0);
  if (valid.length === 0) return null;

  const n = valid.reduce((s, r) => s + r.frequency, 0);
  const target = (m * n) / 100;

  const raw = computeGroupedMeasureAtTarget(valid, target, `P${m}`);
  if (!raw) return null;

  raw.valid = valid;
  const steps = buildGroupedMeasureSteps(raw, `P${m}`, `(m×n)/100 = ${formatNum(target)}`);

  return {
    n,
    m,
    target,
    percentile: raw.value,
    classIndex: raw.classIndex,
    l: raw.l,
    h: raw.h,
    f: raw.f,
    c: raw.c,
    steps,
  };
}
