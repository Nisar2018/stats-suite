import { useState } from 'react';
import { MortgageCalculator } from '../financial/MortgageCalculator';
import { TopicHeader } from '../TopicHeader';

const FAQS = [
  {
    q: 'Is a mortgage calculator accurate?',
    a: 'Yes, it provides a reliable estimate based on your inputs. However, actual payments may vary slightly due to taxes, insurance, or lender fees.',
  },
  {
    q: 'Can I use it for refinancing?',
    a: 'Absolutely. A mortgage calculator can help you compare your current mortgage with a new loan option to see potential savings.',
  },
  {
    q: 'Does it include property taxes and insurance?',
    a: 'Most basic calculators do not include taxes or insurance. They focus on principal and interest. For complete costs, you may need an advanced calculator.',
  },
  {
    q: 'Is a 15-year mortgage better than a 30-year mortgage?',
    a: 'It depends on your goals. A 15-year mortgage has higher monthly payments but saves you significant interest in the long run. A 30-year mortgage has smaller payments but higher overall cost.',
  },
  {
    q: 'How can I pay off my mortgage faster?',
    a: 'Making extra principal payments, refinancing to a shorter term, or rounding up your monthly payments can help reduce your mortgage term and interest costs.',
  },
];

export function MortgageCalculatorContent() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <TopicHeader
        breadcrumb="Math Calculators › Mortgage Calculator"
        title="Mortgage Calculator"
      />
      <p className="max-w-4xl leading-relaxed text-academic-700">
          A mortgage calculator is a simple yet powerful online tool that helps you estimate your monthly
          loan payments, interest costs, and the overall cost of buying a home. By entering details such as
          loan amount, interest rate, tenure, and repayment type, you can get a clear breakdown of your
          mortgage in seconds. This allows you to plan your budget, compare loan options, and make smarter
          financial decisions when purchasing a property.
      </p>

      <MortgageCalculator />

      <article className="space-y-6 rounded-2xl border border-academic-200 bg-white p-6 shadow-sm text-academic-700">
        <section>
          <h2 className="text-2xl font-bold text-blue-900">What Is a Mortgage Calculator?</h2>
          <p className="mt-3 leading-relaxed">
            A mortgage calculator is a digital financial planning tool that provides a quick estimate of your
            loan repayment schedule. It calculates your monthly payments based on the loan principal, interest
            rate, and repayment term. The calculator can also show an amortization table, which splits each
            payment into interest and principal portions, helping you understand how your loan balance
            decreases over time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-blue-900">Mortgage Payment Formula</h2>
          <p className="mt-3">The formula used to calculate a fixed-rate mortgage payment is:</p>
          <p className="mt-2 rounded-lg bg-academic-50 p-3 font-mono text-sm">
            M = P × [ r(1 + r)<sup>n</sup> ] ÷ [ (1 + r)<sup>n</sup> – 1 ]
          </p>
          <p className="mt-3">Where:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li><strong>M</strong> = Monthly payment</li>
            <li><strong>P</strong> = Loan principal (amount borrowed)</li>
            <li><strong>r</strong> = Monthly interest rate (annual rate ÷ 12)</li>
            <li><strong>n</strong> = Total number of monthly payments (loan term × 12)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-blue-900">Mortgage Calculation Example – 30-Year Loan</h2>
          <p className="mt-3">
            Suppose you take out a home loan of <strong>$200,000</strong> with a fixed annual interest rate of{' '}
            <strong>6%</strong> for <strong>30 years</strong>.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Loan amount (P) = $200,000</li>
            <li>Annual interest rate = 6% → Monthly rate (r) = 0.06 ÷ 12 = 0.005</li>
            <li>Loan term = 30 years → n = 30 × 12 = 360 months</li>
          </ul>
          <p className="mt-2 rounded-lg bg-academic-50 p-3 font-mono text-sm">
            M = 200,000 × [0.005(1 + 0.005)<sup>360</sup>] ÷ [(1 + 0.005)<sup>360</sup> – 1]
          </p>
          <p className="mt-3">
            Result: The monthly payment is approximately <strong>$1,199.10</strong>. Over 30 years, you will
            pay about <strong>$431,676</strong>, of which <strong>$231,676</strong> is interest.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-blue-900">Mortgage Calculation Example – 15-Year Loan</h2>
          <p className="mt-3">
            Now, compare the same loan of <strong>$200,000</strong> at <strong>6% interest</strong> for a
            shorter term of <strong>15 years</strong>.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Loan amount (P) = $200,000</li>
            <li>Monthly rate (r) = 0.06 ÷ 12 = 0.005</li>
            <li>Loan term = 15 years → n = 15 × 12 = 180 months</li>
          </ul>
          <p className="mt-2 rounded-lg bg-academic-50 p-3 font-mono text-sm">
            M = 200,000 × [0.005(1 + 0.005)<sup>180</sup>] ÷ [(1 + 0.005)<sup>180</sup> – 1]
          </p>
          <p className="mt-3">
            Result: The monthly payment is approximately <strong>$1,687.71</strong>. Over 15 years, you will
            pay about <strong>$303,788</strong>, of which only <strong>$103,788</strong> is interest.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-blue-900">Why Use a Mortgage Calculator?</h2>
          <ul className="mt-3 list-disc space-y-1 pl-6">
            <li>Plan your home loan repayment effectively.</li>
            <li>Compare different loan terms and interest rates.</li>
            <li>Understand how extra payments affect your loan payoff.</li>
            <li>Get a clear picture of your monthly financial commitments.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-blue-900">Frequently Asked Questions</h2>
          <div className="mt-4 space-y-3">
            {FAQS.map((faq, index) => (
              <div key={faq.q} className="overflow-hidden rounded-lg border border-academic-200">
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="flex w-full items-center justify-between p-3 text-left font-semibold text-blue-900 hover:bg-academic-50"
                >
                  {faq.q}
                  <span aria-hidden="true">{openIndex === index ? '−' : '+'}</span>
                </button>
                {openIndex === index && <div className="border-t border-academic-200 p-3">{faq.a}</div>}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-blue-900">Conclusion</h2>
          <p className="mt-3 leading-relaxed">
            A mortgage calculator is more than just a tool—it helps you make informed financial decisions
            before committing to a home loan. By clearly breaking down your monthly payments, interest costs,
            and amortization schedule, it empowers you to compare different loan terms, plan your budget wisely,
            and save money in the long run. Whether you are buying your first home, refinancing, or exploring
            loan options, using a mortgage calculator ensures that you stay financially prepared and confident
            in your journey toward homeownership.
          </p>
          <p className="mt-4 font-semibold text-blue-900">
            Try the calculator above and plan your loan with clarity and confidence.
          </p>
        </section>
      </article>
    </div>
  );
}
