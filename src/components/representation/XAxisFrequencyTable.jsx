import { useEffect, useMemo, useState } from 'react';
import {
  buildXAxisFrequencyTable,
  createId,
  parseCommaLabels,
} from '../../utils/representationStatistics';

const inputClass =
  'w-full min-w-[4rem] rounded border border-academic-300 bg-white px-2 py-1.5 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400';

const numberInputClass = `${inputClass} text-center`;

function createCategoryRow(headingCount, name = '', frequencies = []) {
  return {
    id: createId(),
    name,
    frequencies: Array.from({ length: headingCount }, (_, i) => frequencies[i] ?? 0),
  };
}

/**
 * Shared interactive table for Categorical Data and Simple Bar Diagram:
 * - Comma-separated x-axis values = headings / portions (columns)
 * - Rows = categories (add more with + Add Category)
 * - Each cell is Fᵢ for that category under that heading
 */
export function XAxisFrequencyTable({
  defaultHeadings = 'Portion A, Portion B, Portion C',
  defaultCategories = [
    { name: 'Category 1', frequencies: [5, 8, 3] },
    { name: 'Category 2', frequencies: [7, 4, 6] },
    { name: 'Category 3', frequencies: [2, 9, 5] },
  ],
  onDataChange,
  helpText = 'Enter headings/portions separated by commas. Each becomes a column. Add category rows as needed.',
  categoryColumnLabel = 'Name of category',
}) {
  const [xAxisInput, setXAxisInput] = useState(defaultHeadings);
  const [categoryRows, setCategoryRows] = useState(() => {
    const headings = parseCommaLabels(defaultHeadings);
    return defaultCategories.map((cat) =>
      createCategoryRow(headings.length, cat.name, cat.frequencies),
    );
  });

  const headings = useMemo(() => parseCommaLabels(xAxisInput), [xAxisInput]);

  const result = useMemo(
    () => buildXAxisFrequencyTable(headings, categoryRows),
    [headings, categoryRows],
  );

  useEffect(() => {
    if (!onDataChange) return;
    onDataChange({
      headings,
      labels: headings,
      columns: result?.columns ?? [],
      rows: result?.rows ?? [],
      columnTotals: result?.columnTotals ?? [],
      totalF: result?.totalF ?? 0,
      categoryCount: result?.categoryCount ?? 0,
    });
  }, [headings, result, onDataChange]);

  const resizeFrequencies = (frequencies, count) =>
    Array.from({ length: count }, (_, i) => frequencies[i] ?? 0);

  const handleXAxisChange = (value) => {
    setXAxisInput(value);
    const nextHeadings = parseCommaLabels(value);
    setCategoryRows((prev) =>
      prev.map((row) => ({
        ...row,
        frequencies: resizeFrequencies(row.frequencies, nextHeadings.length),
      })),
    );
  };

  const updateCategoryName = (id, name) => {
    setCategoryRows((prev) => prev.map((row) => (row.id === id ? { ...row, name } : row)));
  };

  const updateFrequency = (id, colIndex, value) => {
    setCategoryRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const frequencies = [...row.frequencies];
        frequencies[colIndex] = Number(value) || 0;
        return { ...row, frequencies };
      }),
    );
  };

  const addCategoryRow = () => {
    setCategoryRows((prev) => [
      ...prev,
      createCategoryRow(headings.length, `Category ${prev.length + 1}`),
    ]);
  };

  const removeCategoryRow = (id) => {
    if (categoryRows.length <= 1) return;
    setCategoryRows((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm sm:p-5">
        <label
          htmlFor="xaxis-headings-input"
          className="mb-2 block text-sm font-semibold text-blue-900"
        >
          X-axis headings / portions
        </label>
        <input
          id="xaxis-headings-input"
          type="text"
          value={xAxisInput}
          onChange={(e) => handleXAxisChange(e.target.value)}
          placeholder="e.g. Male, Female, Other"
          className="w-full rounded-lg border border-academic-300 px-4 py-2.5 text-academic-800 placeholder:text-academic-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        <p className="mt-2 text-xs text-academic-500">{helpText}</p>
        {headings.length > 0 && (
          <p className="mt-2 text-sm font-medium text-blue-900">
            {headings.length} heading{headings.length === 1 ? '' : 's'} → {headings.length}{' '}
            frequency column{headings.length === 1 ? '' : 's'} · {categoryRows.length} categor
            {categoryRows.length === 1 ? 'y' : 'ies'} (rows)
          </p>
        )}
      </div>

      {headings.length === 0 ? (
        <p className="text-sm text-academic-500">
          Enter at least one heading/portion (comma-separated) to generate frequency columns.
        </p>
      ) : (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-lg border border-academic-200 bg-white shadow-sm">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr className="bg-academic-700 text-white">
                  <th className="sticky left-0 z-10 border border-academic-600 bg-academic-700 px-3 py-2.5 text-left">
                    {categoryColumnLabel}
                  </th>
                  {headings.map((heading, i) => (
                    <th
                      key={`${heading}-${i}`}
                      className="border border-academic-600 px-3 py-2.5 text-center font-semibold"
                    >
                      {heading}
                    </th>
                  ))}
                  <th className="border border-academic-600 px-3 py-2.5 text-center">Total</th>
                  <th className="w-12 border border-academic-600" />
                </tr>
              </thead>
              <tbody>
                {categoryRows.map((row, rowIndex) => {
                  const rowTotal = (row.frequencies ?? []).reduce(
                    (s, f) => s + (Number(f) || 0),
                    0,
                  );
                  return (
                    <tr
                      key={row.id}
                      className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-academic-50'}
                    >
                      <td className="sticky left-0 z-10 border border-academic-200 bg-inherit px-2 py-1.5">
                        <input
                          type="text"
                          className={inputClass}
                          value={row.name}
                          onChange={(e) => updateCategoryName(row.id, e.target.value)}
                          placeholder={`Category ${rowIndex + 1}`}
                          aria-label={`Category name for row ${rowIndex + 1}`}
                        />
                      </td>
                      {headings.map((heading, colIndex) => (
                        <td
                          key={`${row.id}-${colIndex}`}
                          className="border border-academic-200 px-2 py-1.5"
                        >
                          <input
                            type="number"
                            min={0}
                            className={numberInputClass}
                            value={row.frequencies[colIndex] ?? 0}
                            onChange={(e) =>
                              updateFrequency(row.id, colIndex, e.target.value)
                            }
                            aria-label={`Frequency for ${row.name || `category ${rowIndex + 1}`} under ${heading}`}
                          />
                        </td>
                      ))}
                      <td className="border border-academic-200 bg-academic-100 px-3 py-2.5 text-center font-semibold text-blue-900">
                        {rowTotal}
                      </td>
                      <td className="border border-academic-200 px-1 text-center">
                        <button
                          type="button"
                          onClick={() => removeCategoryRow(row.id)}
                          disabled={categoryRows.length <= 1}
                          className="rounded p-1 text-red-500 hover:bg-red-50 disabled:opacity-30"
                          aria-label="Remove category row"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-academic-200 font-bold text-academic-900">
                  <td className="sticky left-0 z-10 border border-academic-300 bg-academic-200 px-3 py-2.5">
                    Total
                  </td>
                  {(result?.columnTotals ?? headings.map(() => 0)).map((total, i) => (
                    <td
                      key={`col-total-${i}`}
                      className="border border-academic-300 px-3 py-2.5 text-center"
                    >
                      {total}
                    </td>
                  ))}
                  <td className="border border-academic-300 px-3 py-2.5 text-center text-blue-900">
                    {result?.totalF ?? 0}
                  </td>
                  <td className="border border-academic-300" />
                </tr>
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={addCategoryRow}
            className="inline-flex items-center gap-1.5 rounded-lg border border-academic-300 bg-white px-3 py-2 text-sm font-medium text-academic-700 hover:bg-academic-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Category Row
          </button>
        </div>
      )}
    </div>
  );
}
