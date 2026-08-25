import { computeClassBoundaries, formatBoundary } from '../utils/classBoundaries';
import { createId } from '../utils/statistics';
import { formatNum } from '../utils/formatNumber';

const inputClass =
  'w-full rounded border border-academic-300 bg-white px-2 py-1.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400';

function parseClassInterval(text) {
  const match = String(text).match(/(\d+(?:\.\d+)?)\s*[-–—to]+\s*(\d+(?:\.\d+)?)/i);
  if (!match) return null;
  return { lowerBound: Number(match[1]), upperBound: Number(match[2]) };
}

function formatTableProduct(value) {
  if (!Number.isFinite(value)) return '—';
  if (value > 1e10 || (value > 0 && value < 0.0001)) return value.toExponential(4);
  return formatNum(value, 4);
}

export function EditableFrequencyTable({
  rows,
  onChange,
  showMidPoint = false,
  showProduct = false,
  productType = 'multiply',
  showBoundaries = false,
  compact = false,
  highlightRowIndex,
  highlightLabel = 'Highlighted class',
  showCumulative = false,
}) {
  const boundaries = computeClassBoundaries(rows);

  const updateRow = (id, field, value) => {
    onChange(
      rows.map((row) => {
        if (row.id !== id) return row;
        if (field === 'classInterval') {
          const parsed = parseClassInterval(value);
          return parsed
            ? { ...row, classInterval: String(value), ...parsed }
            : { ...row, classInterval: String(value) };
        }
        const num = Number(value);
        return { ...row, [field]: Number.isNaN(num) ? 0 : num };
      }),
    );
  };

  const addRow = () => {
    const last = rows[rows.length - 1];
    const nominalWidth = last ? last.upperBound - last.lowerBound : 10;
    const gap = 1;
    const lower = last ? last.upperBound + gap : 0;
    const upper = lower + nominalWidth;
    onChange([
      ...rows,
      {
        id: createId(),
        classInterval: `${lower} – ${upper}`,
        lowerBound: lower,
        upperBound: upper,
        frequency: 0,
      },
    ]);
  };

  const removeRow = (id) => {
    if (rows.length <= 1) return;
    onChange(rows.filter((r) => r.id !== id));
  };

  let cumulative = 0;
  const totalF = rows.reduce((s, r) => s + r.frequency, 0);
  const totalFx = boundaries.reduce((s, b, i) => s + b.midPoint * rows[i].frequency, 0);
  const totalPowerProduct = boundaries.reduce(
    (p, b, i) => p * Math.pow(b.midPoint, rows[i].frequency),
    1,
  );

  const getRowProduct = (midPoint, frequency) =>
    productType === 'power' ? Math.pow(midPoint, frequency) : midPoint * frequency;

  const getProductLabel = () => {
    if (productType === 'power') return compact ? 'x^f' : 'Xᵢ^Fᵢ';
    return compact ? 'x × f' : 'Fᵢ × Xᵢ';
  };

  const getTotalProduct = () =>
    productType === 'power' ? totalPowerProduct : totalFx;

  const hasGaps = !compact && boundaries.some((b) => b.gapAfter > 0 || b.gapBefore > 0);

  const showLimits = !compact;
  const showActions = true;

  return (
    <div className="space-y-3">
      {hasGaps && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>Gap detected</strong> between class intervals. Lower/upper boundaries and class
          width (h) are adjusted automatically for mode and median formulas.
        </div>
      )}

      <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-academic-700 text-white">
              <th className="border border-academic-600 px-3 py-2.5 text-left">
                {compact ? 'Class Intervals' : 'Class Interval'}
              </th>
              {showLimits && (
                <>
                  <th className="border border-academic-600 px-3 py-2.5 text-center">Lower Limit</th>
                  <th className="border border-academic-600 px-3 py-2.5 text-center">Upper Limit</th>
                </>
              )}
              {showBoundaries && (
                <>
                  <th className="border border-academic-600 px-3 py-2.5 text-center">Gap (g)</th>
                  <th className="border border-academic-600 px-3 py-2.5 text-center">Lower Boundary (l)</th>
                  <th className="border border-academic-600 px-3 py-2.5 text-center">Upper Boundary</th>
                  <th className="border border-academic-600 px-3 py-2.5 text-center">h</th>
                </>
              )}
              {showMidPoint && (
                <th className="border border-academic-600 px-3 py-2.5 text-center">
                  {compact ? 'Mid Point (X)' : 'Mid Point (Xᵢ)'}
                </th>
              )}
              <th className="border border-academic-600 px-3 py-2.5 text-center">
                {compact ? 'Frequency (f)' : 'Frequency (Fᵢ)'}
              </th>
              {showProduct && (
                <th className="border border-academic-600 px-3 py-2.5 text-center">
                  {getProductLabel()}
                </th>
              )}
              {showCumulative && (
                <th className="border border-academic-600 px-3 py-2.5 text-center">Cumulative</th>
              )}
              {showActions && (
                <th className="border border-academic-600 px-3 py-2.5 text-center w-16"> </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const b = boundaries[index];
              const product = getRowProduct(b.midPoint, row.frequency);
              cumulative += row.frequency;
              const isHighlighted = highlightRowIndex === index;
              const gapDisplay = b.gapAfter > 0 ? b.gapAfter : index > 0 ? b.gapBefore : 0;

              return (
                <tr
                  key={row.id}
                  className={`transition-colors ${
                    isHighlighted
                      ? 'bg-highlight font-semibold ring-2 ring-inset ring-highlight-border'
                      : index % 2 === 0
                        ? 'bg-white'
                        : 'bg-academic-50'
                  }`}
                >
                  <td className="border border-academic-200 px-2 py-1.5">
                    <input
                      type="text"
                      className={inputClass}
                      value={row.classInterval}
                      onChange={(e) => updateRow(row.id, 'classInterval', e.target.value)}
                    />
                  </td>
                  {showLimits && (
                    <>
                      <td className="border border-academic-200 px-2 py-1.5">
                        <input
                          type="number"
                          className={`${inputClass} text-center`}
                          value={row.lowerBound}
                          onChange={(e) => updateRow(row.id, 'lowerBound', e.target.value)}
                        />
                      </td>
                      <td className="border border-academic-200 px-2 py-1.5">
                        <input
                          type="number"
                          className={`${inputClass} text-center`}
                          value={row.upperBound}
                          onChange={(e) => updateRow(row.id, 'upperBound', e.target.value)}
                        />
                      </td>
                    </>
                  )}
                  {showBoundaries && (
                    <>
                      <td className="border border-academic-200 px-3 py-2.5 text-center text-amber-800">
                        {gapDisplay > 0 ? gapDisplay : '—'}
                      </td>
                      <td className="border border-academic-200 px-3 py-2.5 text-center font-medium text-blue-900">
                        {formatBoundary(b.lowerBoundary)}
                      </td>
                      <td className="border border-academic-200 px-3 py-2.5 text-center font-medium text-blue-900">
                        {formatBoundary(b.upperBoundary)}
                      </td>
                      <td className="border border-academic-200 px-3 py-2.5 text-center font-medium text-blue-900">
                        {formatBoundary(b.classWidth)}
                      </td>
                    </>
                  )}
                  {showMidPoint && (
                    <td className="border border-academic-200 px-3 py-2.5 text-center">
                      {formatBoundary(b.midPoint)}
                    </td>
                  )}
                  <td className="border border-academic-200 px-2 py-1.5">
                    <input
                      type="number"
                      min={0}
                      className={`${inputClass} text-center`}
                      value={row.frequency}
                      onChange={(e) => updateRow(row.id, 'frequency', e.target.value)}
                    />
                  </td>
                  {showProduct && (
                    <td className="border border-academic-200 px-3 py-2.5 text-center font-medium">
                      {productType === 'power'
                        ? formatTableProduct(product)
                        : formatBoundary(product)}
                    </td>
                  )}
                  {showCumulative && (
                    <td className="border border-academic-200 px-3 py-2.5 text-center">
                      {cumulative}
                    </td>
                  )}
                  {showActions && (
                    <td className="border border-academic-200 px-2 py-1.5 text-center">
                      <button
                        type="button"
                        onClick={() => removeRow(row.id)}
                        disabled={rows.length <= 1}
                        className="rounded p-1 text-red-500 hover:bg-red-50 disabled:opacity-30"
                        aria-label="Delete row"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
            {(showMidPoint || showProduct) && (
              <tr className="bg-academic-200 font-bold text-academic-900">
                <td
                  className="border border-academic-300 px-3 py-2.5"
                  colSpan={
                    compact
                      ? 1
                      : 3 + (showBoundaries ? 4 : 0) + (showMidPoint ? 1 : 0)
                  }
                >
                  Total
                </td>
                {compact && showMidPoint && (
                  <td className="border border-academic-300 px-3 py-2.5 text-center">—</td>
                )}
                <td className="border border-academic-300 px-3 py-2.5 text-center">{totalF}</td>
                {showProduct && (
                  <td className="border border-academic-300 px-3 py-2.5 text-center">
                    {productType === 'power'
                      ? formatTableProduct(getTotalProduct())
                      : formatBoundary(totalFx)}
                  </td>
                )}
                {showCumulative && <td className="border border-academic-300" />}
                {showActions && <td className="border border-academic-300" />}
              </tr>
            )}
          </tbody>
        </table>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1.5 rounded-lg border border-academic-300 bg-white px-3 py-2 text-sm font-medium text-academic-700 hover:bg-academic-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Row
        </button>
        {highlightRowIndex !== undefined && (
          <p className="flex items-center gap-2 text-xs text-academic-600">
            <span className="inline-block h-3 w-6 rounded border-2 border-highlight-border bg-highlight" />
            {highlightLabel}
          </p>
        )}
      </div>
    </div>
  );
}
