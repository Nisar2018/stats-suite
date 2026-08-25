import { useMemo, useState } from 'react';
import { addRelativeFrequency, createId, formatNum } from '../../utils/representationStatistics';
import { FormulaBox, Fraction } from '../FormulaBox';

const defaultRows = [
  { id: createId(), label: '10 – 20', frequency: 5 },
  { id: createId(), label: '20 – 30', frequency: 8 },
  { id: createId(), label: '30 – 40', frequency: 12 },
  { id: createId(), label: '40 – 50', frequency: 7 },
];

export function RelativeFrequencyContent() {
  const [rows, setRows] = useState(defaultRows);

  const result = useMemo(
    () => addRelativeFrequency(rows.map((r) => ({ name: r.label, frequency: r.frequency }))),
    [rows],
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

  const addRow = () => {
    setRows((prev) => [...prev, { id: createId(), label: '', frequency: 0 }]);
  };

  const removeRow = (id) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        For each type of data, relative frequency is calculated as shown below.
      </p>

      <FormulaBox label="Formula">
        <span>R.f</span>
        <span>=</span>
        <Fraction numerator="frequency" denominator="total frequency" />
      </FormulaBox>

      <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-academic-700 text-white">
              <th className="border border-academic-600 px-3 py-2.5 text-left">
                Category / Class interval
              </th>
              <th className="border border-academic-600 px-3 py-2.5 text-center">f</th>
              <th className="border border-academic-600 px-3 py-2.5 text-center">R.f</th>
              <th className="w-12 border border-academic-600" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const rf = result?.rows.find((r) => r.name === row.label)?.relativeFrequency;
              return (
                <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                  <td className="border border-academic-200 px-2 py-1.5">
                    <input
                      type="text"
                      className="w-full rounded border border-academic-300 px-2 py-1.5 text-sm"
                      value={row.label}
                      onChange={(e) => updateRow(row.id, 'label', e.target.value)}
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
                    {rf != null ? formatNum(rf, 4) : '—'}
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
                <td className="border border-academic-300 px-3 py-2.5 text-center">1.0000</td>
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
    </section>
  );
}
