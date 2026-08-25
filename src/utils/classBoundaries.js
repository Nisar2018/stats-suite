/** Gap between consecutive classes: next lower limit − current upper limit */
export function getGapBetween(current, next) {
  return next.lowerBound - current.upperBound;
}

export function computeClassBoundaries(rows) {
  if (rows.length === 0) return [];

  return rows.map((row, index) => {
    const gapBefore =
      index > 0 ? getGapBetween(rows[index - 1], row) : 0;
    const gapAfter =
      index < rows.length - 1 ? getGapBetween(row, rows[index + 1]) : 0;

    let effectiveGapBefore = gapBefore;
    let effectiveGapAfter = gapAfter;

    if (rows.length === 1) {
      effectiveGapBefore = 0;
      effectiveGapAfter = 0;
    } else if (index === 0) {
      effectiveGapBefore = gapAfter;
    } else if (index === rows.length - 1) {
      effectiveGapAfter = gapBefore;
    }

    const lowerBoundary = row.lowerBound - effectiveGapBefore / 2;
    const upperBoundary = row.upperBound + effectiveGapAfter / 2;
    const classWidth = upperBoundary - lowerBoundary;
    const midPoint = (row.lowerBound + row.upperBound) / 2;

    return {
      index,
      lowerLimit: row.lowerBound,
      upperLimit: row.upperBound,
      gapBefore,
      gapAfter,
      lowerBoundary,
      upperBoundary,
      classWidth,
      midPoint,
    };
  });
}

export function getClassBoundaryAt(rows, index) {
  const all = computeClassBoundaries(rows);
  return all[index] ?? null;
}

export function formatBoundary(value) {
  if (!Number.isFinite(value)) return '—';
  if (Number.isInteger(value)) return String(value);
  return String(parseFloat(value.toFixed(2)));
}

export function buildGapExplanation(rows) {
  const boundaries = computeClassBoundaries(rows);
  if (boundaries.length === 0) return '';

  const lines = boundaries.map((b) => {
    const gapNote =
      b.gapAfter > 0
        ? `gap after = ${b.gapAfter}`
        : b.gapBefore > 0
          ? `gap before = ${b.gapBefore}`
          : 'no gap (continuous classes)';
    return (
      `${rows[b.index].classInterval}: limits ${b.lowerLimit}–${b.upperLimit} → ` +
      `boundaries ${formatBoundary(b.lowerBoundary)}–${formatBoundary(b.upperBoundary)}, ` +
      `h = ${formatBoundary(b.classWidth)} (${gapNote})`
    );
  });

  return lines.join('\n');
}
