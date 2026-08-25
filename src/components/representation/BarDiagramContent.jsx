import { useCallback, useMemo, useState } from 'react';
import { createId } from '../../utils/representationStatistics';
import { FormulaBox } from '../FormulaBox';
import { SimpleBarChart } from './SimpleBarChart';
import { XAxisFrequencyTable } from './XAxisFrequencyTable';

const defaultRows = [
  { id: createId(), label: 'Class A', frequency: 12 },
  { id: createId(), label: 'Class B', frequency: 18 },
  { id: createId(), label: 'Class C', frequency: 9 },
];

function createSubdividedRow(columnCount, label = '', frequencies = []) {
  return {
    id: createId(),
    label,
    frequencies: Array.from({ length: columnCount }, (_, i) => frequencies[i] ?? 0),
  };
}

export function BarDiagramContent({ variant }) {
  const [rows, setRows] = useState(defaultRows);
  const [graphTitle, setGraphTitle] = useState('Multiple Bar Diagram');
  const [multipleTableData, setMultipleTableData] = useState({
    headings: [],
    labels: [],
    columns: [],
    rows: [],
    columnTotals: [],
    totalF: 0,
    categoryCount: 0,
  });

  /** Sub-divided: number of division bar columns */
  const [divisionBarCount, setDivisionBarCount] = useState(3);
  const [divisionNames, setDivisionNames] = useState(['Part A', 'Part B', 'Part C']);
  const [subdividedRows, setSubdividedRows] = useState(() => [
    createSubdividedRow(3, 'Category A', [5, 4, 3]),
    createSubdividedRow(3, 'Category B', [8, 2, 6]),
    createSubdividedRow(3, 'Category C', [3, 7, 4]),
  ]);

  const handleMultipleDataChange = useCallback((data) => {
    setMultipleTableData(data);
  }, []);

  /**
   * Multiple bar: X-axis = headings (e.g. 1980, 1990, 1999).
   * Bars under each heading = category frequencies from that column.
   */
  const multipleChartData = useMemo(() => {
    const headings = multipleTableData.headings ?? [];
    const categories = multipleTableData.rows ?? [];
    if (!headings.length || !categories.length) return [];

    return headings.map((heading, colIndex) => ({
      label: heading,
      values: categories.map((row) => Number(row.frequencies?.[colIndex]) || 0),
    }));
  }, [multipleTableData.headings, multipleTableData.rows]);

  const categoryLegendLabels = useMemo(
    () =>
      (multipleTableData.rows ?? []).map(
        (row, i) => row.name?.trim() || `Category ${i + 1}`,
      ),
    [multipleTableData.rows],
  );

  const validRows = rows.filter((r) => r.label.trim() && r.frequency > 0);
  const totalF = validRows.reduce((s, r) => s + r.frequency, 0);

  const simpleChartData = useMemo(
    () =>
      validRows.map((r) => ({
        id: r.id,
        label: r.label,
        frequency: r.frequency,
      })),
    [validRows],
  );

  const divisionColumnCount = Math.max(1, Math.min(20, Math.floor(Number(divisionBarCount) || 1)));

  const divisionHeaders = useMemo(
    () =>
      Array.from({ length: divisionColumnCount }, (_, i) =>
        (divisionNames[i] ?? '').trim() || `Division ${i + 1}`,
      ),
    [divisionColumnCount, divisionNames],
  );

  const subdividedColumnTotals = useMemo(() => {
    return divisionHeaders.map((_, colIndex) =>
      subdividedRows.reduce((s, row) => s + (Number(row.frequencies[colIndex]) || 0), 0),
    );
  }, [subdividedRows, divisionHeaders]);

  const subdividedGrandTotal = subdividedColumnTotals.reduce((s, t) => s + t, 0);

  /** Category-wise (row) chart: x-axis = categories; stacked segments = division columns */
  const subdividedChartData = useMemo(
    () =>
      subdividedRows
        .filter((r) => r.label.trim())
        .map((row) => ({
          id: row.id,
          label: row.label.trim(),
          values: divisionHeaders.map((_, colIndex) => Number(row.frequencies[colIndex]) || 0),
        }))
        .filter((r) => r.values.some((v) => v > 0)),
    [subdividedRows, divisionHeaders],
  );

  const handleDivisionBarCountChange = (value) => {
    const count = Math.max(1, Math.min(20, Math.floor(Number(value) || 1)));
    setDivisionBarCount(count);
    setDivisionNames((prev) =>
      Array.from({ length: count }, (_, i) => prev[i] ?? `Part ${String.fromCharCode(65 + i)}`),
    );
    setSubdividedRows((prev) =>
      prev.map((row) => ({
        ...row,
        frequencies: Array.from({ length: count }, (_, i) => row.frequencies[i] ?? 0),
      })),
    );
  };

  const updateDivisionName = (index, name) => {
    setDivisionNames((prev) => {
      const next = [...prev];
      next[index] = name;
      return next;
    });
  };

  const updateSubdividedLabel = (id, label) => {
    setSubdividedRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, label } : row)),
    );
  };

  const updateSubdividedFrequency = (id, colIndex, value) => {
    setSubdividedRows((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const frequencies = [...row.frequencies];
        frequencies[colIndex] = Number(value) || 0;
        return { ...row, frequencies };
      }),
    );
  };

  const addSubdividedRow = () => {
    setSubdividedRows((prev) => [
      ...prev,
      createSubdividedRow(divisionColumnCount, `Category ${prev.length + 1}`),
    ]);
  };

  const removeSubdividedRow = (id) => {
    if (subdividedRows.length <= 1) return;
    setSubdividedRows((prev) => prev.filter((row) => row.id !== id));
  };

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

  const descriptions = {
    'bar-simple':
      'A simple bar diagram uses one bar per category. Enter category names and frequencies; bar height represents frequency.',
    'bar-multiple':
      'Enter x-axis headings (e.g. 1980, 1990, 1999). Each category has its own bar under every heading, distinguished by colour.',
    'bar-subdivided':
      'Enter the number of division bars and name each division. Division names become table columns. The graph shows one bar per category with division values stacked inside.',
  };

  /* ---------- Multiple Bar Diagram ---------- */
  if (variant === 'bar-multiple') {
    return (
      <section className="space-y-6">
        <p className="text-academic-600">{descriptions['bar-multiple']}</p>

        <div className="rounded-lg border border-academic-200 bg-white p-4">
          <label className="mb-2 block text-sm font-semibold text-blue-900">Graph title</label>
          <input
            type="text"
            className="w-full rounded border border-academic-300 px-3 py-2 text-sm"
            value={graphTitle}
            onChange={(e) => setGraphTitle(e.target.value)}
          />
        </div>

        <XAxisFrequencyTable
          defaultHeadings="1980, 1990, 1999"
          defaultCategories={[
            { name: 'Category 1', frequencies: [8, 5, 4] },
            { name: 'Category 2', frequencies: [7, 6, 3] },
            { name: 'Category 3', frequencies: [2, 9, 5] },
          ]}
          onDataChange={handleMultipleDataChange}
          helpText="Enter x-axis values separated by commas (e.g. 1980, 1990, 1999). These appear on the graph x-axis. Frequencies under each heading are plotted as bars under that heading."
        />

        {multipleTableData.headings.length > 0 && (
          <FormulaBox label="Multiple bar diagram layout">
            <div className="w-full text-left text-sm font-normal text-academic-700">
              <p>
                Graph x-axis ({multipleTableData.headings.length}):{' '}
                <strong className="text-blue-900">{multipleTableData.headings.join(', ')}</strong>
              </p>
              <p className="mt-2">
                Separate bar for each category under every heading (grouped bars)
              </p>
              <p className="mt-2">
                Grand total (ΣFᵢ) ={' '}
                <strong className="text-blue-900">{multipleTableData.totalF}</strong>
              </p>
            </div>
          </FormulaBox>
        )}

        {multipleChartData.length > 0 && (
          <SimpleBarChart
            title={graphTitle}
            data={multipleChartData}
            multiple
            xLabels={categoryLegendLabels}
            showValues
            xAxisLabel="X-axis (headings)"
            yAxisLabel="Frequency"
          />
        )}
      </section>
    );
  }

  /* ---------- Sub-divided Bar Diagram ---------- */
  if (variant === 'bar-subdivided') {
    return (
      <section className="space-y-6">
        <p className="text-academic-600">{descriptions['bar-subdivided']}</p>

        <div className="space-y-4 rounded-lg border border-academic-200 bg-white p-4 shadow-sm sm:p-5">
          <div>
            <label
              htmlFor="subdivided-division-count"
              className="mb-2 block text-sm font-semibold text-blue-900"
            >
              No. of Division Bar
            </label>
            <input
              id="subdivided-division-count"
              type="number"
              min={1}
              max={20}
              value={divisionBarCount}
              onChange={(e) => handleDivisionBarCountChange(e.target.value)}
              className="w-full max-w-xs rounded-lg border border-academic-300 px-4 py-2.5 text-academic-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <p className="mt-2 text-xs text-academic-500">
              e.g. 2 creates two division name fields; 3 creates three, and so on.
            </p>
          </div>

          {divisionColumnCount > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-blue-900">Division names</p>
              <div className="flex flex-wrap gap-3">
                {Array.from({ length: divisionColumnCount }, (_, i) => (
                  <div key={i} className="min-w-[8rem] flex-1">
                    <label className="mb-1 block text-xs text-academic-500">
                      Division {i + 1}
                    </label>
                    <input
                      type="text"
                      value={divisionNames[i] ?? ''}
                      onChange={(e) => updateDivisionName(i, e.target.value)}
                      placeholder={`Division ${i + 1}`}
                      className="w-full rounded-lg border border-academic-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-2 text-sm font-medium text-blue-900">
                {divisionColumnCount} table column{divisionColumnCount === 1 ? '' : 's'} after Name of
                category
              </p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="overflow-x-auto rounded-lg border border-academic-200 bg-white shadow-sm">
            <table className="w-full min-w-[400px] border-collapse text-sm">
              <thead>
                <tr className="bg-academic-700 text-white">
                  <th className="sticky left-0 z-10 border border-academic-600 bg-academic-700 px-3 py-2.5 text-left">
                    Name of category
                  </th>
                  {divisionHeaders.map((header) => (
                    <th
                      key={header}
                      className="border border-academic-600 px-3 py-2.5 text-center font-semibold"
                    >
                      {header}
                    </th>
                  ))}
                  <th className="border border-academic-600 px-3 py-2.5 text-center">Total</th>
                  <th className="w-12 border border-academic-600" />
                </tr>
              </thead>
              <tbody>
                {subdividedRows.map((row, rowIndex) => {
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
                          className="w-full min-w-[7rem] rounded border border-academic-300 px-2 py-1.5 text-sm"
                          value={row.label}
                          onChange={(e) => updateSubdividedLabel(row.id, e.target.value)}
                          placeholder={`Category ${rowIndex + 1}`}
                        />
                      </td>
                      {divisionHeaders.map((header, colIndex) => (
                        <td
                          key={`${row.id}-${header}-${colIndex}`}
                          className="border border-academic-200 px-2 py-1.5"
                        >
                          <input
                            type="number"
                            min={0}
                            className="w-full min-w-[4rem] rounded border border-academic-300 px-2 py-1.5 text-center text-sm"
                            value={row.frequencies[colIndex] ?? 0}
                            onChange={(e) =>
                              updateSubdividedFrequency(row.id, colIndex, e.target.value)
                            }
                            aria-label={`${header} for ${row.label || `category ${rowIndex + 1}`}`}
                          />
                        </td>
                      ))}
                      <td className="border border-academic-200 bg-academic-100 px-3 py-2.5 text-center font-semibold text-blue-900">
                        {rowTotal}
                      </td>
                      <td className="border border-academic-200 px-1 text-center">
                        <button
                          type="button"
                          onClick={() => removeSubdividedRow(row.id)}
                          disabled={subdividedRows.length <= 1}
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
                  {subdividedColumnTotals.map((total, i) => (
                    <td
                      key={`col-total-${i}`}
                      className="border border-academic-300 px-3 py-2.5 text-center"
                    >
                      {total}
                    </td>
                  ))}
                  <td className="border border-academic-300 px-3 py-2.5 text-center text-blue-900">
                    {subdividedGrandTotal}
                  </td>
                  <td className="border border-academic-300" />
                </tr>
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={addSubdividedRow}
            className="inline-flex items-center gap-1.5 rounded-lg border border-academic-300 bg-white px-3 py-2 text-sm font-medium text-academic-700 hover:bg-academic-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Category Row
          </button>
        </div>

        {subdividedChartData.some((d) => d.values.some((v) => v > 0)) && (
          <SimpleBarChart
            title="Sub-divided Bar Diagram"
            data={subdividedChartData}
            stacked
            xLabels={divisionHeaders}
            showValues
            xAxisLabel="Category"
            yAxisLabel="Frequency"
          />
        )}
      </section>
    );
  }

  /* ---------- Simple Bar Diagram ---------- */
  return (
    <section className="space-y-6">
      <p className="text-academic-600">{descriptions['bar-simple']}</p>

      <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-academic-700 text-white">
              <th className="border border-academic-600 px-3 py-2.5 text-left">
                Category / Class interval
              </th>
              <th className="border border-academic-600 px-3 py-2.5 text-center">Frequency</th>
              <th className="w-12 border border-academic-600" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
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
            {totalF > 0 && (
              <tr className="bg-academic-200 font-bold">
                <td className="border border-academic-300 px-3 py-2.5">Total</td>
                <td className="border border-academic-300 px-3 py-2.5 text-center">{totalF}</td>
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

      {simpleChartData.length > 0 && (
        <SimpleBarChart
          title="Simple Bar Diagram"
          data={simpleChartData}
          showValues
          xAxisLabel="Category"
          yAxisLabel="Frequency"
        />
      )}
    </section>
  );
}
