import { useMemo, useState } from 'react';
import {
  buildBivariateFrequencyTable,
  createId,
  formatClassBoundary,
  formatClassValue,
  formatNum,
  parseClassBoundary,
} from '../../utils/representationStatistics';
import { FormulaBox } from '../FormulaBox';

const defaultPoints = [
  { id: createId(), x: 12, y: 22 },
  { id: createId(), x: 18, y: 28 },
  { id: createId(), x: 25, y: 35 },
  { id: createId(), x: 32, y: 42 },
  { id: createId(), x: 38, y: 48 },
  { id: createId(), x: 15, y: 25 },
  { id: createId(), x: 28, y: 38 },
  { id: createId(), x: 42, y: 52 },
  { id: createId(), x: 22, y: 31 },
  { id: createId(), x: 35, y: 45 },
];

const defaultXBins = [
  { id: createId(), boundary: '9.5-19.5' },
  { id: createId(), boundary: '19.5-29.5' },
  { id: createId(), boundary: '29.5-39.5' },
  { id: createId(), boundary: '39.5-49.5' },
];

const defaultYBins = [
  { id: createId(), boundary: '19.5-29.5' },
  { id: createId(), boundary: '29.5-39.5' },
  { id: createId(), boundary: '39.5-49.5' },
  { id: createId(), boundary: '49.5-59.5' },
];

function TrashBtn({ onClick, disabled }) {
  return (
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
}

function BoundaryList({ title, bins, onUpdate, onAdd, onRemove }) {
  return (
    <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-blue-900">{title}</h3>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-academic-700 text-white">
            <th className="border border-academic-600 px-3 py-2">Class boundaries</th>
            <th className="w-12 border border-academic-600" />
          </tr>
        </thead>
        <tbody>
          {bins.map((bin, i) => (
            <tr key={bin.id} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
              <td className="border border-academic-200 px-2 py-1.5">
                <input
                  type="text"
                  className="w-full rounded border border-academic-300 px-2 py-1.5 text-center text-sm"
                  value={bin.boundary}
                  onChange={(e) => onUpdate(bin.id, e.target.value)}
                  placeholder="e.g. 9.5-19.5"
                />
              </td>
              <td className="border border-academic-200 px-1 text-center">
                <TrashBtn onClick={() => onRemove(bin.id)} disabled={bins.length <= 1} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={onAdd}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-academic-300 bg-white px-3 py-2 text-sm font-medium text-academic-700 hover:bg-academic-50"
      >
        Add class
      </button>
    </div>
  );
}

export function BivariateFrequencyContent() {
  const [points, setPoints] = useState(defaultPoints);
  const [xBins, setXBins] = useState(defaultXBins);
  const [yBins, setYBins] = useState(defaultYBins);
  const [xVar, setXVar] = useState('Variable X');
  const [yVar, setYVar] = useState('Variable Y');

  const table = useMemo(
    () =>
      buildBivariateFrequencyTable(
        points,
        xBins.map((b) => b.boundary),
        yBins.map((b) => b.boundary),
      ),
    [points, xBins, yBins],
  );

  const updatePoint = (id, field, value) => {
    setPoints((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const addPoint = () => setPoints((prev) => [...prev, { id: createId(), x: '', y: '' }]);
  const removePoint = (id) => {
    if (points.length <= 1) return;
    setPoints((prev) => prev.filter((p) => p.id !== id));
  };

  const updateBin = (setter) => (id, value) => {
    setter((prev) =>
      prev.map((b) => {
        if (b.id !== id) return b;
        const parsed = parseClassBoundary(value);
        return {
          ...b,
          boundary: parsed ? formatClassBoundary(parsed.lower, parsed.upper) : value,
        };
      }),
    );
  };

  const addBin = (setter) => () => {
    setter((prev) => {
      const last = prev[prev.length - 1];
      const parsed = last ? parseClassBoundary(last.boundary) : null;
      const lower = parsed ? parsed.upper : 0;
      const span = parsed ? parsed.upper - parsed.lower : 10;
      return [...prev, { id: createId(), boundary: formatClassBoundary(lower, lower + span) }];
    });
  };

  const removeBin = (setter, bins) => (id) => {
    if (bins.length <= 1) return;
    setter((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        From bivariate data, a frequency table is formed by placing both variables in{' '}
        <strong>class boundaries</strong> and counting frequencies (and relative frequencies) in each cell.
      </p>

      <FormulaBox label="Relative frequency">
        <span>Relative frequency of a cell = cell frequency ÷ total frequency</span>
      </FormulaBox>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-academic-700">
          X variable name
          <input
            type="text"
            className="mt-1 w-full rounded border border-academic-300 px-2 py-1.5 text-sm"
            value={xVar}
            onChange={(e) => setXVar(e.target.value)}
          />
        </label>
        <label className="text-sm text-academic-700">
          Y variable name
          <input
            type="text"
            className="mt-1 w-full rounded border border-academic-300 px-2 py-1.5 text-sm"
            value={yVar}
            onChange={(e) => setYVar(e.target.value)}
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold text-blue-900">Bivariate data points</h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-academic-700 text-white">
              <th className="border border-academic-600 px-3 py-2.5">{xVar}</th>
              <th className="border border-academic-600 px-3 py-2.5">{yVar}</th>
              <th className="w-12 border border-academic-600" />
            </tr>
          </thead>
          <tbody>
            {points.map((row, i) => (
              <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                <td className="border border-academic-200 px-2 py-1.5">
                  <input
                    type="number"
                    className="w-full rounded border border-academic-300 px-2 py-1.5 text-center text-sm"
                    value={row.x}
                    onChange={(e) => updatePoint(row.id, 'x', e.target.value)}
                  />
                </td>
                <td className="border border-academic-200 px-2 py-1.5">
                  <input
                    type="number"
                    className="w-full rounded border border-academic-300 px-2 py-1.5 text-center text-sm"
                    value={row.y}
                    onChange={(e) => updatePoint(row.id, 'y', e.target.value)}
                  />
                </td>
                <td className="border border-academic-200 px-1 text-center">
                  <TrashBtn onClick={() => removePoint(row.id)} disabled={points.length <= 1} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          onClick={addPoint}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-academic-300 bg-white px-3 py-2 text-sm font-medium text-academic-700 hover:bg-academic-50"
        >
          Add new Row
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <BoundaryList
          title={`${xVar} — class boundaries`}
          bins={xBins}
          onUpdate={updateBin(setXBins)}
          onAdd={addBin(setXBins)}
          onRemove={removeBin(setXBins, xBins)}
        />
        <BoundaryList
          title={`${yVar} — class boundaries`}
          bins={yBins}
          onUpdate={updateBin(setYBins)}
          onAdd={addBin(setYBins)}
          onRemove={removeBin(setYBins, yBins)}
        />
      </div>

      {table && (
        <div className="overflow-x-auto rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold text-blue-900">
            Bivariate frequency table (f / relative frequency)
          </h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-academic-700 text-white">
                <th className="border border-academic-600 px-3 py-2.5">
                  {yVar} \ {xVar}
                </th>
                {table.xBins.map((b) => (
                  <th key={`${b.lower}-${b.upper}`} className="border border-academic-600 px-3 py-2.5">
                    {formatClassValue(b.lower)}–{formatClassValue(b.upper)}
                  </th>
                ))}
                <th className="border border-academic-600 px-3 py-2.5">Total</th>
              </tr>
            </thead>
            <tbody>
              {table.yBins.map((yb, yi) => (
                <tr key={`${yb.lower}-${yb.upper}`} className={yi % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                  <td className="border border-academic-200 px-3 py-2 font-medium text-blue-900">
                    {formatClassValue(yb.lower)}–{formatClassValue(yb.upper)}
                  </td>
                  {table.cells[yi].map((cell, xi) => (
                    <td
                      key={`${yi}-${xi}`}
                      className="border border-academic-200 px-3 py-2 text-center"
                    >
                      <div className="font-semibold">{cell.frequency}</div>
                      <div className="text-xs text-academic-500">
                        {formatNum(cell.relativeFrequency, 4)}
                      </div>
                    </td>
                  ))}
                  <td className="border border-academic-200 px-3 py-2 text-center font-bold">
                    {table.rowTotals[yi]}
                  </td>
                </tr>
              ))}
              <tr className="bg-academic-200 font-bold">
                <td className="border border-academic-300 px-3 py-2.5">Total</td>
                {table.columnTotals.map((t, i) => (
                  <td key={`ct-${i}`} className="border border-academic-300 px-3 py-2.5 text-center">
                    {t}
                  </td>
                ))}
                <td className="border border-academic-300 px-3 py-2.5 text-center">{table.total}</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-xs text-academic-500">
            Each cell shows frequency (top) and relative frequency (bottom).
          </p>
        </div>
      )}

      {!table && (
        <p className="rounded-lg border border-dashed border-academic-300 bg-academic-50 p-4 text-center text-sm text-academic-600">
          Enter data points and valid class boundaries to form the bivariate frequency table.
        </p>
      )}
    </section>
  );
}
