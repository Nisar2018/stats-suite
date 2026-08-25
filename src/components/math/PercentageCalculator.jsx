import { useEffect, useState } from 'react';

function formatResult(num) {
  if (num === '' || num == null || Number.isNaN(num) || !Number.isFinite(num)) return '';
  return parseFloat(Number(num).toFixed(2)).toString();
}

const inputClass =
  'min-w-[60px] flex-1 rounded-lg border border-academic-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';
const resultClass =
  'min-w-[80px] flex-1 rounded-lg border border-academic-300 bg-academic-50 px-2 py-2 text-sm font-medium text-blue-900';

function CalcSection({ title, children, onCalculate, onClear }) {
  return (
    <div className="rounded-2xl border border-academic-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-blue-900">{title}</h3>
      <div className="mt-3">{children}</div>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={onCalculate}
          className="min-w-[140px] flex-1 rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-800 sm:max-w-[200px]"
        >
          Calculate
        </button>
        <button
          type="button"
          onClick={onClear}
          className="min-w-[140px] flex-1 rounded-lg bg-academic-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-academic-700 sm:max-w-[200px]"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export function PercentageCalculator() {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [result1, setResult1] = useState('');

  const [valA, setValA] = useState('');
  const [valB, setValB] = useState('');
  const [result2, setResult2] = useState('');

  const [oldVal, setOldVal] = useState('');
  const [newVal, setNewVal] = useState('');
  const [result3, setResult3] = useState('');

  const [part, setPart] = useState('');
  const [percent, setPercent] = useState('');
  const [result4, setResult4] = useState('');

  useEffect(() => {
    if (value1 && value2) {
      setResult1(formatResult((Number(value1) * Number(value2)) / 100));
    }
  }, [value1, value2]);

  useEffect(() => {
    if (valA && valB && Number(valB) !== 0) {
      setResult2(formatResult((Number(valA) / Number(valB)) * 100));
    }
  }, [valA, valB]);

  useEffect(() => {
    if (oldVal && newVal && Number(oldVal) !== 0) {
      setResult3(formatResult(((Number(newVal) - Number(oldVal)) / Number(oldVal)) * 100));
    }
  }, [oldVal, newVal]);

  useEffect(() => {
    if (part && percent && Number(percent) !== 0) {
      setResult4(formatResult(Number(part) / (Number(percent) / 100)));
    }
  }, [part, percent]);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <CalcSection
        title="What is X% of Y?"
        onCalculate={() => setResult1(formatResult((Number(value1) * Number(value2)) / 100))}
        onClear={() => {
          setValue1('');
          setValue2('');
          setResult1('');
        }}
      >
        <div className="flex flex-wrap items-center gap-2 text-sm text-academic-700">
          <span>What is</span>
          <input type="number" value={value1} onChange={(e) => setValue1(e.target.value)} className={inputClass} />
          <span>% of</span>
          <input type="number" value={value2} onChange={(e) => setValue2(e.target.value)} className={inputClass} />
          <span>=</span>
          <input type="text" readOnly value={result1} className={resultClass} />
        </div>
      </CalcSection>

      <CalcSection
        title="X is what % of Y?"
        onCalculate={() =>
          Number(valB) !== 0 ? setResult2(formatResult((Number(valA) / Number(valB)) * 100)) : setResult2('')
        }
        onClear={() => {
          setValA('');
          setValB('');
          setResult2('');
        }}
      >
        <div className="flex flex-wrap items-center gap-2 text-sm text-academic-700">
          <input type="number" value={valA} onChange={(e) => setValA(e.target.value)} className={inputClass} />
          <span>is what % of</span>
          <input type="number" value={valB} onChange={(e) => setValB(e.target.value)} className={inputClass} />
          <span>=</span>
          <input type="text" readOnly value={result2} className={resultClass} />
        </div>
      </CalcSection>

      <CalcSection
        title="% Increase/Decrease from X to Y"
        onCalculate={() =>
          Number(oldVal) !== 0
            ? setResult3(formatResult(((Number(newVal) - Number(oldVal)) / Number(oldVal)) * 100))
            : setResult3('')
        }
        onClear={() => {
          setOldVal('');
          setNewVal('');
          setResult3('');
        }}
      >
        <div className="flex flex-wrap items-center gap-2 text-sm text-academic-700">
          <input type="number" value={oldVal} onChange={(e) => setOldVal(e.target.value)} className={inputClass} />
          <span>to</span>
          <input type="number" value={newVal} onChange={(e) => setNewVal(e.target.value)} className={inputClass} />
          <span>=</span>
          <input type="text" readOnly value={result3} className={resultClass} />
        </div>
      </CalcSection>

      <CalcSection
        title="If X is Y% of a number, find the number"
        onCalculate={() =>
          Number(percent) !== 0
            ? setResult4(formatResult(Number(part) / (Number(percent) / 100)))
            : setResult4('')
        }
        onClear={() => {
          setPart('');
          setPercent('');
          setResult4('');
        }}
      >
        <div className="flex flex-wrap items-center gap-2 text-sm text-academic-700">
          <span>If</span>
          <input type="number" value={part} onChange={(e) => setPart(e.target.value)} className={inputClass} />
          <span>is</span>
          <input type="number" value={percent} onChange={(e) => setPercent(e.target.value)} className={inputClass} />
          <span>% of number =</span>
          <input type="text" readOnly value={result4} className={resultClass} />
        </div>
      </CalcSection>
    </div>
  );
}
