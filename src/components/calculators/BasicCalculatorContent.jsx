import { Calculator } from '../math/Calculator';

const operatorRows = [
  { operator: '÷', fn: 'Division', example: <>100 ÷ 4 = <strong>25</strong></> },
  { operator: '×', fn: 'Multiplication', example: <>12 × 5 = <strong>60</strong></> },
  { operator: '+', fn: 'Addition', example: <>25 + 15 = <strong>40</strong></> },
  { operator: '−', fn: 'Subtraction', example: <>50 − 20 = <strong>30</strong></> },
  { operator: '=', fn: 'Calculate Result', example: <>8 + 2 = <strong>10</strong></> },
  { operator: '+/-', fn: 'Toggle sign', example: <>5 → <strong>-5</strong></> },
  { operator: 'mc / mr / m- / m+', fn: 'Memory functions', example: 'Store & recall values' },
  { operator: 'CE / AC', fn: 'Clear entry / All clear', example: 'Reset calculator' },
  { operator: '√x', fn: 'Square root', example: <>√81 = <strong>9</strong></> },
  { operator: '%', fn: 'Percentage', example: <>200 × 10% = <strong>20</strong></> },
  { operator: 'π', fn: 'Pi', example: <>π ≈ <strong>3.1416</strong></> },
  { operator: 'xy', fn: 'Exponent', example: <>3<sup>4</sup> = <strong>81</strong></> },
  { operator: 'R2 / R0', fn: 'Rounding', example: <>12.678 → R2 = <strong>12.68</strong>, R0 = <strong>13</strong></> },
];

export function BasicCalculatorContent() {
  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold text-blue-900 md:text-3xl">Basic Calculator</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Calculator />

        <div className="rounded-2xl border border-academic-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-blue-900">What is a Basic Calculator?</h2>
          <p className="mt-3 leading-relaxed text-academic-700">
            A basic calculator is a simple tool that allows you to perform fundamental mathematical
            operations such as addition, subtraction, multiplication, and division. It also includes
            features like memory functions, rounding, exponents, percentages, and constants such as π
            (pi). This makes it useful for solving everyday math problems quickly and efficiently.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-academic-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-blue-900">What Are the Functions on the Calculator?</h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-academic-700 text-white">
                <th className="border border-academic-600 px-3 py-2.5 text-left">Operator</th>
                <th className="border border-academic-600 px-3 py-2.5 text-left">Function</th>
                <th className="border border-academic-600 px-3 py-2.5 text-left">Example</th>
              </tr>
            </thead>
            <tbody>
              {operatorRows.map((row, i) => (
                <tr key={row.operator} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                  <td className="border border-academic-200 px-3 py-2">{row.operator}</td>
                  <td className="border border-academic-200 px-3 py-2">{row.fn}</td>
                  <td className="border border-academic-200 px-3 py-2">{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
