import { computeClassBoundaries } from './classBoundaries';
import { formatNum } from './formatNumber';

function formatChartNum(n) {
  return formatNum(n, 1);
}

export function buildValuesChart(values, options = {}) {
  if (!values?.length) return null;

  const sorted = options.sorted ? [...values].sort((a, b) => a - b) : values;

  return {
    title: options.title ?? 'Data Plot',
    xLabel: options.xLabel ?? 'Observation',
    yLabel: options.yLabel ?? 'Value',
    labels: sorted.map((_, i) => `${i + 1}`),
    values: sorted,
    resultLines: options.resultLines ?? [],
    resultSummary: options.resultSummary ?? null,
  };
}

export function buildFrequencyPairsChart(pairs, options = {}) {
  const valid = pairs?.filter((p) => p.frequency > 0) ?? [];
  if (!valid.length) return null;

  const xValues = valid.map((p) => p.value);

  return {
    title: options.title ?? 'f vs x',
    xLabel: options.xLabel ?? 'x (Value)',
    yLabel: options.yLabel ?? 'f (Frequency)',
    labels: xValues.map(formatChartNum),
    xValues,
    values: valid.map((p) => p.frequency),
    resultLines: options.resultLines ?? [],
    resultSummary: options.resultSummary ?? null,
  };
}

export function buildGroupedChart(rows, options = {}) {
  const valid = rows?.map((row, index) => ({ row, index })).filter(({ row }) => row.frequency > 0) ?? [];
  if (!valid.length) return null;

  const boundaries = computeClassBoundaries(rows);
  const xValues = valid.map(({ index }) => boundaries[index].midPoint);

  return {
    title: options.title ?? 'f vs x (Grouped Data)',
    xLabel: options.xLabel ?? 'x (Mid Point)',
    yLabel: options.yLabel ?? 'f (Frequency)',
    labels: xValues.map(formatChartNum),
    xValues,
    values: valid.map(({ row }) => row.frequency),
    resultLines: options.resultLines ?? [],
    resultSummary: options.resultSummary ?? null,
  };
}

export function buildMidpointChart(rows, midpoints, options = {}) {
  const valid = rows?.filter((r) => r.frequency > 0) ?? [];
  if (!valid.length) return null;

  return {
    title: options.title ?? 'Class Midpoints',
    xLabel: options.xLabel ?? 'Class',
    yLabel: options.yLabel ?? 'Mid Point',
    labels: valid.map((r) => r.classInterval),
    values: midpoints,
    resultLines: options.resultLines ?? [],
    resultSummary: options.resultSummary ?? null,
  };
}

export function resultLine(value, label, color = '#dc2626') {
  if (value == null || Number.isNaN(value)) return null;
  return { value, label, color };
}

export function resultLinesFromObject(entries) {
  return entries.map(([value, label, color]) => resultLine(value, label, color)).filter(Boolean);
}
