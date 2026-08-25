import { useMemo, useState } from 'react';
import { computePiePortions, createId, formatNum } from '../../utils/representationStatistics';
import { FormulaBox } from '../FormulaBox';

const defaultRows = [
  { id: createId(), name: 'Category A', frequency: 12 },
  { id: createId(), name: 'Category B', frequency: 18 },
  { id: createId(), name: 'Category C', frequency: 9 },
];

const SLICE_COLORS = ['#1d4ed8', '#059669', '#d97706', '#7c3aed', '#dc2626', '#0891b2'];

export function PieGraphContent() {
  const [rows, setRows] = useState(defaultRows);

  const validRows = rows.filter((r) => r.name.trim() && r.frequency > 0);
  const result = useMemo(
    () => computePiePortions(validRows.map((r) => ({ name: r.name, frequency: r.frequency }))),
    [validRows],
  );

  const updateRow = (id, field, value) => {
    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, [field]: field === 'frequency' ? Number(value) || 0 : value }
          : r,
      ),
    );
  };

  const addRow = () => setRows((prev) => [...prev, { id: createId(), name: '', frequency: 0 }]);
  const removeRow = (id) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  let angleStart = 0;

  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        Data is represented as portions of a circle using the formula below.
      </p>

      <FormulaBox label="Formula">
        <span>Portion of circle = (component of data ÷ total frequency) × 360°</span>
      </FormulaBox>

      <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-academic-700 text-white">
              <th className="border border-academic-600 px-3 py-2.5 text-left">Name of category</th>
              <th className="border border-academic-600 px-3 py-2.5 text-center">Component of data</th>
              <th className="border border-academic-600 px-3 py-2.5 text-center">Portion of circle (°)</th>
              <th className="w-12 border border-academic-600" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const portion = result?.rows.find((r) => r.name === row.name.trim());
              return (
                <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                  <td className="border border-academic-200 px-2 py-1.5">
                    <input
                      type="text"
                      className="w-full rounded border border-academic-300 px-2 py-1.5 text-sm"
                      value={row.name}
                      onChange={(e) => updateRow(row.id, 'name', e.target.value)}
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
                    {portion ? formatNum(portion.portion, 2) : '—'}
                  </td>
                  <td className="border border-academic-200 px-1 text-center">
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
                </tr>
              );
            })}
            {result && (
              <tr className="bg-academic-200 font-bold">
                <td className="border border-academic-300 px-3 py-2.5">Total</td>
                <td className="border border-academic-300 px-3 py-2.5 text-center">{result.totalF}</td>
                <td className="border border-academic-300 px-3 py-2.5 text-center">360.00</td>
                <td className="border border-academic-300" />
              </tr>
            )}
          </tbody>
        </table>
        <button
          type="button"
          onClick={addRow}
          className="mt-3 rounded-lg border border-academic-300 px-3 py-2 text-sm font-medium text-academic-700 hover:bg-academic-50"
        >
          + Add Row
        </button>
      </div>

      {result && (
        <div className="flex justify-center rounded-lg border border-academic-200 bg-white p-6">
          <svg viewBox="0 0 200 200" className="h-52 w-52">
            {result.rows.map((slice, i) => {
              const start = angleStart;
              angleStart += slice.portion;
              const end = angleStart;
              const largeArc = slice.portion > 180 ? 1 : 0;
              const startRad = ((start - 90) * Math.PI) / 180;
              const endRad = ((end - 90) * Math.PI) / 180;
              const x1 = 100 + 90 * Math.cos(startRad);
              const y1 = 100 + 90 * Math.sin(startRad);
              const x2 = 100 + 90 * Math.cos(endRad);
              const y2 = 100 + 90 * Math.sin(endRad);
              const d = `M 100 100 L ${x1} ${y1} A 90 90 0 ${largeArc} 1 ${x2} ${y2} Z`;
              return <path key={slice.name} d={d} fill={SLICE_COLORS[i % SLICE_COLORS.length]} stroke="#fff" strokeWidth="1" />;
            })}
          </svg>
        </div>
      )}
    </section>
  );
}
