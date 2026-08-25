import { useMemo, useState } from 'react';
import {
  computeUngroupedVariance,
  computeGroupedVariance,
} from '../../utils/dispersionStatistics';
import { createDefaultClassRows } from '../../utils/statistics';
import { formatNum } from '../../utils/formatNumber';
import { FormulaBox, Fraction } from '../FormulaBox';
import { CalculationSteps } from '../CalculationSteps';
import { ValueListInput } from '../ValueListInput';
import { EditableFrequencyTable } from '../EditableFrequencyTable';

const defaultValues = '10, 12, 15, 18, 20, 22, 25, 28, 30';

function ResultCard({ label, value }) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-center">
      <p className="text-xs font-medium text-blue-700">{label}</p>
      <p className="mt-1 text-2xl font-bold text-blue-900">{formatNum(value)}</p>
    </div>
  );
}

export function VarianceContent({ topicId }) {
  const [values, setValues] = useState([]);
  const [classRows, setClassRows] = useState(createDefaultClassRows);

  const ungrouped = useMemo(() => computeUngroupedVariance(values), [values]);
  const grouped = useMemo(() => computeGroupedVariance(classRows), [classRows]);

  if (topicId === 'variance-coefficient') {
    return (
      <section className="space-y-6">
        <p className="text-academic-600">
          The coefficient of variance expresses variance relative to the mean (as a percentage).
        </p>
        <FormulaBox label="Formula">
          <span>Coefficient of variance = (Variance / Mean) × 100</span>
        </FormulaBox>
        <ValueListInput label="Enter data values" defaultValue={defaultValues} onValuesChange={setValues} />
        {ungrouped && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard label="Mean" value={ungrouped.mean} />
              <ResultCard label="Variance" value={ungrouped.variance} />
              <ResultCard label="S.D" value={ungrouped.sd} />
              <ResultCard label="Coefficient of variance" value={ungrouped.cv} />
            </div>
            <CalculationSteps
              steps={ungrouped.steps.filter(
                (s) => s.step <= 3 || s.title === 'Coefficient of variance',
              )}
            />
          </>
        )}
      </section>
    );
  }

  const isUngrouped = topicId === 'variance-ungrouped';
  const result = isUngrouped ? ungrouped : grouped;

  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        Variance measures average squared deviation from the mean.
      </p>

      {isUngrouped ? (
        <FormulaBox label="Formula (ungrouped)">
          <span>Variance</span>
          <span>=</span>
          <Fraction numerator="Σ(yi − mean)²" denominator="n" />
        </FormulaBox>
      ) : (
        <FormulaBox label="Formula (grouped / frequency distribution)">
          <span>Variance</span>
          <span>=</span>
          <Fraction numerator="Σ fi(Xi − mean)²" denominator="Σ fi" />
        </FormulaBox>
      )}

      {isUngrouped ? (
        <ValueListInput label="Enter data values" defaultValue={defaultValues} onValuesChange={setValues} />
      ) : (
        <EditableFrequencyTable rows={classRows} onChange={setClassRows} showMidPoint showProduct showBoundaries />
      )}

      {result && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultCard label="Mean" value={result.mean} />
            <ResultCard
              label={isUngrouped ? 'Σ(yi − mean)²' : 'Σ fi(Xi − M)²'}
              value={isUngrouped ? result.sumSq : result.sumFiD2}
            />
            <ResultCard label="Variance" value={result.variance} />
          </div>

          {isUngrouped && result.rows && (
            <div className="overflow-x-auto rounded-lg border border-academic-200">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-academic-700 text-white">
                    <th className="border border-academic-600 px-3 py-2">yi</th>
                    <th className="border border-academic-600 px-3 py-2">yi − mean</th>
                    <th className="border border-academic-600 px-3 py-2">(yi − mean)²</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((r, i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                      <td className="border border-academic-200 px-3 py-2 text-center">{r.y}</td>
                      <td className="border border-academic-200 px-3 py-2 text-center">{formatNum(r.d)}</td>
                      <td className="border border-academic-200 px-3 py-2 text-center">{formatNum(r.d2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-academic-200 font-bold">
                    <td colSpan={2} className="border border-academic-300 px-3 py-2 text-right">
                      Total
                    </td>
                    <td className="border border-academic-300 px-3 py-2 text-center">
                      {formatNum(result.sumSq)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {!isUngrouped && result.tableRows && (
            <div className="overflow-x-auto rounded-lg border border-academic-200">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-academic-700 text-white">
                    <th className="border border-academic-600 px-3 py-2">Class intervals</th>
                    <th className="border border-academic-600 px-3 py-2">Mid value Xi</th>
                    <th className="border border-academic-600 px-3 py-2">Frequency Fi</th>
                    <th className="border border-academic-600 px-3 py-2">Fi × Xi</th>
                    <th className="border border-academic-600 px-3 py-2">Fi(Xi − M)²</th>
                  </tr>
                </thead>
                <tbody>
                  {result.tableRows.map((r, i) => (
                    <tr key={r.id ?? i} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                      <td className="border border-academic-200 px-3 py-2">{r.classInterval}</td>
                      <td className="border border-academic-200 px-3 py-2 text-center">{formatNum(r.xi)}</td>
                      <td className="border border-academic-200 px-3 py-2 text-center">{r.frequency}</td>
                      <td className="border border-academic-200 px-3 py-2 text-center">{formatNum(r.fiXi)}</td>
                      <td className="border border-academic-200 px-3 py-2 text-center">{formatNum(r.fiD2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-academic-200 font-bold">
                    <td className="border border-academic-300 px-3 py-2">Total</td>
                    <td className="border border-academic-300" />
                    <td className="border border-academic-300 px-3 py-2 text-center">{result.totalF}</td>
                    <td className="border border-academic-300 px-3 py-2 text-center">{formatNum(result.sumFiXi)}</td>
                    <td className="border border-academic-300 px-3 py-2 text-center">{formatNum(result.sumFiD2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <CalculationSteps
            steps={result.steps.filter(
              (s) =>
                !['Coefficient of variance', 'Coefficient of S.D', 'Standard deviation'].includes(
                  s.title,
                ),
            )}
          />
        </>
      )}
    </section>
  );
}

export function StandardDeviationContent({ topicId }) {
  const [values, setValues] = useState([]);
  const [classRows, setClassRows] = useState(createDefaultClassRows);

  const ungrouped = useMemo(() => computeUngroupedVariance(values), [values]);
  const grouped = useMemo(() => computeGroupedVariance(classRows), [classRows]);

  if (topicId === 'sd-coefficient') {
    return (
      <section className="space-y-6">
        <p className="text-academic-600">
          The coefficient of standard deviation is standard deviation relative to the mean.
        </p>
        <FormulaBox label="Formula">
          <span>Coefficient of S.D = S.D / Mean</span>
        </FormulaBox>
        <ValueListInput label="Enter data values" defaultValue={defaultValues} onValuesChange={setValues} />
        {ungrouped && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard label="Mean" value={ungrouped.mean} />
              <ResultCard label="Variance" value={ungrouped.variance} />
              <ResultCard label="Standard Deviation" value={ungrouped.sd} />
              <ResultCard label="Coefficient of S.D" value={ungrouped.coeffSd} />
            </div>
            <CalculationSteps
              steps={ungrouped.steps.filter((s) => s.title !== 'Coefficient of variance')}
            />
          </>
        )}
      </section>
    );
  }

  const isUngrouped = topicId === 'sd-ungrouped';
  const result = isUngrouped ? ungrouped : grouped;

  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        Standard deviation is the square root of variance and is measured in the same units as the data.
      </p>

      {isUngrouped ? (
        <FormulaBox label="Formula (ungrouped)">
          <span>S.D = √[ Σ(yi − mean)² / n ]</span>
        </FormulaBox>
      ) : (
        <FormulaBox label="Formula (grouped / frequency table)">
          <span>S.D = √[ Σ fi(Xi − mean)² / Σ fi ]</span>
        </FormulaBox>
      )}

      {isUngrouped ? (
        <ValueListInput label="Enter data values" defaultValue={defaultValues} onValuesChange={setValues} />
      ) : (
        <EditableFrequencyTable rows={classRows} onChange={setClassRows} showMidPoint showProduct showBoundaries />
      )}

      {result && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ResultCard label="Mean" value={result.mean} />
            <ResultCard label="Variance" value={result.variance} />
            <ResultCard label="Standard Deviation" value={result.sd} />
            <ResultCard label="Coefficient of S.D" value={result.coeffSd} />
          </div>

          {!isUngrouped && result.tableRows && (
            <div className="overflow-x-auto rounded-lg border border-academic-200">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-academic-700 text-white">
                    <th className="border border-academic-600 px-3 py-2">Class intervals</th>
                    <th className="border border-academic-600 px-3 py-2">Mid value Xi</th>
                    <th className="border border-academic-600 px-3 py-2">Frequency Fi</th>
                    <th className="border border-academic-600 px-3 py-2">Fi × Xi</th>
                    <th className="border border-academic-600 px-3 py-2">Fi(Xi − M)²</th>
                  </tr>
                </thead>
                <tbody>
                  {result.tableRows.map((r, i) => (
                    <tr key={r.id ?? i} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                      <td className="border border-academic-200 px-3 py-2">{r.classInterval}</td>
                      <td className="border border-academic-200 px-3 py-2 text-center">{formatNum(r.xi)}</td>
                      <td className="border border-academic-200 px-3 py-2 text-center">{r.frequency}</td>
                      <td className="border border-academic-200 px-3 py-2 text-center">{formatNum(r.fiXi)}</td>
                      <td className="border border-academic-200 px-3 py-2 text-center">{formatNum(r.fiD2)}</td>
                    </tr>
                  ))}
                  <tr className="bg-academic-200 font-bold">
                    <td className="border border-academic-300 px-3 py-2">Total</td>
                    <td className="border border-academic-300" />
                    <td className="border border-academic-300 px-3 py-2 text-center">{result.totalF}</td>
                    <td className="border border-academic-300 px-3 py-2 text-center">{formatNum(result.sumFiXi)}</td>
                    <td className="border border-academic-300 px-3 py-2 text-center">{formatNum(result.sumFiD2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          <CalculationSteps
            steps={result.steps.filter((s) => s.title !== 'Coefficient of variance')}
          />
        </>
      )}
    </section>
  );
}
