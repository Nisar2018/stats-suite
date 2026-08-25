import { useMemo, useState } from 'react';
import {
  computeUngroupedRange,
  computeGroupedRange,
} from '../../utils/dispersionStatistics';
import { createDefaultClassRows } from '../../utils/statistics';
import { formatNum } from '../../utils/formatNumber';
import { FormulaBox } from '../FormulaBox';
import { CalculationSteps } from '../CalculationSteps';
import { ValueListInput } from '../ValueListInput';
import { EditableFrequencyTable } from '../EditableFrequencyTable';

const defaultValues = '12, 18, 25, 30, 35, 40, 48, 55';

function ResultCard({ label, value }) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-center">
      <p className="text-xs font-medium text-blue-700">{label}</p>
      <p className="mt-1 text-2xl font-bold text-blue-900">{formatNum(value)}</p>
    </div>
  );
}

export function RangeContent({ topicId }) {
  const [values, setValues] = useState([]);
  const [classRows, setClassRows] = useState(createDefaultClassRows);

  const ungrouped = useMemo(() => computeUngroupedRange(values), [values]);
  const grouped = useMemo(() => computeGroupedRange(classRows), [classRows]);

  if (topicId === 'range-coefficient') {
    return (
      <section className="space-y-6">
        <p className="text-academic-600">
          The coefficient of range is a relative measure of dispersion based on the largest and
          smallest values.
        </p>
        <FormulaBox label="Formula">
          <span>Coefficient of range = (Yₘₐₓ − Yₘᵢₙ) / (Yₘₐₓ + Yₘᵢₙ)</span>
        </FormulaBox>
        <ValueListInput label="Enter data values" defaultValue={defaultValues} onValuesChange={setValues} />
        {ungrouped && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ResultCard label="Yₘᵢₙ" value={ungrouped.xmin} />
              <ResultCard label="Yₘₐₓ" value={ungrouped.xmax} />
              <ResultCard label="Range (R)" value={ungrouped.range} />
              <ResultCard label="Coefficient of range" value={ungrouped.coeff} />
            </div>
            <CalculationSteps steps={ungrouped.steps} />
          </>
        )}
      </section>
    );
  }

  if (topicId === 'range-ungrouped') {
    return (
      <section className="space-y-6">
        <p className="text-academic-600">
          For ungrouped data, range is the difference between the largest and smallest observations.
        </p>
        <FormulaBox label="Formula">
          <span>R = Yₘₐₓ − Yₘᵢₙ</span>
        </FormulaBox>
        <ValueListInput label="Enter data values" defaultValue={defaultValues} onValuesChange={setValues} />
        {ungrouped && (
          <>
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultCard label="Yₘᵢₙ" value={ungrouped.xmin} />
              <ResultCard label="Yₘₐₓ" value={ungrouped.xmax} />
              <ResultCard label="Range (R)" value={ungrouped.range} />
            </div>
            <CalculationSteps steps={ungrouped.steps.filter((s) => s.step <= 2)} />
          </>
        )}
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        For grouped frequency data, range is the mid-point of the last class minus the mid-point of the
        first class.
      </p>
      <FormulaBox label="Formula">
        <span>R = mid-point of last class − mid-point of first class</span>
      </FormulaBox>
      <EditableFrequencyTable rows={classRows} onChange={setClassRows} showMidPoint showBoundaries />
      {grouped && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultCard label="First mid-point" value={grouped.firstMid} />
            <ResultCard label="Last mid-point" value={grouped.lastMid} />
            <ResultCard label="Range (R)" value={grouped.range} />
          </div>
          <CalculationSteps steps={grouped.steps} />
        </>
      )}
    </section>
  );
}
