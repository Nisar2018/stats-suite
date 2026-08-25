import { GWACalculator } from '../math/GWACalculator';

const FAQS = [
  {
    q: 'What is GWA and why is it important?',
    a: 'GWA stands for General Weighted Average. It measures your overall academic performance weighted by the units of each subject. It is important for scholarships, honors, and graduation eligibility.',
  },
  {
    q: 'How is the GWA calculated?',
    a: 'Multiply each subject grade by its units, sum all results, and divide by total units. This weighted formula ensures that courses with more units have a bigger impact.',
  },
  {
    q: 'Can I use this calculator on my phone?',
    a: 'Yes. The calculator is fully responsive and works on smartphones, tablets, and desktops.',
  },
  {
    q: 'What grade scale does this calculator use?',
    a: 'It supports numeric grades (1.0–5.0 or 0–100 depending on your institution). Enter the numbers according to your grading system.',
  },
  {
    q: 'Can I calculate multiple semesters?',
    a: 'Yes. Calculate each semester separately and then combine results using the same weighted formula.',
  },
];

export function GWACalculatorContent() {
  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div>
        <h1 className="text-center text-2xl font-bold text-blue-900 md:text-3xl">
          Free Online GWA Calculator
        </h1>
        <p className="mx-auto mt-3 max-w-4xl text-lg leading-relaxed text-academic-700">
          Use this <strong>GWA Calculator</strong> to quickly and accurately compute your General Weighted
          Average. Enter your grades and units for each subject, and the calculator will provide your overall
          academic performance instantly. Perfect for students tracking their GPA or planning for honors and
          scholarships.
        </p>
      </div>

      <div className="mx-auto max-w-lg rounded-2xl border-4 border-blue-100 bg-white p-4 shadow-md sm:p-6">
        <GWACalculator />
      </div>

      <article className="mx-auto max-w-4xl space-y-6">
        <h2 className="text-center text-2xl font-bold text-blue-900">
          GWA Calculator – Free Online General Weighted Average Calculator
        </h2>

        <section className="rounded-2xl border border-academic-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-blue-900">What is a GWA Calculator?</h3>
          <p className="mt-3 leading-relaxed text-academic-700">
            A <strong>GWA Calculator</strong> is an online tool that helps students calculate their{' '}
            <strong>General Weighted Average (GWA)</strong>, representing overall academic performance across
            all subjects. Unlike a simple average, GWA is weighted by the number of units (credit hours) for
            each subject.
          </p>
          <p className="mt-3 text-academic-700">It is widely used to:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-academic-700">
            <li>Determine eligibility for <strong>honors and scholarships</strong></li>
            <li>Track academic performance</li>
            <li>Monitor graduation requirements</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-academic-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-blue-900">How the GWA Calculator Works</h3>
          <p className="mt-3 text-academic-700">The calculator uses this formula:</p>
          <pre className="mt-3 rounded-lg bg-academic-50 p-3 font-mono text-sm text-academic-800">
            GWA = (Σ (Grade × Units)) / (Σ Units)
          </pre>
          <p className="mt-4 font-medium text-academic-700">Step-by-Step Operation:</p>
          <ol className="mt-2 list-decimal space-y-2 pl-6 text-academic-700">
            <li><strong>Add Subjects:</strong> Click <span className="rounded bg-blue-100 px-2 py-0.5">+S</span> for each course.</li>
            <li><strong>Select Field:</strong> Click <span className="rounded bg-blue-200 px-2 py-0.5">Grade</span> or <span className="rounded bg-green-200 px-2 py-0.5">Units</span> to enter data.</li>
            <li><strong>Input Numbers:</strong> Use the calculator-style keypad to enter values.</li>
            <li><strong>Clear/Correct:</strong> Press <span className="rounded bg-red-200 px-2 py-0.5">C</span> to clear the field.</li>
            <li><strong>Calculate GWA:</strong> Press <span className="rounded bg-yellow-200 px-2 py-0.5">=</span>. The result appears on the top screen.</li>
            <li><strong>Remove Subjects:</strong> Click <span className="rounded bg-red-300 px-2 py-0.5">X</span> to delete a subject.</li>
          </ol>
        </section>

        <section className="rounded-2xl border border-academic-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-blue-900">Key Features of This GWA Calculator</h3>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-academic-700">
            <li><strong>Calculator-Style Interface:</strong> Feels like a real TI-84 calculator.</li>
            <li><strong>Dynamic Subjects:</strong> Add or remove subjects easily.</li>
            <li><strong>Grade/Units Toggle:</strong> Switch between grade and units for input.</li>
            <li><strong>Live Result:</strong> Shows GWA instantly on the calculator screen.</li>
            <li><strong>Mobile-Friendly:</strong> Fully responsive for smartphones and tablets.</li>
            <li><strong>Accurate Calculation:</strong> Weighted formula ensures precision for GPA tracking.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-academic-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-blue-900">Tips for Using the GWA Calculator</h3>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-academic-700">
            <li>Always double-check your grades and units for accuracy.</li>
            <li>The lower the GWA, the better the performance (in some grading systems).</li>
            <li>Use this tool to plan academic goals and monitor progress.</li>
            <li>For multiple semesters, calculate each separately and combine results.</li>
          </ul>
        </section>

        <section className="rounded-2xl border border-academic-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-blue-900">Frequently Asked Questions (FAQ)</h3>
          <div className="mt-4 space-y-3">
            {FAQS.map((faq) => (
              <div key={faq.q} className="rounded-lg border border-academic-200 p-3">
                <p className="font-medium text-blue-900">{faq.q}</p>
                <p className="mt-1 text-academic-700">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-academic-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-blue-900">Conclusion</h3>
          <p className="mt-3 leading-relaxed text-academic-700">
            The <strong>StatsSuite GWA Calculator</strong> is a simple, fast, and accurate way for students to
            monitor academic performance. Its calculator-style interface makes it easy to use while providing
            precise results. Ideal for scholarship applications, honors eligibility, and personal tracking.
          </p>
        </section>
      </article>
    </div>
  );
}
