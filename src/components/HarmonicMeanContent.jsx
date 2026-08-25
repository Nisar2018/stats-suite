import { useMemo, useState } from 'react';
import {
  computeHarmonicMeanFromFrequency,
  computeHarmonicMeanFromValues,
  createId,
} from '../utils/statistics';
import { buildFrequencyPairsChart, resultLine } from '../utils/chartHelpers';
import { FormulaBox, Fraction, FormulaLegend } from './FormulaBox';
import { ResultGraphPanel } from './ResultGraphPanel';
import { CalculationSteps } from './CalculationSteps';
import { ValueListInput } from './ValueListInput';
import { ValueFrequencyInput } from './ValueFrequencyInput';
import { formatNum } from '../utils/formatNumber';

const defaultValues = '2, 4, 8';

const defaultFrequencyPairs = [
  { id: createId(), value: 10, frequency: 2 },
  { id: createId(), value: 20, frequency: 3 },
  { id: createId(), value: 40, frequency: 5 },
];

export function HarmonicMeanContent({ topicId }) {
  const [ungroupedValues, setUngroupedValues] = useState([]);
  const [groupedPairs, setGroupedPairs] = useState(defaultFrequencyPairs);

  const ungroupedResult = useMemo(
    () => computeHarmonicMeanFromValues(ungroupedValues),
    [ungroupedValues],
  );

  const groupedResult = useMemo(
    () => computeHarmonicMeanFromFrequency(groupedPairs),
    [groupedPairs],
  );

  const chart = useMemo(() => {
    if (topicId === 'harm-mean-grouped' && groupedResult && !groupedResult.error) {
      return buildFrequencyPairsChart(groupedPairs, {
        title: 'f vs x',
        resultLines: [
          resultLine(
            groupedResult.harmonicMean,
            `H = ${formatNum(groupedResult.harmonicMean, 2)}`,
            '#7c3aed',
          ),
        ],
        resultSummary: `H = ${formatNum(groupedResult.harmonicMean, 4)}`,
      });
    }
    return null;
  }, [topicId, groupedResult, groupedPairs]);

  switch (topicId) {
    case 'harm-mean-ungrouped':
      return (
        <section className="space-y-6">
          <p className="text-academic-600">
            Enter positive data values. The harmonic mean is the number of values divided by the
            sum of their reciprocals.
          </p>
          <FormulaBox label="Formula">
            <span className="font-serif italic">H</span>
            <span>=</span>
            <Fraction
              numerator="n"
              denominator={
                <>
                  1/x<sub>1</sub> + 1/x<sub>2</sub> + 1/x<sub>3</sub> + … + 1/x<sub>n</sub>
                </>
              }
            />
          </FormulaBox>
          <ValueListInput
            label="Enter data values"
            defaultValue={defaultValues}
            placeholder="e.g. 2, 4, 8 (all positive)"
            onValuesChange={setUngroupedValues}
          />
          {ungroupedResult?.error ? (
            <p className="text-sm text-red-600">{ungroupedResult.error}</p>
          ) : ungroupedResult ? (
            <>
              <FormulaBox label="Substituted Values">
                <span className="font-serif italic">H</span>
                <span>=</span>
                <Fraction
                  numerator={ungroupedResult.n}
                  denominator={formatNum(ungroupedResult.sumReciprocals, 4)}
                />
                <span className="mx-2">=</span>
                <span>{formatNum(ungroupedResult.harmonicMean, 4)}</span>
              </FormulaBox>
              <CalculationSteps
                steps={ungroupedResult.steps}
                result={`H = ${formatNum(ungroupedResult.harmonicMean, 4)}`}
                resultLabel="Harmonic Mean"
              />
            </>
          ) : (
            <p className="text-sm text-academic-500">
              Enter at least one positive value to see calculations.
            </p>
          )}
          <FormulaLegend
            items={[
              { symbol: 'H', description: 'harmonic mean' },
              { symbol: 'n', description: 'total number of values' },
              { symbol: 'xᵢ', description: 'individual observation' },
            ]}
          />
        </section>
      );

    case 'harm-mean-grouped':
      return (
        <section className="space-y-6">
          <p className="text-academic-600">
            Enter each value with its frequency. The harmonic mean is the sum of frequencies
            divided by the sum of (frequency ÷ value) terms.
          </p>
          <FormulaBox label="Formula">
            <span className="font-serif italic">H</span>
            <span>=</span>
            <Fraction
              numerator="Σf"
              denominator={
                <>
                  f<sub>1</sub>/x<sub>1</sub> + f<sub>2</sub>/x<sub>2</sub> + f<sub>3</sub>/x<sub>3</sub> + …
                </>
              }
            />
          </FormulaBox>
          <ValueFrequencyInput
            pairs={groupedPairs}
            onChange={setGroupedPairs}
            derivedColumn="reciprocal"
          />
          {groupedResult?.error ? (
            <p className="text-sm text-red-600">{groupedResult.error}</p>
          ) : groupedResult ? (
            <>
              <FormulaBox label="Substituted Values">
                <span className="font-serif italic">H</span>
                <span>=</span>
                <Fraction
                  numerator={groupedResult.sumF}
                  denominator={formatNum(groupedResult.sumFOverX, 4)}
                />
                <span className="mx-2">=</span>
                <span>{formatNum(groupedResult.harmonicMean, 4)}</span>
              </FormulaBox>
              <CalculationSteps
                steps={groupedResult.steps}
                result={`H = ${formatNum(groupedResult.harmonicMean, 4)}`}
                resultLabel="Harmonic Mean"
              />
              <ResultGraphPanel chart={chart} />
            </>
          ) : (
            <p className="text-sm text-academic-500">
              Enter positive values and frequencies greater than 0 to calculate.
            </p>
          )}
          <FormulaLegend
            items={[
              { symbol: 'H', description: 'harmonic mean' },
              { symbol: 'fᵢ', description: 'frequency of value xᵢ' },
              { symbol: 'xᵢ', description: 'midpoint or class value' },
              { symbol: 'Σf', description: 'sum of all frequencies (n)' },
            ]}
          />
        </section>
      );

    default:
      return null;
  }
}
