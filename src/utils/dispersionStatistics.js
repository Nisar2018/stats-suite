import {
  getMidPoint,
  computeUngroupedMean,
  computeGroupedMean,
  computeUngroupedMedian,
  computeGroupedMedian,
  computeUngroupedMode,
  computeGroupedMode,
} from './statistics';
import { computeUngroupedQuartiles, computeGroupedQuartiles } from './positionStatistics';
import { computeClassBoundaries } from './classBoundaries';
import { formatNum } from './formatNumber';

/** Range — ungrouped: R = Xmax − Xmin */
export function computeUngroupedRange(values) {
  if (!values?.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const xmin = sorted[0];
  const xmax = sorted[sorted.length - 1];
  const range = xmax - xmin;
  const coeff = xmax + xmin !== 0 ? (xmax - xmin) / (xmax + xmin) : null;

  return {
    xmin,
    xmax,
    range,
    coeff,
    n: values.length,
    steps: [
      { step: 1, title: 'Identify extremes', content: `Yₘᵢₙ = ${formatNum(xmin)}, Yₘₐₓ = ${formatNum(xmax)}` },
      {
        step: 2,
        title: 'Compute range',
        content: `R = Yₘₐₓ − Yₘᵢₙ = ${formatNum(xmax)} − ${formatNum(xmin)} = ${formatNum(range)}`,
      },
      ...(coeff != null
        ? [
            {
              step: 3,
              title: 'Coefficient of range',
              content: `Coefficient of range = (Yₘₐₓ − Yₘᵢₙ) / (Yₘₐₓ + Yₘᵢₙ) = (${formatNum(xmax)} − ${formatNum(xmin)}) / (${formatNum(xmax)} + ${formatNum(xmin)}) = ${formatNum(coeff)}`,
            },
          ]
        : []),
    ],
  };
}

/**
 * Range — grouped: mid-point of last class boundary − mid-point of first class boundary
 * (class mid-value of last class − class mid-value of first class)
 */
export function computeGroupedRange(rows) {
  const valid = rows.filter((r) => r.frequency > 0);
  if (valid.length === 0) return null;

  const firstMid = getMidPoint(valid[0]);
  const lastMid = getMidPoint(valid[valid.length - 1]);
  if (!Number.isFinite(firstMid) || !Number.isFinite(lastMid)) return null;

  const range = lastMid - firstMid;
  const boundaries = computeClassBoundaries(valid);

  return {
    firstMid,
    lastMid,
    range,
    firstInterval: valid[0].classInterval,
    lastInterval: valid[valid.length - 1].classInterval,
    firstBoundary: boundaries[0],
    lastBoundary: boundaries[boundaries.length - 1],
    steps: [
      {
        step: 1,
        title: 'Mid-point of first class',
        content: `First class: ${valid[0].classInterval}\nMid-point = (${valid[0].lowerBound} + ${valid[0].upperBound}) / 2 = ${formatNum(firstMid)}`,
      },
      {
        step: 2,
        title: 'Mid-point of last class',
        content: `Last class: ${valid[valid.length - 1].classInterval}\nMid-point = (${valid[valid.length - 1].lowerBound} + ${valid[valid.length - 1].upperBound}) / 2 = ${formatNum(lastMid)}`,
      },
      {
        step: 3,
        title: 'Compute range',
        content: `R = mid(last) − mid(first) = ${formatNum(lastMid)} − ${formatNum(firstMid)} = ${formatNum(range)}`,
      },
    ],
  };
}

/** Quartile deviation Q.D = (Q₃ − Q₁) / 2 */
export function computeUngroupedQuartileDeviation(values) {
  const q = computeUngroupedQuartiles(values);
  if (!q) return null;
  const qd = (q.q3 - q.q1) / 2;
  const coeff = q.q3 + q.q1 !== 0 ? (q.q3 - q.q1) / (q.q3 + q.q1) : null;

  return {
    ...q,
    qd,
    coeff,
    steps: [
      ...q.steps,
      {
        step: q.steps.length + 1,
        title: 'Quartile deviation',
        content: `Q.D = (Q₃ − Q₁) / 2 = (${formatNum(q.q3)} − ${formatNum(q.q1)}) / 2 = ${formatNum(qd)}`,
      },
      ...(coeff != null
        ? [
            {
              step: q.steps.length + 2,
              title: 'Coefficient of quartile deviation',
              content: `Coefficient = (Q₃ − Q₁) / (Q₃ + Q₁) = (${formatNum(q.q3)} − ${formatNum(q.q1)}) / (${formatNum(q.q3)} + ${formatNum(q.q1)}) = ${formatNum(coeff)}`,
            },
          ]
        : []),
    ],
  };
}

export function computeGroupedQuartileDeviation(rows) {
  const q = computeGroupedQuartiles(rows);
  if (!q) return null;
  const qd = (q.q3 - q.q1) / 2;
  const coeff = q.q3 + q.q1 !== 0 ? (q.q3 - q.q1) / (q.q3 + q.q1) : null;

  return {
    ...q,
    qd,
    coeff,
    steps: [
      ...q.steps,
      {
        step: q.steps.length + 1,
        title: 'Quartile deviation',
        content: `Q.D = (Q₃ − Q₁) / 2 = (${formatNum(q.q3)} − ${formatNum(q.q1)}) / 2 = ${formatNum(qd)}`,
      },
      ...(coeff != null
        ? [
            {
              step: q.steps.length + 2,
              title: 'Coefficient of quartile deviation',
              content: `Coefficient = (Q₃ − Q₁) / (Q₃ + Q₁) = ${formatNum(coeff)}`,
            },
          ]
        : []),
    ],
  };
}

/**
 * Mean deviation about a center M
 * Ungrouped: Σ|y − M| / n
 * Grouped: Σ fi|Xi − M| / Σ fi
 */
export function computeUngroupedMeanDeviation(values, centerType = 'mean') {
  if (!values?.length) return null;

  let center;
  let centerLabel;
  let centerResult;

  if (centerType === 'median') {
    centerResult = computeUngroupedMedian(values);
    center = centerResult?.median;
    centerLabel = 'Median';
  } else if (centerType === 'mode') {
    centerResult = computeUngroupedMode(values);
    centerLabel = 'Mode';
    if (!centerResult?.modes?.length) return null;
    center = centerResult.modes[0];
  } else {
    centerResult = computeUngroupedMean(values);
    center = centerResult?.mean;
    centerLabel = 'Mean';
  }

  if (!Number.isFinite(center)) return null;

  const n = values.length;
  const absDevs = values.map((y) => Math.abs(y - center));
  const sumAbs = absDevs.reduce((s, d) => s + d, 0);
  const md = sumAbs / n;
  const coeff = center !== 0 ? md / Math.abs(center) : null;

  const rows = values.map((y, i) => ({
    y,
    absDev: absDevs[i],
  }));

  return {
    center,
    centerLabel,
    n,
    sumAbs,
    md,
    coeff,
    rows,
    steps: [
      {
        step: 1,
        title: `Find ${centerLabel.toLowerCase()} (M)`,
        content: `M = ${centerLabel} = ${formatNum(center)}`,
      },
      {
        step: 2,
        title: 'Sum of absolute deviations',
        content: `Σ|y − M| = ${formatNum(sumAbs)}`,
      },
      {
        step: 3,
        title: 'Mean deviation',
        content: `M.D = Σ|y − M| / n = ${formatNum(sumAbs)} / ${n} = ${formatNum(md)}`,
      },
      ...(coeff != null
        ? [
            {
              step: 4,
              title: `${centerLabel} coefficient of dispersion`,
              content: `Coefficient = M.D / ${centerLabel} = ${formatNum(md)} / ${formatNum(center)} = ${formatNum(coeff)}`,
            },
          ]
        : []),
    ],
  };
}

export function computeGroupedMeanDeviation(rows, centerType = 'mean') {
  const valid = rows.filter((r) => r.frequency > 0);
  if (!valid.length) return null;

  let center;
  let centerLabel;
  let centerIndex;

  if (centerType === 'median') {
    const med = computeGroupedMedian(valid);
    center = med?.median;
    centerLabel = 'Median';
    centerIndex = med?.medianIndex;
  } else if (centerType === 'mode') {
    const mode = computeGroupedMode(valid);
    center = mode?.mode;
    centerLabel = 'Mode';
    centerIndex = mode?.modalIndex;
  } else {
    const mean = computeGroupedMean(valid);
    center = mean?.mean;
    centerLabel = 'Mean';
  }

  if (!Number.isFinite(center)) return null;

  const totalF = valid.reduce((s, r) => s + r.frequency, 0);
  const tableRows = valid.map((r) => {
    const xi = getMidPoint(r);
    const absDev = Math.abs(xi - center);
    const fiAbs = r.frequency * absDev;
    return {
      ...r,
      xi,
      absDev,
      fiAbs,
    };
  });

  const sumFiAbs = tableRows.reduce((s, r) => s + r.fiAbs, 0);
  const md = sumFiAbs / totalF;
  const coeff = center !== 0 ? md / Math.abs(center) : null;

  return {
    center,
    centerLabel,
    centerIndex,
    totalF,
    sumFiAbs,
    md,
    coeff,
    tableRows,
    steps: [
      {
        step: 1,
        title: `Find ${centerLabel.toLowerCase()} (M)`,
        content: `M = ${centerLabel} = ${formatNum(center)}`,
      },
      {
        step: 2,
        title: 'Compute Σ fi|Xi − M|',
        content: `Σ fi|Xi − M| = ${formatNum(sumFiAbs)}`,
      },
      {
        step: 3,
        title: 'Mean deviation',
        content: `M.D = Σ fi|Xi − M| / Σ fi = ${formatNum(sumFiAbs)} / ${totalF} = ${formatNum(md)}`,
      },
      ...(coeff != null
        ? [
            {
              step: 4,
              title: `${centerLabel} coefficient of dispersion`,
              content: `Coefficient = M.D / ${centerLabel} = ${formatNum(md)} / ${formatNum(center)} = ${formatNum(coeff)}`,
            },
          ]
        : []),
    ],
  };
}

/** Variance & SD — population form as in syllabus: Σ(yi−mean)² / n */
export function computeUngroupedVariance(values) {
  const meanResult = computeUngroupedMean(values);
  if (!meanResult) return null;

  const { mean, n } = meanResult;
  const squared = values.map((y) => {
    const d = y - mean;
    return { y, d, d2: d * d };
  });
  const sumSq = squared.reduce((s, r) => s + r.d2, 0);
  const variance = sumSq / n;
  const sd = Math.sqrt(variance);
  const cv = mean !== 0 ? (variance / mean) * 100 : null;
  const coeffSd = mean !== 0 ? sd / mean : null;

  return {
    mean,
    n,
    sumSq,
    variance,
    sd,
    cv,
    coeffSd,
    rows: squared,
    steps: [
      { step: 1, title: 'Mean', content: `Mean = ${formatNum(mean)}` },
      { step: 2, title: 'Sum of squared deviations', content: `Σ(yi − mean)² = ${formatNum(sumSq)}` },
      {
        step: 3,
        title: 'Variance',
        content: `Variance = Σ(yi − mean)² / n = ${formatNum(sumSq)} / ${n} = ${formatNum(variance)}`,
      },
      {
        step: 4,
        title: 'Standard deviation',
        content: `S.D = √Variance = √${formatNum(variance)} = ${formatNum(sd)}`,
      },
      ...(cv != null
        ? [
            {
              step: 5,
              title: 'Coefficient of variance',
              content: `Coefficient of variance = (Variance / Mean) × 100 = (${formatNum(variance)} / ${formatNum(mean)}) × 100 = ${formatNum(cv)}`,
            },
          ]
        : []),
      ...(coeffSd != null
        ? [
            {
              step: cv != null ? 6 : 5,
              title: 'Coefficient of S.D',
              content: `Coefficient of S.D = S.D / Mean = ${formatNum(sd)} / ${formatNum(mean)} = ${formatNum(coeffSd)}`,
            },
          ]
        : []),
    ],
  };
}

export function computeGroupedVariance(rows) {
  const meanResult = computeGroupedMean(rows);
  if (!meanResult) return null;

  const { mean, totalF } = meanResult;
  const valid = rows.filter((r) => r.frequency > 0);

  const tableRows = valid.map((r) => {
    const xi = getMidPoint(r);
    const d = xi - mean;
    const fiXi = r.frequency * xi;
    const fiD2 = r.frequency * d * d;
    return { ...r, xi, fiXi, d, fiD2 };
  });

  const sumFiD2 = tableRows.reduce((s, r) => s + r.fiD2, 0);
  const sumFiXi = tableRows.reduce((s, r) => s + r.fiXi, 0);
  const variance = sumFiD2 / totalF;
  const sd = Math.sqrt(variance);
  const cv = mean !== 0 ? (variance / mean) * 100 : null;
  const coeffSd = mean !== 0 ? sd / mean : null;

  return {
    mean,
    totalF,
    sumFiD2,
    sumFiXi,
    variance,
    sd,
    cv,
    coeffSd,
    tableRows,
    steps: [
      { step: 1, title: 'Mean', content: `Mean = Σ fiXi / Σ fi = ${formatNum(sumFiXi)} / ${totalF} = ${formatNum(mean)}` },
      { step: 2, title: 'Sum Σ fi(Xi − M)²', content: `Σ fi(Xi − M)² = ${formatNum(sumFiD2)}` },
      {
        step: 3,
        title: 'Variance',
        content: `Variance = Σ fi(Xi − M)² / Σ fi = ${formatNum(sumFiD2)} / ${totalF} = ${formatNum(variance)}`,
      },
      {
        step: 4,
        title: 'Standard deviation',
        content: `S.D = √Variance = ${formatNum(sd)}`,
      },
      ...(cv != null
        ? [
            {
              step: 5,
              title: 'Coefficient of variance',
              content: `Coefficient of variance = (Variance / Mean) × 100 = (${formatNum(variance)} / ${formatNum(mean)}) × 100 = ${formatNum(cv)}`,
            },
          ]
        : []),
      ...(coeffSd != null
        ? [
            {
              step: cv != null ? 6 : 5,
              title: 'Coefficient of S.D',
              content: `Coefficient of S.D = S.D / Mean = ${formatNum(sd)} / ${formatNum(mean)} = ${formatNum(coeffSd)}`,
            },
          ]
        : []),
    ],
  };
}
