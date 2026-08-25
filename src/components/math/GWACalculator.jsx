import { useState } from 'react';
import { formatNum } from '../../utils/formatNumber';

export function GWACalculator() {
  const [subjects, setSubjects] = useState([{ grade: '', units: '' }]);
  const [currentField, setCurrentField] = useState('grade');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [screenValue, setScreenValue] = useState('');
  const [gwa, setGwa] = useState(null);

  const addSubject = () => {
    setSubjects([...subjects, { grade: '', units: '' }]);
    setCurrentIndex(subjects.length);
    setCurrentField('grade');
    setScreenValue('');
    setGwa(null);
  };

  const removeSubject = (index) => {
    const updated = subjects.filter((_, i) => i !== index);
    if (updated.length === 0) {
      setSubjects([{ grade: '', units: '' }]);
      setCurrentIndex(0);
      setCurrentField('grade');
      setScreenValue('');
      setGwa(null);
      return;
    }
    const nextIndex = Math.min(index, updated.length - 1);
    setSubjects(updated);
    setCurrentIndex(nextIndex);
    setCurrentField('grade');
    setScreenValue(updated[nextIndex]?.grade || '');
    setGwa(null);
  };

  const handleKeypad = (value) => {
    const updated = [...subjects];
    const current = updated[currentIndex][currentField];

    if (value === '.' && current.includes('.')) return;

    updated[currentIndex][currentField] = current + value;
    setSubjects(updated);
    setScreenValue(updated[currentIndex][currentField]);
    setGwa(null);
  };

  const clearScreen = () => {
    const updated = [...subjects];
    updated[currentIndex][currentField] = '';
    setSubjects(updated);
    setScreenValue('');
    setGwa(null);
  };

  const toggleField = (field, index) => {
    setCurrentField(field);
    setCurrentIndex(index);
    setScreenValue(subjects[index][field]);
    setGwa(null);
  };

  const calculateGWA = () => {
    let totalWeighted = 0;
    let totalUnits = 0;

    subjects.forEach((subj) => {
      const grade = parseFloat(subj.grade);
      const units = parseFloat(subj.units);
      if (!Number.isNaN(grade) && !Number.isNaN(units)) {
        totalWeighted += grade * units;
        totalUnits += units;
      }
    });

    if (totalUnits === 0) {
      setGwa(null);
      setScreenValue('0');
      return;
    }

    const result = formatNum(totalWeighted / totalUnits, 3);
    setGwa(result);
    setScreenValue(result);
  };

  const keypadBtn =
    'rounded-lg bg-academic-300 py-4 text-xl font-bold text-academic-900 transition-colors hover:bg-academic-400';

  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-academic-200 bg-blue-950 p-4 shadow-xl">
      <div className="mb-4 flex h-20 flex-col justify-center rounded-lg bg-black p-3 font-mono text-right text-green-400">
        <span className="text-left text-sm text-gray-400">
          {gwa ? 'GWA Result' : `Subject ${currentIndex + 1} - ${currentField.toUpperCase()}`}
        </span>
        <span className="text-2xl">{screenValue || '0'}</span>
      </div>

      <div className="mb-4 flex flex-col gap-2">
        {subjects.map((subj, idx) => (
          <div key={idx} className="flex gap-2">
            <button
              type="button"
              onClick={() => toggleField('grade', idx)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                currentField === 'grade' && currentIndex === idx
                  ? 'bg-blue-500 text-white'
                  : 'bg-academic-200 text-academic-800'
              }`}
            >
              G: {subj.grade || '—'}
            </button>
            <button
              type="button"
              onClick={() => toggleField('units', idx)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium ${
                currentField === 'units' && currentIndex === idx
                  ? 'bg-green-600 text-white'
                  : 'bg-academic-200 text-academic-800'
              }`}
            >
              U: {subj.units || '—'}
            </button>
            <button
              type="button"
              onClick={() => removeSubject(idx)}
              className="rounded-lg bg-red-600 px-3 text-white hover:bg-red-700"
              aria-label={`Remove subject ${idx + 1}`}
            >
              X
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((num) => (
          <button key={num} type="button" onClick={() => handleKeypad(num.toString())} className={keypadBtn}>
            {num}
          </button>
        ))}
        <button type="button" onClick={clearScreen} className="rounded-lg bg-red-600 py-4 font-bold text-white hover:bg-red-700">
          C
        </button>
        <button type="button" onClick={addSubject} className="rounded-lg bg-blue-700 py-4 font-bold text-white hover:bg-blue-800">
          +S
        </button>
        <button type="button" onClick={calculateGWA} className="rounded-lg bg-yellow-500 py-4 font-bold text-black hover:bg-yellow-600">
          =
        </button>
      </div>
    </div>
  );
}
