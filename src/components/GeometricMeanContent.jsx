import { useMemo, useState } from 'react';
import {
  computeUngroupedGeometricMean,
  computeGroupedGeometricMean,
  createDefaultClassRows,
} from '../utils/statistics';
import { buildGroupedChart, resultLine } from '../utils/chartHelpers';
import { FormulaBox, NthRoot, FormulaLegend } from './FormulaBox';
import { ResultGraphPanel } from './ResultGraphPanel';
import { CalculationSteps } from './CalculationSteps';
import { ValueListInput } from './ValueListInput';
import { EditableFrequencyTable } from './EditableFrequencyTable';
import { formatNum } from '../utils/formatNumber';

const defaultValues = '2, 4, 8, 16';

export function GeometricMeanContent({ topicId }) {
  const [ungroupedValues, setUngroupedValues] = useState([]);
  const [classRows, setClassRows] = useState(createDefaultClassRows);

  const ungroupedResult = useMemo(
    () => computeUngroupedGeometricMean(ungroupedValues),
    [ungroupedValues],
  );

  const groupedResult = useMemo(
    () => computeGroupedGeometricMean(classRows),
    [classRows],
  );

  const chart = useMemo(() => {
    if (topicId === 'geom-mean-grouped' && groupedResult && !groupedResult.error) {
      return buildGroupedChart(classRows, {
        title: 'f vs x (Grouped Data)',
        resultLines: [
          resultLine(
            groupedResult.geometricMean,
            `G = ${formatNum(groupedResult.geometricMean, 2)}`,
            '#059669',
          ),
        ],
        resultSummary: `G = ${formatNum(groupedResult.geometricMean, 4)}`,
      });
    }
    return null;
  }, [topicId, groupedResult, classRows]);

  switch (topicId) {
    case 'geom-mean-ungrouped':
      return (
        <section className="space-y-6">
          <p className="text-academic-600">
            Enter positive data values to calculate the geometric mean — the n
            <sup>th</sup> root of the product of all observations.
          </p>
          <FormulaBox label="Formula">
            <span className="font-serif italic">G</span>
            <span>=</span>
            <NthRoot n="n">
              x<sub>1</sub> × x<sub>2</sub> × x<sub>3</sub> × … × x<sub>n</sub>
            </NthRoot>
          </FormulaBox>
          <ValueListInput
            label="Enter data values"
            defaultValue={defaultValues}
            placeholder="e.g. 2, 4, 8, 16 (all positive)"
            onValuesChange={setUngroupedValues}
          />
          {ungroupedResult?.error ? (
            <p className="text-sm text-red-600">{ungroupedResult.error}</p>
          ) : ungroupedResult ? (
            <CalculationSteps
              steps={ungroupedResult.steps}
              result={`G = ${formatNum(ungroupedResult.geometricMean, 4)}`}
              resultLabel="Geometric Mean"
            />
          ) : (
            <p className="text-sm text-academic-500">
              Enter at least one positive value to see calculations.
            </p>
          )}
          <FormulaLegend
            items={[
              { symbol: 'G', description: 'geometric mean' },
              { symbol: 'n', description: 'total number of values' },
              { symbol: 'xᵢ', description: 'individual observation' },
            ]}
          />
        </section>
      );

    case 'geom-mean-grouped':
      return (
        <section className="space-y-6">
          <p className="text-academic-600">
            Enter class intervals and frequencies. Midpoints are used as x values and the
            geometric mean is the n<sup>th</sup> root of the product of x<sup>f</sup> terms.
          </p>
          <FormulaBox label="Formula">
            <span className="font-serif italic">G</span>
            <span>=</span>
            <NthRoot n="n">
              <span>
                x<sub>1</sub>
                <sup>f<sub>1</sub></sup>
              </span>
              <span> × </span>
              <span>
                x<sub>2</sub>
                <sup>f<sub>2</sub></sup>
              </span>
              <span> × </span>
              <span>
                x<sub>3</sub>
                <sup>f<sub>3</sub></sup>
              </span>
              <span> × …</span>
            </NthRoot>
          </FormulaBox>
          <EditableFrequencyTable
            rows={classRows}
            onChange={setClassRows}
            compact
            showMidPoint
            showProduct
            productType="power"
          />
          {groupedResult?.error ? (
            <p className="text-sm text-red-600">{groupedResult.error}</p>
          ) : groupedResult ? (
            <>
              <FormulaBox label="Computed Result">
                <span className="font-serif italic">G</span>
                <span>=</span>
                <NthRoot n={groupedResult.n}>
                  <span>{groupedResult.items.map((item) => `${item.x}^${item.f}`).join(' × ')}</span>
                </NthRoot>
                <span className="mx-2">=</span>
                <span>{formatNum(groupedResult.geometricMean, 4)}</span>
              </FormulaBox>
              <CalculationSteps
                steps={groupedResult.steps}
                result={`G = ${formatNum(groupedResult.geometricMean, 4)}`}
                resultLabel="Geometric Mean"
              />
              <ResultGraphPanel chart={chart} />
            </>
          ) : (
            <p className="text-sm text-academic-500">
              Enter frequencies greater than 0 to calculate.
            </p>
          )}
          <FormulaLegend
            items={[
              { symbol: 'G', description: 'geometric mean' },
              { symbol: 'n', description: 'sum of frequencies (Σf)' },
              { symbol: 'xᵢ', description: 'midpoint of class interval' },
              { symbol: 'fᵢ', description: 'frequency of the corresponding class' },
            ]}
          />
        </section>
      );

    default:
      return null;
  }
}
