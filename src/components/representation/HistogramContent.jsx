import { useMemo, useState } from 'react';
import {
  buildHistogramDiscrete,
  buildHistogramEqual,
  buildHistogramUnequal,
  createId,
  formatClassBoundary,
  formatNum,
  parseClassBoundary,
  parseClassIntervalRange,
} from '../../utils/representationStatistics';
import { FormulaBox } from '../FormulaBox';
import { HistogramChart } from './HistogramChart';

const defaultEqual = [
  { id: createId(), classInterval: '10 – 20', lowerBoundary: 9.5, upperBoundary: 19.5, classBoundary: '9.5-19.5', frequency: 5 },
  { id: createId(), classInterval: '20 – 30', lowerBoundary: 19.5, upperBoundary: 29.5, classBoundary: '19.5-29.5', frequency: 8 },
  { id: createId(), classInterval: '30 – 40', lowerBoundary: 29.5, upperBoundary: 39.5, classBoundary: '29.5-39.5', frequency: 12 },
];

const defaultUnequal = [
  { id: createId(), classInterval: '0 – 10', frequency: 4, width: 10 },
  { id: createId(), classInterval: '10 – 25', frequency: 9, width: 15 },
  { id: createId(), classInterval: '25 – 40', frequency: 7, width: 15 },
];

const defaultDiscrete = [
  { id: createId(), value: 2, frequency: 3 },
  { id: createId(), value: 3, frequency: 7 },
  { id: createId(), value: 4, frequency: 5 },
  { id: createId(), value: 5, frequency: 2 },
];

export function HistogramContent({ variant }) {
  const [equalRows, setEqualRows] = useState(defaultEqual);
  const [unequalRows, setUnequalRows] = useState(defaultUnequal);
  const [discreteRows, setDiscreteRows] = useState(defaultDiscrete);

  const equalResult = useMemo(
    () => buildHistogramEqual(equalRows.map((r) => ({ ...r, frequency: Number(r.frequency) || 0 }))),
    [equalRows],
  );

  const unequalResult = useMemo(
    () =>
      buildHistogramUnequal(
        unequalRows.map((r) => ({
          classInterval: r.classInterval,
          frequency: Number(r.frequency) || 0,
          width: Number(r.width) || 1,
        })),
      ),
    [unequalRows],
  );

  const discreteResult = useMemo(
    () =>
      buildHistogramDiscrete(
        discreteRows.map((r) => ({
          value: Number(r.value) || 0,
          frequency: Number(r.frequency) || 0,
        })),
      ),
    [discreteRows],
  );

  const descriptions = {
    'histogram-equal':
      'For equal class width, use class interval, class boundaries, and frequency.',
    'histogram-unequal':
      'For unequal class width, adjusted frequency = frequency ÷ width of class interval.',
    'histogram-discrete':
      'For discrete data, each distinct value is shown with a bar of width 1.',
  };

  const updateRow = (setter, id, field, value) => {
    setter((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  const removeRow = (setter, rows, id) => {
    if (rows.length <= 1) return;
    setter((prev) => prev.filter((r) => r.id !== id));
  };

  const addEqualRow = () => {
    setEqualRows((prev) => {
      const last = prev[prev.length - 1];
      const lower = last ? Number(last.upperBoundary) : 9.5;
      const span = last
        ? Number(last.upperBoundary) - Number(last.lowerBoundary)
        : 10;
      const upper = lower + span;
      const lowerLimit = lower + 0.5;
      const upperLimit = upper - 0.5;
      return [
        ...prev,
        {
          id: createId(),
          classInterval: `${lowerLimit} – ${upperLimit}`,
          lowerBoundary: lower,
          upperBoundary: upper,
          classBoundary: formatClassBoundary(lower, upper),
          frequency: 0,
        },
      ];
    });
  };

  const updateEqualBoundary = (id, boundaryStr) => {
    const parsed = parseClassBoundary(boundaryStr);
    setEqualRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        if (!parsed) return { ...r, classBoundary: boundaryStr };
        return {
          ...r,
          classBoundary: formatClassBoundary(parsed.lower, parsed.upper),
          lowerBoundary: parsed.lower,
          upperBoundary: parsed.upper,
        };
      }),
    );
  };

  const addUnequalRow = () => {
    setUnequalRows((prev) => {
      const last = prev[prev.length - 1];
      const parsed = last ? parseClassIntervalRange(last.classInterval) : null;
      const lower = parsed ? parsed.upper : 0;
      const width = last ? Number(last.width) || 10 : 10;
      const upper = lower + width;
      return [
        ...prev,
        {
          id: createId(),
          classInterval: `${lower} – ${upper}`,
          frequency: 0,
          width,
        },
      ];
    });
  };

  const addDiscreteRow = () => {
    setDiscreteRows((prev) => {
      const last = prev[prev.length - 1];
      const nextVal = last ? Number(last.value) + 1 : 1;
      return [...prev, { id: createId(), value: nextVal, frequency: 0 }];
    });
  };

  const AddRowBtn = ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-academic-300 bg-white px-3 py-2 text-sm font-medium text-academic-700 hover:bg-academic-50"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
      Add new Row
    </button>
  );

  const TrashBtn = ({ onClick, disabled }) => (
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

  return (
    <section className="space-y-6">
      <p className="text-academic-600">{descriptions[variant]}</p>

      {variant === 'histogram-equal' && (
        <>
          <div className="overflow-x-auto rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-academic-700 text-white">
                  <th className="border border-academic-600 px-3 py-2.5">Class interval</th>
                  <th className="border border-academic-600 px-3 py-2.5">Class boundaries</th>
                  <th className="border border-academic-600 px-3 py-2.5">Frequency</th>
                  <th className="w-12 border border-academic-600" />
                </tr>
              </thead>
              <tbody>
                {equalRows.map((row, i) => (
                  <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                    <td className="border border-academic-200 px-2 py-1.5">
                      <input
                        type="text"
                        className="w-full rounded border border-academic-300 px-2 py-1.5 text-sm"
                        value={row.classInterval}
                        onChange={(e) => updateRow(setEqualRows, row.id, 'classInterval', e.target.value)}
                      />
                    </td>
                    <td className="border border-academic-200 px-2 py-1.5">
                      <input
                        type="text"
                        className="w-full rounded border border-academic-300 px-2 py-1.5 text-center text-sm"
                        value={row.classBoundary ?? formatClassBoundary(row.lowerBoundary, row.upperBoundary)}
                        onChange={(e) => updateEqualBoundary(row.id, e.target.value)}
                        placeholder="e.g. 9.5-19.5"
                      />
                    </td>
                    <td className="border border-academic-200 px-2 py-1.5">
                      <input
                        type="number"
                        min={0}
                        className="w-full rounded border border-academic-300 px-2 py-1.5 text-center text-sm"
                        value={row.frequency}
                        onChange={(e) => updateRow(setEqualRows, row.id, 'frequency', e.target.value)}
                      />
                    </td>
                    <td className="border border-academic-200 px-1 text-center">
                      <TrashBtn
                        onClick={() => removeRow(setEqualRows, equalRows, row.id)}
                        disabled={equalRows.length <= 1}
                      />
                    </td>
                  </tr>
                ))}
                {equalResult && (
                  <tr className="bg-academic-200 font-bold">
                    <td colSpan={2} className="border border-academic-300 px-3 py-2.5">
                      Total
                    </td>
                    <td className="border border-academic-300 px-3 py-2.5 text-center">
                      {equalResult.totalF}
                    </td>
                    <td className="border border-academic-300" />
                  </tr>
                )}
              </tbody>
            </table>
            <AddRowBtn onClick={addEqualRow} />
          </div>
          {equalResult && (
            <HistogramChart
              title="Histogram (Equal Class Width)"
              boundaryBased
              data={equalResult.rows.map((r) => ({
                lowerBoundary: Number(r.lowerBoundary),
                upperBoundary: Number(r.upperBoundary),
                frequency: Number(r.frequency) || 0,
              }))}
            />
          )}
        </>
      )}

      {variant === 'histogram-unequal' && (
        <>
          <FormulaBox label="Adjusted frequency">
            <span>Adjusted frequency = frequency ÷ width</span>
          </FormulaBox>
          <div className="overflow-x-auto rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-academic-700 text-white">
                  <th className="border border-academic-600 px-3 py-2.5">Class interval</th>
                  <th className="border border-academic-600 px-3 py-2.5">Frequency</th>
                  <th className="border border-academic-600 px-3 py-2.5">Width</th>
                  <th className="border border-academic-600 px-3 py-2.5">Adjusted frequency</th>
                  <th className="w-12 border border-academic-600" />
                </tr>
              </thead>
              <tbody>
                {unequalRows.map((row, i) => {
                  const adj =
                    unequalResult?.rows.find((r) => r.classInterval === row.classInterval)
                      ?.adjustedFrequency;
                  return (
                    <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                      <td className="border border-academic-200 px-2 py-1.5">
                        <input
                          type="text"
                          className="w-full rounded border border-academic-300 px-2 py-1.5 text-sm"
                          value={row.classInterval}
                          onChange={(e) => updateRow(setUnequalRows, row.id, 'classInterval', e.target.value)}
                        />
                      </td>
                      <td className="border border-academic-200 px-2 py-1.5">
                        <input
                          type="number"
                          min={0}
                          className="w-full rounded border border-academic-300 px-2 py-1.5 text-center text-sm"
                          value={row.frequency}
                          onChange={(e) => updateRow(setUnequalRows, row.id, 'frequency', e.target.value)}
                        />
                      </td>
                      <td className="border border-academic-200 px-2 py-1.5">
                        <input
                          type="number"
                          min={1}
                          className="w-full rounded border border-academic-300 px-2 py-1.5 text-center text-sm"
                          value={row.width}
                          onChange={(e) => updateRow(setUnequalRows, row.id, 'width', e.target.value)}
                        />
                      </td>
                      <td className="border border-academic-200 px-3 py-2 text-center font-medium">
                        {adj != null ? formatNum(adj, 4) : '—'}
                      </td>
                      <td className="border border-academic-200 px-1 text-center">
                        <TrashBtn
                          onClick={() => removeRow(setUnequalRows, unequalRows, row.id)}
                          disabled={unequalRows.length <= 1}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <AddRowBtn onClick={addUnequalRow} />
          </div>
          {unequalResult && (
            <HistogramChart
              title="Histogram (Unequal Class Width)"
              boundaryBased
              data={unequalResult.rows.map((r) => {
                const parsed = parseClassIntervalRange(r.classInterval);
                const lower = parsed?.lower ?? 0;
                const upper = parsed?.upper ?? lower + (Number(r.width) || 1);
                return {
                  lowerBoundary: lower,
                  upperBoundary: upper,
                  frequency: r.adjustedFrequency,
                };
              })}
              useAdjusted
            />
          )}
        </>
      )}

      {variant === 'histogram-discrete' && (
        <>
          <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-academic-700 text-white">
                  <th className="border border-academic-600 px-3 py-2.5">Discrete value (x)</th>
                  <th className="border border-academic-600 px-3 py-2.5">Frequency</th>
                  <th className="w-12 border border-academic-600" />
                </tr>
              </thead>
              <tbody>
                {discreteRows.map((row, i) => (
                  <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                    <td className="border border-academic-200 px-2 py-1.5">
                      <input
                        type="number"
                        className="w-full rounded border border-academic-300 px-2 py-1.5 text-center text-sm"
                        value={row.value}
                        onChange={(e) => updateRow(setDiscreteRows, row.id, 'value', e.target.value)}
                      />
                    </td>
                    <td className="border border-academic-200 px-2 py-1.5">
                      <input
                        type="number"
                        min={0}
                        className="w-full rounded border border-academic-300 px-2 py-1.5 text-center text-sm"
                        value={row.frequency}
                        onChange={(e) => updateRow(setDiscreteRows, row.id, 'frequency', e.target.value)}
                      />
                    </td>
                    <td className="border border-academic-200 px-1 text-center">
                      <TrashBtn
                        onClick={() => removeRow(setDiscreteRows, discreteRows, row.id)}
                        disabled={discreteRows.length <= 1}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <AddRowBtn onClick={addDiscreteRow} />
          </div>
          {discreteResult && (
            <HistogramChart
              title="Histogram for Discrete Data"
              boundaryBased
              discrete
              data={discreteResult.rows.map((r) => ({
                lowerBoundary: Number(r.value) - 0.5,
                upperBoundary: Number(r.value) + 0.5,
                frequency: r.frequency,
              }))}
            />
          )}
        </>
      )}
    </section>
  );
}
