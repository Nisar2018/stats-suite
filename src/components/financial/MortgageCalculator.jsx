import { useState } from 'react';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const DEFAULT_FORM = {
  homePrice: 300000,
  downPayment: 60000,
  downType: '$',
  loanTerm: 30,
  interestRate: 6,
  startMonth: 'Jan',
  startYear: 2025,
  includeTaxes: false,
  propertyTaxes: 2000,
  propertyTaxType: '$',
  insurance: 1200,
  insuranceType: '$',
  pmi: 0,
  pmiType: '%',
  hoa: 0,
  hoaType: '$',
  otherCost: 0,
  otherType: '$',
};

const inputClass =
  'w-full rounded-lg border border-academic-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';
const selectClass =
  'rounded-lg border border-academic-300 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';

const TAX_FIELDS = [
  ['propertyTaxes', 'Property Taxes', 'propertyTaxType'],
  ['insurance', 'Home Insurance', 'insuranceType'],
  ['pmi', 'PMI Insurance', 'pmiType'],
  ['hoa', 'HOA Fee', 'hoaType'],
  ['otherCost', 'Other Cost', 'otherType'],
];

export function MortgageCalculator() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [result, setResult] = useState(null);
  const [scheduleType, setScheduleType] = useState('monthly');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const calculateMortgage = () => {
    const homePrice = Number(form.homePrice);
    const principal =
      form.downType === '$'
        ? homePrice - Number(form.downPayment)
        : homePrice - (homePrice * Number(form.downPayment)) / 100;

    const monthlyRate = Number(form.interestRate) / 100 / 12;
    const numberOfPayments = Number(form.loanTerm) * 12;

    const monthlyPrincipalAndInterest =
      (principal * monthlyRate * (1 + monthlyRate) ** numberOfPayments) /
      ((1 + monthlyRate) ** numberOfPayments - 1);

    let extraCosts = 0;
    if (form.includeTaxes) {
      const calcExtra = (value, type) =>
        type === '$' ? Number(value) / 12 : (homePrice * Number(value)) / 100 / 12;

      extraCosts += calcExtra(form.propertyTaxes, form.propertyTaxType);
      extraCosts += calcExtra(form.insurance, form.insuranceType);
      extraCosts += calcExtra(form.pmi, form.pmiType);
      extraCosts += calcExtra(form.hoa, form.hoaType);
      extraCosts += calcExtra(form.otherCost, form.otherType);
    }

    const monthlyPayment = monthlyPrincipalAndInterest + extraCosts;
    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    let balance = principal;
    const amortization = [];
    const yearlySummary = {};

    for (let i = 1; i <= numberOfPayments; i += 1) {
      const interest = balance * monthlyRate;
      const principalPaid = monthlyPrincipalAndInterest - interest;
      balance -= principalPaid;

      const year = Number(form.startYear) + Math.floor((i - 1) / 12);
      const monthIndex = (MONTHS.indexOf(form.startMonth) + i - 1) % 12;
      const date = `${MONTHS[monthIndex]} ${year}`;

      amortization.push({
        month: i,
        date,
        interest: interest.toFixed(2),
        principal: principalPaid.toFixed(2),
        balance: balance > 0 ? balance.toFixed(2) : '0.00',
      });

      if (!yearlySummary[year]) {
        yearlySummary[year] = { year, balance: 0, interest: 0, payment: 0 };
      }
      yearlySummary[year].balance = balance > 0 ? balance : 0;
      yearlySummary[year].interest += interest;
      yearlySummary[year].payment += monthlyPayment;
    }

    const yearlyData = Object.values(yearlySummary).map((d) => ({
      year: d.year,
      balance: Number(d.balance.toFixed(2)),
      interest: Number(d.interest.toFixed(2)),
      payment: Number(d.payment.toFixed(2)),
    }));

    setResult({
      monthlyPayment: monthlyPayment.toFixed(2),
      homePrice,
      downPayment:
        form.downType === '$' ? Number(form.downPayment) : (homePrice * Number(form.downPayment)) / 100,
      totalPayments: numberOfPayments,
      totalMortgage: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      startDate: `${form.startMonth} ${form.startYear}`,
      chartData: [
        { name: 'Principal', value: principal },
        { name: 'Interest', value: totalInterest },
      ],
      amortization,
      yearlyData,
    });
  };

  const clearForm = () => {
    setForm(DEFAULT_FORM);
    setResult(null);
  };

  const scheduleRows =
    scheduleType === 'monthly'
      ? result?.amortization ?? []
      : (result?.amortization ?? []).filter((_, i) => (i + 1) % 12 === 0);

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-academic-200 bg-academic-50 p-4 shadow-sm">
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <label className="text-sm font-semibold text-academic-700 sm:w-40">Home Price</label>
              <input
                type="number"
                name="homePrice"
                value={form.homePrice}
                onChange={handleChange}
                className={`sm:w-2/3 ${inputClass}`}
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <label className="text-sm font-semibold text-academic-700 sm:w-40">Down Payment</label>
              <div className="flex min-w-0 gap-2 sm:w-2/3">
                <input
                  type="number"
                  name="downPayment"
                  value={form.downPayment}
                  onChange={handleChange}
                  className={`min-w-0 flex-1 ${inputClass}`}
                />
                <select name="downType" value={form.downType} onChange={handleChange} className={`w-20 ${selectClass}`}>
                  <option value="$">$</option>
                  <option value="%">%</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <label className="text-sm font-semibold text-academic-700 sm:w-40">Loan Term (years)</label>
              <input
                type="number"
                name="loanTerm"
                value={form.loanTerm}
                onChange={handleChange}
                className={`sm:w-2/3 ${inputClass}`}
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <label className="text-sm font-semibold text-academic-700 sm:w-40">Interest Rate (%)</label>
              <input
                type="number"
                name="interestRate"
                value={form.interestRate}
                onChange={handleChange}
                className={`sm:w-2/3 ${inputClass}`}
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <label className="text-sm font-semibold text-academic-700 sm:w-40">Start Date</label>
              <div className="flex min-w-0 gap-2 sm:w-2/3">
                <select name="startMonth" value={form.startMonth} onChange={handleChange} className={`min-w-0 flex-1 ${selectClass}`}>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="startYear"
                  value={form.startYear}
                  onChange={handleChange}
                  className={`w-24 ${inputClass}`}
                />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-academic-700">
              <input type="checkbox" name="includeTaxes" checked={form.includeTaxes} onChange={handleChange} />
              Include taxes and costs below
            </label>

            {form.includeTaxes && (
              <div className="space-y-3 border-l-2 border-academic-200 pl-4">
                <p className="font-semibold text-blue-900">Annual Tax and Cost</p>
                {TAX_FIELDS.map(([field, label, typeField]) => (
                  <div key={field} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <label className="text-sm font-semibold text-academic-700 sm:w-40">{label}</label>
                    <div className="flex min-w-0 gap-2 sm:w-2/3">
                      <input
                        type="number"
                        name={field}
                        value={form[field]}
                        onChange={handleChange}
                        className={`min-w-0 flex-1 ${inputClass}`}
                      />
                      <select
                        name={typeField}
                        value={form[typeField]}
                        onChange={handleChange}
                        className={`w-20 ${selectClass}`}
                      >
                        <option value="$">$</option>
                        <option value="%">%</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={calculateMortgage}
                className="rounded-lg bg-blue-900 px-5 py-2 text-sm font-medium text-white hover:bg-blue-800"
              >
                Calculate
              </button>
              <button
                type="button"
                onClick={clearForm}
                className="rounded-lg bg-academic-600 px-5 py-2 text-sm font-medium text-white hover:bg-academic-700"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-academic-200 bg-white shadow-sm">
          <h3 className="rounded-t-2xl bg-blue-900 p-3 text-center text-lg font-semibold text-white">Result</h3>
          <div className="space-y-2 p-4 text-sm text-academic-700">
            {result ? (
              <>
                <p><strong className="text-blue-900">Monthly Pay:</strong> ${result.monthlyPayment}</p>
                <p><strong className="text-blue-900">Home Price:</strong> ${result.homePrice.toLocaleString()}</p>
                <p><strong className="text-blue-900">Down Payment:</strong> ${result.downPayment.toLocaleString()}</p>
                <p><strong className="text-blue-900">Total Payments:</strong> {result.totalPayments}</p>
                <p><strong className="text-blue-900">Total Mortgage Payment:</strong> ${result.totalMortgage}</p>
                <p><strong className="text-blue-900">Total Interest:</strong> ${result.totalInterest}</p>
                <p><strong className="text-blue-900">Mortgage Start Date:</strong> {result.startDate}</p>

                <div className="h-64 pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={result.chartData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        innerRadius={40}
                        label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                      >
                        <Cell fill="#16a34a" />
                        <Cell fill="#dc2626" />
                      </Pie>
                      <Tooltip formatter={(val) => `$${Number(val).toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <p className="py-8 text-center text-academic-600">Enter details and click Calculate.</p>
            )}
          </div>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-academic-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-academic-200 p-4">
              <h3 className="text-xl font-bold text-blue-900">Amortization Table</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setScheduleType('monthly')}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                    scheduleType === 'monthly' ? 'bg-blue-900 text-white' : 'bg-academic-100 text-academic-800'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleType('annual')}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                    scheduleType === 'annual' ? 'bg-blue-900 text-white' : 'bg-academic-100 text-academic-800'
                  }`}
                >
                  Annual
                </button>
              </div>
            </div>
            <div className="max-h-96 overflow-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 bg-academic-700 text-white">
                  <tr>
                    <th className="border border-academic-600 px-2 py-2">{scheduleType === 'monthly' ? 'Month' : 'Year'}</th>
                    <th className="border border-academic-600 px-2 py-2">Date</th>
                    <th className="border border-academic-600 px-2 py-2">Interest</th>
                    <th className="border border-academic-600 px-2 py-2">Principal</th>
                    <th className="border border-academic-600 px-2 py-2">Ending Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {scheduleRows.map((row, i) => (
                    <tr key={`${row.month}-${row.date}`} className={i % 2 === 0 ? 'bg-white' : 'bg-academic-50'}>
                      <td className="border border-academic-200 px-2 py-1.5">
                        {scheduleType === 'monthly' ? row.month : Math.ceil(row.month / 12)}
                      </td>
                      <td className="border border-academic-200 px-2 py-1.5">{row.date}</td>
                      <td className="border border-academic-200 px-2 py-1.5">${row.interest}</td>
                      <td className="border border-academic-200 px-2 py-1.5">${row.principal}</td>
                      <td className="border border-academic-200 px-2 py-1.5">${row.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-academic-200 bg-white p-4 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-blue-900">Balance, Interest &amp; Payment Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v)} />
                  <Tooltip formatter={(val) => `$${Number(val).toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="balance" stroke="#2563eb" name="Balance" dot={false} />
                  <Line type="monotone" dataKey="interest" stroke="#16a34a" name="Interest" dot={false} />
                  <Line type="monotone" dataKey="payment" stroke="#ea580c" name="Payment" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
