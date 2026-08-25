import { useMemo, useState } from 'react';
import {
  buildContinuousFrequencyTable,
  computeContinuousParams,
  formatNum,
} from '../../utils/representationStatistics';
import { FormulaBox } from '../FormulaBox';
import { CalculationSteps } from '../CalculationSteps';
import { ValueListInput } from '../ValueListInput';

const defaultValues = '12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40';

export function ContinuousFrequencyContent() {
  const [values, setValues] = useState([]);
  const [startValue, setStartValue] = useState('');

  const params = useMemo(() => computeContinuousParams(values), [values]);

  const startNum = startValue === '' ? params?.suggestedStart : Number(startValue);

  const table = useMemo(() => {
    if (!params || !Number.isFinite(startNum)) return null;
    return buildContinuousFrequencyTable(values, startNum, params.h, params.c);
  }, [values, params, startNum]);

  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        If data is given in raw form and is continuous, a frequency table can be formed using the
        steps below.
      </p>

      <FormulaBox label="Steps">
        <span>1. R = Xₘₐₓ − Xₘᵢₙ</span>
        <span className="mx-2">|</span>
        <span>2. c = 1 + 3.3 log(n)</span>
        <span className="mx-2">|</span>
        <span>3. h = R/c (round to whole number)</span>
        <span className="mx-2">|</span>
        <span>4. Choose starting value &lt; Xₘᵢₙ</span>
      </FormulaBox>

      <ValueListInput
        label="Enter raw data values"
        defaultValue={defaultValues}
        onValuesChange={setValues}
      />

      {params ? (
        <>
          <CalculationSteps
            steps={params.steps}
            result={`h = ${params.h}`}
            resultLabel="Width of class interval (rounded)"
          />

          <div className="rounded-lg border border-academic-200 bg-white p-4 shadow-sm">
            <label className="mb-2 block text-sm font-semibold text-blue-900">
              Starting value of class interval (must be &lt; Xₘᵢₙ = {formatNum(params.xMin)})
            </label>
            <input
              type="number"
              className="w-full max-w-xs rounded border border-academic-300 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              placeholder={String(params.suggestedStart)}
              value={startValue}
              onChange={(e) => setStartValue(e.target.value)}
            />
          </div>

          {table && (
            <>
              <div className="overflow-x-auto rounded-lg border border-academic-200">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-academic-700 text-white">
                      <th className="border border-academic-600 px-3 py-2.5">Class Intervals</th>
                      <th className="border border-academic-600 px-3 py-2.5">Class Boundaries</th>
                      <th className="border border-academic-600 px-3 py-2.5">Mid Value</th>
                      <th className="border border-academic-600 px-3 py-2.5">Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, i) => (
                      <tr key={row.classInterval} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                        <td className="border border-academic-200 px-3 py-2">{row.classInterval}</td>
                        <td className="border border-academic-200 px-3 py-2 text-center">
                          {row.classBoundaries}
                        </td>
                        <td className="border border-academic-200 px-3 py-2 text-center">
                          {formatNum(row.midValue, 2)}
                        </td>
                        <td className="border border-academic-200 px-3 py-2 text-center font-medium">
                          {row.frequency}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-academic-200 font-bold">
                      <td className="border border-academic-300 px-3 py-2.5" colSpan={3}>
                        Total
                      </td>
                      <td className="border border-academic-300 px-3 py-2.5 text-center">
                        {table.totalF}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      ) : (
        <p className="text-sm text-academic-500">Enter data values to form the frequency table.</p>
      )}

      <FormulaBox label="Reference layout">
        <div className="w-full text-left text-sm font-normal text-academic-700">
          <p>CLASS INTERVALS | Class boundaries | Mid value | Frequency</p>
        </div>
      </FormulaBox>
    </section>
  );
}
