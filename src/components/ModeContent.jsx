import { useMemo, useState } from 'react';
import {
  computeUngroupedMode,
  computeGroupedMode,
  createDefaultClassRows,
} from '../utils/statistics';
import { buildGroupedChart, resultLine } from '../utils/chartHelpers';
import { FormulaBox, Fraction, FormulaLegend } from './FormulaBox';
import { ResultGraphPanel } from './ResultGraphPanel';
import { CalculationSteps } from './CalculationSteps';
import { ValueListInput } from './ValueListInput';
import { EditableFrequencyTable } from './EditableFrequencyTable';
import { formatNum } from '../utils/formatNumber';

const defaultValues = '3, 5, 5, 7, 8, 5, 9';

export function ModeContent({ topicId }) {
  const [values, setValues] = useState([]);
  const [classRows, setClassRows] = useState(createDefaultClassRows);

  const ungroupedResult = useMemo(() => computeUngroupedMode(values), [values]);
  const groupedResult = useMemo(() => computeGroupedMode(classRows), [classRows]);

  const chart = useMemo(() => {
    if (topicId === 'mode-frequency' && groupedResult) {
      return buildGroupedChart(classRows, {
        title: 'f vs x (Grouped Data)',
        resultLines: [
          resultLine(groupedResult.mode, `Mode = ${formatNum(groupedResult.mode, 2)}`, '#d97706'),
        ],
        resultSummary: `Mode = ${formatNum(groupedResult.mode, 2)}`,
      });
    }
    return null;
  }, [topicId, groupedResult, classRows]);

  switch (topicId) {
    case 'mode-ungrouped':
      return (        <section className="space-y-6">
          <div className="rounded-lg border border-academic-200 bg-white p-6 shadow-sm">
            <p className="text-lg leading-relaxed text-academic-700">
              The most frequently occurring value in the data is called the{' '}
              <strong className="text-academic-800">mode</strong> of ungrouped data.
            </p>
          </div>
          <ValueListInput
            label="Enter data values"
            defaultValue={defaultValues}
            onValuesChange={setValues}
          />
          {ungroupedResult ? (
            <>
              <div className="overflow-x-auto rounded-lg border border-academic-200">
                <table className="w-full min-w-[200px] border-collapse text-sm">
                  <thead>
                    <tr className="bg-academic-700 text-white">
                      <th className="border border-academic-600 px-4 py-2.5">Value</th>
                      <th className="border border-academic-600 px-4 py-2.5 text-center">Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ungroupedResult.frequencies.map((f, i) => (
                      <tr
                        key={f.value}
                        className={`${f.count === Math.max(...ungroupedResult.frequencies.map((x) => x.count)) ? 'bg-highlight font-semibold ring-2 ring-inset ring-highlight-border' : i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}`}
                      >
                        <td className="border border-academic-200 px-4 py-2">{f.value}</td>
                        <td className="border border-academic-200 px-4 py-2 text-center">{f.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <CalculationSteps
                steps={ungroupedResult.steps}
                result={
                  ungroupedResult.modes.length === 1
                    ? `Mode = ${ungroupedResult.modes[0]}`
                    : `Modes = { ${ungroupedResult.modes.join(', ')} }`
                }
                resultLabel="Mode"
              />
            </>
          ) : (
            <p className="text-sm text-academic-500">Enter values to find the mode.</p>
          )}
        </section>
      );

    case 'mode-frequency':
      return (
        <section className="space-y-6">
          <p className="text-academic-600">
            Edit class limits and frequencies. Gaps (e.g. 20–30 then 31–40) are detected
            automatically — true boundaries and h are computed for the mode formula.
          </p>
          <FormulaBox label="Formula">
            <span>Mode</span>
            <span>=</span>
            <span className="font-mono">l</span>
            <span>+</span>
            <span className="inline-flex items-center">
              <Fraction
                numerator={
                  <>
                    <span className="font-mono">f</span>
                    <sub className="text-sm">m</sub> − <span className="font-mono">f</span>
                    <sub className="text-sm">1</sub>
                  </>
                }
                denominator={
                  <>
                    <span className="font-mono">2f</span>
                    <sub className="text-sm">m</sub> − <span className="font-mono">f</span>
                    <sub className="text-sm">1</sub> − <span className="font-mono">f</span>
                    <sub className="text-sm">2</sub>
                  </>
                }
              />
            </span>
            <span>×</span>
            <span className="font-mono">h</span>
          </FormulaBox>
          <EditableFrequencyTable
            rows={classRows}
            onChange={setClassRows}
            showBoundaries
            highlightRowIndex={groupedResult?.modalIndex}
            highlightLabel="Modal class (highest frequency)"
          />
          {groupedResult ? (
            <>
              <FormulaBox label="Substituted Values">
                <span>Mode</span>
                <span>=</span>
                <span>{groupedResult.l}</span>
                <span>+</span>
                <Fraction
                  numerator={groupedResult.fm - groupedResult.f1}
                  denominator={2 * groupedResult.fm - groupedResult.f1 - groupedResult.f2}
                />
                <span>×</span>
                <span>{groupedResult.h}</span>
                <span className="mx-2">=</span>
                <span>{formatNum(groupedResult.mode, 2)}</span>
              </FormulaBox>
              <CalculationSteps
                steps={groupedResult.steps}
                result={`Mode = ${formatNum(groupedResult.mode, 2)}`}
                resultLabel="Mode"
              />
              <ResultGraphPanel chart={chart} />
            </>
          ) : (
            <p className="text-sm text-academic-500">Enter frequencies greater than 0 to calculate.</p>
          )}
          <FormulaLegend
            items={[
              { symbol: 'l', description: 'lower class boundary of modal class' },
              { symbol: 'fₘ', description: 'frequency of modal class' },
              { symbol: 'f₁', description: 'frequency of class preceding the modal class' },
              { symbol: 'f₂', description: 'frequency of class following the modal class' },
              { symbol: 'h', description: 'class interval of modal class' },
            ]}
          />
        </section>
      );

    default:
      return null;
  }
}