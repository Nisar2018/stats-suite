import { useMemo, useState } from 'react';
import { computeSampleSpace } from '../../utils/probabilityStatistics';
import { formatNum } from '../../utils/formatNumber';
import { FormulaBox } from '../FormulaBox';
import { CalculationSteps } from '../CalculationSteps';
import { createId } from '../../utils/statistics';

const inputClass =
  'w-full rounded border border-academic-300 bg-white px-3 py-2 text-sm text-center focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400';

const defaultRows = [
  { id: createId(), label: 'Variable 1', outcomes: 6 },
  { id: createId(), label: 'Variable 2', outcomes: 2 },
];

export function SampleSpaceContent() {
  const [rows, setRows] = useState(defaultRows);

  const outcomeCounts = useMemo(() => rows.map((r) => r.outcomes), [rows]);
  const result = useMemo(() => computeSampleSpace(outcomeCounts), [outcomeCounts]);

  const updateRow = (id, value) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, outcomes: value } : r)),
    );
  };

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: createId(), label: `Variable ${prev.length + 1}`, outcomes: 2 },
    ]);
  };

  const removeRow = (id) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        All possible events or outcomes are called the <strong>sample space</strong>. It can be
        counted by simple multiplication: n₁ is the number of outcomes of the first variable, n₂
        for the second, and so on for any number of variables.
      </p>

      <FormulaBox label="Formula">
        <span>Outcomes of S = n₁ × n₂ × n₃ × …</span>
      </FormulaBox>

      <div className="overflow-x-auto rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-academic-700 text-white">
              <th className="border border-academic-600 px-3 py-2.5">Variable</th>
              <th className="border border-academic-600 px-3 py-2.5">No. of outcomes (n)</th>
              <th className="w-12 border border-academic-600" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                <td className="border border-academic-200 px-3 py-2 font-medium text-blue-900">
                  n{i + 1}
                </td>
                <td className="border border-academic-200 px-2 py-1.5">
                  <input
                    type="number"
                    min={1}
                    className={inputClass}
                    value={row.outcomes}
                    onChange={(e) => updateRow(row.id, e.target.value)}
                  />
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
            ))}
          </tbody>
        </table>
        <button
          type="button"
          onClick={addRow}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-academic-300 bg-white px-3 py-2 text-sm font-medium text-academic-700 hover:bg-academic-50"
        >
          Add variable
        </button>
      </div>

      {result?.error && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {result.error}
        </p>
      )}

      {result && !result.error && (
        <>
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-center">
            <p className="text-xs font-medium text-blue-700">Sample space size |S|</p>
            <p className="mt-1 text-2xl font-bold text-blue-900">{formatNum(result.result, 0)}</p>
            <p className="mt-1 font-mono text-sm text-academic-700">
              {result.counts.join(' × ')} = {formatNum(result.result, 0)}
            </p>
          </div>
          <CalculationSteps steps={result.steps} />
        </>
      )}
    </section>
  );
}
