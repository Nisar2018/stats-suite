import { FinanceCalculator } from '../financial/FinanceCalculator';

export function FinanceCalculatorContent() {
  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-bold text-blue-900 md:text-3xl">Finance Calculator</h1>
        <p className="mt-3 max-w-4xl leading-relaxed text-academic-700">
          A finance calculator simplifies the solution of most time value of money problems. It is
          simple to calculate the Future Value (FV), Present Value (PV), Interest Rate (I/Y), Periodic
          Payment (PMT), and Number of Compounding Periods (N). Each tab is formatted to help you
          obtain the precise value you require with a few clicks. It works like well-known financial
          calculators such as the BA II Plus or HP 12CP, in a convenient online version.
        </p>
      </div>

      <FinanceCalculator />

      <article className="rounded-2xl border border-academic-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-blue-900">Finance Calculator Guide</h2>

        <section className="mt-6">
          <h3 className="text-xl font-semibold text-blue-900">Introduction</h3>
          <p className="mt-2 text-academic-700">
            A Finance Calculator helps you solve time value of money (TVM) problems by calculating{' '}
            <strong>Future Value (FV)</strong>, <strong>Present Value (PV)</strong>,{' '}
            <strong>Payment (PMT)</strong>, <strong>Interest Rate (I/Y)</strong>, and{' '}
            <strong>Number of Periods (N)</strong>.
          </p>
          <p className="mt-2 text-academic-700">People use it in real-life applications such as:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-academic-700">
            <li>Investment planning (e.g., future value of savings)</li>
            <li>Loan amortization (monthly installments and interest cost)</li>
            <li>Retirement planning (how much to save every month)</li>
            <li>Business valuation (discounted cash flows, present value)</li>
          </ul>
        </section>

        <section className="mt-6">
          <h3 className="text-xl font-semibold text-blue-900">How the Finance Calculator Works</h3>
          <p className="mt-2 text-academic-700">The calculator uses the time value of money (TVM) formulas:</p>
          <ol className="mt-3 list-decimal space-y-2 pl-6 text-academic-700">
            <li>
              <strong>Future Value (FV):</strong>{' '}
              <code className="rounded bg-academic-100 px-1">FV = PV × (1 + r)^n + PMT × ((1 + r)^n - 1) / r</code>
            </li>
            <li>
              <strong>Present Value (PV):</strong>{' '}
              <code className="rounded bg-academic-100 px-1">PV = FV / (1 + r)^n - PMT × (1 - (1 + r)^(-n)) / r</code>
            </li>
            <li>
              <strong>Payment (PMT):</strong>{' '}
              <code className="rounded bg-academic-100 px-1">PMT = ((FV - PV × (1 + r)^n) × r) / ((1 + r)^n - 1)</code>
            </li>
            <li>
              <strong>Interest Rate (I/Y or r):</strong> No closed form — solved iteratively (e.g., Newton-Raphson).
            </li>
            <li>
              <strong>Number of Periods (N):</strong>{' '}
              <code className="rounded bg-academic-100 px-1">n = ln((FV × r + PMT) / (PV × r + PMT)) / ln(1 + r)</code>
            </li>
          </ol>
        </section>

        <section className="mt-6">
          <h3 className="text-xl font-semibold text-blue-900">Step-by-Step Guide</h3>
          <ol className="mt-3 list-decimal space-y-1 pl-6 text-academic-700">
            <li>Choose which value you want to calculate (FV, PV, PMT, I/Y, or N).</li>
            <li>Enter known inputs (e.g., interest rate, periods, payments).</li>
            <li>Click “Calculate”.</li>
            <li>View results instantly, including total payments and total interest.</li>
          </ol>
        </section>

        <section className="mt-6">
          <h3 className="text-xl font-semibold text-blue-900">Examples</h3>
          <div className="mt-4 space-y-4 text-academic-700">
            <div>
              <h4 className="font-semibold text-blue-900">Example 1 – Future Value (FV)</h4>
              <p>
                You invest $5,000 (PV) for 5 years (n) at 6% annual interest (I/Y) compounded annually,
                with no periodic payments (PMT=0).
              </p>
              <p className="mt-1 font-mono text-sm">FV = 5000 × (1 + 0.06)^5 = 6691.00</p>
              <p className="mt-1">Future Value = $6,691.00</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Example 2 – Present Value (PV)</h4>
              <p>
                You want $20,000 (FV) after 10 years (n) with 5% annual interest (I/Y) and no additional
                payments (PMT=0).
              </p>
              <p className="mt-1 font-mono text-sm">PV = 20000 / (1 + 0.05)^10 = 12,289.00</p>
              <p className="mt-1">Present Value = $12,289.00</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Example 3 – Payment (PMT)</h4>
              <p>
                You borrow $10,000 (PV) for 4 years (n=48 months) at 8% annual interest (0.08/12 monthly).
              </p>
              <p className="mt-1 font-mono text-sm">PMT = (10000 × 0.0067) / (1 - (1 + 0.0067)^(-48)) = 244.13</p>
              <p className="mt-1">Monthly Payment = $244.13</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Example 4 – Interest Rate (I/Y)</h4>
              <p>You invest $2,000 (PV) for 8 years (n), and it grows to $3,500 (FV) with no payments.</p>
              <p className="mt-1 font-mono text-sm">r = (3500 / 2000)^(1/8) - 1 = 0.0601</p>
              <p className="mt-1">Annual Interest Rate ≈ 6.01%</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Example 5 – Number of Periods (N)</h4>
              <p>You want your $5,000 (PV) investment to grow to $10,000 (FV) at 7% annual interest (I/Y).</p>
              <p className="mt-1 font-mono text-sm">n = ln(10000 / 5000) / ln(1.07) = 10.24</p>
              <p className="mt-1">Number of Years ≈ 10.2 years</p>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h3 className="text-xl font-semibold text-blue-900">Applications in Real Life</h3>
          <ul className="mt-3 list-disc space-y-1 pl-6 text-academic-700">
            <li>Loans &amp; Mortgages → monthly installments, interest costs.</li>
            <li>Investments → estimate savings growth.</li>
            <li>Retirement Planning → required contributions for target wealth.</li>
            <li>Corporate Finance → project evaluation, discounted cash flows.</li>
          </ul>
        </section>

        <section className="mt-6">
          <h3 className="text-xl font-semibold text-blue-900">Frequently Asked Questions (FAQ)</h3>
          <div className="mt-4 space-y-3 text-academic-700">
            <details className="rounded-lg border border-academic-200 p-3">
              <summary className="cursor-pointer font-semibold text-blue-900">
                What is the most common use of a Finance Calculator?
              </summary>
              <p className="mt-2">Mainly for loan amortization and investment growth calculations.</p>
            </details>
            <details className="rounded-lg border border-academic-200 p-3">
              <summary className="cursor-pointer font-semibold text-blue-900">
                Can this calculator handle monthly compounding?
              </summary>
              <p className="mt-2">Yes, divide annual interest by 12 and multiply years by 12 for monthly periods.</p>
            </details>
            <details className="rounded-lg border border-academic-200 p-3">
              <summary className="cursor-pointer font-semibold text-blue-900">
                What is the difference between PV and FV?
              </summary>
              <p className="mt-2">
                PV is today’s value of money, while FV is its worth in the future after interest.
              </p>
            </details>
            <details className="rounded-lg border border-academic-200 p-3">
              <summary className="cursor-pointer font-semibold text-blue-900">
                Why is the interest rate (I/Y) harder to calculate?
              </summary>
              <p className="mt-2">
                It requires iterative methods because there is no direct algebraic formula.
              </p>
            </details>
            <details className="rounded-lg border border-academic-200 p-3">
              <summary className="cursor-pointer font-semibold text-blue-900">
                Can I use this for retirement savings?
              </summary>
              <p className="mt-2">Yes, it helps estimate how much to save monthly to reach your retirement goal.</p>
            </details>
          </div>
        </section>

        <section className="mt-6">
          <h3 className="text-xl font-semibold text-blue-900">Conclusion</h3>
          <p className="mt-2 text-academic-700">
            The Finance Calculator is an essential tool for anyone managing loans, savings, or investments.
            It ensures accuracy, saves time, and provides instant insights into payments, total interest,
            and returns.
          </p>
          <p className="mt-2 font-semibold text-blue-900">
            Try the calculator above and take control of your financial planning.
          </p>
        </section>
      </article>
    </div>
  );
}
