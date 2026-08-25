import { useMemo, useState } from 'react';
import { computeUngroupedDecile, computeGroupedDecile } from '../utils/positionStatistics';
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

export function DecileContent({ topicId }) {
  const [values, setValues] = useState([]);
  const [classRows, setClassRows] = useState(createDefaultClassRows);
  const [orderM, setOrderM] = useState(5);

  const ungroupedResult = useMemo(
    () => computeUngroupedDecile(values, orderM),
    [values, orderM],
  );

  const groupedResult = useMemo(
    () => computeGroupedDecile(classRows, orderM),
    [classRows, orderM],
  );

  const chart = useMemo(() => {
    if (topicId === 'decile-frequency' && groupedResult) {
      return buildGroupedChart(classRows, {
        title: 'f vs x (Grouped Data)',
        resultLines: [
          resultLine(
            groupedResult.decile,
            `D${orderM} = ${formatNum(groupedResult.decile, 2)}`,
            '#7c3aed',
          ),
        ],
        resultSummary: `D${orderM} = ${formatNum(groupedResult.decile, 2)}`,
      });
    }
    return null;
  }, [topicId, groupedResult, classRows, orderM]);

  switch (topicId) {
    case 'decile-ungrouped':
      return (
        <section className="space-y-6">
          <p className="text-academic-600">
            D = (m×n)/10 th value. If fractional, round off; if integer, average with the next
            value.
          </p>
          <FormulaBox label="Formula">
            <span>D</span>
            <span>=</span>
            <span>(m × n) / 10</span>
            <span className="text-sm text-academic-500">th value</span>
          </FormulaBox>
          <OrderSelector
            label="Order of decile (m)"
            value={orderM}
            onChange={setOrderM}
            min={1}
            max={9}
            hint="Enter m from 1 to 9 (e.g. m = 5 for the 5th decile D₅)"
          />
          <ValueListInput
            label="Enter data values"
            defaultValue={defaultValues}
            onValuesChange={setValues}
          />
          {ungroupedResult ? (
            <CalculationSteps
              steps={ungroupedResult.steps}
              result={`D${orderM} = ${formatNum(ungroupedResult.decile, 2)}`}
              resultLabel={`${orderM}${orderM === 1 ? 'st' : orderM === 2 ? 'nd' : orderM === 3 ? 'rd' : 'th'} Decile`}
            />
          ) : (
            <p className="text-sm text-academic-500">Enter values to calculate the decile.</p>
          )}
          <FormulaLegend
            items={[
              { symbol: 'm', description: 'order of decile (1 to 9)' },
              { symbol: 'n', description: 'total number of values' },
            ]}
          />
        </section>
      );

    case 'decile-frequency':
      return (
        <section className="space-y-6">
          <p className="text-academic-600">
            (m×n)/10 locates the decile class. Use the same frequency table format as for median.
          </p>
          <OrderSelector
            label="Order of decile (m)"
            value={orderM}
            onChange={setOrderM}
            min={1}
            max={9}
            hint="Enter m from 1 to 9"
          />
          <FormulaBox label="Formula">
            <span>D</span>
            <sub className="text-sm">m</sub>
            <span>=</span>
            <span className="font-mono">l</span>
            <span>+</span>
            <Fraction
              numerator={
                <>
                  (m×n)/10 − <span className="font-mono">c</span>
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
            highlightLabel="Decile class"
          />
          {groupedResult ? (
            <>
              <FormulaBox label="Substituted Values">
                <span>D</span>
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
                <span>{formatNum(groupedResult.decile, 2)}</span>
              </FormulaBox>
              <CalculationSteps
                steps={groupedResult.steps}
                result={`D${orderM} = ${formatNum(groupedResult.decile, 2)}`}
                resultLabel={`${orderM}${orderM === 1 ? 'st' : orderM === 2 ? 'nd' : orderM === 3 ? 'rd' : 'th'} Decile`}
              />
              <ResultGraphPanel chart={chart} />
            </>
          ) : (
            <p className="text-sm text-academic-500">Enter frequencies greater than 0 to calculate.</p>
          )}
          <FormulaLegend
            items={[
              { symbol: 'l', description: 'lower class boundary of decile class' },
              { symbol: 'h', description: 'class interval size' },
              { symbol: 'f', description: 'frequency of decile class' },
              { symbol: 'n', description: 'total frequency' },
              { symbol: 'c', description: 'cumulative frequency of class preceding the decile class' },
              { symbol: 'm', description: 'order of decile (1 to 9)' },
            ]}
          />
        </section>
      );

    default:
      return null;
  }
}
