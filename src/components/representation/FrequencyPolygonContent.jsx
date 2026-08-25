import { useMemo, useState } from 'react';
import {
  buildFrequencyPolygonRows,
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

export function FrequencyPolygonContent() {
  const [rows, setRows] = useState(defaultRows);

  const result = useMemo(() => buildFrequencyPolygonRows(rows), [rows]);

  const updateRow = (id, field, value) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (field === 'frequency') return { ...r, frequency: value };
        if (field === 'classInterval') {
          const parsed = parseClassIntervalRange(value);
          if (parsed) {
            return {
              ...r,
              classInterval: value,
              classBoundary: formatClassBoundary(parsed.lower - 0.5, parsed.upper - 0.5),
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

  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        A <strong>frequency polygon</strong> is a closed geometric shape drawn by joining the{' '}
        <strong>mid-points of class boundaries</strong> (x-axis) with the corresponding{' '}
        <strong>frequencies</strong> (y-axis). Extra points with frequency 0 are added before the
        first class and after the last class to close the figure.
      </p>

      <FormulaBox label="Mid-point of class boundaries">
        <span>Mid-point = (Lower class boundary + Upper class boundary) ÷ 2</span>
      </FormulaBox>

      <div className="overflow-x-auto rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-academic-700 text-white">
              <th className="border border-academic-600 px-3 py-2.5">Class interval</th>
              <th className="border border-academic-600 px-3 py-2.5">Class boundaries</th>
              <th className="border border-academic-600 px-3 py-2.5">
                Mid point of class boundaries
              </th>
              <th className="border border-academic-600 px-3 py-2.5">Frequency</th>
              <th className="w-12 border border-academic-600" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const enriched = result?.rows.find((r) => r.id === row.id);
              const mid =
                enriched?.midPoint ??
                (() => {
                  const b = parseClassBoundary(row.classBoundary);
                  return b != null ? (b.lower + b.upper) / 2 : null;
                })();
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
                  <td className="border border-academic-200 px-3 py-2 text-center font-medium">
                    {mid != null ? formatClassValue(mid) : '—'}
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
                  <td className="border border-academic-200 px-1 text-center">
                    <TrashBtn onClick={() => removeRow(row.id)} disabled={rows.length <= 1} />
                  </td>
                </tr>
              );
            })}
            <tr className="bg-academic-200 font-bold">
              <td colSpan={3} className="border border-academic-300 px-3 py-2.5">
                Total
              </td>
              <td className="border border-academic-300 px-3 py-2.5 text-center">
                {result ? result.totalF : rows.reduce((s, r) => s + (Number(r.frequency) || 0), 0)}
              </td>
              <td className="border border-academic-300" />
            </tr>
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

      {result?.chartPoints?.length > 0 && (
        <PolygonChart
          title="Frequency Polygon"
          points={result.chartPoints}
          xLabel="Mid-point of class boundaries"
          yLabel="Frequency"
          yMaxHint={Math.max(...result.chartPoints.map((p) => p.y), 1)}
          closed
        />
      )}

      {result?.chartPoints?.length > 0 && (
        <div className="rounded-lg border border-academic-200 bg-academic-50 px-4 py-3 text-sm text-academic-700">
          <p className="font-semibold text-blue-900">Plot points (closed polygon)</p>
          <p className="mt-1">
            {result.chartPoints
              .map((p) => `(${formatClassValue(p.x)}, ${formatNum(p.y, 4)})`)
              .join(' → ')}
          </p>
        </div>
      )}
    </section>
  );
}
