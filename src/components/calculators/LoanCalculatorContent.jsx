import { LoanCalculator } from '../financial/LoanCalculator';
import { TopicHeader } from '../TopicHeader';

function FormulaBox({ children }) {
  return (
    <pre className="mt-3 whitespace-pre-wrap rounded-lg border border-academic-200 bg-academic-50 p-4 text-sm text-academic-800">
      {children}
    </pre>
  );
}

function ExampleCard({ title, children }) {
  return (
    <div className="mt-4 rounded-lg border border-academic-200 bg-academic-50 p-4">
      <h4 className="font-semibold text-blue-900">{title}</h4>
      <div className="mt-2 space-y-2 text-academic-700">{children}</div>
    </div>
  );
}

export function LoanCalculatorContent() {
  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <TopicHeader breadcrumb="Math Calculators › Loan Calculator" title="Loan Calculator" />
      <div className="mx-auto max-w-4xl space-y-3 text-academic-700">
          <p>
            A loan is a financial agreement between a lender and a borrower, where the borrower is given a sum
            of money—the principal—and must pay it back over time. Loans are among the most popular methods
            people and companies use to borrow money, and they are typically classified into three general
            categories:
          </p>
          <p>
            <strong className="text-lg text-blue-900">An amortized loan</strong> is repaid with set, regular
            payments until the loan matures.
          </p>
          <p>
            <strong className="text-lg text-blue-900">A deferred payment loan</strong> makes no payments over
            the term but is repaid with one lump sum at maturity.
          </p>
          <p>
            <strong className="text-lg text-blue-900">Bonds</strong> guarantee a set lump sum—the face value or
            par value—to be paid to the bondholder at maturity.
          </p>
      </div>

      <LoanCalculator />

      <article className="space-y-6 rounded-2xl border border-academic-200 bg-white p-6 shadow-sm">
        <h2 className="text-center text-2xl font-bold text-blue-900">
          Amortized Loan Calculator – Understand Your Payments Clearly
        </h2>

        <section>
          <h3 className="text-xl font-semibold text-blue-900">Introduction</h3>
          <p className="mt-2 text-academic-700">
            An <strong>Amortized Loan</strong> is one of the most common types of loans, where borrowers pay
            back the loan in equal installments over time. Each payment is split into principal (the amount
            borrowed) and interest (the cost of borrowing). This type of loan is widely used for mortgages, car
            loans, and personal loans because it gives predictable monthly payments.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-blue-900">How Amortized Loans Work</h3>
          <p className="mt-2 text-academic-700">
            Amortization means the loan is gradually paid down with regular payments until the balance reaches zero.
          </p>
          <FormulaBox>
            {`M = (P × r × (1 + r)^n) / ((1 + r)^n − 1)

Where:
• M = Monthly Payment
• P = Loan Amount (Principal)
• r = Monthly Interest Rate (Annual Rate ÷ 12)
• n = Total Number of Payments (Loan Term in Months)`}
          </FormulaBox>
          <p className="mt-3 text-academic-700">
            With each payment, the interest portion decreases while the principal portion increases.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-blue-900">Step-by-Step Guide</h3>
          <ol className="mt-3 list-decimal space-y-2 pl-6 text-academic-700">
            <li>Enter Loan Amount – how much you want to borrow.</li>
            <li>Select Loan Term – years and months for repayment.</li>
            <li>Enter Interest Rate – annual percentage rate (APR).</li>
            <li>Choose Compounding – monthly, quarterly, or annually.</li>
            <li>Pick Payback Frequency – monthly, weekly, or yearly payments.</li>
            <li>Click Calculate – see installment, total payment, and interest.</li>
            <li>View Schedule Table – annual or monthly breakdown of payments.</li>
          </ol>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-blue-900">Worked-Out Examples</h3>
          <ExampleCard title="Example 1: Mortgage Loan">
            <ul className="list-disc pl-6">
              <li>Loan Amount: $300,000</li>
              <li>Term: 30 years at 6% annually, monthly payments</li>
            </ul>
            <p className="mt-2">Monthly Payment ≈ <strong>$1,799</strong>; Total Interest ≈ <strong>$347,514</strong></p>
          </ExampleCard>
          <ExampleCard title="Example 2: Car Loan">
            <ul className="list-disc pl-6">
              <li>Loan Amount: $20,000</li>
              <li>Term: 5 years at 5% annually, monthly payments</li>
            </ul>
            <p className="mt-2">Monthly Payment ≈ <strong>$377</strong>; Total Interest ≈ <strong>$2,620</strong></p>
          </ExampleCard>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-blue-900">FAQ</h3>
          <div className="mt-3 space-y-3 text-academic-700">
            <p><strong className="text-blue-900">What is an amortized loan?</strong> A loan repaid through regular installments covering both principal and interest until fully paid off.</p>
            <p><strong className="text-blue-900">Why does interest decrease over time?</strong> Interest is calculated on the remaining balance, which shrinks with each payment.</p>
            <p><strong className="text-blue-900">Can I pay off early?</strong> Yes. Extra payments reduce principal faster and lower total interest.</p>
          </div>
        </section>
      </article>

      <article className="space-y-6 rounded-2xl border border-academic-200 bg-white p-6 shadow-sm">
        <h2 className="text-center text-2xl font-bold text-blue-900">
          Deferred Payment Loan – Paying Back a Lump Sum at Maturity
        </h2>

        <section>
          <h3 className="text-xl font-semibold text-blue-900">Introduction</h3>
          <p className="mt-2 text-academic-700">
            A <strong>Deferred Payment Loan</strong> allows the borrower to delay all payments until the end of
            the loan term, then repay a lump sum including principal and accumulated interest at maturity.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-blue-900">How Deferred Payment Loans Work</h3>
          <FormulaBox>
            {`A = P × (1 + r/n)^(n × t)

Where:
• A = Amount due at maturity
• P = Loan Amount (Principal)
• r = Annual Interest Rate
• n = Compounding periods per year
• t = Loan Term in years`}
          </FormulaBox>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-blue-900">Worked-Out Examples</h3>
          <ExampleCard title="Example 1: Education Loan">
            <p>$10,000 for 4 years at 5% annually → Total Due ≈ <strong>$12,155</strong></p>
          </ExampleCard>
          <ExampleCard title="Example 2: Short-Term Business Loan">
            <p>$50,000 for 2 years at 8% quarterly → Total Due ≈ <strong>$58,659</strong></p>
          </ExampleCard>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-blue-900">FAQ</h3>
          <div className="mt-3 space-y-3 text-academic-700">
            <p><strong className="text-blue-900">What is a deferred payment loan?</strong> No payments during the term; one lump sum at maturity.</p>
            <p><strong className="text-blue-900">Are deferred loans risky?</strong> Yes—the final lump sum can be large, so planning is essential.</p>
          </div>
        </section>
      </article>

      <article className="space-y-6 rounded-2xl border border-academic-200 bg-white p-6 shadow-sm">
        <h2 className="text-center text-2xl font-bold text-blue-900">
          Bond Loan Calculator – Paying Back a Predetermined Amount at Maturity
        </h2>

        <section>
          <h3 className="text-xl font-semibold text-blue-900">Introduction</h3>
          <p className="mt-2 text-academic-700">
            A bond loan is structured so the borrower repays a predetermined lump sum at maturity instead of
            equal installments. Common in zero-coupon bonds and corporate debt financing.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-blue-900">How Bond Loans Work</h3>
          <FormulaBox>
            {`P = F ÷ (1 + r)^n

Where:
• P = Present Value (Loan Amount)
• F = Future Value (Due Amount at maturity)
• r = Interest Rate per period
• n = Number of compounding periods`}
          </FormulaBox>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-blue-900">Worked-Out Examples</h3>
          <ExampleCard title="Example 1: Zero-Coupon Bond">
            <p>Future Value $10,000, 10 years at 5% annually → Present Value ≈ <strong>$6,139</strong></p>
          </ExampleCard>
          <ExampleCard title="Example 2: Corporate Bond">
            <p>Future Value $50,000, 5 years at 7% semi-annually → Present Value ≈ <strong>$35,622</strong></p>
          </ExampleCard>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-blue-900">Conclusion</h3>
          <p className="mt-2 text-academic-700">
            The Loan Calculator helps you compare amortized, deferred, and bond-style loans. Use the three
            calculators above to estimate payments, total interest, and growth schedules, then plan borrowing
            with clarity and confidence.
          </p>
        </section>
      </article>
    </div>
  );
}
