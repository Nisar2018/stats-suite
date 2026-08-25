import { useMemo, useState } from 'react';
import { computeUngroupedPercentile, computeGroupedPercentile } from '../utils/positionStatistics';
import { createDefaultClassRows } from '../utils/statistics';
import { buildGroupedChart, resultLine } from '../utils/chartHelpers';
import { FormulaBox, Fraction, FormulaLegend } from './FormulaBox';
import { ResultGraphPanel } from './ResultGraphPanel';
import { CalculationSteps } from './CalculationSteps';
import { ValueListInput } from './ValueListInput';
import { EditableFrequencyTable } from './EditableFrequencyTable';
import { OrderSelector } from './OrderSelector';
import { formatNum } from '../utils/formatNumber';

const defaultValues = '8, 12, 15, 18, 20, 22, 25, 28, 30, 35';

export function PercentileContent({ topicId }) {
  const [values, setValues] = useState([]);
  const [classRows, setClassRows] = useState(createDefaultClassRows);
  const [orderM, setOrderM] = useState(50);

  const ungroupedResult = useMemo(
    () => computeUngroupedPercentile(values, orderM),
    [values, orderM],
  );

  const groupedResult = useMemo(
    () => computeGroupedPercentile(classRows, orderM),
    [classRows, orderM],
  );

  const chart = useMemo(() => {
    if (topicId === 'percentile-frequency' && groupedResult) {
      return buildGroupedChart(classRows, {
        title: 'f vs x (Grouped Data)',
        resultLines: [
          resultLine(
            groupedResult.percentile,
            `P${orderM} = ${formatNum(groupedResult.percentile, 2)}`,
            '#0891b2',
          ),
        ],
        resultSummary: `P${orderM} = ${formatNum(groupedResult.percentile, 2)}`,
      });
    }
    return null;
  }, [topicId, groupedResult, classRows, orderM]);

  switch (topicId) {
    case 'percentile-ungrouped':
      return (
        <section className="space-y-6">
          <p className="text-academic-600">
            P = (m×n)/100 th value. If fractional, round off; if integer, average with the next
            value.
          </p>
          <FormulaBox label="Formula">
            <span>P</span>
            <span>=</span>
            <span>(m × n) / 100</span>
            <span className="text-sm text-academic-500">th value</span>
          </FormulaBox>
          <OrderSelector
            label="Order of percentile (m)"
            value={orderM}
            onChange={setOrderM}
            min={1}
            max={99}
            hint="Enter m from 1 to 99 (e.g. m = 50 for the 50th percentile P₅₀)"
          />
          <ValueListInput
            label="Enter data values"
            defaultValue={defaultValues}
            onValuesChange={setValues}
          />
          {ungroupedResult ? (
            <CalculationSteps
              steps={ungroupedResult.steps}
              result={`P${orderM} = ${formatNum(ungroupedResult.percentile, 2)}`}
              resultLabel={`${orderM}th Percentile`}
            />
          ) : (
            <p className="text-sm text-academic-500">Enter values to calculate the percentile.</p>
          )}
          <FormulaLegend
            items={[
              { symbol: 'm', description: 'order of percentile (1 to 99)' },
              { symbol: 'n', description: 'total number of values' },
            ]}
          />
        </section>
      );

    case 'percentile-frequency':
      return (
        <section className="space-y-6">
          <p className="text-academic-600">
            (m×n)/100 locates the percentile class in the frequency table.
          </p>
          <OrderSelector
            label="Order of percentile (m)"
            value={orderM}
            onChange={setOrderM}
            min={1}
            max={99}
            hint="Enter m from 1 to 99"
          />
          <FormulaBox label="Formula">
            <span>P</span>
            <sub className="text-sm">m</sub>
            <span>=</span>
            <span className="font-mono">l</span>
            <span>+</span>
            <Fraction
              numerator={
                <>
                  (m×n)/100 − <span className="font-mono">c</span>
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
            highlightRowIndex={groupedResult?.classIndex}
            highlightLabel="Percentile class"
          />
          {groupedResult ? (
            <>
              <FormulaBox label="Substituted Values">
                <span>P</span>
                <sub className="text-sm">{orderM}</sub>
                <span>=</span>
                <span>{formatNum(groupedResult.l, 2)}</span>
                <span>+</span>
                <Fraction
                  numerator={`${formatNum(groupedResult.target, 2)} − ${groupedResult.c}`}
                  denominator={groupedResult.f}
                />
                <span>×</span>
                <span>{formatNum(groupedResult.h, 2)}</span>
                <span className="mx-2">=</span>
                <span>{formatNum(groupedResult.percentile, 2)}</span>
              </FormulaBox>
              <CalculationSteps
                steps={groupedResult.steps}
                result={`P${orderM} = ${formatNum(groupedResult.percentile, 2)}`}
                resultLabel={`${orderM}th Percentile`}
              />
              <ResultGraphPanel chart={chart} />
            </>
          ) : (
            <p className="text-sm text-academic-500">Enter frequencies greater than 0 to calculate.</p>
          )}
          <FormulaLegend
            items={[
              { symbol: 'l', description: 'lower class boundary of percentile class' },
              { symbol: 'h', description: 'class interval size' },
              { symbol: 'f', description: 'frequency of percentile class' },
              { symbol: 'n', description: 'total frequency' },
              { symbol: 'c', description: 'cumulative frequency of class preceding the percentile class' },
              { symbol: 'm', description: 'order of percentile (1 to 99)' },
            ]}
          />
        </section>
      );

    default:
      return null;
  }
}
