import { useMemo, useState } from 'react';
import { createId } from '../../utils/representationStatistics';
import { ScatterPlotChart } from './ScatterPlotChart';

const defaultSame = [
  { id: createId(), x: 12, y: 14 },
  { id: createId(), x: 18, y: 17 },
  { id: createId(), x: 22, y: 25 },
  { id: createId(), x: 28, y: 26 },
  { id: createId(), x: 35, y: 33 },
  { id: createId(), x: 40, y: 42 },
];

const defaultDifferent = [
  { id: createId(), x: 10, y: 55 },
  { id: createId(), x: 15, y: 62 },
  { id: createId(), x: 20, y: 70 },
  { id: createId(), x: 25, y: 78 },
  { id: createId(), x: 30, y: 85 },
  { id: createId(), x: 35, y: 92 },
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

function ScatterPointsTable({
  points,
  xLabel,
  yLabel,
  onUpdate,
  onAdd,
  onRemove,
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-academic-700 text-white">
            <th className="border border-academic-600 px-3 py-2.5">{xLabel}</th>
            <th className="border border-academic-600 px-3 py-2.5">{yLabel}</th>
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
                  onChange={(e) => onUpdate(row.id, 'x', e.target.value)}
                />
              </td>
              <td className="border border-academic-200 px-2 py-1.5">
                <input
                  type="number"
                  className="w-full rounded border border-academic-300 px-2 py-1.5 text-center text-sm"
                  value={row.y}
                  onChange={(e) => onUpdate(row.id, 'y', e.target.value)}
                />
              </td>
              <td className="border border-academic-200 px-1 text-center">
                <TrashBtn onClick={() => onRemove(row.id)} disabled={points.length <= 1} />
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
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Add new Row
      </button>
    </div>
  );
}

export function ScatterPlotContent({ variant }) {
  const isSame = variant === 'scatter-same';
  const [points, setPoints] = useState(isSame ? defaultSame : defaultDifferent);
  const [xName, setXName] = useState(isSame ? 'Measurement 1' : 'Hours studied');
  const [yName, setYName] = useState(isSame ? 'Measurement 2' : 'Exam score');

  const chartPoints = useMemo(
    () =>
      points
        .map((p) => ({ x: Number(p.x), y: Number(p.y) }))
        .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y)),
    [points],
  );

  const updatePoint = (id, field, value) => {
    setPoints((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const addPoint = () => {
    setPoints((prev) => [...prev, { id: createId(), x: '', y: '' }]);
  };

  const removePoint = (id) => {
    if (points.length <= 1) return;
    setPoints((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <section className="space-y-6">
      {isSame ? (
        <p className="text-academic-600">
          In a scatter plot for the <strong>same variable</strong>, one set of values is taken on the
          x-axis and the other on the y-axis. The <strong>line of equality</strong> is drawn at{' '}
          <strong>45°</strong> (y = x) to compare the two measurements.
        </p>
      ) : (
        <p className="text-academic-600">
          In a scatter plot of <strong>different variables</strong>, two interrelated variables are
          plotted by taking one on the x-axis and the other on the y-axis to show association.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm text-academic-700">
          X-axis label
          <input
            type="text"
            className="mt-1 w-full rounded border border-academic-300 px-2 py-1.5 text-sm"
            value={xName}
            onChange={(e) => setXName(e.target.value)}
          />
        </label>
        <label className="text-sm text-academic-700">
          Y-axis label
          <input
            type="text"
            className="mt-1 w-full rounded border border-academic-300 px-2 py-1.5 text-sm"
            value={yName}
            onChange={(e) => setYName(e.target.value)}
          />
        </label>
      </div>

      <ScatterPointsTable
        points={points}
        xLabel={xName || 'X'}
        yLabel={yName || 'Y'}
        onUpdate={updatePoint}
        onAdd={addPoint}
        onRemove={removePoint}
      />

      {chartPoints.length > 0 && (
        <ScatterPlotChart
          title={
            isSame
              ? 'Scatter Plot for Same Variable'
              : 'Scatter Plot of Different Variables'
          }
          points={chartPoints}
          xLabel={xName || 'X'}
          yLabel={yName || 'Y'}
          showEqualityLine={isSame}
        />
      )}
    </section>
  );
}
