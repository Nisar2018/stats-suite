import { useMemo, useState } from 'react';
import {
  computeUngroupedQuartileDeviation,
  computeGroupedQuartileDeviation,
} from '../../utils/dispersionStatistics';
import { createDefaultClassRows } from '../../utils/statistics';
import { formatNum } from '../../utils/formatNumber';
import { FormulaBox } from '../FormulaBox';
import { CalculationSteps } from '../CalculationSteps';
import { ValueListInput } from '../ValueListInput';
import { EditableFrequencyTable } from '../EditableFrequencyTable';

const defaultValues = '8, 12, 15, 18, 20, 22, 25, 28, 30, 35';

function ResultCard({ label, value }) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-center">
      <p className="text-xs font-medium text-blue-700">{label}</p>
      <p className="mt-1 text-2xl font-bold text-blue-900">{formatNum(value)}</p>
    </div>
  );
}

function CoefficientSection({ isUngrouped, values, setValues, classRows, setClassRows, result }) {
  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        The coefficient of quartile deviation is a relative measure of dispersion based on Q₁ and Q₃
        for {isUngrouped ? 'ungrouped' : 'grouped'} data.
      </p>
      <FormulaBox label="Formula">
        <span>Coefficient of Q.D = (Q₃ − Q₁) / (Q₃ + Q₁)</span>
      </FormulaBox>

      {isUngrouped ? (
        <ValueListInput label="Enter data values" defaultValue={defaultValues} onValuesChange={setValues} />
      ) : (
        <EditableFrequencyTable
          rows={classRows}
          onChange={setClassRows}
          showBoundaries
          showCumulative
          highlightRowIndex={result?.q1Index}
          highlightLabel="Q₁ / Q₃ classes"
        />
      )}

      {result && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ResultCard label="Q₁" value={result.q1} />
            <ResultCard label="Q₃" value={result.q3} />
            <ResultCard label="Q.D" value={result.qd} />
            <ResultCard label="Coefficient of Q.D" value={result.coeff} />
          </div>
          <CalculationSteps steps={result.steps} />
        </>
      )}
    </section>
  );
}

export function QuartileDeviationContent({ topicId }) {
  const [values, setValues] = useState([]);
  const [classRows, setClassRows] = useState(createDefaultClassRows);

  const ungrouped = useMemo(() => computeUngroupedQuartileDeviation(values), [values]);
  const grouped = useMemo(() => computeGroupedQuartileDeviation(classRows), [classRows]);

  if (topicId === 'qd-coefficient-ungrouped' || topicId === 'qd-coefficient') {
    return (
      <CoefficientSection
        isUngrouped
        values={values}
        setValues={setValues}
        classRows={classRows}
        setClassRows={setClassRows}
        result={ungrouped}
      />
    );
  }

  if (topicId === 'qd-coefficient-grouped') {
    return (
      <CoefficientSection
        isUngrouped={false}
        values={values}
        setValues={setValues}
        classRows={classRows}
        setClassRows={setClassRows}
        result={grouped}
      />
    );
  }

  const isUngrouped = topicId === 'qd-ungrouped';
  const result = isUngrouped ? ungrouped : grouped;

  return (
    <section className="space-y-6">
      <p className="text-academic-600">
        Quartile deviation uses Q.D = (Q₃ − Q₁) / 2. Q₁ and Q₃ are found with different methods for
        ungrouped and grouped data, but the Q.D formula is the same.
      </p>
      <FormulaBox label="Formula">
        <span>Q.D = (Q₃ − Q₁) / 2</span>
      </FormulaBox>

      {isUngrouped ? (
        <ValueListInput label="Enter data values" defaultValue={defaultValues} onValuesChange={setValues} />
      ) : (
        <EditableFrequencyTable
          rows={classRows}
          onChange={setClassRows}
          showBoundaries
          showCumulative
          highlightRowIndex={result?.q1Index}
          highlightLabel="Q₁ / Q₃ classes"
        />
      )}

      {result && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ResultCard label="Q₁" value={result.q1} />
            <ResultCard label="Q₃" value={result.q3} />
            <ResultCard label="Q.D" value={result.qd} />
            <ResultCard label="Coefficient of Q.D" value={result.coeff} />
          </div>
          <CalculationSteps steps={result.steps} />
        </>
      )}
    </section>
  );
}
