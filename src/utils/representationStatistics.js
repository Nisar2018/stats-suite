import { formatNum } from './formatNumber';

/** Format class limits/boundaries without trailing zeros (e.g. 10.5 not 10.50). */
export function formatClassValue(n) {
  return formatNum(n, 2);
}

export { formatNum };

/** Format class boundary as single string e.g. "9.5-19.5" */
export function formatClassBoundary(lower, upper) {
  return `${formatClassValue(lower)}-${formatClassValue(upper)}`;
}

/** Parse "9.5-19.5" or "9.5 – 19.5" into lower/upper boundaries */
export function parseClassBoundary(input) {
  if (input == null || String(input).trim() === '') return null;
  const parts = String(input).split(/[-–]/).map((s) => s.trim());
  if (parts.length < 2) return null;
  const lower = Number(parts[0]);
  const upper = Number(parts[1]);
  if (Number.isNaN(lower) || Number.isNaN(upper)) return null;
  return { lower, upper };
}

/** Parse "10 – 20" or "10-20" class interval into lower/upper limits */
export function parseClassIntervalRange(input) {
  if (input == null || String(input).trim() === '') return null;
  const parts = String(input).split(/[-–]/).map((s) => s.trim());
  if (parts.length < 2) return null;
  const lower = Number(parts[0]);
  const upper = Number(parts[1]);
  if (Number.isNaN(lower) || Number.isNaN(upper)) return null;
  return { lower, upper };
}

/**
 * Round class width to a whole number (standard rounding: 5.6 → 6, 5.4 → 5).
 * Minimum width is 1.
 */
export function roundClassWidth(hRaw) {
  if (!Number.isFinite(hRaw) || hRaw <= 0) return 1;
  return Math.max(1, Math.round(hRaw));
}

export function computeContinuousParams(values) {
  if (!values?.length) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const xMin = sorted[0];
  const xMax = sorted[n - 1];
  const R = xMax - xMin;
  const c = Math.max(1, Math.ceil(1 + 3.3 * Math.log10(n)));
  const hRaw = c > 0 ? R / c : 0;
  const h = roundClassWidth(hRaw);
  const suggestedStart = Math.floor(xMin) - 1;

  return {
    sorted,
    n,
    xMin,
    xMax,
    R,
    c,
    hRaw,
    h,
    suggestedStart,
    steps: [
      {
        title: 'Range of data',
        content: `R = Xₘₐₓ − Xₘᵢₙ = ${formatNum(xMax)} − ${formatNum(xMin)} = ${formatNum(R)}`,
      },
      {
        title: 'Number of class intervals',
        content: `c = 1 + 3.3 log(n) = 1 + 3.3 log(${n}) ≈ ${c}`,
      },
      {
        title: 'Width of class interval',
        content:
          hRaw === h
            ? `h = R/c = ${formatNum(R)}/${c} = ${h}`
            : `h = R/c = ${formatNum(R)}/${c} = ${formatNum(hRaw, 4)} ≈ ${h} (rounded)`,
      },
      {
        title: 'Choose starting value',
        content: `Select any value less than Xₘᵢₙ (${formatNum(xMin)}). Suggested: ${suggestedStart}`,
      },
    ],
  };
}

/**
 * Inclusive class intervals with true class boundaries.
 * Example (start = 11, h = 6):
 *   Class intervals: 11–16, 17–22, 23–28
 *   Class boundaries: 10.5–16.5, 16.5–22.5, 22.5–28.5
 *   Mid value: (L + U) / 2
 */
export function buildContinuousFrequencyTable(values, startValue, classWidth, numClasses) {
  if (!values?.length || !Number.isFinite(startValue) || classWidth <= 0 || numClasses < 1) {
    return null;
  }

  const h = roundClassWidth(classWidth);
  const xMax = Math.max(...values);
  let classes = numClasses;

  // Inclusive upper limit of last class must cover Xₘₐₓ
  while (startValue + classes * h - 1 < xMax) {
    classes += 1;
  }

  const correction = 0.5;
  const rows = [];

  for (let i = 0; i < classes; i += 1) {
    const lowerLimit = startValue + i * h;
    const upperLimit = lowerLimit + h - 1;
    const lowerBoundary = lowerLimit - correction;
    const upperBoundary = upperLimit + correction;
    const midValue = (lowerLimit + upperLimit) / 2;

    const frequency = values.filter(
      (v) => v >= lowerLimit && v <= upperLimit,
    ).length;

    rows.push({
      classInterval: `${formatClassValue(lowerLimit)} – ${formatClassValue(upperLimit)}`,
      classBoundaries: `${formatClassValue(lowerBoundary)} – ${formatClassValue(upperBoundary)}`,
      lowerLimit,
      upperLimit,
      lowerBoundary,
      upperBoundary,
      midValue,
      frequency,
    });
  }

  const totalF = rows.reduce((s, r) => s + r.frequency, 0);

  return { rows, totalF, classes, h };
}

/** Parse comma-separated raw values for categorical frequency (numbers or text). */
export function parseInputValues(input) {
  if (!input || typeof input !== 'string') return [];
  return input
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => {
      const n = Number(s);
      return Number.isNaN(n) ? s : n;
    });
}

/**
 * Build categorical frequency table from raw input values.
 * e.g. 1,0,0,2,3,2,1,4 → Category 0→2, 1→2, 2→2, 3→1, 4→1
 */
export function buildCategoricalFromInputValues(input) {
  const values = parseInputValues(input);
  if (!values.length) return null;

  const freqMap = new Map();
  for (const v of values) {
    const key = String(v);
    freqMap.set(key, (freqMap.get(key) ?? 0) + 1);
  }

  const rows = [...freqMap.entries()]
    .map(([category, frequency]) => ({
      category: Number.isNaN(Number(category)) ? category : Number(category),
      frequency,
    }))
    .sort((a, b) => {
      const aNum = typeof a.category === 'number';
      const bNum = typeof b.category === 'number';
      if (aNum && bNum) return a.category - b.category;
      return String(a.category).localeCompare(String(b.category));
    });

  const totalF = values.length;

  return { rows, totalF, inputCount: values.length };
}

/** Parse comma-separated x-axis labels (preserves spaces inside labels). */
export function parseCommaLabels(input) {
  if (!input || typeof input !== 'string') return [];
  return input
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Build a categorical / simple-diagram frequency table.
 * - headings: x-axis portions (column headers)
 * - categoryRows: [{ id, name, frequencies: number[] }] — one frequency per heading
 */
export function buildXAxisFrequencyTable(headings, categoryRows) {
  if (!headings?.length || !categoryRows?.length) return null;

  const rows = categoryRows.map((row) => {
    const frequencies = headings.map((_, i) => Number(row.frequencies?.[i]) || 0);
    const rowTotal = frequencies.reduce((s, f) => s + f, 0);
    return {
      id: row.id,
      name: (row.name ?? '').trim(),
      label: (row.name ?? '').trim(),
      frequencies,
      rowTotal,
    };
  });

  const columnTotals = headings.map((_, i) =>
    rows.reduce((s, r) => s + (r.frequencies[i] || 0), 0),
  );
  const totalF = columnTotals.reduce((s, t) => s + t, 0);

  const columns = headings.map((label, i) => ({
    label,
    frequency: columnTotals[i],
  }));

  return {
    headings,
    columns,
    rows,
    columnTotals,
    totalF,
    labelCount: headings.length,
    categoryCount: rows.length,
  };
}

export function buildCategoricalTable(categories) {
  const valid = categories.filter((c) => c.name.trim() && c.frequency > 0);
  if (!valid.length) return null;

  const totalF = valid.reduce((s, c) => s + c.frequency, 0);
  const rows = valid.map((c) => ({
    name: c.name.trim(),
    frequency: c.frequency,
    relativeFrequency: c.frequency / totalF,
  }));

  return { rows, totalF };
}

export function buildOpenDataTable(entries) {
  const valid = entries.filter((e) => String(e.value).trim() && e.frequency > 0);
  if (!valid.length) return null;

  const totalF = valid.reduce((s, e) => s + e.frequency, 0);
  const rows = valid.map((e) => ({
    value: String(e.value).trim(),
    frequency: e.frequency,
    relativeFrequency: e.frequency / totalF,
  }));

  return { rows, totalF };
}

export function addRelativeFrequency(rows) {
  const totalF = rows.reduce((s, r) => s + r.frequency, 0);
  if (totalF === 0) return null;

  return {
    rows: rows.map((r) => ({
      ...r,
      relativeFrequency: r.frequency / totalF,
    })),
    totalF,
  };
}

export function addCumulativeFrequency(rows) {
  const withRel = addRelativeFrequency(rows);
  if (!withRel) return null;

  let cumulative = 0;
  const enriched = withRel.rows.map((r) => {
    cumulative += r.frequency;
    return {
      ...r,
      cumulativeFrequency: cumulative,
      cumulativeRelativeFrequency: cumulative / withRel.totalF,
    };
  });

  return { rows: enriched, totalF: withRel.totalF };
}

export function computePiePortions(rows) {
  const totalF = rows.reduce((s, r) => s + r.frequency, 0);
  if (totalF === 0) return null;

  return {
    rows: rows.map((r) => ({
      name: r.name ?? r.classInterval ?? r.value,
      component: r.frequency,
      portion: (r.frequency / totalF) * 360,
    })),
    totalF,
  };
}

export function buildHistogramEqual(rows) {
  const valid = rows.filter((r) => r.frequency > 0);
  if (!valid.length) return null;

  const totalF = valid.reduce((s, r) => s + r.frequency, 0);
  return { rows: valid, totalF };
}

export function buildHistogramUnequal(rows) {
  const valid = rows
    .filter((r) => r.frequency > 0 && r.width > 0)
    .map((r) => ({
      ...r,
      adjustedFrequency: r.frequency / r.width,
    }));

  if (!valid.length) return null;

  const totalF = valid.reduce((s, r) => s + r.frequency, 0);
  return { rows: valid, totalF };
}

export function buildHistogramDiscrete(rows) {
  const valid = rows.filter((r) => r.frequency > 0);
  if (!valid.length) return null;

  const totalF = valid.reduce((s, r) => s + r.frequency, 0);
  return { rows: valid, totalF };
}

/**
 * Frequency polygon rows: midpoints of class boundaries + frequencies.
 * Used for a closed polygon of (midpoint, frequency) points.
 */
export function buildFrequencyPolygonRows(rows) {
  const prepared = rows.map((r) => {
    const boundary =
      parseClassBoundary(r.classBoundary) ??
      (() => {
        const interval = parseClassIntervalRange(r.classInterval);
        if (!interval) return null;
        return { lower: interval.lower - 0.5, upper: interval.upper - 0.5 };
      })();
    const midPoint =
      boundary != null ? (boundary.lower + boundary.upper) / 2 : null;
    return {
      ...r,
      frequency: Number(r.frequency) || 0,
      lowerBoundary: boundary?.lower ?? null,
      upperBoundary: boundary?.upper ?? null,
      midPoint,
      classBoundary:
        r.classBoundary ||
        (boundary ? formatClassBoundary(boundary.lower, boundary.upper) : ''),
    };
  });

  const totalF = prepared.reduce((s, r) => s + r.frequency, 0);
  if (totalF === 0) return null;

  const withMid = prepared.filter((r) => r.midPoint != null);
  if (!withMid.length) return null;

  const first = withMid[0];
  const last = withMid[withMid.length - 1];
  const firstWidth =
    first.lowerBoundary != null && first.upperBoundary != null
      ? first.upperBoundary - first.lowerBoundary
      : 10;
  const lastWidth =
    last.lowerBoundary != null && last.upperBoundary != null
      ? last.upperBoundary - last.lowerBoundary
      : firstWidth;

  const chartPoints = [
    { x: first.midPoint - firstWidth, y: 0 },
    ...withMid.map((r) => ({ x: r.midPoint, y: r.frequency })),
    { x: last.midPoint + lastWidth, y: 0 },
  ];

  return { rows: prepared, totalF, chartPoints };
}

/** Build cumulative relative frequency polygon data from class intervals + frequencies */
export function buildCrfPolygonRows(rows) {
  const prepared = rows.map((r) => {
    const boundary =
      parseClassBoundary(r.classBoundary) ??
      (() => {
        const interval = parseClassIntervalRange(r.classInterval);
        if (!interval) return null;
        return { lower: interval.lower - 0.5, upper: interval.upper - 0.5 };
      })();
    return {
      ...r,
      frequency: Number(r.frequency) || 0,
      lowerBoundary: boundary?.lower ?? null,
      upperBoundary: boundary?.upper ?? null,
      classBoundary:
        r.classBoundary ||
        (boundary ? formatClassBoundary(boundary.lower, boundary.upper) : ''),
    };
  });

  const totalF = prepared.reduce((s, r) => s + r.frequency, 0);
  if (totalF === 0) return null;

  let cumulative = 0;
  const enriched = prepared.map((r) => {
    cumulative += r.frequency;
    return {
      ...r,
      cumulativeRelativeFrequency: cumulative / totalF,
    };
  });

  return { rows: enriched, totalF };
}

/** Discrete CRF: values + frequencies → cumulative relative frequency */
export function buildDiscreteCrfRows(rows) {
  const prepared = rows.map((r) => ({
    ...r,
    value: Number(r.value),
    frequency: Number(r.frequency) || 0,
  }));
  const totalF = prepared.reduce((s, r) => s + r.frequency, 0);
  if (totalF === 0) return null;

  let cumulative = 0;
  const enriched = prepared.map((r) => {
    cumulative += r.frequency;
    return {
      ...r,
      cumulativeRelativeFrequency: cumulative / totalF,
    };
  });

  return { rows: enriched, totalF };
}

/**
 * Discrete cumulative frequency for simple data, plus step-polygon path points.
 * Step path: horizontal run to each value at the previous CF, then vertical jump.
 */
export function buildDiscreteCumulativeFrequencyRows(rows) {
  const prepared = rows
    .map((r) => ({
      ...r,
      value: Number(r.value),
      frequency: Number(r.frequency) || 0,
    }))
    .filter((r) => Number.isFinite(r.value))
    .sort((a, b) => a.value - b.value);

  const totalF = prepared.reduce((s, r) => s + r.frequency, 0);
  if (totalF === 0 || !prepared.length) return null;

  let cumulative = 0;
  const enriched = prepared.map((r) => {
    cumulative += r.frequency;
    return {
      ...r,
      cumulativeFrequency: cumulative,
    };
  });

  const first = enriched[0];
  const last = enriched[enriched.length - 1];
  const gap =
    enriched.length > 1
      ? Math.max(1, (last.value - first.value) / (enriched.length - 1))
      : 1;

  const stepPoints = [];
  stepPoints.push({ x: first.value - gap, y: 0 });

  let prevCf = 0;
  for (const r of enriched) {
    stepPoints.push({ x: r.value, y: prevCf });
    stepPoints.push({ x: r.value, y: r.cumulativeFrequency });
    prevCf = r.cumulativeFrequency;
  }
  stepPoints.push({ x: last.value + gap, y: prevCf });

  const markers = enriched.map((r) => ({
    x: r.value,
    y: r.cumulativeFrequency,
  }));

  return { rows: enriched, totalF, stepPoints, markers };
}

/**
 * Build bivariate contingency / relative frequency table from paired (x, y) points
 * using class boundaries for each variable.
 */
export function buildBivariateFrequencyTable(points, xBoundaries, yBoundaries) {
  const xBins = xBoundaries
    .map(parseClassBoundary)
    .filter(Boolean)
    .sort((a, b) => a.lower - b.lower);
  const yBins = yBoundaries
    .map(parseClassBoundary)
    .filter(Boolean)
    .sort((a, b) => a.lower - b.lower);

  if (!xBins.length || !yBins.length) return null;

  const counts = yBins.map(() => xBins.map(() => 0));
  let total = 0;

  for (const p of points) {
    const x = Number(p.x);
    const y = Number(p.y);
    if (Number.isNaN(x) || Number.isNaN(y)) continue;

    const xi = xBins.findIndex((b, i) =>
      i === xBins.length - 1 ? x >= b.lower && x <= b.upper : x >= b.lower && x < b.upper,
    );
    const yi = yBins.findIndex((b, i) =>
      i === yBins.length - 1 ? y >= b.lower && y <= b.upper : y >= b.lower && y < b.upper,
    );
    if (xi < 0 || yi < 0) continue;

    counts[yi][xi] += 1;
    total += 1;
  }

  if (total === 0) return null;

  const cells = counts.map((row) =>
    row.map((count) => ({
      frequency: count,
      relativeFrequency: count / total,
    })),
  );

  const columnTotals = xBins.map((_, xi) =>
    cells.reduce((s, row) => s + row[xi].frequency, 0),
  );
  const rowTotals = cells.map((row) => row.reduce((s, c) => s + c.frequency, 0));

  return {
    xBins,
    yBins,
    cells,
    columnTotals,
    rowTotals,
    total,
  };
}

export function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
