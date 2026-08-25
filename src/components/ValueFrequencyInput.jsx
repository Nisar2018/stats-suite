import { createId } from '../utils/statistics';
import { formatNum } from '../utils/formatNumber';

const TRASH_ICON_PATH =
  'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16';

const inputClass =
  'w-full rounded border border-academic-300 bg-white px-3 py-2 text-sm text-center focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400';

export function ValueFrequencyInput({ pairs, onChange, derivedColumn = 'product' }) {
  const updatePair = (id, field, val) => {
    onChange(
      pairs.map((p) => (p.id === id ? { ...p, [field]: Number(val) || 0 } : p)),
    );
  };

  const addPair = () => {
    onChange([...pairs, { id: createId(), value: 0, frequency: 1 }]);
  };

  const removePair = (id) => {
    if (pairs.length <= 1) return;
    onChange(pairs.filter((p) => p.id !== id));
  };

  const totalF = pairs.reduce((s, p) => s + p.frequency, 0);
  const totalDerived = pairs.reduce((s, p) => {
    if (p.value === 0) return s;
    return derivedColumn === 'reciprocal'
      ? s + p.frequency / p.value
      : s + p.value * p.frequency;
  }, 0);

  const derivedLabel = derivedColumn === 'reciprocal' ? 'f / x' : 'f × x';
  const getDerivedValue = (pair) =>
    pair.value === 0
      ? '—'
      : derivedColumn === 'reciprocal'
        ? formatNum(pair.frequency / pair.value, 4)
        : pair.value * pair.frequency;

  return (
    <div className="rounded-lg border border-academic-200 bg-white p-5 shadow-sm">
      <p className="mb-3 text-sm font-semibold text-blue-900">Enter values and their frequencies</p>
      <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-academic-700 text-white">
              <th className="border border-academic-600 px-3 py-2.5 text-center">Value (x)</th>
              <th className="border border-academic-600 px-3 py-2.5 text-center">Frequency (f)</th>
              <th className="border border-academic-600 px-3 py-2.5 text-center">{derivedLabel}</th>
              <th className="border border-academic-600 px-3 py-2.5 w-12" />
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
                    value={pair.frequency}
                    onChange={(e) => updatePair(pair.id, 'frequency', e.target.value)}
                  />
                </td>
                <td className="border border-academic-200 px-3 py-2 text-center font-medium">
                  {getDerivedValue(pair)}
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
            <tr className="bg-academic-200 font-bold text-academic-900">
              <td className="border border-academic-300 px-3 py-2.5 text-center">Total</td>
              <td className="border border-academic-300 px-3 py-2.5 text-center">{totalF}</td>
              <td className="border border-academic-300 px-3 py-2.5 text-center">
                {derivedColumn === 'reciprocal' ? formatNum(totalDerived, 4) : totalDerived}
              </td>
              <td className="border border-academic-300" />
            </tr>
          </tbody>
        </table>
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
