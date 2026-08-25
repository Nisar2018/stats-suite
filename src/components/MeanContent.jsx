import { useMemo, useState } from 'react';
import {
  computeUngroupedMean,
  computeUngroupedMeanFromTable,
  computeGroupedMean,
  computeWeightedMean,
  createDefaultClassRows,
  createId,
} from '../utils/statistics';
import {
  buildGroupedChart,
  resultLine,
} from '../utils/chartHelpers';
import { FormulaBox, Fraction } from './FormulaBox';
import { ResultGraphPanel } from './ResultGraphPanel';
import { CalculationSteps } from './CalculationSteps';
import { ValueListInput } from './ValueListInput';
import { ValueFrequencyInput } from './ValueFrequencyInput';
import { EditableFrequencyTable } from './EditableFrequencyTable';
import { WeightedInput } from './WeightedInput';
import { formatNum } from '../utils/formatNumber';

const defaultValues = '12, 15, 18, 20, 22, 25';

const defaultFrequencyPairs = [
  { id: createId(), value: 10, frequency: 2 },
  { id: createId(), value: 15, frequency: 3 },
  { id: createId(), value: 20, frequency: 5 },
  { id: createId(), value: 25, frequency: 2 },
];

const defaultWeightedPairs = [
  { id: createId(), value: 80, weight: 3 },
  { id: createId(), value: 90, weight: 4 },
  { id: createId(), value: 70, weight: 2 },
];

export function MeanContent({ topicId }) {
  const [ungroupedValues, setUngroupedValues] = useState([]);
  const [frequencyPairs, setFrequencyPairs] = useState(defaultFrequencyPairs);
  const [classRows, setClassRows] = useState(createDefaultClassRows);
  const [weightedPairs, setWeightedPairs] = useState(defaultWeightedPairs);

  const ungroupedResult = useMemo(
    () => computeUngroupedMean(ungroupedValues),
    [ungroupedValues],
  );

  const ungroupedTableResult = useMemo(
    () => computeUngroupedMeanFromTable(frequencyPairs),
    [frequencyPairs],
  );

  const groupedResult = useMemo(
    () => computeGroupedMean(classRows),
    [classRows],
  );

  const weightedResult = useMemo(
    () => computeWeightedMean(weightedPairs),
    [weightedPairs],
  );

  const chart = useMemo(() => {
    switch (topicId) {
      case 'mean-grouped':
      case 'mean-frequency':
        return groupedResult
          ? buildGroupedChart(classRows, {
              title: 'f vs x (Grouped Data)',
              resultLines: [
                resultLine(groupedResult.mean, `Mean = ${formatNum(groupedResult.mean, 2)}`, '#dc2626'),
              ],
              resultSummary: `Mean = ${formatNum(groupedResult.mean, 2)}`,
            })
          : null;
      default:
        return null;
    }
  }, [topicId, groupedResult, classRows]);

  const content = (() => {
  switch (topicId) {    case 'mean-ungrouped':
      return (
        <section className="space-y-6">
          <p className="text-academic-600">
            Enter your data values as a simple list to calculate the arithmetic mean step by step.
          </p>
          <FormulaBox label="Formula">
            <span className="font-serif italic">X̄</span>
            <span>=</span>
            <Fraction numerator="Σx" denominator="n" />
          </FormulaBox>
          <ValueListInput
            label="Enter data values"
            defaultValue={defaultValues}
            onValuesChange={setUngroupedValues}
          />
          {ungroupedResult ? (
            <CalculationSteps
              steps={ungroupedResult.steps}
              result={`X̄ = ${formatNum(ungroupedResult.mean, 2)}`}
              resultLabel="Mean"
            />
          ) : (
            <p className="text-sm text-academic-500">Enter at least one valid number to see calculations.</p>
          )}
        </section>
      );

    case 'mean-ungrouped-table':
      return (
        <section className="space-y-6">
          <p className="text-academic-600">
            Enter each distinct value with its frequency in the table below. The mean is computed
            using the frequency distribution formula.
          </p>
          <FormulaBox label="Formula">
            <span>Mean</span>
            <span>=</span>
            <Fraction numerator="Σf · x" denominator="Σf" />
          </FormulaBox>
          <ValueFrequencyInput pairs={frequencyPairs} onChange={setFrequencyPairs} />
          {ungroupedTableResult ? (
            <>
              <FormulaBox label="Substituted Values">
                <span>Mean</span>
                <span>=</span>
                <Fraction
                  numerator={ungroupedTableResult.sumFx}
                  denominator={ungroupedTableResult.sumF}
                />
                <span className="mx-2">=</span>
                <span>{formatNum(ungroupedTableResult.mean, 2)}</span>
              </FormulaBox>
              <CalculationSteps
                steps={ungroupedTableResult.steps}
                result={`Mean = ${formatNum(ungroupedTableResult.mean, 2)}`}
                resultLabel="Mean"
              />
            </>
          ) : (
            <p className="text-sm text-academic-500">Enter values and frequencies greater than 0 to calculate.</p>
          )}
        </section>
      );

    case 'mean-grouped':
      return (
        <section className="space-y-6">
          <p className="text-academic-600">
            Enter class intervals and frequencies. Midpoints are computed automatically.
          </p>
          <FormulaBox label="Formula">
            <span className="font-serif italic">X̄</span>
            <span>=</span>
            <Fraction numerator="Σf · x" denominator="Σf" />
          </FormulaBox>
          <EditableFrequencyTable
            rows={classRows}
            onChange={setClassRows}
            compact
            showMidPoint
            showProduct
          />
          {groupedResult ? (
            <>
              <FormulaBox label="Computed Result">
                <span className="font-serif italic">X̄</span>
                <span>=</span>
                <Fraction numerator={groupedResult.totalFx} denominator={groupedResult.totalF} />
                <span className="mx-2">=</span>
                <span>{formatNum(groupedResult.mean, 2)}</span>
              </FormulaBox>
              <CalculationSteps
                steps={groupedResult.steps}
                result={`X̄ = ${formatNum(groupedResult.mean, 2)}`}
                resultLabel="Mean"
              />
              <ResultGraphPanel chart={chart} />
            </>
          ) : (
            <p className="text-sm text-academic-500">Enter frequencies greater than 0 to calculate.</p>
          )}
        </section>
      );

    case 'mean-frequency':
      return (
        <section className="space-y-6">
          <p className="text-academic-600">
            Edit the frequency table below. Fᵢ × Xᵢ and totals update automatically.
          </p>
          <FormulaBox label="Formula">
            <span className="font-serif italic">X̄</span>
            <span>=</span>
            <Fraction numerator="Σf · x" denominator="Σf" />
          </FormulaBox>
          <EditableFrequencyTable
            rows={classRows}
            onChange={setClassRows}
            showMidPoint
            showProduct
            showBoundaries
          />
          {groupedResult ? (
            <>
              <FormulaBox label="Substituted Values">
                <span className="font-serif italic">X̄</span>
                <span>=</span>
                <Fraction numerator={groupedResult.totalFx} denominator={groupedResult.totalF} />
                <span className="mx-2">=</span>
                <span>{formatNum(groupedResult.mean, 2)}</span>
              </FormulaBox>
              <CalculationSteps
                steps={groupedResult.steps}
                result={`X̄ = ${formatNum(groupedResult.mean, 2)}`}
                resultLabel="Mean"
              />
              <ResultGraphPanel chart={chart} />
            </>
          ) : (
            <p className="text-sm text-academic-500">Enter frequencies greater than 0 to calculate.</p>
          )}
        </section>
      );

    case 'mean-weighted':
      return (
        <section className="space-y-6">
          <p className="text-academic-600">
            Enter each value with its corresponding weight to compute the weighted mean.
          </p>
          <FormulaBox label="Formula">
            <span className="font-serif italic">X̄</span>
            <span>=</span>
            <Fraction numerator="Σw · x" denominator="Σw" />
          </FormulaBox>
          <WeightedInput pairs={weightedPairs} onChange={setWeightedPairs} />
          {weightedResult ? (
            <CalculationSteps
              steps={weightedResult.steps}
              result={`X̄ = ${formatNum(weightedResult.mean, 2)}`}
              resultLabel="Weighted Mean"
            />
          ) : (
            <p className="text-sm text-academic-500">Enter values and weights to calculate.</p>
          )}
        </section>
      );

    default:
      return null;
  }
  })();

  return content;
}