import { useMemo, useState } from 'react';
import { computeIndependentMultiplication } from '../../utils/probabilityStatistics';
import { formatNum } from '../../utils/formatNumber';
import { FormulaBox } from '../FormulaBox';
import { CalculationSteps } from '../CalculationSteps';

const inputClass =
  'w-full rounded border border-academic-300 bg-white px-3 py-2 text-sm text-center focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400';

function ResultCard({ label, value }) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-center">
      <p className="text-xs font-medium text-blue-700">{label}</p>
      <p className="mt-1 text-2xl font-bold text-blue-900">{value}</p>
    </div>
  );
}

export function IndependentEventsContent() {
  const [mode, setMode] = useState('general');
  const [pA, setPA] = useState('0.5');
  const [pSecond, setPSecond] = useState('0.4');
  const [pB, setPB] = useState('0.4');

  const generalResult = useMemo(
    () => computeIndependentMultiplication(pA, pSecond, mode === 'reverse' ? 'reverse' : 'forward'),
    [pA, pSecond, mode],
  );

  const independentResult = useMemo(
    () => computeIndependentMultiplication(pA, pB, 'forward'),
    [pA, pB],
  );

  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        When two events A and B are related, the probability of both occurring uses the
        multiplication rule. If they are <strong>independent</strong>, P(A ∩ B) = P(A) × P(B).
      </p>

      <FormulaBox label="Multiplication rule">
        <div className="flex flex-col gap-2 text-base sm:text-lg">
          <span>P(A ∩ B) = P(A) × P(B|A)</span>
          <span>P(A ∩ B) = P(B) × P(A|B)</span>
          <span className="text-academic-600">Independent: P(A ∩ B) = P(A) × P(B)</span>
        </div>
      </FormulaBox>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'general', label: 'General rule' },
          { id: 'reverse', label: 'P(B) × P(A|B)' },
          { id: 'independent', label: 'Independent events' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMode(tab.id)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              mode === tab.id ? 'bg-blue-900 text-white' : 'bg-academic-100 text-academic-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mode !== 'independent' ? (
        <>
          <div className="grid max-w-md gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
              <label className="mb-1 block text-sm font-medium text-blue-900">
                {mode === 'reverse' ? 'P(B)' : 'P(A)'}
              </label>
              <input
                type="number"
                min={0}
                max={1}
                step="any"
                className={inputClass}
                value={pA}
                onChange={(e) => setPA(e.target.value)}
              />
            </div>
            <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
              <label className="mb-1 block text-sm font-medium text-blue-900">
                {mode === 'reverse' ? 'P(A|B)' : 'P(B|A)'}
              </label>
              <input
                type="number"
                min={0}
                max={1}
                step="any"
                className={inputClass}
                value={pSecond}
                onChange={(e) => setPSecond(e.target.value)}
              />
            </div>
          </div>
          {generalResult?.error && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {generalResult.error}
            </p>
          )}
          {generalResult && !generalResult.error && (
            <>
              <ResultCard label="P(A ∩ B)" value={formatNum(generalResult.result, 6)} />
              <CalculationSteps steps={generalResult.steps} />
            </>
          )}
        </>
      ) : (
        <>
          <div className="grid max-w-md gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
              <label className="mb-1 block text-sm font-medium text-blue-900">P(A)</label>
              <input
                type="number"
                min={0}
                max={1}
                step="any"
                className={inputClass}
                value={pA}
                onChange={(e) => setPA(e.target.value)}
              />
            </div>
            <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
              <label className="mb-1 block text-sm font-medium text-blue-900">P(B)</label>
              <input
                type="number"
                min={0}
                max={1}
                step="any"
                className={inputClass}
                value={pB}
                onChange={(e) => setPB(e.target.value)}
              />
            </div>
          </div>
          {independentResult?.error && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {independentResult.error}
            </p>
          )}
          {independentResult && !independentResult.error && (
            <>
              <ResultCard label="P(A ∩ B)" value={formatNum(independentResult.result, 6)} />
              <CalculationSteps steps={independentResult.steps} />
            </>
          )}
        </>
      )}
    </section>
  );
}
