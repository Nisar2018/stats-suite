import { useMemo, useState } from 'react';
import { computeFactorial, computePermutation, computeCombination } from '../../utils/probabilityStatistics';
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

export function FactorialContent() {
  const [n, setN] = useState('5');
  const result = useMemo(() => computeFactorial(n), [n]);

  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        Factorial counts the product of all positive integers from 1 to n. It is used in
        permutations and combinations.
      </p>
      <FormulaBox label="Formula">
        <span>n! = n × (n − 1) × (n − 2) × … × 3 × 2 × 1</span>
      </FormulaBox>

      <div className="max-w-xs rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
        <label className="mb-1 block text-sm font-medium text-blue-900">Enter n</label>
        <input
          type="number"
          min={0}
          className={inputClass}
          value={n}
          onChange={(e) => setN(e.target.value)}
        />
      </div>

      {result?.error && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {result.error}
        </p>
      )}

      {result && !result.error && (
        <>
          <ResultCard label={`${result.n}!`} value={formatNum(result.result, 0)} />
          {result.expansion && (
            <p className="text-center font-mono text-sm text-academic-700">
              {result.n}! = {result.expansion} = {formatNum(result.result, 0)}
            </p>
          )}
          <CalculationSteps steps={result.steps} />
        </>
      )}
    </section>
  );
}

export function PermutationContent() {
  const [n, setN] = useState('5');
  const [r, setR] = useState('2');
  const result = useMemo(() => computePermutation(n, r), [n, r]);

  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        A permutation arranges r objects chosen from n distinct objects where order matters.
      </p>
      <FormulaBox label="Formula">
        <span>nP<sub>r</sub></span>
        <span>=</span>
        <Fraction numerator="n!" denominator="(n − r)!" />
      </FormulaBox>

      <div className="grid max-w-md gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
          <label className="mb-1 block text-sm font-medium text-blue-900">n</label>
          <input type="number" min={0} className={inputClass} value={n} onChange={(e) => setN(e.target.value)} />
        </div>
        <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
          <label className="mb-1 block text-sm font-medium text-blue-900">r</label>
          <input type="number" min={0} className={inputClass} value={r} onChange={(e) => setR(e.target.value)} />
        </div>
      </div>

      {result?.error && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {result.error}
        </p>
      )}

      {result && !result.error && (
        <>
          <ResultCard label={`${result.n}P${result.r}`} value={formatNum(result.result, 0)} />
          <CalculationSteps steps={result.steps} />
        </>
      )}
    </section>
  );
}

export function CombinationContent() {
  const [n, setN] = useState('5');
  const [r, setR] = useState('2');
  const result = useMemo(() => computeCombination(n, r), [n, r]);

  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        A combination selects r objects from n distinct objects where order does not matter.
      </p>
      <FormulaBox label="Formula">
        <span>nC<sub>r</sub></span>
        <span>=</span>
        <Fraction numerator="n!" denominator="r! (n − r)!" />
      </FormulaBox>

      <div className="grid max-w-md gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
          <label className="mb-1 block text-sm font-medium text-blue-900">n</label>
          <input type="number" min={0} className={inputClass} value={n} onChange={(e) => setN(e.target.value)} />
        </div>
        <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
          <label className="mb-1 block text-sm font-medium text-blue-900">r</label>
          <input type="number" min={0} className={inputClass} value={r} onChange={(e) => setR(e.target.value)} />
        </div>
      </div>

      {result?.error && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {result.error}
        </p>
      )}

      {result && !result.error && (
        <>
          <ResultCard label={`${result.n}C${result.r}`} value={formatNum(result.result, 0)} />
          <CalculationSteps steps={result.steps} />
        </>
      )}
    </section>
  );
}
