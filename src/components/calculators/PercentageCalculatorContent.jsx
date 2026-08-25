import { PercentageCalculator } from '../math/PercentageCalculator';

export function PercentageCalculatorContent() {
  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-bold text-blue-900 md:text-3xl">Percentage Calculator</h1>

      <PercentageCalculator />

      <article className="rounded-2xl border border-academic-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-blue-900">Understanding Percentage: A Complete Guide</h2>

        <section className="mt-6">
          <h3 className="text-xl font-semibold text-blue-900">What is a Percentage?</h3>
          <p className="mt-2 leading-relaxed text-academic-700">
            A <strong>percentage</strong> is a way of expressing a number as a fraction of 100. It is
            denoted using the <strong>% symbol</strong>. For example, 50% means 50 out of 100, or simply
            one-half. Percentages are widely used in mathematics, finance, health, and daily life to compare
            quantities and show proportions in a simple format.
          </p>
        </section>

        <section className="mt-6">
          <h3 className="text-xl font-semibold text-blue-900">Why Do We Use Percentages?</h3>
          <p className="mt-2 leading-relaxed text-academic-700">
            Percentages make it easier to understand <strong>ratios and comparisons</strong>. Instead of
            saying “25 out of 200 students passed,” you can say “12.5% of students passed,” which is more
            concise and easier to interpret.
          </p>
          <ul className="mt-3 list-disc space-y-1 pl-6 text-academic-700">
            <li><strong>Shopping &amp; Discounts</strong> – e.g., 20% off a product.</li>
            <li><strong>Finance &amp; Banking</strong> – interest rates, tax rates, profit margins.</li>
            <li><strong>Health</strong> – body fat percentage, oxygen saturation.</li>
            <li><strong>Statistics</strong> – surveys, election results, population comparisons.</li>
          </ul>
        </section>

        <section className="mt-6">
          <h3 className="text-xl font-semibold text-blue-900">How to Calculate Percentages</h3>
          <ol className="mt-3 list-decimal space-y-4 pl-6 text-academic-700">
            <li>
              <strong>Finding X% of Y</strong>
              <br />
              Formula: (X / 100) × Y
              <br />
              Example: 20% of 150 = (20/100) × 150 = 30.
            </li>
            <li>
              <strong>Finding What Percentage One Number is of Another</strong>
              <br />
              Formula: (X / Y) × 100
              <br />
              Example: 30 is what % of 150? = (30/150) × 100 = 20%.
            </li>
            <li>
              <strong>Percentage Increase/Decrease</strong>
              <br />
              Formula: (New – Old) / Old × 100
              <br />
              Example: Price increased from 100 to 120 → (120–100)/100 × 100 = 20% increase.
            </li>
            <li>
              <strong>Reverse Percentage (Finding the Original Value)</strong>
              <br />
              Formula: Final ÷ (Percentage / 100)
              <br />
              Example: If 80 is 20% of a number → 80 ÷ (20/100) = 400.
            </li>
          </ol>
        </section>

        <section className="mt-6">
          <h3 className="text-xl font-semibold text-blue-900">Common Real-Life Applications of Percentages</h3>
          <ul className="mt-3 list-disc space-y-1 pl-6 text-academic-700">
            <li><strong>Grades in Education</strong>: Student scoring 450 out of 600 → 75%.</li>
            <li><strong>Loan Interest</strong>: Banks use interest rates expressed in %.</li>
            <li><strong>Nutrition Labels</strong>: Daily value percentages show nutrient contribution.</li>
            <li><strong>Profit &amp; Loss</strong>: Businesses measure growth, margins, and expenses in %.</li>
            <li><strong>Probability &amp; Risk</strong>: Insurance and investment sectors use % to calculate chances.</li>
          </ul>
        </section>

        <section className="mt-6">
          <h3 className="text-xl font-semibold text-blue-900">Frequently Asked Questions (Q&amp;A)</h3>
          <div className="mt-4 space-y-4 text-academic-700">
            <div>
              <p className="font-semibold text-blue-900">1. What does 100% mean?</p>
              <p className="mt-1">
                100% means the <strong>whole</strong> of something. For example, eating 100% of a pizza
                means you ate the entire pizza.
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-900">2. What does it mean when something is more than 100%?</p>
              <p className="mt-1">
                More than 100% shows a value <strong>greater than the original amount</strong>. For example,
                120% growth means the value has more than doubled compared to the base.
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-900">3. What’s the difference between percentage and percentile?</p>
              <p className="mt-1">
                A <strong>percentage</strong> shows a portion out of 100, while a <strong>percentile</strong> is
                a ranking system (e.g., being in the 90th percentile means you scored better than 90% of people).
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-900">4. How do I quickly calculate percentages in my head?</p>
              <ul className="mt-1 list-disc pl-6">
                <li>10% of a number = move decimal one place left.</li>
                <li>50% of a number = half of it.</li>
                <li>25% of a number = divide by 4.</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-blue-900">5. What is percentage change?</p>
              <p className="mt-1">
                Percentage change shows how much a value has increased or decreased compared to its original.
                It is widely used in prices, salaries, and population statistics.
              </p>
            </div>
          </div>
        </section>
      </article>
    </div>
  );
}
