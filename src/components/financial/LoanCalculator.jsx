import { useState } from 'react';
import { Cell, Legend, Pie, PieChart, Tooltip } from 'recharts';

const COMPOUND_MAP = {
  'Annually(APY)': 1,
  'Semi-annually': 2,
  Quarterly: 4,
  'Monthly(APR)': 12,
  'Semi-monthly': 24,
  Biweekly: 26,
  Weekly: 52,
  Daily: 365,
  Continuously: 'continuous',
};

const PAYBACK_MAP = {
  'Every Day': 365,
  'Every Week': 52,
  'Every 2 Week': 26,
  'Every Half Month': 24,
  'Every Month': 12,
  'Every Quarter': 4,
  'Every Six Months': 2,
  'Every Year': 1,
};

const COLORS = ['#16a34a', '#ea580c'];

const inputClass =
  'w-full rounded-lg border border-academic-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';
const selectClass =
  'w-full rounded-lg border border-academic-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

function formatCurrency(value) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  return Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function toEAR(ratePct, compoundLabel) {
  const r = (parseFloat(ratePct) || 0) / 100;
  if (!r) return 0;
  if (compoundLabel === 'Annually(APY)') return r;
  if (compoundLabel === 'Continuously') return Math.exp(r) - 1;
  const n = COMPOUND_MAP[compoundLabel] || 12;
  return (1 + r / n) ** n - 1;
}

function perPaymentRateFromEAR(EAR, m) {
  if (!EAR || !m) return 0;
  return (1 + EAR) ** (1 / m) - 1;
}

function SectionHeader({ title }) {
  return (
    <h2 className="rounded-lg bg-blue-900 p-3 text-center text-xl font-semibold text-white">{title}</h2>
  );
}

function ResultPanel({ title, children, emptyText }) {
  return (
    <div className="rounded-xl border border-academic-200 bg-academic-50 p-4">
      <h3 className="mb-3 text-xl font-semibold text-blue-900">{title}</h3>
      {children ?? <p className="text-academic-600">{emptyText}</p>}
    </div>
  );
}

function ScheduleTable({ rows, columns }) {
  return (
    <div className="max-h-96 overflow-auto">
      <table className="w-full border-collapse text-sm">
        <thead className="sticky top-0 bg-academic-700 text-white">
          <tr>
            {columns.map((col) => (
              <th key={col} className="border border-academic-600 px-2 py-2">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.sl ?? i} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
              <td className="border border-academic-200 px-2 py-1.5">{row.sl}</td>
              <td className="border border-academic-200 px-2 py-1.5">${formatCurrency(row.beginning)}</td>
              <td className="border border-academic-200 px-2 py-1.5">${formatCurrency(row.interest)}</td>
              {row.principal != null && (
                <td className="border border-academic-200 px-2 py-1.5">${formatCurrency(row.principal)}</td>
              )}
              {row.payment != null && (
                <td className="border border-academic-200 px-2 py-1.5">${formatCurrency(row.payment)}</td>
              )}
              <td className="border border-academic-200 px-2 py-1.5">${formatCurrency(row.ending)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PrincipalInterestPie({ principal, interest }) {
  return (
    <div className="mt-4 flex justify-center">
      <PieChart width={200} height={200}>
        <Pie
          data={[
            { name: 'Principal', value: principal },
            { name: 'Interest', value: interest },
          ]}
          cx="50%"
          cy="50%"
          outerRadius={70}
          dataKey="value"
          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
        >
          <Cell fill={COLORS[0]} />
          <Cell fill={COLORS[1]} />
        </Pie>
        <Tooltip formatter={(val) => `$${formatCurrency(val)}`} />
        <Legend />
      </PieChart>
    </div>
  );
}

function LoanFields({
  amount,
  years,
  months,
  rate,
  compound,
  payback,
  amountLabel = 'Loan Amount',
  amountValue,
  onAmountChange,
  onYearsChange,
  onMonthsChange,
  onRateChange,
  onCompoundChange,
  onPaybackChange,
  showPayback = false,
  dueAmountLabel,
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="text-sm font-semibold text-academic-700 sm:min-w-[140px]">
          {dueAmountLabel ?? amountLabel}
        </label>
        <input type="number" value={amountValue ?? amount} onChange={onAmountChange} className={inputClass} />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="text-sm font-semibold text-academic-700 sm:min-w-[140px]">Loan Term</label>
        <div className="flex w-full gap-2">
          <input type="number" placeholder="Years" value={years} onChange={onYearsChange} className={inputClass} />
          <input type="number" placeholder="Months" value={months} onChange={onMonthsChange} className={inputClass} />
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="text-sm font-semibold text-academic-700 sm:min-w-[140px]">Interest Rate (%)</label>
        <input type="number" value={rate} onChange={onRateChange} className={inputClass} />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="text-sm font-semibold text-academic-700 sm:min-w-[140px]">Compound</label>
        <select value={compound} onChange={onCompoundChange} className={selectClass}>
          {Object.keys(COMPOUND_MAP).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      {showPayback && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="text-sm font-semibold text-academic-700 sm:min-w-[140px]">Pay Back</label>
          <select value={payback} onChange={onPaybackChange} className={selectClass}>
            {Object.keys(PAYBACK_MAP).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

function buildGrowthSchedules(PV, EAR, totalMonths) {
  const monthlyRate = (1 + EAR) ** (1 / 12) - 1;
  const monthlySchedule = [];
  let bal = PV;
  for (let i = 1; i <= totalMonths; i += 1) {
    const interest = bal * monthlyRate;
    const ending = bal + interest;
    monthlySchedule.push({ sl: i, beginning: bal, interest, ending });
    bal = ending;
  }

  const annualSchedule = [];
  let yearStartBal = PV;
  let remainingMonths = totalMonths;
  let yearIndex = 1;
  while (remainingMonths > 0) {
    const monthsThisYear = Math.min(12, remainingMonths);
    const yearFactor = (1 + monthlyRate) ** monthsThisYear;
    const yearEnding = yearStartBal * yearFactor;
    annualSchedule.push({
      sl: yearIndex,
      beginning: yearStartBal,
      interest: yearEnding - yearStartBal,
      ending: yearEnding,
    });
    yearStartBal = yearEnding;
    remainingMonths -= monthsThisYear;
    yearIndex += 1;
  }

  return { monthlySchedule, annualSchedule };
}

export function LoanCalculator() {
  const [amort, setAmort] = useState({
    amount: '',
    years: '',
    months: '',
    rate: '',
    compound: 'Annually(APY)',
    payback: 'Every Month',
  });
  const [result1, setResult1] = useState(null);
  const [showAmortSchedule, setShowAmortSchedule] = useState(false);

  const [def, setDef] = useState({
    amount: '',
    years: '',
    months: '',
    rate: '',
    compound: 'Annually(APY)',
  });
  const [result2, setResult2] = useState(null);
  const [showDefSchedule, setShowDefSchedule] = useState(false);
  const [defScheduleType, setDefScheduleType] = useState('Annual');

  const [bond, setBond] = useState({
    dueAmount: '',
    years: '',
    months: '',
    rate: '',
    compound: 'Annually(APY)',
  });
  const [result3, setResult3] = useState(null);
  const [showBondSchedule, setShowBondSchedule] = useState(false);
  const [bondScheduleType, setBondScheduleType] = useState('Annual');

  const calcAmortized = () => {
    const P = parseFloat(amort.amount);
    const termYears = parseInt(amort.years || 0, 10) + parseInt(amort.months || 0, 10) / 12;
    if (!P || !termYears) {
      setResult1(null);
      return;
    }

    const EAR = toEAR(amort.rate, amort.compound);
    const m = PAYBACK_MAP[amort.payback] || 12;
    const i = perPaymentRateFromEAR(EAR, m);
    const N = Math.round(m * termYears);

    let PMT = 0;
    if (i === 0) PMT = P / N;
    else PMT = (P * i) / (1 - (1 + i) ** -N);

    const schedule = [];
    let balance = P;
    for (let k = 1; k <= N; k += 1) {
      const interest = balance * i;
      let principalPortion = PMT - interest;
      if (k === N) principalPortion = balance;
      const ending = balance - principalPortion;
      schedule.push({
        sl: k,
        beginning: balance,
        interest,
        principal: principalPortion,
        payment: k === N ? principalPortion + interest : PMT,
        ending: ending < 0.0001 ? 0 : ending,
      });
      balance = ending;
      if (balance <= 0) break;
    }

    const totalPayment = schedule.reduce((s, row) => s + (row.payment || 0), 0);
    setResult1({
      paymentPerPeriod: PMT,
      totalPayment,
      totalInterest: totalPayment - P,
      N,
      schedule,
      principal: P,
    });
  };

  const calcDeferred = () => {
    const P = parseFloat(def.amount);
    const t = parseInt(def.years || 0, 10) + parseInt(def.months || 0, 10) / 12;
    if (!P || !t) {
      setResult2(null);
      return;
    }

    const EAR = toEAR(def.rate, def.compound);
    const FV = P * (1 + EAR) ** t;
    const totalMonths = Math.round(t * 12);
    const { monthlySchedule, annualSchedule } = buildGrowthSchedules(P, EAR, totalMonths);

    setResult2({
      principal: P,
      futureValue: FV,
      totalInterest: FV - P,
      monthlySchedule,
      annualSchedule,
    });
  };

  const calcBond = () => {
    const FV = parseFloat(bond.dueAmount);
    const t = parseInt(bond.years || 0, 10) + parseInt(bond.months || 0, 10) / 12;
    if (!FV || !t) {
      setResult3(null);
      return;
    }

    const EAR = toEAR(bond.rate, bond.compound);
    const PV = FV / (1 + EAR) ** t;
    const totalMonths = Math.round(t * 12);
    const { monthlySchedule, annualSchedule } = buildGrowthSchedules(PV, EAR, totalMonths);

    setResult3({
      presentValue: PV,
      futureValue: FV,
      totalInterest: FV - PV,
      monthlySchedule,
      annualSchedule,
    });
  };

  const btnPrimary = 'rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800';
  const btnSecondary = 'rounded-lg bg-academic-600 px-4 py-2 text-sm font-medium text-white hover:bg-academic-700';
  const btnToggle = (active) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium ${active ? 'bg-blue-900 text-white' : 'bg-academic-100 text-academic-800'}`;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="rounded-2xl border border-academic-200 bg-white p-4 shadow-sm sm:p-6">
        <SectionHeader title="Amortized Loan" />
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-academic-200 p-4">
            <LoanFields
              amount={amort.amount}
              years={amort.years}
              months={amort.months}
              rate={amort.rate}
              compound={amort.compound}
              payback={amort.payback}
              showPayback
              onAmountChange={(e) => setAmort({ ...amort, amount: e.target.value })}
              onYearsChange={(e) => setAmort({ ...amort, years: e.target.value })}
              onMonthsChange={(e) => setAmort({ ...amort, months: e.target.value })}
              onRateChange={(e) => setAmort({ ...amort, rate: e.target.value })}
              onCompoundChange={(e) => setAmort({ ...amort, compound: e.target.value })}
              onPaybackChange={(e) => setAmort({ ...amort, payback: e.target.value })}
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={calcAmortized} className={btnPrimary}>Calculate</button>
              <button
                type="button"
                onClick={() => {
                  setAmort({ amount: '', years: '', months: '', rate: '', compound: 'Annually(APY)', payback: 'Every Month' });
                  setResult1(null);
                  setShowAmortSchedule(false);
                }}
                className={btnSecondary}
              >
                Clear
              </button>
            </div>
          </div>
          <ResultPanel title="Result" emptyText="Enter loan details and click Calculate.">
            {result1 && (
              <div className="space-y-2 text-sm text-academic-700">
                <p><strong className="text-blue-900">Payment ({result1.N} periods / {amort.payback}):</strong> ${formatCurrency(result1.paymentPerPeriod)}</p>
                <p><strong className="text-blue-900">Total Payment:</strong> ${formatCurrency(result1.totalPayment)}</p>
                <p><strong className="text-blue-900">Total Interest:</strong> ${formatCurrency(result1.totalInterest)}</p>
                <p><strong className="text-blue-900">Total No. of Payments:</strong> {result1.N.toLocaleString()}</p>
                <PrincipalInterestPie principal={result1.principal} interest={result1.totalInterest} />
              </div>
            )}
          </ResultPanel>
        </div>
        {result1 && (
          <>
            <div className="mt-4 text-center">
              <button type="button" onClick={() => setShowAmortSchedule(!showAmortSchedule)} className={btnPrimary}>
                {showAmortSchedule ? 'Hide' : 'Show'} Amortization Schedule Table
              </button>
            </div>
            {showAmortSchedule && (
              <div className="mt-4">
                <ScheduleTable
                  rows={result1.schedule}
                  columns={['Sl#', 'Beginning Balance', 'Interest', 'Principal', 'Payment', 'Ending Balance']}
                />
              </div>
            )}
          </>
        )}
      </section>

      <section className="rounded-2xl border border-academic-200 bg-white p-4 shadow-sm sm:p-6">
        <SectionHeader title="Deferred Payment Loan" />
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-academic-200 p-4">
            <LoanFields
              amount={def.amount}
              years={def.years}
              months={def.months}
              rate={def.rate}
              compound={def.compound}
              onAmountChange={(e) => setDef({ ...def, amount: e.target.value })}
              onYearsChange={(e) => setDef({ ...def, years: e.target.value })}
              onMonthsChange={(e) => setDef({ ...def, months: e.target.value })}
              onRateChange={(e) => setDef({ ...def, rate: e.target.value })}
              onCompoundChange={(e) => setDef({ ...def, compound: e.target.value })}
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={calcDeferred} className={btnPrimary}>Calculate</button>
              <button
                type="button"
                onClick={() => {
                  setDef({ amount: '', years: '', months: '', rate: '', compound: 'Annually(APY)' });
                  setResult2(null);
                  setShowDefSchedule(false);
                }}
                className={btnSecondary}
              >
                Clear
              </button>
            </div>
          </div>
          <ResultPanel title="Result" emptyText="Enter loan details and click Calculate.">
            {result2 && (
              <div className="space-y-2 text-sm text-academic-700">
                <p><strong className="text-blue-900">Future Value (Due at Maturity):</strong> ${formatCurrency(result2.futureValue)}</p>
                <p><strong className="text-blue-900">Total Interest:</strong> ${formatCurrency(result2.totalInterest)}</p>
                <p><strong className="text-blue-900">Total Number of Payments:</strong> 1</p>
                <PrincipalInterestPie principal={result2.principal} interest={result2.totalInterest} />
              </div>
            )}
          </ResultPanel>
        </div>
        {result2 && (
          <>
            <div className="mt-4 text-center">
              <button type="button" onClick={() => setShowDefSchedule(!showDefSchedule)} className={btnPrimary}>
                {showDefSchedule ? 'Hide' : 'Show'} Schedule Table
              </button>
            </div>
            {showDefSchedule && (
              <div className="mt-4">
                <div className="mb-3 flex flex-wrap justify-center gap-2">
                  <button type="button" onClick={() => setDefScheduleType('Annual')} className={btnToggle(defScheduleType === 'Annual')}>Annual Schedule</button>
                  <button type="button" onClick={() => setDefScheduleType('Monthly')} className={btnToggle(defScheduleType === 'Monthly')}>Monthly Schedule</button>
                </div>
                <ScheduleTable
                  rows={defScheduleType === 'Monthly' ? result2.monthlySchedule : result2.annualSchedule}
                  columns={['Sl#', 'Beginning Balance', 'Interest', 'Ending Balance']}
                />
              </div>
            )}
          </>
        )}
      </section>

      <section className="rounded-2xl border border-academic-200 bg-white p-4 shadow-sm sm:p-6">
        <SectionHeader title="Bond (Predetermined Due Amount)" />
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-academic-200 p-4">
            <LoanFields
              dueAmountLabel="Predetermined Due Amount"
              amountValue={bond.dueAmount}
              years={bond.years}
              months={bond.months}
              rate={bond.rate}
              compound={bond.compound}
              onAmountChange={(e) => setBond({ ...bond, dueAmount: e.target.value })}
              onYearsChange={(e) => setBond({ ...bond, years: e.target.value })}
              onMonthsChange={(e) => setBond({ ...bond, months: e.target.value })}
              onRateChange={(e) => setBond({ ...bond, rate: e.target.value })}
              onCompoundChange={(e) => setBond({ ...bond, compound: e.target.value })}
            />
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={calcBond} className={btnPrimary}>Calculate</button>
              <button
                type="button"
                onClick={() => {
                  setBond({ dueAmount: '', years: '', months: '', rate: '', compound: 'Annually(APY)' });
                  setResult3(null);
                  setShowBondSchedule(false);
                }}
                className={btnSecondary}
              >
                Clear
              </button>
            </div>
          </div>
          <ResultPanel title="Result" emptyText="Enter details and click Calculate.">
            {result3 && (
              <div className="space-y-2 text-sm text-academic-700">
                <p><strong className="text-blue-900">Present Value (Loan Today):</strong> ${formatCurrency(result3.presentValue)}</p>
                <p><strong className="text-blue-900">Due at Maturity:</strong> ${formatCurrency(result3.futureValue)}</p>
                <p><strong className="text-blue-900">Total Interest:</strong> ${formatCurrency(result3.totalInterest)}</p>
                <p><strong className="text-blue-900">Total Number of Payments:</strong> 1</p>
                <PrincipalInterestPie principal={result3.presentValue} interest={result3.totalInterest} />
              </div>
            )}
          </ResultPanel>
        </div>
        {result3 && (
          <>
            <div className="mt-4 text-center">
              <button type="button" onClick={() => setShowBondSchedule(!showBondSchedule)} className={btnPrimary}>
                {showBondSchedule ? 'Hide' : 'Show'} Schedule Table
              </button>
            </div>
            {showBondSchedule && (
              <div className="mt-4">
                <div className="mb-3 flex flex-wrap justify-center gap-2">
                  <button type="button" onClick={() => setBondScheduleType('Annual')} className={btnToggle(bondScheduleType === 'Annual')}>Annual Schedule</button>
                  <button type="button" onClick={() => setBondScheduleType('Monthly')} className={btnToggle(bondScheduleType === 'Monthly')}>Monthly Schedule</button>
                </div>
                <ScheduleTable
                  rows={bondScheduleType === 'Monthly' ? result3.monthlySchedule : result3.annualSchedule}
                  columns={['Sl#', 'Beginning Balance', 'Interest', 'Ending Balance']}
                />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
