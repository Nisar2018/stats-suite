import { useMemo, useState } from 'react';
import { computeConditionalProbability } from '../../utils/probabilityStatistics';
import { formatNum } from '../../utils/formatNumber';
import { FormulaBox, Fraction } from '../FormulaBox';
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

export function ConditionalProbabilityContent() {
  const [mode, setMode] = useState('givenB');
  const [pAB, setPAB] = useState('0.12');
  const [pGiven, setPGiven] = useState('0.4');

  const result = useMemo(
    () => computeConditionalProbability(pAB, pGiven),
    [pAB, pGiven],
  );

  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        For <strong>dependent events</strong>, conditional probability is the probability of event A
        given that event B has occurred (or vice versa).
      </p>

      <FormulaBox label="Formulas">
        <div className="flex flex-col gap-2 text-base sm:text-lg">
          <span>
            P(A|B) ={' '}
            <Fraction numerator="P(A ∩ B)" denominator="P(B)" />
          </span>
          <span>
            P(B|A) ={' '}
            <Fraction numerator="P(A ∩ B)" denominator="P(A)" />
          </span>
        </div>
      </FormulaBox>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode('givenB')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            mode === 'givenB' ? 'bg-blue-900 text-white' : 'bg-academic-100 text-academic-800'
          }`}
        >
          P(A|B)
        </button>
        <button
          type="button"
          onClick={() => setMode('givenA')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            mode === 'givenA' ? 'bg-blue-900 text-white' : 'bg-academic-100 text-academic-800'
          }`}
        >
          P(B|A)
        </button>
      </div>

      <div className="grid max-w-md gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
          <label className="mb-1 block text-sm font-medium text-blue-900">P(A ∩ B)</label>
          <input
            type="number"
            min={0}
            max={1}
            step="any"
            className={inputClass}
            value={pAB}
            onChange={(e) => setPAB(e.target.value)}
          />
        </div>
        <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
          <label className="mb-1 block text-sm font-medium text-blue-900">
            {mode === 'givenB' ? 'P(B)' : 'P(A)'}
          </label>
          <input
            type="number"
            min={0}
            max={1}
            step="any"
            className={inputClass}
            value={pGiven}
            onChange={(e) => setPGiven(e.target.value)}
          />
        </div>
      </div>

      {result?.error && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {result.error}
        </p>
      )}

      {result && !result.error && (
        <>
          <ResultCard
            label={mode === 'givenB' ? 'P(A|B)' : 'P(B|A)'}
            value={formatNum(result.result, 6)}
          />
          <CalculationSteps steps={result.steps} />
        </>
      )}
    </section>
  );
}
