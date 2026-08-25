import { useMemo, useState } from 'react';
import {
  buildCrfPolygonRows,
  createId,
  formatClassBoundary,
  formatClassValue,
  formatNum,
  parseClassBoundary,
  parseClassIntervalRange,
} from '../../utils/representationStatistics';
import { FormulaBox } from '../FormulaBox';
import { PolygonChart } from './PolygonChart';

const defaultRows = [
  { id: createId(), classInterval: '10 – 20', classBoundary: '9.5-19.5', frequency: 5 },
  { id: createId(), classInterval: '20 – 30', classBoundary: '19.5-29.5', frequency: 8 },
  { id: createId(), classInterval: '30 – 40', classBoundary: '29.5-39.5', frequency: 12 },
  { id: createId(), classInterval: '40 – 50', classBoundary: '39.5-49.5', frequency: 7 },
];

function TrashBtn({ onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded p-1 text-red-500 hover:bg-red-50 disabled:opacity-30"
      aria-label="Delete row"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  );
}

export function CumulativeRelativeFrequencyPolygonContent() {
  const [rows, setRows] = useState(defaultRows);

  const result = useMemo(() => buildCrfPolygonRows(rows), [rows]);

  const updateRow = (id, field, value) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (field === 'frequency') return { ...r, frequency: value };
        if (field === 'classInterval') {
          const parsed = parseClassIntervalRange(value);
          if (parsed) {
            const lower = parsed.lower - 0.5;
            const upper = parsed.upper - 0.5;
            return {
              ...r,
              classInterval: value,
              classBoundary: formatClassBoundary(lower, upper),
            };
          }
          return { ...r, classInterval: value };
        }
        if (field === 'classBoundary') {
          const parsed = parseClassBoundary(value);
          return {
            ...r,
            classBoundary: parsed
              ? formatClassBoundary(parsed.lower, parsed.upper)
              : value,
          };
        }
        return { ...r, [field]: value };
      }),
    );
  };

  const addRow = () => {
    setRows((prev) => {
      const last = prev[prev.length - 1];
      const parsed = last ? parseClassBoundary(last.classBoundary) : null;
      const lower = parsed ? parsed.upper : 9.5;
      const span = parsed ? parsed.upper - parsed.lower : 10;
      const upper = lower + span;
      const lowerLimit = lower + 0.5;
      const upperLimit = upper - 0.5;
      return [
        ...prev,
        {
          id: createId(),
          classInterval: `${lowerLimit} – ${upperLimit}`,
          classBoundary: formatClassBoundary(lower, upper),
          frequency: 0,
        },
      ];
    });
  };

  const removeRow = (id) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const chartPoints = useMemo(() => {
    if (!result) return [];
    const pts = [];
    const first = result.rows[0];
    if (first?.lowerBoundary != null) {
      pts.push({ x: first.lowerBoundary, y: 0 });
    }
    for (const r of result.rows) {
      if (r.upperBoundary == null) continue;
      pts.push({ x: r.upperBoundary, y: r.cumulativeRelativeFrequency });
    }
    return pts;
  }, [result]);

  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        A cumulative relative frequency polygon is drawn between{' '}
        <strong>upper class boundaries</strong> (x-axis) and{' '}
        <strong>cumulative relative class frequency</strong> (y-axis).
      </p>

      <FormulaBox label="Cumulative relative frequency">
        <span>C.R.F = (sum of frequencies up to current class) ÷ (total frequency)</span>
      </FormulaBox>

      <div className="overflow-x-auto rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-academic-700 text-white">
              <th className="border border-academic-600 px-3 py-2.5">Class interval</th>
              <th className="border border-academic-600 px-3 py-2.5">Class boundaries</th>
              <th className="border border-academic-600 px-3 py-2.5">Frequency</th>
              <th className="border border-academic-600 px-3 py-2.5">Upper class boundaries</th>
              <th className="border border-academic-600 px-3 py-2.5">Cumulative Relative Frequency</th>
              <th className="w-12 border border-academic-600" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const enriched = result?.rows.find((r) => r.id === row.id);
              const upper =
                enriched?.upperBoundary ??
                parseClassBoundary(row.classBoundary)?.upper ??
                null;
              return (
                <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                  <td className="border border-academic-200 px-2 py-1.5">
                    <input
                      type="text"
                      className="w-full rounded border border-academic-300 px-2 py-1.5 text-sm"
                      value={row.classInterval}
                      onChange={(e) => updateRow(row.id, 'classInterval', e.target.value)}
                    />
                  </td>
                  <td className="border border-academic-200 px-2 py-1.5">
                    <input
                      type="text"
                      className="w-full rounded border border-academic-300 px-2 py-1.5 text-center text-sm"
                      value={row.classBoundary}
                      onChange={(e) => updateRow(row.id, 'classBoundary', e.target.value)}
                      placeholder="e.g. 9.5-19.5"
                    />
                  </td>
                  <td className="border border-academic-200 px-2 py-1.5">
                    <input
                      type="number"
                      min={0}
                      className="w-full rounded border border-academic-300 px-2 py-1.5 text-center text-sm"
                      value={row.frequency}
                      onChange={(e) => updateRow(row.id, 'frequency', e.target.value)}
                    />
                  </td>
                  <td className="border border-academic-200 px-3 py-2 text-center font-medium">
                    {upper != null ? formatClassValue(upper) : '—'}
                  </td>
                  <td className="border border-academic-200 px-3 py-2 text-center font-medium">
                    {enriched ? formatNum(enriched.cumulativeRelativeFrequency, 4) : '—'}
                  </td>
                  <td className="border border-academic-200 px-1 text-center">
                    <TrashBtn onClick={() => removeRow(row.id)} disabled={rows.length <= 1} />
                  </td>
                </tr>
              );
            })}
            {result && (
              <tr className="bg-academic-200 font-bold">
                <td colSpan={2} className="border border-academic-300 px-3 py-2.5">
                  Total
                </td>
                <td className="border border-academic-300 px-3 py-2.5 text-center">{result.totalF}</td>
                <td className="border border-academic-300" />
                <td className="border border-academic-300 px-3 py-2.5 text-center">1.0000</td>
                <td className="border border-academic-300" />
              </tr>
            )}
          </tbody>
        </table>
        <button
          type="button"
          onClick={addRow}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-academic-300 bg-white px-3 py-2 text-sm font-medium text-academic-700 hover:bg-academic-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add new Row
        </button>
      </div>

      {chartPoints.length > 0 && (
        <PolygonChart
          title="Cumulative Relative Frequency Polygon"
          points={chartPoints}
          xLabel="Upper class boundary"
          yLabel="Cumulative relative frequency"
        />
      )}
    </section>
  );
}
