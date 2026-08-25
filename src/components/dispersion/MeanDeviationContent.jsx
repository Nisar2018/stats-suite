import { useMemo, useState } from 'react';
import {
  computeUngroupedMeanDeviation,
  computeGroupedMeanDeviation,
} from '../../utils/dispersionStatistics';
import { createDefaultClassRows } from '../../utils/statistics';
import { formatNum } from '../../utils/formatNumber';
import { FormulaBox, Fraction } from '../FormulaBox';
import { CalculationSteps } from '../CalculationSteps';
import { ValueListInput } from '../ValueListInput';
import { EditableFrequencyTable } from '../EditableFrequencyTable';

const defaultValues = '10, 12, 15, 18, 20, 22, 25, 28, 30';

const TOPIC_META = {
  'md-mean-ungrouped': { center: 'mean', grouped: false, label: 'Mean' },
  'md-mean-grouped': { center: 'mean', grouped: true, label: 'Mean' },
  'md-median-ungrouped': { center: 'median', grouped: false, label: 'Median' },
  'md-median-grouped': { center: 'median', grouped: true, label: 'Median' },
  'md-mode-ungrouped': { center: 'mode', grouped: false, label: 'Mode' },
  'md-mode-grouped': { center: 'mode', grouped: true, label: 'Mode' },
  'md-coeff-mean': { center: 'mean', grouped: false, label: 'Mean', isCoeff: true },
  'md-coeff-median': { center: 'median', grouped: false, label: 'Median', isCoeff: true },
};

function ResultCard({ label, value }) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-center">
      <p className="text-xs font-medium text-blue-700">{label}</p>
      <p className="mt-1 text-2xl font-bold text-blue-900">{formatNum(value)}</p>
    </div>
  );
}

export function MeanDeviationContent({ topicId }) {
  const meta = TOPIC_META[topicId] ?? TOPIC_META['md-mean-ungrouped'];
  const [values, setValues] = useState([]);
  const [classRows, setClassRows] = useState(createDefaultClassRows);

  const ungrouped = useMemo(
    () => computeUngroupedMeanDeviation(values, meta.center),
    [values, meta.center],
  );
  const grouped = useMemo(
    () => computeGroupedMeanDeviation(classRows, meta.center),
    [classRows, meta.center],
  );

  const result = meta.grouped ? grouped : ungrouped;
  const M = meta.label;

  if (meta.isCoeff) {
    return (
      <section className="space-y-6">
        <p className="text-academic-600">
          The {M.toLowerCase()} coefficient of dispersion is a relative measure based on mean
          deviation from the {M.toLowerCase()}.
        </p>
        <FormulaBox label="Formula">
          <span>
            {M === 'Mean'
              ? 'Mean coefficient of dispersion = M.D / Mean'
              : 'Median coefficient of dispersion = M.D / Median'}
          </span>
        </FormulaBox>
        <ValueListInput label="Enter data values" defaultValue={defaultValues} onValuesChange={setValues} />
        {result && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard label={`${M} (M)`} value={result.center} />
              <ResultCard label="Σ|y − M|" value={result.sumAbs} />
              <ResultCard label="Mean Deviation" value={result.md} />
              <ResultCard label={`${M} coefficient of dispersion`} value={result.coeff} />
            </div>
            <CalculationSteps steps={result.steps} />
          </>
        )}
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        Mean deviation from the {M.toLowerCase()} measures average absolute deviation about the {M.toLowerCase()}.
      </p>

      {meta.grouped ? (
        <FormulaBox label="Formula (grouped / frequency table)">
          <span>M.D</span>
          <span>=</span>
          <Fraction numerator={`Σ fi|Xi − ${M}|`} denominator="Σ fi" />
        </FormulaBox>
      ) : (
        <FormulaBox label="Formula (ungrouped)">
          <span>M.D</span>
          <span>=</span>
          <Fraction numerator={`Σ|y − ${M}|`} denominator="n" />
        </FormulaBox>
      )}

      {meta.grouped ? (
        <EditableFrequencyTable
          rows={classRows}
          onChange={setClassRows}
          showMidPoint
          showCumulative={meta.center !== 'mean'}
          showBoundaries
          highlightRowIndex={result?.centerIndex}
        />
      ) : (
        <ValueListInput label="Enter data values" defaultValue={defaultValues} onValuesChange={setValues} />
      )}

      {result && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultCard label={`${M} (M)`} value={result.center} />
            <ResultCard
              label={meta.grouped ? 'Σ fi|Xi − M|' : 'Σ|y − M|'}
              value={meta.grouped ? result.sumFiAbs : result.sumAbs}
            />
            <ResultCard label="Mean Deviation" value={result.md} />
          </div>

          {meta.grouped && result.tableRows && (
            <div className="overflow-x-auto rounded-lg border border-academic-200">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-academic-700 text-white">
                    <th className="border border-academic-600 px-3 py-2">Class intervals</th>
                    <th className="border border-academic-600 px-3 py-2">Mid value Xi</th>
                    <th className="border border-academic-600 px-3 py-2">Frequency fi</th>
                    <th className="border border-academic-600 px-3 py-2">Xi − M</th>
                    <th className="border border-academic-600 px-3 py-2">fi|Xi − M|</th>
                  </tr>
                </thead>
                <tbody>
                  {result.tableRows.map((r, i) => (
                    <tr key={r.id ?? i} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                      <td className="border border-academic-200 px-3 py-2">{r.classInterval}</td>
                      <td className="border border-academic-200 px-3 py-2 text-center">{formatNum(r.xi)}</td>
                      <td className="border border-academic-200 px-3 py-2 text-center">{r.frequency}</td>
                      <td className="border border-academic-200 px-3 py-2 text-center">
                        {formatNum(r.xi - result.center)}
                      </td>
                      <td className="border border-academic-200 px-3 py-2 text-center">{formatNum(r.fiAbs)}</td>
                    </tr>
                  ))}
                  <tr className="bg-academic-200 font-bold">
                    <td colSpan={2} className="border border-academic-300 px-3 py-2">Total</td>
                    <td className="border border-academic-300 px-3 py-2 text-center">{result.totalF}</td>
                    <td className="border border-academic-300" />
                    <td className="border border-academic-300 px-3 py-2 text-center">
                      {formatNum(result.sumFiAbs)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {!meta.grouped && result.rows && (
            <div className="overflow-x-auto rounded-lg border border-academic-200">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-academic-700 text-white">
                    <th className="border border-academic-600 px-3 py-2">y</th>
                    <th className="border border-academic-600 px-3 py-2">|y − M|</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((r, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                      <td className="border border-academic-200 px-3 py-2 text-center">{r.y}</td>
                      <td className="border border-academic-200 px-3 py-2 text-center">{formatNum(r.absDev)}</td>
                    </tr>
                  ))}
                  <tr className="bg-academic-200 font-bold">
                    <td className="border border-academic-300 px-3 py-2 text-center">Σ</td>
                    <td className="border border-academic-300 px-3 py-2 text-center">
                      {formatNum(result.sumAbs)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <CalculationSteps steps={result.steps} />
        </>
      )}

      {!result && meta.center === 'mode' && (
        <p className="rounded-lg border border-dashed border-academic-300 bg-academic-50 p-4 text-sm text-academic-600">
          Enter data with a clear modal value to compute mean deviation from the mode.
        </p>
      )}
    </section>
  );
}
