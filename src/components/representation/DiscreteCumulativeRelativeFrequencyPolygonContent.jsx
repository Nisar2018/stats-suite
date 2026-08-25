import { useMemo, useState } from 'react';
import {
  buildDiscreteCrfRows,
  createId,
  formatNum,
} from '../../utils/representationStatistics';
import { FormulaBox } from '../FormulaBox';
import { PolygonChart } from './PolygonChart';

const defaultRows = [
  { id: createId(), value: 1, frequency: 4 },
  { id: createId(), value: 2, frequency: 7 },
  { id: createId(), value: 3, frequency: 10 },
  { id: createId(), value: 4, frequency: 6 },
  { id: createId(), value: 5, frequency: 3 },
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

export function DiscreteCumulativeRelativeFrequencyPolygonContent() {
  const [rows, setRows] = useState(defaultRows);

  const result = useMemo(() => buildDiscreteCrfRows(rows), [rows]);

  const updateRow = (id, field, value) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  const addRow = () => {
    setRows((prev) => {
      const last = prev[prev.length - 1];
      const nextVal = last ? Number(last.value) + 1 : 1;
      return [...prev, { id: createId(), value: nextVal, frequency: 0 }];
    });
  };

  const removeRow = (id) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const chartPoints = useMemo(() => {
    if (!result) return [];
    return result.rows
      .filter((r) => Number.isFinite(r.value))
      .map((r) => ({ x: r.value, y: r.cumulativeRelativeFrequency }));
  }, [result]);

  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        For discrete data, the cumulative relative frequency polygon is drawn between{' '}
        <strong>values</strong> (x-axis) and <strong>cumulative relative frequency</strong> (y-axis).
      </p>

      <FormulaBox label="Cumulative relative frequency">
        <span>C.R.F = (sum of frequencies up to current value) ÷ (total frequency)</span>
      </FormulaBox>

      <div className="overflow-x-auto rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-academic-700 text-white">
              <th className="border border-academic-600 px-3 py-2.5">Values</th>
              <th className="border border-academic-600 px-3 py-2.5">Frequency</th>
              <th className="border border-academic-600 px-3 py-2.5">Cumulative relative frequency</th>
              <th className="w-12 border border-academic-600" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const enriched = result?.rows.find((r) => r.id === row.id);
              return (
                <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                  <td className="border border-academic-200 px-2 py-1.5">
                    <input
                      type="number"
                      className="w-full rounded border border-academic-300 px-2 py-1.5 text-center text-sm"
                      value={row.value}
                      onChange={(e) => updateRow(row.id, 'value', e.target.value)}
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
                <td className="border border-academic-300 px-3 py-2.5">Total</td>
                <td className="border border-academic-300 px-3 py-2.5 text-center">{result.totalF}</td>
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
          title="Cumulative Relative Frequency Polygon (Discrete Data)"
          points={chartPoints}
          xLabel="Values"
          yLabel="Cumulative relative frequency"
        />
      )}
    </section>
  );
}
