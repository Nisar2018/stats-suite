import { createId } from '../utils/statistics';

const TRASH_ICON_PATH =
  'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16';

const inputClass =
  'w-full rounded border border-academic-300 bg-white px-3 py-2 text-sm text-center focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400';

export function WeightedInput({ pairs, onChange }) {
  const updatePair = (id, field, val) => {
    onChange(
      pairs.map((p) => (p.id === id ? { ...p, [field]: Number(val) || 0 } : p)),
    );
  };

  const addPair = () => {
    onChange([...pairs, { id: createId(), value: 0, weight: 1 }]);
  };

  const removePair = (id) => {
    if (pairs.length <= 1) return;
    onChange(pairs.filter((p) => p.id !== id));
  };

  return (
    <div className="rounded-lg border border-academic-200 bg-white p-5 shadow-sm">
      <p className="mb-3 text-sm font-semibold text-blue-900">Enter values and their weights</p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[280px] border-collapse text-sm">
          <thead>
            <tr className="bg-academic-100">
              <th className="border border-academic-200 px-3 py-2 text-center">Value (x)</th>
              <th className="border border-academic-200 px-3 py-2 text-center">Weight (w)</th>
              <th className="border border-academic-200 px-3 py-2 text-center">w × x</th>
              <th className="border border-academic-200 px-3 py-2 w-12" />
            </tr>
          </thead>
          <tbody>
            {pairs.map((pair, index) => (
              <tr key={pair.id} className={index % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                <td className="border border-academic-200 px-2 py-1.5">
                  <input
                    type="number"
                    className={inputClass}
                    value={pair.value}
                    onChange={(e) => updatePair(pair.id, 'value', e.target.value)}
                  />
                </td>
                <td className="border border-academic-200 px-2 py-1.5">
                  <input
                    type="number"
                    min={0}
                    className={inputClass}
                    value={pair.weight}
                    onChange={(e) => updatePair(pair.id, 'weight', e.target.value)}
                  />
                </td>
                <td className="border border-academic-200 px-3 py-2 text-center font-medium">
                  {pair.value * pair.weight}
                </td>
                <td className="border border-academic-200 px-1 text-center">
                  <button
                    type="button"
                    onClick={() => removePair(pair.id)}
                    disabled={pairs.length <= 1}
                    className="rounded p-1 text-red-500 hover:bg-red-50 disabled:opacity-30"
                    aria-label="Delete row"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={TRASH_ICON_PATH} />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addPair}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-academic-300 px-3 py-2 text-sm font-medium text-academic-700 hover:bg-academic-50"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add Row
      </button>
    </div>
  );
}
