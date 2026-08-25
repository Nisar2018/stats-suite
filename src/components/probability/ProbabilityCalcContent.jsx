import { useMemo, useState } from 'react';
import {
  computeProbability,
  computeUnionProbability,
  computeCombination,
} from '../../utils/probabilityStatistics';
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

export function ProbabilityCalcContent() {
  const [mode, setMode] = useState('simple');
  const [favorable, setFavorable] = useState('1');
  const [sampleSpace, setSampleSpace] = useState('6');
  const [pA, setPA] = useState('0.3');
  const [pB, setPB] = useState('0.4');
  const [pAB, setPAB] = useState('0.1');
  const [mutuallyExclusive, setMutuallyExclusive] = useState(false);

  const [n, setN] = useState('52');
  const [r, setR] = useState('5');
  const [compoundOp, setCompoundOp] = useState('or');
  const [n2, setN2] = useState('52');
  const [r2, setR2] = useState('3');

  const simpleResult = useMemo(
    () => computeProbability(favorable, sampleSpace),
    [favorable, sampleSpace],
  );

  const unionResult = useMemo(
    () => computeUnionProbability(pA, pB, pAB, mutuallyExclusive),
    [pA, pB, pAB, mutuallyExclusive],
  );

  const combo1 = useMemo(() => computeCombination(n, r), [n, r]);
  const combo2 = useMemo(() => computeCombination(n2, r2), [n2, r2]);

  const compoundOutcomes = useMemo(() => {
    if (combo1?.error || combo2?.error) return null;
    const c1 = combo1.result;
    const c2 = combo2.result;
    const combined = compoundOp === 'or' ? c1 + c2 : c1 * c2;
    return { c1, c2, combined, op: compoundOp };
  }, [combo1, combo2, compoundOp]);

  const compoundProbability = useMemo(() => {
    if (!compoundOutcomes) return null;
    return computeProbability(compoundOutcomes.combined, sampleSpace);
  }, [compoundOutcomes, sampleSpace]);

  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        Probability measures how likely an event is. First identify the event type, then apply the
        correct rule.
      </p>

      <FormulaBox label="Basic formula">
        <span>P(A)</span>
        <span>=</span>
        <Fraction
          numerator="no. of outcomes of event A"
          denominator="no. of outcomes of sample space"
        />
      </FormulaBox>

      <div className="flex flex-wrap gap-2">
        {[
          { id: 'simple', label: 'Simple event' },
          { id: 'compound', label: 'Compound event' },
          { id: 'union', label: 'Union (A or B)' },
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

      {mode === 'simple' && (
        <>
          <div className="grid max-w-md gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
              <label className="mb-1 block text-sm font-medium text-blue-900">
                Outcomes of event A
              </label>
              <input
                type="number"
                min={0}
                className={inputClass}
                value={favorable}
                onChange={(e) => setFavorable(e.target.value)}
              />
            </div>
            <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
              <label className="mb-1 block text-sm font-medium text-blue-900">
                Sample space outcomes
              </label>
              <input
                type="number"
                min={1}
                className={inputClass}
                value={sampleSpace}
                onChange={(e) => setSampleSpace(e.target.value)}
              />
            </div>
          </div>
          {simpleResult?.error && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {simpleResult.error}
            </p>
          )}
          {simpleResult && !simpleResult.error && (
            <>
              <ResultCard label="P(A)" value={formatNum(simpleResult.probability, 6)} />
              <CalculationSteps steps={simpleResult.steps} />
            </>
          )}
        </>
      )}

      {mode === 'compound' && (
        <>
          <p className="text-sm text-academic-600">
            Count outcomes of each part using nC<sub>r</sub>, then add for OR or multiply for AND.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCompoundOp('or')}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                compoundOp === 'or' ? 'bg-blue-900 text-white' : 'bg-academic-100 text-academic-800'
              }`}
            >
              OR (add)
            </button>
            <button
              type="button"
              onClick={() => setCompoundOp('and')}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                compoundOp === 'and' ? 'bg-blue-900 text-white' : 'bg-academic-100 text-academic-800'
              }`}
            >
              AND (multiply)
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3 rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-blue-900">Part 1 — nC<sub>r</sub></p>
              <input type="number" min={0} className={inputClass} value={n} onChange={(e) => setN(e.target.value)} placeholder="n" />
              <input type="number" min={0} className={inputClass} value={r} onChange={(e) => setR(e.target.value)} placeholder="r" />
              {combo1 && !combo1.error && (
                <p className="text-center text-sm font-medium text-academic-700">
                  {n}C{r} = {formatNum(combo1.result, 0)}
                </p>
              )}
            </div>
            <div className="space-y-3 rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-blue-900">Part 2 — nC<sub>r</sub></p>
              <input type="number" min={0} className={inputClass} value={n2} onChange={(e) => setN2(e.target.value)} placeholder="n" />
              <input type="number" min={0} className={inputClass} value={r2} onChange={(e) => setR2(e.target.value)} placeholder="r" />
              {combo2 && !combo2.error && (
                <p className="text-center text-sm font-medium text-academic-700">
                  {n2}C{r2} = {formatNum(combo2.result, 0)}
                </p>
              )}
            </div>
          </div>
          <div className="max-w-xs rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
            <label className="mb-1 block text-sm font-medium text-blue-900">Sample space size</label>
            <input
              type="number"
              min={1}
              className={inputClass}
              value={sampleSpace}
              onChange={(e) => setSampleSpace(e.target.value)}
            />
          </div>
          {compoundOutcomes && compoundProbability && !compoundProbability.error && (
            <>
              <p className="text-center font-mono text-sm text-academic-700">
                Combined outcomes = {formatNum(compoundOutcomes.c1, 0)}{' '}
                {compoundOp === 'or' ? '+' : '×'} {formatNum(compoundOutcomes.c2, 0)} ={' '}
                {formatNum(compoundOutcomes.combined, 0)}
              </p>
              <ResultCard label="P(A)" value={formatNum(compoundProbability.probability, 6)} />
              <CalculationSteps steps={compoundProbability.steps} />
            </>
          )}
        </>
      )}

      {mode === 'union' && (
        <>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setMutuallyExclusive(true)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                mutuallyExclusive ? 'bg-blue-900 text-white' : 'bg-academic-100 text-academic-800'
              }`}
            >
              Mutually exclusive
            </button>
            <button
              type="button"
              onClick={() => setMutuallyExclusive(false)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                !mutuallyExclusive ? 'bg-blue-900 text-white' : 'bg-academic-100 text-academic-800'
              }`}
            >
              Not mutually exclusive
            </button>
          </div>

          <FormulaBox label="Union formula">
            <span>
              {mutuallyExclusive
                ? 'P(A ∪ B) = P(A) + P(B)'
                : 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)'}
            </span>
          </FormulaBox>

          <div className="grid max-w-lg gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
              <label className="mb-1 block text-sm font-medium text-blue-900">P(A)</label>
              <input type="number" min={0} max={1} step="any" className={inputClass} value={pA} onChange={(e) => setPA(e.target.value)} />
            </div>
            <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
              <label className="mb-1 block text-sm font-medium text-blue-900">P(B)</label>
              <input type="number" min={0} max={1} step="any" className={inputClass} value={pB} onChange={(e) => setPB(e.target.value)} />
            </div>
            {!mutuallyExclusive && (
              <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
                <label className="mb-1 block text-sm font-medium text-blue-900">P(A ∩ B)</label>
                <input type="number" min={0} max={1} step="any" className={inputClass} value={pAB} onChange={(e) => setPAB(e.target.value)} />
              </div>
            )}
          </div>

          {unionResult?.error && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {unionResult.error}
            </p>
          )}
          {unionResult && !unionResult.error && (
            <>
              <ResultCard label="P(A ∪ B)" value={formatNum(unionResult.result, 6)} />
              <CalculationSteps steps={unionResult.steps} />
            </>
          )}
        </>
      )}
    </section>
  );
}
