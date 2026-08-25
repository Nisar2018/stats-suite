import { useMemo, useState } from 'react';
import { computeUngroupedQuartiles, computeGroupedQuartiles } from '../utils/positionStatistics';
import { createDefaultClassRows } from '../utils/statistics';
import { buildGroupedChart, resultLine } from '../utils/chartHelpers';
import { FormulaBox, Fraction, FormulaLegend } from './FormulaBox';
import { ResultGraphPanel } from './ResultGraphPanel';
import { CalculationSteps } from './CalculationSteps';
import { ValueListInput } from './ValueListInput';
import { EditableFrequencyTable } from './EditableFrequencyTable';
import { formatNum } from '../utils/formatNumber';

const defaultValues = '8, 12, 15, 18, 20, 22, 25, 28, 30, 35';

export function QuartileContent({ topicId }) {
  const [values, setValues] = useState([]);
  const [classRows, setClassRows] = useState(createDefaultClassRows);

  const ungroupedResult = useMemo(() => computeUngroupedQuartiles(values), [values]);
  const groupedResult = useMemo(() => computeGroupedQuartiles(classRows), [classRows]);

  const chart = useMemo(() => {
    if (topicId === 'quartile-grouped' && groupedResult) {
      return buildGroupedChart(classRows, {
        title: 'f vs x (Grouped Data)',
        resultLines: [
          resultLine(groupedResult.q1, `Q₁ = ${formatNum(groupedResult.q1, 1)}`, '#2563eb'),
          resultLine(groupedResult.q2, `Q₂ = ${formatNum(groupedResult.q2, 1)}`, '#059669'),
          resultLine(groupedResult.q3, `Q₃ = ${formatNum(groupedResult.q3, 1)}`, '#d97706'),
        ],
        resultSummary: `Q₁ = ${formatNum(groupedResult.q1, 2)}, Q₂ = ${formatNum(groupedResult.q2, 2)}, Q₃ = ${formatNum(groupedResult.q3, 2)}`,
      });
    }
    return null;
  }, [topicId, groupedResult, classRows]);

  switch (topicId) {
    case 'quartile-ungrouped':
      return (
        <section className="space-y-6">
          <p className="text-academic-600">
            Arrange data in ascending order. Q₁ and Q₃ use k(n+1)/4; Q₂ = Q₃ − Q₁.
          </p>
          <FormulaBox label="Formulas">
            <span>Q₁</span>
            <span>=</span>
            <span>k(n+1)/4</span>
            <span className="mx-2 text-sm text-academic-500">(k=1)</span>
            <span className="mx-2">|</span>
            <span>Q₃</span>
            <span>=</span>
            <span>k(n+1)/4</span>
            <span className="mx-2 text-sm text-academic-500">(k=3)</span>
            <span className="mx-2">|</span>
            <span>Q₂</span>
            <span>=</span>
            <span>Q₃ − Q₁</span>
          </FormulaBox>
          <ValueListInput
            label="Enter data values"
            defaultValue={defaultValues}
            onValuesChange={setValues}
          />
          {ungroupedResult ? (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Q₁ (First Quartile)', value: ungroupedResult.q1 },
                  { label: 'Q₂ (Second Quartile)', value: ungroupedResult.q2 },
                  { label: 'Q₃ (Third Quartile)', value: ungroupedResult.q3 },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-center"
                  >
                    <p className="text-xs font-medium text-blue-700">{item.label}</p>
                    <p className="mt-1 text-2xl font-bold text-blue-900">{formatNum(item.value, 2)}</p>
                  </div>
                ))}
              </div>
              <CalculationSteps
                steps={ungroupedResult.steps}
                result={`Q₁ = ${formatNum(ungroupedResult.q1, 2)}, Q₂ = ${formatNum(ungroupedResult.q2, 2)}, Q₃ = ${formatNum(ungroupedResult.q3, 2)}`}
                resultLabel="Quartiles"
              />
            </>
          ) : (
            <p className="text-sm text-academic-500">Enter values to calculate quartiles.</p>
          )}
          <FormulaLegend
            items={[
              { symbol: 'n', description: 'total number of values' },
              { symbol: 'k', description: 'quartile number (1 for Q₁, 3 for Q₃)' },
            ]}
          />
        </section>
      );

    case 'quartile-grouped':
      return (
        <section className="space-y-6">
          <p className="text-academic-600">
            Use the frequency table (as for median). Q₁, Q₂, and Q₃ are computed from n/4, n/2,
            and 3n/4 respectively.
          </p>
          <FormulaBox label="Formulas">
            <span>Q₁</span>
            <span>=</span>
            <span className="font-mono">l</span>
            <span>+</span>
            <Fraction numerator={<>n/4 − c</>} denominator="f" />
            <span>× h</span>
            <span className="mx-2">|</span>
            <span>Q₂</span>
            <span>=</span>
            <span className="font-mono">l</span>
            <span>+</span>
            <Fraction numerator={<>n/2 − c</>} denominator="f" />
            <span>× h</span>
            <span className="mx-2">|</span>
            <span>Q₃</span>
            <span>=</span>
            <span className="font-mono">l</span>
            <span>+</span>
            <Fraction numerator={<>3n/4 − c</>} denominator="f" />
            <span>× h</span>
          </FormulaBox>
          <EditableFrequencyTable
            rows={classRows}
            onChange={setClassRows}
            showBoundaries
            showCumulative
          />
          {groupedResult ? (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Q₁', value: groupedResult.q1 },
                  { label: 'Q₂', value: groupedResult.q2 },
                  { label: 'Q₃', value: groupedResult.q3 },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-center"
                  >
                    <p className="text-xs font-medium text-blue-700">{item.label}</p>
                    <p className="mt-1 text-2xl font-bold text-blue-900">{formatNum(item.value, 2)}</p>
                  </div>
                ))}
              </div>
              <CalculationSteps
                steps={groupedResult.steps}
                result={`Q₁ = ${formatNum(groupedResult.q1, 2)}, Q₂ = ${formatNum(groupedResult.q2, 2)}, Q₃ = ${formatNum(groupedResult.q3, 2)}`}
                resultLabel="Quartiles"
              />
              <ResultGraphPanel chart={chart} />
            </>
          ) : (
            <p className="text-sm text-academic-500">Enter frequencies greater than 0 to calculate.</p>
          )}
          <FormulaLegend
            items={[
              { symbol: 'l', description: 'lower class boundary of quartile class' },
              { symbol: 'h', description: 'class interval size of quartile class' },
              { symbol: 'f', description: 'frequency of quartile class' },
              { symbol: 'n', description: 'total frequency' },
              { symbol: 'c', description: 'cumulative frequency of class preceding the quartile class' },
            ]}
          />
        </section>
      );

    default:
      return null;
  }
}
