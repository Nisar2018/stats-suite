import { ResultLineGraph } from './ResultLineGraph';

export function ResultGraphPanel({ chart }) {
  if (!chart?.values?.length) return null;

  return (
    <div className="rounded-lg border-2 border-academic-300 bg-white px-4 py-5 shadow-sm">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-academic-500">
        Result Graph
      </p>
      <ResultLineGraph chart={chart} wide />
    </div>
  );
}
