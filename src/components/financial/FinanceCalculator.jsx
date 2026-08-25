import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const MENU_CONFIG = {
  FV: [
    { label: 'No. of Period', name: 'periods' },
    { label: 'Interest per Year (%)', name: 'interest' },
    { label: 'Present Value', name: 'presentValue' },
    { label: 'Periodic Payment', name: 'payment' },
  ],
  PMT: [
    { label: 'No. of Period', name: 'periods' },
    { label: 'Interest per Year (%)', name: 'interest' },
    { label: 'Present Value', name: 'presentValue' },
    { label: 'Future Value', name: 'futureValue' },
  ],
  'I/Y': [
    { label: 'No. of Period', name: 'periods' },
    { label: 'Present Value', name: 'presentValue' },
    { label: 'Periodic Payment', name: 'payment' },
    { label: 'Future Value', name: 'futureValue' },
  ],
  N: [
    { label: 'Interest per Year (%)', name: 'interest' },
    { label: 'Present Value', name: 'presentValue' },
    { label: 'Periodic Payment', name: 'payment' },
    { label: 'Future Value', name: 'futureValue' },
  ],
  PV: [
    { label: 'No. of Period', name: 'periods' },
    { label: 'Interest per Year (%)', name: 'interest' },
    { label: 'Periodic Payment', name: 'payment' },
    { label: 'Future Value', name: 'futureValue' },
  ],
};

const fmt = (num) =>
  Number.isFinite(num)
    ? num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '—';

const toNum = (v) =>
  v === '' || v == null ? NaN : parseFloat(String(v).replace(/,/g, ''));

const zeroI = (x) => Math.abs(x) < 1e-12;

export function FinanceCalculator() {
  const [activeMenu, setActiveMenu] = useState('FV');
  const [inputs, setInputs] = useState({
    periods: '',
    interest: '',
    presentValue: '',
    payment: '',
    futureValue: '',
  });
  const [result, setResult] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [paymentTiming, setPaymentTiming] = useState('beginning');
  const [showSchedule, setShowSchedule] = useState(false);

  const menuConfig = useMemo(() => MENU_CONFIG, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (/^[0-9.,]*$/.test(value)) {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  };

  const clearAll = () => {
    setInputs({
      periods: '',
      interest: '',
      presentValue: '',
      payment: '',
      futureValue: '',
    });
    setResult(null);
    setSchedule([]);
    setShowSchedule(false);
  };

  const handleCalculate = () => {
    const n = toNum(inputs.periods);
    const iPct = toNum(inputs.interest);
    const i = Number.isFinite(iPct) ? iPct / 100 : NaN;
    const PV = toNum(inputs.presentValue);
    const PMT = toNum(inputs.payment);
    const FV = toNum(inputs.futureValue);

    let calcLabel = activeMenu;
    let calcValue = NaN;
    let usedN = n;
    let usedI = i;
    let usedPV = PV;
    let usedPMT = PMT;
    let usedFV = FV;

    try {
      switch (activeMenu) {
        case 'FV':
          if (zeroI(usedI)) {
            calcValue = usedPV + usedPMT * usedN;
          } else {
            calcValue =
              usedPV * usedI ** usedN +
              usedPMT *
                (((usedI + 1) ** usedN - 1) / usedI) *
                (paymentTiming === 'beginning' ? 1 + usedI : 1);
          }
          usedFV = calcValue;
          break;
        case 'PV':
          if (zeroI(usedI)) {
            calcValue = usedFV - usedPMT * usedN;
          } else {
            calcValue =
              usedFV / (usedI + 1) ** usedN +
              usedPMT *
                (((1 - (usedI + 1) ** -usedN) / usedI) *
                  (paymentTiming === 'beginning' ? 1 + usedI : 1));
          }
          usedPV = calcValue;
          break;
        case 'PMT':
          if (zeroI(usedI)) {
            calcValue = usedN === 0 ? NaN : (usedFV - usedPV) / usedN;
          } else {
            const factor =
              ((usedI + 1) ** usedN - 1) / (usedI * (paymentTiming === 'beginning' ? 1 + usedI : 1));
            calcValue = (usedFV - usedPV * (usedI + 1) ** usedN) / factor;
          }
          usedPMT = calcValue;
          break;
        case 'N':
        case 'I/Y':
          calcValue = NaN;
          break;
        default:
          break;
      }
    } catch {
      calcValue = NaN;
    }

    const sumPayments = usedPMT * usedN;
    const impliedFV = zeroI(usedI)
      ? usedPV + usedPMT * usedN
      : usedPV * (usedI + 1) ** usedN +
        usedPMT *
          (((usedI + 1) ** usedN - 1) / usedI) *
          (paymentTiming === 'beginning' ? 1 + usedI : 1);
    const totalInterest = impliedFV - (usedPV + sumPayments);

    const sched = [];
    let balance = usedPV;
    let accumulatedInterest = 0;

    if (Number.isFinite(usedN) && usedN > 0 && Number.isFinite(usedI)) {
      for (let t = 1; t <= usedN; t += 1) {
        const interestPortion = balance * usedI;
        accumulatedInterest += interestPortion;
        balance = balance * (1 + usedI) + usedPMT;

        sched.push({
          period: t,
          pv: balance - usedPMT,
          pmt: usedPMT,
          interest: interestPortion,
          fv: balance,
          accInterest: accumulatedInterest,
        });
      }
    }

    setResult({
      label: calcLabel,
      value: calcValue,
      sumPayments,
      totalInterest,
    });
    setSchedule(sched);
    setShowSchedule(sched.length > 0);
  };

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-academic-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap gap-1">
            {Object.keys(menuConfig).map((menu) => (
              <button
                key={menu}
                type="button"
                onClick={() => setActiveMenu(menu)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeMenu === menu
                    ? 'bg-blue-900 text-white'
                    : 'bg-academic-100 text-academic-800 hover:bg-academic-200'
                }`}
              >
                {menu}
              </button>
            ))}
          </div>

          <div className="space-y-3 rounded-xl border border-academic-200 bg-academic-50 p-4">
            {menuConfig[activeMenu].map((field) => {
              const id = `fc-${field.name}`;
              return (
                <div key={field.name} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                  <label htmlFor={id} className="text-sm font-semibold text-academic-700 sm:w-1/2">
                    {field.label}
                  </label>
                  <input
                    id={id}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    name={field.name}
                    value={inputs[field.name]}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-academic-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-1/2"
                    placeholder={field.label}
                  />
                </div>
              );
            })}

            <div className="flex flex-wrap gap-4 pt-1 text-sm text-academic-700">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentTiming"
                  value="beginning"
                  checked={paymentTiming === 'beginning'}
                  onChange={(e) => setPaymentTiming(e.target.value)}
                />
                Beginning
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentTiming"
                  value="end"
                  checked={paymentTiming === 'end'}
                  onChange={(e) => setPaymentTiming(e.target.value)}
                />
                End
              </label>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleCalculate}
                className="rounded-lg bg-blue-900 px-5 py-2 text-sm font-medium text-white hover:bg-blue-800"
              >
                Calculate
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="rounded-lg bg-academic-200 px-5 py-2 text-sm font-medium text-academic-800 hover:bg-academic-300"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-academic-200 bg-white shadow-sm">
          <h2 className="rounded-t-2xl bg-blue-900 p-3 text-center text-lg font-semibold text-white">
            Result
          </h2>
          <div className="p-4">
            {!result ? (
              <p className="py-8 text-center text-academic-600">
                Result will be shown here after calculation.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between rounded-lg border border-academic-200 bg-academic-50 p-3">
                  <span className="font-semibold text-blue-900">{result.label}:</span>
                  <span className="font-medium text-academic-800">
                    {result.label === 'I/Y' ? `${fmt(result.value)}%` : fmt(result.value)}
                  </span>
                </div>
                <div className="flex justify-between rounded-lg border border-academic-200 bg-academic-50 p-3">
                  <span className="font-semibold text-blue-900">Sum of Periodic Payments:</span>
                  <span className="font-medium text-academic-800">{fmt(result.sumPayments)}</span>
                </div>
                <div className="flex justify-between rounded-lg border border-academic-200 bg-academic-50 p-3">
                  <span className="font-semibold text-blue-900">Total Interest:</span>
                  <span className="font-medium text-academic-800">{fmt(result.totalInterest)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSchedule && (
        <>
          <div className="overflow-hidden rounded-2xl border border-academic-200 bg-white shadow-sm">
            <h2 className="bg-blue-900 p-3 text-center text-lg font-semibold text-white">
              Balance &amp; Interest Trend
            </h2>
            <div className="h-[300px] w-full p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={schedule}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis tickFormatter={(value) => (value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value)} />
                  <Tooltip formatter={(val) => fmt(val)} />
                  <Legend />
                  <Line type="monotone" dataKey="pv" stroke="#16a34a" name="PV" dot={false} />
                  <Line type="monotone" dataKey="pmt" stroke="#dc2626" name="PMT" dot={false} />
                  <Line type="monotone" dataKey="fv" stroke="#2563eb" name="FV" dot={false} />
                  <Line type="monotone" dataKey="accInterest" stroke="#9333ea" name="Acc. Interest" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-academic-200 bg-white shadow-sm">
            <h2 className="bg-blue-900 p-3 text-center text-lg font-semibold text-white">Schedule</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-academic-700 text-white">
                    <th className="border border-academic-600 px-2 py-2">Period</th>
                    <th className="border border-academic-600 px-2 py-2">PV</th>
                    <th className="border border-academic-600 px-2 py-2">PMT</th>
                    <th className="border border-academic-600 px-2 py-2">Interest</th>
                    <th className="border border-academic-600 px-2 py-2">FV</th>
                    <th className="border border-academic-600 px-2 py-2">Acc. Interest</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((row, i) => (
                    <tr key={row.period} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                      <td className="border border-academic-200 px-2 py-1.5">{row.period}</td>
                      <td className="border border-academic-200 px-2 py-1.5">{fmt(row.pv)}</td>
                      <td className="border border-academic-200 px-2 py-1.5">{fmt(row.pmt)}</td>
                      <td className="border border-academic-200 px-2 py-1.5">{fmt(row.interest)}</td>
                      <td className="border border-academic-200 px-2 py-1.5">{fmt(row.fv)}</td>
                      <td className="border border-academic-200 px-2 py-1.5">{fmt(row.accInterest)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
