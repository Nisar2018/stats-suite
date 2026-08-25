import {
  buildGapExplanation,
  computeClassBoundaries,
  formatBoundary,
  getClassBoundaryAt,
} from './classBoundaries';
import { formatNum } from './formatNumber';

function formatProduct(n) {
  if (!Number.isFinite(n)) return '—';
  if (n > 1e12 || (n > 0 && n < 0.0001)) return n.toExponential(4);
  return formatNum(n);
}

export function parseNumberList(input) {
  return input
    .split(/[,;\s]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map(Number)
    .filter((n) => !Number.isNaN(n));
}

export function getMidPoint(row) {
  return (row.lowerBound + row.upperBound) / 2;
}

/** @deprecated Use getClassBoundaryAt for mode/median when gaps exist */
export function getClassWidth(row) {
  return row.upperBound - row.lowerBound;
}

export { computeClassBoundaries, getClassBoundaryAt, buildGapExplanation } from './classBoundaries';

export function computeUngroupedMean(values) {
  if (values.length === 0) return null;

  const sum = values.reduce((a, b) => a + b, 0);
  const count = values.length;
  const mean = sum / count;

  const steps = [
    {
      step: 1,
      title: 'List the observations',
      content: `x = { ${values.join(', ')} }`,
    },
    {
      step: 2,
      title: 'Count the number of observations',
      content: `n = ${count}`,
    },
    {
      step: 3,
      title: 'Calculate the sum',
      content: `Σx = ${values.join(' + ')} = ${formatNum(sum)}`,
    },
    {
      step: 4,
      title: 'Apply the formula',
      content: `X̄ = Σx / n = ${formatNum(sum)} / ${count} = ${formatNum(mean)}`,
    },
  ];

  return { values, sum, count, mean, steps };
}

export function computeUngroupedMeanFromTable(pairs) {
  const valid = pairs.filter((p) => p.frequency > 0 || p.value !== 0);
  if (valid.length === 0) return null;

  const products = valid.map((p) => ({
    value: p.value,
    frequency: p.frequency,
    product: p.value * p.frequency,
  }));

  const sumFx = products.reduce((s, p) => s + p.product, 0);
  const sumF = products.reduce((s, p) => s + p.frequency, 0);

  if (sumF === 0) return null;

  const mean = sumFx / sumF;

  const fxLines = products.map(
    (p) => `x = ${formatNum(p.value)}, f = ${p.frequency} → f × x = ${formatNum(p.product)}`,
  );
  const fLines = products.map((p) => String(p.frequency));

  const steps = [
    {
      step: 1,
      title: 'Read the frequency table',
      content: products
        .map((p) => `Value (x) = ${formatNum(p.value)}, Frequency (f) = ${p.frequency}`)
        .join('\n'),
    },
    {
      step: 2,
      title: 'Multiply each value by its frequency',
      content: fxLines.join('\n'),
    },
    {
      step: 3,
      title: 'Sum of (frequency × value)',
      content: `Σ(f · x) = ${products.map((p) => formatNum(p.product)).join(' + ')} = ${formatNum(sumFx)}`,
    },
    {
      step: 4,
      title: 'Sum of frequencies',
      content: `Σf = ${fLines.join(' + ')} = ${sumF}`,
    },
    {
      step: 5,
      title: 'Apply the formula',
      content: `Mean = Σ(f · x) / Σf = ${formatNum(sumFx)} / ${sumF} = ${formatNum(mean)}`,
    },
  ];

  return { pairs: valid, sumFx, sumF, mean, steps };
}

export function computeWeightedMean(pairs) {
  const valid = pairs.filter((p) => p.weight > 0 || p.value !== 0);
  if (valid.length === 0) return null;

  const products = valid.map((p) => ({
    value: p.value,
    weight: p.weight,
    product: p.value * p.weight,
  }));

  const sumWx = products.reduce((s, p) => s + p.product, 0);
  const sumW = products.reduce((s, p) => s + p.weight, 0);

  if (sumW === 0) return null;

  const mean = sumWx / sumW;

  const wxLines = products.map((p) => `${formatNum(p.weight)} × ${formatNum(p.value)} = ${formatNum(p.product)}`);
  const wLines = products.map((p) => formatNum(p.weight));

  const steps = [
    {
      step: 1,
      title: 'Multiply each value by its weight',
      content: wxLines.join('\n'),
    },
    {
      step: 2,
      title: 'Sum of weighted values',
      content: `Σ(w · x) = ${products.map((p) => formatNum(p.product)).join(' + ')} = ${formatNum(sumWx)}`,
    },
    {
      step: 3,
      title: 'Sum of weights',
      content: `Σw = ${wLines.join(' + ')} = ${formatNum(sumW)}`,
    },
    {
      step: 4,
      title: 'Apply the formula',
      content: `X̄ = Σ(w · x) / Σw = ${formatNum(sumWx)} / ${formatNum(sumW)} = ${formatNum(mean)}`,
    },
  ];

  return { pairs: valid, sumWx, sumW, mean, steps };
}

export function computeGroupedMean(rows) {
  const valid = rows.filter((r) => r.frequency > 0);
  if (valid.length === 0) return null;

  const boundaries = computeClassBoundaries(valid);
  const hasGaps = boundaries.some((b) => b.gapBefore > 0 || b.gapAfter > 0);

  const products = valid.map((r, i) => {
    const midPoint = boundaries[i].midPoint;
    return {
      interval: r.classInterval,
      midPoint,
      frequency: r.frequency,
      product: midPoint * r.frequency,
    };
  });

  const totalF = products.reduce((s, p) => s + p.frequency, 0);
  const totalFx = products.reduce((s, p) => s + p.product, 0);
  const mean = totalFx / totalF;

  const productLines = products.map(
    (p) => `${p.interval}: Xᵢ = ${formatNum(p.midPoint)}, Fᵢ = ${p.frequency}, Fᵢ × Xᵢ = ${formatNum(p.product)}`,
  );

  const steps = [];

  if (hasGaps) {
    steps.push({
      step: 1,
      title: 'Adjust for gaps between class intervals',
      content:
        'When classes are not continuous (e.g. 20–30 then 31–40), midpoints use class limits.\n' +
        buildGapExplanation(valid),
    });
  }

  steps.push(
    {
      step: hasGaps ? 2 : 1,
      title: 'Find midpoints and compute Fᵢ × Xᵢ for each class',
      content: productLines.join('\n'),
    },
    {
      step: hasGaps ? 3 : 2,
      title: 'Sum of frequencies',
      content: `Σf = ${products.map((p) => p.frequency).join(' + ')} = ${totalF}`,
    },
    {
      step: hasGaps ? 4 : 3,
      title: 'Sum of (frequency × midpoint)',
      content: `Σ(f · x) = ${products.map((p) => formatNum(p.product)).join(' + ')} = ${formatNum(totalFx)}`,
    },
    {
      step: hasGaps ? 5 : 4,
      title: 'Apply the formula',
      content: `X̄ = Σ(f · x) / Σf = ${formatNum(totalFx)} / ${totalF} = ${formatNum(mean)}`,
    },
  );

  return { rows: valid, products, totalF, totalFx, mean, steps };
}

export function computeUngroupedMode(values) {
  if (values.length === 0) return null;

  const freqMap = new Map();
  for (const v of values) {
    freqMap.set(v, (freqMap.get(v) ?? 0) + 1);
  }

  const frequencies = [...freqMap.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value - b.value);

  const maxCount = Math.max(...frequencies.map((f) => f.count));
  const modes = frequencies.filter((f) => f.count === maxCount).map((f) => f.value);

  const freqLines = frequencies.map((f) => `Value ${formatNum(f.value)} appears ${f.count} time(s)`);

  const steps = [
    {
      step: 1,
      title: 'List the observations',
      content: `{ ${values.join(', ')} }`,
    },
    {
      step: 2,
      title: 'Count frequency of each value',
      content: freqLines.join('\n'),
    },
    {
      step: 3,
      title: 'Identify the highest frequency',
      content: `Maximum frequency = ${maxCount}`,
    },
    {
      step: 4,
      title: 'Mode',
      content:
        modes.length === 1
          ? `Mode = ${formatNum(modes[0])} (most frequently occurring value)`
          : `Modes = { ${modes.map(formatNum).join(', ')} } (bimodal/multimodal)`,
    },
  ];

  return { values, frequencies, modes, steps };
}

export function computeGroupedMode(rows) {
  const valid = rows.filter((r) => r.frequency > 0);
  if (valid.length === 0) return null;

  const maxFreq = Math.max(...valid.map((r) => r.frequency));
  const modalIndex = valid.findIndex((r) => r.frequency === maxFreq);
  const modalRow = valid[modalIndex];
  const boundary = getClassBoundaryAt(valid, modalIndex);
  if (!boundary) return null;

  const l = boundary.lowerBoundary;
  const h = boundary.classWidth;
  const fm = modalRow.frequency;
  const f1 = modalIndex > 0 ? valid[modalIndex - 1].frequency : 0;
  const f2 = modalIndex < valid.length - 1 ? valid[modalIndex + 1].frequency : 0;

  const denominator = 2 * fm - f1 - f2;
  const numerator = fm - f1;
  const mode = denominator !== 0 ? l + (numerator / denominator) * h : l;

  const hasGaps = computeClassBoundaries(valid).some((b) => b.gapBefore > 0 || b.gapAfter > 0);

  const steps = [
    {
      step: 1,
      title: 'Identify the modal class',
      content: `Class "${modalRow.classInterval}" has the highest frequency fₘ = ${fm}`,
    },
  ];

  if (hasGaps) {
    steps.push({
      step: 2,
      title: 'Adjust class limits to true boundaries (account for gaps)',
      content:
        `Class limits: ${boundary.lowerLimit}–${boundary.upperLimit}\n` +
        `Gap correction: lower boundary = ${boundary.lowerLimit} − ${formatBoundary(boundary.gapBefore > 0 ? boundary.gapBefore : boundary.gapAfter)}/2 = ${formatBoundary(l)}\n` +
        `Upper boundary = ${boundary.upperLimit} + ${formatBoundary(boundary.gapAfter > 0 ? boundary.gapAfter : boundary.gapBefore)}/2 = ${formatBoundary(boundary.upperBoundary)}\n` +
        `Class width h = ${formatBoundary(boundary.upperBoundary)} − ${formatBoundary(l)} = ${formatBoundary(h)}`,
    });
  }

  steps.push(
    {
      step: hasGaps ? 3 : 2,
      title: 'Extract formula values',
      content: `l = ${formatBoundary(l)} (lower class boundary), h = ${formatBoundary(h)}, fₘ = ${fm}, f₁ = ${f1}, f₂ = ${f2}`,
    },
    {
      step: hasGaps ? 4 : 3,
      title: 'Compute the fraction',
      content: `(fₘ − f₁) / (2fₘ − f₁ − f₂) = (${fm} − ${f1}) / (2×${fm} − ${f1} − ${f2}) = ${formatNum(numerator)} / ${formatNum(denominator)} = ${formatNum(numerator / denominator)}`,
    },
    {
      step: hasGaps ? 5 : 4,
      title: 'Apply the formula',
      content: `Mode = l + [(fₘ − f₁) / (2fₘ − f₁ − f₂)] × h = ${formatBoundary(l)} + ${formatNum(numerator / denominator)} × ${formatBoundary(h)} = ${formatNum(mode)}`,
    },
  );

  return { rows: valid, modalIndex, l, h, fm, f1, f2, mode, steps };
}

export function computeUngroupedMedian(values) {
  if (values.length === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  const count = sorted.length;
  let median;

  if (count % 2 === 1) {
    const midIndex = Math.floor(count / 2);
    median = sorted[midIndex];
  } else {
    const midIndex = count / 2;
    median = (sorted[midIndex - 1] + sorted[midIndex]) / 2;
  }

  const steps = [
    {
      step: 1,
      title: 'Arrange data in ascending order',
      content: `{ ${sorted.join(', ')} }`,
    },
    {
      step: 2,
      title: 'Count observations',
      content: `n = ${count} (${count % 2 === 1 ? 'odd' : 'even'} number of values)`,
    },
  ];

  if (count % 2 === 1) {
    const midIndex = Math.floor(count / 2) + 1;
    steps.push({
      step: 3,
      title: 'Find the middle value',
      content: `The ${midIndex}${getOrdinalSuffix(midIndex)} value is the median`,
    });
    steps.push({
      step: 4,
      title: 'Median',
      content: `Median = ${formatNum(median)}`,
    });
  } else {
    const pos1 = count / 2;
    const pos2 = count / 2 + 1;
    steps.push({
      step: 3,
      title: 'Find the two middle values',
      content: `The ${pos1}${getOrdinalSuffix(pos1)} and ${pos2}${getOrdinalSuffix(pos2)} values are ${sorted[pos1 - 1]} and ${sorted[pos2 - 1]}`,
    });
    steps.push({
      step: 4,
      title: 'Average the two middle values',
      content: `Median = (${formatNum(sorted[pos1 - 1])} + ${formatNum(sorted[pos2 - 1])}) / 2 = ${formatNum(median)}`,
    });
  }

  return { values, sorted, count, median, steps };
}

export function computeGroupedMedian(rows) {
  const valid = rows.filter((r) => r.frequency > 0);
  if (valid.length === 0) return null;

  const n = valid.reduce((s, r) => s + r.frequency, 0);
  const halfN = n / 2;

  let cumulative = 0;
  const cumulativeFreqs = [];
  let medianIndex = -1;

  for (let i = 0; i < valid.length; i++) {
    cumulative += valid[i].frequency;
    cumulativeFreqs.push(cumulative);
    if (medianIndex === -1 && cumulative >= halfN) {
      medianIndex = i;
    }
  }

  if (medianIndex === -1) return null;

  const medianRow = valid[medianIndex];
  const boundary = getClassBoundaryAt(valid, medianIndex);
  if (!boundary) return null;

  const l = boundary.lowerBoundary;
  const h = boundary.classWidth;
  const f = medianRow.frequency;
  const c = medianIndex > 0 ? cumulativeFreqs[medianIndex - 1] : 0;

  const median = l + ((halfN - c) / f) * h;

  const cumLines = valid.map(
    (r, i) => `${r.classInterval}: Fᵢ = ${r.frequency}, Cumulative = ${cumulativeFreqs[i]}`,
  );

  const hasGaps = computeClassBoundaries(valid).some((b) => b.gapBefore > 0 || b.gapAfter > 0);

  const steps = [
    {
      step: 1,
      title: 'Compute cumulative frequencies',
      content: cumLines.join('\n'),
    },
    {
      step: 2,
      title: 'Find n/2',
      content: `n = ${n}, n/2 = ${formatNum(halfN)}`,
    },
    {
      step: 3,
      title: 'Locate the median class',
      content: `Class "${medianRow.classInterval}" is the median class (cumulative freq ≥ n/2)`,
    },
  ];

  if (hasGaps) {
    steps.push({
      step: 4,
      title: 'Adjust class limits to true boundaries (account for gaps)',
      content:
        `Class limits: ${boundary.lowerLimit}–${boundary.upperLimit}\n` +
        `Lower class boundary l = ${boundary.lowerLimit} − ${formatBoundary(boundary.gapBefore > 0 ? boundary.gapBefore : boundary.gapAfter)}/2 = ${formatBoundary(l)}\n` +
        `Class width h = ${formatBoundary(h)}`,
    });
  }

  steps.push(
    {
      step: hasGaps ? 5 : 4,
      title: 'Extract formula values',
      content: `l = ${formatBoundary(l)} (lower class boundary), h = ${formatBoundary(h)}, f = ${f}, c = ${c}`,
    },
    {
      step: hasGaps ? 6 : 5,
      title: 'Apply the formula',
      content: `Median = l + [(n/2 − c) / f] × h = ${formatBoundary(l)} + [(${formatNum(halfN)} − ${c}) / ${f}] × ${formatBoundary(h)} = ${formatNum(median)}`,
    },
  );

  return { rows: valid, medianIndex, n, l, h, f, c, median, cumulativeFreqs, steps };
}

export function computeUngroupedGeometricMean(values) {
  if (values.length === 0) return null;
  if (values.some((v) => v <= 0)) {
    return { error: 'Geometric mean requires all values to be positive (greater than zero).' };
  }

  const n = values.length;
  const product = values.reduce((p, v) => p * v, 1);
  const logSum = values.reduce((s, v) => s + Math.log(v), 0);
  const geometricMean = Math.exp(logSum / n);

  const productExpression = values.map((v) => formatNum(v)).join(' × ');

  const steps = [
    {
      step: 1,
      title: 'List the observations',
      content: `x = { ${values.join(', ')} }`,
    },
    {
      step: 2,
      title: 'Count the number of values',
      content: `n = ${n}`,
    },
    {
      step: 3,
      title: 'Multiply all values together',
      content: `x₁ × x₂ × … × xₙ = ${productExpression} = ${formatProduct(product)}`,
    },
    {
      step: 4,
      title: 'Apply the formula',
      content: `G = ⁿ√(x₁ × x₂ × … × xₙ) = ${formatProduct(product)}^(1/${n}) = ${formatNum(geometricMean)}`,
    },
  ];

  return { values, n, product, geometricMean, steps };
}

export function computeGroupedGeometricMean(rows) {
  const valid = rows.filter((r) => r.frequency > 0);
  if (valid.length === 0) return null;

  const boundaries = computeClassBoundaries(valid);
  const items = valid.map((row, i) => ({
    interval: row.classInterval,
    x: boundaries[i].midPoint,
    f: row.frequency,
    power: Math.pow(boundaries[i].midPoint, row.frequency),
  }));

  if (items.some((item) => item.x <= 0)) {
    return { error: 'Geometric mean requires all midpoints to be positive (greater than zero).' };
  }

  const n = items.reduce((s, item) => s + item.f, 0);
  const logSum = items.reduce((s, item) => s + item.f * Math.log(item.x), 0);
  const productOfPowers = items.reduce((p, item) => p * item.power, 1);
  const geometricMean = Math.exp(logSum / n);

  const powerLines = items.map(
    (item) => `${item.interval}: x = ${formatNum(item.x)}, f = ${item.f} → x^f = ${formatProduct(item.power)}`,
  );
  const powerExpression = items
    .map((item) => `${formatNum(item.x)}^${item.f}`)
    .join(' × ');

  const steps = [
    {
      step: 1,
      title: 'Read the grouped frequency table',
      content: items
        .map((item) => `Class ${item.interval}: Mid Point (x) = ${formatNum(item.x)}, Frequency (f) = ${item.f}`)
        .join('\n'),
    },
    {
      step: 2,
      title: 'Compute x^f for each class',
      content: powerLines.join('\n'),
    },
    {
      step: 3,
      title: 'Multiply all x^f terms',
      content: `x₁^f₁ × x₂^f₂ × … = ${powerExpression} = ${formatProduct(productOfPowers)}`,
    },
    {
      step: 4,
      title: 'Sum of frequencies',
      content: `n = Σf = ${items.map((item) => item.f).join(' + ')} = ${n}`,
    },
    {
      step: 5,
      title: 'Apply the formula',
      content: `G = ⁿ√(x₁^f₁ × x₂^f₂ × …) = ${formatProduct(productOfPowers)}^(1/${n}) = ${formatNum(geometricMean)}`,
    },
  ];

  return { rows: valid, items, n, productOfPowers, geometricMean, steps };
}

export function computeHarmonicMeanFromFrequency(pairs) {
  const valid = pairs.filter((p) => p.frequency > 0 || p.value !== 0);
  if (valid.length === 0) return null;

  if (valid.some((p) => p.value <= 0)) {
    return { error: 'Harmonic mean requires all values to be positive (greater than zero).' };
  }

  const items = valid.map((p) => ({
    value: p.value,
    frequency: p.frequency,
    fOverX: p.frequency / p.value,
  }));

  const sumF = items.reduce((s, p) => s + p.frequency, 0);
  const sumFOverX = items.reduce((s, p) => s + p.fOverX, 0);

  if (sumF === 0 || sumFOverX === 0) return null;

  const harmonicMean = sumF / sumFOverX;

  const fOverXLines = items.map(
    (p) => `x = ${formatNum(p.value)}, f = ${p.frequency} → f/x = ${formatNum(p.fOverX)}`,
  );

  const steps = [
    {
      step: 1,
      title: 'Read the value–frequency table',
      content: items
        .map((p) => `Value (x) = ${formatNum(p.value)}, Frequency (f) = ${p.frequency}`)
        .join('\n'),
    },
    {
      step: 2,
      title: 'Compute f/x for each row',
      content: fOverXLines.join('\n'),
    },
    {
      step: 3,
      title: 'Sum of frequencies',
      content: `Σf = ${items.map((p) => p.frequency).join(' + ')} = ${sumF}`,
    },
    {
      step: 4,
      title: 'Sum of (frequency ÷ value)',
      content: `Σ(f/x) = ${items.map((p) => formatNum(p.fOverX)).join(' + ')} = ${formatNum(sumFOverX)}`,
    },
    {
      step: 5,
      title: 'Apply the formula',
      content: `H = Σf / Σ(f/x) = ${sumF} / ${formatNum(sumFOverX)} = ${formatNum(harmonicMean)}`,
    },
  ];

  return { pairs: valid, sumF, sumFOverX, harmonicMean, steps };
}

export function computeHarmonicMeanFromValues(values) {
  if (values.length === 0) return null;

  if (values.some((v) => v <= 0)) {
    return { error: 'Harmonic mean requires all values to be positive (greater than zero).' };
  }

  const n = values.length;
  const reciprocals = values.map((v) => 1 / v);
  const sumReciprocals = reciprocals.reduce((s, r) => s + r, 0);
  const harmonicMean = n / sumReciprocals;

  const reciprocalExpression = values.map((v) => `1/${formatNum(v)}`).join(' + ');
  const reciprocalValues = reciprocals.map((r) => formatNum(r)).join(' + ');

  const steps = [
    {
      step: 1,
      title: 'List the observations',
      content: `x = { ${values.join(', ')} }`,
    },
    {
      step: 2,
      title: 'Count the number of values',
      content: `n = ${n}`,
    },
    {
      step: 3,
      title: 'Find the reciprocal of each value and sum',
      content: `1/x₁ + 1/x₂ + … + 1/xₙ = ${reciprocalExpression} = ${reciprocalValues} = ${formatNum(sumReciprocals)}`,
    },
    {
      step: 4,
      title: 'Apply the formula',
      content: `H = n / (1/x₁ + 1/x₂ + … + 1/xₙ) = ${n} / ${formatNum(sumReciprocals)} = ${formatNum(harmonicMean)}`,
    },
  ];

  return { values, n, sumReciprocals, harmonicMean, steps };
}

function getOrdinalSuffix(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export function createDefaultClassRows() {
  return [
    { id: '1', classInterval: '10 – 20', lowerBound: 10, upperBound: 20, frequency: 5 },
    { id: '2', classInterval: '20 – 30', lowerBound: 20, upperBound: 30, frequency: 8 },
    { id: '3', classInterval: '30 – 40', lowerBound: 30, upperBound: 40, frequency: 12 },
    { id: '4', classInterval: '40 – 50', lowerBound: 40, upperBound: 50, frequency: 10 },
    { id: '5', classInterval: '50 – 60', lowerBound: 50, upperBound: 60, frequency: 5 },
  ];
}

export function createId() {
  return Math.random().toString(36).slice(2, 9);
}
