import { useMemo, useState } from 'react';
import {
  computeUngroupedMedian,
  computeGroupedMedian,
  createDefaultClassRows,
} from '../utils/statistics';
import { buildGroupedChart, resultLine } from '../utils/chartHelpers';
import { FormulaBox, Fraction, FormulaLegend } from './FormulaBox';
import { ResultGraphPanel } from './ResultGraphPanel';
import { CalculationSteps } from './CalculationSteps';
import { ValueListInput } from './ValueListInput';
import { EditableFrequencyTable } from './EditableFrequencyTable';
import { formatNum } from '../utils/formatNumber';

const defaultValues = '12, 15, 18, 20, 22, 25, 28';

export function MedianContent({ topicId }) {
  const [values, setValues] = useState([]);
  const [classRows, setClassRows] = useState(createDefaultClassRows);

  const ungroupedResult = useMemo(() => computeUngroupedMedian(values), [values]);
  const groupedResult = useMemo(() => computeGroupedMedian(classRows), [classRows]);

  const chart = useMemo(() => {
    if (topicId === 'median-frequency' && groupedResult) {
      return buildGroupedChart(classRows, {
        title: 'f vs x (Grouped Data)',
        resultLines: [
          resultLine(
            groupedResult.median,
            `Median = ${formatNum(groupedResult.median, 2)}`,
            '#dc2626',
          ),
        ],
        resultSummary: `Median = ${formatNum(groupedResult.median, 2)}`,
      });
    }
    return null;
  }, [topicId, groupedResult, classRows]);

  switch (topicId) {
    case 'median-ungrouped':
      return (
        <section className="space-y-6">
          <div className="rounded-lg border border-academic-200 bg-white p-6 shadow-sm">
            <p className="text-lg leading-relaxed text-academic-700">
              Arrange the data in ascending or descending order and find the exact middle value.
            </p>
          </div>
          <ValueListInput
            label="Enter data values"
            defaultValue={defaultValues}
            onValuesChange={setValues}
          />
          {ungroupedResult ? (
            <CalculationSteps
              steps={ungroupedResult.steps}
              result={`Median = ${formatNum(ungroupedResult.median, 2)}`}
              resultLabel="Median"
            />
          ) : (
            <p className="text-sm text-academic-500">Enter values to calculate the median.</p>
          )}
        </section>
      );

    case 'median-frequency':
      return (
        <section className="space-y-6">
          <p className="text-academic-600">
            Edit class limits and frequencies. Gaps between classes are handled automatically
            when computing lower boundary (l) and class width (h).
          </p>
          <FormulaBox label="Formula">
            <span>Median</span>
            <span>=</span>
            <span className="font-mono">l</span>
            <span>+</span>
            <Fraction
              numerator={
                <>
                  <span className="font-mono">n</span>/2 − <span className="font-mono">c</span>
                </>
              }
              denominator={<span className="font-mono">f</span>}
            />
            <span>×</span>
            <span className="font-mono">h</span>
          </FormulaBox>
          <EditableFrequencyTable
            rows={classRows}
            onChange={setClassRows}
            showBoundaries
            showCumulative
            highlightRowIndex={groupedResult?.medianIndex}
            highlightLabel="Median class"
          />
          {groupedResult ? (
            <>
              <FormulaBox label="Substituted Values">
                <span>Median</span>
                <span>=</span>
                <span>{groupedResult.l}</span>
                <span>+</span>
                <Fraction
                  numerator={`${groupedResult.n / 2} − ${groupedResult.c}`}
                  denominator={groupedResult.f}
                />
                <span>×</span>
                <span>{groupedResult.h}</span>
                <span className="mx-2">=</span>
                <span>{formatNum(groupedResult.median, 2)}</span>
              </FormulaBox>
              <CalculationSteps
                steps={groupedResult.steps}
                result={`Median = ${formatNum(groupedResult.median, 2)}`}
                resultLabel="Median"
              />
              <ResultGraphPanel chart={chart} />
            </>
          ) : (
            <p className="text-sm text-academic-500">Enter frequencies greater than 0 to calculate.</p>
          )}
          <FormulaLegend
            items={[
              { symbol: 'l', description: 'lower class boundary of median class' },
              { symbol: 'h', description: 'class interval size' },
              { symbol: 'f', description: 'frequency of median class' },
              { symbol: 'n', description: 'total frequency' },
              { symbol: 'c', description: 'cumulative frequency of class preceding the median class' },
            ]}
          />
        </section>
      );

    default:
      return null;
  }
}
