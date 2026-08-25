import { useState } from 'react';

const BUTTON_ROWS = [
  ['MC', 'MR', 'M+', 'M-'],
  ['CE', 'AC', '±', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '=', '^'],
  ['√', '%', 'π', 'R2', 'R0'],
];

function safeEval(expr) {
  try {
    return Function(`"use strict"; return (${expr})`)();
  } catch {
    return 'Error';
  }
}

export function Calculator() {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState(0);
  const [justCalculated, setJustCalculated] = useState(false);

  const handleInput = (val) => {
    if (justCalculated && !['+', '-', '×', '÷'].includes(val)) {
      setDisplay(val);
      setJustCalculated(false);
      return;
    }

    if (display === '0' && !['+', '-', '×', '÷'].includes(val)) {
      setDisplay(val);
    } else {
      setDisplay(display + val);
    }
    setJustCalculated(false);
  };

  const handleClearEntry = () => setDisplay('0');

  const handleAllClear = () => {
    setDisplay('0');
    setMemory(0);
  };

  const handlePlusMinus = () => {
    setDisplay((prev) => (prev.startsWith('-') ? prev.slice(1) : `-${prev}`));
  };

  const handleEqual = () => {
    const expr = display.replace(/×/g, '*').replace(/÷/g, '/');
    const result = safeEval(expr);
    setDisplay(String(result));
    setJustCalculated(true);
  };

  const handleMemory = (type) => {
    const current = parseFloat(display);
    if (Number.isNaN(current)) return;

    switch (type) {
      case 'MC':
        setMemory(0);
        break;
      case 'MR':
        setDisplay(String(memory));
        break;
      case 'M+':
        setMemory(memory + current);
        break;
      case 'M-':
        setMemory(memory - current);
        break;
      default:
        break;
    }
  };

  const handleSpecial = (type) => {
    const current = parseFloat(display);
    if (Number.isNaN(current)) return;

    switch (type) {
      case '√':
        setDisplay(String(Math.sqrt(current)));
        break;
      case '%':
        setDisplay(String(current / 100));
        break;
      case 'π':
        setDisplay('3.1415926536');
        break;
      case 'R2':
        setDisplay(String(Math.round(current * 100) / 100));
        break;
      case 'R0':
        setDisplay(String(Math.round(current)));
        break;
      default:
        break;
    }
  };

  const handleExponent = () => {
    setDisplay(`${display}**`);
  };

  const handleButtonClick = (btn) => {
    if (!Number.isNaN(Number(btn)) || btn === '.' || ['+', '-', '×', '÷'].includes(btn)) {
      handleInput(btn);
    } else if (btn === '=') handleEqual();
    else if (btn === 'CE') handleClearEntry();
    else if (btn === 'AC') handleAllClear();
    else if (btn === '±') handlePlusMinus();
    else if (['MC', 'MR', 'M+', 'M-'].includes(btn)) handleMemory(btn);
    else if (['√', '%', 'π', 'R2', 'R0'].includes(btn)) handleSpecial(btn);
    else if (btn === '^') handleExponent();
  };

  return (
    <div className="rounded-2xl border border-academic-200 bg-white p-4 shadow-md">
      <div className="mb-4 min-h-[60px] rounded-lg border border-academic-300 bg-academic-50 p-3 text-right text-2xl font-medium text-blue-900">
        {display}
      </div>

      <div className="space-y-2">
        {BUTTON_ROWS.map((row, rowIndex) => (
          <div
            key={row.join('-')}
            className={`grid gap-2 ${rowIndex === BUTTON_ROWS.length - 1 ? 'grid-cols-5' : 'grid-cols-4'}`}
          >
            {row.map((btn) => (
              <button
                key={btn}
                type="button"
                className="flex h-12 items-center justify-center rounded-lg border border-academic-300 bg-academic-100 text-sm font-semibold text-academic-800 shadow-sm transition-colors hover:bg-academic-200 sm:text-base"
                onClick={() => handleButtonClick(btn)}
              >
                {btn}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
