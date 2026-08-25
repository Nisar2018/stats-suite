import { useMemo, useState } from 'react';
import { buildCategoricalFromInputValues } from '../../utils/representationStatistics';
import { FormulaBox } from '../FormulaBox';

const defaultInput = '1, 0, 0, 2, 3, 2, 1, 4';

export function CategoricalFrequencyContent() {
  const [inputValues, setInputValues] = useState(defaultInput);

  const result = useMemo(
    () => buildCategoricalFromInputValues(inputValues),
    [inputValues],
  );

  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        Enter raw categorical values separated by commas. Each unique value becomes a category;
        frequency is counted automatically from repetitions in the input.
      </p>

      <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm sm:p-5">
        <label
          htmlFor="categorical-input-values"
          className="mb-2 block text-sm font-semibold text-blue-900"
        >
          Input Values
        </label>
        <input
          id="categorical-input-values"
          type="text"
          value={inputValues}
          onChange={(e) => setInputValues(e.target.value)}
          placeholder="e.g. 1, 0, 0, 2, 3, 2, 1, 4"
          className="w-full rounded-lg border border-academic-300 px-4 py-2.5 text-academic-800 placeholder:text-academic-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        <p className="mt-2 text-xs text-academic-500">
          Enter values separated by commas. Repeated values increase frequency for that category.
        </p>
      </div>

      {result ? (
        <div className="overflow-x-auto rounded-lg border border-academic-200 bg-white shadow-sm">
          <table className="w-full min-w-[280px] border-collapse text-sm">
            <thead>
              <tr className="bg-academic-700 text-white">
                <th className="border border-academic-600 px-4 py-2.5 text-left">Category</th>
                <th className="border border-academic-600 px-4 py-2.5 text-center">
                  Frequency (f)
                </th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, i) => (
                <tr key={String(row.category)} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                  <td className="border border-academic-200 px-4 py-2.5 font-medium text-blue-900">
                    {row.category}
                  </td>
                  <td className="border border-academic-200 px-4 py-2.5 text-center font-medium">
                    {row.frequency}
                  </td>
                </tr>
              ))}
              <tr className="bg-academic-200 font-bold text-academic-900">
                <td className="border border-academic-300 px-4 py-2.5">Total</td>
                <td className="border border-academic-300 px-4 py-2.5 text-center text-blue-900">
                  {result.totalF}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-academic-500">Enter at least one value to build the frequency table.</p>
      )}

      {result && (
        <FormulaBox label="Frequency table layout">
          <div className="w-full text-left text-sm font-normal text-academic-700">
            <p>
              Input values ({result.inputCount}):{' '}
              <strong className="text-blue-900">
                {inputValues.trim() || '—'}
              </strong>
            </p>
            <p className="mt-2">
              Unique categories ={' '}
              <strong className="text-blue-900">{result.rows.length}</strong>
            </p>
            <p className="mt-2">
              Total frequency Σf ={' '}
              <strong className="text-blue-900">{result.totalF}</strong>
            </p>
          </div>
        </FormulaBox>
      )}
    </section>
  );
}
