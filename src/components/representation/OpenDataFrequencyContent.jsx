import { useMemo, useState } from 'react';
import { buildOpenDataTable, createId } from '../../utils/representationStatistics';
import { FormulaBox } from '../FormulaBox';

const defaultEntries = [
  { id: createId(), value: '10', frequency: 5 },
  { id: createId(), value: 'Blue', frequency: 8 },
  { id: createId(), value: '25', frequency: 3 },
];

export function OpenDataFrequencyContent() {
  const [entries, setEntries] = useState(defaultEntries);

  const result = useMemo(() => buildOpenDataTable(entries), [entries]);

  const updateEntry = (id, field, value) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, [field]: field === 'frequency' ? Number(value) || 0 : value }
          : e,
      ),
    );
  };

  const addEntry = () => {
    setEntries((prev) => [...prev, { id: createId(), value: '', frequency: 0 }]);
  };

  const removeEntry = (id) => {
    if (entries.length <= 1) return;
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        Open data tables accept both numerical and alphabetical (categorical) values in the same
        distribution.
      </p>

      <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-academic-700 text-white">
              <th className="border border-academic-600 px-3 py-2.5 text-left">
                Value (number or text)
              </th>
              <th className="border border-academic-600 px-3 py-2.5 text-center">Frequency</th>
              <th className="w-12 border border-academic-600" />
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={entry.id} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                <td className="border border-academic-200 px-2 py-1.5">
                  <input
                    type="text"
                    className="w-full rounded border border-academic-300 px-2 py-1.5 text-sm"
                    value={entry.value}
                    placeholder="e.g. 15 or Red"
                    onChange={(e) => updateEntry(entry.id, 'value', e.target.value)}
                  />
                </td>
                <td className="border border-academic-200 px-2 py-1.5">
                  <input
                    type="number"
                    min={0}
                    className="w-full rounded border border-academic-300 px-2 py-1.5 text-center text-sm"
                    value={entry.frequency}
                    onChange={(e) => updateEntry(entry.id, 'frequency', e.target.value)}
                  />
                </td>
                <td className="border border-academic-200 px-1 text-center">
                  <button
                    type="button"
                    onClick={() => removeEntry(entry.id)}
                    disabled={entries.length <= 1}
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
            {result && (
              <tr className="bg-academic-200 font-bold">
                <td className="border border-academic-300 px-3 py-2.5">Total</td>
                <td className="border border-academic-300 px-3 py-2.5 text-center">{result.totalF}</td>
                <td className="border border-academic-300" />
              </tr>
            )}
          </tbody>
        </table>
        <button
          type="button"
          onClick={addEntry}
          className="mt-3 rounded-lg border border-academic-300 px-3 py-2 text-sm font-medium text-academic-700 hover:bg-academic-50"
        >
          + Add Row
        </button>
      </div>
    </section>
  );
}
